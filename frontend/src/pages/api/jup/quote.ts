// server/quote.ts
import { Router } from 'express'
import { createJupiterApiClient } from '@jup-ag/api'

const jup = createJupiterApiClient({
  basePath: process.env.JUP_BASE || 'https://lite-api.jup.ag',
})

const router = Router()

router.get('/quote', async (req, res) => {
  try {
    const { inputMint, outputMint, amount, slippageBps = '50', onlyDirectRoutes } = req.query
    if (!inputMint || !outputMint || !amount) {
      return res.status(400).json({ error: 'missing params' })
    }

    const resp = await jup.quoteGet({
      inputMint: String(inputMint),
      outputMint: String(outputMint),
      amount: Number(amount),              // number!
      slippageBps: Number(slippageBps),
      onlyDirectRoutes: String(onlyDirectRoutes) === 'true',
    }) as any

    const best = resp?.data?.[0]
    if (!best) return res.status(404).json({ error: 'no route' })
    return res.json(best) // <-- frontend ждёт именно объект QuoteResponse
  } catch (e:any) {
    return res.status(500).json({ error: e.message || 'quote error' })
  }
})

export default router
