# Components Index

The frontend is a routed SPA with a Layout shell, Dashboard game selection page, GameCard reusable component, and a stub GamePage. The `GameContext` provider and `useGames` hook form the data layer.

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Implemented | Root routed component with Layout shell, Dashboard, and GamePage routes |
| [Layout](./Layout.md) | `frontend/src/components/layout/Layout.jsx` | Implemented | Branded layout shell with gradient header and `<Outlet />` for nested routes |
| [Dashboard](./Dashboard.md) | `frontend/src/pages/Dashboard.jsx` | Implemented | Game selection landing page with responsive card grid |
| [GameCard](./GameCard.md) | `frontend/src/components/games/GameCard.jsx` | Implemented | Reusable game selection card with gradient image, status badge, stat pills, and CTA |

## Contexts

Contexts live in a separate documentation directory:

- [GameContext](../contexts/GameContext.md) -- Central `useReducer`-based state for game selection, history data, and ticket results

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **GamePage** -- Full split-view game detail page with history, pattern distribution, and panel generation (Phase 2.8)
- **Reusable UI components** -- Ball, DrawingCard, PanelDisplay, PatternDistribution, Tabs

## Entry Point

`frontend/src/main.jsx` renders `<App />` inside React StrictMode, `GameProvider`, and `BrowserRouter`:

```jsx
<StrictMode>
  <GameProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GameProvider>
</StrictMode>
```

The `GameProvider` wraps the router so all routes share state. The app has two active routes defined in `App.jsx`: `/` (Dashboard) and `/games/:gameId` (GamePage stub).

## Styling

Tailwind CSS v4 is imported via the `@tailwindcss/vite` plugin in `vite.config.js`. Custom CSS classes added to `frontend/src/index.css`:

| Class | Purpose |
|-------|---------|
| `.card-shadow` | Default box shadow for GameCard |
| `.card-shadow-hover` | Elevated box shadow on GameCard hover |
| `.stat-pill` | Gradient background and border for stat pills inside GameCard |
