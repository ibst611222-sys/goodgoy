'use client'

import { motion } from 'framer-motion'
import { cn, timeAgo } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { Newspaper, ExternalLink } from 'lucide-react'

const sourceColors: Record<string, string> = {
  reuters: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20',
  bloomberg: 'text-neon-amber bg-neon-amber/10 border-neon-amber/20',
  cnyes: 'text-neon-green bg-neon-green/10 border-neon-green/20',
  mops: 'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
}

export default function NewsPage() {
  const { news, setSelectedSymbol } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">News & Announcements</h1>
        <p className="text-xs text-white/30 font-mono">Market-moving news, earnings releases, and regulatory filings</p>
      </div>

      <div className="space-y-2">
        {news.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-xl p-4 border border-surface-border/50 hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center shrink-0 mt-0.5">
                <Newspaper className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'text-[9px] font-mono px-1.5 py-0.5 rounded border',
                    sourceColors[item.source] || 'text-white/30'
                  )}>
                    {item.source.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-white/20 font-mono">{timeAgo(item.date)}</span>
                  <span className={cn(
                    'text-[9px] ml-auto font-mono',
                    item.sentiment === 'positive' ? 'text-neon-green' :
                    item.sentiment === 'negative' ? 'text-neon-pink' : 'text-white/30'
                  )}>
                    {item.sentiment}
                  </span>
                </div>
                <div className="text-sm font-medium text-white mb-1">{item.title}</div>
                <p className="text-[10px] text-white/40 leading-relaxed">{item.summary}</p>
                {item.symbols && item.symbols.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {item.symbols.map(sym => (
                      <button
                        key={sym}
                        onClick={(e) => { e.stopPropagation(); setSelectedSymbol(sym) }}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cosmic-600/10 text-neon-cyan border border-cosmic-500/20 hover:bg-cosmic-600/20 transition-colors"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
