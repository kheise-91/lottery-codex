# Dashboard Component

**File:** `frontend/src/pages/Dashboard.jsx`

## Purpose

Game selection landing page. Fetches available lottery games via the `useGames` hook and displays them in a responsive 3-column card grid using the `GameCard` component. Each card links to `/games/{gameId}` for game detail navigation.

## Props

None. The component takes no props.

## State

State is managed internally by the `useGames` hook:

| Property  | Type     | Source                              |
|-----------|----------|-------------------------------------|
| `data`    | object \| null | `useGames()` return value       |
| `loading` | boolean  | `useGames()` return value         |
| `error`   | string \| null | `useGames()` return value       |

The component derives `games` from `data?.games ?? []`.

## Rendering Logic

### Title and Description

Renders a heading `"Choose a Game"` and an introductory paragraph explaining the page purpose.

### Loading State

When `loading` is `true`, a centered message spans the full grid column:

```
Loading games...
```

### Error State

When `error` is non-null, a red error message spans the full grid column showing the error text.

### Game Cards

When not loading and no error exists, each game in `games` renders as a `<GameCard>` component wrapped in a `<div>`:

- `gameId` mapped from `game.id`
- `name` mapped from `game.name`
- `description` falls back to empty string if missing
- `imageSrc` constructed as `/{game.id}.svg` (expects SVG files in the public directory)
- `status` passed through from `game.status`
- `drawFrequency`, `oddsOfWinning`, `jackpot` use fallback values (`'N/A'`, `'—'`) when not yet provided by the backend API
- `enabled` derived as `game.status === 'enabled'`

### Empty State

If `games` is an empty array, the grid renders with no cards and no loading/error message. No explicit "no games" placeholder is shown.

## Layout Integration

The Dashboard is rendered inside the `Layout` component's `<Outlet />`. The Layout's main content area uses `max-w-6xl` to accommodate the 3-column card grid at wide viewports.

## Side Effects

- **Data fetch**: Calls `GET /api/games` via the `useGames` hook on mount

## Dependencies

- [useGames Hook](../../hooks/useGames.md) -- provides data, loading, and error states
- [GameCard Component](./GameCard.md) -- renders individual game selection cards
- Tailwind CSS v4 -- responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), card spacing
