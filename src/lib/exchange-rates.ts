/**
 * Exchange Rate Service — fetches live exchange rates from free API.
 * No API key required. Uses open.er-api.com which updates daily.
 */

const EXCHANGE_API = 'https://open.er-api.com/v6/latest/USD'

export interface ExchangeRates {
  [currency: string]: number
}

// Cache the rates so we don't fetch on every call
let cachedRates: ExchangeRates | null = null
let lastFetch = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

/**
 * Supported currencies for the currency selector.
 */
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', label: 'USD $', symbol: '$' },
  { code: 'EUR', label: 'EUR €', symbol: '€' },
  { code: 'GBP', label: 'GBP £', symbol: '£' },
  { code: 'JPY', label: 'JPY ¥', symbol: '¥' },
  { code: 'CNY', label: 'CNY ¥', symbol: '¥' },
  { code: 'TWD', label: 'TWD NT$', symbol: 'NT$' },
  { code: 'HKD', label: 'HKD HK$', symbol: 'HK$' },
  { code: 'KRW', label: 'KRW ₩', symbol: '₩' },
  { code: 'SGD', label: 'SGD S$', symbol: 'S$' },
  { code: 'CAD', label: 'CAD C$', symbol: 'C$' },
  { code: 'AUD', label: 'AUD A$', symbol: 'A$' },
  { code: 'CHF', label: 'CHF Fr', symbol: 'Fr' },
  { code: 'INR', label: 'INR ₹', symbol: '₹' },
]

/**
 * Get currency symbol from currency code.
 */
export function getCurrencySymbol(code: string): string {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || '$'
}

/**
 * Fetch latest exchange rates from the free API.
 * Falls back to cached rates if fetch fails.
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Return cached rates if still fresh
  if (cachedRates && Date.now() - lastFetch < CACHE_TTL) {
    return cachedRates
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(EXCHANGE_API, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    })
    clearTimeout(timeout)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    if (data?.rates) {
      cachedRates = data.rates
      lastFetch = Date.now()
      return data.rates
    }
    throw new Error('No rates in response')
  } catch {
    // Return cached rates even if stale, rather than failing
    if (cachedRates) return cachedRates
    // Ultimate fallback: hardcoded approximate rates
    return {
      USD: 1, EUR: 0.93, GBP: 0.79, JPY: 149.5,
      CNY: 7.25, TWD: 32.5, HKD: 7.82, KRW: 1320,
      SGD: 1.35, CAD: 1.37, AUD: 1.52, CHF: 0.89,
      INR: 83.5,
    }
  }
}

/**
 * Convert a USD amount to the target currency.
 */
export function convertCurrency(usdValue: number, targetCurrency: string, rates: ExchangeRates): number {
  if (targetCurrency === 'USD' || !rates) return usdValue
  const rate = rates[targetCurrency]
  if (!rate) return usdValue
  return usdValue * rate
}
