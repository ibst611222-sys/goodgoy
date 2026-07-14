'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Stock, Signal, MarketPulse, SectorFlow, InstitutionalFlow, InsiderTransaction, BlockTrade, MacroTheme, NewsItem, SignalPerformance, PortfolioHolding } from '@/data/types'
import { ExchangeRates } from '@/lib/exchange-rates'
import * as mock from '@/data/mock-data'

interface AppState {
  // Navigation
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  toggleSidebar: () => void

  // Market Data
  stocks: Stock[]
  setStocks: (stocks: Stock[]) => void
  marketPulse: MarketPulse
  setMarketPulse: (pulse: MarketPulse) => void
  signals: Signal[]
  setSignals: (signals: Signal[]) => void
  sectorFlows: SectorFlow[]
  setSectorFlows: (flows: SectorFlow[]) => void
  institutionalFlows: InstitutionalFlow[]
  insiderTransactions: InsiderTransaction[]
  setInsiderTransactions: (trades: InsiderTransaction[]) => void
  blockTrades: BlockTrade[]
  macroThemes: MacroTheme[]
  news: NewsItem[]
  setNews: (news: NewsItem[]) => void
  signalPerformances: SignalPerformance[]
  portfolioHoldings: PortfolioHolding[]

  // Selected stock for detail view
  selectedSymbol: string | null
  setSelectedSymbol: (symbol: string | null) => void

  // UI State
  globalMarketFilter: string
  setGlobalMarketFilter: (filter: string) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void

  // Currency display
  displayCurrency: string
  exchangeRates: ExchangeRates
  setDisplayCurrency: (currency: string) => void
  setExchangeRates: (rates: ExchangeRates) => void

  // Data refresh simulation
  lastRefresh: Date
  refreshData: () => void

  // Watchlist
  watchlist: string[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  isInWatchlist: (symbol: string) => boolean

  // Auth
  user: { email: string; id: string } | null
  setUser: (user: { email: string; id: string } | null) => void
  signOut: () => void

  // Dashboard customization
  hiddenWidgets: string[]
  toggleWidget: (widgetId: string) => void
  refreshInterval: number // seconds
  setRefreshInterval: (seconds: number) => void
}

// Partial state that should be persisted to localStorage
const PERSISTED_KEYS = ['displayCurrency', 'theme', 'watchlist', 'hiddenWidgets', 'refreshInterval'] as const

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      signOut: () => {
        set({ user: null })
        // Try to sign out from Supabase if available
        import('@/lib/supabase/client').then(({ createClient }) => {
          const supabase = createClient()
          supabase.auth.signOut()
        }).catch(() => {})
      },

      // Dashboard customization
      hiddenWidgets: [],
      toggleWidget: (widgetId) => set((s) => ({
        hiddenWidgets: s.hiddenWidgets.includes(widgetId)
          ? s.hiddenWidgets.filter(w => w !== widgetId)
          : [...s.hiddenWidgets, widgetId]
      })),
      refreshInterval: 600,
      setRefreshInterval: (seconds) => set({ refreshInterval: seconds }),

      // Navigation
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // Market Data
      stocks: mock.stocks,
      setStocks: (stocks) => set({ stocks }),
      marketPulse: mock.marketPulse,
      setMarketPulse: (pulse) => set({ marketPulse: pulse }),
      signals: mock.signals,
      setSignals: (signals) => set({ signals }),
      sectorFlows: mock.sectorFlows,
      setSectorFlows: (flows) => set({ sectorFlows: flows }),
      institutionalFlows: mock.institutionalFlows,
      insiderTransactions: mock.insiderTransactions,
      setInsiderTransactions: (trades) => set({ insiderTransactions: trades }),
      blockTrades: mock.blockTrades,
      macroThemes: mock.macroThemes,
      news: mock.news,
      setNews: (news) => set({ news }),
      signalPerformances: mock.signalPerformances,
      portfolioHoldings: mock.portfolioHoldings,

      // Selected stock
      selectedSymbol: null,
      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

      // UI State
      globalMarketFilter: 'all',
      setGlobalMarketFilter: (filter) => set({ globalMarketFilter: filter }),
      theme: 'dark',
      toggleTheme: () => set((s) => {
        const next = s.theme === 'dark' ? 'light' : 'dark'
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light')
          document.documentElement.classList.add(next)
        }
        return { theme: next }
      }),

      // Currency display
      displayCurrency: 'USD',
      exchangeRates: {},
      setDisplayCurrency: (currency) => set({ displayCurrency: currency }),
      setExchangeRates: (rates) => set({ exchangeRates: rates }),

      // Data refresh
      lastRefresh: new Date(),
      refreshData: () => set({ lastRefresh: new Date() }),

      // Watchlist
      watchlist: ['NVDA', 'LLY', 'META', 'JPM'],
      addToWatchlist: (symbol) => set((s) => ({
        watchlist: s.watchlist.includes(symbol) ? s.watchlist : [...s.watchlist, symbol]
      })),
      removeFromWatchlist: (symbol) => set((s) => ({
        watchlist: s.watchlist.filter((sym) => sym !== symbol)
      })),
      isInWatchlist: (symbol) => get().watchlist.includes(symbol),
    }),
    {
      name: 'goodgoy-storage',
      partialize: (state) => {
        const picked: Record<string, unknown> = {}
        for (const key of PERSISTED_KEYS) {
          picked[key] = state[key as keyof typeof state]
        }
        return picked
      },
    }
  )
)
