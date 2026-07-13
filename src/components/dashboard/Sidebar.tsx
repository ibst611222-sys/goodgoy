'use client'

import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Activity, Building2, Globe2, Eye,
  Search, Newspaper, Calendar, LayoutGrid, Workflow,
  LineChart, BarChart3, Star, Bell, Shield,
  TrendingUp, Menu, X, ChevronLeft, Network, BrainCircuit
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'signals', label: 'Signals', icon: Activity },
  { id: 'flow', label: 'Flow', icon: TrendingUp },
  { id: 'institutional', label: 'Institutional', icon: Building2, sub: ['Smart Money', 'Top Buyers', 'Rotation Matrix'] },
  { id: 'darkpool', label: 'Dark Pool', icon: Shield },
  { id: 'insider', label: 'Insider Tracker', icon: Eye },
  { id: 'high-activity', label: 'High-Activity', icon: BrainCircuit },
  { id: 'screener', label: 'Screener', icon: Search },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'earnings', label: 'Earnings', icon: Calendar },
  { id: 'themes', label: 'Themes', icon: LayoutGrid },
  { id: 'backtest', label: 'Backtest', icon: BarChart3 },
  { id: 'performance', label: 'Performance', icon: LineChart },
  { id: 'portfolio', label: 'Portfolio', icon: Workflow },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'supplychain', label: 'Supply Chain', icon: Network },
]

export function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? 240 : 60 }}
        animate={{ width: sidebarOpen ? 240 : 60 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-screen z-40 glass border-r border-surface-border/50',
          'flex flex-col overflow-hidden'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-surface-border/50 shrink-0">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 flex-1"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <span className="text-black font-bold text-xs">G</span>
                </div>
                <span className="font-bold text-white">goodgoy</span>
                <span className="text-[10px] text-neon-cyan/60 font-mono ml-auto">v0.1</span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <span className="text-black font-bold text-xs">G</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute top-3.5 -right-3 w-6 h-6 rounded-full bg-surface-card border border-surface-border flex items-center justify-center hover:bg-surface-elevated transition-colors z-10"
        >
          <ChevronLeft className={cn('w-3 h-3 text-white/50 transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden',
                  activeTab === item.id
                    ? 'text-white bg-cosmic-600/20 border border-cosmic-500/30'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                )}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 w-0.5 h-full bg-gradient-to-b from-neon-cyan to-neon-purple rounded-r"
                  />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          ))}
        </nav>

        {/* Bottom info */}
        {sidebarOpen && (
          <div className="p-3 border-t border-surface-border/50 shrink-0">
            <div className="text-[10px] text-white/20 font-mono">
              Data: FMP · Updated daily
            </div>
          </div>
        )}
      </motion.aside>
    </>
  )
}
