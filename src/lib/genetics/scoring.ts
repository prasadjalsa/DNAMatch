import type { DiseaseResult, ScoreCategory, Severity } from '@/lib/types'

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  lethal: 25,
  severe: 15,
  moderate: 8,
  mild: 3,
}

export function computeScore(results: DiseaseResult[]): {
  score: number
  category: ScoreCategory
} {
  let deduction = 0

  for (const result of results) {
    const weight = SEVERITY_WEIGHTS[result.disease.severity]
    deduction += weight * result.offspringRisk.affected
  }

  const score = Math.max(0, Math.min(100, Math.round(100 - deduction)))
  const category: ScoreCategory =
    score >= 85 ? 'excellent'
    : score >= 70 ? 'good'
    : score >= 50 ? 'moderate'
    : 'elevated'

  return { score, category }
}
