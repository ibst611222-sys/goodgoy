/**
 * FMP API Client — wraps Financial Modeling Prep API with mock fallback
 * When FMP API key is not set, uses local mock data automatically.
 */

const FMP_BASE = 'https://financialmodelingprep.com/api/v3'
const FMP_KEY = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_FMP_API_KEY || '')
  : (process.env.NEXT_PUBLIC_FMP_API_KEY || '')

function getKey(): string {
  return FMP_KEY
}

export function hasApiKey(): boolean {
  return getKey().length > 0 && getKey() !== 'your_fmp_api_key_here'
}

async function fmpFetch<T>(endpoint: string, fallback: T): Promise<T> {
  if (!hasApiKey()) return fallback

  try {
    const url = `${FMP_BASE}/${endpoint}?apikey=${getKey()}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return fallback
    return await res.json()
  } catch {
    return fallback
  }
}

// === Stock Quotes ===
export interface FMPQuote {
  symbol: string
  name: string
  price: number
  change: number
  changesPercentage: number
  marketCap: number
  sector: string
  industry: string
  exchange: string
  currency: string
}

export async function getQuotes(symbols: string[]): Promise<FMPQuote[]> {
  return fmpFetch(
    `quote/${symbols.join(',')}`,
    symbols.map((s) => ({
      symbol: s, name: '', price: 0, change: 0, changesPercentage: 0,
      marketCap: 0, sector: '', industry: '', exchange: '', currency: ''
    }))
  )
}

// === SEC Filings (13F, Insider) ===
export interface FMPCIKMap { cik: string; symbol: string; name: string }
export interface FMPInsiderTrade {
  symbol: string
  insiderName: string
  transactionType: string
  shares: number
  value: number
  transactionDate: string
}

export async function getInsiderTrades(symbol: string): Promise<FMPInsiderTrade[]> {
  return fmpFetch(`insider-trading/${symbol}`, [])
}

// === Financial Statements ===
export interface FMPIncomeStatement {
  date: string
  revenue: number
  grossProfit: number
  operatingIncome: number
  netIncome: number
  eps: number
}

export async function getIncomeStatements(symbol: string): Promise<FMPIncomeStatement[]> {
  return fmpFetch(`income-statement/${symbol}?limit=4`, [])
}

// === Company Profile ===
export interface FMPProfile {
  symbol: string
  companyName: string
  sector: string
  industry: string
  marketCap: number
  beta: number
  price: number
  lastDiv: number
  range: string
  image: string
}

export async function getProfile(symbol: string): Promise<FMPProfile | null> {
  const data = await fmpFetch<FMPProfile[]>(`profile/${symbol}`, [])
  return data[0] || null
}

// === Stock Screener ===
export interface FMPScreenerResult {
  symbol: string
  companyName: string
  marketCap: number
  sector: string
  industry: string
  beta: number
  price: number
  volume: number
  change: number
  changesPercentage: number
}

export async function screener(
  marketCapMin?: number,
  sector?: string
): Promise<FMPScreenerResult[]> {
  const params = new URLSearchParams()
  if (marketCapMin) params.set('marketCapMoreThan', String(marketCapMin))
  if (sector) params.set('sector', sector)
  return fmpFetch(`stock-screener?${params.toString()}`, [])
}
