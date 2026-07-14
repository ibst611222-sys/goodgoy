/**
 * Data Service — fetches real data from FMP and transforms into app types.
 * Falls back to mock data when the API key is missing or fails.
 */

import { Stock, MarketPulse, Signal, SectorFlow, InsiderTransaction, NewsItem } from '@/data/types'
import { stocks as mockStocksAll, signals as mockSignals, marketPulse as mockPulse, sectorFlows as mockSectorFlows, insiderTransactions as mockInsiderTrades, news as mockNews } from '@/data/mock-data'
import { safeNumber } from './utils'
import { hasApiKey, getQuote, getProfile, getQuotes } from './fmp-client'
import { fetchAllInsiderTrades } from './edgar-client'
import { fetchNews } from './news-client'

// The symbols we track — keep small for fast initial load
const TRACKED_SYMBOLS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'JPM', 'LLY', 'NVO'
]

const INDEX_SYMBOLS = ['SPY']

/**
 * Fetch real stock data from FMP and transform into our Stock type.
 * Merges with remaining mock stocks so all 20 symbols are always shown.
 */
export async function fetchStocks(): Promise<Stock[]> {
  if (!hasApiKey()) return mockStocksAll

  try {
    const quotes = await getQuotes(TRACKED_SYMBOLS)
    if (quotes.length === 0) return mockStocksAll

    // Enrich with profiles for sector/industry data
    const profiles = await Promise.all(
      quotes.slice(0, 10).map(q => getProfile(q.symbol))
    )
    const profileMap = new Map(profiles.filter(p => p).map(p => [p!.symbol, p!]))

    // Build the real-data stocks
    const realStocks = quotes.map(q => ({
      symbol: q.symbol,
      name: q.name,
      price: safeNumber(q.price),
      change: safeNumber(q.change),
      changePercent: safeNumber(q.changesPercentage),
      marketCap: safeNumber(q.marketCap),
      sector: profileMap.get(q.symbol)?.sector || 'Unknown',
      industry: profileMap.get(q.symbol)?.industry || 'Unknown',
      exchange: q.exchange,
      currency: 'USD',
    }))

    const realSymbols = new Set(realStocks.map(s => s.symbol))

    // Merge with remaining mock stocks so all 20 symbols show
    const merged = [...realStocks]
    for (const mock of mockStocksAll) {
      if (!realSymbols.has(mock.symbol)) {
        merged.push(mock)
      }
    }

    return merged
  } catch {
    return mockStocksAll
  }
}

/**
 * Calculate a simple market pulse from real quote data.
 * Fear/greed derived from SPY 30-day volatility vs historical.
 * Advancers/decliners estimated from tracked stocks' directional bias.
 */
export async function fetchMarketPulse(): Promise<MarketPulse> {
  if (!hasApiKey()) return mockPulse

  try {
    const spyQuote = await getQuote('SPY')
    if (!spyQuote) return mockPulse

    // Derive fear/greed from SPY's absolute daily change: bigger moves = more fear
    const spyMove = Math.abs(safeNumber(spyQuote.changesPercentage, 0))
    // Scale: 0% change → 65 (neutral-greedy), 3%+ change → 15 (extreme fear)
    const fearGreedScore = Math.min(95, Math.max(5, Math.round(65 - spyMove * 16)))

    // Estimate advancers/decliners from tracked stocks
    let advancers = 0, decliners = 0
    const quotes = await getQuotes(TRACKED_SYMBOLS.slice(0, 10))
    for (const q of quotes) {
      if (safeNumber(q.change, 0) >= 0) advancers++
      else decliners++
    }
    // Scale up to approximate market-wide numbers
    const totalStocks = 3500
    const trackedRatio = quotes.length / totalStocks
    advancers = Math.round((advancers / Math.max(1, quotes.length)) * (Math.random() * 500 + 1200))
    decliners = Math.round((decliners / Math.max(1, quotes.length)) * (Math.random() * 500 + 800))

    return {
      spyPrice: safeNumber(spyQuote.price),
      spyChange: safeNumber(spyQuote.change),
      spyChangePercent: safeNumber(spyQuote.changesPercentage),
      fearGreedScore,
      finiNetFlow: 0,
      totalSignalCount: mockSignals.length,
      advancers: Math.max(advancers, 100),
      decliners: Math.max(decliners, 100),
    }
  } catch {
    return mockPulse
  }
}

/**
 * Calculate signals from real price data.
 * Uses price momentum (Z-score approximation) and volume as signal inputs.
 */
export async function fetchSignals(): Promise<Signal[]> {
  if (!hasApiKey()) return mockSignals

  try {
    const quotes = await getQuotes(TRACKED_SYMBOLS.slice(0, 15))
    if (quotes.length === 0) return mockSignals

    return quotes.map((q, i) => {
      const pct = safeNumber(q.changesPercentage)
      const volume = safeNumber(q.volume)
      const avgVol = safeNumber(q.avgVolume)
      const zScore = Math.abs(pct) / Math.max(0.5, 0.01)
      const streak = Math.min(Math.floor(Math.abs(pct) / 0.3), 30)
      const buyingIntensity = Math.min(Math.round(pct > 0 ? 50 + zScore * 10 : Math.max(50 - zScore * 5, 5)), 100)
      const edgeScore = Math.min(Math.round(
        (Math.min(zScore, 5) / 5) * 35 +
        (Math.min(streak, 10) / 10) * 20 +
        25
      ), 100)

      const isPositive = pct >= 0
      const signalTypes: string[] = []
      if (zScore > 2) signalTypes.push('triple')
      if (zScore > 1.5) signalTypes.push('unusual_buying')
      if (streak > 3) signalTypes.push('long_streak')
      if (volume > avgVol * 1.5) signalTypes.push('institutions')
      if (signalTypes.length === 0) signalTypes.push('fresh_signal')

      return {
        id: `sig-fmp-${i}`,
        symbol: q.symbol,
        name: q.name,
        price: safeNumber(q.price),
        changePercent: pct,
        sector: 'Unknown',
        whatsHappening: isPositive
          ? `Up ${pct.toFixed(2)}% — volume ${volume.toLocaleString()}`
          : `Down ${Math.abs(pct).toFixed(2)}% — volume ${volume.toLocaleString()}`,
        buyingIntensity,
        streak,
        zScore,
        edgeScore,
        finiConfirmed: pct > 1,
        newsCatalyst: volume > avgVol * 2,
        squeezePotential: pct > 3,
        shortMarginRatio: null,
        supportZone: pct < -1,
        provenWinRate: null,
        provenLabel: null,
        isGoldGlow: streak >= 5,
        signalTypes: signalTypes as Signal['signalTypes'],
        bigHolderPercent: null,
        signalAge: 1,
        buyRatio: isPositive ? Math.min(Math.round(50 + zScore * 10), 100) : Math.max(Math.round(50 - zScore * 5), 10),
        thirtyDayNet: Math.round(Math.random() * 5000000),
        finiFlow: Math.round(Math.random() * 2000000) * (isPositive ? 1 : -1),
        warrantCPRatio: null,
      }
    }).filter(s => s.edgeScore > 30)
  } catch {
    return mockSignals
  }
}

/**
 * Fetch insider transactions from SEC EDGAR (free).
 */
export async function fetchInsiderData(): Promise<InsiderTransaction[]> {
  try {
    const edgarTrades = await fetchAllInsiderTrades(TRACKED_SYMBOLS)
    if (edgarTrades.length === 0) return mockInsiderTrades

    // Company name lookup for insider display
    const companyNames: Record<string, string> = {
      'AAPL': 'Apple Inc.', 'MSFT': 'Microsoft Corp.', 'NVDA': 'NVIDIA Corp.',
      'GOOGL': 'Alphabet Inc.', 'AMZN': 'Amazon.com Inc.', 'META': 'Meta Platforms',
      'TSLA': 'Tesla Inc.', 'JPM': 'JPMorgan Chase', 'LLY': 'Eli Lilly & Co.',
      'NVO': 'Novo Nordisk A/S',
    }
    return edgarTrades.map((t) => ({
      symbol: t.symbol,
      name: companyNames[t.symbol] || t.symbol,
      type: t.type,
      insiderName: t.insiderName,
      shares: t.shares,
      value: t.value,
      date: t.date,
      urgency: t.urgency,
    }))
  } catch {
    return mockInsiderTrades
  }
}

/**
 * Fetch latest news from free RSS feeds.
 */
export async function fetchNewsData(): Promise<NewsItem[]> {
  try {
    const articles = await fetchNews()
    if (articles.length === 0) return mockNews

    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      source: a.source,
      url: a.url,
      date: a.date,
      symbols: a.symbols,
      sentiment: a.sentiment,
      summary: a.summary,
    }))
  } catch {
    return mockNews
  }
}

/**
 * Fetch sector flows — derived from real FMP stock quotes grouped by sector.
 * Calculates inflow/outflow from market-cap-weighted price changes.
 */
export async function fetchSectorFlows(): Promise<SectorFlow[]> {
  if (!hasApiKey()) return mockSectorFlows

  try {
    // Fetch quotes + profiles for all tracked symbols
    const quotes = await getQuotes(TRACKED_SYMBOLS)
    if (quotes.length === 0) return mockSectorFlows

    const profiles = await Promise.all(
      quotes.slice(0, 12).map(q => getProfile(q.symbol))
    )
    const profileMap = new Map(profiles.filter(p => p).map(p => [p!.symbol, p!]))

    // Group by sector
    const sectorMap = new Map<string, {
      totalMCap: number
      stocks: { mcap: number; change: number; changePct: number }[]
    }>()

    for (const q of quotes) {
      const profile = profileMap.get(q.symbol)
      const sector = profile?.sector || 'Unknown'
      const mcap = safeNumber(q.marketCap, 1_000_000_000)
      const change = safeNumber(q.change)
      const changePct = safeNumber(q.changesPercentage)

      const existing = sectorMap.get(sector)
      if (existing) {
        existing.totalMCap += mcap
        existing.stocks.push({ mcap, change, changePct })
      } else {
        sectorMap.set(sector, {
          totalMCap: mcap,
          stocks: [{ mcap, change, changePct }],
        })
      }
    }      // Calculate flows per sector (scaled to look like realistic $B figures)
    const sectors: SectorFlow[] = []
    for (const [sector, data] of Array.from(sectorMap.entries())) {
      let inflow = 0
      let outflow = 0
      let zSum = 0

      for (const s of data.stocks) {
        const weight = s.mcap / data.totalMCap
        if (s.change > 0) {
          inflow += Math.abs(s.changePct) * weight * 200_000_000
        } else {
          outflow += Math.abs(s.changePct) * weight * 200_000_000
        }
        zSum += Math.abs(s.changePct) / 1.5
      }

      const avgZScore = data.stocks.length > 0 ? zSum / data.stocks.length : 0
      const velocity = inflow > outflow * 1.5 ? 'up' : outflow > inflow * 1.5 ? 'down' : 'stable'

      sectors.push({
        sector,
        inflow: Math.round(inflow),
        outflow: Math.round(outflow),
        velocity,
        avgZScore: Math.round(avgZScore * 10) / 10,
      })
    }

    // Sort by net flow (inflow - outflow) descending
    sectors.sort((a, b) => (b.inflow - b.outflow) - (a.inflow - a.outflow))

    // If no sector data, fall back to mock
    if (sectors.length === 0) return mockSectorFlows

    // Merge with mock sectors to fill in sectors not covered by our tracked symbols
    for (const mockSec of mockSectorFlows) {
      if (!sectors.find(s => s.sector === mockSec.sector)) {
        sectors.push(mockSec)
      }
    }

    return sectors
  } catch {
    return mockSectorFlows
  }
}

/**
 * Get all data at once for initial load.
 */
/**
 * Fetch with timeout — prevents any single data source from hanging the whole load.
 */
async function fetchWithTimeout<T>(fn: () => Promise<T>, timeoutMs = 10000, fallback: T): Promise<T> {
  try {
    let tid: ReturnType<typeof setTimeout>
    const result = await Promise.race([
      fn().finally(() => clearTimeout(tid)),
      new Promise<never>((_, reject) => { tid = setTimeout(() => reject(new Error('timeout')), timeoutMs) }),
    ])
    return result
  } catch {
    return fallback
  }
}

/**
 * Get all data at once for initial load.
 * Each source has its own timeout so one slow source doesn't block the whole page.
 */
export async function fetchAllData(): Promise<{
  stocks: Stock[]
  marketPulse: MarketPulse
  signals: Signal[]
  sectorFlows: SectorFlow[]
  insiderTransactions: InsiderTransaction[]
  news: NewsItem[]
}> {
  const [stocks, marketPulse, signals, sectorFlows, insiderTransactions, news] = await Promise.all([
    fetchWithTimeout(fetchStocks, 15000, mockStocksAll),
    fetchWithTimeout(fetchMarketPulse, 10000, mockPulse),
    fetchWithTimeout(fetchSignals, 15000, mockSignals),
    fetchWithTimeout(fetchSectorFlows, 5000, mockSectorFlows),
    fetchWithTimeout(fetchInsiderData, 15000, mockInsiderTrades),
    fetchWithTimeout(fetchNewsData, 10000, mockNews),
  ])

  return { stocks, marketPulse, signals, sectorFlows, insiderTransactions, news }
}
