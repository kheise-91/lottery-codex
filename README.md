# Lottery Codex

Web application that scrapes Wisconsin Lottery drawing history, analyzes odd/even and low/high distribution patterns (Lottery Codex methodology), and generates optimized number panels for Badger 5, SuperCash!, and Megabucks games.

## Development Process

This project is developed using a structured, milestone-driven workflow inspired by professional software engineering practices rather than ad-hoc feature development.

Development includes:
- Phase-based roadmap planning
- Kanban project tracking
- Milestone-driven delivery
- Issue-based implementation
- Branch-per-task workflows
- Pull request reviews and QA validation
- AI-assisted development workflows and automation

Project planning, Kanban boards, milestones, and issue tracking are managed on a self-hosted Gitea instance, while this GitHub repository serves as a public mirror of the source code and commit history.

For additional details on the development lifecycle and workflow used for this project, see:

**[Development Workflow Guide](docs/guides/development-workflow.md)**

## Supported Games

| Game | Numbers | Range | Draw Days | Status |
|------|---------|-------|-----------|--------|
| **Badger 5** (`badger-five`) | 5 | 1-31 | Daily | Fully functional |
| **SuperCash!** (`supercash`) | 6 | 1-39 | Daily | Fully functional |
| **Megabucks** (`megabucks`) | 6 | 1-49 | Wed/Sat | Fully functional |

## Architecture

```
Frontend (React SPA) <--JSON--> Backend (Slim API) <--CURL--> wilottery.com (scraping)
     :5959                    Docker container                live HTTP request
```

- **Frontend** -- React 18 + Vite 5 + Tailwind CSS v4 + React Router DOM. Routed SPA with two routes: `/` (Dashboard game selection), `/games/:gameId` (GamePage stub). App shell (`Layout`) provides branded emerald gradient header with `<Outlet />`. State management via `GameContext` provider (useReducer for games, selectedGame, history, ticketResults). Custom hooks (`useGames`) wrap the API service layer. Game cards rendered via `GameCard` component with SVG game logos, stat pills using CSS variable theming, and CTA buttons. Theme colors defined via Tailwind `@theme` in `frontend/src/index.css` (emerald primary, per-game accent colors).
- **Backend** -- PHP 8.2-FPM powered by Slim Framework 4 (PSR-4 autoloading via Composer), REST JSON endpoints in `backend/api.php` (thin routing table delegating to `GamesController`). Controller uses a `$registry` pattern mapping game IDs (`badger-five`, `supercash`, `megabucks`) to class names. Game logic classes implement `GameInterface`. HTML scraping via vendored simplehtmldom library. History endpoint currently returns static mock data; generate endpoint calls real `GameInterface::generateTickets()`.
- **Infrastructure** -- Single Docker container running Nginx + PHP-FPM on port 80. No database, no caching layer. Host port 5959 maps to container port 80.

## Quick Start

### Prerequisites

- Docker and Docker Compose

### With Docker (primary workflow)

```bash
docker compose up --build    # Start at http://localhost:5959
docker compose down          # Stop containers
```

### Local Development (iterative frontend)

```bash
cd frontend
npm install                  # Install dependencies
npm run dev                  # Vite dev server on port 5173, proxies /api to backend
npm run build                # Production build to dist/
```

The Vite dev server proxies `/api/*` requests to `http://192.168.0.91:5959`. Update `frontend/vite.config.js` if the backend host changes. Backend changes are reflected immediately via Docker volume mount; frontend changes require `docker compose up --build` since `frontend/dist/` is baked into the image.

## Project Structure

```
├── backend/
│   ├── controllers/                # Controller classes (GamesController with registry pattern)
│   │   └── GamesController.php     # Central layer for all game endpoint logic
│   ├── games/                      # Game logic classes (implements GameInterface)
│   │   ├── GameInterface.php       # Contract: getGameDetails(), getHistory(), generateTickets()
│   │   ├── BadgerFive.php          # Fully functional -- scraping + panel generation working
│   │   ├── SuperCash.php           # Fully functional -- pattern analysis and panel generation
│   │   └── Megabucks.php           # Implemented -- follows existing game class pattern
│   ├── simplehtmldom/              # HTML parser library (vendored, not via Composer)
│   ├── composer.json               # PHP dependencies: slim/slim ^4.0, slim/psr7 ^1.0
│   └── vendor/                     # Composer-installed dependencies (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── main.jsx                # React 18 createRoot entry point (wraps App in GameProvider + BrowserRouter)
│   │   ├── App.jsx                 # Root routed component: Layout shell with Dashboard and GamePage routes
│   │   ├── index.css               # Tailwind v4 import; @theme directive with game-themed CSS variables; custom .card-shadow, .stat-pill, .lotto-ball, .lotto-ball--white, .lotto-ball--colored, and sub-pattern color classes
│   │   ├── components/
│   │   │   ├── games/
│   │   │   │   ├── Ball.jsx        # Foundational UI primitive: 48px 3D sphere with white and colored sub-pattern variants
│   │   │   │   └── GameCard.jsx    # Clickable game selection card with image, stats, CTA
│   │   │   └── layout/
│   │   │       └── Layout.jsx      # Branded layout shell with gradient header and Outlet for nested routes
│   │   ├── contexts/
│   │   │   └── GameContext.jsx     # useReducer-based state: games, selectedGame, history, ticketResults
│   │   ├── hooks/
│   │   │   └── useGames.js         # Custom hook wrapping fetchGames with loading/error/data states
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Game selection landing page with responsive card grid
│   │   │   └── GamePage.jsx        # Stub placeholder for game detail view
│   │   └── services/
│   │       └── api.js              # Fetch wrapper for all backend API endpoints
│   ├── public/                     # Static assets: SVG game logos (.env.example, vite.config.js)
│   ├── .env.example                # VITE_BACKEND_PROXY_URL for Vite dev server proxy target
│   ├── vite.config.js              # Vite config with configurable API proxy (env var)
│   └── package.json                # Node.js dependencies
├── docker/                         # Dockerfile, nginx.conf
├── docker-compose.yml              # Container orchestration (single service)
├── docs/                           # Project documentation
└── README.md                       # This file
```

## Documentation

- [API Reference](docs/api/README.md) -- REST endpoints, request/response shapes, status codes. All four endpoints are implemented for three games (Badger 5, SuperCash!, Megabucks).
- [Components](docs/components/README.md) -- Frontend UI component index. Includes the routed `App`, `Layout` shell, `Dashboard` page, `GameCard` component, and foundational `Ball` primitive. See [Styling](#styling) for theme color details.
  - [App Component Detail](docs/components/App.md) -- Root routed component with Layout shell, Dashboard, and GamePage routes
  - [Layout Component Detail](docs/components/Layout.md) -- Branded layout shell with emerald SVG gradient header and nested route support via `<Outlet />`
  - [Dashboard Component Detail](docs/components/Dashboard.md) -- Game selection landing page with responsive card grid
  - [GameCard Component Detail](docs/components/GameCard.md) -- Clickable game card with generic gradient header, status badge, CSS variable-themed stat pills, and CTA button
  - [Ball Component Detail](docs/components/Ball.md) -- Foundational UI primitive: renders a single lottery number as a 48px 3D sphere with white (default) and colored sub-pattern variants
- [Contexts](docs/contexts/README.md) -- React Context providers for shared application state.
  - [GameContext Detail](docs/contexts/GameContext.md) -- Central `useReducer`-based state for game selection, history, and ticket results; auto-fetches games list on mount
- [Hooks](docs/hooks/README.md) -- Custom React hooks wrapping the API service layer with state management.
  - [useGames Hook Detail](docs/hooks/useGames.md) -- Custom hook wrapping `fetchGames()` with loading, error handling, and data states
- [Services](docs/services/README.md) -- Frontend API service layer. Fetch wrapper module for all backend endpoints.
  - [API Service Detail](docs/services/api.md) -- Fetch wrapper module for all backend endpoints
- [Infrastructure](docs/infrastructure/README.md) -- Docker configuration, Nginx setup, volume mounts, environment variables.
  - [Docker Configuration](docs/infrastructure/docker.md)
  - [Nginx Configuration](docs/infrastructure/nginx.md)

## Pattern System (Lottery Codex Methodology)

The core algorithm classifies numbers into four pools and generates panels matching target odd/even and low/high distributions:

| Pool | Badger 5 (1-31) | SuperCash! (1-39) | Megabucks (1-49) |
|------|---------------------|--------------------|-------------------|
| **Low-Odd** | 1, 3, 5, 7, 9, 11, 13, 15 | 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 | 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25 |
| **Low-Even** | 2, 4, 6, 8, 10, 12, 14, 16 | 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 | 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24 |
| **High-Odd** | 17, 19, 21, 23, 25, 27, 29, 31 | 21, 23, 25, 27, 29, 31, 33, 35, 37, 39 | 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49 |
| **High-Even** | 18, 20, 22, 24, 26, 28, 30 | 22, 24, 26, 28, 30, 32, 34, 36, 38 | 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48 |

Each sub-pattern specifies which pool each ball position draws from. The final panel is sorted ascending (required for lottery tickets). Uniqueness enforcement uses a linear scan across all previously generated panels -- O(n^2) in total panels.

## Styling

The frontend uses Tailwind CSS v4 with a `@theme` directive in `frontend/src/index.css` defining game-themed CSS custom properties:

| Variable | Value | Purpose |
|----------|-------|---------|
| `--color-primary` | `#059669` (emerald green) | Primary brand color |
| `--color-badger-five` | `#ed1c24` | Badger 5 accent |
| `--color-badger-five-light` | `#fecdd3` | Badger 5 light background |
| `--color-supercash` | `#0081c6` | SuperCash accent |
| `--color-supercash-light` | `#bae6fd` | SuperCash light background |
| `--color-megabucks` | `#ff7200` | Megabucks accent |
| `--color-megabucks-light` | `#fed7aa` | Megabucks light background |

Custom CSS classes (`.card-shadow`, `.card-shadow-hover`, `.stat-pill`) use emerald HSL tones for shadows and green gradient backgrounds. Lottery ball classes (`.lotto-ball`, `.lotto-ball--white`, `.lotto-ball--white::after`) define the 3D white sphere appearance with radial gradients, inset shadows, and a specular highlight pseudo-element. Colored ball classes (`.lotto-ball--colored` and nine `.lotto-ball--sp-{gameId}-{index}` sub-pattern variants) provide color-coded balls for generated ticket displays, using game theme colors. The Layout header uses an inline SVG gradient with emerald stops (`#065f46` -> `#059669` -> `#34d399`).

## Technologies

- **Backend:** PHP 8.2-FPM, Slim Framework 4, Composer (PSR-4), nikic/fast-route, simplehtmldom
- **Frontend:** React 18, Vite 5, Tailwind CSS v4, React Router DOM, Headless UI, Heroicons, SVG game logos
- **Infrastructure:** Docker, Nginx, PHP-FPM (single container)

## References

- [Wisconsin Lottery](https://wilottery.com) -- Source of drawing data
- [Lottery Codex](https://lotterycodex.com) -- Pattern analysis methodology

## License

MIT
