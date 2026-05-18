import type { ParseResult, SNPMap } from '@/lib/types'

export function parse23andMe(fileText: string): ParseResult {
  const warnings: string[] = []
  const snpMap: SNPMap = new Map()
  let totalLines = 0
  let parsedCount = 0

  // Normalize Windows line endings
  const lines = fileText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')

  // Reject files that are clearly not 23andMe format
  const firstContentLine = lines.find(l => !l.startsWith('#') && l.trim() !== '')
  if (!firstContentLine) {
    warnings.push('File appears to be empty or contains only comments.')
    return { snpMap, warnings, format: '23andme', totalLines: 0, parsedCount: 0 }
  }

  let malformedCount = 0

  for (const rawLine of lines) {
    totalLines++

    // Skip comments and empty lines
    if (rawLine.startsWith('#') || rawLine.trim() === '') continue

    // Skip the header row
    if (rawLine.startsWith('rsid') || rawLine.startsWith('# rsid')) continue

    const parts = rawLine.split('\t')
    if (parts.length < 4) {
      malformedCount++
      continue
    }

    const [rsid, , , genotypeRaw] = parts
    if (!rsid || !/^rs\d+$/.test(rsid.trim())) {
      malformedCount++
      continue
    }

    const genotype = genotypeRaw.trim().toUpperCase()

    // Skip no-calls
    if (genotype === '--' || genotype === '' || genotype === '00') continue

    // Valid genotype: 1-2 chars of ACGT or I (insertion) or D (deletion)
    if (!/^[ACGTID]{1,2}$/.test(genotype)) {
      malformedCount++
      continue
    }

    snpMap.set(rsid.trim(), genotype)
    parsedCount++
  }

  if (malformedCount > 0) {
    warnings.push(`Skipped ${malformedCount} malformed lines.`)
  }

  if (parsedCount === 0) {
    warnings.push('No valid SNP entries found. This may not be a 23andMe or AncestryDNA raw data file.')
  }

  return { snpMap, warnings, format: '23andme', totalLines, parsedCount }
}
