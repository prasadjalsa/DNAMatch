'use client'

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import type { ScoreCategory } from '@/lib/types'

interface CompatibilityScoreProps {
  score: number
  category: ScoreCategory
}

const CATEGORY_CONFIG: Record<ScoreCategory, { label: string; color: string; desc: string }> = {
  excellent: { label: 'Excellent', color: '#22c55e', desc: 'Very low combined genetic risk identified.' },
  good:      { label: 'Good',      color: '#84cc16', desc: 'Low combined genetic risk across analyzed conditions.' },
  moderate:  { label: 'Moderate',  color: '#f59e0b', desc: 'Some elevated risks detected. Review individual conditions.' },
  elevated:  { label: 'Elevated',  color: '#ef4444', desc: 'Multiple elevated risks detected. Genetic counseling recommended.' },
}

export default function CompatibilityScore({ score, category }: CompatibilityScoreProps) {
  const config = CATEGORY_CONFIG[category]
  const data = [{ value: score, fill: config.color }]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={16}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              background={{ fill: '#1e293b' }}
              dataKey="value"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-3xl font-bold text-white leading-none">{score}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>

      <div className="text-center">
        <span
          className="inline-block px-3 py-0.5 rounded-full text-sm font-semibold"
          style={{ backgroundColor: config.color + '22', color: config.color, border: `1px solid ${config.color}66` }}
        >
          {config.label}
        </span>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">{config.desc}</p>
      </div>
    </div>
  )
}
