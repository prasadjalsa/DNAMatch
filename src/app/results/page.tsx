'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AnalysisResult, DiseaseResult, RiskLevel } from '@/lib/types'
import CompatibilityScore from '@/components/CompatibilityScore'
import DiseaseRiskCard from '@/components/DiseaseRiskCard'
import RiskSummaryTable from '@/components/RiskSummaryTable'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'
import { cn } from '@/lib/utils'

type FilterTab = 'all' | 'elevated' | 'moderate' | 'none'

const ELEVATED_LEVELS: RiskLevel[] = ['high', 'very_high']
const MODERATE_LEVELS: RiskLevel[] = ['low', 'moderate']

function filterResults(results: DiseaseResult[], tab: FilterTab): DiseaseResult[] {
  if (tab === 'all') return results
  if (tab === 'elevated') return results.filter(r => ELEVATED_LEVELS.includes(r.riskLevel))
  if (tab === 'moderate') return results.filter(r => MODERATE_LEVELS.includes(r.riskLevel))
  return results.filter(r => r.riskLevel === 'none')
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [tab, setTab] = useState<FilterTab>('all')

  useEffect(() => {
    const stored = sessionStorage.getItem('dnamatch_result')
    if (!stored) {
      router.replace('/')
      return
    }
    try {
      setResult(JSON.parse(stored) as AnalysisResult)
    } catch {
      router.replace('/')
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-lg animate-pulse">Loading analysis…</div>
      </div>
    )
  }

  const elevatedCount = result.diseases.filter(r => ELEVATED_LEVELS.includes(r.riskLevel)).length
  const moderateCount = result.diseases.filter(r => MODERATE_LEVELS.includes(r.riskLevel)).length
  const noneCount = result.diseases.filter(r => r.riskLevel === 'none').length

  const tabDefs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: result.diseases.length },
    { id: 'elevated', label: 'Elevated Risk', count: elevatedCount },
    { id: 'moderate', label: 'Moderate / Low', count: moderateCount },
    { id: 'none', label: 'No Risk', count: noneCount },
  ]

  const filtered = filterResults(result.diseases, tab)

  return (
    <div className="min-h-screen pb-16">
      {/* Sticky score header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <CompatibilityScore score={result.compatibilityScore} category={result.scoreCategory} />
            <div className="hidden sm:block space-y-1 text-sm">
              <p className="text-slate-300">
                <strong className="text-white">{result.diseases.length}</strong> conditions analyzed
              </p>
              {elevatedCount > 0 && (
                <p className="text-red-400">
                  <strong>{elevatedCount}</strong> elevated risk{elevatedCount > 1 ? 's' : ''}
                </p>
              )}
              <p className="text-slate-500 text-xs">
                {result.variantsFound} of {result.totalVariantsAnalyzed} variant positions found in files
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 text-sm transition-colors"
            >
              ← New Analysis
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 text-sm transition-colors"
            >
              🖨 Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6">
        {/* Same-file warning */}
        {result.sameFileSuspect && (
          <div className="mb-6 bg-amber-900/30 border border-amber-700 rounded-xl px-4 py-3 text-amber-300 text-sm">
            ⚠ The two uploaded files appear to be identical. For meaningful results, please upload DNA from two different individuals.
          </div>
        )}

        {/* Low variant coverage warning */}
        {result.variantsFound < 10 && (
          <div className="mb-6 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-300 text-sm">
            <strong>Note:</strong> Only {result.variantsFound} disease-relevant variant positions were found in the uploaded files. Many results will show "Unknown" status. For best results, use raw data files from 23andMe v4/v5 or comprehensive VCF files.
          </div>
        )}

        {/* Summary table */}
        <section className="mb-6">
          <h2 className="text-white font-bold text-lg mb-3">All Conditions — Summary</h2>
          <RiskSummaryTable results={result.diseases} />
        </section>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tabDefs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                tab === t.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
              )}
            >
              {t.label}
              {t.count > 0 && (
                <span className={cn(
                  'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                  tab === t.id ? 'bg-indigo-500' : 'bg-slate-700'
                )}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Disease cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No conditions match this filter.</div>
          ) : (
            filtered.map(r => (
              <DiseaseRiskCard key={r.disease.id} result={r} />
            ))
          )}
        </div>

        <MedicalDisclaimer variant="footer" />
      </div>
    </div>
  )
}
