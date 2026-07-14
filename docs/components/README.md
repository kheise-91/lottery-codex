# Components Index

The frontend is in a scaffolding phase. Only one component exists -- the `App` placeholder demo. No page components, layouts, reusable UI elements, or contexts have been implemented yet. The `services/` directory contains the API client layer and the `hooks/` directory contains the first custom hook.

## Service Layer

| Module | File | Status | Description |
|--------|------|--------|-------------|
| [API Service](./api.md) | `frontend/src/services/api.js` | Implemented | Fetch wrapper for all four backend API endpoints |

## Hook List

| Hook | File | Status | Description |
|------|------|--------|-------------|
| [useGameHistory](./useGameHistory.md) | `frontend/src/hooks/useGameHistory.js` | Implemented | Wraps `fetchHistory()` with loading, error handling, and result caching |

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Placeholder | Counter demo proving the frontend stack works |

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **Pages** -- Dashboard, Game Page, History browser
- **Contexts** -- Game context provider for shared game state
- **Hooks** -- `useGeneratePanels` (planned name)
- **Reusable UI components** -- Buttons, cards, tables, tabs

## Custom Hook: useGameHistory

See [useGameHistory](./useGameHistory.md) for full documentation. The hook accepts a `gameId` string, calls `fetchHistory(gameId)` from the API service, and returns `{ data, loading, error }`. It refetches when `gameId` changes and includes cleanup to prevent state updates after unmount.

## Entry Point

`frontend/src/main.jsx` renders `<App />` inside both React StrictMode and `BrowserRouter` from `react-router-dom`:

```jsx
<StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</StrictMode>
```

The entire application at every URL path currently renders a single view: the App component. Route definitions are not yet implemented.

## Styling

Tailwind CSS v4 is imported via `@tailwindcss/vite` plugin in `vite.config.js`. The only CSS file (`frontend/src/index.css`) contains a single line: `@import "tailwindcss";`. No Tailwind utility classes are used by any component yet.
