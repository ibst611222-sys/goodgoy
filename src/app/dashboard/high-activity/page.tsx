'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function HighActivityPage() {
  const { signals, setSelectedSymbol } = useAppStore()

  const highActivity = [...signals]
    .sort((a, b) => b.buyingIntensity - a.buyingIntensity)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">High-Activity Stocks</h1>
        <p className="text-xs text-white/30 font-mono">Stocks with unusual buying intensity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {highActivity.map((signal, i) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedSymbol(signal.symbol)}
            className="glass rounded-xl p-4 border border-surface-border/50 cursor-pointer card-hover"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white">{signal.symbol}</span>
                <span className="text-[10px] text-white/30">{signal.sector}</span>
              </div>
              <div className={`text-xs font-mono ${signal.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                {formatPercent(signal.changePercent)}
              </div>
            </div>

            <div className="text-[10px] text-white/50 mb-3">{signal.whatsHappening}</div>

            {/* Buying intensity bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[9px] font-mono mb-1">
                <span className="text-white/30">Buying Intensity</span>
                <span className="text-white/80">{signal.buyingIntensity}/100</span>
              </div>
              <div className="h-2 rounded-full bg-surface-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${signal.buyingIntensity}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
              <span>Edge: <span className="text-white/60">{signal.edgeScore}</span></span>
              <span>Z: <span className="text-white/60">{signal.zScore.toFixed(1)}σ</span></span>
              <span>Streak: <span className="text-white/60">{signal.streak}d</span></span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
