'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ParseResult, SNPMap } from '@/lib/types'
import DNAUploadZone from '@/components/DNAUploadZone'
import ManualSNPEntry from '@/components/ManualSNPEntry'
import { analyzeCompatibility, filterToRelevantSNPs } from '@/lib/genetics/analyzer'
import { submitDNAData } from '@/lib/firestore'
import { cn } from '@/lib/utils'

type InputMode = 'upload' | 'manual'

function snpMapReplacer(_key: string, value: unknown) {
  if (value instanceof Map) {
    return Object.fromEntries(value)
  }
  return value
}

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useState<InputMode>('upload')

  const [maleParseResult, setMaleParseResult] = useState<ParseResult | null>(null)
  const [femaleParseResult, setFemaleParseResult] = useState<ParseResult | null>(null)
  const [maleManualMap, setMaleManualMap] = useState<SNPMap>(new Map())
  const [femaleManualMap, setFemaleManualMap] = useState<SNPMap>(new Map())

  const [consentGiven, setConsentGiven] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maleMap = mode === 'upload' ? maleParseResult?.snpMap ?? null : (maleManualMap.size > 0 ? maleManualMap : null)
  const femaleMap = mode === 'upload' ? femaleParseResult?.snpMap ?? null : (femaleManualMap.size > 0 ? femaleManualMap : null)

  const canAnalyze = maleMap !== null && femaleMap !== null && !isAnalyzing

  const handleAnalyze = async () => {
    if (!maleMap || !femaleMap) return
    setIsAnalyzing(true)
    setError(null)

    try {
      const filteredMale = filterToRelevantSNPs(maleMap)
      const filteredFemale = filterToRelevantSNPs(femaleMap)
      const result = analyzeCompatibility(filteredMale, filteredFemale)

      // Non-blocking Firestore submission — only if user opted in
      if (consentGiven) {
        submitDNAData(filteredMale, filteredFemale, result).catch(() => {
          // Submission failure is silent — analysis still proceeds
        })
      }

      sessionStorage.setItem('dnamatch_result', JSON.stringify(result, snpMapReplacer))
      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const handleUploadError = useCallback((msg: string) => setError(msg), [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-16 pb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Genetic Compatibility<br />
          <span className="text-indigo-400">Analyzer</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Upload two DNA files to analyze hereditary disease risk for offspring across{' '}
          <strong className="text-slate-300">22 genetic conditions</strong> using Mendelian inheritance principles.
        </p>
      </section>

      {/* Mode toggle */}
      <div className="flex justify-center mb-8 px-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-1 flex gap-1">
          {([
            ['upload', '📁 Upload DNA File'],
            ['manual', '✏️ Enter SNPs Manually'],
          ] as [InputMode, string][]).map(([m, label]) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null) }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload / Manual panels */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mode === 'upload' ? (
            <>
              <DNAUploadZone
                label="Father's DNA"
                color="blue"
                onParsed={setMaleParseResult}
                onError={handleUploadError}
              />
              <DNAUploadZone
                label="Mother's DNA"
                color="pink"
                onParsed={setFemaleParseResult}
                onError={handleUploadError}
              />
            </>
          ) : (
            <>
              <ManualSNPEntry
                label="Father's Variants"
                color="blue"
                onUpdate={setMaleManualMap}
              />
              <ManualSNPEntry
                label="Mother's Variants"
                color="pink"
                onUpdate={setFemaleManualMap}
              />
            </>
          )}
        </div>

        {/* Research opt-in */}
        <div className="mb-6 bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={e => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-700 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
            />
            <div>
              <p className="text-slate-200 text-sm font-medium">
                Contribute anonymously to genetic research
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Only the ~60 disease-relevant genetic variants (not your full genome file) will be stored
                anonymously in our research database. No name, email, or identifying information is collected.
                This data will be used to improve variant frequency analysis over time.
                <strong className="text-slate-400"> Unchecked = your data stays only in your browser.</strong>
              </p>
            </div>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Analyze button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={cn(
              'px-10 py-4 rounded-xl text-base font-semibold transition-all',
              canAnalyze
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            )}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚙</span> Analyzing…
              </span>
            ) : (
              '🔬 Analyze Genetic Compatibility'
            )}
          </button>
        </div>

        {/* How it works */}
        <section className="mb-16 border-t border-slate-800 pt-12">
          <h2 className="text-white font-bold text-xl mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '📁', title: '1. Upload DNA Files', text: 'Upload raw data from 23andMe, AncestryDNA (.txt), or any VCF file. You can also enter individual SNP variants manually.' },
              { icon: '🧬', title: '2. Genetic Analysis', text: 'The app scans for 22 hereditary conditions using curated disease-associated SNPs and Mendelian inheritance rules.' },
              { icon: '📊', title: '3. Offspring Risk Report', text: 'See percentage chances that offspring will be affected, a carrier, or unaffected for each condition.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions covered */}
        <section className="mb-16">
          <h2 className="text-white font-bold text-xl mb-4 text-center">22 Conditions Analyzed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm text-slate-400">
            {[
              'Cystic Fibrosis', 'Sickle Cell Anemia', 'Beta-Thalassemia', 'Tay-Sachs Disease',
              'PKU', 'Gaucher Disease', 'Spinal Muscular Atrophy', "Wilson's Disease",
              'Hereditary Hemochromatosis', "Huntington's Disease", 'Familial Hypercholesterolemia',
              'BRCA1 (Breast Cancer)', 'BRCA2 (Breast Cancer)', 'Factor V Leiden',
              'Marfan Syndrome', 'Hemophilia A', 'Hemophilia B', 'Duchenne MD',
              'Color Blindness', 'Fragile X Syndrome', 'MTHFR Variant', 'Prothrombin Thrombophilia',
            ].map(name => (
              <div key={name} className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs border border-slate-700/50">
                {name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
