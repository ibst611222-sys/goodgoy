'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Settings, Eye, EyeOff, RefreshCw } from 'lucide-react'

const WIDGETS = [
  { id: 'fear-greed', label: 'Fear & Greed Index' },
  { id: 'movers', label: "Today's Movers" },
  { id: 'chip-radar', label: 'Chip Radar' },
  { id: 'heatmap', label: 'Market Heatmap' },
  { id: 'signals', label: 'Active Signals' },
]

export function DashboardCustomizer() {
  const { hiddenWidgets, toggleWidget, refreshInterval, setRefreshInterval } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-gesso-gold transition-colors"
      >
        <Settings className="w-3 h-3" />
        Customize
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-64 glass-elevated rounded-xl border border-surface-border/50 overflow-hidden z-50"
          >
            <div className="px-3 py-2.5 border-b border-surface-border/30">
              <span className="text-[10px] font-mono text-white/60">Dashboard Widgets</span>
            </div>

            <div className="py-1.5">
              {WIDGETS.map((widget) => {
                const isHidden = hiddenWidgets.includes(widget.id)
                return (
                  <button
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                  >
                    {isHidden ? (
                      <EyeOff className="w-3 h-3 text-white/20" />
                    ) : (
                      <Eye className="w-3 h-3 text-gesso-gold" />
                    )}
                    <span className="text-[10px] text-white/60 flex-1">{widget.label}</span>
                    <span className="text-[8px] font-mono text-white/20">{isHidden ? 'Hidden' : 'Visible'}</span>
                  </button>
                )
              })}
            </div>

            <div className="border-t border-surface-border/30 px-3 py-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-white/60 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Auto-refresh
                </span>
                <span className="text-[9px] font-mono text-gesso-gold">
                  {refreshInterval >= 60 ? `${refreshInterval / 60}m` : `${refreshInterval}s`}
                </span>
              </div>
              <div className="flex gap-1">
                {[30, 60, 300, 600].map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setRefreshInterval(interval)}
                    className={`flex-1 py-1 rounded text-[8px] font-mono transition-colors ${
                      refreshInterval === interval
                        ? 'bg-gesso-gold/10 text-gesso-gold border border-gesso-gold/20'
                        : 'text-white/30 hover:text-white/50 border border-transparent'
                    }`}
                  >
                    {interval >= 60 ? `${interval / 60}m` : `${interval}s`}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
