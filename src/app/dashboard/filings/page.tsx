'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fetchAllFilings, SECFiling } from '@/lib/sec-filings'
import { FileText, ExternalLink, Loader, Download } from 'lucide-react'
import { downloadCSV } from '@/lib/export-csv'

const TRACKED = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'JPM', 'LLY', 'NVO']

const formColors: Record<string, string> = {
  '10-K': 'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
  '10-Q': 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20',
  '8-K': 'text-neon-amber bg-neon-amber/10 border-neon-amber/20',
}

export default function FilingsPage() {
  const [filings, setFilings] = useState<SECFiling[]>([])
  const [loading, setLoading] = useState(true)
  const [formFilter, setFormFilter] = useState<string>('All')

  useEffect(() => {
    setLoading(true)
    fetchAllFilings(TRACKED).then(data => { setFilings(data); setLoading(false) })
  }, [])

  const filtered = formFilter === 'All' ? filings : filings.filter(f => f.formType === formFilter)
  const formTypes = ['All', ...Array.from(new Set(filings.map(f => f.formType)))]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">SEC Filings</h1>
        <p className="text-xs text-white/30 font-mono">10-Q, 10-K, and 8-K filings from SEC EDGAR</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {formTypes.map(ft => (
          <button key={ft} onClick={() => setFormFilter(ft)} className={cn('px-3 py-1.5 rounded-full text-[10px] font-mono transition-all border whitespace-nowrap', formFilter === ft ? 'bg-cosmic-600/20 text-neon-cyan border-cosmic-500/30' : 'text-white/30 border-white/10 hover:border-white/20')}>
            {ft}
          </button>
        ))}
      </div>

      {/* Filings list */}
      {loading ? (
        <div className="glass rounded-xl p-8 text-center border border-surface-border/50">
          <Loader className="w-6 h-6 text-white/20 mx-auto mb-2 animate-spin" />
          <div className="text-xs text-white/30 font-mono">Loading SEC filings...</div>
        </div>
      ) : (
        <div className="glass rounded-xl border border-surface-border/50 overflow-hidden">
          <div className="p-3 border-b border-surface-border/30 flex items-center justify-between">
            <span className="text-xs text-white/40 font-mono">Recent Filings — {filtered.length}</span>
            <button onClick={() => downloadCSV(
              filtered.slice(0, 30).map(f => ({ Symbol: f.symbol, 'Form Type': f.formType, Description: f.description, Date: f.date, URL: f.url })),
              [{ key: 'Symbol', label: 'Symbol' }, { key: 'Form Type', label: 'Form Type' }, { key: 'Description', label: 'Description' }, { key: 'Date', label: 'Date' }, { key: 'URL', label: 'URL' }],
              `filings-${new Date().toISOString().slice(0, 10)}`
            )} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-white/30 hover:text-neon-cyan transition-colors">
              <Download className="w-3 h-3" />
              CSV
            </button>
          </div>
          <div className="divide-y divide-surface-border/10">
            {filtered.slice(0, 30).map((f, i) => (
              <motion.a
                key={`${f.symbol}-${f.date}-${i}`}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="w-16">
                  <span className="text-xs font-mono font-semibold text-white">{f.symbol}</span>
                </div>
                <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded border mr-3', formColors[f.formType] || 'text-white/30')}>
                  {f.formType}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-white/70 truncate block">{f.description}</span>
                </div>
                <div className="text-[9px] text-white/30 font-mono mx-3">{f.date}</div>
                <ExternalLink className="w-3 h-3 text-white/20 shrink-0" />
              </motion.a>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <div className="text-xs text-white/30 font-mono">No filings found for this filter</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
