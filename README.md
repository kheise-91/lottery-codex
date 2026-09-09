# Lottery Codex

Web application that scrapes Wisconsin Lottery drawing history, analyzes odd/even and low/high distribution patterns (Lottery Codex methodology), and generates optimized number panels for Badger 5, SuperCash!, and Megabucks games.

## Development Process

This project is developed with OpenCode, an interactive CLI agent harness, using a structured, roadmap-driven workflow rather than ad-hoc feature development.

- `ROADMAP.md` (project root) is the single source of truth: phases → sub-phases, each with a "Done when" definition; in-progress and complete sub-phases link their title to the Gitea milestone.
- Work is tracked on a self-hosted Gitea instance: a milestone per sub-phase (`Phase X.Y`), issues as the unit of work (the issue body is the plan), and a pull request for every merge.
- Branch tiers: `master` ← `phase-X` ← `phase-X.Y` ← `task-NNN` / `bug-NNN` (NNN = the Gitea issue number). Merges are merge commits.
- The workflow is driven by custom OpenCode slash commands (`/brainstorm`, `/review-roadmap`, `/generate-mockups`, `/create-sub-phase`, `/complete-issue`, `/complete-sub-phase`, `/qa-review`) backed by specialized subagents (architect, explorer, engineer, reviewer, designer, docs, git) and their skills (playbooks).

For the details of each piece — the subagents, the slash commands, the skills, and the step-by-step workflow — see the project guides in the [Documentation](#documentation) section.

## Supported Games

| Game | Numbers | Range | Draw Days | Status |
|------|---------|-------|-----------|--------|
| **Badger 5** (`badger-5`) | 5 | 1-31 | Daily | Fully functional |
| **SuperCash!** (`supercash`) | 6 | 1-39 | Daily | Fully functional |
| **Megabucks** (`megabucks`) | 6 | 1-49 | Wed/Sat | Fully functional |

## Architecture

```
Frontend (React SPA) <--JSON--> Backend (Slim API) <--CURL--> wilottery.com (scraping)
     :5959                    Docker container                live HTTP request
```

- **Frontend** -- React 18 + Vite 5 + Tailwind CSS v4 + React Router DOM. Routed SPA with two routes: `/` (Dashboard game selection), `/games/:gameId` (GamePage detail page with split-view desktop layout and tabbed mobile interface). App shell (`Layout`) provides branded emerald gradient header with `<Outlet />`. State management via `GameContext` provider (useReducer for games, selectedGame, history, ticketResults). Custom hooks (`useGames`, `useGameHistory`, `useGenerateTickets`, `useMinLoading`) wrap the API service layer. Game cards rendered via `GameCard` component with SVG game logos, stat pills using CSS variable theming, and CTA buttons. Theme colors defined via Tailwind `@theme` in `frontend/src/index.css` (emerald primary, per-game accent colors).
- **Backend** -- PHP 8.2-FPM powered by Slim Framework 4 (PSR-4 autoloading via Composer), REST JSON endpoints in `backend/api.php` (thin routing table delegating to `GamesController`). Controller uses a `$registry` pattern mapping game IDs (`badger-5`, `supercash`, `megabucks`) to class names. Game logic classes implement `GameInterface`. HTML scraping via the PHP DOM extension (`DOMDocument` + `DOMXPath`) with shared scrapers in `backend/scrapers/`. History endpoint returns live scraped drawings from the game classes; generate endpoint calls real `GameInterface::generateTickets()`.
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

## Documentation

- [Project Agents Guide](docs/guides/project-agents.md) — the subagents and the role each plays in the workflow.
- [Project Commands Guide](docs/guides/project-commands.md) — the slash commands and how to use each.
- [Project Skills Guide](docs/guides/project-skills.md) — the playbooks (skills) each agent loads before its job.
- [Project Development Workflow Guide](docs/guides/development-workflow.md) — the end-to-end workflow, step by step, with a flowchart.

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
| `--color-badger-5` | `#ed1c24` | Badger 5 accent |
| `--color-badger-5-light` | `#fecdd3` | Badger 5 light background |
| `--color-supercash` | `#0081c6` | SuperCash accent |
| `--color-supercash-light` | `#bae6fd` | SuperCash light background |
| `--color-megabucks` | `#ff7200` | Megabucks accent |
| `--color-megabucks-light` | `#fed7aa` | Megabucks light background |

Custom CSS classes (`.card-shadow`, `.card-shadow-hover`, `.stat-pill`) use emerald HSL tones for shadows and green gradient backgrounds. Lottery ball classes (`.lotto-ball`, `.lotto-ball--white`, `.lotto-ball--white::after`) define the 3D white sphere appearance with radial gradients, inset shadows, and a specular highlight pseudo-element. Colored ball classes (`.lotto-ball--colored` and nine `.lotto-ball--sp-{gameId}-{index}` sub-pattern variants) provide color-coded balls for generated ticket displays, using game theme colors. The Layout header uses an inline SVG gradient with emerald stops (`#065f46` -> `#059669` -> `#34d399`).

## Technologies

- **Backend:** PHP 8.2-FPM, Slim Framework 4, Composer (PSR-4), nikic/fast-route, PHP DOM extension (`DOMDocument`/`DOMXPath`)
- **Frontend:** React 18, Vite 5, Tailwind CSS v4, React Router DOM, Headless UI, Heroicons, SVG game logos
- **Infrastructure:** Docker, Nginx, PHP-FPM (single container)

## References

- [Wisconsin Lottery](https://wilottery.com) -- Source of drawing data
- [Lottery Codex](https://lotterycodex.com) -- Pattern analysis methodology

## License

MIT
