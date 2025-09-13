// server/history.ts
import { Router } from 'express'
export const historyRouter = Router()

const HERMES = process.env.HERMES || 'https://hermes.pyth.network'

// price * 10^expo → число
function norm(priceObj: any) {
  if (!priceObj) return undefined
  const price = Number(priceObj.price)
  const expo  = Number(priceObj.expo || 0)
  if (!Number.isFinite(price) || !Number.isFinite(expo)) return undefined
  return price * Math.pow(10, expo)
}

// GET /api/pyth/history?feed=<id>&from=<sec>&to=<sec>&res=<sec>
historyRouter.get('/history', async (req, res) => {
  try {
    const feed = String(req.query.feed || '')
    let from = Number(req.query.from || 0)
    let to   = Number(req.query.to   || 0)
    const reso = Math.max(5, Number(req.query.res || 10)) // шаг сек

    if (!feed) return res.status(400).json({ error: 'feed required' })

    // по умолчанию: последние 15 минут
    const now = Math.floor(Date.now() / 1000)
    if (!from || !to || to <= from) { to = now; from = now - 15 * 60 }

    // ограничим число запросов
    const MAX_SAMPLES = 300
    const span = to - from
    const step = Math.max(reso, Math.ceil(span / MAX_SAMPLES), 10) // минимум 10с
    const NEAR = 15 // искать публикации в окне ±15с

    const tryFetchAt = async (ts: number) => {
      // ⬅⬅⬅ ВАЖНО: parsed=true, тогда появляется j.parsed[0].price
      const url = `${HERMES}/v2/updates/price/${ts}?ids[]=${feed}&parsed=true`
      const r = await fetch(url)
      if (!r.ok) return undefined
      const j = await r.json()
      const p = j?.parsed?.[0]?.price
      return norm(p)
    }

    const tryLatest = async () => {
      const url = `${HERMES}/v2/updates/price/latest?ids[]=${feed}&parsed=true`
      const r = await fetch(url)
      if (!r.ok) return undefined
      const j = await r.json()
      const p = j?.parsed?.[0]?.price
      return norm(p)
    }

    const out: { time:number; value:number }[] = []

    for (let t = from; t <= to; t += step) {
      let val = await tryFetchAt(t)
      if (val == null) {
        // поиск вокруг t: t-1, t+1, ...
        for (let d = 1; d <= NEAR && val == null; d++) {
          val = await tryFetchAt(t - d) ?? await tryFetchAt(t + d)
        }
      }
      if (val == null) {
        // крайний фолбэк: возьмём latest, чтобы не было пустоты
        val = await tryLatest()
      }
      if (val != null) out.push({ time: t, value: val })
    }

    res.json(out)
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'history error' })
  }
})
