# useGames Hook

Wraps `fetchGames()` from the API service layer with React state management for loading, error, and data states.

## Purpose

Provides a standard `{ data, loading, error }` shape so components can render skeleton UI during fetch, display errors gracefully, and show content when ready -- without calling the API directly. Fetches once on mount and does not refetch unless the component remounts.

## Usage

```jsx
import { useGames } from '../hooks/useGames';

function GameSelector() {
  const { data, loading, error } = useGames();
  const games = data?.games ?? [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {games.map(game => (
        <li key={game.id}>{game.name}</li>
      ))}
    </ul>
  );
}
```

## Parameters

None. The hook takes no arguments and fetches the full game list on mount.

## Returns

| Property  | Type     | Description                                            |
|-----------|----------|--------------------------------------------------------|
| `data`    | object \| null | Full response from `fetchGames()` on success, `null` during loading or on failure |
| `loading` | boolean  | `false` before first fetch, `true` while fetching, `false` when complete (success or failure) |
| `error`   | string \| null     | Error message string on failure, `null` on success or during loading |

## Behavior

### Loading State

- Sets `loading: true` immediately when the effect runs.
- Resets `data`, `loading`, and `error` to `null`/`false` before fetching (ensures a clean slate on mount).

### Success

- On successful `fetchGames()` call, sets `data` to the full response object and clears `error`.
- The response shape matches the API: `{ games: [ { id, name, status, ... } ] }`.

### Error Handling

- On failure, captures `err.message` as a string and sets `error` to that value.
- Leaves `data` as `null` on error.

### Mount-Only Fetch

- The `useEffect` dependency array is `[]`, so the hook fetches exactly once when the component mounts. It does not refetch on re-render or prop changes.

### Cleanup

- A cleanup function sets a `cancelled` flag to `true` in the effect's return, preventing state updates if the component unmounts while the fetch is still pending. This avoids React warnings about setting state on unmounted components.

## Side Effects

- **HTTP request**: Calls `GET /api/games` via `fetchGames()` from `src/services/api.js`.
- **State updates**: Updates `data`, `loading`, and `error` via three separate `useState` calls.

## Dependencies

- React (`useState`, `useEffect`)
- [API Service](../../services/api.md) -- specifically `fetchGames()`
