'use client'

import { motion } from 'framer-motion'
import { cn, formatCompactCurrency, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { LineChart, BarChart3 } from 'lucide-react'

export default function PerformancePage() {
  const { signalPerformances } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Signal Performance</h1>
        <p className="text-xs text-white/30 font-mono">Track record and statistical breakdown of every signal type</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Best Signal</div>
          <div className="text-sm font-bold text-neon-green mt-0.5">Insider Buying</div>
          <div className="text-[10px] font-mono text-white/30">73.5% Win Rate</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Total Signals</div>
          <div className="text-lg font-bold text-white mt-0.5">897</div>
          <div className="text-[10px] font-mono text-white/30">Across all strategies</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Avg Win Rate</div>
          <div className="text-lg font-bold text-neon-green mt-0.5">68.2%</div>
          <div className="text-[10px] font-mono text-white/30">Weighted average</div>
        </div>
        <div className="stat-box">
          <div className="text-[10px] text-white/30 font-mono">Best Sharpe</div>
          <div className="text-lg font-bold text-neon-cyan mt-0.5">2.1</div>
          <div className="text-[10px] font-mono text-white/30">Insider Buying</div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border/30">
          <span className="text-xs text-white/40 font-mono">Signal Track Record</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[9px] font-mono text-white/30 border-b border-surface-border/20">
                <th className="text-left py-2.5 px-4">Signal Strategy</th>
                <th className="text-center py-2.5 px-3">Signals</th>
                <th className="text-center py-2.5 px-3">Status</th>
                <th className="text-center py-2.5 px-3">Win Rate</th>
                <th className="text-center py-2.5 px-3">Avg Return</th>
                <th className="text-center py-2.5 px-3">Net After Cost</th>
                <th className="text-center py-2.5 px-3">Profit Factor</th>
                <th className="text-center py-2.5 px-3">Max DD</th>
                <th className="text-center py-2.5 px-3">Sharpe</th>
                <th className="text-center py-2.5 px-3">Alpha</th>
              </tr>
            </thead>
            <tbody>
              {signalPerformances.map((sp, i) => (
                <motion.tr
                  key={sp.signalName}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-surface-border/10 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono text-white/80">{sp.signalName}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono text-white/60">{sp.signalsFired}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={cn(
                      'text-[8px] px-1.5 py-0.5 rounded font-mono',
                      sp.dataState === 'validated' ? 'text-neon-green bg-neon-green/10' :
                      sp.dataState === 'preliminary' ? 'text-neon-amber bg-neon-amber/10' :
                      'text-white/30 bg-white/5'
                    )}>
                      {sp.dataState}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {sp.winRate ? (
                      <span className="text-[10px] font-mono text-neon-green">{sp.winRate.toFixed(1)}%</span>
                    ) : (
                      <span className="text-[10px] font-mono text-white/20">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono text-white/60">
                      {sp.avgReturn ? `${sp.avgReturn.toFixed(2)}%` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono text-white/60">
                      {sp.netAfterCost ? `${sp.netAfterCost.toFixed(2)}%` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono text-white/60">
                      {sp.profitFactor ? sp.profitFactor.toFixed(2) : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono text-neon-pink">
                      {sp.maxDD ? `${sp.maxDD.toFixed(1)}%` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono text-white/60">
                      {sp.sharpe ? sp.sharpe.toFixed(2) : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono text-white/60">
                      {sp.alpha ? `${sp.alpha.toFixed(2)}%` : '—'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equity Curve placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4 border border-surface-border/50">
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs text-white/40 font-mono">Equity Curve</span>
          </div>
          <div className="h-40 rounded-lg bg-surface-card border border-surface-border/30 flex items-center justify-center">
            <span className="text-[10px] text-white/20 font-mono">Historical equity curve chart</span>
          </div>
        </div>
        <div className="glass rounded-xl p-4 border border-surface-border/50">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-neon-purple" />
            <span className="text-xs text-white/40 font-mono">Drawdown Analysis</span>
          </div>
          <div className="h-40 rounded-lg bg-surface-card border border-surface-border/30 flex items-center justify-center">
            <span className="text-[10px] text-white/20 font-mono">Historical drawdown chart</span>
          </div>
        </div>
      </div>
    </div>
  )
}
