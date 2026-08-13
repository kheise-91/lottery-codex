# PatternDistribution

**File:** `frontend/src/components/games/PatternDistribution.jsx`

## Purpose

Renders the visual shell for pattern frequency display. Establishes the heading, subtitle, and placeholder container for future pattern bars. No calculation logic or bar rendering is implemented in this skeleton version.

The component renders flat on page background with no card wrapper, border, or background wrapper.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `history` | Array \| Object | Yes | -- | Historical drawings data used for future calculations. Currently not processed; passed through as prop interface. |
| `gamePrimaryColor` | string | Yes | -- | Game primary color (CSS color string or Tailwind reference). Reserved for future bar rendering and percentage text styling. |

## State

No internal state. The component is fully controlled by props and contains no hooks.

## Structure

Flat container `<div>` with three elements:

- Heading: `<h2 className="text-sm font-semibold text-gray-800">Pattern Distribution</h2>`
- Subtitle: `<p className="text-xs text-gray-400">Last 100 Drawings</p>`
- Placeholder container: `<div>{/* Pattern bars will be rendered here */}</div>`

No card wrapper, border, or background wrapper is used.

## Side Effects

None. No `useEffect`, data fetching, subscriptions, or DOM mutations.

## Children

None. The component does not accept or render children.

## Dependencies

No external dependencies. Pure React functional component with Tailwind utility classes.

## Usage

```jsx
import PatternDistribution from '../components/games/PatternDistribution';

<PatternDistribution
  history={historyData}
  gamePrimaryColor="#059669"
/>;
```

Renders heading and subtitle with empty placeholder container. Safe to render with empty props without crashing.

## Status

Implemented as skeleton for Phase 2.9. Calculation logic, frequency counting, and bar rendering are pending in later issues.
