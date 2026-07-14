'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { fetchAllData } from '@/lib/data-service'
import { hasApiKey } from '@/lib/fmp-client'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Database, Clock } from 'lucide-react'

export function DataHydrator() {
  const [status, setStatus] = useState<'loading' | 'live' | 'mock'>(
    hasApiKey() ? 'loading' : 'mock'
  )
  const [showBadge, setShowBadge] = useState(true)
  const mountedRef = useRef(true)
  const badgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const {
    setStocks,
    setMarketPulse,
    setSignals,
    setSectorFlows,
    setInsiderTransactions,
    setNews,
    refreshInterval,
    refreshData,
  } = useAppStore()

  // Use a ref so the interval callback always gets the latest interval value
  const intervalRef = useRef(refreshInterval)
  intervalRef.current = refreshInterval

  useEffect(() => {
    mountedRef.current = true

    if (!hasApiKey()) {
      setStatus('mock')
      return
    }

    async function load() {
      try {
        setStatus('loading')

        // Hard 20-second timeout using resolve (not reject) to avoid unhandled rejection
        const result = await Promise.race([
          fetchAllData().then(d => ({ ok: true, data: d } as const)),
          new Promise<{ ok: false }>(resolve => setTimeout(() => resolve({ ok: false }), 20000)),
        ])

        if (!mountedRef.current || !result.ok) {
          if (!result.ok && mountedRef.current) setStatus('mock')
          return
        }

        setStocks(result.data.stocks)
        setMarketPulse(result.data.marketPulse)
        setSignals(result.data.signals)
        setSectorFlows(result.data.sectorFlows)
        setInsiderTransactions(result.data.insiderTransactions)
        setNews(result.data.news)
        refreshData()
        setStatus('live')

        badgeTimerRef.current = setTimeout(() => {
          if (mountedRef.current) setShowBadge(false)
        }, 5000)
      } catch {
        if (mountedRef.current) setStatus('mock')
      }
    }

    load()

    // Refresh at the interval set by the user (default 10 min, min 30s)
    const interval = setInterval(load, intervalRef.current * 1000)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
      if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current)
    }
  }, [refreshInterval])

  return (
    <>
      {/* Transient badge - shows briefly on load/reload */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-2 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono
              ${status === 'live' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' :
                status === 'loading' ? 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20' :
                'bg-white/5 text-white/30 border border-white/10'}
            `}>
              {status === 'live' ? (
                <><Wifi className="w-3 h-3" /> Live data</>
              ) : status === 'loading' ? (
                <><Database className="w-3 h-3 animate-pulse" /> Loading...</>
              ) : (
                <><WifiOff className="w-3 h-3" /> Mock data</>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent live data indicator - always visible */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5">
        <div className={`
          w-2 h-2 rounded-full
          ${status === 'live' ? 'bg-neon-green animate-pulse' : 'bg-white/20'}
        `} />
        <span className="text-[8px] font-mono text-white/20">
          {status === 'live' ? 'FMP' : 'MOCK'}
        </span>
        {status === 'live' && <LastUpdated />}
      </div>
    </>
  )
}

/** Small component that shows how long ago data was last refreshed */
function LastUpdated() {
  const { lastRefresh } = useAppStore()
  const [label, setLabel] = useState('')

  useEffect(() => {
    function update() {
      const now = Date.now()
      const diff = now - lastRefresh.getTime()
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      if (mins > 0) setLabel(`${mins}m ago`)
      else setLabel(`${secs}s ago`)
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [lastRefresh])

  return (
    <span className="flex items-center gap-1 text-[8px] font-mono text-white/15 ml-1">
      <Clock className="w-2.5 h-2.5" />
      {label}
    </span>
  )
}
