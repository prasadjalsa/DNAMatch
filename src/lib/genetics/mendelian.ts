import type { OffspringRisk, ParentStatus } from '@/lib/types'

function clamp(n: number): number {
  return Math.max(0, Math.min(1, n))
}

export function arOffspringRisk(a: ParentStatus, b: ParentStatus): OffspringRisk {
  // When a parent is unknown, apply conservative population-prior estimates
  if (a === 'unknown' || b === 'unknown') {
    const known = a === 'unknown' ? b : a
    if (known === 'affected') return { affected: 0.5, carrier: 0.5, normal: 0 }
    if (known === 'carrier') return { affected: 0.125, carrier: 0.375, normal: 0.5 }
    // Both unknown — roughly carrier freq ~1/50 for many AR diseases
    return { affected: 0.005, carrier: 0.1, normal: 0.895 }
  }

  const table: Record<ParentStatus, Record<ParentStatus, OffspringRisk>> = {
    normal: {
      normal:   { affected: 0,    carrier: 0,   normal: 1 },
      carrier:  { affected: 0,    carrier: 0.5, normal: 0.5 },
      affected: { affected: 0,    carrier: 1,   normal: 0 },
      unknown:  { affected: 0,    carrier: 0,   normal: 1 }, // fallback (shouldn't reach)
    },
    carrier: {
      normal:   { affected: 0,    carrier: 0.5, normal: 0.5 },
      carrier:  { affected: 0.25, carrier: 0.5, normal: 0.25 },
      affected: { affected: 0.5,  carrier: 0.5, normal: 0 },
      unknown:  { affected: 0.125, carrier: 0.375, normal: 0.5 },
    },
    affected: {
      normal:   { affected: 0,   carrier: 1,   normal: 0 },
      carrier:  { affected: 0.5, carrier: 0.5, normal: 0 },
      affected: { affected: 1,   carrier: 0,   normal: 0 },
      unknown:  { affected: 0.5, carrier: 0.5, normal: 0 },
    },
    unknown: {
      normal:   { affected: 0,    carrier: 0,    normal: 1 },
      carrier:  { affected: 0.125, carrier: 0.375, normal: 0.5 },
      affected: { affected: 0.5,  carrier: 0.5,  normal: 0 },
      unknown:  { affected: 0.005, carrier: 0.1,  normal: 0.895 },
    },
  }

  return table[a][b]
}

export function adOffspringRisk(a: ParentStatus, b: ParentStatus): OffspringRisk {
  // For autosomal dominant, carrier = affected (one copy causes disease)
  const normalize = (s: ParentStatus): ParentStatus =>
    s === 'carrier' ? 'affected' : s

  const na = normalize(a)
  const nb = normalize(b)

  if (na === 'unknown' || nb === 'unknown') {
    const known = na === 'unknown' ? nb : na
    if (known === 'affected') return { affected: 0.5, carrier: 0, normal: 0.5 }
    return { affected: 0.02, carrier: 0, normal: 0.98 } // low prior for unknown
  }

  if (na === 'affected' && nb === 'affected') return { affected: 0.75, carrier: 0, normal: 0.25 }
  if (na === 'affected' || nb === 'affected') return { affected: 0.5, carrier: 0, normal: 0.5 }
  return { affected: 0, carrier: 0, normal: 1 }
}

export function xlrOffspringRisk(maleStatus: ParentStatus, femaleStatus: ParentStatus): OffspringRisk {
  // Males are hemizygous X. Sons get Y from father + one X from mother.
  // Daughters get father's X + one X from mother.

  let sonAffected = 0
  let daughterAffected = 0
  let daughterCarrier = 0

  // Sons: affected if they inherit pathogenic X from mother
  if (femaleStatus === 'carrier') {
    sonAffected = 0.5
  } else if (femaleStatus === 'affected') {
    sonAffected = 1.0
  } else if (femaleStatus === 'unknown') {
    sonAffected = 0.1 // conservative prior
  }

  // Daughters: all get father's X; additionally one X from mother
  if (maleStatus === 'affected') {
    // Father passes pathogenic X to all daughters
    if (femaleStatus === 'normal') {
      daughterCarrier = 1.0
    } else if (femaleStatus === 'carrier') {
      daughterAffected = 0.5
      daughterCarrier = 0.5
    } else if (femaleStatus === 'affected') {
      daughterAffected = 1.0
    } else if (femaleStatus === 'unknown') {
      daughterCarrier = 0.8
      daughterAffected = 0.1
    }
  } else if (maleStatus === 'normal' || maleStatus === 'unknown') {
    // Father has normal X (or unknown)
    if (femaleStatus === 'carrier') {
      daughterCarrier = 0.5
    } else if (femaleStatus === 'affected') {
      daughterAffected = 0.5
      daughterCarrier = 0.5
    } else if (femaleStatus === 'unknown') {
      daughterCarrier = 0.05
    }
  }

  // Combine assuming 50% sons, 50% daughters
  const affected = clamp((sonAffected * 0.5) + (daughterAffected * 0.5))
  const carrier = clamp(daughterCarrier * 0.5)
  const normal = clamp(1 - affected - carrier)

  return { affected, carrier, normal }
}

export function xldOffspringRisk(maleStatus: ParentStatus, femaleStatus: ParentStatus): OffspringRisk {
  // X-linked dominant: one copy sufficient for disease in both sexes
  // Affected father → all daughters affected, sons unaffected from father's X
  // Affected mother → 50% of all children affected

  let sonAffected = 0
  let daughterAffected = 0

  // Sons from affected mother: 50% chance
  if (femaleStatus === 'affected' || femaleStatus === 'carrier') {
    sonAffected = 0.5
  } else if (femaleStatus === 'unknown') {
    sonAffected = 0.05
  }

  // Daughters from affected father: 100% (he passes pathogenic X to all daughters)
  if (maleStatus === 'affected') {
    daughterAffected = Math.max(0.5, sonAffected) // at least 50% from mother's contribution
    // Actually: daughter gets father's X (always pathogenic if dad affected) → all daughters affected
    daughterAffected = 1.0
    if (femaleStatus === 'normal' || femaleStatus === 'unknown') {
      daughterAffected = 1.0 // from father alone
    }
  } else {
    // Normal father: daughters affected only from mother
    if (femaleStatus === 'affected' || femaleStatus === 'carrier') {
      daughterAffected = 0.5
    } else if (femaleStatus === 'unknown') {
      daughterAffected = 0.05
    }
  }

  const affected = clamp((sonAffected * 0.5) + (daughterAffected * 0.5))
  return { affected, carrier: 0, normal: clamp(1 - affected) }
}

export function complexMthfrRisk(
  maleGenotypes: Record<string, string | null>,
  femaleGenotypes: Record<string, string | null>
): OffspringRisk {
  // Treat each MTHFR locus independently as AR, then combine
  const c677tMale = classifyMthfrAllele(maleGenotypes['rs1801133'], 'T')
  const c677tFemale = classifyMthfrAllele(femaleGenotypes['rs1801133'], 'T')
  const a1298cMale = classifyMthfrAllele(maleGenotypes['rs1801131'], 'C')
  const a1298cFemale = classifyMthfrAllele(femaleGenotypes['rs1801131'], 'C')

  const c677tRisk = arOffspringRisk(c677tMale, c677tFemale)
  const a1298cRisk = arOffspringRisk(a1298cMale, a1298cFemale)

  // Clinically significant: homozygous C677T TT or compound het (one 677T + one 1298C)
  // Approximate: probability offspring has at least one combination of concern
  const homoC677t = c677tRisk.affected
  // Compound het probability = P(het C677T) × P(het A1298C)
  const compoundHet = c677tRisk.carrier * a1298cRisk.carrier * 0.5

  const affected = clamp(homoC677t + compoundHet)
  const carrier = clamp(c677tRisk.carrier * 0.5 + a1298cRisk.carrier * 0.5)
  return { affected, carrier, normal: clamp(1 - affected - carrier) }
}

function classifyMthfrAllele(genotype: string | null | undefined, riskAllele: string): ParentStatus {
  if (!genotype) return 'unknown'
  const alleles = splitGenotype(genotype)
  const riskCount = alleles.filter(a => a === riskAllele).length
  if (riskCount === 0) return 'normal'
  if (riskCount === 1) return 'carrier'
  return 'affected'
}

export function splitGenotype(genotype: string): string[] {
  if (genotype.length === 1) return [genotype, genotype] // hemizygous
  return [genotype[0], genotype[1]]
}
