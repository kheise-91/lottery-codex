# AGENTS.md

## Lottery Codex

Web application that scrapes Wisconsin Lottery drawing history, analyzes odd/even and low/high distribution patterns (Lottery Codex methodology), and generates optimized number panels for Badger Five and Super Cash games.

**Stack:** React 18 SPA + PHP 8.2-FPM backend (Slim Framework 4) · Docker single-container deployment · No database

**ROADMAP.md is the single source of truth for project direction and phased implementation.**

## Agent Rules

### 1. Think Before Coding

**Do not make assumptions when it comes to critical architectural decisions or obvious discrepancies in requests. Do not hide confusion. Surface tradeoffs and present multiple choices to the user when appropriate.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- Do not overthink - if you have to ask yourself the same question more than 3 times, stop and ask the user instead.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

### 4. Spawning Agents

When spawning agents, follow the rules below:
- **ALWAYS spawn agents sequentially, never in parallel**
    - Never spawn an agent if one is already working
    - Wait for each agent to fully complete before spawning the next
- **ALWAYS spawn agents for research task or coding tasks** 
    - Never attempt to read or work on medium to large sections of the codebase yourself 
- **ALWAYS ask if you don't know which subagent to use**
    - Available agents can be found in @.opencode/agents/

These are hard requirement due to local GPU memory constraints and context window sizes.

### 5. Available Subagents

All subagents are defined in `.opencode/agents/`. Use them via the `task` tool with the matching `subagent_type`.

**Explorers** — read-only analysis of codebase sections:
- `backend-explorer` — Analyze and summarize the `backend/` directory structure, patterns, and architecture
- `devops-explorer` — Analyze Docker/Nginx infrastructure configuration files
- `frontend-explorer` — Analyze and summarize the `frontend/` directory structure, patterns, and architecture

**Engineers** — implement code changes:
- `backend-engineer` — PHP backend code (controllers, services, middleware, configuration)
- `devops-engineer` — Docker and Nginx configurations (`docker-compose.yml`, `docker/`)
- `frontend-engineer` — React/JavaScript frontend code (components, hooks, contexts, pages)

**Reviewers** — read-only code review of changes:
- `backend-reviewer` — Review backend code changes (PHP/Slim Framework)
- `devops-reviewer` — Review Docker/Nginx configuration changes
- `frontend-reviewer` — Review frontend code changes (React/Tailwind) using Playwright MCP Server

**Managers** — orchestration and version control:
- `docs-manager` — Create/update project documentation (`README.md`, `docs/`)
- `git-manager` — Git operations, Gitea PRs, issues, milestones, branching

## Repository Platform

This repository uses a self-hosted Gitea instance and the Gitea MCP Server.

- NEVER assume GitHub/Gitea APIs, CLI commands, or workflows exist.
- ALL pull requests, issues, milestones, projects, etc. MUST be performed through the Gitea MCP Server.
- If the Gitea MCP Server is unavailable, stop and report the issue rather than falling back to GitHub tooling.

## Development URLs

This project is developed inside a code-server container and is NOT accessed through localhost.

Use the following URLs:
- Frontend development server: https://dev-server.heise.home
- Backend API: https://dev-server.heise.home/api

## Development Commands

### Docker (primary development workflow)

```bash
docker compose up --build    # Start the application at http://localhost:5959
docker compose down          # Stop containers
```

Single container runs PHP 8.2-FPM + Nginx. Backend source is volume-mounted for live editing; frontend `dist/` is baked in at build time.

### Frontend (iterative development)

```bash
cd frontend
npm install                  # Install dependencies
npm run dev                  # Vite dev server (port 5173, proxies /api to backend)
npm run build                # Production build to dist/
npm run preview             # Preview production build locally
```

The Vite dev server proxies `/api` requests to `http://192.168.0.91:5959`. Update `vite.config.js` if the backend host changes.

### Backend

```bash
cd backend
composer install             # Install PHP dependencies
php -S localhost:8000        # Quick local server (no Nginx)
```

## Architecture

```
Frontend (React SPA) <--JSON--> Backend (Slim API) <--CURL--> wilottery.com (scraping)
```

- **Backend entry point:** `backend/api.php` — Slim Framework bootstrap (autoloader, error middleware, JSON Content-Type); thin routing table (~14 lines) delegating all four endpoints to `GamesController`
- **Controllers:** `backend/controllers/GamesController.php` — central layer for all game endpoint logic (`list()`, `show()`, `history()`, `generate()`); uses a `$registry` array mapping game IDs to FQCNs as the single place to register new games
- **Game interface:** `backend/games/GameInterface.php` — defines the contract for game implementations (`getGameDetails()`, `getHistory()`, `generateTickets()`)
- **Game classes:** `backend/games/BadgerFive.php`, `backend/games/SuperCash.php` — pattern analysis and panel generation logic
- **Autoloading:** Composer PSR-4 (`LotteryCodex\Games\` → `games/`, `LotteryCodex\Controllers\` → `controllers/`)
- **Frontend:** Minimal React app currently — `App.jsx` is a placeholder. Full component hierarchy (pages, hooks, contexts) is planned per the migration roadmap.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List available games |
| GET | `/api/games/{gameId}` | Get game details and rules |
| GET | `/api/games/{gameId}/history` | Get mock historical drawing data (live scraping planned) |
| POST | `/api/games/{gameId}/generate` | Generate prediction panels |

### Docker/Nginx Routing

Nginx serves the frontend from `/var/www/html/frontend/` with SPA fallback (`try_files $uri $uri/ /index.html`). All `/api/` requests are proxied to PHP-FPM via FastCGI, routed to `backend/api.php`.

## Key Context

- **No tests yet** — test infrastructure has not been set up
- **SuperCash is fully functional** — pattern analysis and panel generation working
- **BadgerFive is the primary focus** — fully functional game class, scraping + panel generation working
- **Scraping:** PHP built-in DOM extension (`DOMDocument` + `DOMXPath`) with shared scrapers in `backend/scrapers/` (`LotteryCodex\Scrapers\`); the vendored simplehtmldom library is removed in Phase 3.1
- **Current branch convention:** `phase-X-Y` branches for sub-phases, with dated task branches (`Y-m-d-short-summary`) rebased onto phase branches
