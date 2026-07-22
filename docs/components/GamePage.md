# GamePage

**File:** `frontend/src/pages/GamePage.jsx`

## Purpose

Stub placeholder for the game detail page. Displays a "coming soon" message with the matched `gameId` from the URL parameter. This component is rendered at `/games/:gameId` and will be replaced by a full split-view game detail page in Phase 2.8, which will feature history display, pattern distribution visualization, and panel generation controls.

## Props

None. The component receives no props directly; it reads `gameId` from the URL via React Router's `useParams`.

## State

No internal state. The component is fully driven by route parameters.

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Structure

A single centered `<div>` containing a paragraph that interpolates the `gameId` parameter:

```
Game page for "{gameId}" coming soon.
```

Styled with Tailwind classes: `flex items-center justify-center py-16` for centering, `text-gray-500 text-lg` for muted styling.

## Routing

| Route | Parameter | Description |
|-------|-----------|-------------|
| `/games/:gameId` | `gameId` (string) | Game identifier from URL (e.g., `badger-five`, `supercash`, `megabucks`) |

The `gameId` is extracted via `useParams()` and rendered directly into the message. No validation or sanitization is applied to the parameter value.

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `react-router-dom` (`useParams`) | Extracts `gameId` from the URL route parameter |

## Usage

GamePage is not rendered directly. It is configured as a child route in `App.jsx`:

```jsx
<Route path="/games/:gameId" element={<GamePage />} />
```

## Status

Stub placeholder. Awaiting Phase 2.8 implementation of the full game detail view.
