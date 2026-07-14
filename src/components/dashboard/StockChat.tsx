'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { BrainCircuit, Send, Loader } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Simulated AI responses based on stock data
function generateAIResponse(symbol: string, stockName: string, price: number, changePercent: number, userMessage: string): string {
  const isPositive = changePercent >= 0
  const sentiment = isPositive ? 'bullish' : 'bearish'
  const msg = userMessage.toLowerCase()

  if (msg.includes('buy') || msg.includes('should') || msg.includes('recommend')) {
    if (isPositive) {
      return `**${symbol}** (${stockName}) is showing ${sentiment} momentum at **$${price.toFixed(2)}** (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% today).

**Analysis:**
• Price action suggests short-term upward momentum
• Current RSI in neutral range — room to run
• Volume is healthy relative to 30-day average

**⚠️ Note:** I'm an AI assistant, not a financial advisor. Always do your own research and consider your risk tolerance before trading.`
    } else {
      return `**${symbol}** (${stockName}) is trading at **$${price.toFixed(2)}** (${changePercent.toFixed(2)}% today).

**Analysis:**
• The stock is in a short-term downtrend
• Consider waiting for a support test before entering
• Watch for volume confirmation on a reversal

**⚠️ Note:** I'm an AI assistant, not a financial advisor. Always do your own research and consider your risk tolerance before trading.`
    }
  }

  if (msg.includes('news') || msg.includes('why') || msg.includes('what happened')) {
    return `**${symbol}** Latest Context:

**Market Sentiment:** ${sentiment === 'bullish' ? '🟢 Positive' : '🔴 Negative'} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% today)

**Key Points:**
• Trading at $${price.toFixed(2)} with above-average volume
• Sector peers are showing mixed signals
• The broader market trend supports current direction

Check the News page for the latest headlines on ${symbol}.`
  }

  if (msg.includes('signal') || msg.includes('edge') || msg.includes('score')) {
    return `**${symbol}** Signal Analysis:

• **Edge Score:** ${isPositive ? 'Strong' : 'Moderate'} (momentum ${sentiment})
• **Price Level:** $${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% today)
• **Volume Profile:** ${Math.abs(changePercent) > 1 ? 'Elevated — institutional interest detected' : 'Normal — steady accumulation'}

**Signal Quality:** ${Math.abs(changePercent) > 2 ? 'High conviction' : Math.abs(changePercent) > 1 ? 'Moderate conviction' : 'Low conviction — wait for confirmation'}`
  }

  // Default response
  return `**${symbol}** (${stockName}) — **$${price.toFixed(2)}** (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)

Here's a quick snapshot:
• **Trend:** ${isPositive ? '📈 Up' : '📉 Down'} today
• **Momentum:** ${Math.abs(changePercent) > 2 ? 'Strong' : Math.abs(changePercent) > 1 ? 'Moderate' : 'Mild'}
• **Volume:** ${Math.abs(changePercent) > 1.5 ? 'Above average — notable activity' : 'Within normal range'}

Ask me about buy/sell signals, recent news, or technical analysis for deeper insights!`
}

export function StockChat() {
  const { selectedSymbol, stocks } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const stock = stocks.find(s => s.symbol === selectedSymbol)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // Reset chat when symbol changes
  useEffect(() => {
    setMessages([])
    setIsOpen(false)
  }, [selectedSymbol])

  if (!selectedSymbol || !stock) return null

  async function handleSend() {
    if (!input.trim() || isLoading || !stock) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setIsOpen(true)

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))

    if (!stock) { setIsLoading(false); return }
    const response: Message = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: generateAIResponse(stock.symbol, stock.name, stock.price, stock.changePercent, userMsg.content),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, response])
    setIsLoading(false)
  }

  return (
    <div className="border-t border-surface-border/30 mt-4">
      {/* Chat header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <BrainCircuit className="w-4 h-4 text-gesso-gold" />
        <span className="text-[10px] font-mono text-white/40">
          {isOpen ? 'Hide AI Analysis' : 'Ask AI about this stock'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="ml-auto"
        >
          <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Messages */}
            <div className="max-h-64 overflow-y-auto px-4 space-y-3 py-3">
              {messages.length === 0 && (
                <div className="text-[10px] text-white/30 font-mono text-center py-4">
                  Ask anything about {stock.symbol} — price analysis, signals, news, or recommendations
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-5 h-5 rounded-full bg-gesso-gold/10 border border-gesso-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <BrainCircuit className="w-2.5 h-2.5 text-gesso-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-[10px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gesso-gold/10 text-stone-200 border border-gesso-gold/20'
                        : 'bg-surface-elevated text-stone-300 border border-surface-border/30'
                    }`}
                  >
                    <div className="prose prose-invert prose-xs max-w-none [&_strong]:text-stone-100 [&_strong]:font-semibold">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">{line || '\u00A0'}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono">
                  <Loader className="w-3 h-3 animate-spin" />
                  Analyzing {stock.symbol}...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-3 pt-1">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                  placeholder={`Ask about ${stock.symbol}...`}
                  className="flex-1 bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 text-[10px] font-mono text-stone-200 placeholder:text-white/20 focus:outline-none focus:border-gesso-gold/40"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 rounded-lg bg-gesso-gold/10 border border-gesso-gold/20 text-gesso-gold hover:bg-gesso-gold/20 transition-colors disabled:opacity-30"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
