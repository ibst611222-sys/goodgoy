import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getCurrencySymbol } from './exchange-rates'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function formatCurrency(value: unknown, currency = 'USD'): string {
  const n = safeNumber(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatCompactCurrency(value: unknown, currency = 'USD'): string {
  const n = safeNumber(value)
  const symbol = getCurrencySymbol(currency)
  if (n >= 1e12) return `${symbol}${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${symbol}${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${symbol}${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${symbol}${(n / 1e3).toFixed(1)}K`
  return `${symbol}${n.toFixed(2)}`
}

export function formatPercent(value: unknown): string {
  const n = safeNumber(value)
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function formatLargeNumber(value: unknown): string {
  const n = safeNumber(value)
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toLocaleString()
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}
