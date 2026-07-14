'use client'

import { useAppStore } from '@/store/use-app-store'
import { MarketPulse } from '@/components/dashboard/MarketPulse'
import { FearGreedMeter } from '@/components/dashboard/FearGreedMeter'
import { ChipRadar } from '@/components/dashboard/ChipRadar'
import { MarketHeatmap } from '@/components/dashboard/MarketHeatmap'
import { TodaysMovers } from '@/components/dashboard/TodaysMovers'
import { SignalCard } from '@/components/dashboard/SignalCard'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'

export default function DashboardPage() {
  const { signals } = useAppStore()

  return (
    <div className="space-y-4">
      {/* Market Pulse */}
      <MarketPulse />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fear & Greed */}
        <div className="animate-in animate-in-delay-1">
          <FearGreedMeter />
        </div>

        {/* Today's Movers */}
        <div className="lg:col-span-2 animate-in animate-in-delay-2">
          <TodaysMovers />
        </div>
      </div>

      {/* Chip Radar */}
      <div className="animate-in animate-in-delay-3">
        <ChipRadar />
      </div>

      {/* Market Heatmap */}
      <div className="animate-in animate-in-delay-3">
        <MarketHeatmap />
      </div>

      {/* Signals section header */}
      <div className="flex items-center justify-between animate-in animate-in-delay-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60 font-mono">Active Signals</span>
          <span className="text-xs text-white/20 ml-2">— highest edge scores</span>
          <DataSourceTooltip sources={[
            { label: 'Stock Prices', source: 'live', detail: 'Real-time quotes from Financial Modeling Prep (FMP) API — prices, change, volume, market cap.' },
            { label: 'Market Pulse', source: 'partial', detail: 'SPY price is real from FMP. Fear/greed score is estimated. Advancers/decliners are estimates.' },
            { label: 'Signals', source: 'derived', detail: 'Z-scores, edge scores, and buying intensity calculated from real FMP stock quotes.' },
          ]} />
        </div>
        <div className="flex gap-2 text-[10px] text-white/30 font-mono">
          <span>Sort: Edge Score</span>
          <span className="text-white/50">|</span>
          <span>View: Cards</span>
        </div>
      </div>

      {/* Signals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 animate-in animate-in-delay-4">
        {signals.slice(0, 9).map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  )
}
