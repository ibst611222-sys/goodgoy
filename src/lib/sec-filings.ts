/**
 * SEC Filings Client — fetches 10-Q, 10-K, 8-K filings from free SEC EDGAR API.
 * No API key required. Uses the same submissions endpoint as edgar-client.
 */

const SEC_SUBMISSIONS_URL = 'https://data.sec.gov/submissions'
const SEC_UA = 'goodgoy/1.0 (ibst611222@gmail.com)'

const CIK_MAP: Record<string, string> = {
  'AAPL': '0000320193', 'MSFT': '0000789019', 'NVDA': '0001045810',
  'GOOGL': '0001652044', 'AMZN': '0001018724', 'META': '0001326801',
  'TSLA': '0001318605', 'JPM': '0000019617', 'V': '0001403161',
  'LLY': '0000059478', 'NVO': '0000353278',
}

export interface SECFiling {
  symbol: string
  formType: string
  description: string
  date: string
  url: string
}

/**
 * Fetch recent SEC filings for a given symbol.
 * Returns 10-Q, 10-K, and 8-K filings.
 */
export async function fetchFilings(symbol: string): Promise<SECFiling[]> {
  const cik = CIK_MAP[symbol]
  if (!cik) return []

  try {
    const url = `${SEC_SUBMISSIONS_URL}/CIK${cik}.json`
    const res = await fetch(url, {
      headers: { 'User-Agent': SEC_UA },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []

    const data = await res.json()
    const filings = data?.filings?.recent
    if (!filings?.form) return []

    const forms: string[] = filings.form
    const dates: string[] = filings.filingDate || []
    const descriptions: string[] = filings.primaryDocDescription || []
    const accessionNumbers: string[] = filings.accessionNumber || []
    const primaryDocuments: string[] = filings.primaryDocument || []

    const results: SECFiling[] = []
    const targetForms = new Set(['10-Q', '10-K', '8-K'])

    for (let i = 0; i < forms.length && results.length < 20; i++) {
      if (!targetForms.has(forms[i])) continue
      const acc = accessionNumbers[i]?.replace(/-/g, '')
      const doc = primaryDocuments[i]
      const filingUrl = acc && doc ? `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${acc}/${doc}` : '#'

      results.push({
        symbol,
        formType: forms[i],
        description: descriptions[i] || `${forms[i]} filing`,
        date: dates[i] || '',
        url: filingUrl,
      })
    }

    return results
  } catch {
    return []
  }
}

/**
 * Fetch filings for all tracked symbols.
 */
export async function fetchAllFilings(symbols: string[]): Promise<SECFiling[]> {
  const results: SECFiling[] = []
  for (const symbol of symbols) {
    const filings = await fetchFilings(symbol)
    results.push(...filings)
    await new Promise(r => setTimeout(r, 300))
  }
  results.sort((a, b) => b.date.localeCompare(a.date))
  return results.slice(0, 50)
}
