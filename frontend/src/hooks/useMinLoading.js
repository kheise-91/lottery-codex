import { useState, useEffect, useRef } from 'react'

/**
 * Returns true while `loading` is true OR less than `minMs` has elapsed since the
 * current loading phase started. Used to keep skeleton loaders visible for a
 * minimum duration so fast responses don't cause a jarring content swap.
 *
 * The window is measured from when `loading` first became `true`, so a fast
 * request still keeps the skeleton up for the full `minMs`. For flags that
 * initialize to `false` (e.g., useGameHistory), the window starts at mount.
 *
 * @param {boolean} loading - The raw loading flag from a data-fetching hook.
 * @param {number} [minMs=1000] - Minimum visible duration (ms) for the loading state.
 * @returns {boolean} `true` while loading, or until `minMs` has elapsed since loading started.
 */
export function useMinLoading(loading, minMs = 1000) {
  const [extendedLoading, setExtendedLoading] = useState(true)
  const startRef = useRef(null)

  useEffect(() => {
    if (loading) {
      // Record when this loading phase began; keep the skeleton visible.
      if (startRef.current === null) startRef.current = Date.now()
      setExtendedLoading(true)
      return () => { startRef.current = null }
    }

    const startedAt = startRef.current ?? Date.now()
    startRef.current = null
    const elapsed = Date.now() - startedAt
    const remaining = Math.max(0, minMs - elapsed)

    if (remaining === 0) {
      setExtendedLoading(false)
      return
    }

    const timer = setTimeout(() => setExtendedLoading(false), remaining)
    return () => clearTimeout(timer)
  }, [loading, minMs])

  return loading || extendedLoading
}
