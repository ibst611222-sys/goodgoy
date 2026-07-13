'use client'

import { create } from 'zustand'
import { Signal, MarketPulse, SectorFlow, InstitutionalFlow, InsiderTransaction, BlockTrade, MacroTheme, NewsItem, SignalPerformance, PortfolioHolding } from '@/data/types'
import * as mock from '@/data/mock-data'

interface AppState {
  // Navigation
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  toggleSidebar: () => void

  // Market Data
  marketPulse: MarketPulse
  signals: Signal[]
  sectorFlows: SectorFlow[]
  institutionalFlows: InstitutionalFlow[]
  insiderTransactions: InsiderTransaction[]
  blockTrades: BlockTrade[]
  macroThemes: MacroTheme[]
  news: NewsItem[]
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

  // Data refresh simulation
  lastRefresh: Date
  refreshData: () => void

  // Watchlist
  watchlist: string[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  isInWatchlist: (symbol: string) => boolean
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Market Data
  marketPulse: mock.marketPulse,
  signals: mock.signals,
  sectorFlows: mock.sectorFlows,
  institutionalFlows: mock.institutionalFlows,
  insiderTransactions: mock.insiderTransactions,
  blockTrades: mock.blockTrades,
  macroThemes: mock.macroThemes,
  news: mock.news,
  signalPerformances: mock.signalPerformances,
  portfolioHoldings: mock.portfolioHoldings,

  // Selected stock
  selectedSymbol: null,
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

  // UI State
  globalMarketFilter: 'all',
  setGlobalMarketFilter: (filter) => set({ globalMarketFilter: filter }),
  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

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
}))
