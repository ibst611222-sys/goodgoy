'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { BarChart3, LineChart, TrendingUp, TrendingDown } from 'lucide-react'

export default function BacktestPage() {
  const { signalPerformances } = useAppStore()
  const [zScore, setZScore] = useState(2.0)
  const [streak, setStreak] = useState(0)
  const [edgeScore, setEdgeScore] = useState(0)
  const [holdPeriod, setHoldPeriod] = useState(5)
  const [requireFINI, setRequireFINI] = useState(true)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Backtest</h1>
        <p className="text-xs text-white/30 font-mono">Signal performance & strategy explorer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Strategy Explorer */}
        <div className="glass rounded-xl p-4 border border-surface-border/50">
          <h3 className="text-xs text-white/40 font-mono mb-4">Strategy Explorer</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-white/40">Min Z-Score</span>
                <span className="text-white/80">{zScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={zScore}
                onChange={(e) => setZScore(parseFloat(e.target.value))}
                className="w-full accent-cosmic-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-white/40">Min Streak (days)</span>
                <span className="text-white/80">{streak}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={streak}
                onChange={(e) => setStreak(parseInt(e.target.value))}
                className="w-full accent-cosmic-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-white/40">Min Edge Score</span>
                <span className="text-white/80">{edgeScore}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={edgeScore}
                onChange={(e) => setEdgeScore(parseInt(e.target.value))}
                className="w-full accent-cosmic-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-white/40">Hold Period (days)</span>
                <span className="text-white/80">{holdPeriod}</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={holdPeriod}
                onChange={(e) => setHoldPeriod(parseInt(e.target.value))}
                className="w-full accent-cosmic-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requireFINI}
                onChange={(e) => setRequireFINI(e.target.checked)}
                className="accent-cosmic-500"
              />
              <span className="text-[10px] text-white/40 font-mono">Require FINI Confirmation</span>
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 rounded-lg bg-cosmic-600/20 border border-cosmic-500/30 text-[10px] text-neon-cyan font-mono hover:bg-cosmic-600/30 transition-colors"
            >
              Run Backtest →
            </motion.button>
          </div>
        </div>

        {/* Results preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Equity curve placeholder */}
          <div className="glass rounded-xl p-4 border border-surface-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-mono">Equity Curve</span>
              <LineChart className="w-4 h-4 text-white/20" />
            </div>
            <div className="h-32 rounded-lg bg-surface-card border border-surface-border/30 flex items-center justify-center">
              <span className="text-[10px] text-white/20 font-mono">Adjust parameters and run backtest</span>
            </div>
          </div>

          {/* Signal Performance table */}
          <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
            <div className="p-3 border-b border-surface-border/30">
              <span className="text-xs text-white/40 font-mono">Signal Track Record</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[9px] font-mono text-white/30 border-b border-surface-border/20">
                    <th className="text-left py-2 px-3">Signal</th>
                    <th className="text-right py-2 px-3">Fired</th>
                    <th className="text-right py-2 px-3">Status</th>
                    <th className="text-right py-2 px-3">Win%</th>
                    <th className="text-right py-2 px-3">Avg Ret</th>
                    <th className="text-right py-2 px-3">Net</th>
                    <th className="text-right py-2 px-3">Sharpe</th>
                    <th className="text-right py-2 px-3">Max DD</th>
                  </tr>
                </thead>
                <tbody>
                  {signalPerformances.map((sp) => (
                    <tr key={sp.signalName} className="border-b border-surface-border/10 hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 text-[10px] font-mono text-white/80">{sp.signalName}</td>
                      <td className="py-2.5 px-3 text-[10px] font-mono text-white/60 text-right">{sp.signalsFired}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded font-mono',
                          sp.dataState === 'validated' ? 'text-neon-green bg-neon-green/10' :
                          sp.dataState === 'preliminary' ? 'text-neon-amber bg-neon-amber/10' :
                          'text-white/30 bg-white/5'
                        )}>
                          {sp.dataState}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[10px] font-mono text-right">
                        {sp.winRate ? <span className="text-neon-green">{sp.winRate.toFixed(1)}%</span> : <span className="text-white/20">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] font-mono text-right text-white/60">
                        {sp.avgReturn ? `${sp.avgReturn.toFixed(2)}%` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] font-mono text-right text-white/60">
                        {sp.netAfterCost ? `${sp.netAfterCost.toFixed(2)}%` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] font-mono text-right text-white/60">
                        {sp.sharpe ? sp.sharpe.toFixed(2) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] font-mono text-right text-neon-pink">
                        {sp.maxDD ? `${sp.maxDD.toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
