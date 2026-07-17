# Dashboard Component

**File:** `frontend/src/pages/Dashboard.jsx`

The game selection landing page. Fetches available lottery games via the `useGames` hook and displays them in a responsive card grid. Each card links to `/games/{gameId}`.

## Purpose

Serves as the entry point for users to browse and select a lottery game. Replaces the previous placeholder text with a functional card grid that adapts from 1 to 3 columns based on viewport width.

## Props

None. The component takes no props.

## State

State is managed internally by the `useGames` hook:

| Property  | Type     | Source                              |
|-----------|----------|-------------------------------------|
| `data`    | object \| null | `useGames()` return value       |
| `loading` | boolean  | `useGames()` return value         |
| `error`   | string \| null | `useGames()` return value       |

## Rendering Logic

### Loading State

When `loading` is `true`, a single centered message spans the full grid column:

```
Loading games...
```

### Error State

When `error` is non-null, a red error message spans the full grid column showing the error text.

### Game Cards

When not loading and no error exists, each game in `data.games` renders as a card:

- **Link wrapper** (`<a href="/games/{gameId}">`) -- navigates to the game detail page
- **Card body** -- displays `game.name` as an `<h2>` and conditionally shows `game.description` as a smaller paragraph if present
- Cards have hover shadow effects via Tailwind classes (`hover:shadow-lg transition-shadow`)

### Empty State

If `data.games` is an empty array, the grid renders with no cards and no loading/error message. No explicit "no games" placeholder is shown.

## Side Effects

- **Data fetch**: Calls `GET /api/games` via the `useGames` hook on mount
- **Navigation**: Card links navigate to `/games/{gameId}` via client-side routing (when routing is wired)

## Dependencies

- [useGames Hook](../../hooks/useGames.md) -- provides data, loading, and error states
- Tailwind CSS v4 -- responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), card styling, hover effects
