'use client'

import { motion } from 'framer-motion'
import { cn, formatCurrency, formatCompactCurrency, timeAgo } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'
import { DataSourceTooltip } from '@/components/ui/DataSourceTooltip'

const urgencyColors = {
  high: 'text-neon-pink bg-neon-pink/10 border-neon-pink/20',
  medium: 'text-neon-amber bg-neon-amber/10 border-neon-amber/20',
  low: 'text-white/40 bg-white/5 border-white/10',
}

const typeLabels: Record<string, string> = {
  sell_alert: 'Sell Alert',
  pledge_risk: 'Pledge Risk',
  director_buy: 'Director Buy',
  management_change: 'Mgmt Change',
}

export default function InsiderPage() {
  const { insiderTransactions, displayCurrency, exchangeRates } = useAppStore()

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Insider Tracker</h1>
          <p className="text-xs text-white/30 font-mono">Director transactions, pledge risks, management changes</p>
        </div>
        <DataSourceTooltip sources={[
          { label: 'Insider Trades', source: 'partial', detail: 'Filing dates & form types from real SEC EDGAR data. Insider names and share amounts are algorithmically enriched from filing metadata.' },
        ]} />
      </div>

      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30">
          <span className="text-xs text-white/40 font-mono">Recent Insider Activity</span>
        </div>
        <div className="divide-y divide-surface-border/10">
          {insiderTransactions.map((tx, i) => (
            <motion.div
              key={`${tx.symbol}-${i}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-20">
                <span className="text-sm font-mono font-semibold text-white">{tx.symbol}</span>
              </div>
              <div className="w-36">
                <span className="text-[10px] text-white/50">{tx.name}</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-2 text-[10px] font-mono">
                <div>
                  <div className="text-white/20">Insider</div>
                  <div className="text-white/80">{tx.insiderName}</div>
                </div>
                <div>
                  <div className="text-white/20">Type</div>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[9px]',
                    urgencyColors[tx.urgency]
                  )}>
                    {typeLabels[tx.type] || tx.type}
                  </span>
                </div>
                <div>
                  <div className="text-white/20">Shares</div>
                  <div className="text-white/80">{tx.shares.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-white/20">Value</div>
                  <div className="text-white/80">{formatCompactCurrency(convertCurrency(tx.value, displayCurrency, exchangeRates), displayCurrency)}</div>
                </div>
              </div>
              <div className="text-[9px] text-white/30 font-mono w-16 text-right">{tx.date}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
