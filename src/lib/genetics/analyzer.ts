import type {
  AnalysisResult,
  Disease,
  DiseaseResult,
  DiseaseVariant,
  Genotype,
  InheritancePattern,
  ParentAnalysis,
  ParentStatus,
  RiskLevel,
  SNPMap,
  Sex,
} from '@/lib/types'
import { DISEASES } from '@/data/diseaseDatabase'
import {
  arOffspringRisk,
  adOffspringRisk,
  xlrOffspringRisk,
  xldOffspringRisk,
  complexMthfrRisk,
  splitGenotype,
} from './mendelian'
import { computeScore } from './scoring'

export function filterToRelevantSNPs(snpMap: SNPMap): SNPMap {
  const relevantRsids = new Set(
    DISEASES.flatMap(d => d.variants.map(v => v.rsid))
  )
  const filtered: SNPMap = new Map()
  for (const [rsid, gt] of snpMap) {
    if (relevantRsids.has(rsid)) filtered.set(rsid, gt)
  }
  return filtered
}

function buildParentAnalysis(
  snpMap: SNPMap,
  disease: Disease,
  sex: Sex
): ParentAnalysis {
  const genotypes: Record<string, Genotype | null> = {}
  let variantFound = false

  for (const variant of disease.variants) {
    const gt = snpMap.get(variant.rsid) ?? null
    genotypes[variant.rsid] = gt
    if (gt !== null) variantFound = true
  }

  const status = deriveParentStatus(genotypes, disease.variants, disease.inheritance, sex)
  return { status, genotypes, variantFound }
}

function countPathogenicAlleles(
  genotypes: Record<string, Genotype | null>,
  variants: DiseaseVariant[]
): { count: number; dataPresent: boolean } {
  let count = 0
  let dataPresent = false

  for (const variant of variants) {
    const gt = genotypes[variant.rsid]
    if (gt === null || gt === undefined) continue
    dataPresent = true
    const alleles = splitGenotype(gt)
    for (const allele of alleles) {
      if (allele.toUpperCase() === variant.riskAllele.toUpperCase()) count++
    }
  }

  return { count, dataPresent }
}

function deriveParentStatus(
  genotypes: Record<string, Genotype | null>,
  variants: DiseaseVariant[],
  inheritance: InheritancePattern,
  sex: Sex
): ParentStatus {
  const { count, dataPresent } = countPathogenicAlleles(genotypes, variants)

  if (!dataPresent) return 'unknown'

  if (inheritance === 'autosomal_recessive') {
    if (count === 0) return 'normal'
    if (count === 1) return 'carrier'
    return 'affected'
  }

  if (inheritance === 'autosomal_dominant') {
    if (count === 0) return 'normal'
    return 'affected' // any pathogenic allele = affected for dominant
  }

  if (inheritance === 'x_linked_recessive') {
    if (sex === 'male') {
      // Males are hemizygous; one pathogenic allele = affected
      return count > 0 ? 'affected' : 'normal'
    } else {
      // Females: 1 = carrier, 2 = affected
      if (count === 0) return 'normal'
      if (count === 1) return 'carrier'
      return 'affected'
    }
  }

  if (inheritance === 'x_linked_dominant') {
    return count > 0 ? 'affected' : 'normal'
  }

  // complex (MTHFR): treat same as AR per-locus; handled separately in calculateOffspringRisk
  if (count === 0) return 'normal'
  if (count === 1) return 'carrier'
  return 'affected'
}

function calculateOffspringRisk(
  maleAnalysis: ParentAnalysis,
  femaleAnalysis: ParentAnalysis,
  disease: Disease
) {
  const { inheritance } = disease

  if (inheritance === 'complex') {
    return complexMthfrRisk(maleAnalysis.genotypes, femaleAnalysis.genotypes)
  }

  if (inheritance === 'autosomal_recessive') {
    return arOffspringRisk(maleAnalysis.status, femaleAnalysis.status)
  }

  if (inheritance === 'autosomal_dominant') {
    return adOffspringRisk(maleAnalysis.status, femaleAnalysis.status)
  }

  if (inheritance === 'x_linked_recessive') {
    return xlrOffspringRisk(maleAnalysis.status, femaleAnalysis.status)
  }

  if (inheritance === 'x_linked_dominant') {
    return xldOffspringRisk(maleAnalysis.status, femaleAnalysis.status)
  }

  return { affected: 0, carrier: 0, normal: 1 }
}

function deriveRiskLevel(affectedProbability: number): RiskLevel {
  if (affectedProbability === 0) return 'none'
  if (affectedProbability <= 0.05) return 'low'
  if (affectedProbability <= 0.25) return 'moderate'
  if (affectedProbability <= 0.5) return 'high'
  return 'very_high'
}

function detectSameFile(
  maleSNPs: SNPMap,
  femaleSNPs: SNPMap
): boolean {
  if (maleSNPs.size === 0 || femaleSNPs.size === 0) return false
  const relevant = DISEASES.flatMap(d => d.variants.map(v => v.rsid))
  let matches = 0
  let checks = 0
  for (const rsid of relevant) {
    const m = maleSNPs.get(rsid)
    const f = femaleSNPs.get(rsid)
    if (m && f) {
      checks++
      if (m === f) matches++
    }
  }
  return checks >= 5 && matches / checks > 0.95
}

export function analyzeCompatibility(
  maleSNPs: SNPMap,
  femaleSNPs: SNPMap
): AnalysisResult {
  const diseases: DiseaseResult[] = []
  let totalVariantsAnalyzed = 0
  let variantsFound = 0

  for (const disease of DISEASES) {
    totalVariantsAnalyzed += disease.variants.length

    const maleAnalysis = buildParentAnalysis(maleSNPs, disease, 'male')
    const femaleAnalysis = buildParentAnalysis(femaleSNPs, disease, 'female')

    if (maleAnalysis.variantFound) variantsFound++
    if (femaleAnalysis.variantFound) variantsFound++

    const offspringRisk = calculateOffspringRisk(maleAnalysis, femaleAnalysis, disease)
    const riskLevel = deriveRiskLevel(offspringRisk.affected)

    diseases.push({ disease, maleStatus: maleAnalysis, femaleStatus: femaleAnalysis, offspringRisk, riskLevel })
  }

  const { score, category } = computeScore(diseases)
  const sameFileSuspect = detectSameFile(maleSNPs, femaleSNPs)

  return {
    diseases,
    compatibilityScore: score,
    scoreCategory: category,
    totalVariantsAnalyzed,
    variantsFound,
    sameFileSuspect,
  }
}
