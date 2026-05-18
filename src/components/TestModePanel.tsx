'use client'

import { useState } from 'react'
import { TEST_PROFILES, PROFILE_GROUPS, profileToTSV } from '@/data/testProfiles'
import type { TestProfile } from '@/data/testProfiles'
import type { SNPMap } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TestModePanelProps {
  onLoadFather: (map: SNPMap, label: string) => void
  onLoadMother: (map: SNPMap, label: string) => void
}

function downloadProfile(profile: TestProfile) {
  const content = profileToTSV(profile)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dnamatch_test_${profile.id}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function recordToSNPMap(record: Record<string, string>): SNPMap {
  return new Map(Object.entries(record))
}

const CATEGORY_COLORS: Record<string, string> = {
  normal:     'text-green-400 border-green-800 bg-green-900/20',
  carrier:    'text-amber-400 border-amber-800 bg-amber-900/20',
  affected:   'text-red-400 border-red-800 bg-red-900/20',
  combined:   'text-indigo-400 border-indigo-800 bg-indigo-900/20',
  x_linked:   'text-purple-400 border-purple-800 bg-purple-900/20',
  edge_case:  'text-slate-400 border-slate-700 bg-slate-800/40',
}

export default function TestModePanel({ onLoadFather, onLoadMother }: TestModePanelProps) {
  const [fatherProfileId, setFatherProfileId] = useState('')
  const [motherProfileId, setMotherProfileId] = useState('')
  const [activeTab, setActiveTab] = useState<'select' | 'browse'>('select')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const fatherProfile = TEST_PROFILES.find(p => p.id === fatherProfileId)
  const motherProfile = TEST_PROFILES.find(p => p.id === motherProfileId)

  const handleLoadFather = () => {
    if (!fatherProfile) return
    onLoadFather(recordToSNPMap(fatherProfile.snpMap), fatherProfile.label)
  }

  const handleLoadMother = () => {
    if (!motherProfile) return
    onLoadMother(recordToSNPMap(motherProfile.snpMap), motherProfile.label)
  }

  const filteredProfiles = TEST_PROFILES.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchesSearch = searchQuery === '' ||
      p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-purple-900/20 border border-purple-700/50 rounded-2xl overflow-hidden mb-8">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3 bg-purple-900/30 border-b border-purple-700/50">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-lg">🧪</span>
          <span className="text-purple-300 font-semibold text-sm">Test Mode</span>
          <span className="text-xs bg-purple-800/60 text-purple-300 border border-purple-700 px-2 py-0.5 rounded-full">
            {TEST_PROFILES.length} profiles
          </span>
        </div>
        <div className="flex gap-1 text-xs">
          {(['select', 'browse'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1 rounded-lg capitalize transition-colors',
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-400 hover:text-purple-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Select tab */}
      {activeTab === 'select' && (
        <div className="p-5 space-y-4">
          <p className="text-slate-400 text-xs">
            Select a pre-built test profile for Father and Mother, then load them to run the analysis instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Father selector */}
            <div className="space-y-2">
              <label className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Father Profile</label>
              <select
                value={fatherProfileId}
                onChange={e => setFatherProfileId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">— Select a profile —</option>
                {PROFILE_GROUPS.map(group => (
                  <optgroup key={group.category} label={group.label}>
                    {group.profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {fatherProfile && (
                <div className="bg-slate-800 rounded-lg p-3 text-xs space-y-1">
                  <p className="text-slate-300">{fatherProfile.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fatherProfile.tags.map(t => (
                      <span key={t} className="bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleLoadFather}
                      className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-xs py-1.5 rounded-lg transition-colors"
                    >
                      ↑ Load as Father
                    </button>
                    <button
                      onClick={() => downloadProfile(fatherProfile)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      title="Download as .txt file"
                    >
                      ↓ .txt
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mother selector */}
            <div className="space-y-2">
              <label className="text-pink-400 text-xs font-semibold uppercase tracking-wider">Mother Profile</label>
              <select
                value={motherProfileId}
                onChange={e => setMotherProfileId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500"
              >
                <option value="">— Select a profile —</option>
                {PROFILE_GROUPS.map(group => (
                  <optgroup key={group.category} label={group.label}>
                    {group.profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {motherProfile && (
                <div className="bg-slate-800 rounded-lg p-3 text-xs space-y-1">
                  <p className="text-slate-300">{motherProfile.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {motherProfile.tags.map(t => (
                      <span key={t} className="bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleLoadMother}
                      className="flex-1 bg-pink-700 hover:bg-pink-600 text-white text-xs py-1.5 rounded-lg transition-colors"
                    >
                      ↑ Load as Mother
                    </button>
                    <button
                      onClick={() => downloadProfile(motherProfile)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      title="Download as .txt file"
                    >
                      ↓ .txt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick-load presets */}
          <div>
            <p className="text-slate-500 text-xs mb-2 font-medium">Quick scenarios:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Score 100 (all normal)', f: 'special_all_normal', m: 'special_all_normal' },
                { label: 'CF risk (matched carriers)', f: 'cystic-fibrosis_carrier', m: 'cystic-fibrosis_carrier' },
                { label: 'Ashkenazi panel', f: 'combo_ashkenazi_panel', m: 'combo_ashkenazi_panel' },
                { label: 'X-linked Hemophilia A', f: 'hemophilia-a_male_normal', m: 'hemophilia-a_female_carrier' },
                { label: 'Low compatibility', f: 'special_low_compatibility', m: 'special_low_compatibility' },
              ].map(({ label, f, m }) => (
                <button
                  key={label}
                  onClick={() => {
                    setFatherProfileId(f)
                    setMotherProfileId(m)
                    const fp = TEST_PROFILES.find(p => p.id === f)
                    const mp = TEST_PROFILES.find(p => p.id === m)
                    if (fp) onLoadFather(recordToSNPMap(fp.snpMap), fp.label)
                    if (mp) onLoadMother(recordToSNPMap(mp.snpMap), mp.label)
                  }}
                  className="text-xs bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Browse tab */}
      {activeTab === 'browse' && (
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search profiles…"
              className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="all">All categories</option>
              {PROFILE_GROUPS.map(g => (
                <option key={g.category} value={g.category}>{g.label}</option>
              ))}
            </select>
          </div>

          <p className="text-slate-500 text-xs">{filteredProfiles.length} profiles</p>

          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {filteredProfiles.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-slate-800 hover:bg-slate-750 rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[11px] px-1.5 py-0.5 rounded border', CATEGORY_COLORS[p.category])}>
                      {p.category.replace('_', ' ')}
                    </span>
                    <p className="text-white text-xs font-medium truncate">{p.label}</p>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 truncate">{p.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => { setFatherProfileId(p.id); onLoadFather(recordToSNPMap(p.snpMap), p.label) }}
                    className="text-[11px] bg-blue-900/40 text-blue-400 border border-blue-800 hover:bg-blue-800/50 px-2 py-1 rounded"
                  >
                    ♂
                  </button>
                  <button
                    onClick={() => { setMotherProfileId(p.id); onLoadMother(recordToSNPMap(p.snpMap), p.label) }}
                    className="text-[11px] bg-pink-900/40 text-pink-400 border border-pink-800 hover:bg-pink-800/50 px-2 py-1 rounded"
                  >
                    ♀
                  </button>
                  <button
                    onClick={() => downloadProfile(p)}
                    className="text-[11px] bg-slate-700 text-slate-400 hover:bg-slate-600 px-2 py-1 rounded"
                    title="Download .txt"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
