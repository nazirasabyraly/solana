// server/swap.ts
import { Router } from 'express'
import { createJupiterApiClient } from '@jup-ag/api'

const jup = createJupiterApiClient({
  basePath: process.env.JUP_BASE || 'https://lite-api.jup.ag',
})

const router = Router()

router.post('/swap', async (req, res) => {
  try {
    const { quoteResponse, userPublicKey, wrapAndUnwrapSol = true } = req.body
    if (!quoteResponse || !userPublicKey) {
      return res.status(400).json({ error: 'missing params' })
    }

    const { swapTransaction } = await jup.swapPost({
      swapRequest: {
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol,
        dynamicComputeUnitLimit: true,
        useSharedAccounts: true,
        // prioritizationFeeLamports опционален — можно не указывать
      },
    })

    return res.json({ swapTransaction })
  } catch (e:any) {
    return res.status(500).json({ error: e.message || 'swap error' })
  }
})

export default router
