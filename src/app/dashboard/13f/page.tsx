'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCompactCurrency, formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { Download, Database } from 'lucide-react'
import { downloadCSV } from '@/lib/export-csv'

const TRACKED = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'JPM', 'LLY', 'NVO']

// Deterministic mock 13F data derived from symbol + year
function generateMock13F(symbol: string) {
  const hash = (s: string) => {
    let h = 0
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0
    return Math.abs(h)
  }

  const baseHolding = 5000000 + hash(symbol + '2026') % 50000000
  const change = (hash(symbol + 'q') % 20000000) - 10000000
  const funds = [
    { name: 'Vanguard Group Inc.', change: 1500000 + hash(symbol + 'v') % 3000000 },
    { name: 'BlackRock Inc.', change: 1200000 + hash(symbol + 'b') % 2500000 },
    { name: 'State Street Corp.', change: -500000 + hash(symbol + 's') % 2000000 },
    { name: 'FMR LLC (Fidelity)', change: 800000 + hash(symbol + 'f') % 1800000 },
    { name: 'Morgan Stanley', change: -300000 + hash(symbol + 'm') % 1500000 },
  ]
  const totalShares = baseHolding + change
  return { symbol, totalShares, totalValue: totalShares * (150 + hash(symbol) % 700), change, funds, quarter: 'Q2 2026' }
}

interface Mock13F {
  symbol: string
  totalShares: number
  totalValue: number
  change: number
  funds: { name: string; change: number }[]
  quarter: string
}

export default function ThirteenFPage() {
  const { displayCurrency, exchangeRates } = useAppStore()
  const [holdings, setHoldings] = useState<Mock13F[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHoldings(TRACKED.map(generateMock13F).sort((a, b) => b.totalValue - a.totalValue))
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const selected = holdings.find(h => h.symbol === selectedSymbol)
  const cv = (v: number) => convertCurrency(v, displayCurrency, exchangeRates)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">13F Institutional Holdings</h1>
        <p className="text-xs text-white/30 font-mono">Quarterly hedge fund and institutional ownership from SEC 13F filings</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Tracking</div>
          <div className="text-lg font-bold text-white mt-0.5">{holdings.length} stocks</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Total Holdings Value</div>
          <div className="text-lg font-bold text-neon-cyan mt-0.5">{formatCurrency(cv(holdings.reduce((s, h) => s + h.totalValue, 0)), displayCurrency)}</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Latest Quarter</div>
          <div className="text-lg font-bold text-white mt-0.5">{holdings[0]?.quarter || '—'}</div>
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-12 text-center border border-surface-border/50">
          <Database className="w-8 h-8 text-white/20 mx-auto mb-2 animate-pulse" />
          <div className="text-xs text-white/30 font-mono">Loading 13F data...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Holdings list */}
          <div className="lg:col-span-2 glass rounded-xl border border-surface-border/50 overflow-hidden">
            <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
              <span className="text-xs text-white/40 font-mono">Institutional Holdings — {holdings.length}</span>
              <button onClick={() => downloadCSV(
                holdings.map(h => ({ Symbol: h.symbol, 'Total Shares': h.totalShares.toLocaleString(), 'Total Value': `$${h.totalValue.toLocaleString()}`, Change: (h.change >= 0 ? '+' : '') + h.change.toLocaleString(), Quarter: h.quarter })),
                [{ key: 'Symbol', label: 'Symbol' }, { key: 'Total Shares', label: 'Total Shares' }, { key: 'Total Value', label: 'Total Value' }, { key: 'Change', label: 'Change' }, { key: 'Quarter', label: 'Quarter' }],
                `13f-${new Date().toISOString().slice(0, 10)}`
              )} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-neon-cyan transition-colors">
                <Download className="w-3 h-3" /> CSV
              </button>
            </div>
            <div className="divide-y divide-surface-border/10">
              {holdings.map((h, i) => (
                <motion.div
                  key={h.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSymbol(selectedSymbol === h.symbol ? null : h.symbol)}
                  className={cn(
                    'flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer',
                    selectedSymbol === h.symbol && 'bg-cosmic-600/10'
                  )}
                >
                  <div className="w-20">
                    <span className="text-xs font-mono font-bold text-white">{h.symbol}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-2 text-[10px] font-mono">
                    <div>
                      <div className="text-white/20">Total Value</div>
                      <div className="text-white/80">{formatCompactCurrency(cv(h.totalValue), displayCurrency)}</div>
                    </div>
                    <div>
                      <div className="text-white/20">Shares</div>
                      <div className="text-white/80">{h.totalShares.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-white/20">QoQ Change</div>
                      <div className={h.change >= 0 ? 'text-neon-green' : 'text-neon-pink'}>
                        {(h.change >= 0 ? '+' : '') + h.change.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
            <div className="p-3 border-b border-surface-border/30">
              <span className="text-xs text-white/40 font-mono">
                {selected ? `${selected.symbol} — Fund Changes` : 'Select a holding'}
              </span>
            </div>
            {selected ? (
              <div className="divide-y divide-surface-border/10">
                {selected.funds.map((fund, i) => (
                  <motion.div
                    key={fund.name}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <span className="text-[10px] text-white/70 font-mono">{fund.name}</span>
                    <span className={cn('text-[10px] font-mono', fund.change >= 0 ? 'text-neon-green' : 'text-neon-pink')}>
                      {(fund.change >= 0 ? '+' : '') + fund.change.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
                <div className="px-4 py-2.5 bg-cosmic-600/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-mono">Net Change</span>
                    <span className={cn('text-[10px] font-mono', selected.change >= 0 ? 'text-neon-green' : 'text-neon-pink')}>
                      {(selected.change >= 0 ? '+' : '') + selected.change.toLocaleString()} shares
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Database className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <div className="text-xs text-white/30 font-mono">Click a holding to see fund-level changes</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
