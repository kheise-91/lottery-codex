# API Service

**File:** `frontend/src/services/api.js`

A pure JavaScript fetch wrapper module that exports four named functions for all backend API endpoints. This is the sole data-fetching layer in the frontend -- hooks and components consume these functions rather than calling `fetch()` directly.

## Design Decisions

- **No `try/catch` wrapping** -- Callers (hooks, components) catch and handle errors with their own UI logic. The module only rejects on non-200 via the `!res.ok` guard, which preserves the HTTP status code in the error message.
- **No response shape transformation** -- Each function returns raw JSON as-is from `res.json()`. This keeps the service layer thin and lets consumers depend directly on the API contract documented in `docs/api/README.md` (which reflects `GamesController.php`).
- **No client-side validation** -- The `generateTickets()` function passes `count` through unchanged; the backend returns 400 for invalid values.

## Exports

### `fetchGames()`

Fetches the list of available games.

**Returns:** `Promise<GamesListResponse>`

**Endpoint:** `GET ${VITE_API_BASE_URL}/games`

**Example response:**

```json
{
  "games": [
    { "id": "badger-five", "name": "Badger 5", "status": "enabled" },
    { "id": "supercash", "name": "SuperCash!", "status": "enabled" }
  ]
}
```

**Errors:** Rejects with `Error` if response status is not 200. Error message includes the HTTP status code.

---

### `fetchGameDetails(id)`

Fetches full game details and rules for a specific game ID.

**Parameters:**

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `id`      | string | Game ID (e.g., `"badger-five"`) |

**Returns:** `Promise<GameDetailsResponse>`

**Endpoint:** `GET ${VITE_API_BASE_URL}/games/{id}`

**Example response:**

```json
{
  "id": "badger-five",
  "name": "Badger 5",
  "status": "enabled",
  "drawFrequency": ["Daily"],
  "numberRange": { "min": 1, "max": 31 },
  "numbersPerDraw": 5,
  "optimalPattern": "3-Odd 2-Even / 3-Low 2-High",
  "groups": {
    "lowOdd": [1, 3, 5, 7, 9, 11, 13, 15],
    "lowEven": [2, 4, 6, 8, 10, 12, 14, 16],
    "highOdd": [17, 19, 21, 23, 25, 27, 29, 31],
    "highEven": [18, 20, 22, 24, 26, 28, 30]
  }
}
```

**Errors:** Rejects with `Error` if response status is not 200. Error message includes the game ID and HTTP status code.

---

### `fetchHistory(id)`

Fetches historical drawing results for a specific game.

**Parameters:**

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `id`      | string | Game ID (e.g., `"badger-five"`) |

**Returns:** `Promise<HistoryResponse>`

**Endpoint:** `GET ${VITE_API_BASE_URL}/games/{id}/history`

**Example response:**

```json
{
  "history": {
    "Monday, July 1st": {
      "numbers": [3, 12, 19, 24, 31],
      "pattern": "3-Odd 2-Even / 3-Low 2-High"
    }
  }
}
```

**Errors:** Rejects with `Error` if response status is not 200. Error message includes the game ID and HTTP status code.

---

### `generateTickets(id, count)`

Generates prediction panels using pattern-based selection.

**Parameters:**

| Parameter | Type   | Description                                          |
|-----------|--------|------------------------------------------------------|
| `id`      | string | Game ID (e.g., `"badger-five"`)                      |
| `count`   | number | Number of panels to generate (must be a positive integer) |

**Returns:** `Promise<GenerateResponse>`

**Endpoint:** `POST ${VITE_API_BASE_URL}/games/{id}/generate`

**Request body:**

```json
{ "count": 3 }
```

**Example response:**

```json
{
  "tickets": [
    [3, 8, 15, 24, 30],
    [3, 9, 12, 22, 31],
    [5, 7, 14, 23, 29]
  ]
}
```

**Errors:** Rejects with `Error` if response status is not 200. The backend returns 400 for invalid `count` values; the service function does not validate client-side.

---

## Environment Configuration

The base URL is configured via the `VITE_API_BASE_URL` environment variable, exposed by Vite through `import.meta.env.VITE_API_BASE_URL`. A fallback of `/api` is used if the variable is unset.

| Environment | Variable Value | Behavior |
|-------------|---------------|----------|
| Development | `/api` (default) | Vite dev server proxies to backend host |
| Production | Absolute URL (e.g., `https://lottery.example.com/api`) | Direct fetch to production backend |

The variable is set in `frontend/.env` as `VITE_API_BASE_URL=/api`.

## Usage Example

```jsx
import { fetchGames, fetchGameDetails } from './services/api';

function GameList() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames()
      .then(setGames)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!games.length) return <div>Loading...</div>;

  return (
    <ul>
      {games.games.map(game => (
        <li key={game.id}>{game.name}</li>
      ))}
    </ul>
  );
}
```

## Relationship to Other Layers

This service layer is the data-fetching foundation for:

- **Hooks (Phase 1.6):** Custom hooks like `useGameHistory` and `useGeneratePanels` will wrap these functions with React state management, loading states, and caching logic.
- **Components (Phase 2):** Page components and UI elements will consume either the service functions directly or the hooks built on top of them.
