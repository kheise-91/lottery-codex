# Hooks Index

Custom React hooks that wrap the API service layer with state management, loading states, and error handling.

## Hook List

| Hook | File | Status | Description |
|------|------|--------|-------------|
| [useGames](./useGames.md) | `frontend/src/hooks/useGames.js` | Implemented | Wraps `fetchGames()` with loading, error handling, and mount-only fetch for the game list |

## Planned (Not Yet Implemented)

The following hooks are documented in the migration roadmap but do not exist on disk:

- **useGameHistory** -- Wraps `fetchHistory(gameId)` with loading, error handling, and result caching by gameId
- **useGenerateTickets** -- Wraps `generateTickets(gameId)` with loading, error handling, and imperative ticket generation
