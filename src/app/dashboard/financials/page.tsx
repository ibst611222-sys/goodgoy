'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { getIncomeStatements } from '@/lib/fmp-client'
import { DollarSign, TrendingUp, TrendingDown, Download } from 'lucide-react'
import { downloadCSV } from '@/lib/export-csv'

const TRACKED = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'TSLA', 'JPM', 'LLY', 'AMZN', 'NVO']

export default function FinancialsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA')
  const [incomeData, setIncomeData] = useState<Awaited<ReturnType<typeof getIncomeStatements>>>([])

  useEffect(() => {
    getIncomeStatements(selectedSymbol).then(setIncomeData)
  }, [selectedSymbol])

  const current = incomeData[0]
  const prev = incomeData[1]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Financials</h1>
        <p className="text-xs text-white/30 font-mono">Revenue, margins, and key financial metrics over time</p>
      </div>

      {/* Symbol selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TRACKED.map(s => (
          <button key={s} onClick={() => setSelectedSymbol(s)} className={cn('px-3 py-1.5 rounded-full text-[10px] font-mono transition-all border whitespace-nowrap', selectedSymbol === s ? 'bg-cosmic-600/20 text-neon-cyan border-cosmic-500/30' : 'text-white/30 border-white/10 hover:border-white/20')}>
            {s}
          </button>
        ))}
      </div>

      {/* Income Statement summary */}
      {current && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Revenue" value={formatCurrency(current.revenue)} change={prev ? ((current.revenue - prev.revenue) / prev.revenue * 100).toFixed(1) + '%' : null} positive={current.revenue >= (prev?.revenue || 0)} />
          <StatBox label="Gross Profit" value={formatCurrency(current.grossProfit)} change={`${(current.grossMargin * 100).toFixed(1)}% margin`} positive />
          <StatBox label="Operating Income" value={formatCurrency(current.operatingIncome)} change={`${(current.operatingMargin * 100).toFixed(1)}% margin`} positive />
          <StatBox label="Net Income" value={formatCurrency(current.netIncome)} change={`${(current.profitMargin * 100).toFixed(1)}% margin`} positive />
        </div>
      )}

      {/* Income Statement table */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
          <span className="text-xs text-white/40 font-mono">{selectedSymbol} — Income Statement</span>
          <button onClick={() => downloadCSV(
            incomeData.slice(0, 4).reverse().map(d => ({ Date: d.date, Revenue: `$${d.revenue.toLocaleString()}`, 'Gross Profit': `$${d.grossProfit.toLocaleString()}`, 'Operating Income': `$${d.operatingIncome.toLocaleString()}`, 'Net Income': `$${d.netIncome.toLocaleString()}`, EPS: `$${d.eps.toFixed(2)}`, 'Gross Margin': `${(d.grossMargin * 100).toFixed(1)}%`, 'Operating Margin': `${(d.operatingMargin * 100).toFixed(1)}%`, 'Profit Margin': `${(d.profitMargin * 100).toFixed(1)}%` })),
            [{ key: 'Date', label: 'Date' }, { key: 'Revenue', label: 'Revenue' }, { key: 'Gross Profit', label: 'Gross Profit' }, { key: 'Operating Income', label: 'Operating Income' }, { key: 'Net Income', label: 'Net Income' }, { key: 'EPS', label: 'EPS' }, { key: 'Gross Margin', label: 'Gross Margin' }, { key: 'Operating Margin', label: 'Operating Margin' }, { key: 'Profit Margin', label: 'Profit Margin' }],
            `${selectedSymbol}-income-${new Date().toISOString().slice(0, 10)}`
          )} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-neon-cyan transition-colors">
            <Download className="w-3 h-3" />
            CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-surface-border/20 text-white/30">
                <th className="text-left py-2 px-3">Metric</th>
                {incomeData.slice(0, 4).reverse().map(d => <th key={d.date} className="text-right py-2 px-3">{d.date}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/10">
              {[
                { label: 'Revenue', values: incomeData.slice(0, 4).map(d => formatCurrency(d.revenue)) },
                { label: 'Gross Profit', values: incomeData.slice(0, 4).map(d => formatCurrency(d.grossProfit)) },
                { label: 'Operating Income', values: incomeData.slice(0, 4).map(d => formatCurrency(d.operatingIncome)) },
                { label: 'Net Income', values: incomeData.slice(0, 4).map(d => formatCurrency(d.netIncome)) },
                { label: 'EPS', values: incomeData.slice(0, 4).map(d => `$${d.eps.toFixed(2)}`) },
                { label: 'Gross Margin', values: incomeData.slice(0, 4).map(d => `${(d.grossMargin * 100).toFixed(1)}%`) },
                { label: 'Operating Margin', values: incomeData.slice(0, 4).map(d => `${(d.operatingMargin * 100).toFixed(1)}%`) },
                { label: 'Profit Margin', values: incomeData.slice(0, 4).map(d => `${(d.profitMargin * 100).toFixed(1)}%`) },
                { label: 'Revenue Growth', values: incomeData.slice(0, 4).map(d => d.revenueGrowth != null ? `${(d.revenueGrowth * 100).toFixed(1)}%` : '—') },
              ].map(row => (
                <tr key={row.label} className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-white/60">{row.label}</td>
                  {row.values.map((v, i) => <td key={i} className="py-2 px-3 text-right text-white/80">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!current && (
        <div className="glass rounded-xl p-8 text-center border border-surface-border/50">
          <DollarSign className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <div className="text-xs text-white/30 font-mono">Select a symbol above to view financial data</div>
          <div className="text-[10px] text-white/20 mt-1">Data from FMP free tier</div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, change, positive }: { label: string; value: string; change: string | null; positive: boolean }) {
  return (
    <div className="stat-box">
      <div className="text-[10px] text-white/30 font-mono">{label}</div>
      <div className="text-lg font-bold text-white mt-0.5">{value}</div>
      {change && <div className={cn('text-[10px] font-mono mt-0.5', positive ? 'text-neon-green' : 'text-neon-pink')}>{change}</div>}
    </div>
  )
}
