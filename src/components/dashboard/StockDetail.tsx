'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency, formatPercent, formatCompactCurrency, formatLargeNumber } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { financialHighlights } from '@/data/mock-data'
import { X, TrendingUp, TrendingDown, BarChart3, FileText, Network, Calendar, BrainCircuit } from 'lucide-react'
import { CandlestickChart } from './CandlestickChart'

const tabs = ['Overview', 'Charts', 'HF Analysis', 'Financials', 'Supply Chain', 'Earnings']

export function StockDetailPanel() {
  const { selectedSymbol, setSelectedSymbol, displayCurrency, exchangeRates } = useAppStore()
  const [activeTab, setActiveTab] = useState('Overview')

  if (!selectedSymbol) return null

  const fin = financialHighlights[selectedSymbol]

  const stats = fin ? [
    { label: 'Market Cap', value: formatCompactCurrency(convertCurrency(fin.marketCap, displayCurrency, exchangeRates), displayCurrency) },
    { label: 'P/E', value: fin.pe.toFixed(1) },
    { label: 'Forward P/E', value: fin.forwardPE.toFixed(1) },
    { label: 'P/B', value: fin.pb.toFixed(1) },
    { label: 'Beta', value: fin.beta.toFixed(2) },
    { label: 'Dividend Yield', value: `${fin.dividendYield.toFixed(2)}%` },
    { label: 'ROE', value: `${fin.roe.toFixed(1)}%` },
    { label: '52W High', value: formatCurrency(convertCurrency(fin.fiftyTwoWeekHigh, displayCurrency, exchangeRates), displayCurrency) },
    { label: '52W Low', value: formatCurrency(convertCurrency(fin.fiftyTwoWeekLow, displayCurrency, exchangeRates), displayCurrency) },
    { label: 'Avg Volume', value: formatLargeNumber(fin.avgVolume) },
    { label: 'Short % Float', value: `${fin.shortPercentFloat.toFixed(1)}%` },
    { label: 'Revenue Growth', value: `${fin.revenueGrowth.toFixed(1)}%` },
  ] : []

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-50 flex items-start justify-end pt-14"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedSymbol(null)} />
      <div className="relative w-full max-w-3xl h-full glass border-l border-surface-border/50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-surface-border/50 p-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">{selectedSymbol}</h2>
              <span className="text-sm text-white/60">{fin?.name || ''}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedSymbol(null)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-border/30 px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-xs font-mono transition-colors border-b-2 shrink-0',
                activeTab === tab
                  ? 'text-neon-cyan border-neon-cyan'
                  : 'text-white/30 border-transparent hover:text-white/50'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              {/* Price */}
              <div className="glass rounded-xl p-4 border border-surface-border/30">
                <div className="text-3xl font-bold text-white">{formatCurrency(convertCurrency(fin?.marketCap ? 880.15 : 0, displayCurrency, exchangeRates), displayCurrency)}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-neon-green font-mono">+2.30 (1.17%)</span>
                  <span className="text-[10px] text-white/30">Today</span>
                </div>
                {/* VWAP stat */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-border/20">
                  <span className="text-[9px] text-white/30 font-mono">VWAP</span>
                  <span className="text-[10px] font-mono text-neon-purple">{formatCurrency(convertCurrency(880.15 * 1.001, displayCurrency, exchangeRates), displayCurrency)}</span>
                  <span className="text-[8px] font-mono text-neon-green">+0.1%</span>
                </div>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-3 gap-2">
                {stats?.map((s) => (
                  <div key={s.label} className="stat-box">
                    <div className="text-[10px] text-white/30 font-mono">{s.label}</div>
                    <div className="text-sm font-mono text-white mt-0.5">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Big Holder Card */}
              <div className="glass rounded-xl p-4 border border-surface-border/30">
                <div className="text-[10px] text-white/30 font-mono mb-2">Big Holder Ownership</div>
                <div className="h-4 rounded-full bg-surface-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-amber"
                    style={{ width: '68%' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-mono">
                  <span className="text-neon-cyan">Big Holders: 68%</span>
                  <span className="text-white/30">▲ +2.1% WoW</span>
                  <span className="text-white/20">Retail: 12%</span>
                </div>
              </div>

              {/* Margin & Short */}
              <div className="glass rounded-xl p-4 border border-surface-border/30">
                <div className="text-[10px] text-white/30 font-mono mb-2">Margin & Short</div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-[9px] text-white/20">Margin</div>
                    <div className="text-sm font-mono text-white">2,450,000</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-white/20">Short</div>
                    <div className="text-sm font-mono text-white">856,000</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-white/20">S/M Ratio</div>
                    <div className="text-sm font-mono text-neon-pink">35%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Charts' && (
            <CandlestickChart
              symbol={selectedSymbol}
              basePrice={fin?.marketCap ? 880.15 : 200}
            />
          )}

          {activeTab === 'HF Analysis' && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 border border-surface-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="w-4 h-4 text-neon-cyan" />
                  <span className="text-xs text-white/40 font-mono">AI Research Memo</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  NVIDIA continues to lead the AI infrastructure buildout with its next-generation Blackwell platform.
                  Strong institutional accumulation confirmed via 13F filings showing increased positions across major hedge funds.
                  Risk: cyclical semiconductor downturn and export control uncertainty.
                </p>
              </div>

              <div className="glass rounded-xl p-4 border border-surface-border/30">
                <div className="text-[10px] text-white/30 font-mono mb-2">Market Consensus</div>
                <div className="flex gap-4">
                  <div className="flex-1 text-center py-3 rounded-lg bg-neon-green/5">
                    <div className="text-lg font-bold text-neon-green">42</div>
                    <div className="text-[10px] text-white/30">Buy</div>
                  </div>
                  <div className="flex-1 text-center py-3 rounded-lg bg-neon-amber/5">
                    <div className="text-lg font-bold text-neon-amber">8</div>
                    <div className="text-[10px] text-white/30">Hold</div>
                  </div>
                  <div className="flex-1 text-center py-3 rounded-lg bg-neon-pink/5">
                    <div className="text-lg font-bold text-neon-pink">3</div>
                    <div className="text-[10px] text-white/30">Sell</div>
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-mono text-white/30">
                  <span>Mean Target: $980</span>
                  <span>High: $1,200</span>
                  <span>Low: $750</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Financials' && (
            <div className="glass rounded-xl p-8 border border-surface-border/30 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <div className="text-xs text-white/30 font-mono">Financial highlights: margins, ROE, revenue, EPS, debt...</div>
              </div>
            </div>
          )}

          {activeTab === 'Supply Chain' && (
            <div className="glass rounded-xl p-8 border border-surface-border/30 flex items-center justify-center">
              <div className="text-center">
                <Network className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <div className="text-xs text-white/30 font-mono">Supply chain map with supplier & customer exposure</div>
              </div>
            </div>
          )}

          {activeTab === 'Earnings' && (
            <div className="glass rounded-xl p-8 border border-surface-border/30 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <div className="text-xs text-white/30 font-mono">Earnings calendar & historical EPS records</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
