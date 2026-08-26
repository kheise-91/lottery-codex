# ErrorBanner

**File:** `frontend/src/components/ErrorBanner.jsx`

## Purpose

Dismissible red error banner with a user-facing message. Used by `GamePage` to surface API failures (history fetch, ticket generation) inline within the relevant content area instead of replacing the entire page or showing raw technical error text.

Dismissal is self-managed via local state, so each banner instance (e.g., history vs. tickets) dismisses independently. The dismissed state resets naturally when the component unmounts (tab switch, `gameId` change) and a new error arrives.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | Yes | User-facing error text (e.g., "Failed to load drawing history. Please try again.") |

## State

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| `dismissed` | boolean | `false` | Local flag; when `true`, the component renders `null` |

## Rendering

A flex row (`flex items-center justify-between gap-2`) with the following classes:

| Class | Purpose |
|-------|---------|
| `rounded-lg` | Rounded corners |
| `border border-red-200` | Red border |
| `bg-red-50` | Light red background |
| `px-4 py-3` | Horizontal and vertical padding |
| `text-red-600` | Red text color |

Layout: the `message` string in a `<span className="text-sm">` on the left, and a dismiss button on the right.

### Dismiss Button

- Uses `XMarkIcon` from `@heroicons/react/24/outline` (`h-5 w-5`)
- Has `aria-label="Dismiss error"` for accessibility
- Sets `dismissed` to `true` on click, which causes the component to render `null`
- `flex-shrink-0` prevents the icon from collapsing when the message is long

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `react` (`useState`) | Local dismissed state |
| `@heroicons/react/24/outline` (`XMarkIcon`) | Dismiss (close) icon |

## Usage

```jsx
import ErrorBanner from '../components/ErrorBanner'

{historyError && <ErrorBanner message="Failed to load drawing history. Please try again." />}
```

The banner is conditionally rendered by the parent based on the error value. Each instance manages its own dismissal state independently.

## Status

Implemented. Phase 2.11 deliverable: dismissible error banner wired into `GamePage` for history fetch failures (drawings area) and ticket generation failures (ticket area), replacing the previous full-page early return and inline error paragraphs.
