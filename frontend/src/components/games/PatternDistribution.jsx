/**
 * PatternDistribution — renders pattern frequency distribution for the last 100 drawings.
 *
 * @param {Object} props
 * @param {Object} props.history - Object mapping date → { pattern } used for calculations
 * @param {string} props.gameId - Game identifier (e.g., 'badger-five') for CSS variable colors
 * @param {string} [props.gamePrimaryColor] - Legacy fallback primary color
 */
import { useMemo } from 'react'

const GAME_BAR_COLORS = {
  'badger-five': { primary: '#ed1c24', light: '#fca5a5', lightest: '#fecdd3' },
  'supercash': { primary: '#0081c6', light: '#7dd3fc', lightest: '#bae6fd' },
  'super-cash': { primary: '#0081c6', light: '#7dd3fc', lightest: '#bae6fd' },
  'megabucks': { primary: '#ff7200', light: '#fdba74', lightest: '#fed7aa' },
  'mega-bucks': { primary: '#ff7200', light: '#fdba74', lightest: '#fed7aa' },
};

function PatternDistribution({ history, gameId, gamePrimaryColor }) {
  const distribution = useMemo(() => {
    if (!history || typeof history !== 'object') return []
    const entries = Object.values(history ?? {})
    const last100 = entries.length > 100 ? entries.slice(-100) : entries
    const total = last100.length
    if (total === 0) return []

    const counts = {}
    for (const entry of last100) {
      const pattern = entry?.pattern || ''
      if (!pattern) continue
      counts[pattern] = (counts[pattern] || 0) + 1
    }

    const items = Object.entries(counts).map(([pattern, count]) => ({
      pattern,
      count,
      percentage: Math.round((count / total) * 100),
    }))

    items.sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage
      return a.pattern.localeCompare(b.pattern)
    })

    if (items.length > 3) {
      const thirdPct = items[2].percentage
      return items.filter(item => item.percentage >= thirdPct)
    }

    return items
  }, [history])

  const primaryColorStyle = gameId ? `var(--color-${gameId})` : gamePrimaryColor

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-800 mb-1">Pattern Distribution</h2>
      <p className="text-xs text-gray-400 mb-2">Last 100 Drawings</p>
      {distribution.length === 0 ? (
        <p className="text-xs text-gray-400">No data</p>
      ) : (
      distribution.map((item, idx) => {
        let barStyle = {}
        const colors = gameId ? GAME_BAR_COLORS[gameId] : null
        if (colors) {
          if (idx === 0) {
            barStyle.backgroundColor = colors.primary
          } else if (idx === 1) {
            barStyle.backgroundColor = colors.light
          } else if (idx === 2) {
            barStyle.backgroundColor = colors.lightest
          } else {
            barStyle.backgroundColor = colors.primary
            barStyle.opacity = Math.max(0.2, item.percentage / 100)
          }
        } else if (gameId) {
          // Fallback to CSS variables for unmapped gameIds
          if (idx === 0) {
            barStyle.backgroundColor = `var(--color-${gameId})`
          } else if (idx === 1) {
            barStyle.backgroundColor = `var(--color-${gameId}-light)`
          } else if (idx === 2) {
            barStyle.backgroundColor = `var(--color-${gameId}-lightest)`
          } else {
            barStyle.backgroundColor = `var(--color-${gameId})`
            barStyle.opacity = Math.max(0.2, item.percentage / 100)
          }
        } else if (gamePrimaryColor) {
          barStyle.backgroundColor = gamePrimaryColor
          if (idx > 2) {
            barStyle.opacity = Math.max(0.2, item.percentage / 100)
          }
        }

        return (
          <div key={item.pattern} className="mb-3">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-medium text-gray-700">{item.pattern}</span>
              <span className="text-xs font-semibold" style={{ color: primaryColorStyle }}>{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{ width: `${item.percentage}%`, ...barStyle }}
              />
            </div>
          </div>
        )
      })
      )}
    </div>
  )
}

export default PatternDistribution;
