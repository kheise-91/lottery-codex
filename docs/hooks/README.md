# Hooks Index

Custom React hooks that wrap the API service layer with state management, loading states, and error handling.

## Hook List

| Hook | File | Status | Description |
|------|------|--------|-------------|
| [useGames](./useGames.md) | `frontend/src/hooks/useGames.js` | Implemented | Wraps `fetchGames()` with loading, error handling, and mount-only fetch for the game list |
| [useGameHistory](./useGameHistory.md) | `frontend/src/hooks/useGameHistory.js` | Implemented | Wraps `fetchHistory(gameId)` with loading, error handling, and result caching by gameId |
| [useGenerateTickets](./useGenerateTickets.md) | `frontend/src/hooks/useGenerateTickets.js` | Implemented | Imperative hook for ticket generation; wraps `generateTickets(gameId)` with loading, error handling, and a `generate(count)` function |
