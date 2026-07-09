# Components Index

The frontend is in a scaffolding phase. Only one component exists -- the `App` placeholder demo. No page components, layouts, reusable UI elements, contexts, or custom hooks have been implemented yet. Planned directories (`components/`, `hooks/`, `services/`) do not exist on disk.

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Placeholder | Counter demo proving the frontend stack works |

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **Pages** -- Dashboard, Game Page, History browser
- **Contexts** -- Game context provider for shared game state
- **Hooks** -- `useGameHistory`, `useGeneratePanels` (planned names)
- **Services** -- API client layer wrapping fetch calls to the backend
- **Reusable UI components** -- Buttons, cards, tables, tabs

## Entry Point

`frontend/src/main.jsx` renders `<App />` inside React StrictMode. No router is installed (`react-router-dom` is not in `package.json`). The entire application at every URL path renders a single view: the App component.
