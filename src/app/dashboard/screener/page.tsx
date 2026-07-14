'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency, formatPercent, formatCompactCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { Search, Filter, SlidersHorizontal, Download } from 'lucide-react'
import { downloadCSV } from '@/lib/export-csv'

const presets = [
  { id: 'mom', name: 'Strong Momentum', desc: 'Streak ≥ 3 · Z-Score ≥ 2.0 · FINI confirmed' },
  { id: 'concentration', name: 'Chip Concentration', desc: 'Big Holder ≥ 60% · Z-Score ≥ 1.5' },
  { id: 'fini_plus', name: 'FINI + Smart Money', desc: 'FINI + Trust both buying · Streak ≥ 2' },
  { id: 'big_holder', name: 'Big Holder High', desc: 'Big Holder ≥ 70% · Market Cap ≥ $50B' },
  { id: 'breakout', name: 'Breaking Out', desc: 'Z-Score ≥ 3.0 · Volume anomaly' },
]

export default function ScreenerPage() {
  const { setSelectedSymbol, stocks, displayCurrency, exchangeRates } = useAppStore()
  const curSymbol = displayCurrency === 'USD' ? '$' : displayCurrency === 'EUR' ? '€' : displayCurrency === 'GBP' ? '£' : displayCurrency === 'JPY' ? '¥' : '$'
  const [activePreset, setActivePreset] = useState(presets[0].id)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sector, setSector] = useState('All')

  const filtered = stocks.filter(s => {
    if (sector !== 'All' && s.sector !== sector) return false
    if (minPrice && s.price < parseFloat(minPrice)) return false
    if (maxPrice && s.price > parseFloat(maxPrice)) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Screener</h1>
        <p className="text-xs text-white/30 font-mono">Screen stocks by chip metrics</p>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setActivePreset(preset.id)}
            className={cn(
              'text-left glass rounded-lg p-3 border transition-all card-hover',
              activePreset === preset.id
                ? 'border-cosmic-500/50 bg-cosmic-600/10'
                : 'border-surface-border/30'
            )}
          >
            <div className="text-[10px] font-semibold text-white">{preset.name}</div>
            <div className="text-[8px] text-white/30 mt-0.5 leading-tight">{preset.desc}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-3 border border-surface-border/50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 font-mono">{curSymbol} Price</span>
            <input
              type="text"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-16 bg-surface-card border border-surface-border rounded px-2 py-1 text-[10px] font-mono text-white/60 focus:outline-none focus:border-cosmic-500/50"
            />
            <span className="text-white/20">—</span>
            <input
              type="text"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-16 bg-surface-card border border-surface-border rounded px-2 py-1 text-[10px] font-mono text-white/60 focus:outline-none focus:border-cosmic-500/50"
            />
          </div>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-surface-card border border-surface-border rounded px-3 py-1 text-[10px] font-mono text-white/60 focus:outline-none focus:border-cosmic-500/50"
          >
            <option value="All">All Sectors</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Financial">Financial</option>
            <option value="Energy">Energy</option>
            <option value="Automotive">Automotive</option>
            <option value="Consumer Defensive">Consumer Defensive</option>
          </select>
          <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cosmic-600/20 border border-cosmic-500/30 text-[10px] text-neon-cyan font-mono hover:bg-cosmic-600/30 transition-colors">
            <Search className="w-3 h-3" />
            Run Screener
          </button>
          <span className="text-[10px] text-white/20 font-mono">{filtered.length} results</span>
          <button onClick={() => downloadCSV(
            filtered.map(s => ({ Symbol: s.symbol, Name: s.name, Price: s.price, Change: s.changePercent + '%', 'Mkt Cap': s.marketCap, Sector: s.sector })),
            [{ key: 'Symbol', label: 'Symbol' }, { key: 'Name', label: 'Name' }, { key: 'Price', label: 'Price' }, { key: 'Change', label: 'Change' }, { key: 'Mkt Cap', label: 'Market Cap' }, { key: 'Sector', label: 'Sector' }],
            `screener-${new Date().toISOString().slice(0, 10)}`
          )} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-neon-cyan transition-colors">
            <Download className="w-3 h-3" />
            CSV
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="divide-y divide-surface-border/10">
          {filtered.map((stock, i) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelectedSymbol(stock.symbol)}
              className="flex items-center px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="w-20">
                <span className="text-xs font-mono font-semibold text-white">{stock.symbol}</span>
              </div>
              <div className="w-40">
                <span className="text-[10px] text-white/50">{stock.name}</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-4 text-[10px] font-mono">
                <div>
                  <div className="text-white/20">Price</div>
                  <div className="text-white/80">{formatCurrency(convertCurrency(stock.price, displayCurrency, exchangeRates), displayCurrency)}</div>
                </div>
                <div>
                  <div className="text-white/20">Change</div>
                  <div className={stock.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink'}>
                    {formatPercent(stock.changePercent)}
                  </div>
                </div>
                <div>
                  <div className="text-white/20">Mkt Cap</div>
                  <div className="text-white/80">{formatCompactCurrency(convertCurrency(stock.marketCap, displayCurrency, exchangeRates), displayCurrency)}</div>
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
    </div>
  )
}
