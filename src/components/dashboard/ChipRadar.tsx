'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function ChipRadar() {
  const { signals, setSelectedSymbol } = useAppStore()

  // Top 9 by edge score
  const top9 = [...signals].sort((a, b) => b.edgeScore - a.edgeScore).slice(0, 9)

  return (
    <div className="glass rounded-xl p-4 border border-surface-border/50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs text-white/40 font-mono">Chip Radar</span>
          <span className="text-[10px] text-white/20 ml-2">— strongest accumulation</span>
        </div>
        <div className="text-[10px] text-white/30 font-mono">
          Ranked by Edge Score
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {top9.map((signal, i) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedSymbol(signal.symbol)}
            className="glass rounded-lg p-2.5 cursor-pointer card-hover border border-surface-border/30"
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                'font-mono text-xs font-semibold',
                signal.isGoldGlow ? 'text-neon-amber' : 'text-white'
              )}>
                {signal.symbol}
              </span>
              <span className="text-[10px] text-neon-cyan font-mono">#{i + 1}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-white/60">{formatCurrency(signal.price)}</span>
              <span className={signal.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink'}>
                {formatPercent(signal.changePercent)}
              </span>
            </div>

            {/* Rank formula elements */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex-1 h-0.5 rounded-full bg-surface-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                  style={{ width: `${signal.buyingIntensity}%` }}
                />
              </div>
              <span className="text-[9px] text-white/40 font-mono">{signal.edgeScore}</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {signal.finiConfirmed && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                  FINI
                </span>
              )}
              {signal.bigHolderPercent && signal.bigHolderPercent >= 60 && (
                <span className="text-[8px] text-neon-cyan">{signal.bigHolderPercent}%</span>
              )}
              <span className="text-[8px] text-white/30 ml-auto">{signal.streak}d</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
