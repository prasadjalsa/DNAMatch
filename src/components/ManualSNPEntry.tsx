'use client'

import { useState, useEffect } from 'react'
import type { SNPMap } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ManualSNPEntryProps {
  label: string
  color: 'blue' | 'pink'
  onUpdate: (snpMap: SNPMap) => void
}

interface Row {
  rsid: string
  genotype: string
  rsidError?: string
  genotypeError?: string
}

const EXAMPLE_SNPS: Row[] = [
  { rsid: 'rs1800562', genotype: 'AG' },  // HFE C282Y heterozygous
  { rsid: 'rs1799945', genotype: 'CG' },  // HFE H63D heterozygous
  { rsid: 'rs6025', genotype: 'GG' },     // Factor V Leiden normal
  { rsid: 'rs1801133', genotype: 'CT' },  // MTHFR C677T heterozygous
  { rsid: 'rs1801131', genotype: 'AA' },  // MTHFR A1298C normal
  { rsid: 'rs334', genotype: 'AA' },      // HBB sickle cell normal
]

function validateRsid(v: string): string | undefined {
  if (!v) return undefined
  if (!/^rs\d+$/.test(v.trim())) return 'Format: rs + numbers (e.g. rs12345)'
}

function validateGenotype(v: string): string | undefined {
  if (!v) return undefined
  if (!/^[ACGTIDacgtid]{1,2}$/.test(v.trim())) return 'Use 1–2 letters: A C G T I D'
}

export default function ManualSNPEntry({ label, color, onUpdate }: ManualSNPEntryProps) {
  const [rows, setRows] = useState<Row[]>([
    { rsid: '', genotype: '' },
    { rsid: '', genotype: '' },
  ])

  const accent = color === 'blue' ? 'text-blue-400' : 'text-pink-400'
  const inputFocus = color === 'blue'
    ? 'focus:border-blue-500 focus:ring-blue-500/20'
    : 'focus:border-pink-500 focus:ring-pink-500/20'

  useEffect(() => {
    const map: SNPMap = new Map()
    for (const row of rows) {
      const rsid = row.rsid.trim()
      const gt = row.genotype.trim().toUpperCase()
      if (rsid && gt && !row.rsidError && !row.genotypeError && /^rs\d+$/.test(rsid)) {
        map.set(rsid, gt)
      }
    }
    onUpdate(map)
  }, [rows, onUpdate])

  const updateRow = (index: number, field: 'rsid' | 'genotype', value: string) => {
    setRows(prev => prev.map((row, i) => {
      if (i !== index) return row
      const updated = { ...row, [field]: value }
      if (field === 'rsid') updated.rsidError = validateRsid(value)
      if (field === 'genotype') updated.genotypeError = validateGenotype(value)
      return updated
    }))
  }

  const addRow = () => setRows(prev => [...prev, { rsid: '', genotype: '' }])
  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i))
  const loadExample = () => setRows(EXAMPLE_SNPS.map(r => ({ ...r })))

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text')
    const lines = text.trim().split('\n')
    const parsed: Row[] = []
    for (const line of lines) {
      const parts = line.split(/[\t,;]/)
      if (parts.length >= 2) {
        parsed.push({ rsid: parts[0].trim(), genotype: parts[1].trim().toUpperCase() })
      }
    }
    if (parsed.length > 0) {
      e.preventDefault()
      setRows(parsed)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className={cn('text-sm font-semibold uppercase tracking-wider', accent)}>{label}</h3>
        <div className="flex gap-2">
          <button
            onClick={loadExample}
            className="text-xs text-slate-400 hover:text-slate-200 border border-slate-600 hover:border-slate-400 px-2 py-1 rounded"
          >
            Load example
          </button>
          <button
            onClick={addRow}
            className={cn('text-xs px-2 py-1 rounded border', color === 'blue' ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30' : 'border-pink-600 text-pink-400 hover:bg-pink-900/30')}
          >
            + Add row
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden" onPaste={handlePaste}>
        <div className="grid grid-cols-[1fr_100px_32px] text-xs text-slate-500 px-3 py-2 border-b border-slate-700 bg-slate-900">
          <span>RS Identifier</span>
          <span>Genotype</span>
          <span />
        </div>

        <div className="divide-y divide-slate-700/50 max-h-64 overflow-y-auto">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_32px] items-center px-3 py-1.5 gap-2">
              <div>
                <input
                  value={row.rsid}
                  onChange={e => updateRow(i, 'rsid', e.target.value)}
                  placeholder="rs1234567"
                  className={cn(
                    'w-full bg-transparent text-slate-200 text-sm placeholder-slate-600 outline-none border-b border-transparent',
                    inputFocus,
                    row.rsidError && 'border-red-500'
                  )}
                />
                {row.rsidError && <p className="text-red-400 text-[10px] mt-0.5">{row.rsidError}</p>}
              </div>
              <div>
                <input
                  value={row.genotype}
                  onChange={e => updateRow(i, 'genotype', e.target.value)}
                  placeholder="AA"
                  maxLength={2}
                  className={cn(
                    'w-full bg-transparent text-slate-200 text-sm placeholder-slate-600 outline-none border-b border-transparent',
                    inputFocus,
                    row.genotypeError && 'border-red-500'
                  )}
                />
                {row.genotypeError && <p className="text-red-400 text-[10px] mt-0.5">{row.genotypeError}</p>}
              </div>
              <button
                onClick={() => removeRow(i)}
                className="text-slate-600 hover:text-red-400 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-slate-600 text-xs">Tip: paste a tab-separated rsid/genotype table directly into the grid.</p>
    </div>
  )
}
