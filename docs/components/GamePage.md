# GamePage

**File:** `frontend/src/pages/GamePage.jsx`

## Purpose

Game detail page rendered at `/games/:gameId`. Displays game metadata (name, description, draw frequency, odds, jackpot), historical drawing data, and generated ticket panels. Uses a **desktop split-view layout** (7/5 column grid) on screens ≥768px and a **mobile tabbed interface** (Drawings / Tickets tabs) on smaller screens.

## Props

None. The component reads `gameId` from the URL via React Router's `useParams`.

## State

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| `gameDetails` | `object \| null` | `null` | Fetched game metadata (name, description, drawFrequency, odds) from the API |
| `gameDetailsLoading` | `boolean` | `true` | Tracks whether the game details fetch is in flight; drives the header skeleton via `useMinLoading` |
| `ticketCount` | `number` | `3` | Number of tickets to generate; drives auto-generation on desktop |
| `activeTab` | `number` | `0` | Active mobile tab index (`0` = Drawings, `1` = Tickets) |

### Refs

| Ref | Mirrors | Description |
|-----|---------|-------------|
| `generatingRef` | `generating` (from `useGenerateTickets`) | Ref mirror of the in-flight state, kept in sync via a `useEffect`. Read inside the desktop auto-generate effect so that adding `generating` to that effect's dependency array is not required (which would re-fire the effect and produce a duplicate request when `generating` flips back to `false`) |

## Side Effects

| Effect | Trigger | Behavior |
|--------|---------|----------|
| Fetch game details | `gameId` changes | Calls `fetchGameDetails(gameId)` with cancellation guard; sets `gameDetailsLoading: true` at start, `false` in `finally`; sets `gameDetails` on success |
| Sync `generatingRef` | `generating` changes | Sets `generatingRef.current = generating` so the auto-generate effect can read the in-flight state without depending on it |
| Auto-generate tickets | `ticketCount` or `gameId` changes (desktop only) | Calls `generate(ticketCount)` when `window.innerWidth >= 768` **and** no request is already in flight (`generatingRef.current === false`); enables seamless ticket count adjustment on desktop without overlapping requests |

## Derived Data

| Variable | Source | Description |
|----------|--------|-------------|
| `drawings` | `useGameHistory(gameId)` → `history` | Transformed array of `{date, numbers, pattern}` objects from the history response |
| `carouselTickets` | `tickets` (from `useGenerateTickets`) | Mapped to `[{ ticketData, index }]` format expected by `TicketCarousel` |
| `latestDrawing` | `drawings[0]` | Most recent drawing, rendered with `isRecent={true}` |
| `olderDrawings` | `drawings.slice(1)` | Remaining drawings rendered as a flat list |
| `showHistorySkeleton` | `useMinLoading(historyLoading, MIN_SKELETON_MS)` | Gated flag: `true` while history is loading OR for at least 2000ms after it started |
| `showTicketSkeleton` | `useMinLoading(generating, MIN_SKELETON_MS)` | Gated flag: `true` while tickets are generating OR for at least 2000ms after it started |
| `showHeaderSkeleton` | `useMinLoading(gameDetailsLoading, MIN_SKELETON_MS)` | Gated flag: `true` while game details are loading OR for at least 2000ms after it started |

The page-level constant `MIN_SKELETON_MS = 2000` is passed to all three `useMinLoading` calls so that all skeleton areas (header, history, tickets) stay visible for a synchronized minimum duration, preventing a jarring flash when the API responds in under a second.

## Layout Structure

### Game Header (shared across breakpoints)

While `showHeaderSkeleton` is true, the header renders a skeleton placeholder instead of real content:

- **Desktop skeleton:** Two-column grid mirroring the real layout — name bar (160px × 24px) + description bar (full width × 14px) on the left, three 48px circle placeholders in the stat row on the right
- **Mobile skeleton:** Stacked name bar + description bar followed by three 48px circle placeholders in a bordered grid row

When `showHeaderSkeleton` is false, the real header renders:

- **Desktop (≥768px):** Two-column grid (`md:grid-cols-2`) with game name/description on the left and three stat pills (Draw, Odds, Jackpot) on the right, separated by vertical dividers
- **Mobile (<768px):** Single column with game name/description followed by three stat pills in a bordered grid row

### Desktop Split-View (`hidden md:grid md:grid-cols-12`)

| Column | Span | Content |
|--------|------|---------|
| Left | `col-span-7` (≈58%) | `ErrorBanner` (when `historyError`), Previous Drawings header, Pattern Distribution (skeleton while loading), latest drawing, older drawings list (skeleton rows while loading) |
| Right | `col-span-5` (≈42%) | Generated Tickets header, pattern health status, ticket count dropdown (`disabled` while `generating`), `TicketCarousel` (skeleton ticket placeholder while generating), `ErrorBanner` (when `generateError`) |

### Mobile Tabbed Interface (`md:hidden`)

| Element | Description |
|---------|-------------|
| `BottomNavTabs` | Sticky bottom navigation bar with Drawings/Tickets tabs |
| Tab content area | Renders `drawingsTabContent` (tab 0) or `ticketsTabContent` (tab 1) based on `activeTab` state |
| Bottom padding | `pb-20` to prevent content from being hidden behind the fixed bottom nav |

### Mobile Tab Content Details

**Drawings tab:**
- `ErrorBanner` (when `historyError`) — "Failed to load drawing history. Please try again."
- Section header with clock icon ("Previous Drawings")
- Pattern Distribution rendered via `<PatternDistribution history={history?.history} gameId={gameId} />`, or a skeleton placeholder (heading + 3 bar rows) while `showHistorySkeleton` is true and no drawings exist yet
- Latest drawing rendered via `<DrawingItem isRecent={true} />`
- Older drawings rendered as flat list via `<DrawingItem />`
- Skeleton drawing rows (4 × date strip + pattern pill + 5 ball circles) when history is fetching with no results

**Tickets tab:**
- Section header with ticket icon ("Generated Tickets")
- Pattern health status placeholder (green dot + "It's okay to play.")
- Ticket count dropdown (1–10) with "Generate" button (side-by-side layout). Both the dropdown and the Generate button are `disabled` while `generating` is true, with reduced opacity and a not-allowed cursor
- `TicketCarousel` for browsing generated tickets, or a skeleton ticket placeholder (header + 3 panel rows with 5 ball circles each + footer) while `showTicketSkeleton` is true
- `ErrorBanner` (when `generateError`) — "Failed to generate tickets. Please try again."

### Internal Components

| Component | Purpose |
|-----------|---------|
| `StatPill` | Desktop stat pill with icon, uppercase label, and value; renders in the two-column header grid |
| `StatPillMobile` | Mobile stat pill with smaller icons/values; renders in the single-column stacked layout |

## Routing

| Route | Parameter | Description |
|-------|-----------|-------------|
| `/games/:gameId` | `gameId` (string) | Game identifier from URL (`badger-five`, `supercash`, `megabucks`) |

The `gameId` is extracted via `useParams()` and used as the key for all data fetching hooks.

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `react-router-dom` (`useParams`) | Extracts `gameId` from the URL route parameter |
| `../services/api` (`fetchGameDetails`) | Fetches game metadata from the backend API |
| `../hooks/useGameHistory` | Hook for fetching historical drawing data by gameId |
| `../hooks/useGenerateTickets` | Imperative hook for generating tickets; provides `generate(count)` function |
| `../hooks/useMinLoading` | Wraps loading flags with a minimum visible duration (2000ms) so skeletons don't flash on fast networks |
| `PatternDistribution` | Renders pattern frequency distribution for last 100 drawings in both mobile and desktop layouts |
| `DrawingItem` | Renders individual historical drawing entries |
| `TicketCarousel` | Horizontal carousel for browsing generated ticket panels |
| `SkeletonLoader` | Pulsing gray placeholder block; rendered as skeleton loaders while history is loading or tickets are generating |
| `ErrorBanner` | Dismissible red error banner; rendered in the drawings area when `historyError` is set and in the ticket area when `generateError` is set |
| `BottomNavTabs` | Mobile tab navigation (Drawings / Tickets) |
| `@heroicons/react/24/outline` (`BoltIcon`) | Lightning bolt icon on the Generate button |

## Usage

GamePage is rendered as a child route in `App.jsx`:

```jsx
<Route path="/games/:gameId" element={<GamePage />} />
```

## Loading States

While data is in flight, `GamePage` renders skeleton placeholders (via `SkeletonLoader`) in place of real content:

| Area | Condition | Skeleton Shape |
|------|-----------|----------------|
| Game header (mobile + desktop) | `showHeaderSkeleton` | Name bar (160px × 24px) + description bar (full width × 14px) + 3 circle placeholders (48px) in the stat row |
| Pattern Distribution (mobile + desktop) | `showHistorySkeleton && !drawings.length` | Heading bar + subtitle bar + 3 rows of (label bar, percentage bar, full-width track bar) |
| Drawings list (mobile + desktop) | `showHistorySkeleton && !drawings.length` | 4 rows, each: date strip (2 bars), centered pattern pill, row of 5 circle placeholders (48px) |
| Ticket carousel (mobile + desktop) | `showTicketSkeleton` | Ticket-shaped card: header (name/ID bars + barcode bar), 3 panel rows (label bar + 5 circle placeholders 32px each), footer bar |

All skeleton gates are derived via `useMinLoading(flag, MIN_SKELETON_MS)` with `MIN_SKELETON_MS = 2000`. This keeps every skeleton visible for at least 2 seconds even if the underlying request resolves instantly, so all content areas swap to real data in a single synchronized transition rather than flickering. The raw flags come from `useGameHistory` (`historyLoading`), `useGenerateTickets` (`generating`), and local `gameDetailsLoading` state (set in the details-fetch effect's `finally` block). Skeletons disappear automatically when data arrives or an error occurs, since all sources set their loading flag to `false` on completion.

## Error States

Error handling uses the `ErrorBanner` component (self-managed dismissal state) rather than full-page early returns or inline error paragraphs:

| Area | Condition | Banner Message |
|------|-----------|----------------|
| Drawings (desktop left column + mobile Drawings tab) | `historyError` is truthy | "Failed to load drawing history. Please try again." |
| Tickets (desktop right column + mobile Tickets tab) | `generateError` is truthy | "Failed to generate tickets. Please try again." |

The banner messages are hardcoded user-facing strings — the raw hook errors (which contain HTTP status codes) are intentionally not passed through to the UI. Each banner instance dismisses independently via its own local state.

## Status

Implemented. Phase 2.8 deliverable: split-view desktop layout and tabbed mobile interface for game detail viewing. Phase 2.9 integration adds PatternDistribution component to both mobile Drawings tab and desktop left column, replacing placeholders. Phase 2.11 integration adds `SkeletonLoader`-based loading placeholders for the Pattern Distribution section, drawings list, ticket carousel area, and game header (both mobile and desktop layouts). All skeleton gates are wrapped in `useMinLoading` with a 2000ms minimum duration to prevent flash-of-skeleton on fast networks. Phase 2.11 also replaces the full-page `historyError` early return and inline `generateError` paragraphs with dismissible `ErrorBanner` components in the drawings and ticket areas. Phase 2.11 additionally disables both ticket count dropdowns (mobile and desktop) and guards the desktop auto-generate effect via a `generatingRef` mirror so that no additional generate requests are triggered while one is already in flight; all controls re-enable when the request completes (success or error).
