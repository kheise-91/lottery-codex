# API Reference

Slim Framework 4 REST API serving JSON endpoints. The API entry point (`backend/api.php`) exists as a bootstrap file with autoloader, error middleware, and JSON Content-Type middleware. **Routes are not yet defined** -- the routing layer and controllers do not exist. This document describes the planned endpoint contract based on `GameInterface` method signatures.

## Entry Point

All requests route through:

```
POST /api/games/{gameId}/generate
GET  /api/games
GET  /api/games/{gameId}
GET  /api/games/{gameId}/history
```

Nginx proxies all `/api/` paths to `backend/api.php` via PHP-FPM on TCP port 9000. Slim Framework parses the full URI path for routing.

## Endpoints

### GET `/api/games`

List available games.

**Response (200):**

```json
[
  { "id": "badger-five", "name": "Badger Five" },
  { "id": "super-cash", "name": "Super Cash" }
]
```

### GET `/api/games/{gameId}`

Get game details and rules. Returns the result of `GameInterface::getGameDetails()`.

**Path parameters:**

| Parameter | Type   | Example      |
|-----------|--------|--------------|
| `gameId`  | string | `badger-five`|

**Response (200):**

```json
{
  "name": "Badger Five",
  "range": [1, 31],
  "ballCount": 5,
  "drawDays": ["Daily"],
  "groups": {
    "lowOdd":   [1, 3, 5, 7, 9, 11, 13, 15],
    "lowEven":  [2, 4, 6, 8, 10, 12, 14, 16],
    "highOdd":  [17, 19, 21, 23, 25, 27, 29, 31],
    "highEven": [18, 20, 22, 24, 26, 28, 30]
  }
}
```

**Response (404):** Game ID not found.

### GET `/api/games/{gameId}/history`

Get historical drawing results via live scraping of wilottery.com. Returns an associative array keyed by date string, each entry containing `numbers` and `pattern`.

**Path parameters:**

| Parameter | Type   | Example      |
|-----------|--------|--------------|
| `gameId`  | string | `badger-five`|

**Response (200):**

```json
{
  "Tuesday, July 8th": {
    "numbers": [3, 12, 19, 24, 30],
    "pattern": "2-Odd 3-Even / 2-Low 3-High"
  },
  "Monday, July 7th": {
    "numbers": [1, 8, 15, 22, 29],
    "pattern": "2-Odd 3-Even / 3-Low 2-High"
  }
}
```

**Notes:**
- Each call performs a live HTTP request to wilottery.com. No caching is implemented.
- If the remote page fails to load, PHP warnings/notices will be produced (no error handling on `file_get_html` return value).

### POST `/api/games/{gameId}/generate`

Generate prediction panels using pattern-based selection.

**Path parameters:**

| Parameter | Type   | Example      |
|-----------|--------|--------------|
| `gameId`  | string | `badger-five`|

**Request body:**

```json
{
  "tickets": 3
}
```

| Field     | Type   | Description                    |
|-----------|--------|--------------------------------|
| `tickets` | int    | Number of tickets to generate (each ticket contains multiple panels) |

**Response (200):** Array of generated tickets. Each ticket is an array of panels:

```json
[
  [
    [3, 8, 15, 24, 30],
    [3, 9, 12, 22, 31],
    [5, 7, 14, 23, 29],
    [1, 6, 10, 19, 27],
    [3, 5, 11, 20, 28]
  ],
  [
    [1, 4, 13, 21, 30],
    ...
  ]
]
```

Each panel is a sorted integer array of length equal to the game's `ballCount`. Numbers are drawn from constrained category pools (lowOdd, lowEven, highOdd, highEven) according to sub-pattern definitions. Uniqueness enforcement scans all previously generated panels linearly -- O(n^2) in total panels.

**Response (400):** Invalid request body or missing `tickets` field.
**Response (404):** Game ID not found.

## Status

| Endpoint | Implementation Status | Notes |
|----------|----------------------|-------|
| GET `/api/games` | Not implemented | `backend/api.php` exists as bootstrap; routes not yet defined |
| GET `/api/games/{gameId}` | Not implemented | Same -- routing layer missing |
| GET `/api/games/{gameId}/history` | Not implemented | Game classes implement `getHistory()` but no route wired up |
| POST `/api/games/{gameId}/generate` | Not implemented | Game classes implement `generateTickets()` but no route wired up |

## Authentication

No authentication or authorization is currently in place. All endpoints are public.
