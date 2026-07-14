/**
 * FMP API Client — wraps Financial Modeling Prep API v4 (/stable/ endpoints)
 * Automatically falls back to mock data when no valid API key is set.
 */

const FMP_BASE = 'https://financialmodelingprep.com/stable'
const FMP_KEY = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_FMP_API_KEY || '')
  : (process.env.NEXT_PUBLIC_FMP_API_KEY || '')

function getKey(): string {
  return FMP_KEY
}

export function hasApiKey(): boolean {
  const key = getKey()
  return key.length > 0 && key !== 'your_fmp_api_key_here'
}

async function fmpFetch<T>(endpoint: string, params: Record<string, string>, fallback: T): Promise<T> {
  if (!hasApiKey()) return fallback

  try {
    const searchParams = new URLSearchParams(params)
    searchParams.set('apikey', getKey())
    const url = `${FMP_BASE}/${endpoint}?${searchParams.toString()}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return fallback
    const data = await res.json()
    return data
  } catch {
    return fallback
  }
}

// === Stock Quote ===
export interface FMPQuote {
  symbol: string
  name: string
  price: number
  change: number
  changesPercentage: number
  dayLow: number
  dayHigh: number
  volume: number
  marketCap: number
  exchange: string
  eps: number
  pe: number
  yearHigh: number
  yearLow: number
  avgVolume: number
  sharesOutstanding: number
}

export async function getQuote(symbol: string): Promise<FMPQuote | null> {
  const data = await fmpFetch<FMPQuote[]>('quote', { symbol }, [])
  return data?.[0] || null
}

export async function getQuotes(symbols: string[]): Promise<FMPQuote[]> {
  // FMP free tier only supports single-symbol quotes, so batch sequentially
  const results: FMPQuote[] = []
  for (const symbol of symbols) {
    const q = await getQuote(symbol)
    if (q) results.push(q)
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100))
  }
  return results
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
  exchange: string
  currency: string
  ceo: string
  description: string
}

export async function getProfile(symbol: string): Promise<FMPProfile | null> {
  const data = await fmpFetch<FMPProfile[]>('profile', { symbol }, [])
  return data?.[0] || null
}

// === Financial Statements ===
export interface FMPIncomeStatement {
  date: string
  revenue: number
  grossProfit: number
  operatingIncome: number
  netIncome: number
  eps: number
  revenueGrowth: number
  grossMargin: number
  operatingMargin: number
  profitMargin: number
}

export async function getIncomeStatements(symbol: string): Promise<FMPIncomeStatement[]> {
  return fmpFetch<FMPIncomeStatement[]>('income-statement', { symbol, limit: '4' }, [])
}

// === Balance Sheet ===
export interface FMPBalanceSheet {
  date: string
  totalAssets: number
  totalLiabilities: number
  totalDebt: number
  shareholderEquity: number
  cashAndCashEquivalents: number
  currentAssets: number
  currentLiabilities: number
}

export async function getBalanceSheets(symbol: string): Promise<FMPBalanceSheet[]> {
  return fmpFetch<FMPBalanceSheet[]>('balance-sheet-statement', { symbol, limit: '1' }, [])
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

export async function screener(params: {
  marketCapMin?: number
  marketCapMax?: number
  sector?: string
  limit?: number
}): Promise<FMPScreenerResult[]> {
  const searchParams: Record<string, string> = {}
  if (params.marketCapMin) searchParams.marketCapMoreThan = String(params.marketCapMin)
  if (params.marketCapMax) searchParams.marketCapLowerThan = String(params.marketCapMax)
  if (params.sector) searchParams.sector = params.sector
  if (params.limit) searchParams.limit = String(params.limit)
  return fmpFetch<FMPScreenerResult[]>('company-screener', searchParams, [])
}

// === Key Executives ===
export interface FMPExecutive {
  name: string
  title: string
  yearBorn: number
}

export async function getExecutives(symbol: string): Promise<FMPExecutive[]> {
  return fmpFetch<FMPExecutive[]>('key-executives', { symbol }, [])
}

// === Historical OHLC Data ===
export interface FMPHistoricalDay {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  vwap: number
}

/**
 * Fetch daily historical OHLC data for a symbol (up to 5 years).
 * Returns data sorted oldest to newest.
 */
export async function getHistoricalData(symbol: string, from?: string): Promise<FMPHistoricalDay[]> {
  const params: Record<string, string> = { symbol }
  if (from) params.from = from
  return fmpFetch<FMPHistoricalDay[]>('historical-price-eod/full', params, [])
}

// === Market Index Performance ===
export interface FMPIndexQuote {
  symbol: string
  name: string
  price: number
  change: number
  changesPercentage: number
}

export async function getIndexQuote(symbol: string): Promise<FMPIndexQuote | null> {
  const data = await fmpFetch<FMPIndexQuote[]>('quote', { symbol: symbol }, [])
  return data?.[0] || null
}
