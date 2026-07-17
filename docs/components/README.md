# Components Index

The frontend is in a scaffolding phase. The `App` placeholder demo, the foundational `Layout` shell component, and the first page component (Dashboard) exist on disk. Reusable UI components have begun to emerge from page implementations.

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Placeholder | Counter demo proving the frontend stack works |
| [Layout](./Layout.md) | `frontend/src/components/layout/Layout.jsx` | Implemented | Branded layout shell with gradient header and `<Outlet />` for nested routes (not yet wired into routing) |
| [Dashboard](./Dashboard.md) | `frontend/src/pages/Dashboard.jsx` | Implemented | Game selection landing page with responsive card grid |
| [GameCard](./GameCard.md) | `frontend/src/components/games/GameCard.jsx` | Implemented | Reusable game selection card with gradient image, status badge, stat pills, and CTA |

## Contexts

Contexts live in a separate documentation directory:

- [GameContext](../contexts/GameContext.md) -- Central `useReducer`-based state for game selection, history data, and ticket results

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **Pages** -- Game Page, History browser
- **Reusable UI components** -- Buttons, tables, tabs

Layout exists and is ready to wrap these pages once routing is configured.

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

The entire application at every URL path currently renders a single view: the App component. Route definitions are not yet implemented.

## Styling

Tailwind CSS v4 is imported via the `@tailwindcss/vite` plugin in `vite.config.js`. Custom CSS classes added to `frontend/src/index.css`:

| Class | Purpose |
|-------|---------|
| `.card-shadow` | Default box shadow for GameCard |
| `.card-shadow-hover` | Elevated box shadow on GameCard hover |
| `.stat-pill` | Gradient background and border for stat pills inside GameCard |
