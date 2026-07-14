'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatPercent, formatCurrency, formatLargeNumber } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { Signal } from '@/data/types'
import { Star, Bell, ChevronDown, ChevronUp, Info } from 'lucide-react'

interface SignalCardProps {
  signal: Signal
  view?: 'card' | 'table'
}

export function SignalCard({ signal, view = 'card' }: SignalCardProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, setSelectedSymbol, displayCurrency, exchangeRates } = useAppStore()

  // Convert price to user's selected currency
  const convertedPrice = convertCurrency(signal.price, displayCurrency, exchangeRates)
  const watching = isInWatchlist(signal.symbol)
  const [showTooltip, setShowTooltip] = useState(false)

  if (view === 'table') {
    return (
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-surface-border/30 hover:bg-white/[0.02] transition-colors cursor-pointer"
        onClick={() => setSelectedSymbol(signal.symbol)}
      >
        <td className="py-2.5 px-3">
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold text-sm ${signal.isGoldGlow ? 'text-neon-amber' : 'text-white'}`}>
              {signal.symbol}
            </span>
          </div>
        </td>
        <td className="py-2.5 px-3">
          <span className="text-xs text-white/60">{signal.name}</span>
        </td>
        <td className="py-2.5 px-3">
          <span className="font-mono text-sm">{formatCurrency(convertedPrice, displayCurrency)}</span>
        </td>
        <td className="py-2.5 px-3">
          <span className={`font-mono text-xs ${signal.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
            {formatPercent(signal.changePercent)}
          </span>
        </td>
        <td className="py-2.5 px-3">
          <span className="font-mono text-xs text-white/80">{signal.zScore.toFixed(1)}σ</span>
        </td>
        <td className="py-2.5 px-3">
          <div className="flex gap-1">
            {signal.finiConfirmed && <span className="badge-fini text-[10px]">FINI</span>}
            {signal.provenWinRate && <span className="badge-proven text-[10px]">{signal.provenLabel}</span>}
            {signal.supportZone && <span className="badge-support text-[10px]">Support</span>}
          </div>
        </td>
      </motion.tr>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => setSelectedSymbol(signal.symbol)}
      className={cn(
        'signal-card',
        signal.isGoldGlow && 'gold',
        'cursor-pointer'
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Gold streak indicator */}
      {signal.isGoldGlow && (
        <div className="absolute top-0 right-0 w-16 h-16">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-amber animate-pulse" />
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-white">{signal.symbol}</span>
            <span className="text-[10px] text-white/40">{signal.sector}</span>
          </div>
          <div className="text-[10px] text-white/30 mt-0.5">{signal.name}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm font-medium text-white">{formatCurrency(convertedPrice, displayCurrency)}</div>
          <div className={cn('font-mono text-xs', signal.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink')}>
            {formatPercent(signal.changePercent)}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-xs text-white/50 mb-2 line-clamp-1">{signal.whatsHappening}</div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {signal.finiConfirmed && <span className="badge-fini">FINI Confirmed</span>}
        {signal.provenWinRate && <span className="badge-proven">{signal.provenLabel}</span>}
        {signal.supportZone && <span className="badge-support">Support Zone</span>}
        {signal.squeezePotential && signal.shortMarginRatio && (
          <span className="badge-squeeze">Squeeze · S/M {signal.shortMarginRatio}%</span>
        )}
        {signal.newsCatalyst && <span className="badge-news">News</span>}
        {signal.changePercent < 0 && signal.finiConfirmed && <span className="badge-dip">Dip</span>}
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-4 text-[10px] font-mono">
        <div className="flex items-center gap-1">
          <span className="text-white/30">Buying</span>
          <div className="w-12 h-1.5 rounded-full bg-surface-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
              style={{ width: `${signal.buyingIntensity}%` }}
            />
          </div>
          <span className="text-white/60">{signal.buyingIntensity}</span>
        </div>
        <div className="text-white/30">
          Streak: <span className="text-white/60">{signal.streak}d</span>
        </div>
        <div className="text-white/30">
          σ: <span className="text-white/60">{signal.zScore.toFixed(1)}</span>
        </div>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-0 right-0 bottom-full mb-2 glass-elevated rounded-lg p-3 z-10"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-mono">
              <div className="text-white/40">Z-Score</div>
              <div className="text-white/80 text-right">{signal.zScore.toFixed(2)}σ</div>
              <div className="text-white/40">Streak</div>
              <div className="text-white/80 text-right">{signal.streak} days</div>
              <div className="text-white/40">30d Net</div>
              <div className="text-white/80 text-right">{formatLargeNumber(signal.thirtyDayNet)}</div>
              <div className="text-white/40">FINI Flow</div>
              <div className="text-white/80 text-right">{formatLargeNumber(signal.finiFlow)}</div>
              <div className="text-white/40">Buy Ratio</div>
              <div className="text-white/80 text-right">{signal.buyRatio}%</div>
              <div className="text-white/40">Signal Age</div>
              <div className="text-white/80 text-right">{signal.signalAge}d</div>
              <div className="text-white/40">Big Holders</div>
              <div className="text-white/80 text-right">{signal.bigHolderPercent}%</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="absolute top-2 right-10 flex gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); watching ? removeFromWatchlist(signal.symbol) : addToWatchlist(signal.symbol) }}
          className="p-1 rounded hover:bg-white/5 transition-colors"
        >
          <Star className={cn('w-3.5 h-3.5', watching ? 'text-neon-amber fill-neon-amber' : 'text-white/20')} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-white/5 transition-colors"
        >
          <Bell className="w-3.5 h-3.5 text-white/20" />
        </button>
      </div>
    </motion.div>
  )
}
