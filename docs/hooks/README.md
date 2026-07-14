# Hooks Index

Custom React hooks that wrap the API service layer with state management, loading states, and error handling.

## Hook List

| Hook | File | Status | Description |
|------|------|--------|-------------|
| [useGameHistory](./useGameHistory.md) | `frontend/src/hooks/useGameHistory.js` | Implemented | Wraps `fetchHistory()` with loading, error handling, and result caching by gameId |
| [useGenerateTickets](./useGenerateTickets.md) | `frontend/src/hooks/useGenerateTickets.js` | Implemented | Wraps `generateTickets()` with loading, error handling, and imperative ticket generation |
