# TicketList

**File:** `frontend/src/components/games/TicketList.jsx`

## Purpose

Renders generated lottery tickets as physical-ticket-style cards. Displays prediction results from the backend's ticket generation API with a realistic ticket aesthetic: game-themed accent bars, dashed panel borders, decorative barcodes, and perforation zones between consecutive tickets.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `game` | `Object` | Yes | -- | Game details object with keys `id` (string) and `name` (string), e.g. `{ id: 'badger-five', name: 'Badger 5' }` |
| `tickets` | `number[][][]` | Yes | -- | Nested array of ticket data. Structure: `[ticket][panel][number]`. Each ticket is an array of panels, each panel is an array of numbers (e.g., `[[[7, 14, 23, 31, 39], [2, 11, 19, 27, 35]]]` for a two-panel Badger Five ticket) |

## State

No internal state. The component is fully controlled by props. All formatting (ticket IDs, timestamps) is derived from the current time at render.

## Structure

The component composes four internal sub-components:

1. **TicketList** (default export) -- Top-level wrapper that maps over `tickets`, rendering a `<TicketCard>` for each and inserting a `<Perforation>` divider between consecutive tickets.
2. **TicketCard** -- Renders a single ticket card with header, panels section, and footer strip.
3. **Panel** -- Renders one panel within a ticket: dashed-border container, colored accent bar, badge pill, and balls row.
4. **Barcode** / **Perforation** -- Decorative helpers (barcode in header, dot-pattern divider between tickets).

### TicketList (default export)

```jsx
<div className="space-y-0">
  {tickets.map((ticketData, index) => (
    <>
      <TicketCard key={index} game={game} ticketData={ticketData} index={index} />
      {index < tickets.length - 1 && <Perforation />}
    </>
  ))}
</div>
```

### TicketCard

An `<article>` element with the `ticket-card` CSS class applied:
- **Header** (`px-5 pt-5 pb-3`): Game name (`<h2>`) and ticket ID on the left, decorative `<Barcode />` on the right.
- **Panels** (`px-5 pb-5`): Each panel rendered by `<Panel>`, separated by `space-y-3`.
- **Footer** (`border-t border-gray-100 bg-gray-50 px-5 py-2.5`): Right-aligned timestamp.

Hover effect via `group` classes: `hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`.

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
- Perforation divider: radial gradient dot pattern via `backgroundImage`.

The `.ticket-card` CSS class is added to `index.css` and provides the same box-shadow styles as `.card-shadow`, applied to the `<article>` element inside each `TicketCard`.

## Children

None. The component is self-contained.

## Usage

```jsx
import TicketList from '../components/games/TicketList';

<TicketList
  game={{ id: 'badger-five', name: 'Badger 5' }}
  tickets={[
    [[7, 14, 23, 31, 39], [2, 11, 19, 27, 35]],
    [[5, 16, 22, 30, 38]],
  ]}
/>
```

Renders two Badger Five tickets (first with 2 panels, second with 1 panel) separated by a perforation zone.

## Status

Implemented as part of Phase 2.6. Consumed by the ticket display layer for generated prediction results.
