'use client'

import { Globe } from '@/components/three/Globe'
import { ParticleField } from '@/components/three/ParticleField'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Eye, BarChart3, BrainCircuit } from 'lucide-react'

const features = [
  { icon: TrendingUp, label: 'Smart Money Signals', desc: '13F filings, insider trades, options flow — all combined into one Edge Score' },
  { icon: Shield, label: 'Dark Pool Tracking', desc: 'Institutional block trades with Z-score anomaly detection across global markets' },
  { icon: Eye, label: 'Insider Intelligence', desc: 'Real-time director transactions, pledge risks, and management changes' },
  { icon: BarChart3, label: 'Verified Backtesting', desc: 'Every signal strategy tested on real historical data with transparent win rates' },
  { icon: BrainCircuit, label: 'AI Research Notes', desc: 'Automated deep-dive analysis with variant perception and risk assessment' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-dark overflow-hidden">
      <ParticleField volatility={0.15} density={60} color="#5b21f6" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-black font-bold text-xs">G</span>
            </div>
            <span className="font-bold text-white">goodgoy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-white/50 hover:text-white/80 transition-colors">
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
          <div className="w-[600px] h-[600px] opacity-30">
            <Globe />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-500/10 border border-cosmic-500/20 text-xs text-neon-cyan font-mono mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              Global Market Intelligence — Now Live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Catch the<br />
              <span className="text-gradient">smart money</span><br />
              before the crowd
            </h1>

            <p className="text-lg text-white/40 max-w-2xl mx-auto mb-8">
              Institutional-grade market intelligence for everyone. Track 13F filings, insider transactions,
              options flow, and global capital rotation — all verified with transparent backtesting.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Watch Demo
              </Button>
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
            <div className="glass rounded-xl border border-white/5 p-6 grid grid-cols-3 gap-8">
              {[
                { value: '10,000+', label: 'Global Securities' },
                { value: '47', label: 'Active Signals' },
                { value: '94.2%', label: 'Data Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/30 mt-1 font-mono">{stat.label}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to<br />
              <span className="text-gradient">outsmart the market</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
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
                className="glass rounded-xl p-6 border border-white/5 card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-cosmic-500/10 border border-cosmic-500/20 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-neon-cyan" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{feature.label}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start tracking smart money<br />
              <span className="text-gradient">across global markets</span>
            </h2>
            <p className="text-white/40 mb-8 max-w-xl mx-auto">
              Free access during beta. No credit card required.
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
