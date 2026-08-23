# SkeletonLoader

**File:** `frontend/src/components/SkeletonLoader.jsx`

## Purpose

Reusable pulsing gray placeholder block used to indicate loading states. Renders a single `<div>` with Tailwind's built-in `animate-pulse` animation and a `bg-gray-200` background, sized via inline styles. Supports a rounded-rectangle (`block`) or round (`circle`) shape, making it suitable for both generic placeholders and ball-shaped lottery number placeholders.

Consumed by `GamePage` to render skeleton loaders in the Pattern Distribution section, drawings list, and ticket carousel area while data is being fetched or tickets are being generated.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `width` | string \| number | No | `'100%'` | CSS width of the block (e.g., `"60%"`, `"80px"`) |
| `height` | string \| number | No | `'16px'` | CSS height of the block (e.g., `"32px"`) |
| `variant` | `'block' \| 'circle'` | No | `'block'` | Shape variant: `'block'` renders a rounded rectangle (`rounded-lg`), `'circle'` renders a round placeholder (`rounded-full`) |

## State

No internal state. The component is fully controlled by props.

## Rendering

A single `<div>` with the following classes:

| Class | Purpose |
|-------|---------|
| `bg-gray-200` | Gray placeholder background |
| `animate-pulse` | Tailwind built-in pulsing animation |
| `rounded-lg` / `rounded-full` | Shape determined by `variant` prop |

Width and height are applied via an inline `style` attribute, falling back to `'100%'` and `'16px'` respectively when props are omitted.

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Dependencies

None. Pure Tailwind utility classes; no custom CSS or external libraries.

## Usage

### Block placeholder (default)

```jsx
import SkeletonLoader from '../components/SkeletonLoader';

<SkeletonLoader width="120px" height="16px" />
```

Renders a 120px × 16px pulsing gray rounded rectangle.

### Circle placeholder (ball-shaped)

```jsx
<SkeletonLoader variant="circle" width="48px" height="48px" />
```

Renders a 48px pulsing gray circle, matching the size of lottery `Ball` components.

### Full-width bar

```jsx
<SkeletonLoader height="8px" />
```

Renders a full-width, 8px-tall pulsing gray bar (useful as a progress-track placeholder).

## Status

Implemented. Phase 2.11 deliverable: skeleton loading placeholders wired into `GamePage` for the Pattern Distribution section, drawings list, and ticket carousel area.
