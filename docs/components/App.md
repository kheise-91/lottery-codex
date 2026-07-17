# App

**File:** `frontend/src/App.jsx`

## Purpose

Root routed component for the Lottery Codex application. Wraps all routes in the shared `Layout` shell and defines two route paths: the Dashboard game selection page (`/`) and a stub GamePage (`/games/:gameId`).

## Props

None. The component accepts no props.

## State

No internal state. All application state is managed by the `GameContext` provider (wrapping this component in `main.jsx`).

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions. Data fetching is delegated to child components via hooks (`useGames` on Dashboard).

## Routing

```jsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/games/:gameId" element={<GamePage />} />
  </Route>
</Routes>
```

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Dashboard` | Game selection landing page with responsive card grid |
| `/games/:gameId` | `GamePage` | Stub placeholder -- shows "coming soon" message |

## Children

None. The component manages its own route tree and does not accept children.

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `react-router-dom` (`BrowserRouter`, `Routes`, `Route`) | Client-side routing |
| `Layout` | App shell wrapping all routes |
| `Dashboard` | Home page component |
| `GamePage` | Game detail stub |

## Usage

App is rendered in the entry point (`frontend/src/main.jsx`) wrapped in React StrictMode, `GameProvider`, and `BrowserRouter`:

```jsx
<StrictMode>
  <GameProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GameProvider>
</StrictMode>
```

## Status

Implemented. All routes are wired and functional. GamePage is a stub pending Phase 2.8.
