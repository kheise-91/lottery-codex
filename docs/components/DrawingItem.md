# DrawingItem

**File:** `frontend/src/components/games/DrawingItem.jsx`

## Purpose

Renders a single historical lottery drawing as a flat list item. Displays the formatted draw date, an "ago" badge (e.g., "Latest", "3 days ago"), the full pattern string (e.g., "3-Odd 2-Even / 3-Low 2-High"), and a row of `Ball` components for each drawn number. The most recent drawing uses game-colored balls; older drawings use white balls.

Consumed by `GamePage` to render historical drawings returned from `useGameHistory(gameId)`.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `drawing` | object | Yes | -- | Single drawing object with keys: `date` (string), `numbers` (number[]), `pattern` (string) |
| `gameId` | string \| null | No | `null` | Game identifier for colored balls (`'badger-five'`, `'supercash'`, `'megabucks'`). Passed through to `Ball` only when `isRecent` is true; older drawings always use white balls. |
| `isRecent` | boolean | No | `false` | If true, renders game-colored balls and a "Latest" badge with animated red dot; if false, renders white balls and a relative time-ago text (e.g., "3 days ago") |

## State

No internal state. The component is fully controlled by props.

## Structure

The list item has three visual sections rendered inside a flat `div` container with a bottom border separator:

### Date Header Strip

- Game draw date displayed as `<h2>` with `text-sm font-semibold text-gray-800`
- When `isRecent` is true: red "Latest" badge with animated pulsing dot (`.live-dot` class)
- When `isRecent` is false: relative time-ago text in gray (`text-[11px] text-gray-400 font-medium`)

### Pattern Badge

- Pill-shaped badge (`rounded-full px-3 py-1`) displaying the pattern string
- Includes a small bar chart SVG icon (`.live-dot` class) for visual context
- Styled with `bg-gray-100 text-gray-700 border border-gray-200`

### Number Balls

- Horizontal flex row of `Ball` components, one per number in the drawing
- When `isRecent` is true: each ball receives the `gameId` prop and renders in the game's theme color
- When `isRecent` is false: each ball receives `gameId={null}` and renders as a white sphere

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Helper Functions

### `timeAgo(dateString)`

Private helper that computes an approximate time-ago string from a date string. Accepts formats parseable by `Date.parse()` (e.g., "Monday, July 1st").

| Input | Output |
|-------|--------|
| Today's date | `"Today"` |
| Yesterday's date | `"Yesterday"` |
| 2-6 days ago | `"{n} days ago"` |
| 1 week ago | `"1 week ago"` |
| 2+ weeks ago | `"{n} weeks ago"` |

Returns an empty string if the date cannot be parsed.

## Styling

### Custom CSS Classes

DrawingItem depends on one custom CSS class defined in `frontend/src/index.css`:

| Class | Purpose | Definition |
|-------|---------|------------|
| `.live-dot` | Animated pulsing red dot for "Latest" badge | 8px circle with `#ed1c24` background, `pulse-dot` keyframe animation (2s ease-in-out infinite) |

### Keyframe Animation

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}
```

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `./Ball` (local) | Renders individual lottery number balls |

## Usage

### Recent drawing (game-colored balls, "Latest" badge)

```jsx
import DrawingItem from '../components/games/DrawingItem';

<DrawingItem
  drawing={{ date: 'Monday, July 21st', numbers: [3, 12, 27, 34, 41], pattern: '3-Odd 2-Even / 3-Low 2-High' }}
  gameId="badger-five"
  isRecent={true}
/>
```

Renders a flat list item with red Badger Five-themed balls and an animated "Latest" badge.

### Older drawing (white balls, time-ago text)

```jsx
import DrawingItem from '../components/games/DrawingItem';

<DrawingItem
  drawing={{ date: 'Monday, July 14th', numbers: [5, 18, 22, 30, 44], pattern: '2-Odd 3-Even / 2-Low 3-High' }}
  gameId="badger-five"
  isRecent={false}
/>
```

Renders a flat list item with white balls and "7 days ago" text.

## Status

Implemented. Awaiting consumption by `GamePage` (Phase 2.8).
