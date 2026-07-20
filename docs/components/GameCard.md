# GameCard

**File:** `frontend/src/components/games/GameCard.jsx`

## Purpose

Reusable game selection card component used on the Dashboard page. Renders a clickable card displaying a game's gradient image area, status badge, name, description, three stat pills (draw frequency, odds, jackpot), and a footer CTA. Cards are wrapped in a React Router `<Link>` for client-side navigation to `/games/{gameId}`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `gameId` | string | Yes | Game identifier used for link href and image gradient lookup (e.g., `"badger-five"`) |
| `name` | string | Yes | Display name of the game (e.g., `"Badger 5"`) |
| `description` | string | No | Short game description; if empty, the description paragraph is omitted |
| `imageSrc` | string | No | SVG image path displayed in the card header (e.g., `"/badger-five.svg"`); omitted if falsy |
| `status` | string | Yes | Backend status value: `"enabled"` or `"disabled"` |
| `drawFrequency` | string | Yes | Draw schedule display string (e.g., `"Wed/Sun"`, `"Daily"`) |
| `oddsOfWinning` | string | Yes | Odds display string (e.g., `"1 in 575"`) |
| `jackpot` | string | Yes | Jackpot amount placeholder (e.g., `"$50,000"`) |
| `enabled` | boolean | Yes | Whether the game is currently playable; determines badge color and CTA text |

## State

No internal state. The component is fully controlled by props.

## Structure

The card has three visual sections rendered inside a `<Link>` wrapper:

### Image Area (header)

- Fixed height `h-40` with a generic light gray gradient (`from-gray-50 to-gray-100`)
- Game SVG image centered within the area (`object-contain`, `h-28 w-auto`, `pt-6` for top spacing)
- Bottom border: `border-b border-gray-200`
- Status badge positioned absolutely at top-right:
  - Enabled: green pill with `"Live"` text (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - Disabled: gray pill with `"Coming Soon"` text (`bg-gray-100 text-gray-500 border-gray-200`)

### Card Body

- Game name rendered as `<h3>` with `text-lg font-semibold text-gray-800`
- Description paragraph (conditionally rendered only when non-empty)
- Three-column stat grid using the `.stat-pill` CSS class:
  - **Draw** -- shows `drawFrequency`; `'Daily'` displays as `"Daily"`, otherwise arrays are joined with `|` (e.g., `"Wed/Sat"`)
  - **Odds** -- shows `oddsOfWinning`
  - **Jackpot** -- shows `jackpot`
  - Each stat pill uses CSS variables for theming: `backgroundColor: var(--color-${gameId}-light)` and `color: var(--color-${gameId})`

### Footer CTA

- Enabled: `<button>` element with `Play Now` text and an `<ArrowRightIcon>` that slides right on hover (`group-hover:translate-x-1`); styled with game's theme color via `backgroundColor: var(--color-${gameId})` and white text
- Disabled: `"Coming Soon"` in gray with `cursor-not-allowed`

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Styling

### Card Header Gradient

GameCard no longer uses per-game gradient mappings. All cards share a generic light gray gradient: `bg-gradient-to-br from-gray-50 to-gray-100`.

### Hover Effect

The root `<Link>` applies:
- `group` class for sibling hover state propagation
- `transition-transform duration-200 ease-out group-hover:-translate-y-1` for lift effect
- `card-shadow` / `card-shadow-hover` custom CSS classes for shadow transitions (defined in `frontend/src/index.css`)

### Custom CSS Classes

GameCard depends on three custom CSS classes defined in `frontend/src/index.css`:

| Class | Purpose | Definition |
|-------|---------|------------|
| `.card-shadow` | Default card shadow | `hsl(160 75% 25% / 25%) 0px 8px 24px -2px, hsl(160 75% 15% / 15%) 0px 4px 12px -2px` |
| `.card-shadow-hover` | Hover card shadow | `hsl(160 75% 25% / 35%) 0px 12px 32px -2px, hsl(160 75% 15% / 25%) 0px 8px 16px -2px` |
| `.stat-pill` | Stat pill background | `linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)` with `border: 1px solid #a7f3d0` |

### Theme Colors (CSS Variables)

GameCard uses CSS custom properties defined via Tailwind `@theme` in `frontend/src/index.css` for game-specific theming:

| Variable | Badger Five | SuperCash | Megabucks |
|----------|-------------|-----------|-----------|
| `--color-primary` | `#059669` (emerald green, shared) | `#059669` | `#059669` |
| `--color-badger-five` / `--color-${gameId}` | `#ed1c24` | `#0081c6` | `#ff7200` |
| `--color-badger-five-light` / `--color-${gameId}-light` | `#fecdd3` | `#bae6fd` | `#fed7aa` |

The stat pills and Play Now button use these variables to apply game-appropriate colors dynamically.

## Children

None. The component is self-contained and does not accept children.

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `react-router-dom` (`Link`) | Client-side navigation to `/games/{gameId}` |
| `@heroicons/react/24/outline` (`ArrowRightIcon`) | Arrow icon in the Play Now CTA |

## Usage

GameCard is rendered on the Dashboard page, one per game returned by the `useGames` hook:

```jsx
import GameCard from '../components/games/GameCard';

<GameCard
  gameId={game.id}
  name={game.name}
  description={game.description ?? ''}
  imageSrc={`/${game.id}.svg`}
  status={game.status}
  drawFrequency={game.drawFrequency ?? 'N/A'}
  oddsOfWinning={game.oddsOfWinning ?? 'N/A'}
  jackpot={game.jackpot ?? '—'}
  enabled={game.status === 'enabled'}
/>
```

## Status

Implemented and in use on the Dashboard page.
