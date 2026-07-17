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

- Fixed height `h-40` with a gradient background determined by `gameId` via the internal `getGradient()` mapping
- Game SVG image centered within the area (`object-contain`, `h-28 w-auto`)
- Status badge positioned absolutely at top-right:
  - Enabled: green pill with `"Live"` text (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - Disabled: gray pill with `"Coming Soon"` text (`bg-gray-100 text-gray-500 border-gray-200`)

### Card Body

- Game name rendered as `<h3>` with `text-lg font-semibold`
- Description paragraph (conditionally rendered only when non-empty)
- Three-column stat grid using the `.stat-pill` CSS class:
  - **Draw** -- shows `drawFrequency`
  - **Odds** -- shows `oddsOfWinning`
  - **Jackpot** -- shows `jackpot`

### Footer CTA

- Enabled: `"Play Now"` text with an `<ArrowRightIcon>` that slides right on hover (`group-hover:translate-x-1`)
- Disabled: `"Coming Soon"` in gray with `cursor-not-allowed`

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Styling

### Gradient Mapping

Internal `getGradient()` maps game IDs to Tailwind gradient classes:

| Game ID | Gradient |
|---------|----------|
| `badger-five` | `from-blue-50 to-indigo-100` |
| `supercash` | `from-violet-50 to-purple-100` |
| `megabucks` | `from-amber-50 to-orange-100` |
| (fallback) | `from-slate-50 to-gray-100` |

### Hover Effect

The root `<Link>` applies:
- `group` class for sibling hover state propagation
- `transition-transform duration-200 ease-out group-hover:-translate-y-1` for lift effect
- `card-shadow` / `card-shadow-hover` custom CSS classes for shadow transitions (defined in `frontend/src/index.css`)

### Custom CSS Classes

GameCard depends on two custom CSS classes defined in `frontend/src/index.css`:

| Class | Purpose | Definition |
|-------|---------|------------|
| `.card-shadow` | Default card shadow | `hsl(225 75% 25% / 25%) 0px 8px 24px -2px, hsl(225 75% 15% / 15%) 0px 4px 12px -2px` |
| `.card-shadow-hover` | Hover card shadow | `hsl(225 75% 25% / 35%) 0px 12px 32px -2px, hsl(225 75% 15% / 25%) 0px 8px 16px -2px` |
| `.stat-pill` | Stat pill background | `linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%)` with `border: 1px solid #c7d9f2` |

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
