import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const base = process.env.NEXT_PUBLIC_JUP_BASE ?? 'https://quote-api.jup.ag/v6'
    const r = await fetch(`${base}/swap`, {
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
    res.status(r.status).setHeader('content-type', 'application/json').send(text)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
