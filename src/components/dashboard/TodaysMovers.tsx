'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency, getCurrencySymbol } from '@/lib/exchange-rates'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'

export function TodaysMovers() {
  const [filterAbove50, setFilterAbove50] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { stocks, displayCurrency, exchangeRates, setSelectedSymbol } = useAppStore()

  // Convert prices once for performance
  const withConvertedPrices = stocks.map(s => ({
    ...s,
    _price: convertCurrency(s.price, displayCurrency, exchangeRates),
  }))

  const sorted = [...withConvertedPrices].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
  const filtered = filterAbove50 ? sorted.filter(s => s.price >= 50) : sorted
  const display = expanded ? filtered : filtered.slice(0, 6)

  const gainers = display.filter(s => s.changePercent >= 0)
  const losers = display.filter(s => s.changePercent < 0)

  return (
    <div className="glass rounded-xl p-4 border border-surface-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">Today's Movers</span>
          <DataSourceTooltip sources={[
            { label: 'Stock Prices', source: 'live', detail: 'Real-time quotes from Financial Modeling Prep (FMP) API — prices, change, volume, market cap.' },
          ]} />
        </div>
        <button
          onClick={() => setFilterAbove50(!filterAbove50)}
          className={cn(
            'px-2 py-1 rounded text-[10px] font-mono transition-all border',
            filterAbove50
              ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30'
              : 'text-white/30 border-white/10 hover:border-white/20'
          )}
        >
          {filterAbove50 ? 'All Stocks' : `Above ${getCurrencySymbol(displayCurrency)}50`}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Gainers */}
        <div>
          <div className="text-[10px] text-neon-green font-mono mb-2">Gainers ↑</div>
          <div className="space-y-1.5">
            {gainers.slice(0, expanded ? 15 : 6).map((stock, i) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedSymbol(stock.symbol)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white">{stock.symbol}</span>
                  <span className="text-[10px] text-white/30">{stock.name.slice(0, 15)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/50">{formatCurrency(stock._price, displayCurrency)}</span>
                  <span className="font-mono text-[10px] text-neon-green">{formatPercent(stock.changePercent)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div>
          <div className="text-[10px] text-neon-pink font-mono mb-2">Losers ↓</div>
          <div className="space-y-1.5">
            {losers.slice(0, expanded ? 15 : 6).map((stock, i) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedSymbol(stock.symbol)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white">{stock.symbol}</span>
                  <span className="text-[10px] text-white/30">{stock.name.slice(0, 15)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/50">{formatCurrency(stock._price, displayCurrency)}</span>
                  <span className="font-mono text-[10px] text-neon-pink">{formatPercent(stock.changePercent)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-[10px] text-white/30 hover:text-white/60 transition-colors mt-2 font-mono"
      >
        {expanded ? 'Show less ↑' : 'Show more ↓'}
      </button>
    </div>
  )
}
