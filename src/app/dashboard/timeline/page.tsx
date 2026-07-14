'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { Download } from 'lucide-react'
import { downloadCSV } from '@/lib/export-csv'

// Generate mock signal timeline data
const signalTimeline = [
  { symbol: 'NVDA', start: '2026-05-15', end: '2026-07-12', return: 32.5, active: true, type: 'Momentum' },
  { symbol: 'LLY', start: '2026-05-20', end: '2026-07-12', return: 18.2, active: true, type: 'Momentum' },
  { symbol: 'META', start: '2026-06-01', end: '2026-07-05', return: 8.7, active: false, type: 'Breakout' },
  { symbol: 'TSLA', start: '2026-06-10', end: null, return: -3.2, active: true, type: 'Dip Buy' },
  { symbol: 'JPM', start: '2026-06-15', end: '2026-07-10', return: 5.1, active: false, type: 'Insider' },
  { symbol: 'NVO', start: '2026-05-25', end: '2026-07-12', return: 14.8, active: true, type: 'Momentum' },
  { symbol: 'AAPL', start: '2026-06-20', end: null, return: 2.3, active: true, type: 'Accumulation' },
  { symbol: 'GOOGL', start: '2026-06-25', end: '2026-07-08', return: 4.5, active: false, type: 'Breakout' },
  { symbol: 'ASML', start: '2026-06-05', end: null, return: 11.2, active: true, type: 'Momentum' },
  { symbol: 'AMZN', start: '2026-07-01', end: null, return: 1.8, active: true, type: 'Accumulation' },
]

const typeColors: Record<string, string> = {
  'Momentum': 'bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan',
  'Breakout': 'bg-neon-purple/20 border-neon-purple/40 text-neon-purple',
  'Dip Buy': 'bg-neon-amber/20 border-neon-amber/40 text-neon-amber',
  'Insider': 'bg-neon-green/20 border-neon-green/40 text-neon-green',
  'Accumulation': 'bg-neon-pink/20 border-neon-pink/40 text-neon-pink',
}

export default function TimelinePage() {
  const { setSelectedSymbol } = useAppStore()
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('return')

  const startDate = new Date('2026-05-15')
  const endDate = new Date('2026-07-12')
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  const toDays = (dateStr: string) => {
    const d = new Date(dateStr)
    return Math.max(0, Math.ceil((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  }

  const filtered = signalTimeline
    .filter(s => typeFilter === 'All' || s.type === typeFilter)
    .sort((a, b) => {
      if (sortBy === 'return') return b.return - a.return
      if (sortBy === 'duration') {
        const aDays = (a.end ? toDays(a.end) : totalDays) - toDays(a.start)
        const bDays = (b.end ? toDays(b.end) : totalDays) - toDays(b.start)
        return bDays - aDays
      }
      return 0
    })

  const types = ['All', ...Array.from(new Set(signalTimeline.map(s => s.type)))]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Signal Timeline</h1>
        <p className="text-xs text-white/30 font-mono">Gantt-style view of active and completed signal durations</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={cn('px-3 py-1.5 rounded-full text-[10px] font-mono transition-all border', typeFilter === t ? 'bg-cosmic-600/20 text-neon-cyan border-cosmic-500/30' : 'text-white/30 border-white/10 hover:border-white/20')}>{t}</button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-surface-card border border-surface-border rounded px-2 py-1 text-[10px] font-mono text-white/60 focus:outline-none">
          <option value="return">Sort: Return</option>
          <option value="duration">Sort: Duration</option>
        </select>
        <button onClick={() => downloadCSV(
          filtered.map(s => ({ Symbol: s.symbol, Type: s.type, Start: s.start, End: s.end || 'Active', Return: s.return + '%', Status: s.active ? 'Active' : 'Closed' })),
          [{ key: 'Symbol', label: 'Symbol' }, { key: 'Type', label: 'Type' }, { key: 'Start', label: 'Start' }, { key: 'End', label: 'End' }, { key: 'Return', label: 'Return' }, { key: 'Status', label: 'Status' }],
          `signal-timeline-${new Date().toISOString().slice(0, 10)}`
        )} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-neon-cyan transition-colors ml-auto">
          <Download className="w-3 h-3" /> CSV
        </button>
      </div>

      {/* Gantt-style timeline */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30">
          <span className="text-xs text-white/40 font-mono">Signal Duration — May 15 to Jul 12, 2026</span>
        </div>

        {/* Month markers */}
        <div className="flex border-b border-surface-border/20">
          <div className="w-24 shrink-0 px-3 py-2 text-[8px] text-white/20 font-mono">Symbol</div>
          {['May', 'Jun', 'Jul'].map(month => {
            const daysInMonth = month === 'May' ? 16 : month === 'Jun' ? 30 : 12
            const width = (daysInMonth / totalDays) * 100
            return <div key={month} style={{ width: `${width}%` }} className="py-2 text-[8px] text-white/20 font-mono text-center border-l border-surface-border/10">{month}</div>
          })}
        </div>

        <div className="divide-y divide-surface-border/10">
          {filtered.map((signal, i) => {
            const startDay = toDays(signal.start)
            const endDay = signal.end ? toDays(signal.end) : totalDays
            const duration = endDay - startDay
            const left = (startDay / totalDays) * 100
            const width = (duration / totalDays) * 100
            const isPositive = signal.return >= 0

            return (
              <motion.div
                key={signal.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedSymbol(signal.symbol)}
                className="flex items-center px-3 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="w-24 flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-xs text-white">{signal.symbol}</span>
                  <span className={cn('text-[8px] px-1 py-0.5 rounded border font-mono', typeColors[signal.type] || 'text-white/30')}>
                    {signal.type.slice(0, 4)}
                  </span>
                </div>

                {/* Gantt bar */}
                <div className="flex-1 relative h-6">
                  <div className="absolute inset-0 mx-1">
                    <div className="w-full h-full rounded bg-surface-card/50 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className={cn(
                          'absolute top-0.5 bottom-0.5 rounded cursor-pointer transition-all hover:opacity-80',
                          signal.active ? 'bg-gradient-to-r from-neon-cyan to-neon-purple' : 'bg-white/15'
                        )}
                        style={{ left: `${left}%` }}
                      >
                        {/* Return label inside bar */}
                        <span className={cn(
                          'absolute inset-0 flex items-center justify-center text-[8px] font-mono',
                          width > 15 ? 'text-white' : 'hidden'
                        )}>
                          {isPositive ? '+' : ''}{signal.return.toFixed(1)}%
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Return badge */}
                <div className="w-16 text-right shrink-0">
                  <span className={cn('text-[10px] font-mono', isPositive ? 'text-neon-green' : 'text-neon-pink')}>
                    {isPositive ? '+' : ''}{signal.return.toFixed(1)}%
                  </span>
                </div>

                {/* Status */}
                <div className="w-12 text-center shrink-0">
                  {signal.active ? (
                    <span className="relative flex h-2 w-2 mx-auto">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
                    </span>
                  ) : (
                    <span className="text-[8px] text-white/20 font-mono">Closed</span>
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
