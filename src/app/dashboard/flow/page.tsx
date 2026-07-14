'use client'

import { useAppStore } from '@/store/use-app-store'
import { formatCompactCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'
import { motion } from 'framer-motion'

export default function FlowPage() {
  const { sectorFlows, displayCurrency } = useAppStore()

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Flow</h1>
          <p className="text-xs text-white/30 font-mono">Sector & stock-level money flow</p>
        </div>
        <DataSourceTooltip sources={[
          { label: 'Sector Flows', source: 'derived', detail: 'Calculated from real FMP stock quotes — inflow/outflow based on market-cap-weighted price changes of tracked stocks.' },
        ]} />
      </div>

      {/* Sector Flow Table */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
          <span className="text-xs text-white/40 font-mono">Sector Flow — 7-Day Capital Velocity</span>
          <span className="text-[8px] font-mono text-neon-cyan/50 bg-neon-cyan/5 px-1.5 py-0.5 rounded border border-neon-cyan/10">DERIVED FROM FMP</span>
        </div>
        <div className="divide-y divide-surface-border/20">
          {sectorFlows.map((sf, i) => (
            <motion.div
              key={sf.sector}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-32 text-sm text-white font-medium">{sf.sector}</div>
              <div className="flex-1 grid grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <div className="text-[9px] text-white/20">Inflow</div>
                  <div className="text-neon-green">{formatCompactCurrency(sf.inflow, displayCurrency)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-white/20">Outflow</div>
                  <div className="text-neon-pink">{formatCompactCurrency(sf.outflow, displayCurrency)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-white/20">Net</div>
                  <div className={sf.inflow > sf.outflow ? 'text-neon-green' : 'text-neon-pink'}>
                    {formatCompactCurrency(sf.inflow - sf.outflow, displayCurrency)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-white/20">Velocity</div>
                  <div className={cn(
                    sf.velocity === 'up' ? 'text-neon-green' : sf.velocity === 'down' ? 'text-neon-pink' : 'text-white/60'
                  )}>
                    {sf.velocity === 'up' ? '↑ Accelerating' : sf.velocity === 'down' ? '↓ Slowing' : '→ Stable'}
                  </div>
                </div>
              </div>
              <div className="w-24 text-right">
                <div className="text-[9px] text-white/20">Avg Z-Score</div>
                <div className="text-xs font-mono text-white/60">{sf.avgZScore.toFixed(1)}</div>
              </div>
              <div className="w-24 ml-4">
                <div className="h-2 rounded-full bg-surface-border overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      sf.inflow > sf.outflow ? 'bg-neon-green' : 'bg-neon-pink'
                    )}
                    style={{
                      width: `${Math.min((sf.inflow / (sf.inflow + sf.outflow)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
