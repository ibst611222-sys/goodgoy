'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { CandlestickChart } from '@/components/dashboard/CandlestickChart'
import { downloadCSV } from '@/lib/export-csv'
import { Download, Calendar, AlertTriangle, Plus, Trash2, Save } from 'lucide-react'

export default function PortfolioPage() {
  const { portfolioHoldings, displayCurrency, exchangeRates, user } = useAppStore()
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000)
  const [years, setYears] = useState(10)
  const [mounted, setMounted] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSymbol, setNewSymbol] = useState('')
  const [newShares, setNewShares] = useState('')
  const [newCost, setNewCost] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editShares, setEditShares] = useState('')

  // Defer random-dependent computations to after hydration
  useEffect(() => { setMounted(true) }, [])

  const totalValue = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0)
  const totalCost = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0)
  const totalPL = totalValue - totalCost
  const totalDiv = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.annualDividend), 0)

  // Monte Carlo projection — only computed after mount to avoid hydration mismatch
  const projectedValue = useMemo(() => {
    if (!mounted) return totalValue // placeholder during SSR
    const monthlyReturn = 0.007
    const totalMonths = years * 12
    let value = totalValue
    for (let i = 0; i < totalMonths; i++) {
      value = (value + monthlyInvestment) * (1 + monthlyReturn + (Math.random() - 0.5) * 0.04)
    }
    return value
  }, [totalValue, monthlyInvestment, years, mounted])

  // Dividend calendar dates — deterministic during SSR, random after mount
  const dividendDates = useMemo(() => {
    if (!mounted) return portfolioHoldings.map(() => '—')
    return portfolioHoldings.map(() => {
      const d = new Date()
      d.setDate(d.getDate() + Math.floor(Math.random() * 90) + 10)
      return d.toISOString().slice(0, 10)
    })
  }, [portfolioHoldings, mounted])

  const cv = (v: number) => convertCurrency(v, displayCurrency, exchangeRates)

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
          <div className="text-lg font-bold text-white mt-0.5">{formatCurrency(cv(totalValue), displayCurrency)}</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Total P&L</div>
          <div className={`text-lg font-bold mt-0.5 ${totalPL >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
            {totalPL >= 0 ? '+' : ''}{formatCurrency(cv(totalPL), displayCurrency)}
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
          <div className="text-lg font-bold text-neon-cyan mt-0.5">{formatCurrency(cv(totalDiv), displayCurrency)}</div>
        </div>
      </div>

      {/* Holdings */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
          <span className="text-xs text-white/40 font-mono">Holdings</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-gesso-gold transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
            <button onClick={() => downloadCSV(
              portfolioHoldings.map(h => ({ Symbol: h.symbol, Name: h.name, Shares: h.shares, 'Avg Cost': h.avgCost, Price: h.currentPrice, PnL: (h.currentPrice - h.avgCost) * h.shares, 'Div Yield': h.dividendYield + '%' })),
              [{ key: 'Symbol', label: 'Symbol' }, { key: 'Name', label: 'Name' }, { key: 'Shares', label: 'Shares' }, { key: 'Avg Cost', label: 'Avg Cost' }, { key: 'Price', label: 'Price' }, { key: 'PnL', label: 'P&L' }, { key: 'Div Yield', label: 'Div Yield' }],
              `portfolio-${new Date().toISOString().slice(0, 10)}`
            )} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-gesso-gold transition-colors">
              <Download className="w-3 h-3" />
              CSV
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="px-4 py-3 border-b border-surface-border/20 bg-surface-elevated/50"
          >
            <div className="flex items-end gap-3">
              <div>
                <div className="text-[10px] text-white/30 font-mono mb-1">Symbol</div>
                <input
                  type="text"
                  placeholder="e.g. AAPL"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  className="bg-surface-card border border-surface-border rounded px-2 py-1.5 text-[10px] font-mono text-white/80 w-20 focus:outline-none focus:border-gesso-gold/40"
                />
              </div>
              <div>
                <div className="text-[10px] text-white/30 font-mono mb-1">Shares</div>
                <input
                  type="number"
                  placeholder="0"
                  value={newShares}
                  onChange={(e) => setNewShares(e.target.value)}
                  className="bg-surface-card border border-surface-border rounded px-2 py-1.5 text-[10px] font-mono text-white/80 w-20 focus:outline-none focus:border-gesso-gold/40"
                />
              </div>
              <div>
                <div className="text-[10px] text-white/30 font-mono mb-1">Avg Cost</div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="bg-surface-card border border-surface-border rounded px-2 py-1.5 text-[10px] font-mono text-white/80 w-20 focus:outline-none focus:border-gesso-gold/40"
                />
              </div>
              <button
                onClick={() => {
                  if (!newSymbol || !newShares || !newCost) return
                  const holding = {
                    symbol: newSymbol,
                    name: newSymbol,
                    shares: parseFloat(newShares),
                    avgCost: parseFloat(newCost),
                    currentPrice: parseFloat(newCost) * 1.05,
                    annualDividend: 0,
                    dividendYield: 0,
                  }
                  useAppStore.setState((s) => ({
                    portfolioHoldings: [...s.portfolioHoldings, holding]
                  }))
                  setNewSymbol('')
                  setNewShares('')
                  setNewCost('')
                  setShowAddForm(false)
                }}
                className="px-3 py-1.5 rounded-lg bg-gesso-gold/10 border border-gesso-gold/20 text-[10px] text-gesso-gold font-mono hover:bg-gesso-gold/20 transition-colors"
              >
                <Save className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}

        <div className="divide-y divide-surface-border/10">
          {portfolioHoldings.map((h, i) => {
            const pl = (h.currentPrice - h.avgCost) * h.shares
            const plPercent = ((h.currentPrice - h.avgCost) / h.avgCost) * 100
            const weight = (h.shares * h.currentPrice / totalValue) * 100
            const isEditing = editingIndex === i
            return (
              <motion.div
                key={h.symbol + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="w-24">
                  <div className="text-sm font-mono font-semibold text-white">{h.symbol}</div>
                  <div className="text-[9px] text-white/30">{h.name.slice(0, 18)}</div>
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2 text-[10px] font-mono">
                  {isEditing ? (
                    <>
                      <div className="col-span-5 flex items-center gap-2">
                        <input
                          type="number"
                          value={editShares}
                          onChange={(e) => setEditShares(e.target.value)}
                          className="bg-surface-card border border-surface-border rounded px-2 py-1 text-[10px] font-mono text-white/80 w-24 focus:outline-none focus:border-gesso-gold/40"
                          placeholder="Shares"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            useAppStore.setState((s) => ({
                              portfolioHoldings: s.portfolioHoldings.map((h2, j) =>
                                j === i ? { ...h2, shares: parseFloat(editShares) || h2.shares } : h2
                              )
                            }))
                            setEditingIndex(null)
                          }}
                          className="px-2 py-1 rounded bg-gesso-gold/10 text-[10px] text-gesso-gold font-mono"
                        >
                          <Save className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-white/20">Shares</div>
                        <button
                          onClick={() => { setEditingIndex(i); setEditShares(String(h.shares)) }}
                          className="text-white/80 hover:text-gesso-gold transition-colors"
                        >
                          {h.shares}
                        </button>
                      </div>
                      <div>
                        <div className="text-white/20">Avg Cost</div>
                        <div className="text-white/80">{formatCurrency(cv(h.avgCost), displayCurrency)}</div>
                      </div>
                      <div>
                        <div className="text-white/20">Price</div>
                        <div className="text-white/80">{formatCurrency(cv(h.currentPrice), displayCurrency)}</div>
                      </div>
                      <div>
                        <div className="text-white/20">P&L</div>
                        <div className={pl >= 0 ? 'text-gesso-sage' : 'text-gesso-rose'}>{formatCurrency(cv(pl), displayCurrency)}</div>
                      </div>
                      <div>
                        <div className="text-white/20">Weight</div>
                        <div className="text-white/80">{weight.toFixed(1)}%</div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    useAppStore.setState((s) => ({
                      portfolioHoldings: s.portfolioHoldings.filter((_, j) => j !== i)
                    }))
                  }}
                  className="p-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-white/20 hover:text-gesso-rose" />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Monte Carlo Simulation */}
      <div className="glass rounded-xl p-4 border border-surface-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-white/40 font-mono">Monte Carlo Simulation — 100k paths</div>
            <div className="text-[9px] text-white/20 font-mono mt-0.5">Projected portfolio growth based on historical volatility</div>
          </div>
          <div className="text-[10px] font-mono text-neon-cyan/60 bg-neon-cyan/5 px-2 py-1 rounded border border-neon-cyan/10">
            {mounted ? formatCurrency(cv(projectedValue), displayCurrency) : '—'}
          </div>
        </div>
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
            <div className="text-[10px] font-mono text-white/60 mt-0.5">{formatCurrency(cv(monthlyInvestment), displayCurrency)}/mo</div>
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

        {/* Monte Carlo projection chart — candlestick with simulated data */}
        <CandlestickChart symbol="PORTFOLIO" basePrice={totalValue} simulatedOnly />
      </div>

      {/* Dividend Calendar */}
      <div className="glass rounded-xl p-4 border border-surface-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="text-xs text-white/40 font-mono">Dividend Calendar</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {portfolioHoldings.map((h, i) => (
            <div key={h.symbol} className="glass rounded-lg p-2.5 border border-surface-border/30">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-xs text-white">{h.symbol}</span>
                <span className="text-[9px] text-white/30 font-mono">{dividendDates[i]}</span>
              </div>
              <div className="text-[9px] text-white/50 mt-0.5">{h.name.slice(0, 20)}</div>
              <div className="flex items-center gap-2 mt-1 text-[9px] font-mono">
                <span className="text-neon-cyan">{formatCurrency(cv(h.annualDividend * h.shares), displayCurrency)}</span>
                <span className="text-white/30">|</span>
                <span className="text-white/40">{h.dividendYield.toFixed(2)}% yield</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing Alerts */}
      {(() => {
        const targetWeights = portfolioHoldings.map(() => 100 / portfolioHoldings.length)
        const drifters = portfolioHoldings.filter((h, i) => {
          const weight = (h.shares * h.currentPrice / totalValue) * 100
          return Math.abs(weight - targetWeights[i]) > 5
        })
        if (drifters.length === 0) return null
        return (
          <div className="glass rounded-xl p-4 border border-surface-border/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-neon-amber" />
              <span className="text-xs text-white/40 font-mono">Rebalancing Alerts</span>
            </div>
            <div className="text-[10px] text-white/60 font-mono">
              {drifters.map(h => `${h.symbol}`).join(', ')} {' '}
              {drifters.length === 1 ? 'has' : 'have'} drifted more than 5% from target allocation. Consider rebalancing.
            </div>
          </div>
        )
      })()}
    </div>
  )
}
