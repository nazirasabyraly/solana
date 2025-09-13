// server/index.ts
import express from 'express'
import cors from 'cors'

import pythRouter from './pyth.ts'
import { historyRouter } from './history.ts'

// Если у тебя Node < 18, раскомментируй это и поставь пакет:
// import fetch from 'cross-fetch'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/pyth', pythRouter) 
app.use('/api/pyth', historyRouter)

// ───────────────────────────────────────────────────────────────────────────────
// ENV (server side)
const JUP = process.env.JUP_BASE   ?? 'https://quote-api.jup.ag/v6'
const HERMES = process.env.HERMES  ?? 'https://hermes.pyth.network'
const SOL_FEED = process.env.SOL_USD_FEED   // пример: 0xef0d8b6f...
const USDC_FEED = process.env.USDC_USD_FEED // пример: 0xeaa020c6...

// Health
app.get('/', (_req, res) => res.send('API OK'))
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ───────────────────────────────────────────────────────────────────────────────
// Jupiter QUOTE proxy
// GET /api/jup/quote?inputMint=...&outputMint=...&amount=...&slippageBps=50&onlyDirectRoutes=true
app.get('/api/jup/quote', async (req, res) => {
  try {
    const url = new URL(`${JUP}/quote`)
    for (const [k, v] of Object.entries(req.query)) {
      if (v != null) url.searchParams.set(k, String(v))
    }
    const r = await fetch(url.toString(), { headers: { accept: 'application/json' } })
    if (!r.ok) {
      const text = await r.text()
      return res.status(r.status).type('application/json').send(text || JSON.stringify({ error: 'quote error' }))
    }

    // Можно отдать как есть, но удобнее вернуть сразу лучший маршрут (data[0])
    const json = await r.json()
    const best = json?.data?.[0] ?? json
    return res.json(best)
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'quote proxy error' })
  }
})

// ───────────────────────────────────────────────────────────────────────────────
// Jupiter SWAP proxy
// POST /api/jup/swap  body: { quoteResponse, userPublicKey, wrapAndUnwrapSol? }
app.post('/api/jup/swap', async (req, res) => {
  try {
    const body = {
      ...req.body,
      wrapAndUnwrapSol: req.body?.wrapAndUnwrapSol ?? true,
      useSharedAccounts: true,
      dynamicComputeUnitLimit: true,
      // prioritizationFeeLamports — опционален. Если нужно — можно включить:
      // prioritizationFeeLamports: { priorityLevelWithMaxLamports: { priorityLevel: 'high', maxLamports: 500_000 } },
    }
    const r = await fetch(`${JUP}/swap`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await r.text()
    return res.status(r.status).type('application/json').send(text)
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'swap proxy error' })
  }
})

// ───────────────────────────────────────────────────────────────────────────────
// Pyth guard (сверка цены с оракулом)
// POST /api/guard  body: { inAmount, inDecimals, outAmount, outDecimals, thresholdPct? }
app.post('/api/guard', async (req, res) => {
  try {
    if (!SOL_FEED || !USDC_FEED) {
      return res.status(400).json({ error: 'SOL_USD_FEED / USDC_USD_FEED env not set' })
    }

    // Hermes v2: стабильно и документировано
    const latest = async (id: string) => {
      const url = `${HERMES}/v2/updates/price/latest?ids[]=${id}`
      const r = await fetch(url, { cache: 'no-store' })
      if (!r.ok) throw new Error(`pyth ${r.status}`)
      const j = await r.json()
      // берём первую распарсенную цену
      const p = j.parsed?.[0]?.price
      if (!p) throw new Error('no price')
      // price * 10^expo = реальная цена
      const price = Number(p.price)
      const expo  = Number(p.expo) // обычно отрицательный
      return price * 10 ** expo
    }

    const { inAmount, inDecimals, outAmount, outDecimals, thresholdPct = 1 } = req.body
    if ([inAmount, inDecimals, outAmount, outDecimals].some(v => v == null)) {
      return res.status(400).json({ error: 'missing params' })
    }

    // implied: out / in из котировки
    const implied = (Number(outAmount) / 10 ** Number(outDecimals)) / (Number(inAmount) / 10 ** Number(inDecimals))

    // oracle: SOL/USD / USDC/USD
    const [solUsd, usdcUsd] = await Promise.all([latest(SOL_FEED), latest(USDC_FEED)])
    const oracle = solUsd / usdcUsd

    const diffPct = Math.abs(implied - oracle) / oracle * 100
    return res.json({ ok: diffPct <= Number(thresholdPct), implied, oracle, diffPct })
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'guard error' })
  }
})

// ───────────────────────────────────────────────────────────────────────────────
// (Опционально) отдельный Pyth price endpoint для Pro Trade графика
app.get('/api/pyth/price', async (req, res) => {
  try {
    const feed = String(req.query.feed ?? '')
    if (!feed) return res.status(400).json({ error: 'feed required' })
    const url = `${HERMES}/v2/updates/price/latest?ids[]=${feed}`
    const r = await fetch(url, { cache: 'no-store' })
    if (!r.ok) throw new Error(`pyth ${r.status}`)
    const j = await r.json()
    const p = j.parsed?.[0]?.price
    return res.json(p || null) // { price, conf, expo }
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'pyth price error' })
  }
})

// ───────────────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 8787)
app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`))
