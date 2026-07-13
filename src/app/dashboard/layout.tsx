'use client'

import { useAppStore } from '@/store/use-app-store'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { ParticleField } from '@/components/three/ParticleField'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, activeTab } = useAppStore()

  return (
    <div className="min-h-screen bg-surface-dark">
      <ParticleField volatility={0.2} density={80} />
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 240 : 60 }}
      >
        <TopBar />
        <main className="p-4 md:p-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
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
    </div>
  )
}
