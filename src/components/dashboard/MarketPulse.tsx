'use client'

import { useAppStore } from '@/store/use-app-store'
import { formatCompactCurrency, formatPercent } from '@/lib/utils'
import { convertCurrency } from '@/lib/exchange-rates'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'
import { TrendingUp, TrendingDown, Activity, BarChart3, RefreshCw } from 'lucide-react'

export function MarketPulse() {
  const { marketPulse, refreshData, lastRefresh, displayCurrency, exchangeRates } = useAppStore()
  const convertedFini = convertCurrency(marketPulse.finiNetFlow, displayCurrency, exchangeRates)

  const items = [
    {
      label: 'S&P 500',
      value: marketPulse.spyPrice.toLocaleString(),
      change: formatPercent(marketPulse.spyChangePercent),
      positive: marketPulse.spyChangePercent >= 0,
      icon: BarChart3,
    },
    {
      label: 'Fear & Greed',
      value: marketPulse.fearGreedScore,
      sub: marketPulse.fearGreedScore > 60 ? 'Greed' : marketPulse.fearGreedScore > 40 ? 'Neutral' : 'Fear',
      subColor: marketPulse.fearGreedScore > 60 ? 'text-neon-green' : marketPulse.fearGreedScore > 40 ? 'text-neon-amber' : 'text-neon-pink',
      icon: Activity,
    },
    {
      label: 'Institutional Flow',
      value: formatCompactCurrency(convertedFini, displayCurrency),
      positive: marketPulse.finiNetFlow >= 0,
      icon: TrendingUp,
    },
    {
      label: 'Active Signals',
      value: marketPulse.totalSignalCount,
      icon: TrendingDown,
    },
    {
      label: 'Advancers',
      value: marketPulse.advancers,
      sub: `Decliners: ${marketPulse.decliners}`,
      positive: marketPulse.advancers > marketPulse.decliners,
      icon: Activity,
    },
  ]

  return (
    <div className="glass rounded-xl border border-surface-border/50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs text-white/40 font-mono">LIVE</span>
          <span className="text-[10px] text-white/20 font-mono" suppressHydrationWarning>
            {lastRefresh.toLocaleTimeString()}
          </span>
          <DataSourceTooltip sources={[
            { label: 'Stock Prices', source: 'live', detail: 'Real-time quotes from Financial Modeling Prep (FMP) API — prices, change, volume, market cap.' },
            { label: 'Fear & Greed', source: 'partial', detail: 'Score is a simplified estimate. Sub-components (Branch, Flow, etc.) use random fill.' },
            { label: 'Institutional Flow', source: 'mock', detail: 'FINI net flow data is not available on the free FMP tier.' },
            { label: 'Advancers/Decliners', source: 'partial', detail: 'Estimated — real NYSE/NASDAQ advance-decline data requires a paid exchange feed.' },
          ]} />
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>
      <div className="flex divide-x divide-surface-border/30 overflow-x-auto">
        {items.map((item) => (
          <div key={item.label} className="flex-1 min-w-[130px] px-4 py-3">
            <div className="text-[10px] text-white/40 font-mono mb-1">{item.label}</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{item.value}</span>
              {'change' in item && (
                <span className={`text-xs font-mono ${item.positive ? 'text-neon-green' : 'text-neon-pink'}`}>
                  {item.change}
                </span>
              )}
              {'positive' in item && !('change' in item) && (
                <span className={`text-xs ${item.positive ? 'text-neon-green' : 'text-neon-pink'}`}>
                  {item.positive ? '↑' : '↓'}
                </span>
              )}
            </div>
            {'sub' in item && (
              <div className={`text-[10px] font-mono mt-0.5 ${item.subColor || 'text-white/30'}`}>
                {item.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
