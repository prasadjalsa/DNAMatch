import type { ParseResult, SNPMap } from '@/lib/types'

// Coordinate → rsid fallback map for known disease variants
// Used when VCF files have ID = "." (no rsid)
const COORD_TO_RSID: Record<string, string> = {
  '7:117548628': 'rs113993960', // CFTR ΔF508
  '7:117534438': 'rs75961395',  // CFTR W1282X
  '11:5246696': 'rs334',        // HBB sickle cell
  '11:5246956': 'rs63751763',   // HBB beta-thal
  '15:72638618': 'rs80338748',  // HEXA Tay-Sachs
  '12:103241118': 'rs5030858',  // PAH PKU
  '1:155205634': 'rs76763715',  // GBA Gaucher N370S
  '5:74641667': 'rs9916',       // SMN1 proxy
  '13:51937791': 'rs76151636',  // ATP7B Wilson's
  '6:26091179': 'rs1800562',    // HFE C282Y
  '6:26090951': 'rs1799945',    // HFE H63D
  '4:3076604': 'rs363050',      // HTT Huntington proxy
  '19:11216171': 'rs28942078',  // LDLR FH
  '17:41256099': 'rs80357906',  // BRCA1 185delAG
  '17:41226488': 'rs80357914',  // BRCA1 5382insC
  '13:32914782': 'rs80358981',  // BRCA2 6174delT
  '1:169519049': 'rs6025',      // F5 Leiden
  '15:48762884': 'rs121913502', // FBN1 Marfan
  'X:154064063': 'rs137852580', // F8 Hemophilia A
  'X:138624835': 'rs137852559', // F9 Hemophilia B
  'X:32867861': 'rs137852337',  // DMD
  'X:154158511': 'rs104894722', // OPN1LW color blindness
  'X:147912051': 'rs29232',     // FMR1 Fragile X proxy
  '1:11856378': 'rs1801133',    // MTHFR C677T
  '1:11854476': 'rs1801131',    // MTHFR A1298C
  '11:46761055': 'rs1799963',   // F2 prothrombin
}

export function parseVCF(fileText: string): ParseResult {
  const warnings: string[] = []
  const snpMap: SNPMap = new Map()
  let totalLines = 0
  let parsedCount = 0

  const lines = fileText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')

  // Find the #CHROM header to determine column layout
  const headerLine = lines.find(l => l.startsWith('#CHROM'))
  if (!headerLine) {
    warnings.push('VCF header (#CHROM) not found. This may not be a valid VCF file.')
    return { snpMap, warnings, format: 'vcf', totalLines: 0, parsedCount: 0 }
  }

  const headerCols = headerLine.replace(/^#/, '').split('\t')
  const sampleIndex = 9 // standard VCF sample column
  const formatIndex = 8

  let malformedCount = 0
  let missingRsidCount = 0

  for (const rawLine of lines) {
    totalLines++

    // Skip header lines
    if (rawLine.startsWith('#') || rawLine.trim() === '') continue

    const cols = rawLine.split('\t')
    if (cols.length < 10) {
      malformedCount++
      continue
    }

    const chrom = cols[0].replace(/^chr/, '') // normalize "chr1" → "1"
    const pos = cols[1]
    let rsid = cols[2]
    const ref = cols[3]
    const alt = cols[4]
    const format = cols[formatIndex] || ''
    const sample = cols[sampleIndex] || ''

    // Try coordinate fallback if rsid is missing
    if (!rsid || rsid === '.') {
      const coordKey = `${chrom}:${pos}`
      rsid = COORD_TO_RSID[coordKey] || ''
      if (!rsid) {
        missingRsidCount++
        continue
      }
    }

    if (!/^rs\d+$/.test(rsid)) continue

    // Find GT field index in FORMAT
    const formatFields = format.split(':')
    const gtIndex = formatFields.indexOf('GT')
    if (gtIndex === -1) {
      malformedCount++
      continue
    }

    const sampleFields = sample.split(':')
    const gtRaw = sampleFields[gtIndex]
    if (!gtRaw || gtRaw === './.' || gtRaw === '.|.') continue

    // Parse allele indices: 0/1, 1/1, 0|1, etc.
    const separator = gtRaw.includes('|') ? '|' : '/'
    const alleleParts = gtRaw.split(separator)

    if (alleleParts.length < 2) continue

    const altAlleles = alt.split(',')
    const alleleMap: Record<string, string> = { '0': ref }
    altAlleles.forEach((a, i) => { alleleMap[String(i + 1)] = a })

    const a1 = alleleMap[alleleParts[0]]
    const a2 = alleleMap[alleleParts[1]]

    if (!a1 || !a2) continue

    // Build a 2-char genotype string (single nucleotide SNPs only)
    // Skip multi-nucleotide variants beyond simple indels
    const g1 = a1.length === 1 ? a1.toUpperCase() : (a1.length > ref.length ? 'I' : 'D')
    const g2 = a2.length === 1 ? a2.toUpperCase() : (a2.length > ref.length ? 'I' : 'D')

    const genotype = g1 + g2

    snpMap.set(rsid, genotype)
    parsedCount++
  }

  if (malformedCount > 0) warnings.push(`Skipped ${malformedCount} malformed records.`)
  if (missingRsidCount > 0) warnings.push(`${missingRsidCount} records had no rsID and no matching genomic coordinate.`)
  if (parsedCount === 0) warnings.push('No valid SNP entries found. Ensure this is a standard VCF with a sample column.')

  return { snpMap, warnings, format: 'vcf', totalLines, parsedCount }
}
