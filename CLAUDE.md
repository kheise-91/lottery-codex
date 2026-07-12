# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lottery Codex

Web application that scrapes Wisconsin Lottery drawing history, analyzes odd/even and low/high distribution patterns (Lottery Codex methodology), and generates optimized number panels for Badger Five and Super Cash games.

**Stack:** React 18 SPA + PHP 8.2-FPM backend (Slim Framework 4) · Docker single-container deployment · No database

## Migration Plan

The project is mid-migration from legacy PHP to a modern architecture. See `.claude/plans/migration-to-react-and-modern-php.md` for the full migration plan and `ROADMAP.md` for phased implementation tracking. Current work follows the roadmap phases sequentially.

## Agent Rules

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

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

### 4. Subagent Invocation

**Always invoke subagents for research task or coding tasks.**

When invoking subagents:
- Always ask if you don't know which subagent to use
- ALWAYS run subagents sequentially, never in parallel
- Wait for each subagent to fully complete before invoking the next
- This is a hard requirement due to local GPU memory constraints

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

- **Backend entry point:** `backend/api.php` — Slim Framework bootstrap (autoloader, error middleware, JSON Content-Type); thin routing table (~8 lines) delegating to `GamesController`
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
- **simplehtmldom** is vendored manually (not via Composer) in `backend/simplehtmldom/`
- **Current branch convention:** `phase-X-Y` branches for sub-phases, with dated task branches (`Y-m-d-short-summary`) rebased onto phase branches
