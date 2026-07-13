import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'goodgoy — Global Market Intelligence | Smart Money Signals',
  description: 'Institutional-grade global market intelligence. Track smart money across all markets with verified signal performance.',
  keywords: 'stock market, smart money, 13F, insider trading, market signals, global stocks, institutional investing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-dark">
        {children}
      </body>
    </html>
  )
}
