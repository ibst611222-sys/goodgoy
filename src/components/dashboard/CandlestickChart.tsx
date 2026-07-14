'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getHistoricalData } from '@/lib/fmp-client'

// === Types ===
interface OHLCData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  vwap?: number
}

// === Generate simulated OHLC when no API key ===
function generateOHLC(basePrice: number, days: number, volatility: number): OHLCData[] {
  const data: OHLCData[] = []
  const d = new Date()
  d.setDate(d.getDate() - days)
  let price = basePrice * (1 - volatility * 1.5)
  for (let i = 0; i < days; i++) {
    const dateStr = d.toISOString().slice(0, 10)
    const open = price
    const change = (Math.random() - 0.48) * price * volatility
    const close = Math.max(open + change, open * 0.5)
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
    const volume = Math.floor(Math.random() * 10000000) + 2000000
    const vwap = (high + low + close) / 3
    data.push({ date: dateStr, open, high, low, close, volume, vwap })
    price = close + (Math.random() - 0.5) * price * volatility * 0.3
    d.setDate(d.getDate() + 1)
  }
  return data
}

function calculateVWAP(data: OHLCData[]): number[] {
  return data.map(d => d.vwap !== undefined ? d.vwap : (d.high + d.low + d.close) / 3)
}

// === SMA & Bollinger Bands ===
function calcSMA(data: OHLCData[], period: number): (number | null)[] {
  return data.map((_, i) => {
    if (i < period - 1) return null
    let sum = 0
    for (let j = 0; j < period; j++) sum += data[i - j].close
    return sum / period
  })
}

function calcBollingerBands(data: OHLCData[], period = 20, multiplier = 2): { middle: (number | null)[]; upper: (number | null)[]; lower: (number | null)[] } {
  const middle = calcSMA(data, period)
  const upper: (number | null)[] = []
  const lower: (number | null)[] = []
  for (let i = 0; i < data.length; i++) {
    if (middle[i] === null) { upper.push(null); lower.push(null); continue }
    let sumSq = 0
    for (let j = 0; j < period; j++) sumSq += Math.pow(data[i - j].close - middle[i]!, 2)
    const std = Math.sqrt(sumSq / period)
    upper.push(middle[i]! + multiplier * std)
    lower.push(middle[i]! - multiplier * std)
  }
  return { middle, upper, lower }
}

// === Props ===
interface CandlestickChartProps {
  symbol: string
  basePrice: number
  className?: string
  simulatedOnly?: boolean
}

export function CandlestickChart({ symbol, basePrice, className, simulatedOnly }: CandlestickChartProps) {
  const [rawData, setRawData] = useState<OHLCData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState(90)
  const [dataSource, setDataSource] = useState<'live' | 'simulated'>('simulated')
  const [fullscreen, setFullscreen] = useState(false)
  const [showSMA20, setShowSMA20] = useState(true)
  const [showSMA50, setShowSMA50] = useState(false)
  const [showBollinger, setShowBollinger] = useState(true)

  // Fetch data
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      if (!simulatedOnly) {
        try {
          const historical = await getHistoricalData(symbol)
          if (!cancelled && historical.length > 10) {
            const sorted = historical.map(d => ({
              date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume,
              vwap: d.vwap || (d.high + d.low + d.close) / 3,
            })).reverse()
            setRawData(sorted)
            setDataSource('live')
            setLoading(false)
            return
          }
        } catch { /* fall through */ }
      }
      if (!cancelled) { setRawData(generateOHLC(basePrice, 90, 0.03)); setDataSource('simulated'); setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [symbol, basePrice, simulatedOnly])

  // Memoize derived data
  const { allData, vwapValues, sma20, sma50, bb } = useMemo(() => {
    if (!rawData) return { allData: [] as OHLCData[], vwapValues: [] as number[], sma20: [], sma50: [], bb: { middle: [], upper: [], lower: [] } }
    return {
      allData: rawData,
      vwapValues: calculateVWAP(rawData),
      sma20: calcSMA(rawData, 20),
      sma50: calcSMA(rawData, 50),
      bb: calcBollingerBands(rawData, 20, 2),
    }
  }, [rawData])

  const data = allData.slice(-zoom)
  const vwapSlice = vwapValues.slice(-zoom)
  const sma20Slice = sma20.slice(-zoom)
  const sma50Slice = sma50.slice(-zoom)
  const bbUpper = bb.upper.slice(-zoom)
  const bbLower = bb.lower.slice(-zoom)

  // Chart dimensions
  const width = fullscreen ? 1000 : 580
  const height = fullscreen ? 600 : 380
  const padding = { top: 20, right: 60, bottom: 65, left: 55 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const volumeAreaBottom = 42

  if (loading || data.length === 0) {
    return <div className={cn('glass rounded-xl p-4 border border-surface-border/30 flex items-center justify-center h-[300px]', className)}>
      <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono">
        <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />Loading {symbol} chart data...
      </div>
    </div>
  }

  // Gather all y-values for range
  const allYValues = [...data.flatMap(d => [d.high, d.low]), ...vwapSlice]
  if (showBollinger) { allYValues.push(...bbUpper.filter(v => v !== null) as number[], ...bbLower.filter(v => v !== null) as number[]) }
  if (showSMA20) { allYValues.push(...sma20Slice.filter(v => v !== null) as number[]) }
  if (showSMA50) { allYValues.push(...sma50Slice.filter(v => v !== null) as number[]) }

  const high = Math.max(...allYValues)
  const low = Math.min(...allYValues)
  const range = high - low || 1
  const pad = range * 0.08
  const yMin = low - pad
  const yMax = high + pad
  const vMax = Math.max(...data.map(d => d.volume))

  const candleWidth = Math.max(3, chartW / data.length - 2)
  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (v: number) => padding.top + chartH - ((v - yMin) / (yMax - yMin)) * (chartH - volumeAreaBottom) - volumeAreaBottom
  const getVH = (v: number) => (v / vMax) * volumeAreaBottom

  // Build SVG path from values, handling null gaps
  function makePath(values: (number | null)[]): string {
    let path = '', started = false
    for (let i = 0; i < values.length; i++) {
      if (values[i] === null) { started = false; continue }
      const x = getX(i), y = getY(values[i]!)
      if (!started) { path += `M${x},${y}`; started = true }
      else path += `L${x},${y}`
    }
    return path
  }

  const vwapPath = makePath(vwapSlice)
  const sma20Path = makePath(sma20Slice)
  const sma50Path = makePath(sma50Slice)
  const bbUpperPath = makePath(bbUpper)
  const bbLowerPath = makePath(bbLower)

  // Build Bollinger fill
  const bbFillPath = (() => {
    const upperPoints: string[] = []
    const lowerPoints: string[] = []
    let started = false
    for (let i = 0; i < bbUpper.length; i++) {
      if (bbUpper[i] === null || bbLower[i] === null) { started = false; continue }
      const x = getX(i)
      if (!started) {
        upperPoints.push(`M${x},${getY(bbUpper[i]!)}`)
        lowerPoints.push(`M${x},${getY(bbLower[i]!)}`)
        started = true
      } else {
        upperPoints.push(`L${x},${getY(bbUpper[i]!)}`)
        lowerPoints.unshift(`L${x},${getY(bbLower[i]!)}`)
      }
    }
    return [...upperPoints, ...lowerPoints].join(' ')
  })()

  const yTicks = 5
  const yTickStep = (yMax - yMin) / yTicks

  return (
    <div className={cn(
      'glass rounded-xl p-4 border border-surface-border/30 transition-all duration-300',
      fullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : '',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">{symbol} — Candlestick</span>
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${dataSource === 'live' ? 'text-neon-green bg-neon-green/10 border-neon-green/20' : 'text-neon-amber bg-neon-amber/10 border-neon-amber/20'}`}>
            {dataSource === 'live' ? 'FMP' : 'SIM'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle overlays */}
          <div className="flex items-center gap-1 mr-2">
            <button onClick={() => setShowBollinger(!showBollinger)} className={cn('px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors', showBollinger ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'text-white/20')}>BB</button>
            <button onClick={() => setShowSMA20(!showSMA20)} className={cn('px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors', showSMA20 ? 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20' : 'text-white/20')}>SMA20</button>
            <button onClick={() => setShowSMA50(!showSMA50)} className={cn('px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors', showSMA50 ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20' : 'text-white/20')}>SMA50</button>
          </div>
          <div className="flex items-center gap-1">
            {[{ label: '1M', days: 21 }, { label: '3M', days: 63 }, { label: '6M', days: 126 }, { label: 'All', days: 999 }].map(p => (
              <button key={p.label} onClick={() => setZoom(p.days)} className={cn('px-2 py-0.5 rounded text-[9px] font-mono transition-colors', zoom === p.days ? 'bg-cosmic-600/20 text-neon-cyan border border-cosmic-500/30' : 'text-white/30 hover:text-white/50')}>{p.label}</button>
            ))}
          </div>
          <button onClick={() => setFullscreen(!fullscreen)} className="px-1.5 py-0.5 rounded text-[9px] font-mono text-white/30 hover:text-white/60 transition-colors">
            {fullscreen ? '✕' : '⛶'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = padding.top + ((chartH - volumeAreaBottom) / yTicks) * i
          return <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" className="text-[8px] fill-white/20 font-mono">${(yMax - yTickStep * i).toFixed(0)}</text>
          </g>
        })}

        {/* X-axis dates */}
        {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0).map((d) => {
          const idx = data.indexOf(d)
          return <text key={idx} x={getX(idx)} y={height - padding.bottom + 15} textAnchor="middle" className="text-[7px] fill-white/20 font-mono">{d.date.slice(5)}</text>
        })}

        {/* Bollinger Bands fill */}
        {showBollinger && bbFillPath && <path d={bbFillPath} fill="rgba(168,85,247,0.05)" />}
        {showBollinger && bbUpperPath && <path d={bbUpperPath} fill="none" stroke="#a855f7" strokeWidth={0.5} opacity={0.3} />}
        {showBollinger && bbLowerPath && <path d={bbLowerPath} fill="none" stroke="#a855f7" strokeWidth={0.5} opacity={0.3} />}
        {showBollinger && <text x={width - padding.right} y={padding.top + 8} textAnchor="end" className="text-[6px] fill-neon-purple/30 font-mono">BB(20,2)</text>}

        {/* SMA lines */}
        {showSMA20 && sma20Path && <path d={sma20Path} fill="none" stroke="#f59e0b" strokeWidth={1.2} opacity={0.6} />}
        {showSMA20 && <text x={width - padding.right} y={padding.top + 18} textAnchor="end" className="text-[6px] fill-neon-amber/40 font-mono">SMA20</text>}
        {showSMA50 && sma50Path && <path d={sma50Path} fill="none" stroke="#a855f7" strokeWidth={1.2} opacity={0.6} strokeDasharray="4,3" />}
        {showSMA50 && <text x={width - padding.right} y={padding.top + 28} textAnchor="end" className="text-[6px] fill-neon-purple/40 font-mono">SMA50</text>}

        {/* VWAP line */}
        {vwapPath && <path d={vwapPath} fill="none" stroke="#a855f7" strokeWidth={1} opacity={0.4} strokeDasharray="4,3" />}
        <text x={width - padding.right} y={getY(vwapSlice[vwapSlice.length - 1]) - 4} textAnchor="end" className="text-[6px] fill-neon-purple/30 font-mono">VWAP</text>

        {/* Candlesticks */}
        {data.map((d, i) => {
          const x = getX(i)
          const isUp = d.close >= d.open
          const color = isUp ? '#00ff88' : '#ff2d95'
          const bodyTop = getY(Math.max(d.open, d.close))
          const bodyBottom = getY(Math.min(d.open, d.close))
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1)
          const wickTop = getY(d.high)
          const wickBottom = getY(d.low)
          const isHovered = hoverIndex === i
          return <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} className="cursor-pointer">
            <line x1={x} y1={wickTop} x2={x} y2={wickBottom} stroke={color} strokeWidth={isHovered ? 1.5 : 1} opacity={0.6} />
            <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} opacity={isHovered ? 1 : 0.85} rx={1} />
            <rect x={x - candleWidth / 2} y={height - padding.bottom - getVH(d.volume) + 12} width={candleWidth} height={getVH(d.volume)} fill={color} opacity={0.15} rx={1} />
            {isHovered && <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="3,2" />}
          </g>
        })}

        <text x={padding.left} y={height - 5} className="text-[7px] fill-white/15 font-mono">Volume</text>
      </svg>

      {/* Hover tooltip */}
      {hoverIndex !== null && data[hoverIndex] && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 grid grid-cols-7 gap-1 text-[8px] font-mono bg-surface-elevated rounded-lg p-2 border border-surface-border/30">
          <div><div className="text-white/30">Date</div><div className="text-white/80">{data[hoverIndex].date}</div></div>
          <div><div className="text-white/30">O</div><div className="text-white/80">${data[hoverIndex].open.toFixed(2)}</div></div>
          <div><div className="text-white/30">H</div><div className="text-white/80">${data[hoverIndex].high.toFixed(2)}</div></div>
          <div><div className="text-white/30">L</div><div className="text-white/80">${data[hoverIndex].low.toFixed(2)}</div></div>
          <div><div className="text-white/30">C</div><div className={data[hoverIndex].close >= data[hoverIndex].open ? 'text-neon-green' : 'text-neon-pink'}>${data[hoverIndex].close.toFixed(2)}</div></div>
          <div><div className="text-white/30">VWAP</div><div className="text-neon-purple">${(vwapValues[hoverIndex] || 0).toFixed(2)}</div></div>
          <div><div className="text-white/30">Vol</div><div className="text-white/80">{(data[hoverIndex].volume / 1e6).toFixed(1)}M</div></div>
        </motion.div>
      )}
    </div>
  )
}
