# TicketCarousel

**File:** `frontend/src/components/games/TicketCarousel.jsx`

## Purpose

Displays generated lottery tickets one at a time in a horizontal carousel with left/right navigation arrows, keyboard support (arrow keys), dot indicators, and smooth CSS transitions. Provides an interactive browsing experience for viewing multiple prediction panels side by side.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tickets` | `Array<Object>` | No | `[]` | Array of ticket objects compatible with `TicketCard`. Each object has a `ticketData` property (`number[][]`) and an `index` property. When empty, renders a placeholder message. |
| `game` | `Object` | No | -- | Game details object with keys `id` (string) and `name` (string). Used to determine the active dot indicator color via `GAME_COLOR_MAP`. Falls back to `--color-primary` for unknown games. |

## State

| State | Type | Description |
|-------|------|-------------|
| `activeIndex` | `number` | Zero-based index of the currently visible ticket slide. Initialized to `0`. |

## Side Effects

| Effect | Trigger | Behavior |
|--------|---------|----------|
| Reset on tickets change | `tickets` prop changes | `useEffect` resets `activeIndex` to `0` so the carousel always starts at the first slide when new tickets are generated. |

No data fetching, subscriptions, or external API calls.

## Dependencies

| Dependency | Source |
|------------|--------|
| `TicketCard` | `frontend/src/components/games/TicketCard.jsx` (imported) |
| `ChevronLeftIcon`, `ChevronRightIcon` | `@heroicons/react/24/solid` (external) |
| React hooks: `useState`, `useRef`, `useCallback`, `useEffect` | `react` (internal) |

## Internal Helpers

### `GAME_COLOR_MAP`

```js
{
  'badger-five': '--color-badger-five',
  supercash: '--color-supercash',
  megabucks: '--color-megabucks',
}
```

Maps game IDs to CSS custom property names for the active dot indicator color.

### `getThemeColorVar(gameId)`

Returns the CSS variable name for a given `gameId`, falling back to `'--color-primary'` for unknown games.

### `TRANSITION_STYLE`

```js
{ transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }
```

Inline style object applied to the carousel track for smooth slide transitions.

## Structure

The component has three rendering branches based on `tickets.length`:

1. **Zero tickets** (`count === 0`): Placeholder message — "Generate tickets to see results"
2. **Single ticket** (`count === 1`): Renders a single `TicketCard` without carousel controls
3. **Multiple tickets** (`count > 1`): Full carousel with:
   - Left/right arrow buttons (disabled at boundaries)
   - A horizontally scrollable track with CSS `transform: translateX()` for sliding
   - Dot indicators at the bottom (active dot stretches to 24px wide, inactive dots are 8px circles)

### Carousel Track

```jsx
<div className="carousel-track overflow-hidden">
  <div style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
    {tickets.map((ticket, i) => (
      <div key={i} className="carousel-slide min-w-full flex-shrink-0 px-2">
        <TicketCard game={game} ticketData={ticket.ticketData} index={ticket.index} />
      </div>
    ))}
  </div>
</div>
```

Each slide is `min-w-full` so the track shows exactly one ticket at a time. The transform shifts by `-activeIndex * 100%`.

### Dot Indicators

```jsx
<div className="flex items-center justify-center gap-1.5 mt-3">
  {tickets.map((_, dotIndex) => (
    <button
      key={dotIndex}
      onClick={() => goTo(dotIndex)}
      style={{
        width: isActive ? '24px' : '8px',
        height: '8px',
        borderRadius: isActive ? '4px' : '9999px',
        backgroundColor: isActive ? `var(${themeColorVar})` : '#d1d5db',
      }}
    />
  ))}
</div>
```

Active dots stretch horizontally (24×8px, pill-shaped) with the game's theme color. Inactive dots are small circles (8×8px, gray).

## Accessibility

- The viewport `div` is `tabIndex={0}` and receives focus for keyboard navigation.
- Arrow keys (`ArrowLeft` / `ArrowRight`) move between tickets when the viewport is focused.
- Each dot indicator has an `aria-label` (e.g., "Go to ticket 1").
- Navigation arrows have `aria-label` ("Previous ticket" / "Next ticket") and are disabled (with visual opacity reduction) at carousel boundaries.

## Children

None. The component is self-contained and renders `TicketCard` internally for each slide.

## Styling

All styling uses Tailwind CSS utility classes with minimal inline styles:
- Carousel track transform: `translateX(-${activeIndex * 100}%)`
- Active dot background color: `var(${themeColorVar})` (game-themed)
- Arrow buttons: white/85% opacity backdrop-blurred circles with gray borders, hover effects

## Usage

```jsx
import TicketCarousel from '../components/games/TicketCarousel';

<TicketCarousel
  tickets={[
    { ticketData: [[7, 14, 23, 31, 39], [2, 11, 19, 27, 35]], index: 0 },
    { ticketData: [[1, 8, 15, 22, 30], [3, 12, 20, 28, 36]], index: 1 },
  ]}
  game={{ id: 'badger-five', name: 'Badger 5' }}
/>
```

Renders a carousel with two Badger Five tickets. The active dot indicator is colored red (`--color-badger-five`).

## Status

Implemented since Phase 2.8. Consumed by the GamePage for displaying generated ticket results in an interactive browsing format.
