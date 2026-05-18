'use client'

import { useState } from 'react'
import type { DiseaseResult, RiskLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RiskSummaryTableProps {
  results: DiseaseResult[]
}

type SortKey = 'name' | 'riskLevel' | 'severity' | 'affected'
type SortDir = 'asc' | 'desc'

const RISK_ORDER: Record<RiskLevel, number> = {
  very_high: 5, high: 4, moderate: 3, low: 2, none: 1,
}
const RISK_COLORS: Record<RiskLevel, string> = {
  none:      'text-green-400',
  low:       'text-lime-400',
  moderate:  'text-amber-400',
  high:      'text-red-400',
  very_high: 'text-red-300',
}
const RISK_LABELS: Record<RiskLevel, string> = {
  none: 'None', low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High',
}
const SEVERITY_ORDER = { lethal: 4, severe: 3, moderate: 2, mild: 1 }

export default function RiskSummaryTable({ results }: RiskSummaryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('riskLevel')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...results].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'name') cmp = a.disease.name.localeCompare(b.disease.name)
    else if (sortKey === 'riskLevel') cmp = RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
    else if (sortKey === 'severity') cmp = SEVERITY_ORDER[a.disease.severity] - SEVERITY_ORDER[b.disease.severity]
    else if (sortKey === 'affected') cmp = a.offspringRisk.affected - b.offspringRisk.affected
    return sortDir === 'asc' ? cmp : -cmp
  })

  const arrow = (key: SortKey) =>
    sortKey !== key ? '' : sortDir === 'desc' ? ' ↓' : ' ↑'

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      normal: 'text-green-400', carrier: 'text-amber-400',
      affected: 'text-red-400', unknown: 'text-slate-500',
    }
    return <span className={cn('text-xs capitalize', map[status] ?? 'text-slate-400')}>{status}</span>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
            {([
              ['name', 'Disease'],
              ['severity', 'Severity'],
              ['riskLevel', 'Risk Level'],
              [null, 'Father'],
              [null, 'Mother'],
              ['affected', 'Offspring Risk'],
            ] as [SortKey | null, string][]).map(([key, label]) => (
              <th
                key={label}
                className={cn(
                  'px-4 py-3 text-left whitespace-nowrap',
                  key && 'cursor-pointer hover:text-slate-200 select-none'
                )}
                onClick={() => key && handleSort(key)}
              >
                {label}{key ? arrow(key) : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {sorted.map(result => (
            <tr
              key={result.disease.id}
              className="hover:bg-slate-800/50 transition-colors cursor-pointer"
              onClick={() => {
                document.getElementById(result.disease.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
            >
              <td className="px-4 py-3">
                <p className="text-white font-medium">{result.disease.name}</p>
                <p className="text-slate-500 text-xs font-mono">{result.disease.gene}</p>
              </td>
              <td className="px-4 py-3 capitalize text-slate-300">{result.disease.severity}</td>
              <td className="px-4 py-3">
                <span className={cn('font-medium', RISK_COLORS[result.riskLevel])}>
                  {RISK_LABELS[result.riskLevel]}
                </span>
              </td>
              <td className="px-4 py-3">{statusBadge(result.maleStatus.status)}</td>
              <td className="px-4 py-3">{statusBadge(result.femaleStatus.status)}</td>
              <td className="px-4 py-3 font-mono">
                <span className={RISK_COLORS[result.riskLevel]}>
                  {Math.round(result.offspringRisk.affected * 100)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
