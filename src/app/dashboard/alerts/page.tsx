'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Bell, BellOff, Plus, Trash2 } from 'lucide-react'

type Alert = {
  id: string
  symbol: string
  type: 'price_above' | 'price_below' | 'signal_fired' | 'insider_trade' | 'block_trade'
  value: string
  enabled: boolean
}

const defaultAlerts: Alert[] = [
  { id: 'a1', symbol: 'NVDA', type: 'price_above', value: '1000', enabled: true },
  { id: 'a2', symbol: 'LLY', type: 'signal_fired', value: 'any', enabled: true },
  { id: 'a3', symbol: 'TSLA', type: 'price_below', value: '200', enabled: false },
  { id: 'a4', symbol: 'JPM', type: 'insider_trade', value: 'any', enabled: true },
]

const typeLabels: Record<string, string> = {
  price_above: 'Price Above',
  price_below: 'Price Below',
  signal_fired: 'Signal Fired',
  insider_trade: 'Insider Trade',
  block_trade: 'Block Trade',
}

const STORAGE_KEY = 'goodgoy-alerts'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try { return JSON.parse(saved) } catch {}
      }
    }
    return defaultAlerts
  })
  const [showForm, setShowForm] = useState(false)
  const [newSymbol, setNewSymbol] = useState('')
  const [newType, setNewType] = useState<Alert['type']>('signal_fired')
  const [newValue, setNewValue] = useState('')

  // Persist to localStorage whenever alerts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
  }, [alerts])

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const addAlert = () => {
    if (!newSymbol) return
    setAlerts(prev => [...prev, {
      id: `a${Date.now()}`,
      symbol: newSymbol.toUpperCase(),
      type: newType,
      value: newValue,
      enabled: true,
    }])
    setNewSymbol('')
    setNewValue('')
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Alerts</h1>
          <p className="text-xs text-white/30 font-mono">Price, signal, and event-based notifications</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gesso-gold/10 border border-gesso-gold/20 text-[10px] text-gesso-gold font-mono hover:bg-gesso-gold/20 transition-colors"
        >
          <Plus className="w-3 h-3" />
          New Alert
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass rounded-xl p-4 border border-surface-border/50"
        >
          <div className="flex items-end gap-3">
            <div>
              <div className="text-[10px] text-white/30 font-mono mb-1">Symbol</div>
              <input
                type="text"
                placeholder="e.g. NVDA"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-gesso-gold/40 w-24"
              />
            </div>
            <div>
              <div className="text-[10px] text-white/30 font-mono mb-1">Type</div>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as Alert['type'])}
                className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-sm text-white/60 focus:outline-none focus:border-gesso-gold/40"
              >
                <option value="price_above">Price Above</option>
                <option value="price_below">Price Below</option>
                <option value="signal_fired">Signal Fired</option>
                <option value="insider_trade">Insider Trade</option>
                <option value="block_trade">Block Trade</option>
              </select>
            </div>
            {newType === 'price_above' || newType === 'price_below' ? (
              <div>
                <div className="text-[10px] text-white/30 font-mono mb-1">Value</div>
                <input
                  type="text"
                  placeholder="e.g. 1000"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-gesso-gold/40 w-24"
                />
              </div>
            ) : null}
            <button
              onClick={addAlert}
              className="px-4 py-2 rounded-lg bg-gesso-gold/10 text-xs text-gesso-gold font-mono border border-gesso-gold/20 hover:bg-gesso-gold/20 transition-colors"
            >
              Add
            </button>
          </div>
        </motion.div>
      )}

      {/* Alert list */}
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={cn(
              'glass rounded-xl p-4 border transition-all',
              alert.enabled ? 'border-surface-border/50' : 'border-surface-border/20 opacity-50'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-mono font-semibold text-sm text-white">{alert.symbol}</span>
                <span className={cn(
                  'text-[10px] font-mono px-1.5 py-0.5 rounded',
                  alert.enabled ? 'bg-gesso-gold/10 text-gesso-gold' : 'bg-white/5 text-white/30'
                )}>
                  {typeLabels[alert.type]}
                </span>
                {alert.value && (
                  <span className="text-[10px] font-mono text-white/40">{alert.value}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {alert.enabled ? (
                    <Bell className="w-3.5 h-3.5 text-gesso-gold" />
                  ) : (
                    <BellOff className="w-3.5 h-3.5 text-white/20" />
                  )}
                </button>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/20 hover:text-gesso-rose" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
