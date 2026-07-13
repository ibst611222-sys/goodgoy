import { Stock, Signal, MarketPulse, SectorFlow, InstitutionalFlow, InsiderTransaction, BlockTrade, MacroTheme, NewsItem, SignalPerformance, PortfolioHolding, FinancialHighlights, Stock as StockType } from './types'

export const stocks: StockType[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 198.50, change: 2.30, changePercent: 1.17, marketCap: 3100000000000, sector: 'Technology', industry: 'Consumer Electronics', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 425.30, change: -1.20, changePercent: -0.28, marketCap: 3160000000000, sector: 'Technology', industry: 'Software', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 880.15, change: 15.40, changePercent: 1.78, marketCap: 2170000000000, sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.80, change: 1.50, changePercent: 0.86, marketCap: 2190000000000, sector: 'Technology', industry: 'Internet Services', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.90, change: -0.80, changePercent: -0.43, marketCap: 1930000000000, sector: 'Technology', industry: 'E-Commerce', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 515.60, change: 8.20, changePercent: 1.62, marketCap: 1310000000000, sector: 'Technology', industry: 'Social Media', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.30, change: -5.60, changePercent: -2.23, marketCap: 780000000000, sector: 'Automotive', industry: 'Electric Vehicles', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.40, change: 1.20, changePercent: 0.61, marketCap: 572000000000, sector: 'Financial', industry: 'Banking', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'V', name: 'Visa Inc.', price: 285.60, change: 0.90, changePercent: 0.32, marketCap: 584000000000, sector: 'Financial', industry: 'Payment Processing', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'LLY', name: 'Eli Lilly and Company', price: 785.20, change: 12.50, changePercent: 1.62, marketCap: 746000000000, sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'SHEL', name: 'Shell plc', price: 72.80, change: -0.40, changePercent: -0.55, marketCap: 232000000000, sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'TM', name: 'Toyota Motor Corp.', price: 198.50, change: 2.10, changePercent: 1.07, marketCap: 270000000000, sector: 'Automotive', industry: 'Automotive Manufacturing', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'SONY', name: 'Sony Group Corp.', price: 94.30, change: 1.80, changePercent: 1.95, marketCap: 115000000000, sector: 'Technology', industry: 'Consumer Electronics', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'BABA', name: 'Alibaba Group', price: 82.50, change: -1.30, changePercent: -1.55, marketCap: 210000000000, sector: 'Technology', industry: 'E-Commerce', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'NVO', name: 'Novo Nordisk A/S', price: 132.80, change: 2.40, changePercent: 1.84, marketCap: 592000000000, sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'ASML', name: 'ASML Holding N.V.', price: 965.00, change: 14.50, changePercent: 1.53, marketCap: 380000000000, sector: 'Technology', industry: 'Semiconductor Equipment', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'KO', name: 'The Coca-Cola Company', price: 62.30, change: 0.20, changePercent: 0.32, marketCap: 269000000000, sector: 'Consumer Defensive', industry: 'Beverages', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 172.40, change: 1.10, changePercent: 0.64, marketCap: 464000000000, sector: 'Consumer Defensive', industry: 'Retail', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', price: 118.90, change: -0.70, changePercent: -0.58, marketCap: 471000000000, sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 568.70, change: -3.20, changePercent: -0.56, marketCap: 525000000000, sector: 'Healthcare', industry: 'Health Insurance', exchange: 'NYSE', currency: 'USD' },
]

export const signals: Signal[] = [
  {
    id: 'sig-1', symbol: 'NVDA', name: 'NVIDIA Corporation', price: 880.15, changePercent: 1.78,
    sector: 'Technology', whatsHappening: 'Institutional accumulation detected — 3 consecutive days of strong buying',
    buyingIntensity: 92, streak: 7, zScore: 3.2, edgeScore: 88,
    finiConfirmed: true, newsCatalyst: true, squeezePotential: false,
    shortMarginRatio: null, supportZone: false, provenWinRate: 72, provenLabel: 'Proven 72%',
    isGoldGlow: true, signalTypes: ['triple', 'long_streak', 'institutions'],
    bigHolderPercent: 68, signalAge: 12, buyRatio: 78,
    thirtyDayNet: 4520000, finiFlow: 1250000, warrantCPRatio: 2.4
  },
  {
    id: 'sig-2', symbol: 'LLY', name: 'Eli Lilly and Company', price: 785.20, changePercent: 1.62,
    sector: 'Healthcare', whatsHappening: 'Strong buying ahead of earnings — Z-score elevated',
    buyingIntensity: 85, streak: 5, zScore: 2.8, edgeScore: 82,
    finiConfirmed: true, newsCatalyst: false, squeezePotential: false,
    shortMarginRatio: null, supportZone: true, provenWinRate: 68, provenLabel: 'Proven 68%',
    isGoldGlow: true, signalTypes: ['long_streak', 'institutions'],
    bigHolderPercent: 72, signalAge: 8, buyRatio: 65,
    thirtyDayNet: 3210000, finiFlow: 890000, warrantCPRatio: null
  },
  {
    id: 'sig-3', symbol: 'META', name: 'Meta Platforms Inc.', price: 515.60, changePercent: 1.62,
    sector: 'Technology', whatsHappening: 'Unusual options activity detected',
    buyingIntensity: 78, streak: 3, zScore: 2.1, edgeScore: 76,
    finiConfirmed: true, newsCatalyst: true, squeezePotential: false,
    shortMarginRatio: null, supportZone: false, provenWinRate: null, provenLabel: null,
    isGoldGlow: false, signalTypes: ['unusual_buying', 'news'],
    bigHolderPercent: 65, signalAge: 5, buyRatio: 72,
    thirtyDayNet: 2450000, finiFlow: 670000, warrantCPRatio: 1.8
  },
  {
    id: 'sig-4', symbol: 'TSLA', name: 'Tesla Inc.', price: 245.30, changePercent: -2.23,
    sector: 'Automotive', whatsHappening: 'Dip buying — institutions accumulating on weakness',
    buyingIntensity: 65, streak: 2, zScore: 1.9, edgeScore: 71,
    finiConfirmed: true, newsCatalyst: false, squeezePotential: true,
    shortMarginRatio: 35, supportZone: false, provenWinRate: 65, provenLabel: 'Proven 65%',
    isGoldGlow: false, signalTypes: ['institutions', 'squeeze'],
    bigHolderPercent: 45, signalAge: 3, buyRatio: 58,
    thirtyDayNet: 890000, finiFlow: 340000, warrantCPRatio: 3.2
  },
  {
    id: 'sig-5', symbol: 'ASML', name: 'ASML Holding N.V.', price: 965.00, changePercent: 1.53,
    sector: 'Technology', whatsHappening: 'European institution building position ahead of EU chip directive',
    buyingIntensity: 82, streak: 4, zScore: 2.5, edgeScore: 79,
    finiConfirmed: false, newsCatalyst: true, squeezePotential: false,
    shortMarginRatio: null, supportZone: false, provenWinRate: null, provenLabel: null,
    isGoldGlow: false, signalTypes: ['unusual_buying', 'news'],
    bigHolderPercent: 78, signalAge: 6, buyRatio: 71,
    thirtyDayNet: 1850000, finiFlow: -120000, warrantCPRatio: null
  },
  {
    id: 'sig-6', symbol: 'NVO', name: 'Novo Nordisk A/S', price: 132.80, changePercent: 1.84,
    sector: 'Healthcare', whatsHappening: 'Scandinavian institutions accumulating — obesity drug pipeline confidence',
    buyingIntensity: 74, streak: 6, zScore: 2.3, edgeScore: 77,
    finiConfirmed: true, newsCatalyst: false, squeezePotential: false,
    shortMarginRatio: null, supportZone: true, provenWinRate: 71, provenLabel: 'Proven 71%',
    isGoldGlow: true, signalTypes: ['long_streak', 'institutions'],
    bigHolderPercent: 82, signalAge: 10, buyRatio: 69,
    thirtyDayNet: 2150000, finiFlow: 780000, warrantCPRatio: null
  },
  {
    id: 'sig-7', symbol: 'BABA', name: 'Alibaba Group', price: 82.50, changePercent: -1.55,
    sector: 'Technology', whatsHappening: 'Hong Kong institutions buying — potential re-rating catalyst',
    buyingIntensity: 58, streak: 1, zScore: 1.6, edgeScore: 62,
    finiConfirmed: false, newsCatalyst: false, squeezePotential: false,
    shortMarginRatio: null, supportZone: false, provenWinRate: null, provenLabel: null,
    isGoldGlow: false, signalTypes: ['fresh_signal'],
    bigHolderPercent: 55, signalAge: 1, buyRatio: 54,
    thirtyDayNet: 450000, finiFlow: -89000, warrantCPRatio: null
  },
  {
    id: 'sig-8', symbol: 'AAPL', name: 'Apple Inc.', price: 198.50, changePercent: 1.17,
    sector: 'Technology', whatsHappening: 'Hedge fund 13F filings show increased position',
    buyingIntensity: 71, streak: 3, zScore: 2.0, edgeScore: 73,
    finiConfirmed: true, newsCatalyst: false, squeezePotential: false,
    shortMarginRatio: null, supportZone: false, provenWinRate: null, provenLabel: null,
    isGoldGlow: false, signalTypes: ['institutions'],
    bigHolderPercent: 61, signalAge: 4, buyRatio: 63,
    thirtyDayNet: 1680000, finiFlow: 520000, warrantCPRatio: 1.2
  },
  {
    id: 'sig-9', symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.40, changePercent: 0.61,
    sector: 'Financial', whatsHappening: 'Insider buying by CEO — highest confidence signal',
    buyingIntensity: 88, streak: 2, zScore: 2.7, edgeScore: 84,
    finiConfirmed: true, newsCatalyst: false, squeezePotential: false,
    shortMarginRatio: null, supportZone: true, provenWinRate: 76, provenLabel: 'Proven 76%',
    isGoldGlow: false, signalTypes: ['triple', 'unusual_buying'],
    bigHolderPercent: 70, signalAge: 2, buyRatio: 81,
    thirtyDayNet: 2890000, finiFlow: 920000, warrantCPRatio: null
  },
  {
    id: 'sig-10', symbol: 'SONY', name: 'Sony Group Corp.', price: 94.30, changePercent: 1.95,
    sector: 'Technology', whatsHappening: 'Tokyo exchange accumulation — gaming & entertainment pipeline',
    buyingIntensity: 63, streak: 4, zScore: 2.1, edgeScore: 68,
    finiConfirmed: false, newsCatalyst: false, squeezePotential: false,
    shortMarginRatio: null, supportZone: false, provenWinRate: null, provenLabel: null,
    isGoldGlow: false, signalTypes: ['long_streak'],
    bigHolderPercent: 52, signalAge: 7, buyRatio: 60,
    thirtyDayNet: 720000, finiFlow: 120000, warrantCPRatio: null
  },
]

export const marketPulse: MarketPulse = {
  spyPrice: 5284.50,
  spyChange: 18.20,
  spyChangePercent: 0.35,
  fearGreedScore: 62,
  finiNetFlow: 1250000000,
  totalSignalCount: 47,
  advancers: 1245,
  decliners: 986,
}

export const sectorFlows: SectorFlow[] = [
  { sector: 'Technology', inflow: 2450000000, outflow: 1200000000, velocity: 'up', avgZScore: 2.3 },
  { sector: 'Healthcare', inflow: 1850000000, outflow: 980000000, velocity: 'up', avgZScore: 2.1 },
  { sector: 'Financial', inflow: 1200000000, outflow: 1100000000, velocity: 'stable', avgZScore: 1.5 },
  { sector: 'Energy', inflow: 680000000, outflow: 920000000, velocity: 'down', avgZScore: 0.8 },
  { sector: 'Automotive', inflow: 450000000, outflow: 780000000, velocity: 'down', avgZScore: 1.1 },
  { sector: 'Consumer Defensive', inflow: 320000000, outflow: 280000000, velocity: 'up', avgZScore: 0.6 },
]

export const institutionalFlows: InstitutionalFlow[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', finiNet: 1250000, trustNet: 450000, dealerNet: 120000, smartMoney: true, zScore: 3.2, streak: 7, sector: 'Technology' },
  { symbol: 'LLY', name: 'Eli Lilly and Company', finiNet: 890000, trustNet: 320000, dealerNet: -50000, smartMoney: true, zScore: 2.8, streak: 5, sector: 'Healthcare' },
  { symbol: 'META', name: 'Meta Platforms Inc.', finiNet: 670000, trustNet: 180000, dealerNet: 90000, smartMoney: true, zScore: 2.1, streak: 3, sector: 'Technology' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', finiNet: 920000, trustNet: -120000, dealerNet: 210000, smartMoney: false, zScore: 2.7, streak: 2, sector: 'Financial' },
  { symbol: 'NVO', name: 'Novo Nordisk A/S', finiNet: 780000, trustNet: 290000, dealerNet: -15000, smartMoney: true, zScore: 2.3, streak: 6, sector: 'Healthcare' },
]

export const insiderTransactions: InsiderTransaction[] = [
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'director_buy', insiderName: 'Jamie Dimon', shares: 15000, value: 2976000, date: '2026-07-12', urgency: 'high' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'sell_alert', insiderName: 'Robyn Denholm', shares: 45000, value: 11038500, date: '2026-07-11', urgency: 'high' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'management_change', insiderName: 'Luca Maestri', shares: 0, value: 0, date: '2026-07-10', urgency: 'medium' },
  { symbol: 'BABA', name: 'Alibaba Group', type: 'director_buy', insiderName: 'Joe Tsai', shares: 500000, value: 41250000, date: '2026-07-09', urgency: 'high' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'pledge_risk', insiderName: 'Satya Nadella', shares: 80000, value: 34024000, date: '2026-07-08', urgency: 'medium' },
]

export const blockTrades: BlockTrade[] = [
  { symbol: 'NVDA', type: 'premium', price: 885.50, shares: 250000, totalValue: 221375000, zScore: 3.5, date: '2026-07-12' },
  { symbol: 'LLY', type: 'premium', price: 790.00, shares: 180000, totalValue: 142200000, zScore: 2.8, date: '2026-07-12' },
  { symbol: 'META', type: 'premium', price: 518.00, shares: 320000, totalValue: 165760000, zScore: 2.2, date: '2026-07-11' },
  { symbol: 'TSLA', type: 'discount', price: 240.00, shares: 500000, totalValue: 120000000, zScore: 1.8, date: '2026-07-11' },
  { symbol: 'JPM', type: 'premium', price: 200.00, shares: 150000, totalValue: 30000000, zScore: 2.1, date: '2026-07-10' },
]

export const macroThemes: MacroTheme[] = [
  {
    id: 'theme-1', name: 'AI Infrastructure Buildout', heatPercent: 78,
    thesis: 'Global hyperscalers (MSFT, AMZN, GOOGL) are in a capex supercycle for AI data centers. Semiconductor supply chain seeing unprecedented demand pull.',
    timeline: '⏱ 3-6 months', keyRisks: 'Capex digestion risk if AI ROI disappoints. Export controls create supply chain uncertainty.',
    contraView: 'AI enthusiasm is fully priced in. Expect mean reversion as spending normalizes.',
    stocks: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', signalStrength: 92 },
      { symbol: 'ASML', name: 'ASML Holding N.V.', signalStrength: 82 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', signalStrength: 71 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', signalStrength: 68 },
    ]
  },
  {
    id: 'theme-2', name: 'GLP-1 Drug Revolution', heatPercent: 65,
    thesis: 'Obesity drug market projected to reach $100B+ by 2030. Novo Nordisk and Eli Lilly leading with expanding indications.',
    timeline: '⏱ 6-12 months', keyRisks: 'Pricing pressure from insurers. Competition from oral alternatives.',
    contraView: 'Market caps already discount peak sales. Regulatory headwinds could compress margins.',
    stocks: [
      { symbol: 'LLY', name: 'Eli Lilly and Company', signalStrength: 85 },
      { symbol: 'NVO', name: 'Novo Nordisk A/S', signalStrength: 78 },
    ]
  },
  {
    id: 'theme-3', name: 'Japan Corporate Governance Reform', heatPercent: 52,
    thesis: 'TSE restructuring demands listed companies improve ROE and shareholder returns. Buybacks and dividends accelerating.',
    timeline: '⏱ 12-18 months', keyRisks: 'Reform fatigue. BoJ policy normalization could strengthen yen, hurting exporters.',
    contraView: 'Reform benefits are already priced in after 2024 rally. Further upside requires earnings acceleration.',
    stocks: [
      { symbol: 'TM', name: 'Toyota Motor Corp.', signalStrength: 55 },
      { symbol: 'SONY', name: 'Sony Group Corp.', signalStrength: 63 },
    ]
  },
]

export const signalPerformances: SignalPerformance[] = [
  { signalName: 'Triple Signal (Branch+Inst+News)', signalsFired: 187, dataState: 'validated', winRate: 72.3, avgReturn: 3.45, netAfterCost: 3.25, profitFactor: 2.1, maxDD: -8.5, sharpe: 1.8, alpha: 2.1 },
  { signalName: 'Z-Score + FINI Confirmation', signalsFired: 342, dataState: 'validated', winRate: 68.1, avgReturn: 2.85, netAfterCost: 2.65, profitFactor: 1.9, maxDD: -10.2, sharpe: 1.5, alpha: 1.7 },
  { signalName: 'Z-Score + Streak (≥5d)', signalsFired: 156, dataState: 'validated', winRate: 65.8, avgReturn: 2.45, netAfterCost: 2.25, profitFactor: 1.7, maxDD: -11.8, sharpe: 1.3, alpha: 1.4 },
  { signalName: 'Options Flow Anomaly', signalsFired: 89, dataState: 'preliminary', winRate: 61.2, avgReturn: 2.15, netAfterCost: 1.95, profitFactor: 1.5, maxDD: -14.2, sharpe: 1.1, alpha: 1.2 },
  { signalName: 'Insider Buying (Director+CEO)', signalsFired: 45, dataState: 'preliminary', winRate: 73.5, avgReturn: 4.20, netAfterCost: 4.00, profitFactor: 2.4, maxDD: -7.2, sharpe: 2.1, alpha: 2.5 },
  { signalName: '13F Institutional Addition', signalsFired: 78, dataState: 'collecting', winRate: null, avgReturn: null, netAfterCost: null, profitFactor: null, maxDD: null, sharpe: null, alpha: null },
]

export const portfolioHoldings: PortfolioHolding[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 50, avgCost: 720.00, currentPrice: 880.15, dividendYield: 0.02, annualDividend: 0.40 },
  { symbol: 'LLY', name: 'Eli Lilly and Company', shares: 30, avgCost: 650.00, currentPrice: 785.20, dividendYield: 0.68, annualDividend: 5.20 },
  { symbol: 'META', name: 'Meta Platforms Inc.', shares: 100, avgCost: 480.00, currentPrice: 515.60, dividendYield: 0.45, annualDividend: 2.00 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', shares: 75, avgCost: 185.00, currentPrice: 198.40, dividendYield: 2.35, annualDividend: 4.60 },
]

export const news: NewsItem[] = [
  { id: 'news-1', title: 'NVIDIA Announces Next-Gen AI Chip Platform', source: 'reuters', url: '#', date: '2026-07-12', symbols: ['NVDA', 'AMD', 'ASML'], sentiment: 'positive', summary: 'NVIDIA unveils its next-generation AI chip platform with 3x performance improvement, expected to ship Q1 2027.' },
  { id: 'news-2', title: 'Fed Minutes Indicate Potential Rate Cut in September', source: 'bloomberg', url: '#', date: '2026-07-12', symbols: ['SPY', 'QQQ'], sentiment: 'positive', summary: 'Federal Reserve minutes show growing consensus for a rate cut at the September meeting as inflation continues to moderate.' },
  { id: 'news-3', title: 'Eli Lilly Obesity Drug Shows Promising Trial Results', source: 'reuters', url: '#', date: '2026-07-11', symbols: ['LLY', 'NVO'], sentiment: 'positive', summary: 'Eli Lilly\'s next-generation obesity drug shows 25% weight loss in Phase 3 trial, exceeding analyst expectations.' },
  { id: 'news-4', title: 'EU Finalizes AI Regulation Framework', source: 'bloomberg', url: '#', date: '2026-07-11', symbols: ['ASML', 'SAP', 'STM'], sentiment: 'neutral', summary: 'European Union finalizes comprehensive AI regulation framework, with implications for semiconductor and technology companies operating in Europe.' },
  { id: 'news-5', title: 'Toyota Reports Record Quarterly Profit', source: 'reuters', url: '#', date: '2026-07-10', symbols: ['TM', 'HMC'], sentiment: 'positive', summary: 'Toyota Motor reports record quarterly profit driven by strong hybrid vehicle sales and favorable currency effects.' },
]

export const financialHighlights: Record<string, FinancialHighlights> = {
  'NVDA': {
    symbol: 'NVDA', name: 'NVIDIA Corporation',
    marketCap: 2170000000000, pe: 52.3, forwardPE: 35.1, pb: 28.5, beta: 1.65,
    dividendYield: 0.02, payoutRatio: 2.1, revenue: 79200000000, revenueGrowth: 85.2,
    grossMargin: 72.5, operatingMargin: 54.2, profitMargin: 48.9, roe: 68.4, roa: 38.2,
    eps: 16.82, debtEquity: 0.35, currentRatio: 3.2, fiftyTwoWeekHigh: 950.00, fiftyTwoWeekLow: 420.00,
    avgVolume: 45000000, sharesOutstanding: 2460000000, shortRatio: 1.2, shortPercentFloat: 2.1,
  },
  'AAPL': {
    symbol: 'AAPL', name: 'Apple Inc.',
    marketCap: 3100000000000, pe: 31.2, forwardPE: 28.4, pb: 45.2, beta: 1.22,
    dividendYield: 0.52, payoutRatio: 15.8, revenue: 395000000000, revenueGrowth: 3.5,
    grossMargin: 45.8, operatingMargin: 30.2, profitMargin: 25.4, roe: 145.6, roa: 28.5,
    eps: 6.35, debtEquity: 1.45, currentRatio: 0.98, fiftyTwoWeekHigh: 210.00, fiftyTwoWeekLow: 165.00,
    avgVolume: 55000000, sharesOutstanding: 15500000000, shortRatio: 0.8, shortPercentFloat: 0.9,
  },
}
