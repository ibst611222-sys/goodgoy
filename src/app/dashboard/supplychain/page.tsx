'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Network, TrendingUp } from 'lucide-react'

const supplyChainData: Record<string, { suppliers: { symbol: string; name: string; exposure: number }[]; customers: { symbol: string; name: string; exposure: number }[] }> = {
  'AAPL': {
    suppliers: [
      { symbol: 'TSM', name: 'Taiwan Semiconductor', exposure: 25 },
      { symbol: 'AMAT', name: 'Applied Materials Inc.', exposure: 12 },
      { symbol: 'QCOM', name: 'Qualcomm Inc.', exposure: 8 },
      { symbol: 'SKM', name: 'SK Hynix Inc.', exposure: 7 },
    ],
    customers: [
      { symbol: 'VZ', name: 'Verizon Communications', exposure: 5 },
      { symbol: 'T', name: 'AT&T Inc.', exposure: 4 },
    ],
  },
  'NVDA': {
    suppliers: [
      { symbol: 'TSM', name: 'Taiwan Semiconductor', exposure: 35 },
      { symbol: 'AMAT', name: 'Applied Materials Inc.', exposure: 15 },
      { symbol: 'ASML', name: 'ASML Holding N.V.', exposure: 10 },
      { symbol: 'KLAC', name: 'KLA Corporation', exposure: 8 },
    ],
    customers: [
      { symbol: 'MSFT', name: 'Microsoft Corporation', exposure: 18 },
      { symbol: 'AMZN', name: 'Amazon Web Services', exposure: 15 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', exposure: 12 },
      { symbol: 'META', name: 'Meta Platforms Inc.', exposure: 10 },
    ],
  },
  'TSLA': {
    suppliers: [
      { symbol: 'LGES', name: 'LG Energy Solution', exposure: 20 },
      { symbol: 'PANW', name: 'Panasonic Holdings', exposure: 15 },
      { symbol: 'CATL', name: 'Contemporary Amperex', exposure: 12 },
    ],
    customers: [
      { symbol: 'UBER', name: 'Uber Technologies', exposure: 8 },
      { symbol: 'HERTZ', name: 'Hertz Global Holdings', exposure: 5 },
    ],
  },
}

export default function SupplyChainPage() {
  const { selectedSymbol, setSelectedSymbol } = useAppStore()
  const symbol = selectedSymbol || 'NVDA'
  const data = supplyChainData[symbol] || supplyChainData['NVDA']

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Supply Chain Map</h1>
        <p className="text-xs text-white/30 font-mono">Supplier & customer relationships with revenue exposure</p>
      </div>

      {/* Company selector */}
      <div className="flex gap-2">
        {Object.keys(supplyChainData).map((sym) => (
          <button
            key={sym}
            onClick={() => setSelectedSymbol(sym)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${
              symbol === sym
                ? 'bg-cosmic-600/20 text-neon-cyan border-cosmic-500/30'
                : 'text-white/30 border-white/10 hover:border-white/20'
            }`}
          >
            {sym}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Suppliers */}
        <div className="glass rounded-xl p-4 border border-surface-border/50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs text-white/40 font-mono">Suppliers</span>
          </div>
          <div className="space-y-2">
            {data.suppliers.map((s, i) => (
              <motion.div
                key={s.symbol}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-card border border-surface-border/30"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-white">{s.symbol}</span>
                  <span className="text-[10px] text-white/40">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full bg-surface-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                      style={{ width: `${s.exposure}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/60">{s.exposure}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customers */}
        <div className="glass rounded-xl p-4 border border-surface-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-neon-purple" />
            <span className="text-xs text-white/40 font-mono">Customers</span>
          </div>
          <div className="space-y-2">
            {data.customers.map((c, i) => (
              <motion.div
                key={c.symbol}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-card border border-surface-border/30"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-white">{c.symbol}</span>
                  <span className="text-[10px] text-white/40">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full bg-surface-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                      style={{ width: `${c.exposure}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/60">{c.exposure}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Center node */}
      <div className="flex justify-center">
        <div className="glass rounded-xl p-4 border border-neon-cyan/20 bg-cosmic-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-black font-bold">{symbol}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{symbol}</div>
              <div className="text-[10px] text-white/30 font-mono">Revenue: ${supplyChainData[symbol] ? (symbol === 'NVDA' ? '79.2B' : symbol === 'AAPL' ? '395B' : '96.8B') : '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
