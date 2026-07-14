'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'

export function FearGreedMeter() {
  const { marketPulse } = useAppStore()
  const score = marketPulse.fearGreedScore

  const getLabel = () => {
    if (score >= 80) return 'Extreme Greed'
    if (score >= 60) return 'Greed'
    if (score >= 40) return 'Neutral'
    if (score >= 20) return 'Fear'
    return 'Extreme Fear'
  }

  const getColor = () => {
    if (score >= 80) return 'from-neon-pink to-red-500'
    if (score >= 60) return 'from-neon-green to-emerald-400'
    if (score >= 40) return 'from-neon-amber to-yellow-400'
    if (score >= 20) return 'from-orange-500 to-neon-amber'
    return 'from-red-600 to-orange-500'
  }

  const getGlowColor = () => {
    if (score >= 60) return '#7c9f6e'
    if (score >= 40) return '#e8b84b'
    return '#d4586e'
  }

  return (
    <div className="glass rounded-xl p-4 border border-surface-border/50 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-white/40 font-mono">Fear & Greed Index</span>
        <DataSourceTooltip sources={[
          { label: 'Fear & Greed', source: 'partial', detail: 'Score is a simplified estimate (derived from SPY momentum). The sub-component bars (Branch, Flow, Squeeze, News, Trend) are placeholder fills.' },
        ]} />
      </div>

      <div className="flex items-center gap-6">
        {/* 3D Orb */}
        <div className="relative shrink-0">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full relative"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${getGlowColor()}44, transparent 70%)`,
            }}
          >
            <div
              className="w-16 h-16 rounded-full"
              style={{
                background: `conic-gradient(from ${score * 3.6}deg, ${getGlowColor()}, transparent 60%, ${getGlowColor()}33)`,
                filter: `blur(2px)`,
              }}
            />
            <div className="absolute inset-1 rounded-full bg-surface-dark flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: getGlowColor() }}>{score}</span>
            </div>
          </motion.div>
          {/* Outer glow */}
          <div
            className="absolute -inset-4 rounded-full opacity-20 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${getGlowColor()}, transparent 70%)`,
            }}
          />
        </div>

        {/* Meter */}
        <div className="flex-1">
          <div className="text-sm font-semibold text-white mb-1">{getLabel()}</div>
          <div className="h-2 rounded-full bg-surface-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${getColor()}`}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-white/20 font-mono">
            <span>0 Fear</span>
            <span>50</span>
            <span>100 Greed</span>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {['Branch', 'Flow', 'Squeeze', 'News', 'Trend'].map((comp, i) => (
          <div key={comp} className="text-center">
            <div className="text-[8px] text-white/30 font-mono">{comp}</div>
            <div className="h-1 rounded-full bg-surface-border mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gesso-gold to-gesso-taupe"
                style={{ width: `${40 + Math.random() * 50}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
