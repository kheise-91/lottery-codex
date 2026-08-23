import { useState, useEffect } from 'react'

/**
 * Returns true while `loading` is true OR less than `minMs` has elapsed since the
 * current loading phase started. Used to keep skeleton loaders visible for a
 * minimum duration so fast responses don't cause a jarring content swap.
 *
 * @param {boolean} loading - The raw loading flag from a data-fetching hook.
 * @param {number} [minMs=2000] - Minimum visible duration (ms) for the loading state.
 * @returns {boolean} `true` while loading, or until `minMs` has elapsed since loading started.
 */
export function useMinLoading(loading, minMs = 2000) {
  const [extendedLoading, setExtendedLoading] = useState(loading)

  useEffect(() => {
    if (loading) {
      setExtendedLoading(true)
      return
    }

    const timer = setTimeout(() => setExtendedLoading(false), minMs)
    return () => clearTimeout(timer)
  }, [loading, minMs])

  return loading || extendedLoading
}
