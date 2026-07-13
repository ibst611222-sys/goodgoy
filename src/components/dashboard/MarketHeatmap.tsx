'use client'

import { motion } from 'framer-motion'
import { cn, formatCompactCurrency, formatPercent } from '@/lib/utils'

const sectors = [
  { name: 'Technology', change: 1.2, marketCap: 12500000000000, color: '#00ff88' },
  { name: 'Healthcare', change: 0.8, marketCap: 5800000000000, color: '#00f0ff' },
  { name: 'Financial', change: -0.3, marketCap: 7200000000000, color: '#ff2d95' },
  { name: 'Energy', change: -1.5, marketCap: 3200000000000, color: '#ff2d95' },
  { name: 'Consumer Cyclical', change: 0.5, marketCap: 4800000000000, color: '#00ff88' },
  { name: 'Consumer Defensive', change: 0.2, marketCap: 3500000000000, color: '#a855f7' },
  { name: 'Industrials', change: 0.1, marketCap: 4200000000000, color: '#a855f7' },
  { name: 'Utilities', change: -0.8, marketCap: 1500000000000, color: '#ff2d95' },
  { name: 'Real Estate', change: 0.4, marketCap: 1200000000000, color: '#00f0ff' },
  { name: 'Basic Materials', change: -0.6, marketCap: 1800000000000, color: '#ff2d95' },
]

export function MarketHeatmap() {
  return (
    <div className="glass rounded-xl p-4 border border-surface-border/50">
      <div className="text-xs text-white/40 font-mono mb-3">Market Heatmap</div>

      <div className="grid grid-cols-5 gap-2">
        {sectors.map((sector, i) => {
          const isPositive = sector.change >= 0
          const intensity = Math.min(Math.abs(sector.change) / 3, 1)

          return (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={cn(
                'rounded-lg p-2.5 cursor-pointer card-hover',
                isPositive ? 'bg-neon-green/5 border border-neon-green/10' : 'bg-neon-pink/5 border border-neon-pink/10'
              )}
              style={{
                opacity: 0.4 + intensity * 0.6,
              }}
            >
              <div className="text-[10px] font-medium text-white/80 truncate">{sector.name}</div>
              <div className={cn('text-xs font-mono mt-1', isPositive ? 'text-neon-green' : 'text-neon-pink')}>
                {formatPercent(sector.change)}
              </div>
              <div className="text-[9px] text-white/30 mt-0.5 font-mono">
                {formatCompactCurrency(sector.marketCap)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
