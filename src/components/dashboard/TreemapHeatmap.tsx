'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatCompactCurrency, formatPercent } from '@/lib/utils'
import { useAppStore } from '@/store/use-app-store'
import { convertCurrency } from '@/lib/exchange-rates'

interface TreemapItem {
  name: string
  value: number // market cap
  change: number
  color: string
}

// Sector data with deterministic colors
const sectors: TreemapItem[] = [
  { name: 'Technology', value: 12500000000000, change: 1.2, color: '#00ff88' },
  { name: 'Healthcare', value: 5800000000000, change: 0.8, color: '#00f0ff' },
  { name: 'Financial', value: 7200000000000, change: -0.3, color: '#ff2d95' },
  { name: 'Energy', value: 3200000000000, change: -1.5, color: '#ff2d95' },
  { name: 'Consumer Cyclical', value: 4800000000000, change: 0.5, color: '#00ff88' },
  { name: 'Consumer Defensive', value: 3500000000000, change: 0.2, color: '#a855f7' },
  { name: 'Industrials', value: 4200000000000, change: 0.1, color: '#a855f7' },
  { name: 'Utilities', value: 1500000000000, change: -0.8, color: '#ff2d95' },
  { name: 'Real Estate', value: 1200000000000, change: 0.4, color: '#00f0ff' },
  { name: 'Basic Materials', value: 1800000000000, change: -0.6, color: '#ff2d95' },
]

interface TreemapRect {
  item: TreemapItem
  x: number
  y: number
  w: number
  h: number
}

// Simple squarified treemap layout algorithm
function squarify(items: TreemapItem[], width: number, height: number): TreemapRect[] {
  const total = items.reduce((s, i) => s + i.value, 0)
  const rects: TreemapRect[] = []
  let x = 0, y = 0
  let rowHeight = height

  // Sort by value descending
  const sorted = [...items].sort((a, b) => b.value - a.value)

  for (const item of sorted) {
    const area = (item.value / total) * (width * height)
    const rw = area / rowHeight
    if (x + rw > width) {
      // Start new row
      x = 0
      const usedHeight = rowHeight
      rowHeight = height - usedHeight * (rects.length / items.length) * 1.2
      y += usedHeight * (rects.length / items.length) * 1.2
    }
    const rectWidth = Math.min(rw, width - x)
    rects.push({ item, x, y, w: rectWidth, h: rowHeight })
    x += rectWidth
  }

  return rects
}

export function TreemapHeatmap() {
  const { displayCurrency, exchangeRates } = useAppStore()
  const [hovered, setHovered] = useState<TreemapItem | null>(null)

  const width = 600
  const height = 340
  const padding = 2

  const rects = useMemo(() => squarify(sectors, width, height), [])

  return (
    <div className="glass rounded-xl p-4 border border-surface-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/40 font-mono">Market Treemap</div>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[9px] font-mono"
            >
              <span className="text-white/60">{hovered.name}</span>
              <span className={hovered.change >= 0 ? 'text-neon-green' : 'text-neon-pink'}>
                {formatPercent(hovered.change)}
              </span>
              <span className="text-white/30">
                {formatCompactCurrency(convertCurrency(hovered.value, displayCurrency, exchangeRates), displayCurrency)}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {rects.map((r, i) => {
          const isPositive = r.item.change >= 0
          const intensity = Math.min(Math.abs(r.item.change) / 3, 1)
          const opacity = 0.3 + intensity * 0.5
          const isHovered = hovered?.name === r.item.name

          return (
            <g
              key={r.item.name}
              onMouseEnter={() => setHovered(r.item)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <motion.rect
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isHovered ? 1 : opacity,
                  scale: isHovered ? 1.02 : 1,
                }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                x={r.x + padding}
                y={r.y + padding}
                width={r.w - padding * 2}
                height={r.h - padding * 2}
                rx={4}
                fill={isPositive ? 'rgba(0,255,136,0.15)' : 'rgba(255,45,149,0.15)'}
                stroke={isHovered ? 'rgba(255,255,255,0.4)' : `${r.item.color}33`}
                strokeWidth={isHovered ? 1.5 : 1}
              />
              {/* Label */}
              {r.w > 80 && r.h > 30 && (
                <>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 - 4}
                    textAnchor="middle"
                    className="text-[10px] fill-white/80 font-medium"
                  >
                    {r.item.name}
                  </text>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 12}
                    textAnchor="middle"
                    className={cn('text-[10px] font-mono', isPositive ? 'fill-neon-green' : 'fill-neon-pink')}
                  >
                    {isPositive ? '+' : ''}{r.item.change.toFixed(1)}%
                  </text>
                </>
              )}
              {r.w <= 80 && r.h > 20 && (
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 3}
                  textAnchor="middle"
                  className={cn('text-[8px] font-mono', isPositive ? 'fill-neon-green' : 'fill-neon-pink')}
                >
                  {r.item.name.slice(0, 4)} {isPositive ? '+' : ''}{r.item.change.toFixed(1)}%
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[8px] font-mono text-white/30">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-neon-green/40" />
          Positive
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-neon-pink/40" />
          Negative
        </div>
        <div className="text-white/20">Size = Market Cap</div>
      </div>
    </div>
  )
}
