'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { SignalCard } from '@/components/dashboard/SignalCard'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'
import { Grid3X3, List, Filter } from 'lucide-react'

const sectors = ['All', 'Technology', 'Healthcare', 'Financial', 'Energy', 'Automotive', 'Consumer Defensive']
const sortOptions = ['Edge Score', 'Z-Score', 'Streak']

export default function SignalsPage() {
  const { signals } = useAppStore()
  const [view, setView] = useState<'card' | 'table'>('card')
  const [sector, setSector] = useState('All')
  const [sort, setSort] = useState('Edge Score')
  const [signalFilter, setSignalFilter] = useState('All')

  const filtered = signals
    .filter(s => sector === 'All' || s.sector === sector)
    .filter(s => {
      if (signalFilter === 'All') return true
      if (signalFilter === 'Triple') return s.signalTypes.includes('triple')
      if (signalFilter === 'Unusual buying') return s.signalTypes.includes('unusual_buying')
      if (signalFilter === 'Long streak') return s.signalTypes.includes('long_streak')
      if (signalFilter === 'Institutions') return s.signalTypes.includes('institutions')
      if (signalFilter === 'Squeeze') return s.signalTypes.includes('squeeze')
      if (signalFilter === 'Fresh signal') return s.signalTypes.includes('fresh_signal')
      if (signalFilter === 'Earnings soon') return s.signalTypes.includes('earnings_soon')
      return true
    })
    .sort((a, b) => {
      if (sort === 'Edge Score') return b.edgeScore - a.edgeScore
      if (sort === 'Z-Score') return b.zScore - a.zScore
      if (sort === 'Streak') return b.streak - a.streak
      return 0
    })

  const signalFilters = ['All', 'Triple', 'Unusual buying', 'Long streak', 'Institutions', 'Squeeze', 'Earnings soon', 'Fresh signal']

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Signals</h1>
          <p className="text-xs text-white/30 font-mono">{filtered.length} active signals</p>
        </div>
        <DataSourceTooltip sources={[
          { label: 'Signals', source: 'derived', detail: 'Z-scores, edge scores, and buying intensity calculated from real FMP stock quotes. Some fields (thirtyDayNet, finiFlow) are estimated.' },
        ]} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {signalFilters.map((f) => (
          <button
            key={f}
            onClick={() => setSignalFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all border',
              signalFilter === f
                ? 'bg-cosmic-600/20 text-neon-cyan border-cosmic-500/30'
                : 'text-white/30 border-white/10 hover:border-white/20'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 text-[10px] font-mono text-white/60 focus:outline-none focus:border-cosmic-500/50"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 text-[10px] font-mono text-white/60 focus:outline-none focus:border-cosmic-500/50"
          >
            {sortOptions.map((s) => (
              <option key={s} value={s}>Sort: {s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 bg-surface-card rounded-lg border border-surface-border p-0.5">
          <button
            onClick={() => setView('card')}
            className={cn('p-1.5 rounded', view === 'card' ? 'bg-surface-elevated text-white' : 'text-white/30')}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView('table')}
            className={cn('p-1.5 rounded', view === 'table' ? 'bg-surface-elevated text-white' : 'text-white/30')}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Signals */}
      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((signal) => (
            <SignalCard key={signal.id} signal={signal} view="card" />
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border/30 text-[10px] font-mono text-white/30">
                <th className="text-left py-3 px-3">Symbol</th>
                <th className="text-left py-3 px-3">Name</th>
                <th className="text-left py-3 px-3">Price</th>
                <th className="text-left py-3 px-3">Change</th>
                <th className="text-left py-3 px-3">Z-Score</th>
                <th className="text-left py-3 px-3">Signals</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((signal) => (
                <SignalCard key={signal.id} signal={signal} view="table" />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
