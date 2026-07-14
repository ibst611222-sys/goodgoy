'use client'

import { Globe } from '@/components/three/Globe'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Eye, BarChart3, BrainCircuit, Sparkles } from 'lucide-react'

const features = [
  { icon: TrendingUp, label: 'Smart Money Signals', desc: '13F filings, insider trades, options flow — all combined into one Edge Score' },
  { icon: Shield, label: 'Dark Pool Tracking', desc: 'Institutional block trades with Z-score anomaly detection across global markets' },
  { icon: Eye, label: 'Insider Intelligence', desc: 'Real-time director transactions, pledge risks, and management changes' },
  { icon: BarChart3, label: 'Verified Backtesting', desc: 'Every signal strategy tested on real historical data with transparent win rates' },
  { icon: BrainCircuit, label: 'AI Research Notes', desc: 'Automated deep-dive analysis with variant perception and risk assessment' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-dark bg-warm-glow overflow-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gesso-gold to-gesso-amber flex items-center justify-center">
              <span className="text-surface-dark font-semibold text-xs tracking-tight">g</span>
            </div>
            <span className="font-semibold text-stone-100 tracking-tight">goodgoy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-200 transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Launch App
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-14">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] opacity-10">
            <Globe />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gesso-gold/[0.06] border border-gesso-gold/15 text-xs text-gesso-gold font-mono mb-6">
              <Sparkles className="w-3 h-3" />
              Global Market Intelligence — Now in Beta
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold text-stone-100 mb-6 leading-tight tracking-tight">
              Follow the <br />
              <span className="text-gradient">institutional flow</span><br />
              across markets
            </h1>

            <p className="text-lg text-stone-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Track 13F filings, insider transactions, and capital rotation signals —
              all verified with transparent backtesting. No noise, just signals.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  View Signals
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-20 left-0 right-0"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="glass rounded-xl border border-white/[0.04] p-6 grid grid-cols-3 gap-8">
              {[
                { value: '10,000+', label: 'Securities Tracked' },
                { value: '47', label: 'Active Signals' },
                { value: '99%', label: 'Data Reliability' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-semibold text-stone-100">{stat.value}</div>
                  <div className="text-xs text-stone-500 mt-1 font-mono">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-stone-100 mb-4 tracking-tight">
              Everything you need to<br />
              <span className="text-gradient">read the market</span>
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              The same data institutional traders use, made accessible with transparent analytics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-6 border border-white/[0.04] card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-gesso-gold/[0.06] border border-gesso-gold/15 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-gesso-gold" />
                </div>
                <h3 className="text-sm font-semibold text-stone-200 mb-2">{feature.label}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-stone-100 mb-4 tracking-tight">
              Start tracking<br />
              <span className="text-gradient">the smart money</span>
            </h2>
            <p className="text-stone-500 mb-8 max-w-xl mx-auto">
              Free during beta. No credit card required.
            </p>
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
