'use client'

import { motion } from 'framer-motion'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { Calendar } from 'lucide-react'

const earningsReports_data = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', date: '2026-08-28', quarter: 'Q2 2027', actualEPS: 0.68, estimatedEPS: 0.64, surprisePercent: 6.25, priceReaction1d: 4.2, priceReaction3d: 6.8, priceReaction5d: 5.1 },
  { symbol: 'AAPL', name: 'Apple Inc.', date: '2026-07-31', quarter: 'Q3 2026', actualEPS: 1.52, estimatedEPS: 1.48, surprisePercent: 2.70, priceReaction1d: 0.8, priceReaction3d: 1.2, priceReaction5d: -0.5 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', date: '2026-07-25', quarter: 'Q4 2026', actualEPS: 2.94, estimatedEPS: 2.82, surprisePercent: 4.26, priceReaction1d: 2.1, priceReaction3d: 3.4, priceReaction5d: 4.0 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', date: '2026-07-24', quarter: 'Q2 2026', actualEPS: 1.89, estimatedEPS: 1.85, surprisePercent: 2.16, priceReaction1d: -0.3, priceReaction3d: 1.1, priceReaction5d: 2.3 },
  { symbol: 'META', name: 'Meta Platforms Inc.', date: '2026-07-31', quarter: 'Q2 2026', actualEPS: 5.32, estimatedEPS: 5.05, surprisePercent: 5.35, priceReaction1d: 3.8, priceReaction3d: 5.2, priceReaction5d: 4.6 },
]

export default function EarningsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Earnings Calendar</h1>
        <p className="text-xs text-white/30 font-mono">Upcoming reports, surprise tracker, and price reactions</p>
      </div>

      {/* Upcoming */}
      <div className="glass rounded-xl p-4 border border-surface-border/50">
        <div className="text-xs text-white/40 font-mono mb-3">Upcoming Earnings (Next 7 Days)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { symbol: 'JPM', name: 'JPMorgan Chase', date: 'Jul 18', estEPS: '$4.32' },
            { symbol: 'TSLA', name: 'Tesla Inc.', date: 'Jul 24', estEPS: '$0.62' },
            { symbol: 'LLY', name: 'Eli Lilly', date: 'Aug 8', estEPS: '$4.85' },
          ].map((item) => (
            <div key={item.symbol} className="glass rounded-lg p-3 border border-surface-border/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-semibold text-sm text-white">{item.symbol}</span>
                <span className="text-[10px] text-white/40 font-mono">{item.date}</span>
              </div>
              <div className="text-[10px] text-white/50">{item.name}</div>
              <div className="text-[10px] font-mono text-white/30 mt-1">Est: {item.estEPS}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Surprise Tracker */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
          <span className="text-xs text-white/40 font-mono">Earnings Surprise Tracker</span>
          <span className="text-[9px] text-white/20 font-mono">EPS vs Estimate</span>
        </div>
        <div className="divide-y divide-surface-border/10">
          {earningsReports_data.map((er, i) => (
            <motion.div
              key={`${er.symbol}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-16">
                <span className="text-sm font-mono font-semibold text-white">{er.symbol}</span>
              </div>
              <div className="w-32">
                <span className="text-[10px] text-white/50">{er.name}</span>
              </div>
              <div className="flex-1 grid grid-cols-5 gap-2 text-[10px] font-mono">
                <div>
                  <div className="text-white/20">Quarter</div>
                  <div className="text-white/80">{er.quarter}</div>
                </div>
                <div>
                  <div className="text-white/20">Actual</div>
                  <div className="text-white/80">${er.actualEPS.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-white/20">Estimate</div>
                  <div className="text-white/80">${er.estimatedEPS.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-white/20">Surprise</div>
                  <div className="text-neon-green">{er.surprisePercent.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-white/20">1d Reax</div>
                  <div className={er.priceReaction1d >= 0 ? 'text-neon-green' : 'text-neon-pink'}>
                    {er.priceReaction1d >= 0 ? '+' : ''}{er.priceReaction1d}%
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-white/30 font-mono w-20 text-right">{er.date}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
