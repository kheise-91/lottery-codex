# Ball

**File:** `frontend/src/components/games/Ball.jsx`

## Purpose

Foundational UI primitive that renders a single lottery number as a 48px white 3D sphere. Designed for use in drawing history displays and ticket panels. Consumed by `DrawingCard` (Phase 2.5) and `TicketDisplay` (Phase 2.6).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `number` | number | Yes | The lottery number to display centered inside the ball |

## State

No internal state. The component is fully controlled by props.

## Structure

A single `<div>` element with:
- Tailwind utility classes for layout: `inline-flex items-center justify-center rounded-full w-12 h-12`
- Custom CSS classes for 3D visual styling: `lotto-ball` (base) and `lotto-ball--white` (variant)
- The `number` prop rendered as text content, centered via flexbox

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Styling

### CSS Classes

The component relies on custom CSS classes defined in `frontend/src/index.css`:

| Class | Purpose | Key Properties |
|-------|---------|----------------|
| `.lotto-ball` | Base ball styling | 48px size (`3rem`), 50% border-radius, inline-flex centering, 1.0625rem bold font, `position: relative`, `user-select: none` |
| `.lotto-ball--white` | White sphere variant | Radial gradient background (off-center light source at 38% 32%), `#b0bec5` border, dual inset box shadows for depth, external drop shadow |
| `.lotto-ball--white::after` | Specular highlight | Absolute positioned ellipse at top-left (12% top, 24% left, 35% width, 28% height) with white-to-transparent radial gradient |

### 3D Effect Breakdown

The sphere appearance is achieved through four visual layers:

1. **Radial gradient background** -- `radial-gradient(circle at 38% 32%, #ffffff 0%, #f4f7fa 35%, #d1d9e6 70%, #a8b4c4 100%)` simulates a light source from the upper-left
2. **Inset box shadows** -- Dark shadow at bottom-right (`-3px -3px`) and white highlight at top-left (`2px 2px`) add depth
3. **External drop shadow** -- `0 3px 8px rgba(0,0,0,0.18)` lifts the ball off the page
4. **Specular highlight pseudo-element** -- A small white ellipse at the upper-left corner mimics a glossy reflection

### Current Limitations

Only the plain white variant is implemented. Color-coded variants (e.g., for matched numbers on tickets) are planned for future phases. No size prop exists yet; all balls render at 48px.

## Children

None. The component is self-contained and does not accept children.

## Dependencies

No external dependencies. Pure React functional component with Tailwind utility classes and custom CSS.

## Usage

```jsx
import Ball from '../components/games/Ball';

<Ball number={7} />
<Ball number={31} />
```

Renders a 48px white 3D sphere with the number centered inside.

## Status

Implemented. Awaiting consumption by `DrawingCard` and `TicketDisplay`.
