import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'
import NavTestToggle from '@/components/NavTestToggle'
import { TEST_MODE_ENABLED } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DNAMatch — Genetic Compatibility Analyzer',
  description: 'Analyze genetic compatibility and estimate offspring disease risk across 22 hereditary conditions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MedicalDisclaimer variant="banner" />
        <nav className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <span className="text-2xl">🧬</span>
            <span>DNA<span className="text-indigo-400">Match</span></span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/help" className="text-slate-400 hover:text-white text-sm transition-colors">Help</a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-600 text-xs hidden sm:block">Educational use only</span>
            {TEST_MODE_ENABLED && <NavTestToggle />}
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
