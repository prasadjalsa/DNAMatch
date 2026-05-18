'use client'

import { useState, useEffect } from 'react'

interface MedicalDisclaimerProps {
  variant: 'banner' | 'footer'
}

export default function MedicalDisclaimer({ variant }: MedicalDisclaimerProps) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (variant === 'banner') {
      const val = sessionStorage.getItem('disclaimer_dismissed')
      if (val === 'true') setDismissed(true)
    }
  }, [variant])

  const dismiss = () => {
    sessionStorage.setItem('disclaimer_dismissed', 'true')
    setDismissed(true)
  }

  if (variant === 'banner' && dismissed) return null

  if (variant === 'banner') {
    return (
      <div className="bg-amber-900/80 border-b border-amber-600 px-4 py-2.5 flex items-start gap-3">
        <span className="text-amber-400 text-lg shrink-0 mt-0.5">⚠</span>
        <p className="text-amber-100 text-sm flex-1">
          <strong>Educational use only.</strong> This tool is not a substitute for professional genetic counseling or clinical testing. Results are based on a limited set of known SNPs and may miss variants. Always consult a certified genetic counselor before making health decisions.
        </p>
        <button
          onClick={dismiss}
          className="text-amber-400 hover:text-amber-200 text-lg shrink-0 leading-none"
          aria-label="Dismiss disclaimer"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div className="mt-16 border-t border-slate-700 pt-8 pb-12 px-6">
      <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
        <span>⚠</span> Important Limitations & Disclaimer
      </h3>
      <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
        <li>This tool is for <strong className="text-slate-300">educational and informational purposes only</strong>. It is not a medical device, clinical diagnostic test, or substitute for professional advice.</li>
        <li>Only a small subset of known pathogenic variants are checked. A &quot;normal&quot; result does <strong className="text-slate-300">not</strong> rule out disease.</li>
        <li>Huntington&apos;s Disease and Fragile X syndrome require specialized repeat-expansion testing — SNP proxy markers are used here.</li>
        <li>SMA, Hemophilia A, Duchenne MD, and Color Blindness are primarily caused by large deletions/inversions not detectable by standard SNP arrays.</li>
        <li>Cancer risk genes (BRCA1/2) show carrier status, not lifetime cancer probability. Penetrance varies by individual and family history.</li>
        <li>Consult a <strong className="text-slate-300">certified genetic counselor</strong> (NSGC.org) for reproductive planning decisions.</li>
      </ul>
    </div>
  )
}
