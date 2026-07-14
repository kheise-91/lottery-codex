# Services Index

The frontend service layer is a pure JavaScript fetch wrapper module that exports named functions for all backend API endpoints. This is the sole data-fetching layer in the frontend -- hooks and components consume these functions rather than calling `fetch()` directly.

## Service List

| Module | File | Status | Description |
|--------|------|--------|-------------|
| [API Service](./api.md) | `frontend/src/services/api.js` | Implemented | Fetch wrapper for all four backend API endpoints |

## Design Decisions

- **No `try/catch` wrapping** -- Callers (hooks, components) catch and handle errors with their own UI logic.
- **No response shape transformation** -- Each function returns raw JSON as-is from `res.json()`.
- **No client-side validation** -- The backend returns 400 for invalid values.

## Environment Configuration

The base URL is configured via the `VITE_API_BASE_URL` environment variable, exposed by Vite through `import.meta.env.VITE_API_BASE_URL`. A fallback of `/api` is used if the variable is unset.
