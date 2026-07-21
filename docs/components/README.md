# Components Index

The frontend is a routed SPA with a Layout shell, Dashboard game selection page, GameCard reusable component, and a stub GamePage. The `GameContext` provider and `useGames` hook form the data layer.

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Implemented | Root routed component with Layout shell, Dashboard, and GamePage routes |
| [Layout](./Layout.md) | `frontend/src/components/layout/Layout.jsx` | Implemented | Branded layout shell with gradient header and `<Outlet />` for nested routes |
| [Dashboard](./Dashboard.md) | `frontend/src/pages/Dashboard.jsx` | Implemented | Game selection landing page with responsive card grid |
| [GameCard](./GameCard.md) | `frontend/src/components/games/GameCard.jsx` | Implemented | Reusable game selection card with gradient image, status badge, stat pills, and CTA |
| [Ball](./Ball.md) | `frontend/src/components/games/Ball.jsx` | Implemented | Foundational UI primitive: renders a single lottery number as a 48px white 3D sphere |

## Contexts

Contexts live in a separate documentation directory:

- [GameContext](../contexts/GameContext.md) -- Central `useReducer`-based state for game selection, history data, and ticket results

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **Full GamePage** -- Currently a stub at `/games/:gameId`; Phase 2.8 will replace it with a split-view game detail page featuring history, pattern distribution visualization, and panel generation
- **Reusable UI components** -- DrawingCard, PanelDisplay, PatternDistribution, Tabs

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
| `.card-shadow` | Default box shadow for GameCard (emerald HSL tones) |
| `.card-shadow-hover` | Elevated box shadow on GameCard hover (emerald HSL tones) |
| `.stat-pill` | Green gradient background and border for stat pills inside GameCard |
| `.lotto-ball` | Base styling for lottery number balls: 48px circle, centered text, `position: relative` |
| `.lotto-ball--white` | White sphere variant with radial gradient, inset shadows, and external drop shadow |
| `.lotto-ball--white::after` | Specular highlight pseudo-element (glossy reflection at top-left) |

### Theme Colors

The application uses Tailwind `@theme` CSS custom properties in `frontend/src/index.css` for a game-themed color palette:

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#059669` (emerald green) | Primary brand color |
| `--color-badger-five` | `#ed1c24` | Badger Five accent |
| `--color-badger-five-light` | `#fecdd3` | Badger Five light background |
| `--color-supercash` | `#0081c6` | SuperCash accent |
| `--color-supercash-light` | `#bae6fd` | SuperCash light background |
| `--color-megabucks` | `#ff7200` | Megabucks accent |
| `--color-megabucks-light` | `#fed7aa` | Megabucks light background |

GameCard uses these variables (`var(--color-${gameId})` and `var(--color-${gameId}-light)`) to apply game-specific colors to stat pills and the Play Now button.
