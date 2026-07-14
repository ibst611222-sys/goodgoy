'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatCompactCurrency, formatLargeNumber } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { Shield } from 'lucide-react'

export default function DarkPoolPage() {
  const { blockTrades, displayCurrency, exchangeRates } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Dark Pool</h1>
        <p className="text-xs text-white/30 font-mono">Institutional block trades — premium & discount analysis</p>
      </div>

      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
          <span className="text-xs text-white/40 font-mono">Recent Block Trades</span>
          <span className="text-[9px] text-white/20 font-mono">Z-Score anomaly detection</span>
        </div>
        <div className="divide-y divide-surface-border/10">
          {blockTrades.map((trade, i) => (
            <motion.div
              key={`${trade.symbol}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-20">
                <span className="text-sm font-mono font-semibold text-white">{trade.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  trade.type === 'premium' ? 'text-neon-green bg-neon-green/10' : 'text-neon-pink bg-neon-pink/10'
                }`}>
                  {trade.type === 'premium' ? 'Premium' : 'Discount'}
                </span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-4 text-[10px] font-mono ml-4">
                <div>
                  <div className="text-white/20">Price</div>
                  <div className="text-white/80">{formatCurrency(convertCurrency(trade.price, displayCurrency, exchangeRates), displayCurrency)}</div>
                </div>
                <div>
                  <div className="text-white/20">Shares</div>
                  <div className="text-white/80">{formatLargeNumber(trade.shares)}</div>
                </div>
                <div>
                  <div className="text-white/20">Total</div>
                  <div className="text-white/80">{formatCompactCurrency(convertCurrency(trade.totalValue, displayCurrency, exchangeRates), displayCurrency)}</div>
                </div>
                <div>
                  <div className="text-white/20">Z-Score</div>
                  <div className="text-neon-cyan">{trade.zScore.toFixed(1)}σ</div>
                </div>
              </div>
              <div className="text-[9px] text-white/30 font-mono">{trade.date}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
