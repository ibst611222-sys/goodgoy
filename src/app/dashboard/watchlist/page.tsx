'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatPercent, formatCompactCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { useMemo } from 'react'
import { Star } from 'lucide-react'

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, setSelectedSymbol, stocks, displayCurrency, exchangeRates } = useAppStore()

  const watchlistData = useMemo(() => {
    return watchlist.map(sym => {
      const stock = stocks.find(s => s.symbol === sym)
      const base = stock || { symbol: sym, name: '', price: 0, change: 0, changePercent: 0, marketCap: 0, sector: '', industry: '', exchange: '', currency: 'USD' }
      return {
        ...base,
        _price: convertCurrency(base.price, displayCurrency, exchangeRates),
        _mcap: convertCurrency(base.marketCap, displayCurrency, exchangeRates),
      }
    })
  }, [watchlist, stocks, displayCurrency, exchangeRates])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Watchlist</h1>
        <p className="text-xs text-white/30 font-mono">{watchlist.length} stocks tracked</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center border border-surface-border/50">
          <Star className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <div className="text-sm text-white/30">Your watchlist is empty</div>
          <div className="text-xs text-white/20 mt-1">Click the star icon on any signal card to add stocks</div>
        </div>
      ) : (
        <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
          <div className="divide-y divide-surface-border/10">
            {watchlistData.map((stock, i) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                onClick={() => setSelectedSymbol(stock.symbol)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromWatchlist(stock.symbol) }}
                  className="p-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star className="w-3.5 h-3.5 text-neon-amber fill-neon-amber" />
                </button>
                <div className="w-20">
                  <span className="text-sm font-mono font-semibold text-white">{stock.symbol}</span>
                </div>
                <div className="w-36">
                  <span className="text-[10px] text-white/50">{stock.name}</span>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4 text-[10px] font-mono">
                  <div>
                    <div className="text-white/20">Price</div>
                    <div className="text-white/80">{formatCurrency(stock._price, displayCurrency)}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Change</div>
                    <div className={stock.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink'}>
                      {formatPercent(stock.changePercent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/20">Mkt Cap</div>
                    <div className="text-white/80">{formatCompactCurrency(stock._mcap, displayCurrency)}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Sector</div>
                    <div className="text-white/50">{stock.sector}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
