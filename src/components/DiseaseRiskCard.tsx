'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { DiseaseResult, ParentStatus, RiskLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

interface DiseaseRiskCardProps {
  result: DiseaseResult
}

const STATUS_CONFIG: Record<ParentStatus, { label: string; className: string }> = {
  normal:   { label: 'Normal',   className: 'bg-green-900/40 text-green-400 border border-green-700' },
  carrier:  { label: 'Carrier',  className: 'bg-amber-900/40 text-amber-400 border border-amber-700' },
  affected: { label: 'Affected', className: 'bg-red-900/40 text-red-400 border border-red-700' },
  unknown:  { label: 'Unknown',  className: 'bg-slate-700/40 text-slate-400 border border-slate-600' },
}

const RISK_CONFIG: Record<RiskLevel, { label: string; className: string }> = {
  none:     { label: 'No Risk',     className: 'bg-green-900/30 text-green-400 border border-green-800' },
  low:      { label: 'Low Risk',    className: 'bg-lime-900/30 text-lime-400 border border-lime-800' },
  moderate: { label: 'Moderate',    className: 'bg-amber-900/30 text-amber-400 border border-amber-800' },
  high:     { label: 'High Risk',   className: 'bg-red-900/30 text-red-400 border border-red-800' },
  very_high:{ label: 'Very High',   className: 'bg-red-950/60 text-red-300 border border-red-700' },
}

const INHERITANCE_LABELS: Record<string, string> = {
  autosomal_recessive: 'Autosomal Recessive',
  autosomal_dominant:  'Autosomal Dominant',
  x_linked_recessive:  'X-Linked Recessive',
  x_linked_dominant:   'X-Linked Dominant',
  complex:             'Complex / Polygenic',
}

const PIE_COLORS = ['#ef4444', '#f59e0b', '#22c55e']

function pct(n: number) {
  return `${Math.round(n * 100)}%`
}

export default function DiseaseRiskCard({ result }: DiseaseRiskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { disease, maleStatus, femaleStatus, offspringRisk, riskLevel } = result

  const pieData = [
    { name: 'Affected', value: Math.round(offspringRisk.affected * 100) },
    { name: 'Carrier',  value: Math.round(offspringRisk.carrier * 100) },
    { name: 'Normal',   value: Math.round(offspringRisk.normal * 100) },
  ].filter(d => d.value > 0)

  const hasRisk = riskLevel !== 'none'
  const riskConf = RISK_CONFIG[riskLevel]

  return (
    <div
      id={disease.id}
      className={cn(
        'bg-slate-900 border rounded-xl overflow-hidden transition-colors',
        hasRisk ? 'border-slate-600' : 'border-slate-700/50',
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm">{disease.name}</h3>
            <span className="text-slate-500 text-xs font-mono">{disease.gene}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className={cn('text-[11px] px-2 py-0.5 rounded-full', riskConf.className)}>
              {riskConf.label}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {INHERITANCE_LABELS[disease.inheritance]}
            </span>
            {disease.limitedSnpCoverage && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-900/20 text-amber-500 border border-amber-800">
                Limited SNP coverage
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="shrink-0 text-right">
          <p className="text-white font-bold text-lg">{pct(offspringRisk.affected)}</p>
          <p className="text-slate-500 text-[11px]">offspring risk</p>
        </div>

        <span className="text-slate-500 text-sm mt-1">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-700/50 p-4 space-y-4">
          {/* Parent status badges */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '👨 Father', status: maleStatus.status, found: maleStatus.variantFound },
              { label: '👩 Mother', status: femaleStatus.status, found: femaleStatus.variantFound },
            ].map(({ label, status, found }) => {
              const conf = STATUS_CONFIG[status]
              return (
                <div key={label} className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1.5">{label}</p>
                  <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', conf.className)}>
                    {conf.label}
                  </span>
                  {!found && (
                    <p className="text-slate-600 text-[11px] mt-1.5">Variant not in file</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Offspring risk chart + stats */}
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8' }}
                    itemStyle={{ color: '#f1f5f9' }}
                    formatter={(value: number) => [`${value}%`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-sm min-w-[120px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                <div>
                  <p className="text-white font-semibold">{pct(offspringRisk.affected)}</p>
                  <p className="text-slate-500 text-xs">Affected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <p className="text-white font-semibold">{pct(offspringRisk.carrier)}</p>
                  <p className="text-slate-500 text-xs">Carrier</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                <div>
                  <p className="text-white font-semibold">{pct(offspringRisk.normal)}</p>
                  <p className="text-slate-500 text-xs">Unaffected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plain language explanation */}
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-300 text-sm">{disease.plainLanguageSummary}</p>
          </div>

          {/* Limitation note */}
          {disease.limitationNote && (
            <div className="bg-amber-900/10 border border-amber-800/50 rounded-lg p-3">
              <p className="text-amber-400 text-xs"><strong>Testing limitation:</strong> {disease.limitationNote}</p>
            </div>
          )}

          {/* Variants checked */}
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer hover:text-slate-400">
              Variants checked ({disease.variants.length})
            </summary>
            <div className="mt-2 space-y-1 font-mono">
              {disease.variants.map(v => {
                const mGt = maleStatus.genotypes[v.rsid]
                const fGt = femaleStatus.genotypes[v.rsid]
                return (
                  <div key={v.rsid} className="flex gap-4">
                    <span className="text-slate-400">{v.rsid}</span>
                    <span>♂ {mGt ?? '—'}</span>
                    <span>♀ {fGt ?? '—'}</span>
                  </div>
                )
              })}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
