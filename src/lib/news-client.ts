/**
 * News Client — fetches market news from free RSS feeds.
 * No API keys required.
 */

interface RSSItem {
  title: string
  link: string
  pubDate: string
  source: string
  description: string
  feedSource: NewsArticle['source']
}

export interface NewsArticle {
  id: string
  title: string
  source: 'reuters' | 'bloomberg' | 'yahoo' | 'cnbc'
  url: string
  date: string
  symbols: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  summary: string
}

// Maps stock symbols to keywords for matching news articles
const SYMBOL_KEYWORDS: Record<string, string[]> = {
  'AAPL': ['Apple', 'iPhone', 'Tim Cook', 'AAPL'],
  'MSFT': ['Microsoft', 'Azure', 'Satya Nadella', 'MSFT'],
  'NVDA': ['NVIDIA', 'Jensen Huang', 'NVDA', 'GeForce'],
  'GOOGL': ['Google', 'Alphabet', 'GOOGL', 'GOOG'],
  'AMZN': ['Amazon', 'AWS', 'AMZN', 'Jeff Bezos'],
  'META': ['Meta', 'Facebook', 'Instagram', 'WhatsApp', 'META'],
  'TSLA': ['Tesla', 'Elon Musk', 'TSLA', 'Cybertruck'],
  'JPM': ['JPMorgan', 'Jamie Dimon', 'JPM'],
  'V': ['Visa', 'V'],
  'LLY': ['Eli Lilly', 'LLY', 'Zepbound', 'Mounjaro'],
  'NVO': ['Novo Nordisk', 'NVO', 'Ozempic', 'Wegovy'],
  'SHEL': ['Shell', 'SHEL'],
  'TM': ['Toyota', 'TM'],
  'SONY': ['Sony', 'PlayStation', 'SONY'],
  'BABA': ['Alibaba', 'BABA', 'Jack Ma'],
  'ASML': ['ASML', 'ASML'],
  'KO': ['Coca-Cola', 'KO'],
  'WMT': ['Walmart', 'WMT'],
  'XOM': ['Exxon', 'ExxonMobil', 'XOM'],
  'UNH': ['UnitedHealth', 'UNH'],
}

const RSS_FEEDS: { url: string; source: NewsArticle['source'] }[] = [
  { url: 'https://finance.yahoo.com/news/rssindex', source: 'yahoo' },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories', source: 'reuters' },
  { url: 'https://seekingalpha.com/feed.xml', source: 'reuters' },
]

function extractSymbols(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase()
  const found: string[] = []

  for (const [symbol, keywords] of Object.entries(SYMBOL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        found.push(symbol)
        break
      }
    }
  }

  return found
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim()
}

function determineSentiment(title: string, description: string): NewsArticle['sentiment'] {
  const text = `${title} ${description}`.toLowerCase()
  const positive = ['surge', 'rally', 'gain', 'growth', 'bullish', 'upgrade', 'positive', 'profit', 'record', 'innovation', 'breakthrough', 'approval']
  const negative = ['slump', 'decline', 'loss', 'cut', 'bearish', 'downgrade', 'negative', 'investigation', 'lawsuit', 'ban', 'crash', 'plunge', 'risk']

  const posCount = positive.filter(w => text.includes(w)).length
  const negCount = negative.filter(w => text.includes(w)).length

  if (posCount > negCount) return 'positive'
  if (negCount > posCount) return 'negative'
  return 'neutral'
}

async function fetchRSS(url: string, feedSource: NewsArticle['source']): Promise<RSSItem[]> {
  try {
    // Abort after 5 seconds to prevent hanging
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 600 },
    })
    clearTimeout(timeout)

    if (!res.ok) return []

    const text = await res.text()

    // Simple XML parsing for RSS items
    const items: RSSItem[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi
    let match

    while ((match = itemRegex.exec(text)) !== null) {
      const itemXml = match[1]
      const title = stripHtml(itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
      const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() || ''
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() || ''
      const description = stripHtml(itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1]?.trim() || '')
      const source = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/i)?.[1]?.trim() || 'Yahoo Finance'

      if (title && link) {
        items.push({ title, link, pubDate, source, description, feedSource })
      }
    }

    return items
  } catch {
    return []
  }
}

function parseDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

/**
 * Fetch latest market news from free RSS feeds.
 */
export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const allItems: RSSItem[] = []

    for (const feed of RSS_FEEDS) {
      const items = await fetchRSS(feed.url, feed.source)
      allItems.push(...items)
    }

    // Deduplicate by title
    const seen = new Set<string>()
    const unique = allItems.filter(item => {
      const key = item.title.toLowerCase().slice(0, 50)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return unique
      .map((item, i) => {
        const symbols = extractSymbols(item.title, item.description)
        return {
          id: `news-rss-${i}`,
          title: item.title,
          source: item.feedSource,
          url: item.link,
          date: parseDate(item.pubDate),
          symbols,
          sentiment: determineSentiment(item.title, item.description),
          summary: item.description.slice(0, 200) || item.title,
        }
      })
      .filter(article => article.symbols.length > 0) // Only keep articles that mention tracked stocks
      .slice(0, 10)
  } catch {
    return []
  }
}
