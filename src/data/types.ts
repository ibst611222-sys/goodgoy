// === Stock Data ===
export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  sector: string
  industry: string
  exchange: string
  currency: string
}

// === Signal Data ===
export type SignalType = 'triple' | 'unusual_buying' | 'long_streak' | 'institutions' | 'squeeze' | 'earnings_soon' | 'warrants' | 'fresh_signal' | 'news'

export interface Signal {
  id: string
  symbol: string
  name: string
  price: number
  changePercent: number
  sector: string
  whatsHappening: string
  buyingIntensity: number // 0-100
  streak: number
  zScore: number
  edgeScore: number
  finiConfirmed: boolean
  newsCatalyst: boolean
  squeezePotential: boolean
  shortMarginRatio: number | null
  supportZone: boolean
  provenWinRate: number | null
  provenLabel: string | null
  isGoldGlow: boolean // streak >= 5
  signalTypes: SignalType[]
  bigHolderPercent: number | null
  signalAge: number
  buyRatio: number
  // Hover tooltip data
  thirtyDayNet: number
  finiFlow: number
  warrantCPRatio: number | null
}

// === Institutional Flow ===
export interface InstitutionalFlow {
  symbol: string
  name: string
  finiNet: number
  trustNet: number
  dealerNet: number
  smartMoney: boolean // FINI + Trust both buying
  zScore: number
  streak: number
  sector: string
}

export interface SectorFlow {
  sector: string
  inflow: number
  outflow: number
  velocity: 'up' | 'down' | 'stable'
  avgZScore: number
}

// === Market Overview ===
export interface MarketPulse {
  spyPrice: number
  spyChange: number
  spyChangePercent: number
  fearGreedScore: number
  finiNetFlow: number
  totalSignalCount: number
  advancers: number
  decliners: number
}

// === Fear & Greed ===
export interface FearGreedHistory {
  date: string
  score: number
}

// === Signal Performance ===
export interface SignalPerformance {
  signalName: string
  signalsFired: number
  dataState: 'collecting' | 'preliminary' | 'validated'
  winRate: number | null
  avgReturn: number | null
  netAfterCost: number | null
  profitFactor: number | null
  maxDD: number | null
  sharpe: number | null
  alpha: number | null
}

// === Backtest ===
export interface BacktestParams {
  minZScore: number
  minStreak: number
  minEdgeScore: number
  holdPeriod: number
  requireFINI: boolean
}

export interface BacktestResult {
  equityCurve: { date: string; value: number }[]
  drawdown: { date: string; value: number }[]
  sampleTrades: Trade[]
  winRate: number
  avgReturn: number
  totalTrades: number
}

export interface Trade {
  date: string
  symbol: string
  entry: number
  exit: number
  return: number
  zScore: number
}

// === Portfolio ===
export interface PortfolioHolding {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  dividendYield: number
  annualDividend: number
}

// === Insider ===
export interface InsiderTransaction {
  symbol: string
  name: string
  type: 'sell_alert' | 'pledge_risk' | 'director_buy' | 'management_change'
  insiderName: string
  shares: number
  value: number
  date: string
  urgency: 'high' | 'medium' | 'low'
}

// === Block Trade (Dark Pool) ===
export interface BlockTrade {
  symbol: string
  type: 'premium' | 'discount'
  price: number
  shares: number
  totalValue: number
  zScore: number
  date: string
}

// === Macro Theme ===
export interface MacroTheme {
  id: string
  name: string
  heatPercent: number
  thesis: string
  timeline: string
  keyRisks: string
  contraView: string
  stocks: { symbol: string; name: string; signalStrength: number }[]
}

// === News ===
export interface NewsItem {
  id: string
  title: string
  source: 'cnyes' | 'mops' | 'reuters' | 'bloomberg' | 'yahoo' | 'cnbc'
  url: string
  date: string
  symbols: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  summary: string
}

// === Earnings ===
export interface EarningsReport {
  symbol: string
  name: string
  date: string
  quarter: string
  actualEPS: number
  estimatedEPS: number
  surprisePercent: number
  priceReaction1d: number | null
  priceReaction3d: number | null
  priceReaction5d: number | null
}

// === Supply Chain ===
export interface SupplyChainNode {
  symbol: string
  name: string
  role: 'company' | 'supplier' | 'customer'
  revenueExposure: number
  confirmed: boolean
}

export interface SupplyChainMap {
  company: string
  suppliers: SupplyChainNode[]
  customers: SupplyChainNode[]
}

// === News Analysis ===
export interface HFResearchNote {
  thesis: string
  variantPerception: string
  priceTarget: number
  risks: string[]
  consensus: {
    buyCount: number
    holdCount: number
    sellCount: number
    meanTarget: number
    highTarget: number
    lowTarget: number
  }
}

// === Financial Data ===
export interface FinancialHighlights {
  symbol: string
  name: string
  marketCap: number
  pe: number
  forwardPE: number
  pb: number
  beta: number
  dividendYield: number
  payoutRatio: number
  revenue: number
  revenueGrowth: number
  grossMargin: number
  operatingMargin: number
  profitMargin: number
  roe: number
  roa: number
  eps: number
  debtEquity: number
  currentRatio: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  avgVolume: number
  sharesOutstanding: number
  shortRatio: number
  shortPercentFloat: number
}

// === Screener Preset ===
export interface ScreenerPreset {
  id: string
  name: string
  filters: Partial<ScreenerFilters>
}

export interface ScreenerFilters {
  minStreak: number
  minBuyRatio: number
  minBigHolder: number
  minZScore: number
  minEdgeScore: number
  finiConfirmed: boolean
  sector: string | null
  minMarketCap: number
}

// === Chart Data ===
export interface ChartDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}
