# AGENTS.md

## Lottery Codex

Web application that scrapes Wisconsin Lottery drawing history, analyzes odd/even and low/high distribution patterns (Lottery Codex methodology), and generates optimized number panels for Badger Five, Super Cash, and Megabucks games.

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
- **NEVER edit code files directly from the orchestrator session**
    - If a finding needs a fix, re-spawn the responsible agent - never use an edit tool yourself, even for a "quick" fix
- **ALWAYS ask if you don't know which subagent to use**
    - Available agents can be found in @.opencode/agents/

These are hard requirements due to local GPU memory constraints and context window sizes.

### 5. Available Subagents

All subagents are defined in `.opencode/agents/`. Use them via the `task` tool with the matching `subagent_type`. Each agent's working playbook is a skill in `.opencode/skills/` (the architect has three — `brainstorm-roadmap`, `review-roadmap`, `decompose-sub-phase`); commands instruct agents to use it.

- `software-architect` — Brainstorms/creates and updates ROADMAP.md, critiques it, and decomposes a sub-phase into 2–5 Gitea issues with complete plan bodies (thinking model).
- `project-explorer` — Read-only structured codebase analysis; returns a report from a template.
- `software-engineer` — Implements one issue's plan within the scope passed at spawn time.
- `code-reviewer` — Read-only code review in scoped (diff) or standalone mode; uses the Playwright MCP Server for UI changes when it is available.
- `ui-designer` — Produces self-contained HTML mockups in the project's mockup directory.
- `docs-manager` — Maintains ROADMAP.md status fields, README.md, and AGENTS.md (never the spec, never `docs/`, never source code).
- `git-manager` — All git and Gitea operations: branches, commits, issues, milestones, PRs (via the Gitea MCP Server).

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
npm run preview              # Preview production build locally
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
- **Game classes:** `backend/games/BadgerFive.php`, `backend/games/SuperCash.php`, `backend/games/Megabucks.php` — pattern analysis and panel generation logic
- **Autoloading:** Composer PSR-4 (`LotteryCodex\Games\` → `games/`, `LotteryCodex\Controllers\` → `controllers/`)
- **Frontend:** React SPA — `frontend/src/` with `pages/`, `components/` (`common/`, `games/`, `layout/`), `contexts/`, `hooks/`, `services/` (fetch-based API client)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List available games |
| GET | `/api/games/{gameId}` | Get game details and rules |
| GET | `/api/games/{gameId}/history` | Get historical drawing data (mock data; live scraping lands in Phase 3) |
| POST | `/api/games/{gameId}/generate` | Generate prediction panels |

### Docker/Nginx Routing

Nginx serves the frontend from `/var/www/html/frontend/` with SPA fallback (`try_files $uri $uri/ /index.html`). All `/api/` requests are proxied to PHP-FPM via FastCGI, routed to `backend/api.php`.

## Conventions

### Backend (PHP 8.2 / Slim 4)

- Follow PSR-12; `declare(strict_types=1)`, type hints, and return types everywhere
- Composer PSR-4 autoloading under the `LotteryCodex\` namespace
- PHPDoc docblocks (PSR-5) on all classes and public methods (`@param`, `@return`, `@throws`); inline `//` comments are not required
- Slim handler functions with dependency injection via the container; domain classes for game-specific logic (pattern analysis, panel generation); middleware for cross-cutting concerns (CORS, error handling, request validation)
- `JsonSerializable` for consistent API response shaping
- Avoid constructor side-effects — load data lazily via getters
- Use specific exception types rather than generic `Exception`; structured JSON error responses without exposing sensitive information
- Retry logic with exponential backoff for transient HTTP failures (scraper dependencies)
- Leverage PHP 8.2 features: match expressions, readonly properties, enums, constructor property promotion

### Frontend (React 18 / Vite / Tailwind v4)

- Functional components with hooks exclusively (no class components); React Router DOM v6
- State: Context API + `useReducer` for cross-component state, `useState` for local state
- Tailwind CSS v4 utilities first; custom CSS only in `src/old-styles.css` for legacy patterns; `src/index.css` holds CSS custom properties and component patterns — read it before writing UI code
- UI primitives: `@headlessui/react` and `@heroicons/react`
- Folder structure: `components/common/` (shared primitives), `components/games/` (game-specific), `components/layout/` (layout wrappers), `pages/` (route-level), `contexts/`, `hooks/`, `services/`
- `fetch` calls only in the `services/` layer (`services/api.js`, relative `/api` paths)
- Components small and focused (max ~300 lines); single responsibility; `React.memo`/`useMemo`/`useCallback` where warranted; `React.lazy` + `Suspense` for route-level code splitting
- JSDoc docblocks on exported functions, components, and hooks (`@param`, `@returns`, `@example`); inline `//` comments are not required
- Mockup precedence: `src/index.css` + existing components take precedence for colors/variables/utilities, then Tailwind utilities; mockups are reference-only for layout, hierarchy, and interaction intent; for structure, the ROADMAP sub-phase description takes precedence over the mockup

### DevOps (Docker / Nginx)

- Single container runs PHP-FPM (on `127.0.0.1:9000`) and Nginx (port 80), started via `/start.sh`; all containers run in the `America/Chicago` timezone
- Write boundary: `docker-compose.yml` (root) and files in `docker/` only — never any other path
- Backend source is volume-mounted for live development; frontend `dist/` is baked into the image at build time
- Nginx: SPA fallback via `try_files`, FastCGI proxy for `/api/*` to PHP-FPM (`SCRIPT_FILENAME` → `backend/api.php`), caching headers for static assets, security headers
- Docker: pinned image versions (never `latest`), `.dockerignore`, non-root user (`www-data`), resource limits

### Git & Gitea

- **Branch tiers:** `master` ← `phase-X` ← `phase-X-Y` (sub-phase, cut off the parent phase branch) ← `YYYY-MM-DD-short-task-summary` (issue branch, cut off the sub-phase branch; lowercase, hyphens, max 5 words, no articles)
- Merges are merge commits (no squash, no rebase)
- **Commit format:** `[Type-IssueNumber] Issue title` (Type = the issue label, capitalized, e.g. `[Task-171]`); docs-only work uses `[DOCS]`, tooling work `[TOOLS]`
- **Gitea:** label `Task` on sub-phase issues, `Bug` on QA findings; milestone per sub-phase titled `Phase X.Y` with a `Title / Parent Phase / Description / Done When` body; issue body is the plan (`What / Why / Implementation / Acceptance Criteria / Notes`)
- **PRs:** issue branch → sub-phase branch, body sections `Task Summary / Files changed / Code review summary / Closes #N`
- `gitea-mcp_issue_write` requires ALL of: `title`, `body`, `milestone`, `labels`, `ref` — pass every parameter even if the schema marks it optional

## Models

Local models via llama.cpp. **Model routing is pinned only in command frontmatter** (`.opencode/commands/`) — agents and skills carry no model of their own; a subagent inherits the model of the command (or session) that invokes it.

| Command | Model |
|---------|-------|
| `/brainstorm` | `llama.cpp/Enoch-III` |
| `/review-roadmap` | `llama.cpp/Enoch-III` |
| `/create-sub-phase` | `llama.cpp/Enoch-II` |
| `/generate-mockups` | `llama.cpp/Muse` |
| `/complete-issue` | `llama.cpp/Enoch` |
| `/qa-review` | `llama.cpp/Enoch-II` |
| `/complete-sub-phase` | `llama.cpp/Enoch` |

Tiers: Enoch (fast, 3-bit, reasoning off) · Enoch-II (mid, 3-bit, medium reasoning) · Enoch-III (top, 3-bit, xhigh reasoning — reserved for big-picture roadmap work). The default session model is `llama.cpp/Enoch-II`.

## Workflow

Pipeline: `/brainstorm` → `/review-roadmap` → `/generate-mockups` → `/create-sub-phase` → `/complete-issue` (per task) → `/qa-review` → `/complete-sub-phase`.

| Command | Purpose |
|---------|---------|
| `/brainstorm <goals>` | Create or update ROADMAP.md (phases → sub-phases with "Done when") |
| `/review-roadmap` | Read-only critique of ROADMAP.md (gaps, ordering, over-scoping) |
| `/generate-mockups [X.Y] [n]` | Produce n self-contained HTML mockups for a sub-phase in the project's mockup directory |
| `/create-sub-phase [X.Y]` | Decompose a roadmap sub-phase into 2–5 Gitea issues; create branch, milestone, and issues (plan = issue body) |
| `/complete-issue [N]` | Branch, implement, scoped review (fix loop), commit, and PR a single issue |
| `/qa-review [X.Y \| X]` | Full quality review against the parent branch; each Critical finding becomes a Gitea `Bug` issue |
| `/complete-sub-phase [X.Y]` | Milestone gate, limited docs update, and the merge PR to the phase branch |

Rules:
- Plans live in Gitea issue bodies — there are no local plan files.
- Mockups are committed to `frontend/mockups/` (never gitignored).
- The orchestrator never edits code; all code changes go through `software-engineer`.
- QA loop: `/qa-review` files `Bug` issues for Critical findings → fix each with `/complete-issue` → re-run `/qa-review` until clean → then `/complete-sub-phase`.
- Command syntax: `@name` references a subagent (spawn it) or a file (inject its content); `!`command`` injects shell output into the prompt.
- Every command ends with the summary table defined in `.opencode/templates/command-summary.md` — the user verifies work from these tables.

## Key Context

- **No tests yet** — test infrastructure has not been set up
- **All three game classes are functional** (Badger Five is the primary focus); pattern analysis and panel generation working
- **Scraping:** currently the vendored `simplehtmldom` library; Phase 3.1 migrates to the PHP DOM extension (`DOMDocument` + `DOMXPath`) with shared scrapers in `backend/scrapers/` (`LotteryCodex\Scrapers\`) and removes the vendored library
- **`docs/` is 100% human-maintained** — no agent ever modifies files in it
- **Branches in flight:** `opencode-tools` holds all OpenCode workflow changes (agents, skills, commands)