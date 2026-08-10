# Components Index

The frontend is a routed SPA with a Layout shell, Dashboard game selection page, GameCard reusable component, and a full-featured GamePage. The `GameContext` provider and custom hooks (`useGames`, `useGameHistory`, `useGenerateTickets`) form the data layer.

## Component List

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| [App](./App.md) | `frontend/src/App.jsx` | Implemented | Root routed component with Layout shell, Dashboard, and GamePage routes |
| [Layout](./Layout.md) | `frontend/src/components/layout/Layout.jsx` | Implemented | Branded layout shell with gradient header and `<Outlet />` for nested routes |
| [Dashboard](./Dashboard.md) | `frontend/src/pages/Dashboard.jsx` | Implemented | Game selection landing page with responsive card grid |
| [GameCard](./GameCard.md) | `frontend/src/components/games/GameCard.jsx` | Implemented | Reusable game selection card with gradient image, status badge, CSS variable-themed stat pills, and CTA |
| [Ball](./Ball.md) | `frontend/src/components/games/Ball.jsx` | Implemented | Foundational UI primitive: renders a single lottery number as a 48px 3D sphere with white (default) and colored variants |
| [DrawingItem](./DrawingItem.md) | `frontend/src/components/games/DrawingItem.jsx` | Implemented | Renders a single historical lottery drawing as a flat list item with centered pattern badge, date header, and centered ball row |
| [TicketCard](./TicketCard.md) | `frontend/src/components/games/TicketCard.jsx` | Implemented | Physical-ticket-style card component for rendering a single generated lottery ticket with panels, barcode, and decorative elements |
| [TicketCarousel](./TicketCarousel.md) | `frontend/src/components/games/TicketCarousel.jsx` | Implemented | Horizontal carousel for browsing multiple generated tickets with left/right arrows, dot indicators, and keyboard navigation |
| [GamePage](./GamePage.md) | `frontend/src/pages/GamePage.jsx` | Implemented | Game detail page with desktop split-view (7/5 grid) and mobile tabbed layout; shows game metadata, historical drawings, and generated tickets |
| [BottomNavTabs](./BottomNavTabs.md) | `frontend/src/components/layout/BottomNavTabs.jsx` | Implemented | Sticky bottom navigation bar with two tabs ("Drawings" and "Tickets"); visible on mobile (<768px), hidden on desktop (≥768px), uses @headlessui/react Tab components |

## Contexts

Contexts live in a separate documentation directory:

- [GameContext](../contexts/GameContext.md) -- Central `useReducer`-based state for game selection, history data, and ticket results

## Planned (Not Yet Implemented)

The following are documented in the migration roadmap but do not exist on disk:

- **Reusable UI components** -- PatternDistribution visualization component

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

The `GameProvider` wraps the router so all routes share state. The app has two active routes defined in `App.jsx`: `/` (Dashboard) and `/games/:gameId` (GamePage detail page).

## Styling

Tailwind CSS v4 is imported via the `@tailwindcss/vite` plugin in `vite.config.js`. Custom CSS classes added to `frontend/src/index.css`:

| Class | Purpose |
|-------|---------|
| `.card-shadow` | Default box shadow for GameCard (emerald HSL tones) |
| `.ticket-card` | Box shadow applied to single-ticket `<article>` elements inside TicketCard (shares same HSL tones as `.card-shadow`) |
| `.card-shadow-hover` | Elevated box shadow on GameCard hover (emerald HSL tones) |
| `.stat-pill` | Green gradient background and border for stat pills inside GameCard |
| `.lotto-ball` | Base styling for lottery number balls: 48px circle, centered text, `position: relative` |
| `.lotto-ball--white` | White sphere variant with radial gradient, inset shadows, and external drop shadow |
| `.lotto-ball--white::after` | Specular highlight pseudo-element (glossy reflection at top-left) |
| `.lotto-ball--colored` | Colored base variant for game-colored balls: solid border, white text, text shadow |
| `.lotto-ball--sp-{gameId}` | Game theme color classes (3 total: one per game for badger-five, supercash, megabucks) |
| `.live-dot` | Animated pulsing red dot used by DrawingItem "Latest" badge (8px circle, `pulse-dot` keyframe animation) |

### Theme Colors

The application uses Tailwind `@theme` CSS custom properties in `frontend/src/index.css` for a game-themed color palette:

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#059669` (emerald green) | Primary brand color |
| `--color-badger-five` | `#ed1c24` | Badger Five accent |
| `--color-badger-five-light` | `#fecdd3` | Badger Five light background |
| `--color-badger-five-lightest` | `#fecdd3` | Badger Five lightest (ball gradient highlight) |
| `--color-supercash` | `#0081c6` | SuperCash accent |
| `--color-supercash-light` | `#bae6fd` | SuperCash light background |
| `--color-supercash-lightest` | `#bae6fd` | SuperCash lightest (ball gradient highlight) |
| `--color-megabucks` | `#ff7200` | Megabucks accent |
| `--color-megabucks-light` | `#fed7aa` | Megabucks light background |
| `--color-megabucks-lightest` | `#fed7aa` | Megabucks lightest (ball gradient highlight) |

GameCard uses these variables (`var(--color-${gameId})` and `var(--color-${gameId}-light)`) to apply game-specific colors to stat pills and the Play Now button.
