# useGameHistory Hook

Wraps `fetchHistory()` from the API service layer with React state management for loading, error, and data states.

## Purpose

Provides a standard `{ data, loading, error }` shape so components can render skeleton UI during fetch, display errors gracefully, and show content when ready -- without calling the API directly. Caches results by `gameId` and only refetches when the game ID changes.

## Usage

```jsx
import { useGameHistory } from '../hooks/useGameHistory';

function GameHistoryPanel({ gameId }) {
  const { data, loading, error } = useGameHistory(gameId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return <ul>{Object.entries(data.history).map(...)}</ul>;
}
```

## Parameters

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `gameId`  | string | Yes      | Game identifier (e.g. `badger-five`, `supercash`) |

## Returns

| Property  | Type     | Description                                            |
|-----------|----------|--------------------------------------------------------|
| `data`    | object \| null | Full response from `fetchHistory(gameId)` on success, `null` during loading or on failure |
| `loading` | boolean \| null  | `null` before first fetch, `true` while fetching, `false` when complete (success or failure) |
| `error`   | string \| null     | Error message string on failure, `null` on success or during loading |

## Behavior

### Loading State

- Sets `loading: true` immediately when the effect runs.
- Resets `data`, `loading`, and `error` to `null` before fetching (so stale data from a previous `gameId` does not persist).

### Success

- On successful `fetchHistory(gameId)` call, sets `data` to the full response object and clears `error`.
- The response shape matches the API: `{ history: { [dateString]: { numbers: [...], pattern: "..." } } }`.

### Error Handling

- On failure, captures `err.message` as a string and sets `error` to that value.
- Leaves `data` as `null` on error.

### Caching / Refetching

- The `useEffect` dependency array is `[gameId]`, so the hook does **not** refetch on re-render when `gameId` is unchanged (effect caching).
- When `gameId` changes, the effect runs again with a fresh fetch.

### Cleanup

- A cleanup function sets a `cancelled` flag to `true` in the effect's return, preventing state updates if the component unmounts while the fetch is still pending. This avoids React warnings about setting state on unmounted components.

## Side Effects

- **HTTP request**: Calls `GET /api/games/{gameId}/history` via `fetchHistory()` from `src/services/api.js`.
- **State updates**: Updates `data`, `loading`, and `error` via three separate `useState` calls.

## Dependencies

- React (`useState`, `useEffect`)
- [API Service](../../services/api.md) -- specifically `fetchHistory(gameId)`
