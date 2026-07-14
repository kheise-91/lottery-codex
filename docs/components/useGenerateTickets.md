# useGenerateTickets Hook

Wraps `generateTickets()` from the API service layer with React state management for ticket results, loading, and error states.

## Purpose

Provides an imperative `generate(count)` function and a `{ tickets, loading, error }` shape so components can trigger ticket generation on user interaction (e.g., button click) rather than fetching automatically. Unlike `useGameHistory`, this hook does not auto-fetch on mount or on `gameId` change -- it waits for `generate()` to be called explicitly.

## Usage

```jsx
import { useGenerateTickets } from '../hooks/useGenerateTickets';

function TicketGenerator({ gameId }) {
  const { tickets, loading, error, generate } = useGenerateTickets(gameId);

  return (
    <div>
      <button onClick={() => generate(3)} disabled={loading}>
        {loading ? 'Generating...' : 'Generate 3 Panels'}
      </button>

      {error && <div className="error">Error: {error}</div>}

      <ul>
        {tickets.map((ticket, i) => (
          <li key={i}>{ticket.join(', ')}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Parameters

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `gameId`  | string | Yes      | Game identifier (e.g. `badger-five`, `supercash`) |

## Returns

| Property  | Type     | Description                                            |
|-----------|----------|--------------------------------------------------------|
| `tickets` | array    | Array of ticket panels (each panel is an array of numbers). Empty array `[]` before first call or on error. |
| `loading` | boolean  | `true` while the generate request is in progress, `false` when complete (success or failure) |
| `error`   | string \| null     | Error message string on failure, `null` on success or before any call |
| `generate`| function | Imperative function that triggers ticket generation. Accepts an optional `count` parameter (default: `1`). |

## `generate(count)` Function

### Parameters

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `count`   | number | No       | Number of panels to generate. Defaults to `1`. |

### Behavior

- Sets `loading: true` and clears any previous `error`.
- Calls `generateTickets(gameId, count)` from the API service.
- On success, sets `tickets` to `result.tickets` (or empty array if the response lacks a `tickets` field).
- On failure, sets `error` to `err.message` and clears `tickets` to `[]`.
- Always sets `loading: false` in the `finally` block.

### Example

```jsx
// Generate 5 panels when a button is clicked
<button onClick={() => generate(5)}>Generate 5 Panels</button>

// Generate a single panel (default)
<button onClick={() => generate()}>Generate 1 Panel</button>
```

## State Lifecycle

### Before First Call

- `tickets: []`
- `loading: false`
- `error: null`

### During Generation

- `loading: true`
- `tickets` retains previous results (not cleared until success or failure)
- `error: null` (cleared at the start of the call)

### After Success

- `loading: false`
- `tickets: [[...], [...], ...]` -- array of number arrays
- `error: null`

### After Failure

- `loading: false`
- `tickets: []` -- cleared on error
- `error: "..."` -- error message string from the caught exception

## Side Effects

- **HTTP request**: Calls `POST /api/games/{gameId}/generate` via `generateTickets()` from `src/services/api.js`. This is triggered imperatively by calling `generate()`, not automatically.
- **State updates**: Updates `tickets`, `loading`, and `error` via three separate `useState` calls.

## Dependencies

- React (`useState`)
- `../services/api` -- specifically `generateTickets(gameId, count)`
