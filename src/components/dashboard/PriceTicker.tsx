'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function PriceTicker() {
  const { stocks, displayCurrency, exchangeRates } = useAppStore()

  // Triple the list for seamless looping
  const tickerItems = useMemo(() => {
    if (!stocks || stocks.length === 0) return []
    const base = [...stocks, ...stocks, ...stocks]
    return base.map(s => ({
      ...s,
      _price: convertCurrency(s.price, displayCurrency, exchangeRates),
    }))
  }, [stocks, displayCurrency, exchangeRates])

  if (tickerItems.length === 0) return null

  return (
    <div className="relative overflow-hidden h-8 bg-surface-card/50 border-b border-surface-border/30">
      <motion.div
        className="flex items-center gap-6 absolute whitespace-nowrap px-4"
        animate={{ x: [0, '-33.33%'] }}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      >
        {tickerItems.map((stock, i) => (
          <div key={`${stock.symbol}-${i}`} className="flex items-center gap-1.5 text-[10px] font-mono shrink-0">
            <span className="font-semibold text-white/80">{stock.symbol}</span>
            <span className="text-white/50">${stock._price.toFixed(2)}</span>
            <span className={cn('flex items-center gap-0.5', stock.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink')}>
              {stock.changePercent >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
