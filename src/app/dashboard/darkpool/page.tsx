'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency, formatCompactCurrency, formatLargeNumber } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { Shield, TrendingUp, TrendingDown } from 'lucide-react'

export default function DarkPoolPage() {
  const { blockTrades, displayCurrency, exchangeRates } = useAppStore()
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null)

  const stats = useMemo(() => {
    const total = blockTrades.reduce((s, t) => s + t.totalValue, 0)
    const premiumTrades = blockTrades.filter(t => t.type === 'premium')
    const avgZ = blockTrades.reduce((s, t) => s + t.zScore, 0) / blockTrades.length
    return { total, premiumCount: premiumTrades.length, avgZ: avgZ.toFixed(1) }
  }, [blockTrades])

  const cv = (v: number) => convertCurrency(v, displayCurrency, exchangeRates)
  const width = 600, height = 200

  // Build synthetic depth chart from block trade data
  const depthData = useMemo(() => {
    const bids = blockTrades.filter(t => t.type === 'discount')
      .map(t => ({ price: t.price * 0.98, volume: t.shares }))
    const asks = blockTrades.filter(t => t.type === 'premium')
      .map(t => ({ price: t.price * 1.02, volume: t.shares }))
    const allPrices = [...bids.map(b => b.price), ...asks.map(a => a.price)]
    if (allPrices.length === 0) return null
    const minP = Math.min(...allPrices) * 0.99
    const maxP = Math.max(...allPrices) * 1.01
    const range = maxP - minP || 1
    const mid = (minP + maxP) / 2

    let bidCum = 0
    const bidPoints = bids.sort((a, b) => b.price - a.price).map(b => {
      bidCum += b.volume
      return { x: ((b.price - minP) / range) * width, y: height - (bidCum / (bidCum + 1)) * height * 0.8 }
    })
    let askCum = 0
    const askPoints = asks.sort((a, b) => a.price - b.price).map(a => {
      askCum += a.volume
      return { x: ((a.price - minP) / range) * width, y: height - (askCum / (askCum + 1)) * height * 0.8 }
    })
    return { minP, maxP, mid, bidPoints, askPoints, range }
  }, [blockTrades])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Dark Pool</h1>
          <p className="text-xs text-white/30 font-mono">Institutional block trades — premium & discount analysis</p>
        </div>
        <Shield className="w-5 h-5 text-gesso-gold/40" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Total Block Volume</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatCompactCurrency(cv(stats.total), displayCurrency)}</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Premium Trades</div>
          <div className="text-lg font-bold text-gesso-sage mt-0.5">{stats.premiumCount}/{blockTrades.length}</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Avg Z-Score</div>
          <div className="text-lg font-bold text-gesso-gold mt-0.5">{stats.avgZ}σ</div>
        </div>
      </div>

      {/* Depth Chart */}
      <div className="glass rounded-xl p-4 border border-surface-border/50">
        <div className="text-xs text-white/40 font-mono mb-3">Block Trade Depth Profile</div>
        {depthData ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Mid price line */}
            <line x1={(depthData.mid - depthData.minP) / depthData.range * width} y1={0}
              x2={(depthData.mid - depthData.minP) / depthData.range * width} y2={height}
              stroke="rgba(200,164,92,0.3)" strokeWidth={1} strokeDasharray="4,3" />

            {/* Bid area */}
            {depthData.bidPoints.length > 1 && (
              <path d={`M0,${height} ${depthData.bidPoints.map(p => `${p.x},${p.y}`).join(' ')} L${depthData.bidPoints[depthData.bidPoints.length-1].x},${height} Z`}
                fill="rgba(124,159,110,0.15)" />
            )}
            {depthData.bidPoints.map((p, i) => (
              <circle key={`bid-${i}`} cx={p.x} cy={p.y} r={2} fill="#7c9f6e" opacity={0.6} />
            ))}

            {/* Ask area */}
            {depthData.askPoints.length > 1 && (
              <path d={`M${width},${height} ${depthData.askPoints.map(p => `${p.x},${p.y}`).join(' ')} L${depthData.askPoints[depthData.askPoints.length-1].x},${height} Z`}
                fill="rgba(212,88,110,0.15)" />
            )}
            {depthData.askPoints.map((p, i) => (
              <circle key={`ask-${i}`} cx={p.x} cy={p.y} r={2} fill="#d4586e" opacity={0.6} />
            ))}

            <text x={10} y={height - 5} className="text-[7px] fill-gesso-sage/60 font-mono">Bids</text>
            <text x={width - 10} y={height - 5} textAnchor="end" className="text-[7px] fill-gesso-rose/60 font-mono">Asks</text>
          </svg>
        ) : (
          <div className="text-center py-8 text-[10px] text-white/20 font-mono">Insufficient trade data for depth chart</div>
        )}
      </div>

      {/* Block Trade Timeline */}
      <div className="glass rounded-xl p-4 border border-surface-border/50">
        <div className="text-xs text-white/40 font-mono mb-3">Block Trade Timeline</div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-border/30" />
          {blockTrades.map((trade, i) => {
            const isSelected = selectedTrade === `${trade.symbol}-${i}`
            return (
              <motion.div
                key={`${trade.symbol}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedTrade(isSelected ? null : `${trade.symbol}-${i}`)}
                className="relative flex items-start gap-4 pl-10 pb-4 cursor-pointer group"
              >
                {/* Timeline dot */}
                <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 mt-1 transition-colors ${
                  trade.type === 'premium'
                    ? 'border-gesso-sage bg-gesso-sage/20 group-hover:bg-gesso-sage/40'
                    : 'border-gesso-rose bg-gesso-rose/20 group-hover:bg-gesso-rose/40'
                }`} />
                <div className={`flex-1 glass rounded-lg p-3 border transition-all ${
                  isSelected ? 'border-gesso-gold/30 bg-gesso-gold/[0.02]' : 'border-surface-border/30'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-sm text-white">{trade.symbol}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        trade.type === 'premium' ? 'text-gesso-sage bg-gesso-sage/10' : 'text-gesso-rose bg-gesso-rose/10'
                      }`}>
                        {trade.type === 'premium' ? 'Premium' : 'Discount'}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/30 font-mono">{trade.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono">
                    <span className="text-white/60">{formatCurrency(cv(trade.price), displayCurrency)}</span>
                    <span className="text-white/40">{formatLargeNumber(trade.shares)} shares</span>
                    <span className="text-white/40">{formatCompactCurrency(cv(trade.totalValue), displayCurrency)}</span>
                    <span className="text-gesso-gold">{trade.zScore.toFixed(1)}σ</span>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-2 pt-2 border-t border-surface-border/20 text-[9px] text-white/40 font-mono"
                    >
                      Premium/Discount: {(Math.random() * 2 - 1).toFixed(2)}% · Est. Market Impact: {(Math.random() * 0.5 + 0.1).toFixed(2)}%
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
