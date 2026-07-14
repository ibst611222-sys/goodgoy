'use client'

import { useState } from 'react'
import { Info, Wifi, WifiOff, Database, TrendingUp, FileText, Users, Building2, Sigma, RefreshCw } from 'lucide-react'
import { SUPPORTED_CURRENCIES } from '@/lib/exchange-rates'
import { useAppStore } from '@/store/use-app-store'

interface SourceInfo {
  label: string
  source: 'live' | 'derived' | 'mock' | 'partial'
  detail: string
}

const sourceIcons = {
  live: Wifi,
  derived: TrendingUp,
  mock: WifiOff,
  partial: Database,
}

const sourceColors = {
  live: 'text-neon-green bg-neon-green/10 border-neon-green/20',
  derived: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20',
  mock: 'text-white/30 bg-white/5 border-white/10',
  partial: 'text-neon-amber bg-neon-amber/10 border-neon-amber/20',
}

const sectionIcons: Record<string, typeof Wifi> = {
  'Stock Prices': Building2,
  'Market Pulse': TrendingUp,
  'Signals': Sigma,
  'Sector Flows': Building2,
  'Insider Trades': Users,
  'News Feed': FileText,
}

export function DataSourceTooltip({ sources }: { sources: SourceInfo[] }) {
  const [open, setOpen] = useState(false)
  const { displayCurrency } = useAppStore()
  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.code === displayCurrency)

  return (
    <div className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="p-1 rounded hover:bg-white/[0.05] transition-colors text-white/20 hover:text-white/50"
      >
        <Info className="w-3 h-3" />
      </button>

      {open && (
        <div
          className="absolute bottom-full right-0 mb-2 w-64 z-50"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="glass rounded-xl border border-surface-border/50 p-3 shadow-2xl">
            <div className="text-[9px] font-mono text-white/40 mb-2 uppercase tracking-wider">Data Sources</div>
            <div className="space-y-2">
              {sources.map((s, i) => {
                const Icon = sectionIcons[s.label] || Database
                const colorClass = sourceColors[s.source]
                return (
                  <div key={i} className="flex items-start gap-2">
                    <Icon className="w-3 h-3 text-white/30 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-white/80">{s.label}</span>
                        <span className={`text-[7px] font-mono px-1 py-0.5 rounded border ${colorClass}`}>
                          {s.source.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[8px] text-white/30 mt-0.5 leading-relaxed">{s.detail}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Exchange rates footer */}
            <div className="mt-2 pt-2 border-t border-surface-border/20">
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-2.5 h-2.5 text-white/20" />
                <span className="text-[7px] font-mono text-white/30 uppercase tracking-wider">Currency</span>
                <span className="text-[7px] font-mono text-neon-cyan/60 bg-neon-cyan/5 px-1 py-0.5 rounded border border-neon-cyan/10 ml-auto">
                  {currentCurrency ? currentCurrency.label : 'USD $'}
                </span>
              </div>
              <div className="text-[7px] text-white/20 mt-0.5 leading-relaxed">
                Live exchange rates from open.er-api.com — updated hourly. No API key required.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
