import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { AnalysisResult, SNPMap } from './types'

export interface DNASubmission {
  timestamp: ReturnType<typeof serverTimestamp>
  consentedAt: ReturnType<typeof serverTimestamp>
  maleSnps: Record<string, string>
  femaleSnps: Record<string, string>
  analysis: {
    compatibilityScore: number
    scoreCategory: string
    diseases: Array<{
      diseaseId: string
      maleStatus: string
      femaleStatus: string
      offspringRisk: { affected: number; carrier: number; normal: number }
      riskLevel: string
    }>
  }
}

export async function submitDNAData(
  maleSnps: SNPMap,
  femaleSnps: SNPMap,
  result: AnalysisResult
): Promise<void> {
  const submission: DNASubmission = {
    timestamp: serverTimestamp(),
    consentedAt: serverTimestamp(),
    maleSnps: Object.fromEntries(maleSnps),
    femaleSnps: Object.fromEntries(femaleSnps),
    analysis: {
      compatibilityScore: result.compatibilityScore,
      scoreCategory: result.scoreCategory,
      diseases: result.diseases.map(d => ({
        diseaseId: d.disease.id,
        maleStatus: d.maleStatus.status,
        femaleStatus: d.femaleStatus.status,
        offspringRisk: d.offspringRisk,
        riskLevel: d.riskLevel,
      })),
    },
  }

  await addDoc(collection(db, 'submissions'), submission)
}
