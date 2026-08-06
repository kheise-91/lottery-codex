# TicketCard

**File:** `frontend/src/components/games/TicketCard.jsx`

## Purpose

Renders a single generated lottery ticket as a physical-ticket-style card. Displays prediction results from the backend's ticket generation API with a realistic ticket aesthetic: game-themed accent bars, dashed panel borders, and decorative barcodes.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `game` | `Object` | Yes | -- | Game details object with keys `id` (string) and `name` (string), e.g. `{ id: 'badger-five', name: 'Badger 5' }` |
| `ticketData` | `number[][]` | Yes | -- | Panel data for a single ticket: `[panel][number]`. Each panel is an array of numbers (e.g., `[[7, 14, 23, 31, 39], [2, 11, 19, 27, 35]]` for a two-panel Badger Five ticket) |
| `index` | `number` | Yes | -- | Zero-based index used to generate the ticket ID label (e.g., "Ticket #BF-260726-01") |

## State

No internal state. The component is fully controlled by props. All formatting (ticket IDs, timestamps) is derived from the current time at render.

## Structure

The component composes three internal sub-components:

1. **TicketCard** (default export) -- Renders a single ticket card with header, panels section, and footer strip.
2. **Panel** -- Renders one panel within a ticket: dashed-border container, colored accent bar, badge pill, and balls row.
3. **Barcode** -- Decorative helper rendered in the ticket header.

### TicketCard (default export)

```jsx
<article className="group ticket-card relative rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
  {/* Header: game name, ticket ID, barcode */}
  <div className="px-5 pt-5 pb-3">...</div>

  {/* Panels: one <Panel /> per panel in ticketData */}
  <div className="px-5 pb-5 space-y-3">...</div>

  {/* Footer: timestamp */}
  <div className="border-t border-gray-100 bg-gray-50 px-5 py-2.5 flex items-center justify-end">...</div>
</article>
```

### Panel

A `<div>` element with:
- Absolute-positioned 6px accent bar on the left edge (game color).
- Badge pill (`rounded-full`) showing "Panel A", "Panel B", etc.
- Balls row using `<Ball number={n} />` (white variant, no `gameId` prop).

Props: `{ numbers, index, color, lightColor }` where `lightColor` is a pre-computed hex color string for the badge background.

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions. The timestamp and ticket ID are computed at render time from `new Date()`.

## Dependencies

| Dependency | Source |
|------------|--------|
| `Ball` | `frontend/src/components/games/Ball.jsx` (imported) |

No external dependencies. Uses Tailwind CSS utilities exclusively for styling. Game-specific colors are hardcoded in the internal `GAME_CONFIG` object rather than consumed from CSS variables.

## Internal Helpers

### `GAME_CONFIG`

```js
{
  'badger-five':   { initials: 'BF', color: '#ed1c24', light: '#fecdd3' },
  'supercash':     { initials: 'SC', color: '#0081c6', light: '#bae6fd' },
  'megabucks':     { initials: 'MB', color: '#ff7200', light: '#fed7aa' },
}
```

Maps game IDs to display initials, primary theme color, and light background color. Unknown games fall back to gray defaults (`??`, `#6b7280`, `#e5e7eb`).

### `ticketId(initials, index)`

Formats a ticket ID as `[INITIALS]-[yymmdd]-[NN]`. Example: `"BF-260726-01"`. Uses the current date at render time.

### `panelLabel(index)`

Maps a 0-based panel index to an uppercase letter (0 -> "A", 1 -> "B", etc.) via `String.fromCharCode(65 + index)`.

### `formatTimestamp()`

Returns a formatted string like `"July 26, 2026 · 09:41 AM"` using `toLocaleDateString` and `toLocaleTimeString`.

### `getGameConfig(game)`

Looks up `GAME_CONFIG[game.id]`. Returns the config object or gray fallback.

## Styling

All styling uses Tailwind CSS utility classes. Two inline styles are used for dynamic game-specific colors:
- Panel accent bar: `backgroundColor` set to the game's primary color.
- Panel badge: text color and light background derived from the game's `light` config value.

The `.ticket-card` CSS class is added to `index.css` and provides a box-shadow style applied to the `<article>` element inside each `TicketCard`.

## Children

None. The component is self-contained.

## Usage

```jsx
import TicketCard from '../components/games/TicketCard';

<TicketCard
  game={{ id: 'badger-five', name: 'Badger 5' }}
  ticketData={[
    [7, 14, 23, 31, 39],
    [2, 11, 19, 27, 35],
  ]}
  index={0}
/>
```

Renders a single Badger Five ticket with 2 panels.

## Status

Standalone export since Phase 2.8. Consumed by the TicketCarousel for displaying generated prediction results.
