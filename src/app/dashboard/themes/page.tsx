'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { LayoutGrid, TrendingUp, AlertTriangle, TrendingDown } from 'lucide-react'

export default function ThemesPage() {
  const { macroThemes, setSelectedSymbol } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Themes</h1>
        <p className="text-xs text-white/30 font-mono">Macro themes, sector rotation, and stock screening by theme</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {macroThemes.map((theme, i) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 border border-surface-border/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{theme.name}</h3>
                  <div className={cn(
                    'px-2 py-0.5 rounded-full text-[9px] font-mono',
                    theme.heatPercent >= 70 ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/20' :
                    theme.heatPercent >= 50 ? 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20' :
                    'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                  )}>
                    {theme.heatPercent}% Heat
                  </div>
                </div>
                <div className="text-[10px] text-white/30 font-mono mt-0.5">{theme.timeline}</div>
              </div>
            </div>

            {/* Thesis */}
            <div className="mb-3">
              <div className="text-[9px] text-white/20 font-mono mb-1">THESIS</div>
              <p className="text-xs text-white/60 leading-relaxed">{theme.thesis}</p>
            </div>

            {/* Risks & Contra */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="glass rounded-lg p-2.5 border border-surface-border/20">
                <div className="flex items-center gap-1 text-[9px] text-neon-amber font-mono mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  Key Risks
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed">{theme.keyRisks}</p>
              </div>
              <div className="glass rounded-lg p-2.5 border border-surface-border/20">
                <div className="flex items-center gap-1 text-[9px] text-neon-purple font-mono mb-1">
                  <TrendingDown className="w-3 h-3" />
                  Contrarian View
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed">{theme.contraView}</p>
              </div>
            </div>

            {/* Stocks */}
            <div>
              <div className="text-[9px] text-white/20 font-mono mb-1.5">Related Stocks</div>
              <div className="flex gap-2">
                {theme.stocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className="flex items-center gap-2 glass rounded-lg px-2.5 py-1.5 border border-surface-border/30 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-mono font-semibold text-white">{stock.symbol}</span>
                    <span className="text-[9px] font-mono text-neon-cyan">{stock.signalStrength}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
