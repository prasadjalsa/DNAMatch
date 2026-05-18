export type Genotype = string
export type SNPMap = Map<string, Genotype>
export type Sex = 'male' | 'female'

export type InheritancePattern =
  | 'autosomal_recessive'
  | 'autosomal_dominant'
  | 'x_linked_recessive'
  | 'x_linked_dominant'
  | 'complex'

export type ParentStatus = 'normal' | 'carrier' | 'affected' | 'unknown'
export type RiskLevel = 'none' | 'low' | 'moderate' | 'high' | 'very_high'
export type ScoreCategory = 'excellent' | 'good' | 'moderate' | 'elevated'
export type Severity = 'mild' | 'moderate' | 'severe' | 'lethal'

export interface DiseaseVariant {
  rsid: string
  riskAllele: string
  normalAllele: string
}

export interface Disease {
  id: string
  name: string
  gene: string
  inheritance: InheritancePattern
  variants: DiseaseVariant[]
  severity: Severity
  description: string
  plainLanguageSummary: string
  prevalence: number
  limitedSnpCoverage?: boolean
  limitationNote?: string
}

export interface ParentAnalysis {
  status: ParentStatus
  genotypes: Record<string, Genotype | null>
  variantFound: boolean
}

export interface OffspringRisk {
  affected: number
  carrier: number
  normal: number
}

export interface DiseaseResult {
  disease: Disease
  maleStatus: ParentAnalysis
  femaleStatus: ParentAnalysis
  offspringRisk: OffspringRisk
  riskLevel: RiskLevel
}

export interface AnalysisResult {
  diseases: DiseaseResult[]
  compatibilityScore: number
  scoreCategory: ScoreCategory
  totalVariantsAnalyzed: number
  variantsFound: number
  sameFileSuspect?: boolean
}

export interface ParseResult {
  snpMap: SNPMap
  warnings: string[]
  format: '23andme' | 'vcf' | 'manual'
  totalLines: number
  parsedCount: number
}
