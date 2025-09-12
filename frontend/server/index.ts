import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const JUP = process.env.JUP_BASE ?? 'https://quote-api.jup.ag/v6'
const HERMES = process.env.HERMES ?? 'https://hermes.pyth.network'

// GET /api/jup/quote?inputMint=...&outputMint=...&amount=...&slippageBps=50
app.get('/api/jup/quote', async (req, res) => {
  try {
    const url = new URL(`${JUP}/quote`)
    Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    const r = await fetch(url.toString(), { headers: { accept: 'application/json' } })
    const text = await r.text()
    res.status(r.status).type('application/json').send(text)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/jup/swap
app.post('/api/jup/swap', async (req, res) => {
  try {
    const r = await fetch(`${JUP}/swap`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...req.body,
        dynamicSlippage: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: { priorityLevel: 'high', maxLamports: 500_000 },
        },
      }),
    })
    const text = await r.text()
    res.status(r.status).type('application/json').send(text)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/guard
app.post('/api/guard', async (req, res) => {
  try {
    const FEEDS = { SOL_USD: '<SOL/USD_FEED_ID>', USDC_USD: '<USDC/USD_FEED_ID>' }
    const priceUsd = async (id: string) => {
      const r = await fetch(`${HERMES}/api/latest_price_feeds?ids[]=${id}`, { cache: 'no-store' })
      const [f] = await r.json()
      const p = f.price.price as number, expo = f.price.expo as number
      return p * 10 ** expo
    }

    const { inAmount, inDecimals, outAmount, outDecimals, thresholdPct = 1 } = req.body
    const implied = (Number(outAmount) / 10 ** outDecimals) / (Number(inAmount) / 10 ** inDecimals)
    const [sol, usdc] = await Promise.all([priceUsd(FEEDS.SOL_USD), priceUsd(FEEDS.USDC_USD)])
    const oracle = sol / usdc
    const diffPct = Math.abs(implied - oracle) / oracle * 100
    res.json({ ok: diffPct <= thresholdPct, implied, oracle, diffPct })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT ?? 8787
app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`))
