'use client'

import { useAppStore } from '@/store/use-app-store'
import { MarketPulse } from '@/components/dashboard/MarketPulse'
import { FearGreedMeter } from '@/components/dashboard/FearGreedMeter'
import { ChipRadar } from '@/components/dashboard/ChipRadar'
import { MarketHeatmap } from '@/components/dashboard/MarketHeatmap'
import { TodaysMovers } from '@/components/dashboard/TodaysMovers'
import { SignalCard } from '@/components/dashboard/SignalCard'
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'
import { AnimatePresence, motion } from 'framer-motion'

export default function DashboardPage() {
  const { signals, hiddenWidgets } = useAppStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Dashboard</h1>
          <p className="text-xs text-white/30 font-mono">Market overview at a glance</p>
        </div>
        <DashboardCustomizer />
      </div>

      {/* Market Pulse */}
      <MarketPulse />

      <AnimatePresence mode="popLayout">
        {!hiddenWidgets.includes('fear-greed') && !hiddenWidgets.includes('movers') && (
          <motion.div
            key="fear-greed-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden"
          >
            <div className="animate-in animate-in-delay-1">
              <FearGreedMeter />
            </div>
            <div className="lg:col-span-2 animate-in animate-in-delay-2">
              <TodaysMovers />
            </div>
          </motion.div>
        )}

        {!hiddenWidgets.includes('chip-radar') && (
          <motion.div
            key="chip-radar-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ChipRadar />
          </motion.div>
        )}

        {!hiddenWidgets.includes('heatmap') && (
          <motion.div
            key="heatmap-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <MarketHeatmap />
          </motion.div>
        )}

        {!hiddenWidgets.includes('signals') && (
          <motion.div
            key="signals-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 animate-in animate-in-delay-4">
              {signals.slice(0, 9).map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
