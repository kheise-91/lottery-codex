# Lottery Codex — Implementation Roadmap

> Generated: 2026-07-02 · Based on migration plan, codebase analysis, and legacy UI review

## Project Goal

Build a web application that scrapes Wisconsin Lottery drawing history, analyzes pattern distribution (odd/even and low/high per Lottery Codex methodology), and generates optimized number panels for Badger Five and Super Cash games.

**Stack:** React 18 SPA + PHP 8.2-FPM backend · Docker single-container deployment · No database

---

## Current State vs Target

| Area | Current | Target |
|------|---------|--------|
| **Backend API** | `api.php` missing; Nginx routes to nothing | Slim Framework router with 4 REST endpoints |
| **BadgerFive game class** | Fully functional (scraping + panel generation) but pre-PHP-7 style, no namespace/types | Namespaced, typed, Composer-loaded |
| **SuperCash game class** | Fatal error (missing `SuperCashPD.php`), core methods commented out | Fixed constructor, no external dependencies, analysis-only for now |
| **Frontend** | Placeholder counter in App.jsx; Tailwind configured but unused | Full SPA: Dashboard → GamePage split-view (desktop) / tabbed (mobile) → PatternDistribution + History browser |
| **Routing** | No router installed | React Router DOM v6, 3 routes |
| **State management** | Single `useState(0)` placeholder | Context API + useReducer for game data/history/tickets |
| **Docker volume mount** | Hardcoded host path (`/home/admin/Projects/...`) that doesn't match this machine | Relative bind mount or correct absolute path |
| **Production errors** | `display_errors = On` leaks stack traces | Errors logged only, hidden from users |

---

## Phase 0 — Infrastructure & Backend Foundation

Fix critical bugs and establish the backend foundation. Without this, nothing else works.

- [x] **[0.1 — Fix SuperCash fatal error](https://gitea.heise.home/kheise/lottery-codex/milestone/12)**
   - Remove the `$this->pd = new SuperCashPD()` constructor dependency (file doesn't exist)
   - Comment out or stub all methods that depend on `SuperCashPD`
   - Keep only the working `analyzePreviousDrawings()` method and number pool definitions
   - Add runtime check for simplehtmldom dependency with warning if missing
   - Fix logic error in generatePanel() exclusion loop (changed `<` to `<=`)
   - Fix simple_html_dom.php path from `__DIR__."/../simple_html_dom.php"` to `__DIR__."/../simplehtmldom/simple_html_dom.php"`

   **Done when:** `new SuperCash()` instantiates without error. The class now has no external dependencies and can be instantiated directly.

- [x] **[0.2 — Initialize Composer + Slim Framework in `backend/`](https://gitea.heise.home/kheise/lottery-codex/milestone/13)**
   - Create `backend/composer.json` with PSR-4 autoloading (`LotteryCodex\Games → games/`)
   - Add `slim/slim ^4.x`, `slim/psr7`, and `nikic/fast-route` as dependencies
   - Run `composer install` in `backend/`

   **Done when:** `vendor/autoload.php` exists and loads game classes by namespace.

- [x] **[0.3 — Namespace + type-hint existing game classes](https://gitea.heise.home/kheise/lottery-codex/milestone/14)**
   - Add `namespace LotteryCodex\Games;` to both `BadgerFive.php` and `SuperCash.php`
   - Add PHP 8.2 property types, return types, constructor promotion where appropriate
   - Remove side-effects from constructors (no scraping in `__construct`)
   - Remove old `_functions.php` and `autoloader.php` files from the `backend/` directory

   **Done when:** Both classes load via Composer autoloader with zero PHP warnings.

- [x] **[0.4 — Create GameInterface](https://gitea.heise.home/kheise/lottery-codex/milestone/22)**
   - Define `GameInterface` with: `getGameDetails()`, `getHistory()`, `generateTickets(int $tickets)`
   - `$pattern` parameter removed — each game class has one internal `$pattern` array; sub-pattern count equals physical panels per ticket card
   - `generateTickets()` returns tickets as nested arrays (each ticket contains multiple panels) — not a flat array of panels
   - Have both BadgerFive and SuperCash implement the interface

   **Done when:** Both game classes type-hint against the interface.

- [x] **[0.5 — Fix Docker volume mount path](https://gitea.heise.home/kheise/lottery-codex/milestone/23)**
   - Update `docker-compose.yml` to use a relative bind mount: `./backend:/var/www/html/backend:rw`
   - Verify container can see backend files after rebuild

   **Done when:** Backend changes on host are visible inside the container without rebuild.

- [x] **[0.6 — Disable display_errors for production](https://gitea.heise.home/kheise/lottery-codex/issues/50)**
   - Add PHP INI override in Dockerfile: `display_errors = Off`, keep `log_errors = On`
   - Configure error log path to `/var/log/php/error.log`

   **Done when:** PHP errors are logged but not visible in HTTP responses.

---

## Phase 1 — API Layer & Mock Data

Create the API front controller with mock data endpoints. This establishes frontend-backend connectivity before touching real scraping logic.

- [x] **[1.1 — Create `backend/api.php` Slim router](https://gitea.heise.home/kheise/lottery-codex/milestone/25)**
   - Bootstrap Composer autoloader and Slim app
   - Implement 4 endpoints:
   - `GET /api/games` → return static list of available games (Badger Five, Super Cash)
   - `GET /api/games/{gameId}` → return game rules/details
   - `GET /api/games/{gameId}/history` → return mock historical drawings
   - `POST /api/games/{gameId}/generate` → accept `{ "count": N }`, call `$game->generateTickets($count)`, return nested array of tickets (each ticket = array of panels)

   **Done when:** All 4 endpoints return valid JSON via `curl http://localhost:5959/api/games`.

- [x] **[1.2 — Introduce `GamesController` layer](https://gitea.heise.home/kheise/lottery-codex/milestone/26)**
   - Create `backend/controllers/GamesController.php` with `list()`, `show()`, `history()`, `generate()` methods
   - Use a `$registry` array (`'game-id' => ClassName::class`) as the single place to register new games
   - Shrink `api.php` to a thin routing table (~8 lines) that delegates to the controller
   - `resolve()` method does game lookup once, reused by all methods; returns `GameInterface|null`

   **Done when:** `api.php` is a thin routing table; all endpoint logic lives in the controller.

- [x] **[1.3 — Add nginx `fastcgi_split_path_info`](https://gitea.heise.home/kheise/lottery-codex/milestone/27)**
   - Add `fastcgi_split_path_info ^(/api/)(.*)$;` to nginx.conf `/api` location block
   - Ensure `$request_uri` is passed correctly for Slim routing

   **Done when:** Slim router can distinguish between `/api/games` and `/api/generate`.

- [ ] **1.4 — Install React Router DOM v6 in frontend**
   - `npm install react-router-dom@6` in `frontend/`
   - Set up `<BrowserRouter>` wrapper in `main.jsx`

   **Done when:** Frontend builds without errors and renders a router outlet.

- [ ] **1.5 — Create API service layer (`src/services/api.js`)**
   - Build a lightweight fetch wrapper with base URL configuration
   - Export functions: `fetchGames()`, `fetchGameDetails(id)`, `fetchHistory(id)`, `generateTickets(id, count)`
   - Configure Vite `.env` with `VITE_API_BASE_URL` for dev/prod flexibility

   **Done when:** Service functions return typed JSON responses from the backend.

- [ ] **1.6 — Create custom hooks (`src/hooks/`)**
   - `useGameHistory(gameId)` → fetches and caches historical drawings, returns `{data, loading, error}`
   - `useGenerateTickets(gameId)` → triggers ticket generation (each ticket contains multiple panels), returns `{tickets, loading, error, generate}`

   **Done when:** Hooks can be consumed by components without direct API calls.

---

## Phase 2 — Frontend Core Components

Build the React component hierarchy based on the legacy UI patterns from `OLD/`.

- [ ] **2.1 — Set up Context + useReducer state management**
   - Create `src/contexts/GameContext.jsx` with reducer for: games list, selected game, history data, panel results
   - Actions: `SET_GAMES`, `SELECT_GAME`, `FETCH_HISTORY`, `GENERATE_TICKETS`
   - Wrap app in `<GameProvider>`

   **Done when:** Components can dispatch actions and read state from context.

- [ ] **2.2 — Build Layout shell (`src/components/layout/Layout.jsx`)**
   - Header with "Lottery Codex" branding (match legacy styling)
   - Main content area for page routing
   - Mobile-first, full-height flex column layout (matching PWA pattern from OLD/)

   **Done when:** Layout renders consistently across mobile and desktop viewports.

- [ ] **2.3 — Create Dashboard page (`src/pages/Dashboard.jsx`)**
   - Giant card-like buttons for each available game (Badger Five, Super Cash)
   - Cards show: game name, number range, draw frequency
   - Click navigates to `/games/{gameId}`

   **Done when:** User can select a game from the dashboard and navigate to its page.

- [ ] **2.4 — Create Ball component (`src/components/games/Ball.jsx`)**
   - Circular element (32px), centered text, bordered
   - Match legacy styling: `border-radius: 50%`, silver border, 16px font
   - Accept `number` prop; support variant colors for sub-patterns

   **Done when:** Ball renders numbers identically to the legacy UI.

- [ ] **2.5 — Create DrawingCard component (`src/components/games/DrawingCard.jsx`)**
   - Shows: date (formatted "Monday, January 1st"), full pattern string (e.g., "3-Odd 2-Even / 3-Low 2-High"), row of number balls
   - Match legacy fieldset layout with `<legend>` for date and `<h5>` for pattern

   **Done when:** Historical drawings render as cards matching the OLD/ visual style.

- [ ] **2.6 — Create PanelDisplay component (`src/components/games/PanelDisplay.jsx`)**
   - Groups panels in sets per ticket (5 for BadgerFive, 6 for SuperCash) — one panel per sub-pattern
   - Color-coded backgrounds by sub-pattern index (matching OLD CSS)
   - Shows sub-pattern labels above each panel

   **Done when:** Generated panels render with correct grouping and color coding.

- [ ] **2.7 — Create Tabs component (`src/components/common/Tabs.jsx`, mobile only)**
   - Two-tab switcher: "Previous Drawings" / "Generated Panels"
   - Hidden on desktop (≥768px) where split-view is used instead
   - Use `@headlessui/react` Tab component (already installed)
   - Match legacy tab styling (slate gray inactive, light active with small-caps)

   **Done when:** Tabs switch content without page reload; hidden on desktop breakpoint.

- [ ] **2.8 — Build GamePage (`src/pages/GamePage.jsx`) with split-view layout**
   - Desktop (≥768px): Split-view grid — history + pattern distribution on left (5/12), generation form + panels on right (7/12)
   - Mobile (<768px): Tabbed interface via Tabs component — "Previous Drawings" and "Generated Panels"
   - Form controls: ticket count dropdown only (1, 2, 3, 5, 10) — no pattern selector; pattern is internal to each game class
   - Desktop: auto-generate panels when ticket count changes; Mobile: explicit "Generate" button
   - Uses `useGameHistory` and `useGenerateTickets` hooks

   **Done when:** User can view drawings, generate panels, and see results — split-view on desktop, tabs on mobile.

- [ ] **2.9 — Create PatternDistribution component (`src/components/games/PatternDistribution.jsx`)**
   - Calculates and displays pattern frequencies from historical drawings
   - Shows full pattern text (e.g., "3-Odd 2-Even / 3-Low 2-High") with percentage bar chart
   - Color-coded bars: green (≥60%), yellow (40–59%), orange (20–39%), slate (<20%)
   - Sticky positioning on desktop left panel; at top of mobile drawings tab

   **Done when:** Pattern distribution renders accurate statistics from history data with correct color tiers.

- [ ] **2.10 — Wire up React Router in App.jsx**
    - Routes: `/` → Dashboard, `/games/:gameId` → GamePage, `/history/:gameId` → HistoryPage (stub)
    - Replace placeholder counter with router outlet inside Layout

   **Done when:** All three routes render without errors; navigation works.

---

## Phase 3 — Styling Migration & Polish

Convert the legacy CSS from `OLD/` into Tailwind utility classes and custom component styles.

- [ ] **3.1 — Migrate core color palette to Tailwind**
    - Map legacy colors: page background (`bg-neutral-200`), text (`text-neutral-800`), fieldset borders (`border-neutral-400`)
    - Define sub-pattern highlight classes in components (green/yellow/orange at 10% opacity)
    - Pattern distribution bar colors: green (≥60%), yellow (40–59%), orange (20–39%), slate (<20%)

   **Done when:** All hardcoded inline styles are replaced with Tailwind utilities.

- [ ] **3.2 — Implement responsive split-view layout**
   - Mobile (<768px): Tabbed interface, full-width fieldsets, single column panels
   - Desktop (≥768px): Split-view grid — 5/12 left panel (history + distribution) + 7/12 right panel (form + panels in 3-column grid)
   - Left panel: sticky pattern distribution at top, scrollable drawing history below
   - Right panel: generation form at top, generated panels below
   - Match the `@media (min-width: 768px)` behavior from OLD CSS for individual card styling

   **Done when:** Layout transitions correctly at 768px breakpoint; split-view on desktop, tabs on mobile.

- [ ] **3.3 — Polish tab active/inactive states**
   - Inactive tabs: slate gray background, white text
   - Active tab: light background matching page, slate text, small-caps font variant
   - Smooth transition between states

   **Done when:** Tabs visually match the legacy implementation pixel-for-pixel.

- [ ] **3.4 — Add loading and error states**
    - Skeleton loaders for history fetching and panel generation
    - Error banners for API failures (network errors, invalid game)
    - Disabled button state during in-flight requests
    - Pattern distribution shows "No data" message when history is empty

   **Done when:** User sees meaningful feedback during all async operations.

---

## Phase 4 — Real Data Integration

Replace mock data with actual BadgerFive game class instances. This is where the backend scraping and panel generation logic becomes live.

- [ ] **4.1 — Wire BadgerFive into API endpoints**
   - Replace mock history in `GET /api/games/badger-five/history` with `$game->getHistory()`
   - Replace mock panels in `POST /api/games/badger-five/generate` with `$game->generateTickets($tickets)`
   - Add try-catch wrappers around game class calls

   **Done when:** API returns real data from BadgerFive for both history and generation.

- [ ] **4.2 — Verify frontend displays real data correctly**
   - Confirm historical drawings match what the Wisconsin Lottery website shows
   - Verify generated panels follow pattern distributions (odd/even, low/high)
   - Test edge cases: single ticket, max tickets, all patterns

   **Done when:** End-to-end flow works: Dashboard → Game Page → Generate → Real panels displayed.

- [ ] **4.3 — Handle API errors gracefully in frontend**
   - Network timeout handling (scraping can be slow)
   - Empty history results display
   - Invalid pattern/ticket parameter validation

   **Done when:** No unhandled promise rejections; user sees clear error messages.

---

## Phase 5 — Scraping Reliability (Last Priority)

The scraping logic exists and works in BadgerFive, but it's fragile. Harden it after everything else is verified working.

- [ ] **5.1 — Add retry logic with exponential backoff**
   - Wrap `file_get_html()` in a retry loop (max 3 attempts, 1s → 2s → 4s delays)
   - Log each attempt to PHP error log

   **Done when:** Transient network failures are handled gracefully without user-visible errors.

- [ ] **5.2 — Add graceful degradation for scraping failures**
   - If scraping fails after all retries, return cached data (if available) or a friendly "scraping unavailable" message
   - Log full HTML response on failure for debugging

   **Done when:** API returns a valid JSON response even when wilottery.com is unreachable.

- [ ] **5.3 — Verify HTML selectors still match current wilottery.com structure**
   - Confirm `.winning-numbers-line`, `.date > strong`, `.winning-number` selectors work against the live site
   - Update selectors if the website layout has changed since original implementation

   **Done when:** Scraping returns complete, accurate drawing data.

---

## Phase 6 — Super Cash Integration (Future)

Super Cash is out of scope for initial launch. This phase activates once Badger Five is fully working end-to-end.

- [ ] **6.1 — Complete SuperCash game class**
   - Uncomment and implement all core methods currently disabled
   - Define number pools for range 1–39 (Low-Odd, Low-Even, High-Odd, High-Even)
   - Implement scraping logic for `https://wilottery.com/winners/draw-history?game=super-cash`
   - Note: SuperCash class is now instantiable without the SuperCashPD dependency. The constructor no longer requires external dependencies.

   **Done when:** SuperCash `generateTickets()` returns properly structured ticket arrays with 6-number panels per sub-pattern.

- [ ] **6.2 — Wire SuperCash into API endpoints**
   - Enable SuperCash in `GET /api/games` list
   - Add route handlers for `/api/games/super-cash/*` endpoints
   - Handle 6-number panel display (vs Badger Five's 5)

   **Done when:** User can select Super Cash from dashboard and generate panels.

- [ ] **6.3 — Adapt frontend components for variable panel sizes**
   - Ball/PanelDisplay components must handle both 5 and 6 numbers per panel
   - Pattern labels adjust to game-specific distributions

   **Done when:** Both games render correctly without code duplication.

---

## Phase 7 — Production Hardening (Future)

Infrastructure improvements for deployment beyond local development.

- [ ] **7.1 — Add Docker health check**
   - `curl -f http://localhost/` probe in docker-compose.yml
   - 30s interval, 5s timeout, 3 retries, 10s start period

   **Done when:** Container auto-recovers from hung PHP-FPM processes.

- [ ] **7.2 — Consolidate Dockerfile RUN layers**
   - Merge three `apt-get update` cycles into one layer
   - Remove dev headers (`libpng-dev`, etc.) in same layer as extension compilation
   - Add `.dockerignore` to exclude `node_modules/`, `.git/`, `OLD/`

   **Done when:** Docker image size is reduced by ≥30%.

- [ ] **7.3 — HTTPS/TLS termination**
   - Add reverse proxy (Traefik or Caddy) in front of Nginx for remote deployment
   - Or configure Let's Encrypt certbot integration

   **Done when:** Application serves over HTTPS with valid certificate.

---

## Phase Dependencies

```
Phase 0 ──▶ Phase 1 ──▶ Phase 2 ──▶ Phase 3
   │             │           │          │
   └─────────────┴───────────┘          │
         ↕                              │
    Phase 4 ◀───────────────────────────┘
       │
       ▼
    Phase 5 ──▶ Phase 6 (Super Cash) ──▶ Phase 7 (Production)
```

- **Phase 0** must complete before anything else — it fixes the foundation
- **Phases 1–3** can partially overlap once mock API works (Phase 1.1 done)
- **Phase 4** depends on all frontend components being functional (Phase 2.10 + Phase 3.1)
- **Phase 5** is independent of frontend; can run in parallel with Phases 2–3
- **Phase 6+** requires Badger Five to be fully working end-to-end

---

## Visual Design Reference

### Desktop Layout (≥768px) - Split View with Pattern Distribution
```
┌────────────────────────────────────┬───────────────────────────────────┐
│                                    │                                   │
│   Previous Drawings                │     Generated Panels              │
│   ─────────────────                │     ─────────────────             │
│                                    │                                   │
│  Pattern Distribution              │     Tickets: [3 ▼]                │
│  (Last 50 Drawings)                │     Auto-generate on change       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━          │                                   │
│  3O/2E, 3L/2H ████████████░░ 80%   │     ┌─────────────────────┐       │
│  3O/2E, 2L/3H ████░░░░░░░░░░ 40%   │     │   Ticket Card 1     │       │
│  2O/3E, 3L/2H ██░░░░░░░░░░░░ 20%   │     ├─────────────────────┤       │
│                                    │     │  Sub-Pattern 1      │       │
│  ────────────────────────          │     │  ● ○ ● ● ○          │       │
│                                    │     ├─────────────────────┤       │
│  [Monday, Jan 15th]                │     │  Sub-Pattern 2      │       │
│  Pattern: 3L/2H                    │     │  ○ ● ● ○ ●          │       │
│  ● ○ ● ● ○                         │     └─────────────────────┘       │
│                                    │                                   │
│  [Sunday, Jan 14th]                │   More tickets scroll here...     │
│  Pattern: 2L/3H                    │                                   │
│  ○ ● ● ● ○                         │                                   │
│                                    │                                   │
└────────────────────────────────────┴───────────────────────────────────┘

Left Panel (5/12 width)              Right Panel (7/12 width)
- Sticky pattern stats               - Generation form at top
- Scrollable drawings below          - Generated panels in grid below
``` 

### Mobile Layout (<768px) - Tabbed Interface
```
┌─────────────────────────────────┐
│   Previous Drawings  │ Generate │ ← Tabs (toggle)
├─────────────────────────────────┤
│                                 │
│  Pattern Distribution           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━       │
│  3O/2E, 3L/2H ████████░░ 80%    │
│  3O/2E, 2L/3H ████░░░░░░ 40%    │
│                                 │
│  [Monday, Jan 15th]             │
│  Pattern: 3L/2H                 │
│  ● ○ ● ● ○                      │
│                                 │
│  [Sunday, Jan 14th]             │
│  Pattern: 2L/3H                 │
│  ○ ● ● ● ○                      │
│                                 │
│  ...more drawings scroll...     │
│                                 │
└─────────────────────────────────┘

Tab 1 Active (Previous Drawings)
- Pattern distribution at top
- Scrollable drawing cards below
```

### Mobile Layout (<768px) - Generated Panels Tab
```
┌─────────────────────────────────┐
│   Previous │ Generate Panels    │ ← Tabs (toggle)
├─────────────────────────────────┤
│                                 │
│  Generate Optimized Panels      │
│                                 │
│  Tickets: [3 ▼]                 │
│  [Generate Button]              │
│                                 │
│  ┌─────────────────────┐        │
│  │   Ticket Card 1     │        │
│  ├─────────────────────┤        │
│  │  Sub-Pattern 1      │        │
│  │  ● ○ ● ● ○          │        │
│  └─────────────────────┘        │
│                                 │
│  More tickets scroll here...    │
│                                 │
└─────────────────────────────────┘

Tab 2 Active (Generated Panels)
- Simple generation form (ticket count only)
- Generated panels display below
```

---

## Success Criteria

The project is considered complete (Badger Five MVP) when all of these are true:

| # | Criterion | Phase |
|---|-----------|-------|
| 1 | `docker compose up --build` starts without errors | 0 |
| 2 | All 4 API endpoints return valid JSON | 1 |
| 3 | Dashboard displays game cards and navigates to game pages | 2 |
| 4 | Game page shows historical drawings with full pattern text and balls matching legacy UI | 2 + 3 |
| 5 | Panel generation form works (ticket count dropdown, auto-generate on desktop) | 2 |
| 6 | Generated panels display real data from BadgerFive class | 4 |
| 7 | Tab switching between "Previous Drawings" and "Generated Panels" works smoothly on mobile; split-view renders on desktop | 2 + 3 |
| 8 | Responsive split-view layout works on mobile (<768px tabs) and desktop (≥768px split-view) | 3 |
| 9 | Pattern distribution shows accurate pattern statistics with color-coded bars from history data | 2 + 3 |
| 10 | No PHP errors visible to end users; errors logged only | 0 |
| 11 | PWA installs and serves cached content offline | existing |

---

## File Inventory: What Gets Created/Modified

### Backend — New Files
```
backend/composer.json              # PSR-4 autoloading + Slim dependencies
backend/controllers/GamesController.php  # Route handlers for all game endpoints
backend/vendor/                    # Composer vendor directory (gitignored)
backend/api.php                    # Slim Framework router entry point
backend/games/GameInterface.php    # Interface for all game classes
```

### Backend — Modified Files
```
backend/_functions.php             # Updated or replaced by Composer autoloader
backend/games/BadgerFive.php       # Namespace, types, interface implementation
backend/games/SuperCash.php        # Remove SuperCashPD dependency, add runtime checks, fix simplehtmldom path
docker-compose.yml                 # Fix volume mount path to relative bind
docker/Dockerfile                  # Display_errors off, consolidated RUN layers
docker/nginx.conf                  # Add fastcgi_split_path_info directive
```

### Frontend — New Files
```
frontend/.env                      # VITE_API_BASE_URL configuration
frontend/src/contexts/GameContext.jsx    # State management with useReducer
frontend/src/services/api.js               # Fetch wrapper for all API endpoints
frontend/src/hooks/useGameHistory.js       # History data hook
frontend/src/hooks/useGenerateTickets.js   # Ticket generation hook (each ticket = group of panels)
frontend/src/components/layout/Layout.jsx  # App shell (header + main)
frontend/src/components/common/Tabs.jsx    # Tab navigation component
frontend/src/components/games/Ball.jsx     # Number ball display
frontend/src/components/games/DrawingCard.jsx   # Historical drawing card
frontend/src/components/games/PanelDisplay.jsx  # Generated panel groups
frontend/src/components/games/PatternDistribution.jsx   # Pattern frequency bar chart
frontend/src/pages/Dashboard.jsx           # Game selection landing page
frontend/src/pages/GamePage.jsx            # Main game view with tabs
frontend/src/pages/HistoryPage.jsx         # Full history browser (stub)
```

### Frontend — Modified Files
```
frontend/package.json              # Add react-router-dom dependency
frontend/src/main.jsx              # BrowserRouter wrapper + GameProvider
frontend/src/App.jsx               # Router outlet replacing placeholder counter
frontend/vite.config.js            # Environment variable support for API proxy
```
