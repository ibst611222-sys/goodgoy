'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency, formatCompactCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'
import { TrendingUp, TrendingDown, Eye } from 'lucide-react'

const urgencyColors = {
  high: 'text-gesso-rose bg-gesso-rose/10 border-gesso-rose/20',
  medium: 'text-gesso-amber bg-gesso-amber/10 border-gesso-amber/20',
  low: 'text-white/40 bg-white/5 border-white/10',
}

const typeLabels: Record<string, string> = {
  sell_alert: 'Sell Alert',
  pledge_risk: 'Pledge Risk',
  director_buy: 'Director Buy',
  management_change: 'Mgmt Change',
}

export default function InsiderPage() {
  const { insiderTransactions, displayCurrency, exchangeRates } = useAppStore()
  const [selectedTx, setSelectedTx] = useState<string | null>(null)
  const cv = (v: number) => convertCurrency(v, displayCurrency, exchangeRates)

  const stats = useMemo(() => {
    const buys = insiderTransactions.filter(t => t.type === 'director_buy')
    const sells = insiderTransactions.filter(t => t.type === 'sell_alert')
    const totalBuyVal = buys.reduce((s, t) => s + t.value, 0)
    const totalSellVal = sells.reduce((s, t) => s + t.value, 0)
    return { buys: buys.length, sells: sells.length, highUrgency: insiderTransactions.filter(t => t.urgency === 'high').length, netFlow: totalBuyVal - totalSellVal }
  }, [insiderTransactions])

  // Timeline chart dimensions
  const chartW = 600, chartH = 160
  const timelineData = useMemo(() => {
    if (insiderTransactions.length === 0) return null
    const sorted = [...insiderTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const minDate = new Date(sorted[0].date).getTime()
    const maxDate = new Date(sorted[sorted.length - 1].date).getTime()
    const range = maxDate - minDate || 1
    return sorted.map(t => ({
      ...t,
      x: ((new Date(t.date).getTime() - minDate) / range) * (chartW - 40) + 20,
      value: Math.min(t.value / 1_000_000, 100), // Scale to reasonable chart height
    }))
  }, [insiderTransactions])

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Insider Tracker</h1>
          <p className="text-xs text-white/30 font-mono">Director transactions, pledge risks, management changes</p>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceTooltip sources={[
            { label: 'Insider Trades', source: 'partial', detail: 'Filing dates & form types from real SEC EDGAR data.' },
          ]} />
          <Eye className="w-5 h-5 text-gesso-gold/40" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Director Buys</div>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-gesso-sage" />
            <span className="text-lg font-bold text-gesso-sage">{stats.buys}</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Insider Sells</div>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingDown className="w-3.5 h-3.5 text-gesso-rose" />
            <span className="text-lg font-bold text-gesso-rose">{stats.sells}</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">High Urgency</div>
          <div className="text-lg font-bold text-gesso-amber mt-0.5">{stats.highUrgency}</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Net Flow</div>
          <div className={`text-lg font-bold mt-0.5 ${stats.netFlow >= 0 ? 'text-gesso-sage' : 'text-gesso-rose'}`}>
            {stats.netFlow >= 0 ? '+' : ''}{formatCompactCurrency(cv(Math.abs(stats.netFlow)), displayCurrency)}
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="glass rounded-xl p-4 border border-surface-border/50">
        <div className="text-xs text-white/40 font-mono mb-3">Insider Activity Timeline</div>
        {timelineData ? (
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
            {/* Baseline */}
            <line x1={20} y1={chartH / 2} x2={chartW - 20} y2={chartH / 2} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />

            {/* Buys (up) and Sells (down) */}
            {timelineData.map((t, i) => {
              const isBuy = t.type === 'director_buy'
              const barHeight = Math.max(t.value, 2)
              const y = isBuy ? chartH / 2 - barHeight : chartH / 2
              const isSelected = selectedTx === `${t.symbol}-${i}`
              return (
                <g
                  key={`${t.symbol}-${i}`}
                  onClick={() => setSelectedTx(isSelected ? null : `${t.symbol}-${i}`)}
                  className="cursor-pointer"
                >
                  <rect
                    x={t.x - 3}
                    y={y}
                    width={6}
                    height={barHeight}
                    rx={1}
                    fill={isBuy ? '#7c9f6e' : '#d4586e'}
                    opacity={isSelected ? 1 : 0.6}
                  />
                  {isSelected && (
                    <text x={t.x} y={isBuy ? y - 5 : y + barHeight + 12}
                      textAnchor="middle" className="text-[6px] fill-white/60 font-mono">
                      {t.symbol}
                    </text>
                  )}
                </g>
              )
            })}
            <text x={20} y={chartH / 2 - 5} className="text-[7px] fill-gesso-sage/50 font-mono">Buys ↑</text>
            <text x={20} y={chartH / 2 + 14} className="text-[7px] fill-gesso-rose/50 font-mono">Sells ↓</text>
          </svg>
        ) : (
          <div className="text-center py-8 text-[10px] text-white/20 font-mono">No insider data available</div>
        )}
      </div>

      {/* Insider Transactions Table */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30">
          <span className="text-xs text-white/40 font-mono">Recent Insider Activity</span>
        </div>
        <div className="divide-y divide-surface-border/10">
          {insiderTransactions.length === 0 ? (
            <div className="px-4 py-8 text-center text-[10px] text-white/20 font-mono">No insider transactions found</div>
          ) : (
            insiderTransactions.map((tx, i) => (
              <motion.div
                key={`${tx.symbol}-${i}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedTx(selectedTx === `${tx.symbol}-${i}` ? null : `${tx.symbol}-${i}`)}
                className={cn(
                  'flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer',
                  selectedTx === `${tx.symbol}-${i}` && 'bg-gesso-gold/[0.02]'
                )}
              >
                <div className="w-20">
                  <span className="text-sm font-mono font-semibold text-white">{tx.symbol}</span>
                </div>
                <div className="w-36">
                  <span className="text-[10px] text-white/50">{tx.name}</span>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-2 text-[10px] font-mono">
                  <div>
                    <div className="text-white/20">Insider</div>
                    <div className="text-white/80 truncate">{tx.insiderName}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Type</div>
                    <span className={cn('px-1.5 py-0.5 rounded text-[9px]', urgencyColors[tx.urgency])}>
                      {typeLabels[tx.type] || tx.type}
                    </span>
                  </div>
                  <div>
                    <div className="text-white/20">Shares</div>
                    <div className="text-white/80">{tx.shares.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Value</div>
                    <div className="text-white/80">{formatCompactCurrency(cv(tx.value), displayCurrency)}</div>
                  </div>
                </div>
                <div className="text-[9px] text-white/30 font-mono w-16 text-right">{tx.date}</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
