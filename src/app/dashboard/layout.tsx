'use client'

import { useAppStore } from '@/store/use-app-store'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { StockDetailPanel } from '@/components/dashboard/StockDetail'
import { DataHydrator } from '@/components/DataHydrator'
import { PriceTicker } from '@/components/dashboard/PriceTicker'
import { EnhancedParticles } from '@/components/three/EnhancedParticles'
import { FloatingShapes } from '@/components/three/FloatingShapes'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-surface-dark bg-warm-glow relative">
      <DataHydrator />
      <EnhancedParticles />
      <FloatingShapes />
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 240 : 60 }}
      >
        <TopBar />
        <PriceTicker />
        <main className="p-4 md:p-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Stock Detail Panel - renders as overlay when a stock is selected */}
      <StockDetailPanel />
    </div>
  )
}
