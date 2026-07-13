'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { Search, Sun, Moon, User, Bell } from 'lucide-react'
import { stocks } from '@/data/mock-data'
import { motion, AnimatePresence } from 'framer-motion'

export function TopBar() {
  const { theme, toggleTheme, setSelectedSymbol } = useAppStore()
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)

  const results = search
    ? stocks.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : []

  return (
    <div className="h-14 glass border-b border-surface-border/50 flex items-center px-4 gap-4 shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowResults(true) }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full bg-surface-card border border-surface-border rounded-lg pl-9 pr-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cosmic-500/50 transition-colors"
        />

        <AnimatePresence>
          {showResults && search && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full mt-1 left-0 right-0 glass-elevated rounded-lg border border-surface-border/50 overflow-hidden z-50"
            >
              {results.length === 0 ? (
                <div className="px-4 py-3 text-xs text-white/30">No results found</div>
              ) : (
                results.map((stock) => (
                  <button
                    key={stock.symbol}
                    onMouseDown={() => { setSelectedSymbol(stock.symbol); setSearch(''); setShowResults(false) }}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                  >
                    <div>
                      <span className="text-sm font-mono font-medium text-white">{stock.symbol}</span>
                      <span className="text-xs text-white/40 ml-2">{stock.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white/60">${stock.price}</span>
                      <span className={`text-xs font-mono ${stock.changePercent >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                      </span>
                    </div>
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
          <Bell className="w-4 h-4 text-white/40" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-neon-pink" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-white/40" />
          ) : (
            <Moon className="w-4 h-4 text-white/40" />
          )}
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-surface-border/30">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-xs text-white/40 font-mono hidden sm:block">Guest</div>
        </div>
      </div>
    </div>
  )
}
