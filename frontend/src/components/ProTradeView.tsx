import { useEffect, useMemo, useRef, useState } from 'react'
import { usePythPrice } from '../hooks/usePythPrice'

declare global { interface Window { __pushQuotePoint?: (v:number)=>void } }
type Point = { time:number; value:number }
type ChartApi = any; type SeriesApi = any

export default function ProTradeView(props:{
  baseSymbol:string; quoteSymbol:string;
  baseUsdFeed?:string; quoteUsdFeed?:string;
  lastExecutedPrice?:number;
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ChartApi|null>(null)
  const lineRef  = useRef<SeriesApi|null>(null)
  const fairRef  = useRef<SeriesApi|null>(null)
  const [err, setErr] = useState<string|null>(null)
  const [seriesData, setSeriesData] = useState<Point[]>([])
  const [lastRoute, setLastRoute]   = useState<number>()
  const [range, setRange] = useState<'15m'|'1h'|'4h'|'1d'|'7d'>('15m')

  // live fair из Pyth
  const baseUsd = usePythPrice(props.baseUsdFeed)
  const quoteUsd = usePythPrice(props.quoteUsdFeed)
  const fairLive = useMemo(() => {
    if (!baseUsd?.price || !quoteUsd?.price) return undefined
    const base = baseUsd.price * Math.pow(10, baseUsd.expo ?? 0)
    const quote = quoteUsd.price * Math.pow(10, quoteUsd.expo ?? 0)
    if (!quote) return undefined
    return base / quote
  }, [baseUsd, quoteUsd])

  // init chart (адаптивный импорт под любую версию)
  useEffect(() => {
    let ro: ResizeObserver | null = null, cancelled = false
    ;(async () => {
      try {
        if (!containerRef.current) return
        const mod: any = await import('lightweight-charts')
        if (cancelled || !containerRef.current) return
        const M = mod?.createChart ? mod : (mod?.default || mod)
        const createChart = M.createChart
        const LineStyle   = M.LineStyle || M.enums?.LineStyle
        const ColorType   = M.ColorType || M.enums?.ColorType
        const chart = createChart(containerRef.current, {
          layout: { background: { type: ColorType?.Solid ?? 0, color: 'transparent' }, textColor: '#cbd5e1' },
          grid:   { vertLines: { color:'#111827' }, horzLines: { color:'#111827' } },
          rightPriceScale: { borderVisible: false },
          timeScale:       { borderVisible: false },
          width: containerRef.current.clientWidth || 600, height: 300,
        })
        const addLine = chart.addLineSeries || chart.addSeries
        const line = addLine.call(chart, { color:'#60a5fa', lineWidth:2 })
        const fair = addLine.call(chart, { color:'#22c55e', lineWidth:1, lineStyle: LineStyle?.Dotted ?? 1 })
        chartRef.current = chart; lineRef.current = line; fairRef.current = fair

        if (seriesData.length) line.setData(seriesData)

        ro = new ResizeObserver(() => chart.applyOptions({ width: containerRef.current!.clientWidth, height: 300 }))
        ro.observe(containerRef.current)
      } catch (e:any) { setErr(e?.message || 'chart init error') }
    })()
    return () => { ro?.disconnect(); chartRef.current?.remove(); chartRef.current=null; lineRef.current=null; fairRef.current=null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // загрузка ИСТОРИИ fair по диапазону (base/USD и quote/USD → base/quote)
  function rangeToWindow(now:number) {
    const m=60, h=3600, d=86400
    switch (range) {
      case '15m': return { from: now-15*m, to: now, res: 5 }
      case '1h':  return { from: now-1*h , to: now, res: 30 }
      case '4h':  return { from: now-4*h , to: now, res: 60 }
      case '1d':  return { from: now-1*d , to: now, res: 300 }
      case '7d':  return { from: now-7*d , to: now, res: 900 }
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (!props.baseUsdFeed || !props.quoteUsdFeed || !fairRef.current) return
        const now = Math.floor(Date.now()/1000)
        const { from, to, res } = rangeToWindow(now)!
        const fetchHist = (feed:string) =>
          fetch(`/api/pyth/history?feed=${feed}&from=${from}&to=${to}&res=${res}`).then(r=>r.json()) as Promise<Point[]>

        const [b, q] = await Promise.all([fetchHist(props.baseUsdFeed), fetchHist(props.quoteUsdFeed)])
        const mapQ = new Map(q.map(p=>[p.time, p.value]))
        const merged = b
          .filter(p => mapQ.has(p.time))
          .map(p => ({ time: p.time, value: p.value / (mapQ.get(p.time) as number) }))
          .sort((a,b)=>a.time-b.time)

        fairRef.current.setData(merged)
        // подложим базовую сетку, чтобы ось была адекватной
        setSeriesData(merged) // ось и масштаб
      } catch (e) {
        console.warn('history load failed', e)
      }
    })()
  }, [props.baseUsdFeed, props.quoteUsdFeed, range])

  // публичный пушер для live route
  useEffect(() => {
    const push = (v:number) => {
      const p = { time: Math.floor(Date.now()/1000), value: v }
      setLastRoute(v)
      setSeriesData(prev => {
        const next = [...prev, p].slice(-240)
        lineRef.current?.setData(next)
        if (fairRef.current && fairLive) {
          const t0 = next[0]?.time ?? p.time-600
          fairRef.current.setData([{ time:t0, value: fairLive }, { time: p.time, value: fairLive }])
        }
        return next
      })
    }
    if (typeof window !== 'undefined') window.__pushQuotePoint = push
    return () => { if (typeof window !== 'undefined') delete window.__pushQuotePoint }
  }, [fairLive])

  // маркер сделки
  useEffect(() => {
    if (!lineRef.current || !props.lastExecutedPrice) return
    const t = Math.floor(Date.now()/1000)
    if (typeof lineRef.current.setMarkers === 'function') {
      lineRef.current.setMarkers([{ time:t, position:'aboveBar', color:'#f59e0b', shape:'circle', text:'Swap' }])
    }
  }, [props.lastExecutedPrice])

  // метрики
  const { currentRoute, bps } = useMemo(() => {
    const v = seriesData.length ? seriesData[seriesData.length-1].value : lastRoute
    if (!v || !fairLive) return { currentRoute:v, bps: undefined as number|undefined }
    const diff = (v / fairLive - 1) * 10_000
    return { currentRoute: v, bps: diff }
  }, [seriesData, fairLive, lastRoute])

  const bpsColor =
    bps == null ? 'text-slate-400'
      : Math.abs(bps) <= 20 ? 'text-emerald-400'
      : Math.abs(bps) <= 80 ? 'text-amber-400'
      : 'text-rose-400'

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="flex items-center justify-between mb-2 text-sm text-slate-300">
        <div>
          {props.baseSymbol}/{props.quoteSymbol} —
          <span className="text-sky-300"> blue</span>: route •
          <span className="text-emerald-400"> green</span>: Pyth fair
        </div>
        <div className="flex items-center gap-2">
          {(['15m','1h','4h','1d','7d'] as const).map(r => (
            <button key={r} onClick={()=>setRange(r)}
              className={`px-2 py-0.5 rounded text-xs ${range===r?'bg-white/10':'hover:bg-white/5'}`}>{r}</button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-slate-400">Fair:&nbsp;{fairLive ? fairLive.toFixed(6) : '—'}</div>
          <div>Route:&nbsp;{currentRoute ? currentRoute.toFixed(6) : '—'}</div>
          <div className={bpsColor}>Δ:&nbsp;{bps != null ? `${bps.toFixed(1)} bps` : '—'}</div>
        </div>
      </div>
      {err ? (
        <div className="h-[300px] grid place-items-center text-rose-300">Chart error: {err}</div>
      ) : (
        <div ref={containerRef} style={{ height: 300, width: '100%' }} />
      )}
    </div>
  )
}
