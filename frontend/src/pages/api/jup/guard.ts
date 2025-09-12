import type { NextApiRequest, NextApiResponse } from 'next'

const HERMES = process.env.NEXT_PUBLIC_HERMES ?? 'https://hermes.pyth.network'
const FEEDS = {
  SOL_USD: '<feedId_SOL/USD>',
  USDC_USD: '<feedId_USDC/USD>',
} // ⚠️ Подставь реальные feedId с pyth.network

async function priceUsd(feedId: string) {
  const r = await fetch(`${HERMES}/api/latest_price_feeds?ids[]=${feedId}`, { cache: 'no-store' })
  const [f] = await r.json()
  const p = f.price.price as number
  const expo = f.price.expo as number
  return p * 10 ** expo
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { inAmount, inDecimals, outAmount, outDecimals, thresholdPct = 1 } = req.body

    const implied = (Number(outAmount) / 10 ** outDecimals) / (Number(inAmount) / 10 ** inDecimals)
    const [sol, usdc] = await Promise.all([priceUsd(FEEDS.SOL_USD), priceUsd(FEEDS.USDC_USD)])
    const oracle = sol / usdc
    const diffPct = Math.abs(implied - oracle) / oracle * 100

    res.json({ ok: diffPct <= thresholdPct, implied, oracle, diffPct })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
