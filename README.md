# Lottery Codex

Web application that scrapes Wisconsin Lottery drawing history, analyzes odd/even and low/high distribution patterns (Lottery Codex methodology), and generates optimized number panels for Badger Five and Super Cash games.

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

## Architecture

```
Frontend (React SPA) <--JSON--> Backend (Slim API) <--CURL--> wilottery.com (scraping)
     :5959                    Docker container                live HTTP request
```

- **Frontend** -- React 18 + Vite 5 + Tailwind CSS v4 + React Router DOM. Served as a PWA with manifest and service worker skeleton. Currently in scaffolding phase: only the `App` placeholder component exists (counter demo). API integration layer exists at `frontend/src/services/api.js` providing fetch wrappers for all four backend endpoints. No routes or pages defined yet.
- **Backend** -- PHP 8.2-FPM powered by Slim Framework 4 (PSR-4 autoloading via Composer), REST JSON endpoints in `backend/api.php` (thin routing table delegating to `GamesController`). Controller uses a `$registry` pattern mapping game IDs to class names. Game logic classes implement `GameInterface`. HTML scraping via vendored simplehtmldom library. History endpoint currently returns static mock data; generate endpoint calls real `GameInterface::generateTickets()`.
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
│   │   └── SuperCash.php           # Fully functional -- pattern analysis and panel generation
│   ├── simplehtmldom/              # HTML parser library (vendored, not via Composer)
│   ├── composer.json               # PHP dependencies: slim/slim ^4.0, slim/psr7 ^1.0
│   └── vendor/                     # Composer-installed dependencies (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── main.jsx                # React 18 createRoot entry point
│   │   ├── App.jsx                 # Placeholder counter demo component
│   │   ├── index.css               # Tailwind v4 import: @import "tailwindcss"
│   │   ├── hooks/
│   │   │   ├── useGameHistory.js   # Custom hook wrapping fetchHistory with loading/error/caching
│   │   │   └── useGenerateTickets.js  # Custom hook wrapping generateTickets with loading/error/state
│   │   └── services/
│   │       └── api.js              # Fetch wrapper for all backend API endpoints
│   ├── public/                     # Static assets and PWA manifest
│   ├── vite.config.js              # Vite config with API proxy to backend
│   └── package.json                # Node.js dependencies
├── docker/                         # Dockerfile, nginx.conf
├── docker-compose.yml              # Container orchestration (single service)
├── docs/                           # Project documentation
└── README.md                       # This file
```

## Documentation

- [API Reference](docs/api/README.md) -- REST endpoints, request/response shapes, status codes. All four endpoints are implemented.
- [Components](docs/components/README.md) -- Frontend UI component index. Currently includes the `App` placeholder demo.
  - [App Component Detail](docs/components/App.md) -- Placeholder counter demo component
- [Hooks](docs/hooks/README.md) -- Custom React hooks wrapping the API service layer with state management.
  - [useGameHistory Hook Detail](docs/hooks/useGameHistory.md) -- Custom hook wrapping `fetchHistory()` with loading, error handling, and result caching
  - [useGenerateTickets Hook Detail](docs/hooks/useGenerateTickets.md) -- Custom hook wrapping `generateTickets()` with loading, error handling, and ticket state
- [Services](docs/services/README.md) -- Frontend API service layer. Fetch wrapper module for all backend endpoints.
  - [API Service Detail](docs/services/api.md) -- Fetch wrapper module for all backend endpoints
- [Infrastructure](docs/infrastructure/README.md) -- Docker configuration, Nginx setup, volume mounts, environment variables.
  - [Docker Configuration](docs/infrastructure/docker.md)
  - [Nginx Configuration](docs/infrastructure/nginx.md)

## Pattern System (Lottery Codex Methodology)

The core algorithm classifies numbers into four pools and generates panels matching target odd/even and low/high distributions:

| Pool | Badger Five (1-31) | Super Cash (1-39) |
|------|---------------------|--------------------|
| **Low-Odd** | 1, 3, 5, 7, 9, 11, 13, 15 | 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 |
| **Low-Even** | 2, 4, 6, 8, 10, 12, 14, 16 | 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 |
| **High-Odd** | 17, 19, 21, 23, 25, 27, 29, 31 | 21, 23, 25, 27, 29, 31, 33, 35, 37, 39 |
| **High-Even** | 18, 20, 22, 24, 26, 28, 30 | 22, 24, 26, 28, 30, 32, 34, 36, 38 |

Each sub-pattern specifies which pool each ball position draws from. The final panel is sorted ascending (required for lottery tickets). Uniqueness enforcement uses a linear scan across all previously generated panels -- O(n^2) in total panels.

## Technologies

- **Backend:** PHP 8.2-FPM, Slim Framework 4, Composer (PSR-4), nikic/fast-route, simplehtmldom
- **Frontend:** React 18, Vite 5, Tailwind CSS v4, React Router DOM, Headless UI, Heroicons
- **Infrastructure:** Docker, Nginx, PHP-FPM (single container)

## References

- [Wisconsin Lottery](https://wilottery.com) -- Source of drawing data
- [Lottery Codex](https://lotterycodex.com) -- Pattern analysis methodology

## License

MIT
