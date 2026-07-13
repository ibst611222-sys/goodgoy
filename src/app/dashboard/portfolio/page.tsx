'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'

export default function PortfolioPage() {
  const { portfolioHoldings } = useAppStore()
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000)
  const [years, setYears] = useState(10)

  const totalValue = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0)
  const totalCost = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0)
  const totalPL = totalValue - totalCost
  const totalDiv = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.annualDividend), 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Portfolio</h1>
        <p className="text-xs text-white/30 font-mono">Live P&L, signals, and risk</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Total Value</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatCurrency(totalValue)}</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Total P&L</div>
          <div className={`text-lg font-bold mt-0.5 ${totalPL >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
            {totalPL >= 0 ? '+' : ''}{formatCurrency(totalPL)}
          </div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Total Return</div>
          <div className="text-lg font-bold text-neon-green mt-0.5">
            {formatPercent((totalPL / totalCost) * 100)}
          </div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Annual Dividend</div>
          <div className="text-lg font-bold text-neon-cyan mt-0.5">{formatCurrency(totalDiv)}</div>
        </div>
      </div>

      {/* Holdings */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30">
          <span className="text-xs text-white/40 font-mono">Holdings</span>
        </div>
        <div className="divide-y divide-surface-border/10">
          {portfolioHoldings.map((h, i) => {
            const pl = (h.currentPrice - h.avgCost) * h.shares
            const plPercent = ((h.currentPrice - h.avgCost) / h.avgCost) * 100
            const weight = (h.shares * h.currentPrice / totalValue) * 100
            return (
              <motion.div
                key={h.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-24">
                  <div className="text-sm font-mono font-semibold text-white">{h.symbol}</div>
                  <div className="text-[9px] text-white/30">{h.name.slice(0, 18)}</div>
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2 text-[10px] font-mono">
                  <div>
                    <div className="text-white/20">Shares</div>
                    <div className="text-white/80">{h.shares}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Avg Cost</div>
                    <div className="text-white/80">{formatCurrency(h.avgCost)}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Price</div>
                    <div className="text-white/80">{formatCurrency(h.currentPrice)}</div>
                  </div>
                  <div>
                    <div className="text-white/20">P&L</div>
                    <div className={pl >= 0 ? 'text-neon-green' : 'text-neon-pink'}>{formatCurrency(pl)}</div>
                  </div>
                  <div>
                    <div className="text-white/20">Weight</div>
                    <div className="text-white/80">{weight.toFixed(1)}%</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Monte Carlo */}
      <div className="glass rounded-xl p-4 border border-surface-border/50">
        <div className="text-xs text-white/40 font-mono mb-4">Monte Carlo Simulation — 100k paths</div>
        <div className="flex gap-6 mb-4">
          <div>
            <div className="text-[10px] text-white/30 font-mono mb-1">Monthly Investment</div>
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
              className="w-40 accent-cosmic-500"
            />
            <div className="text-[10px] font-mono text-white/60 mt-0.5">${monthlyInvestment.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/30 font-mono mb-1">Years</div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-40 accent-cosmic-500"
            />
            <div className="text-[10px] font-mono text-white/60 mt-0.5">{years} years</div>
          </div>
        </div>
        <div className="h-24 rounded-lg bg-surface-card border border-surface-border/30 flex items-center justify-center">
          <span className="text-[10px] text-white/20 font-mono">Simulation chart — adjust parameters above</span>
        </div>
      </div>
    </div>
  )
}
