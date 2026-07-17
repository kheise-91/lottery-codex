# API Reference

Slim Framework 4 REST API serving JSON endpoints. The API entry point (`backend/api.php`) bootstraps the application with error middleware, a global JSON Content-Type middleware, and delegates to `GamesController` for all game endpoint logic.

## Entry Point

All requests route through:

```
POST /api/games/{gameId}/generate
GET  /api/games
GET  /api/games/{gameId}
GET  /api/games/{gameId}/history
```

Nginx proxies all `/api/` paths to `backend/api.php` via PHP-FPM on TCP port `127.0.0.1:9000`. Slim Framework parses the full URI path for route matching.

## Endpoints

### GET `/api/games`

List all registered games with their full detail objects (same shape as `GET /api/games/{gameId}`). Returns an array of game objects, each containing `id`, `name`, `status`, `description`, `drawFrequency`, `oddsOfWinning`, `numberRange`, `numbersPerDraw`, `optimalPattern`, and `groups`.

**Response (200):**

```json
{
  "games": [
    {
      "id": "badger-five",
      "name": "Badger 5",
      "status": "enabled",
      "description": "Pick 5 numbers from 1 to 31. Drawn daily.",
      "oddsOfWinning": "1 in 1,829,322",
      "drawFrequency": ["Daily"],
      "numberRange": { "min": 1, "max": 31 },
      "numbersPerDraw": 5,
      "optimalPattern": "3-Odd 2-Even / 3-Low 2-High",
      "groups": {
        "lowOdd":   [1, 3, 5, 7, 9, 11, 13, 15],
        "lowEven":  [2, 4, 6, 8, 10, 12, 14, 16],
        "highOdd":  [17, 19, 21, 23, 25, 27, 29, 31],
        "highEven": [18, 20, 22, 24, 26, 28, 30]
      }
    },
    {
      "id": "supercash",
      "name": "SuperCash!",
      "status": "enabled",
      "description": "Pick 6 numbers from 1 to 39. Drawn daily.",
      "oddsOfWinning": "1 in 3,262,623",
      "drawFrequency": ["Daily"],
      "numberRange": { "min": 1, "max": 39 },
      "numbersPerDraw": 6,
      "optimalPattern": "3-Odd 3-Even / 3-Low 3-High",
      "groups": {
        "lowOdd":   [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
        "lowEven":  [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        "highOdd":  [21, 23, 25, 27, 29, 31, 33, 35, 37, 39],
        "highEven": [22, 24, 26, 28, 30, 32, 34, 36, 38]
      }
    },
    {
      "id": "megabucks",
      "name": "Megabucks",
      "status": "enabled",
      "description": "Pick 6 numbers from 1-49 in this twice-weekly, Wisconsin-only rolling jackpot game where every $1 ticket gives you two separate plays.",
      "oddsOfWinning": "1 in 6,991,908",
      "drawFrequency": ["Wednesday", "Saturday"],
      "numberRange": { "min": 1, "max": 39 },
      "numbersPerDraw": 6,
      "optimalPattern": "3-Odd 3-Even / 3-Low 3-High",
      "groups": {
        "lowOdd":   [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25],
        "lowEven":  [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
        "highOdd":  [27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49],
        "highEven": [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]
      }
    }
  ]
}
```

**Note:** The response wraps the array in a `games` key. Each game object is a full detail object (identical to the response from `GET /api/games/{gameId}`). Previously this endpoint returned only `{id, name, status}` per game; it now delegates to each game class's `getGameDetails()` method.

### GET `/api/games/{gameId}`

Get full game details and rules. Returns the result of `GameInterface::getGameDetails()`.

**Path parameters:**

| Parameter | Type   | Example      |
|-----------|--------|--------------|
| `gameId`  | string | `badger-five`|

**Response (200) -- Badger Five:**

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
    "lowOdd":   [1, 3, 5, 7, 9, 11, 13, 15],
    "lowEven":  [2, 4, 6, 8, 10, 12, 14, 16],
    "highOdd":  [17, 19, 21, 23, 25, 27, 29, 31],
    "highEven": [18, 20, 22, 24, 26, 28, 30]
  }
}
```

**Response (200) -- Super Cash:**

```json
{
  "id": "supercash",
  "name": "SuperCash!",
  "status": "enabled",
  "drawFrequency": ["Daily"],
  "numberRange": { "min": 1, "max": 39 },
  "numbersPerDraw": 6,
  "optimalPattern": "3-Odd 3-Even / 3-Low 3-High",
  "groups": {
    "lowOdd":   [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    "lowEven":  [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    "highOdd":  [21, 23, 25, 27, 29, 31, 33, 35, 37, 39],
    "highEven": [22, 24, 26, 28, 30, 32, 34, 36, 38]
  }
}
```

**Response (404):** Game ID not found. Supported game IDs are `badger-five`, `supercash`, and `megabucks`.

### GET `/api/games/{gameId}/history`

Get historical drawing results. Returns an associative array keyed by date string, each entry containing `numbers` and `pattern`. Currently returns mock/static data; live scraping is planned for a future phase.

**Path parameters:**

| Parameter | Type   | Example      |
|-----------|--------|--------------|
| `gameId`  | string | `badger-five`|

**Response (200) -- Badger Five:**

```json
{
  "history": {
    "Monday, July 1st": {
      "numbers": [3, 12, 19, 24, 31],
      "pattern": "3-Odd 2-Even / 3-Low 2-High"
    },
    "Sunday, June 30th": {
      "numbers": [5, 8, 17, 22, 29],
      "pattern": "3-Odd 2-Even / 2-Low 3-High"
    },
    "Saturday, June 29th": {
      "numbers": [2, 11, 14, 23, 30],
      "pattern": "2-Odd 3-Even / 3-Low 2-High"
    },
    "Friday, June 28th": {
      "numbers": [7, 9, 16, 21, 28],
      "pattern": "3-Odd 2-Even / 2-Low 3-High"
    },
    "Thursday, June 27th": {
      "numbers": [1, 4, 13, 20, 25],
      "pattern": "3-Odd 2-Even / 3-Low 2-High"
    },
    "Wednesday, June 26th": {
      "numbers": [6, 10, 18, 26, 31],
      "pattern": "1-Odd 4-Even / 1-Low 4-High"
    },
    "Tuesday, June 25th": {
      "numbers": [3, 8, 15, 22, 27],
      "pattern": "3-Odd 2-Even / 2-Low 3-High"
    }
  }
}
```

**Response (200) -- Super Cash:**

```json
{
  "history": {
    "Monday, July 1st": {
      "numbers": [4, 11, 18, 25, 32, 37],
      "pattern": "3-Odd 3-Even / 3-Low 3-High"
    },
    "Sunday, June 30th": {
      "numbers": [2, 9, 14, 23, 30, 35],
      "pattern": "3-Odd 3-Even / 2-Low 4-High"
    },
    "Saturday, June 29th": {
      "numbers": [7, 12, 19, 26, 31, 38],
      "pattern": "4-Odd 2-Even / 3-Low 3-High"
    },
    "Friday, June 28th": {
      "numbers": [3, 8, 15, 22, 29, 36],
      "pattern": "4-Odd 2-Even / 2-Low 4-High"
    },
    "Thursday, June 27th": {
      "numbers": [1, 10, 17, 24, 33, 39],
      "pattern": "5-Odd 1-Even / 3-Low 3-High"
    },
    "Wednesday, June 26th": {
      "numbers": [6, 13, 20, 27, 34, 38],
      "pattern": "2-Odd 4-Even / 2-Low 4-High"
    }
  }
}
```

**Response (404):** Game ID not found. Supported game IDs are `badger-five`, `supercash`, and `megabucks`.

**Response (200) -- Megabucks:**

```json
{
  "history": {
    "Monday, July 1st": {
      "numbers": [4, 11, 18, 25, 32, 37],
      "pattern": "3-Odd 3-Even / 3-Low 3-High"
    },
    "Sunday, June 30th": {
      "numbers": [2, 9, 14, 23, 30, 35],
      "pattern": "3-Odd 3-Even / 2-Low 4-High"
    },
    "Saturday, June 29th": {
      "numbers": [7, 12, 19, 26, 31, 38],
      "pattern": "4-Odd 2-Even / 3-Low 3-High"
    },
    "Friday, June 28th": {
      "numbers": [3, 8, 15, 22, 29, 36],
      "pattern": "4-Odd 2-Even / 2-Low 4-High"
    },
    "Thursday, June 27th": {
      "numbers": [1, 10, 17, 24, 33, 39],
      "pattern": "5-Odd 1-Even / 3-Low 3-High"
    },
    "Wednesday, June 26th": {
      "numbers": [6, 13, 20, 27, 34, 38],
      "pattern": "2-Odd 4-Even / 2-Low 4-High"
    }
  }
}
```

**Notes:**
- This endpoint returns static mock data. Live scraping from wilottery.com is planned for a future phase.

### POST `/api/games/{gameId}/generate`

Generate prediction panels using pattern-based selection. Instantiates the appropriate game class based on `gameId`, calls `generateTickets($count)`, and returns the result.

**Path parameters:**

| Parameter | Type   | Example      |
|-----------|--------|--------------|
| `gameId`  | string | `badger-five`|

**Request body:**

```json
{
  "count": 3
}
```

| Field     | Type   | Description                    |
|-----------|--------|--------------------------------|
| `count`   | int    | Number of panels to generate (must be a positive integer) |

**Response (200):**

```json
{
  "tickets": [
    [3, 8, 15, 24, 30],
    [3, 9, 12, 22, 31],
    [5, 7, 14, 23, 29]
  ]
}
```

Each panel is a sorted integer array of length equal to the game's `numbersPerDraw`. Numbers are drawn from constrained category pools (`lowOdd`, `lowEven`, `highOdd`, `highEven`) according to sub-pattern definitions. Uniqueness enforcement scans all previously generated panels linearly -- O(n^2) in total panels.

**Response (400):** Invalid request body -- missing or non-positive `count` field. Returns `{ "error": "Invalid count: must be a positive integer." }`.

**Response (404):** Game ID not found.

**Response (503):** Game class failed to instantiate. Returns `{ "error": "Game unavailable" }`.

## Controller Layer

All four endpoints are handled by `GamesController` in `backend/controllers/GamesController.php`. The controller uses a `$registry` array to map game IDs (`badger-five`, `supercash`) to their fully-qualified class names. Game resolution is done via the private `resolve()` method, which returns a `GameInterface` instance or `null`.

**Note:** The `history()` method currently uses static mock data (marked with `TODO` for Phase 4.1). The `generate()` method delegates to `$game->generateTickets($count)` and is fully functional.

## Status

| Endpoint | Implementation Status | Notes |
|----------|----------------------|-------|
| GET `/api/games` | Implemented | Returns full game detail objects for all registered games (Badger Five, Super Cash, Megabucks) via `GamesController::list()` |
| GET `/api/games/{gameId}` | Implemented | Returns full game details and rules for the specified game ID via `GamesController::show()` |
| GET `/api/games/{gameId}/history` | Implemented (mock data) | Returns mock historical drawing data via `GamesController::history()`; supports `badger-five`, `supercash`, `megabucks`; live scraping planned for Phase 4.1 |
| POST `/api/games/{gameId}/generate` | Implemented | Accepts `{ "count": N }`, returns `{ "tickets": [[panel], ...] }` by delegating to `$game->generateTickets($count)` via `GamesController::generate()` |

## Authentication

No authentication or authorization is currently in place. All endpoints are public.
