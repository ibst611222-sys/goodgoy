'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { useRouter } from 'next/navigation'
import { Search, Sun, Moon, User, Bell, LogOut, Settings, HelpCircle, CheckCircle, TrendingUp, Shield, AlertTriangle, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CurrencySelector } from '@/components/ui/CurrencySelector'

import { convertCurrency } from '@/lib/exchange-rates'

const mockNotifications = [
  { id: 'n1', type: 'signal', symbol: 'NVDA', message: 'Signal fired: Z-score 3.2, 7d streak', time: '2m ago', read: false },
  { id: 'n2', type: 'alert', symbol: 'TSLA', message: 'Insider sell detected: CFO sold 45,000 shares', time: '15m ago', read: false },
  { id: 'n3', type: 'signal', symbol: 'LLY', message: 'Support zone: price approaching key level', time: '1h ago', read: true },
  { id: 'n4', type: 'trade', symbol: 'META', message: 'Block trade: 320,000 shares at $518 premium', time: '3h ago', read: true },
]

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, handler])
}

export function TopBar() {
  const { theme, toggleTheme, setSelectedSymbol, stocks, displayCurrency, exchangeRates, user, signOut } = useAppStore()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const notifRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  useClickOutside(notifRef, () => setShowNotifications(false))
  useClickOutside(accountRef, () => setShowAccount(false))

  const unreadCount = notifications.filter(n => !n.read).length

  const results = search
    ? stocks.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : []

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const notifIcons: Record<string, React.ReactNode> = {
    signal: <TrendingUp className="w-3.5 h-3.5 text-gesso-gold" />,
    alert: <AlertTriangle className="w-3.5 h-3.5 text-gesso-amber" />,
    trade: <Shield className="w-3.5 h-3.5 text-gesso-taupe" />,
  }

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
          className="w-full bg-surface-card border border-surface-border rounded-lg pl-9 pr-3 py-2 text-sm text-stone-200/80 placeholder:text-stone-500 focus:outline-none focus:border-gesso-gold/40 transition-colors"
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
                      <span className="text-xs font-mono text-white/60">${convertCurrency(stock.price, displayCurrency, exchangeRates).toFixed(2)}</span>
                      <span className={`text-xs font-mono ${stock.changePercent >= 0 ? 'text-gesso-sage' : 'text-gesso-rose'}`}>
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

      {/* Currency selector */}
      <CurrencySelector />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors relative"
          >
            <Bell className="w-4 h-4 text-white/40" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gesso-rose text-[8px] font-mono font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 glass-elevated rounded-xl border border-surface-border/50 overflow-hidden z-50"
              >
                <div className="px-4 py-2.5 border-b border-surface-border/30 flex items-center justify-between">
                  <span className="text-xs font-mono text-white/60">Notifications</span>
                  <span className="text-[9px] font-mono text-gesso-gold cursor-pointer hover:text-gesso-gold/80" onClick={markAllRead}>Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-surface-border/10">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-2.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${!n.read ? 'bg-gesso-gold/[0.03]' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notifIcons[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-white/70 leading-relaxed">
                          {n.symbol && <span className="font-mono font-semibold text-white">{n.symbol}</span>} {n.message}
                        </div>
                        <div className="text-[9px] text-white/30 font-mono mt-0.5">{n.time}</div>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gesso-gold shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-surface-border/30 text-center">
                  <span className="text-[9px] font-mono text-white/20">Alerts require a connected service (email / Discord)</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => {
            toggleTheme()
            // Apply theme to <html> element so it actually takes effect
            document.documentElement.classList.remove('dark', 'light')
            document.documentElement.classList.add(theme === 'dark' ? 'light' : 'dark')
          }}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-white/40" />
          ) : (
            <Moon className="w-4 h-4 text-white/40" />
          )}
        </button>

        {/* Account */}
        <div className="relative pl-2 border-l border-surface-border/30" ref={accountRef}>
          <button
            onClick={() => setShowAccount(!showAccount)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gesso-gold to-gesso-amber flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-xs text-white/40 font-mono hidden sm:block">Guest</div>
          </button>

          <AnimatePresence>
            {showAccount && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 glass-elevated rounded-xl border border-surface-border/50 overflow-hidden z-50"
              >
                <div className="px-3 py-3 border-b border-surface-border/30">
                  <div className="text-xs font-semibold text-white">Guest</div>
                  <div className="text-[9px] font-mono text-white/30">Signed in as guest</div>
                </div>
                <div className="py-1">
                  {[
                    { icon: User, label: 'Profile', shortcut: '' },
                    { icon: Settings, label: 'Settings', shortcut: '' },
                    { icon: CheckCircle, label: 'Subscription', shortcut: 'Free' },
                    { icon: HelpCircle, label: 'Help & Support', shortcut: '' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setShowAccount(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                    >
                      <item.icon className="w-3.5 h-3.5 text-white/30" />
                      <span className="text-[10px] text-white/60 flex-1">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[8px] font-mono text-gesso-gold bg-gesso-gold/10 px-1.5 py-0.5 rounded">{item.shortcut}</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-surface-border/30 py-1">
                  {user ? (
                    <button onClick={() => { signOut(); setShowAccount(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left">
                      <LogOut className="w-3.5 h-3.5 text-white/30" />
                      <span className="text-[10px] text-white/60">Sign Out</span>
                    </button>
                  ) : (
                    <button onClick={() => { router.push('/login'); setShowAccount(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left">
                      <LogIn className="w-3.5 h-3.5 text-white/30" />
                      <span className="text-[10px] text-white/60">Sign In</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
