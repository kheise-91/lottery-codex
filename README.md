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
| **Badger Five** | 5 | 1-31 | Daily | Fully functional |
| **Super Cash** | 6 | 1-39 | Daily | Partially broken (`generateTickets` returns empty array; scrapes wrong URL) |

## Architecture

```
Frontend (React SPA) <--JSON--> Backend (Slim API) <--CURL--> wilottery.com (scraping)
     :5959                    Docker container                live HTTP request
```

- **Frontend** -- React 18 + Vite + Tailwind CSS v4. Served as a PWA with manifest and service worker skeleton. Currently in scaffolding phase: only the `App` placeholder component exists (counter demo). No routing, pages, or API integration implemented yet.
- **Backend** -- PHP 8.2-FPM powered by Slim Framework 4 (PSR-4 autoloading via Composer), REST JSON endpoints implemented in `backend/api.php` (`GET /api/games`, `GET /api/games/{gameId}`, `GET /api/games/{gameId}/history`, `POST /api/games/{gameId}/generate`). Game logic classes implement `GameInterface`. HTML scraping via vendored simplehtmldom library.
- **Infrastructure** -- Single Docker container running Nginx + PHP-FPM. No database, no caching layer.

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

The Vite dev server proxies `/api` requests to `http://192.168.0.91:5959`. Update `vite.config.js` if the backend host changes.

## Project Structure

```
├── backend/
│   ├── games/                      # Game logic classes (implements GameInterface)
│   │   ├── GameInterface.php       # Contract: getGameDetails(), getHistory(), generateTickets()
│   │   ├── BadgerFive.php          # Fully functional -- scraping + panel generation working
│   │   └── SuperCash.php           # Partially broken -- see status table above
│   ├── simplehtmldom/              # HTML parser library (vendored, not via Composer)
│   ├── composer.json               # PHP dependencies: slim/slim ^4.0, slim/psr7 ^1.6
│   └── vendor/                     # Composer-installed dependencies (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── main.jsx                # React 18 createRoot entry point
│   │   ├── App.jsx                 # Placeholder counter demo component
│   │   └── index.css               # Tailwind v4 import: @import "tailwindcss"
│   ├── public/                     # Static assets and PWA manifest
│   ├── vite.config.js              # Vite config with API proxy to backend
│   └── package.json                # Node.js dependencies
├── docker/                         # Dockerfile, nginx.conf
├── docker-compose.yml              # Container orchestration (single service)
└── docs/                           # Project documentation
```

## Documentation

- [API Reference](docs/api/README.md) -- REST endpoints and request/response shapes. All four endpoints are implemented.
- [Components](docs/components/README.md) -- Frontend component index and hierarchy. Currently only the `App` placeholder exists.
  - [App Component Detail](docs/components/App.md)
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
- **Frontend:** React 18, Vite 5, Tailwind CSS v4
- **Infrastructure:** Docker, Nginx

## References

- [Wisconsin Lottery](https://wilottery.com) -- Source of drawing data
- [Lottery Codex](https://lotterycodex.com) -- Pattern analysis methodology

## License

MIT
