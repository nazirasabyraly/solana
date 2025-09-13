import { Router } from 'express'
const HERMES = process.env.HERMES || 'https://hermes.pyth.network'
const router = Router()

// /api/pyth/price?feed=<hex feed id>
router.get('/price', async (req, res) => {
  try {
    const feed = String(req.query.feed || '')
    if (!feed) return res.status(400).json({ error: 'feed required' })
    const url = `${HERMES}/v2/updates/price/latest?ids[]=${feed}`
    const r = await fetch(url)
    if (!r.ok) throw new Error(`pyth ${r.status}`)
    const j = await r.json()
    // берём первую цену из ответа
    const p = j.parsed?.[0]?.price ?? j.price ?? null
    // нормализуем: { price, conf, expo }
    const { price, conf, expo } = p || {}
    res.json({ price, conf, expo })
  } catch (e:any) {
    res.status(500).json({ error: e.message || 'pyth error' })
  }
})
export default router
