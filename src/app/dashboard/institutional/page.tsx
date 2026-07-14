'use client'

import { motion } from 'framer-motion'
import { cn, formatCompactCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function InstitutionalPage() {
  const { institutionalFlows, sectorFlows, displayCurrency, exchangeRates } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Institutional Flow</h1>
        <p className="text-xs text-white/30 font-mono">FINI · Trust · Dealers — daily net buy/sell</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Institutional Buys */}
        <div className="glass rounded-xl border border-surface-border/50">
          <div className="p-3 border-b border-surface-border/30">
            <span className="text-xs text-white/40 font-mono">Top Institutional Buys</span>
          </div>
          <div className="divide-y divide-surface-border/10">
            {institutionalFlows.map((flow, i) => (
              <motion.div
                key={flow.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-20">
                  <span className="text-xs font-mono font-semibold text-white">{flow.symbol}</span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div>
                    <div className="text-white/20">FINI</div>
                    <div className="text-neon-green">+{formatCompactCurrency(convertCurrency(flow.finiNet, displayCurrency, exchangeRates), displayCurrency)}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Trust</div>
                    <div className={flow.trustNet >= 0 ? 'text-neon-green' : 'text-neon-pink'}>
                      {flow.trustNet >= 0 ? '+' : ''}{formatCompactCurrency(convertCurrency(flow.trustNet, displayCurrency, exchangeRates), displayCurrency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/20">σ {flow.zScore.toFixed(1)}</div>
                    <div className="text-white/50">{flow.streak}d streak</div>
                  </div>
                </div>
                {flow.smartMoney && (
                  <span className="badge-fini text-[9px]">Smart Money</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sector Rotation Matrix */}
        <div className="glass rounded-xl border border-surface-border/50">
          <div className="p-3 border-b border-surface-border/30">
            <span className="text-xs text-white/40 font-mono">Sector Rotation Matrix</span>
          </div>
          <div className="divide-y divide-surface-border/10">
            {sectorFlows.map((sf, i) => (
              <motion.div
                key={sf.sector}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center px-4 py-2.5"
              >
                <div className="w-28 text-xs text-white/60 font-medium">{sf.sector}</div>
                <div className="flex-1 h-3 rounded-full bg-surface-border overflow-hidden mx-2">
                  <div className="flex h-full">
                    <div
                      className="h-full bg-neon-green rounded-l"
                      style={{ width: `${(sf.inflow / (sf.inflow + sf.outflow)) * 100}%` }}
                    />
                    <div
                      className="h-full bg-neon-pink rounded-r"
                      style={{ width: `${(sf.outflow / (sf.inflow + sf.outflow)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className={cn(
                  'text-[10px] font-mono w-20 text-right',
                  sf.velocity === 'up' ? 'text-neon-green' : sf.velocity === 'down' ? 'text-neon-pink' : 'text-white/30'
                )}>
                  {sf.velocity === 'up' ? '↑' : sf.velocity === 'down' ? '↓' : '→'}
                  <span className="ml-1">{sf.avgZScore.toFixed(1)}σ</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
