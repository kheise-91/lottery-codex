# Lottery Codex — Project Context

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

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

### 4. Subagent Invocation

**Always invoke subagents for research task or coding tasks.**

When invoking subagents:
- Always ask if you don't know which subagent to invoke
- ALWAYS run subagents sequentially, never in parallel
- Wait for each subagent to fully complete before invoking the next
- This is a hard requirement due to local GPU memory constraints

## Project Overview

Web application that analyzes historical Wisconsin Lottery drawing data and generates optimized number combinations using pattern-analysis techniques inspired by the [Lottery Codex](https://lotterycodex.com) methodology.

**Stack:** PHP 8.2-FPM backend (no framework, custom PSR-style autoloading) + React 18 SPA frontend (Vite + Tailwind CSS v4), served through Nginx in a Docker container.

**Supported Games:**
- **Badger Five** — Pick 5 from 1–31, daily draws
- **Super Cash** — Pick 6 from 1–39, daily draws (work in progress)

## Architecture

```
React SPA (frontend/) ──JSON──▶ PHP API (backend/) ──CURL/scraping──▶ wilottery.com
```

- **Frontend:** React 18 + Vite + Tailwind CSS v4. Currently a placeholder page — components, hooks, services, and routing are planned but not yet implemented.
- **Backend:** PHP 8.2-FPM with no framework. Uses `simplehtmldom` for HTML parsing of Wisconsin Lottery draw history. Custom autoloader in `backend/_functions.php`. Nginx proxies `/api/` requests to a single `backend/api.php` front controller (not yet created).
- **Docker:** Single container running PHP-FPM + Nginx. Backend source is volume-mounted; frontend `dist/` is baked into the image at build time.

## Directory Structure

```
├── backend/
│   ├── games/                # Game logic classes
│   │   ├── BadgerFive.php    # 5-number game, 3 patterns, panel generation
│   │   └── SuperCash.php     # 6-number game (WIP, pattern analysis only)
│   ├── simplehtmldom/        # HTML parser library (vendor)
│   ├── _functions.php        # Autoloader + classExists helper
│   └── autoloader.php        # PSR-4 entry point (alias for _functions.php)
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Placeholder page (counter demo)
│   │   ├── index.css         # Tailwind CSS entry
│   │   └── main.jsx          # React entry point
│   ├── dist/                 # Vite production build output
│   ├── public/               # Static assets, PWA manifest
│   ├── vite.config.js        # Vite config with /api proxy to Docker host
│   └── package.json
├── docker/
│   ├── Dockerfile            # PHP 8.2-FPM + Nginx, multi-service in one image
│   └── nginx.conf            # SPA routing, /api → FastCGI, asset caching
├── docs/
│   ├── api/README.md         # API endpoint documentation (empty, to be populated)
│   └── components/README.md  # Component index (empty, to be populated)
├── OLD/                      # Legacy PHP implementation (UI reference)
└── docker-compose.yml
```

## Building and Running

### Docker (production)
```bash
docker compose up --build
```
Application at `http://localhost:5959`.

### Local Development

**Backend:**
```bash
cd backend
php -S localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173, proxies /api to Docker host
```

**Production build:**
```bash
cd frontend && npm run build   # outputs to frontend/dist/
```

## Backend Details

### Game Classes (`backend/games/`)

Both `BadgerFive.php` and `SuperCash.php` follow the same pattern:

1. **Number pools:** Numbers split into four categories — Low-Odd, Low-Even, High-Odd, High-Even
2. **Patterns:** Each pattern defines Odd/Even and Low/High distribution targets (e.g., "3-Odd 2-Even / 3-Low 2-High")
3. **Sub-patterns:** Each pattern has 3 sub-patterns specifying which pool each position draws from
4. **Panel generation:** Creates unique number panels matching the target distribution, with exclusion logic to avoid repeated numbers within a ticket

**BadgerFive** is fully implemented (scraping + panel generation). **SuperCash** is WIP — currently only does pattern frequency analysis on hardcoded historical data.

### API Front Controller

Nginx routes all `/api/*` requests to `backend/api.php` via FastCGI. This file does not exist yet — it needs to be created as a REST router that dispatches to game classes.

Planned endpoints (from README):
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List available games |
| GET | `/api/games/{gameId}` | Game details and rules |
| GET | `/api/games/{gameId}/history` | Historical drawing results |
| POST | `/api/generate` | Generate prediction panels |

### Autoloading

`backend/_functions.php` provides a simple `autoload()` function that looks for `{ClassName}.php` in the `games/` directory. No Composer — manual require-based autoloading.

## Frontend Details

The frontend is currently a **placeholder** — just a counter demo in `App.jsx`. The planned structure (from README) includes:
- `src/components/` — Reusable UI components
- `src/hooks/` — Custom React hooks
- `src/services/` — API client layer
- `src/App.jsx` — Router and layout

Planned routes:
| Route | Page |
|-------|------|
| `/` | Dashboard (game selection) |
| `/games/:gameId` | Game page (drawings + panel generation tabs) |
| `/history/:gameId` | Full history browser |

## Migration Plan

A detailed migration plan exists at `.qwen/plans/migration-to-react-and-modern-php.md`. Key decisions:

- **Backend:** Migrate to Slim Framework 4 with Composer PSR-4 autoloading, PHP 8.2 features
- **Frontend:** Build full React SPA with Context API + useReducer for state, React Router DOM v6
- **Scope:** Badger Five only initially; SuperCash disabled until later
- **Strategy:** Mock data first → verify integration → fix scraping last

## Agent Configuration

Six specialized agents are configured in `.qwen/agents/`:

| Agent | Scope | Write Restriction |
|-------|-------|-------------------|
| **backend-engineer** | PHP backend code | `backend/` only |
| **frontend-engineer** | React/JS frontend code | `frontend/` only |
| **devops-engineer** | Docker + Nginx config | `docker-compose.yml` + `docker/` only |
| **documenter** | Markdown documentation | Root `README.md` + `docs/` only |
| **git-manager** | Git operations + Gitea MCP | Full repo (read/write) |
| **backend-explorer, frontend-explorer, devops-explorer** | Read-only code analysis | Read only |
| **backend-reviewer, frontend-reviewer, devops-reviewer** | Read-only code review | Read only |

All agents should read relevant `docs/` documentation before making changes.

## Key Development Notes

- **No Composer:** The backend uses manual autoloading. Dependencies (`simplehtmldom`) are vendored directly in `backend/simplehtmldom/`. Migration plan calls for adding Composer.
- **No React Router yet:** Frontend is a single placeholder component. Routing, services layer, and component library need to be built.
- **No `api.php`:** The Nginx config expects `backend/api.php` as the FastCGI entry point, but it doesn't exist yet.
- **SuperCash WIP:** SuperCash game class is in analysis mode only — panel generation is commented out.
- **Volume mount:** Docker mounts `backend/` from host (`/home/admin/Projects/lottery-codex/backend`), so backend changes are live without rebuild. Frontend requires rebuild.
- **Timezone:** All containers run in `America/Chicago` to match Wisconsin Lottery timezone.
- **Vite proxy:** Frontend dev server proxies `/api` to `http://192.168.0.91:5959` (Docker host).