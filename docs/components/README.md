# Components Index

The frontend is in a scaffolding phase. The `App` placeholder demo, the foundational `Layout` shell component, and the `GameContext` provider exist on disk. No page components or reusable UI elements have been implemented yet.

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Placeholder | Counter demo proving the frontend stack works |
| [Layout](./Layout.md) | `frontend/src/components/layout/Layout.jsx` | Implemented | Branded layout shell with gradient header and `<Outlet />` for nested routes (not yet wired into routing) |

## Contexts

Contexts live in a separate documentation directory:

- [GameContext](../contexts/GameContext.md) -- Central `useReducer`-based state for game selection, history data, and ticket results

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **Pages** -- Dashboard, Game Page, History browser
- **Reusable UI components** -- Buttons, cards, tables, tabs

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

Tailwind CSS v4 is imported via the `@tailwindcss/vite` plugin in `vite.config.js`. The only CSS file (`frontend/src/index.css`) contains a single line: `@import "tailwindcss";`. Tailwind utility classes are used by the Layout component for its gradient header, responsive layout, and decorative elements.
