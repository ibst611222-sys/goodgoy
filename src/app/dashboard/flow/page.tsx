'use client'

import { useAppStore } from '@/store/use-app-store'
import { formatCompactCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function FlowPage() {
  const { sectorFlows } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Flow</h1>
        <p className="text-xs text-white/30 font-mono">Sector & stock-level money flow</p>
      </div>

      {/* Sector Flow Table */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30">
          <span className="text-xs text-white/40 font-mono">Sector Flow — 7-Day Capital Velocity</span>
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
                  <div className="text-neon-green">{formatCompactCurrency(sf.inflow)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-white/20">Outflow</div>
                  <div className="text-neon-pink">{formatCompactCurrency(sf.outflow)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-white/20">Net</div>
                  <div className={sf.inflow > sf.outflow ? 'text-neon-green' : 'text-neon-pink'}>
                    {formatCompactCurrency(sf.inflow - sf.outflow)}
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
