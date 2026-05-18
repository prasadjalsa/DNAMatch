'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export const TEST_MODE_KEY = 'dnamatch_test_mode'

export default function NavTestToggle() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(sessionStorage.getItem(TEST_MODE_KEY) === 'true')
  }, [])

  const toggle = () => {
    const next = !active
    setActive(next)
    sessionStorage.setItem(TEST_MODE_KEY, String(next))
    // Reload so the landing page picks up the new state
    window.location.reload()
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all',
        active
          ? 'bg-purple-900/60 border-purple-600 text-purple-300'
          : 'bg-slate-800 border-slate-600 text-slate-500 hover:text-slate-300 hover:border-slate-500'
      )}
      title={active ? 'Disable test mode' : 'Enable test mode'}
    >
      🧪 {active ? 'Test ON' : 'Test'}
    </button>
  )
}
