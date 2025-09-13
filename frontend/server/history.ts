// server/history.ts
import { Router } from 'express'
export const historyRouter = Router()

const HERMES = process.env.HERMES || 'https://hermes.pyth.network'

// нормализация цены Pyth: price * 10^expo
function norm(p: any) {
  if (!p) return undefined
  const price = Number(p.price)
  const expo  = Number(p.expo || 0)
  if (!Number.isFinite(price) || !Number.isFinite(expo)) return undefined
  return price * Math.pow(10, expo)
}

// GET /api/pyth/history?feed=<id>&from=<sec>&to=<sec>&res=<sec>
historyRouter.get('/history', async (req, res) => {
  try {
    const feed = String(req.query.feed || '')
    let from = Number(req.query.from || 0)
    let to   = Number(req.query.to   || 0)
    const reso = Math.max(5, Number(req.query.res || 10)) // шаг, сек

    if (!feed) return res.status(400).json({ error: 'feed required' })

    // по умолчанию — последние 15 минут
    const now = Math.floor(Date.now() / 1000)
    if (!from || !to || to <= from) {
      to   = now
      from = now - 15 * 60
    }

    // чтобы не улетать в тысячи запросов
    const MAX_SAMPLES = 300
    const span = to - from
    const step = Math.max(reso, Math.ceil(span / MAX_SAMPLES), 10) // минимум 10с

    // при поиске на каждой точке возьмём ближайший апдейт в окне [-10..+10] сек
    const NEAR = 10
    const out: { time:number; value:number }[] = []

    for (let t = from; t <= to; t += step) {
      let val: number | undefined
      // сначала попробуем точно в t
      const tryFetch = async (ts: number) => {
        const url = `${HERMES}/v2/updates/price/${ts}?ids[]=${feed}&encoding=json`
        const r = await fetch(url)
        if (!r.ok) return undefined
        const j = await r.json()
        const item = j?.parsed?.[0]?.price ?? j?.prices?.[0] ?? j?.[0]?.price ?? j?.price
        return norm(item)
      }

      val = await tryFetch(t)
      if (val == null) {
        // поиск рядом: t-1, t+1, t-2, t+2, ...
        for (let d = 1; d <= NEAR && val == null; d++) {
          val = await tryFetch(t - d)
          if (val == null) val = await tryFetch(t + d)
        }
      }
      if (val != null) out.push({ time: t, value: val })
    }

    res.json(out)
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'history error' })
  }
})
