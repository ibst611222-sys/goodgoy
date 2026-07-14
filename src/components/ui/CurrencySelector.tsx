'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { SUPPORTED_CURRENCIES, getCurrencySymbol, fetchExchangeRates } from '@/lib/exchange-rates'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, RefreshCw } from 'lucide-react'

export function CurrencySelector() {
  const { displayCurrency, setDisplayCurrency, setExchangeRates } = useAppStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = SUPPORTED_CURRENCIES.find(c => c.code === displayCurrency) || SUPPORTED_CURRENCIES[0]

  // Fetch exchange rates on mount and periodically
  useEffect(() => {
    async function loadRates() {
      const rates = await fetchExchangeRates()
      setExchangeRates(rates)
    }
    loadRates()
    const interval = setInterval(loadRates, 60 * 60 * 1000) // refresh hourly
    return () => clearInterval(interval)
  }, [setExchangeRates])

  async function handleRefresh() {
    const rates = await fetchExchangeRates()
    setExchangeRates(rates)
  }

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSelect(code: string) {
    setDisplayCurrency(code)
    setOpen(false)
    // Refresh rates when user changes currency
    const rates = await fetchExchangeRates()
    setExchangeRates(rates)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-[10px] font-mono text-white/40 hover:text-white/60"
      >
        <span 
          onClick={(e) => { e.stopPropagation(); handleRefresh() }} 
          role="button" 
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRefresh() } }}
          className="p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer" 
          title="Refresh rates"
        >
          <RefreshCw className="w-2.5 h-2.5" />
        </span>
        <span>{current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-32 glass-elevated rounded-xl border border-surface-border/50 overflow-hidden z-50 max-h-60 overflow-y-auto"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => handleSelect(c.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] font-mono transition-colors hover:bg-white/5 text-left ${
                  c.code === displayCurrency ? 'text-neon-cyan bg-neon-cyan/5' : 'text-white/50'
                }`}
              >
                <span className="w-5 text-center text-[11px]">{c.symbol}</span>
                <span>{c.code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
