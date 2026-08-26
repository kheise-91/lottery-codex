# PatternDistribution

**File:** `frontend/src/components/games/PatternDistribution.jsx`

## Purpose

Renders pattern frequency distribution for the last 100 historical drawings using Lottery Codex methodology. Calculates occurrence counts per pattern string, derives percentages, sorts results, and displays flat bar rows with game-themed colors. The component renders flat on page background with no card wrapper, shadow, or border.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `history` | Object | Yes | -- | Object mapping date → `{ pattern }` used for calculations. Entries are extracted via `Object.values`, last 100 taken. |
| `gameId` | string | Yes | -- | Game identifier (e.g., `'badger-five'`) for CSS variable colors (`--color-${gameId}`, `--color-${gameId}-light`, `--color-${gameId}-lightest`). |
| `gamePrimaryColor` | string | No | -- | Legacy fallback primary color for percentage text when `gameId` is unavailable. |

## State

No React state. Derived data computed with `useMemo`.

## Derived Data

The component computes distribution via `useMemo`:

- Extract entries: `Object.values(history ?? {})`
- Take last 100 entries (or fewer if history shorter)
- Count occurrences of each `entry.pattern` string
- Compute percentage = `Math.round(count / total * 100)`
- Sort descending by percentage, then alphabetically for ties

Result is an array of `{ pattern, count, percentage }` items.

## Structure

Flat container `<div>` with heading, subtitle, and per-pattern rows (or an empty-state message):

- Heading: `<h2 className="text-sm font-semibold text-gray-800 mb-1">Pattern Distribution</h2>`
- Subtitle: `<p className="text-xs text-gray-400 mb-2">Last 100 Drawings</p>`
- When `distribution.length === 0` (no history data): empty-state message instead of bar rows:
  - `<p className="text-xs text-gray-400">No data</p>` — flat, no card/border/background, styled to match the subtitle
- Otherwise, per row:
  - Label container: `flex justify-between items-baseline mb-1`
  - Label: `<span className="text-xs font-medium text-gray-700">{pattern}</span>` left-aligned
  - Percentage: `<span className="text-xs font-semibold" style={{ color: primaryColorStyle }}>{percentage}%</span>` right-aligned, colored via `var(--color-${gameId})` or fallback
  - Bar track: `<div className="w-full bg-gray-200 rounded-full h-2">`
  - Filled bar: `<div className="h-2 rounded-full" style={{ width: `${percentage}%`, ...barStyle }} />`

No card wrapper, border, background or shadow is used.

## Color Mapping

Bar fill colors by rank:

- Rank 0 (most frequent): `background-color: var(--color-${gameId})` (primary)
- Rank 1: `background-color: var(--color-${gameId}-light)`
- Rank 2: `background-color: var(--color-${gameId}-lightest}`
- Rank >2: primary color with opacity scaled by `Math.max(0.2, percentage / 100)`

Fallbacks:

- If `gameId` is unmapped, component uses internal `GAME_BAR_COLORS` map for `badger-five`, `supercash`/`super-cash`, `megabucks`/`mega-bucks`.
- If `gameId` absent and legacy `gamePrimaryColor` provided, that color is used with opacity fallback.

## Side Effects

None. No `useEffect`, data fetching, subscriptions, or DOM mutations.

## Children

None. The component does not accept or render children.

## Dependencies

- `react` (`useMemo`)

Pure React functional component with Tailwind utility classes and CSS custom properties.

## Usage

```jsx
import PatternDistribution from '../components/games/PatternDistribution';

<PatternDistribution
  history={history?.history}
  gameId={gameId}
/>;
```

Renders heading, subtitle and frequency bars for the last 100 drawings. Safe to render with empty or undefined `history` (renders heading/subtitle plus a "No data" message).

## Status

Implemented in Phase 2.9. Pattern frequency calculation from last 100 drawings and flat bar rendering with game-themed colors is complete. Phase 2.11 adds a "No data" empty-state message when the history prop yields no distribution data.
