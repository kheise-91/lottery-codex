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
| **Frontend** | Placeholder counter in App.jsx; Tailwind configured but unused | Full SPA: Dashboard game selection with GameCard components; GamePage stub; Layout shell with branded header |
| **Routing** | No router installed | React Router DOM v6, 2 active routes (`/`, `/games/:gameId`) |
| **Pattern health** | No frequency analysis; all patterns treated equally | Per-pattern playability indicators based on historical frequency |
| **State management** | Single `useState(0)` placeholder | Context API + useReducer via GameProvider for games/selectedGame/history/ticketResults; auto-fetches games on mount |
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

- [x] **[1.4 — Install React Router DOM v6 in frontend](https://gitea.heise.home/kheise/lottery-codex/milestone/28)**
   - `npm install react-router-dom@6` in `frontend/`
   - Set up `<BrowserRouter>` wrapper in `main.jsx`

   **Done when:** Frontend builds without errors and renders a router outlet.

- [x] **[1.5 — Create API service layer (`src/services/api.js`)](https://gitea.heise.home/kheise/lottery-codex/milestone/29)**
   - Build a lightweight fetch wrapper with base URL configuration
   - Export functions: `fetchGames()`, `fetchGameDetails(id)`, `fetchHistory(id)`, `generateTickets(id, count)`
   - Configure Vite `.env` with `VITE_API_BASE_URL` for dev/prod flexibility

   **Done when:** Service functions return typed JSON responses from the backend.

- [x] **[1.6 — Create custom hooks (`src/hooks/`)](https://gitea.heise.home/kheise/lottery-codex/milestone/30)**
   - `useGameHistory(gameId)` → fetches and caches historical drawings, returns `{data, loading, error}`
   - `useGenerateTickets(gameId)` → triggers ticket generation (each ticket contains multiple panels), returns `{tickets, loading, error, generate}`

   **Done when:** Hooks can be consumed by components without direct API calls.

---

## Phase 2 — Frontend Core Components

Build the React component hierarchy.

- [x] **[2.1 — Set up Context + useReducer state management](https://gitea.heise.home/kheise/lottery-codex/milestone/31)**
   - Create `src/contexts/GameContext.jsx` with reducer for: games list, selected game, history data, ticket results
   - Actions: `SET_GAMES`, `SELECT_GAME`, `FETCH_HISTORY`, `GENERATE_TICKETS`
   - Wrap app in `<GameProvider>`

   **Done when:** Components can dispatch actions and read state from context.

- [x] **[2.2 — Build Layout shell (`src/components/layout/Layout.jsx`)](https://gitea.heise.home/kheise/lottery-codex/milestone/32)**
   - Header with "Lottery Codex" branding
   - Main content area for page routing
   - Mobile-first, full-height flex column layout

   **Done when:** Layout renders consistently across mobile and desktop viewports.

- [x] **[2.3 — Create Dashboard page (`src/pages/Dashboard.jsx`)](https://gitea.heise.home/kheise/lottery-codex/milestone/33)**
   - Giant card-like buttons for each available game (Badger 5, Superash!, Megabucks)
   - There will be 3 cards per row
   - Cards get game details and displays the following information: game name image, description, status, draw frequency, odds of winning, and current jackpot
      - Card header has the game image (saved as `frontend/public/[game-id].svg`)
      - Number range and number of balls will be described in the description
      - The current jackpot value will just be a placeholder for this phase
      - Status appears as a badge in the top right corner
      - Below the description is a 3 column row, with icons for each item: draw frequency | odds of winning | current jackpot
      - Footer contains link to the game page that reads "Play Now ->" if enabled or "Coming Soon" if disabled
   - Click navigates to `/games/{gameId}`

   **Done when:** Card "buttons" render on the dashboard correctly and the user can select a game from the dashboard.

- [x] **[2.4 — Create Ball component (`src/components/games/Ball.jsx`)](https://gitea.heise.home/kheise/lottery-codex/milestone/34)**
   - Circular element (32px), centered text, bordered
   - 3d appearance
   - Accepts `number` prop
   - Support variant colors based on the game's main color in `frontend/src/index.css` AND the sub-pattern it belongs to
   - Will be used in the future `DrawingCard.jsx` and `TicketCard.jsx` components
      - There will be 5 or 6 balls in a panel, depending on the game
      - `DrawingCard.jsx` will have one panel (historical winning draws)
      - `TicketCard.jsx` will have multiple tickets, with multiple panels, depending on the game's pattern property (each sub-pattern is a panel)

   **Done when:** Ball renders numbers with a 3d appearance and color matching the game and sub-pattern

- [x] **[2.5 — Create DrawingCard component (`src/components/games/DrawingCard.jsx`)](https://gitea.heise.home/kheise/lottery-codex/milestone/35)**
   - This is the historical winning data
   - Each card represents a winning ticket (one panel - number of balls is dependent on the game)
   - Shows: date (formatted "Monday, January 1st"), full pattern string (e.g., "3-Odd 2-Even / 3-Low 2-High"), row of number balls
   - The most recent drawing will use the game id as the color variant for the `Ball.jsx` component
   - The remaning drawings will use the white variant for the `Ball.jsx` component

   **Done when:** Historical drawings render as cards with the date of the drawing, the pattern of the draw, and the exact numbers drawn.

- [x] **[2.6 — Create TicketCard component (`src/components/games/TicketCard.jsx`)](https://gitea.heise.home/kheise/lottery-codex/milestone/36)**
   - Each ticket renders as a white card, rounded corners, border, and a hover lift effect with shadow (primary color shadow from theme in `index.css`)
   - Ticket header area:
      - Game name ("Badger Five") on the left
      - Ticket ID below the game name - [gameInitials-date-ticketNumber] (Badger 5: "BF-yymmdd-01", SuperCash!: "SC-yymmdd-01", Megabucks: "MB-yymmdd-01")
      - Decorative barcode on the right — made of vertical div bars with varying widths and heights
   - Each panel has a dashed colored border (primary color from theme in `index.css`) on a gray translucent background with rounded corners
   - Colored accent bar on the left edge (6px wide, full height, rounded on left corners only) — uses the game's main color from the theme in `index.css`
   - Panel badge pill in the header row (e.g., "Panel A", "Panel B") — rounded-full, with the game's main color for text and the game's lightest color for background
   - Row of 5 white variant Ball components
   - Ticket footer: thin separator line, right-aligned timestamp (e.g., "July 26, 2026 · 09:41 AM")
   - Multiple tickets are separated by a perforation zone — strip with radial gradient dots on a transparent background, indented from edges

   **Done when:** Generated tickets render as physical-ticket-style cards with correct text, coloring, panels, white 3D balls, barcodes, and hover lift effects.

- [x] **[2.7 — Create BottomNavTabs component (`src/components/layout/BottomNavTabs.jsx`, mobile only)](https://gitea.heise.home/kheise/lottery-codex/milestone/37)**
    - Sticky bottom navigation bar with two tabs: "Previous Drawings" (clock icon) / "Generated Tickets" (ticket icon)
    - Active tab uses emerald color (`--color-primary` / `#059669`) for both icon and label, plus a 3px top border indicator line; inactive tabs are gray
    - Hidden on desktop (≥768px) where split-view is used instead
    - Use `@headlessui/react` Tab component (already installed)
    - Appears below the game header section on mobile — sits at the bottom of the viewport, above it are the tab content panels

    **Done when:** Bottom-nav tabs switch content without page reload; hidden on desktop breakpoint.

- [x] **[2.8 — Build GamePage (`src/pages/GamePage.jsx`) with emerald header + flat drawing list + ticket carousel](https://gitea.heise.home/kheise/lottery-codex/milestone/38)**
    - Rename `DrawingCard` component to reflect its new role as a flat list item rather than a card (no card wrapper, shadow, or hover lift)
    - Remove `TicketList` component entirely; promote `TicketCard` to the main export of that file — since tickets are now displayed via carousel instead of stacked with perforation dividers, the list-wrapper logic is no longer needed. Update all imports referencing `TicketList` accordingly.
    - Create new `TicketCarousel` component: single-ticket-per-slide carousel with circular frosted-glass arrow buttons on left and right edges, horizontal slide track, and dot indicators at bottom where the active dot expands into a pill shape colored with the game's primary color
    - **Game header section** (visible on both desktop and mobile):
       - Tablet+ (≥768px): Single bordered container with rounded corners and subtle shadow, split into two columns — left side has game name as large bold heading with description underneath; right side is a 3-column grid divided by vertical dividers, each column containing: game-primary-colored icon (calendar / bar chart / coin), uppercase label ("Draw", "Odds", "Jackpot") in small gray tracking-wide text, and bold value text
       - Mobile (<768px): Single column — game name, description, then the same 3-column stat row as a bordered container below with smaller icons, smaller labels, and values colored with the game's primary color
    - Desktop (≥768px): Split-view grid in 7/5 column ratio:
       - Left column (7/12): Flat on page background, no card wrapper — emerald gradient header bar (~48px tall) with centered clock icon and "Previous Drawings" text; below it a 2-column grid where left half shows **Pattern Distribution** (flat, placeholder for now, see sub-phase 2.9) and right half shows the latest drawing as flat content: date header with pulsing red-dot "Latest" badge pill on light red background, centered pattern pill badge with bar-chart icon on gray background, colored balls row using game's theme color
       - Remaining drawings below as flat bordered list items separated by thin dividers with vertical padding: date header with relative time-ago text (e.g., "3 days ago") on the right, centered pattern pill badge, white variant balls row
       - Right column (5/12): Emerald gradient header bar (~48px tall) with centered ticket icon and "Generated Tickets" text; form section below with pattern health status indicator (colored dot + message), ticket count dropdown (1-10); generated tickets displayed in the **TicketCarousel** component
    - Mobile (<768px): Tabbed interface with separate content areas:
       - Drawings tab: emerald gradient header bar ("Previous Drawings"), pattern distribution section, latest drawing with colored balls + Latest badge, remaining drawings as flat bordered list items
       - Tickets tab: emerald gradient header bar ("Generated Tickets"), pattern health status (placeholder for now - not implemented until later phase), ticket count dropdown paired side-by-side with an explicit "Generate" button (emerald background, lightning bolt icon), TicketCarousel below with arrow buttons and dot indicators
    - BottomNavTabs on mobile: two tabs labeled "Drawings" (clock icon) / "Tickets" (ticket icon), active tab uses primary color for icon and label with a 3px top border indicator pill; hidden on desktop where split-view is used instead
    - Form controls: ticket count dropdown only (1-10) — no pattern selector; pattern is internal to each game class
    - Desktop: auto-generate tickets when ticket count changes; Mobile: explicit "Generate" button triggers generation (lightning bolt hero icon or svg if no hero icon available)
    - Uses `useGameHistory` and `useGenerateTickets` hooks

    **Done when:** User can view drawings (flat list with latest highlighted), generate tickets, and browse results via carousel — emerald gradient header on desktop split-view and mobile tabs.

- [ ] **2.9 — Create PatternDistribution component (`src/components/games/PatternDistribution.jsx`)**
   - Calculates and displays pattern frequencies from historical drawings (past 100 drawings)
   - Shows heading "Pattern Distribution" with subtitle "Last 100 Drawings" in small gray text
   - Each pattern entry: left-aligned pattern label (full lable, no abbreviations) in small medium-weight dark gray, right-aligned percentage value (e.g., "80%") in game's primary color, above a full-width bar track on light gray background with rounded ends and thin height — filled portion uses game's primary color where higher percentages render as solid fill and lower percentages use reduced opacity on the same color
   - Does NOT use card-like appearance — elements render directly on page background (flat), no border or background wrapper

    **Done when:** Pattern distribution renders accurate statistics from history data as flat content with correct color and opacity tiers.

- [x] **2.10 — Wire up React Router in App.jsx**
    - Routes: `/` → Dashboard, `/games/:gameId` → GamePage (stub)
    - Layout wraps all routes with `<Outlet />`

   **Done when:** All routes render without errors; navigation works.

- [ ] **2.11 — Add loading and error states**
    - Skeleton loaders for history fetching and panel generation
    - Error banners for API failures (network errors, invalid game)
    - Disabled button state during in-flight requests
    - Pattern distribution shows "No data" message when history is empty

   **Done when:** User sees meaningful feedback during all async operations.

---

## Phase 3 — Pattern Health Analysis

Analyze historical drawings to compute pattern frequency and "playability" indicators. This enables the UI to alert users when a pattern is overdue for occurrence.

- [ ] **3.1 — Analyze pattern frequencies in game classes**
   - After loading previous drawings, iterate over `$this->previousDrawings` to count occurrences of each unique pattern string (e.g., "3-Odd 2-Even / 3-Low 2-High")
   - For each pattern, calculate average interval between consecutive occurrences (in days) by parsing date headers with `strtotime()`
   - Track days-since-last-occurrence for each pattern using the most recent drawing date vs. today
   - Store results in a new private property: `$this->patternHealth = ['3-Odd 2-Even / 3-Low 2-High' => ['avgInterval' => 3, 'daysSince' => 4]]`

   **Done when:** Each game class can compute pattern health from its own history data with zero additional API calls.

- [ ] **3.2 — Add `getPatternHealth()` to GameInterface and game classes**
   - Define `getPatternHealth(): array` in `GameInterface.php`
   - Return format: array of objects, each with keys: `pattern`, `avgInterval` (int), `daysSince` (int), `status` (`active` | `good` | `caution`)
   - Status logic: `active` if daysSince ≤ 1, `good` if daysSince ≥ avgInterval + 1, otherwise `caution`
   - Implement in both `BadgerFive.php` and `SuperCash.php`

   **Done when:** Both game classes return pattern health arrays via the interface method.

- [ ] **3.3 — Expose pattern health via API**
   - Update `GET /api/games/{gameId}` to include a `patternHealth` field in its response (array of `{pattern, avgInterval, daysSince, status}` objects)
   - If no history is available, return empty array

   **Done when:** Endpoint returns pattern health alongside game details.

   **Done when:** API includes `patternHealth` in `/api/games/badger-five` response.

- [ ] **3.4 — Render pattern health cards in GamePage**
   - Display each pattern as a small card below the ticket count form on desktop, or above drawings tab content on mobile
   - Color-coded status indicator: green dot for `active`, teal/emerald for `good`, amber for `caution`
   - Text format: `"Pattern 'X' occurs every ~{N} days. Last seen {X} day(s) ago — it's okay to play."` (adjust message per status)
   - Use concise messages matching these templates:
     - `active`: "Pattern active — drawing expected soon."
     - `good`: "It's okay to play."
     - `caution`: "Pattern is on schedule. Consider waiting."

   **Done when:** Game page shows pattern health cards with correct colors and messages for each discovered pattern.

---

## Phase 4 — Real Data Integration

Replace mock data with actual BadgerFive game class instances. This is where the backend scraping and panel generation logic becomes live.

- [ ] **4.1 — Wire BadgerFive into API endpoints**
   - Replace mock history in `GET /api/games/badger-five/history` with `$game->getHistory()`
   - Replace mock tickets in `POST /api/games/badger-five/generate` with `$game->generateTickets($tickets)`
   - Add try-catch wrappers around game class calls

   **Done when:** API returns real data from BadgerFive for both history and generation.

- [ ] **4.2 — Verify frontend displays real data correctly**
   - Confirm historical drawings match what the Wisconsin Lottery website shows
   - Verify generated tickets follow pattern distributions (odd/even, low/high)
   - Test edge cases: single ticket, max tickets, all patterns

   **Done when:** End-to-end flow works: Dashboard → Game Page → Generate → Real tickets displayed.

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

## Phase 6 — SuperCash! & Megabucks Integration (Future)

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

   **Done when:** User can select Super Cash from dashboard and generate tickets.

- [ ] **6.3 — Adapt frontend components for variable panel sizes**
   - Ball/DrawingCard/TicketCard components must handle both 5 and 6 numbers per panel
   - Pattern labels adjust to game-specific distributions

   **Done when:** Both games render correctly without code duplication.

- [ ] **6.4 — Create MegaBucks game class**
   - Implement `GameInterface` with number range 1–48, draw 6 numbers
   - Define number pools: Low-Odd (1,3,…,25), Low-Even (2,4,…,24), High-Odd (27,29,…,47), High-Even (26,28,…,48)
   - Define internal pattern array for panel generation (odd/even × low/high distribution)
   - Implement scraping logic for `https://wilottery.com/winners/draw-history?game=megabucks`

   **Done when:** `new MegaBucks()` instantiates and returns valid results from all interface methods.

- [ ] **6.5 — Wire MegaBucks into API and frontend**
   - Register MegaBucks in the controller's `$registry`: `'megabucks' => \LotteryCodex\Games\MegaBucks::class`
   - Dashboard card auto-appears via `GET /api/games` (no new endpoint needed)
   - Frontend navigates to `/games/megabucks`; Ball/DrawingCard/TicketCard handle 6-number panels

   **Done when:** User can select MegaBucks from dashboard, view history, and generate tickets alongside Super Cash.

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
- **Phases 1–2** can partially overlap once mock API works (Phase 1.1 done)
- **Phase 3 backend parts (3.1–3.3)** are independent of frontend; can run in parallel with Phases 2–4
- **Phase 3 UI part (3.4)** depends on GamePage being functional (Phase 2.8 + Phase 3.3)
- **Phase 5** is independent of frontend; can run in parallel with Phases 2–4
- **Phase 6+** requires Badger Five to be fully working end-to-end

---

## Visual Design Reference

### Desktop Layout (≥768px) - Split View with Emerald Headers
```
[ Emerald Gradient App Header — full width, grid overlay, decorative curve ]
  Lottery Codex logo + brand name

[ Game Header — bordered container, two columns ]
  ┌─────────────────────┬──────────────────────────┐
  │ Badger Five         │ [Cal] Draw   [Bar] Odds  │
  │ Pick 5 from 1-31... │        Wed | Sun    1 in │
  │                     │                    575   │
  └─────────────────────┴──────────────────────────┘

[ Split View — 7/5 ratio ]
┌──────────────────────────────┬───────────────────────────────┐
│ [Emerald] Previous Drawings  │ [Emerald] Generated Tickets   │
├──────────────────────────────┤───────────────────────────────┤
│ Pattern Dist. | Latest       │ ● It's okay to play.          │
│ ──────────────| ┌──────────┐ │ Tickets: [3 ▼]               │
│ 3O/2E,3L/2H ███░ 80%        │ │                    ◄  ►     │
│ 3O/2E,2L/3H ██░░ 40%        │ │   Ticket Card 1             │
│ 2O/3E,3L/2H █░░░ 20%        │ │  Panel A: ● ○ ● ● ○         │
│                              │ │  Panel B: ● ○ ● ● ○         │
│ [Mon Jan 15] Latest          │ │                    ◄  ►     │
│ Pattern pill + colored balls │ └─────────────────────────────┘
│ [Sun Jan 14] 3 days ago      │                               │
│ Pattern pill + white balls   │  ...more tickets in carousel  │
│ [Wed Jan 10] 1 week ago      │    with dot indicators below  │
│ Pattern pill + white balls   │                               │
└──────────────────────────────┴───────────────────────────────┘

Left Column (7/12)                    Right Column (5/12)
- Emerald header bar                  - Emerald header bar
- Flat pattern distribution           - Pattern health indicator
- Flat latest drawing                 - Ticket count dropdown
  (date + Latest badge)               - TicketCarousel component
- Flat bordered list of older         - Arrow buttons + dot indicators
  drawings (date, pill, white balls)
```

### Mobile Layout (<768px) - Drawings Tab Active
```
[ Emerald Gradient App Header ]
[ Game Header — single column stack ]
  Badger Five
  Pick 5 from 1-31...
  ┌─────────────────────────────┐
  │ [Cal] Draw   [Bar] Odds    │
  │        Wed | Sun     1 in  │
  └─────────────────────────────┘

[ Emerald ] Previous Drawings [ Generated Tickets ]  ← Tab headers
─────────────────────────────────────────────────────
Pattern Distribution
Last 100 Drawings
3O/2E,3L/2H ████████░░ 80%
3O/2E,2L/3H ████░░░░░░ 40%

[Mon Jan 15]          Latest ●───
Pattern pill + colored balls

[Sun Jan 14]          3 days ago
Pattern pill + white balls

[Wed Jan 10]          1 week ago
Pattern pill + white balls
...more drawings scroll...

[ BottomNavTabs — Drawings (active) | Tickets ]
```

### Mobile Layout (<768px) - Tickets Tab Active
```
[ Emerald Gradient App Header ]
[ Game Header ]

[ Emerald ] Previous Drawings [ Generated Tickets ]  ← Tab headers
─────────────────────────────────────────────────────
● It's okay to play.

Tickets: [3 ▼]    ⚡ Generate

◄   Ticket Card 1   ►
  Panel A: ● ○ ● ● ○
  Panel B: ● ○ ● ● ○

◄   Ticket Card 2   ►
...

[ BottomNavTabs — Drawings | Tickets (active) ]
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
| 5 | Ticket generation form works (ticket count dropdown, auto-generate on desktop) | 2 |
| 6 | Pattern health cards display correct colors and messages based on pattern frequency analysis | 3 |
| 7 | Generated tickets display real data from BadgerFive class | 4 |
| 8 | Tab switching between "Previous Drawings" and "Generated Tickets" works smoothly on mobile; split-view renders on desktop | 2 + 3 |
| 9 | Responsive split-view layout works on mobile (<768px tabs) and desktop (≥768px split-view) | 3 |
| 10 | Pattern distribution shows accurate pattern statistics with color-coded bars from history data | 2 + 3 |
| 11 | No PHP errors visible to end users; errors logged only | 0 |
| 12 | PWA installs and serves cached content offline | existing |

---

## File Inventory: What Gets Created/Modified

### Backend — New Files
```
backend/composer.json              # PSR-4 autoloading + Slim dependencies
backend/controllers/GamesController.php  # Route handlers for all game endpoints
backend/vendor/                    # Composer vendor directory (gitignored)
backend/api.php                    # Slim Framework router entry point
backend/games/GameInterface.php    # Interface for all game classes; add getPatternHealth() method
backend/games/Megabucks.php        # Megabucks game implementation (1-48, draw 6)
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
frontend/.env                                            # VITE_API_BASE_URL configuration
frontend/src/contexts/GameContext.jsx                    # State management with useReducer
frontend/src/services/api.js                             # Fetch wrapper for all API endpoints
frontend/src/hooks/useGames.js                           # Game list fetch hook with loading/error/data states
frontend/src/components/layout/Layout.jsx                # App shell (header + main)
frontend/src/components/layout/BottomNavTabs.jsx         # Bottom-nav tab switcher for mobile (hidden on desktop)
frontend/src/components/games/Ball.jsx                   # Number ball display
frontend/src/components/games/DrawingCard.jsx            # Historical drawing row (flat list item, not a card; renamed from previous card-based design)
frontend/src/components/games/TicketCard.jsx             # Single generated ticket card (promoted to main export after TicketList removal)
frontend/src/components/games/TicketCarousel.jsx         # Ticket carousel with arrows and dot indicators
frontend/src/components/games/PatternDistribution.jsx    # Pattern frequency bar chart
frontend/src/components/games/GameCard.jsx               # Reusable game selection card
frontend/src/pages/Dashboard.jsx                         # Game selection landing page with responsive card grid
frontend/src/pages/GamePage.jsx                          # Stub placeholder for game detail view
```

### Frontend — Modified Files
```
frontend/package.json              # Add react-router-dom dependency
frontend/src/main.jsx              # BrowserRouter wrapper + GameProvider
frontend/src/App.jsx               # Router outlet replacing placeholder counter
frontend/vite.config.js            # Environment variable support for API proxy
frontend/src/components/games/TicketList.jsx    # Removed — TicketCard promoted to standalone component, carousel replaces stacked layout with perforation dividers
```
