'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { getExecutives, getProfile } from '@/lib/fmp-client'
import { Users, Briefcase, Download } from 'lucide-react'
import { downloadCSV } from '@/lib/export-csv'

const TRACKED = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'TSLA', 'JPM', 'LLY', 'AMZN', 'NVO']

export default function ExecutivesPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA')
  const [execs, setExecs] = useState<Awaited<ReturnType<typeof getExecutives>>>([])
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>(null)

  useEffect(() => {
    getExecutives(selectedSymbol).then(setExecs)
    getProfile(selectedSymbol).then(setProfile)
  }, [selectedSymbol])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Executives</h1>
        <p className="text-xs text-white/30 font-mono">Company leadership, management team, and board members</p>
      </div>

      {/* Symbol selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TRACKED.map(s => (
          <button key={s} onClick={() => setSelectedSymbol(s)} className={cn('px-3 py-1.5 rounded-full text-[10px] font-mono transition-all border whitespace-nowrap', selectedSymbol === s ? 'bg-cosmic-600/20 text-neon-cyan border-cosmic-500/30' : 'text-white/30 border-white/10 hover:border-white/20')}>
            {s}
          </button>
        ))}
      </div>

      {/* Company Info */}
      {profile && (
        <div className="glass rounded-xl p-4 border border-surface-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{profile.companyName}</div>
              <div className="text-[10px] text-white/40 font-mono">{profile.sector} · {profile.industry}</div>
              {profile.ceo && <div className="text-[10px] text-white/30 mt-0.5">CEO: {profile.ceo}</div>}
            </div>
          </div>
          {profile.description && (
            <p className="text-[11px] text-white/50 leading-relaxed line-clamp-3">{profile.description}</p>
          )}
        </div>
      )}

      {/* Executives list */}
      <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
        <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
          <span className="text-xs text-white/40 font-mono">Management Team</span>
          <button onClick={() => downloadCSV(
            execs.map(e => ({ Name: e.name, Title: e.title, 'Year Born': String(e.yearBorn) })),
            [{ key: 'Name', label: 'Name' }, { key: 'Title', label: 'Title' }, { key: 'Year Born', label: 'Year Born' }],
            `${selectedSymbol}-executives-${new Date().toISOString().slice(0, 10)}`
          )} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-neon-cyan transition-colors">
            <Download className="w-3 h-3" />
            CSV
          </button>
        </div>
        {execs.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <div className="text-xs text-white/30 font-mono">No executive data available for {selectedSymbol}</div>
            <div className="text-[10px] text-white/20 mt-1">FMP free tier may have limited coverage</div>
          </div>
        ) : (
          <div className="divide-y divide-surface-border/10">
            {execs.map((exec, i) => (
              <motion.div key={exec.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-surface-border/50 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-white/60">{exec.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{exec.name}</div>
                  <div className="text-[10px] text-white/40 font-mono">{exec.title}</div>
                </div>
                <div className="text-[10px] text-white/30 font-mono">Born {exec.yearBorn}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
