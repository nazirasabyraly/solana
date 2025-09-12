import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const base = process.env.NEXT_PUBLIC_JUP_BASE ?? 'https://quote-api.jup.ag/v6'
    const url = new URL(`${base}/quote`)
    Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, String(v)))

    const r = await fetch(url.toString(), { headers: { accept: 'application/json' } })
    const text = await r.text()
    res.status(r.status).setHeader('content-type', 'application/json').send(text)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
