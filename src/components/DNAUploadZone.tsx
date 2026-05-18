'use client'

import { useCallback, useRef, useState } from 'react'
import type { ParseResult } from '@/lib/types'
import { parse23andMe } from '@/lib/parsers/parse23andMe'
import { parseVCF } from '@/lib/parsers/parseVCF'
import { cn } from '@/lib/utils'

interface DNAUploadZoneProps {
  label: string
  color: 'blue' | 'pink'
  onParsed: (result: ParseResult) => void
  onError: (message: string) => void
}

const MAX_FILE_BYTES = 100 * 1024 * 1024 // 100 MB hard limit

export default function DNAUploadZone({ label, color, onParsed, onError }: DNAUploadZoneProps) {
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle')
  const [fileName, setFileName] = useState('')
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const accent = color === 'blue'
    ? 'border-blue-500 bg-blue-900/20 text-blue-400'
    : 'border-pink-500 bg-pink-900/20 text-pink-400'

  const processFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      onError(`File "${file.name}" exceeds the 100 MB limit.`)
      setStatus('error')
      return
    }

    setFileName(file.name)
    setStatus('parsing')

    try {
      const text = await file.text()
      const isVCF = file.name.toLowerCase().endsWith('.vcf') || text.startsWith('##fileformat=VCF')
      const result = isVCF ? parseVCF(text) : parse23andMe(text)

      if (result.parsedCount === 0) {
        onError(`Could not parse "${file.name}". ${result.warnings[0] ?? 'Ensure it is a 23andMe, AncestryDNA, or VCF file.'}`)
        setStatus('error')
        return
      }

      setParseResult(result)
      setStatus('success')
      onParsed(result)
    } catch (err) {
      onError(`Failed to read "${file.name}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      setStatus('error')
    }
  }, [onParsed, onError])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className={cn('text-sm font-semibold uppercase tracking-wider', color === 'blue' ? 'text-blue-400' : 'text-pink-400')}>
        {label}
      </h3>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center',
          isDragOver ? accent : 'border-slate-600 hover:border-slate-500 bg-slate-800/50',
          status === 'success' && 'border-green-600 bg-green-900/20',
          status === 'error' && 'border-red-600 bg-red-900/20',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.tsv,.vcf,.csv"
          onChange={handleChange}
          className="hidden"
        />

        {status === 'idle' && (
          <>
            <div className="text-4xl mb-3">🧬</div>
            <p className="text-slate-300 text-sm font-medium">Drop file here or click to browse</p>
            <p className="text-slate-500 text-xs mt-1">Supports 23andMe, AncestryDNA raw data (.txt), or VCF files</p>
          </>
        )}

        {status === 'parsing' && (
          <>
            <div className="text-4xl mb-3 animate-spin">⚙</div>
            <p className="text-slate-300 text-sm">Parsing {fileName}…</p>
          </>
        )}

        {status === 'success' && parseResult && (
          <>
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-400 font-medium text-sm">{fileName}</p>
            <p className="text-slate-400 text-xs mt-1">
              {parseResult.parsedCount.toLocaleString()} SNPs parsed
              {' · '}{parseResult.format === 'vcf' ? 'VCF' : '23andMe/AncestryDNA'} format
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-3xl mb-2">❌</div>
            <p className="text-red-400 text-sm">Parse failed — try a different file</p>
            <p className="text-slate-500 text-xs mt-1">Click to try again</p>
          </>
        )}
      </div>

      {status === 'success' && parseResult && parseResult.warnings.length > 0 && (
        <details className="text-xs text-amber-400 bg-amber-900/20 border border-amber-700 rounded-lg px-3 py-2">
          <summary className="cursor-pointer font-medium">
            {parseResult.warnings.length} warning{parseResult.warnings.length > 1 ? 's' : ''}
          </summary>
          <ul className="mt-2 space-y-1 text-amber-300">
            {parseResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </details>
      )}
    </div>
  )
}
