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
| `ticketCount` | `number` | `3` | Number of tickets to generate; drives auto-generation on desktop |
| `activeTab` | `number` | `0` | Active mobile tab index (`0` = Drawings, `1` = Tickets) |

## Side Effects

| Effect | Trigger | Behavior |
|--------|---------|----------|
| Fetch game details | `gameId` changes | Calls `fetchGameDetails(gameId)` with cancellation guard; sets `gameDetails` state |
| Auto-generate tickets | `ticketCount` or `gameId` changes (desktop only) | Calls `generate(ticketCount)` when `window.innerWidth >= 768`; enables seamless ticket count adjustment on desktop |

## Derived Data

| Variable | Source | Description |
|----------|--------|-------------|
| `drawings` | `useGameHistory(gameId)` → `history` | Transformed array of `{date, numbers, pattern}` objects from the history response |
| `carouselTickets` | `tickets` (from `useGenerateTickets`) | Mapped to `[{ ticketData, index }]` format expected by `TicketCarousel` |
| `latestDrawing` | `drawings[0]` | Most recent drawing, rendered with `isRecent={true}` |
| `olderDrawings` | `drawings.slice(1)` | Remaining drawings rendered as a flat list |

## Layout Structure

### Game Header (shared across breakpoints)

- **Desktop (≥768px):** Two-column grid (`md:grid-cols-2`) with game name/description on the left and three stat pills (Draw, Odds, Jackpot) on the right, separated by vertical dividers
- **Mobile (<768px):** Single column with game name/description followed by three stat pills in a bordered grid row

### Desktop Split-View (`hidden md:grid md:grid-cols-12`)

| Column | Span | Content |
|--------|------|---------|
| Left | `col-span-7` (≈58%) | Previous Drawings header, Pattern Distribution placeholder, latest drawing, older drawings list |
| Right | `col-span-5` (≈42%) | Generated Tickets header, pattern health status, ticket count dropdown, `TicketCarousel` |

### Mobile Tabbed Interface (`md:hidden`)

| Element | Description |
|---------|-------------|
| `BottomNavTabs` | Sticky bottom navigation bar with Drawings/Tickets tabs |
| Tab content area | Renders `drawingsTabContent` (tab 0) or `ticketsTabContent` (tab 1) based on `activeTab` state |
| Bottom padding | `pb-20` to prevent content from being hidden behind the fixed bottom nav |

### Mobile Tab Content Details

**Drawings tab:**
- Section header with clock icon ("Previous Drawings")
- Pattern Distribution placeholder section
- Latest drawing rendered via `<DrawingItem isRecent={true} />`
- Older drawings rendered as flat list via `<DrawingItem />`
- Loading indicator when history is fetching with no results

**Tickets tab:**
- Section header with ticket icon ("Generated Tickets")
- Pattern health status placeholder (green dot + "It's okay to play.")
- Ticket count dropdown (1–10) with "Generate" button (side-by-side layout)
- `TicketCarousel` for browsing generated tickets
- Error message if ticket generation fails

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
| `DrawingItem` | Renders individual historical drawing entries |
| `TicketCarousel` | Horizontal carousel for browsing generated ticket panels |
| `BottomNavTabs` | Mobile tab navigation (Drawings / Tickets) |
| `@heroicons/react/24/outline` (`BoltIcon`) | Lightning bolt icon on the Generate button |

## Usage

GamePage is rendered as a child route in `App.jsx`:

```jsx
<Route path="/games/:gameId" element={<GamePage />} />
```

## Status

Implemented. Phase 2.8 deliverable: split-view desktop layout and tabbed mobile interface for game detail viewing.
