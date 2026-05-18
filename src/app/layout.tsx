import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'

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
          <span className="text-slate-500 text-xs">Educational use only — not a medical device</span>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
