/**
 * FMP API Proxy Route — proxies Financial Modeling Prep API calls server-side.
 * The FMP API key stays server-side (NEXT_PUBLIC_FMP_API_KEY is not needed).
 *
 * Usage: GET /api/fmp?endpoint=quote&symbol=AAPL
 */

const FMP_BASE = 'https://financialmodelingprep.com/stable'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const apikey = process.env.FMP_API_KEY // Server-side only — never exposed to client

  if (!endpoint) {
    return Response.json({ error: 'Missing endpoint parameter' }, { status: 400 })
  }

  if (!apikey) {
    return Response.json({ error: 'FMP_API_KEY not configured on server' }, { status: 500 })
  }

  // Forward allowed params (excluding apikey which we set server-side)
  const allowedParams = ['symbol', 'limit', 'from', 'to', 'marketCapMoreThan', 'marketCapLowerThan', 'sector']
  const params = new URLSearchParams()
  params.set('apikey', apikey)

  for (const key of allowedParams) {
    const val = searchParams.get(key)
    if (val) params.set(key, val)
  }

  try {
    const url = `${FMP_BASE}/${endpoint}?${params.toString()}`
    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5-minute cache
    })

    if (!res.ok) {
      return Response.json(
        { error: `FMP API error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch from FMP API' },
      { status: 500 }
    )
  }
}
