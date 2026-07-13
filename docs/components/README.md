# Components Index

The frontend is in a scaffolding phase. Only one component exists -- the `App` placeholder demo. No page components, layouts, reusable UI elements, contexts, or custom hooks have been implemented yet. The `services/` directory now exists and contains the API client layer. The `components/` and `hooks/` directories do not exist on disk yet.

## Service Layer

| Module | File | Status | Description |
|--------|------|--------|-------------|
| [API Service](./api.md) | `frontend/src/services/api.js` | Implemented | Fetch wrapper for all four backend API endpoints |

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Placeholder | Counter demo proving the frontend stack works |

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **Pages** -- Dashboard, Game Page, History browser
- **Contexts** -- Game context provider for shared game state
- **Hooks** -- `useGameHistory`, `useGeneratePanels` (planned names)
- **Reusable UI components** -- Buttons, cards, tables, tabs

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
