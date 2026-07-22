# Ball

**File:** `frontend/src/components/games/Ball.jsx`

## Purpose

Foundational UI primitive that renders a single lottery number as a 48px 3D sphere. Supports two visual modes:

- **White** (default) -- Used for all historical drawing displays and generated ticket displays.
- **Colored** -- Used only for the most recent drawing of a game, where the ball color reflects the game's theme color.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `number` | number | Yes | -- | The lottery number to display centered inside the ball |
| `gameId` | string \| null | No | `null` | Game identifier (e.g. `'badger-five'`, `'supercash'`, `'megabucks'`). When provided, renders a colored ball matching the game's theme color. Omitted or `null` renders a white ball. |

## State

No internal state. The component is fully controlled by props.

## Structure

A single `<div>` element with:
- Tailwind utility classes for layout: `inline-flex items-center justify-center rounded-full w-12 h-12`
- Custom CSS classes for 3D visual styling: `lotto-ball` (base) plus a variant class (`lotto-ball--white` or `lotto-ball--colored`)
- When `gameId` is provided, an additional game-color class: `lotto-ball--sp-{gameId}`
- The `number` prop rendered as text content, centered via flexbox

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Styling

### CSS Classes

The component relies on custom CSS classes defined in `frontend/src/index.css`:

#### Base

| Class | Purpose | Key Properties |
|-------|---------|----------------|
| `.lotto-ball` | Base ball styling | 48px size (`3rem`), 50% border-radius, inline-flex centering, 1.0625rem bold font, `position: relative`, `user-select: none` |

#### White Variant (default)

| Class | Purpose | Key Properties |
|-------|---------|----------------|
| `.lotto-ball--white` | White sphere variant | Radial gradient background (off-center light source at 38% 32%), `#b0bec5` border, dual inset box shadows for depth, external drop shadow |
| `.lotto-ball--white::after` | Specular highlight | Absolute positioned ellipse at top-left (12% top, 24% left, 35% width, 28% height) with white-to-transparent radial gradient |

#### Colored Variant (game-colored)

| Class | Purpose | Key Properties |
|-------|---------|----------------|
| `.lotto-ball--colored` | Colored base for game-colored balls | 1.5px solid border, white text color, text shadow for legibility, specular highlight `::after` pseudo-element |
| `.lotto-ball--sp-{gameId}` | Game theme color (3 classes total) | Background gradient and border color derived from the game's theme colors. Uses `{gameId}-lightest` as the highlight stop, `{gameId}` as the mid-stop, and hardcoded darker variants at the outer stops. |

The three game-color classes are:

| Game | Class | Colors |
|------|-------|--------|
| Badger Five | `.lotto-ball--sp-badger-five` | `#fecdd3` -> `#ed1c24` -> `#b91c1c` -> `#7f1d1d` |
| SuperCash | `.lotto-ball--sp-supercash` | `#bae6fd` -> `#0081c6` -> `#0369a1` -> `#0c4a6e` |
| Megabucks | `.lotto-ball--sp-megabucks` | `#fed7aa` -> `#ff7200` -> `#c2410c` -> `#7c2d12` |

### 3D Effect Breakdown (White Variant)

The sphere appearance is achieved through four visual layers:

1. **Radial gradient background** -- `radial-gradient(circle at 38% 32%, #ffffff 0%, #f4f7fa 35%, #d1d9e6 70%, #a8b4c4 100%)` simulates a light source from the upper-left
2. **Inset box shadows** -- Dark shadow at bottom-right (`-3px -3px`) and white highlight at top-left (`2px 2px`) add depth
3. **External drop shadow** -- `0 3px 8px rgba(0,0,0,0.18)` lifts the ball off the page
4. **Specular highlight pseudo-element** -- A small white ellipse at the upper-left corner mimics a glossy reflection

### Current Limitations

No size prop exists yet; all balls render at 48px.

## Children

None. The component is self-contained and does not accept children.

## Dependencies

No external dependencies. Pure React functional component with Tailwind utility classes and custom CSS.

## Usage

### White variant (default)

```jsx
import Ball from '../components/games/Ball';

<Ball number={7} />
<Ball number={31} />
```

Renders a 48px white 3D sphere with the number centered inside. Suitable for historical drawing displays and generated ticket displays.

### Colored variant (game-colored, most recent drawing)

```jsx
<Ball number={7} gameId="badger-five" />
<Ball number={12} gameId="supercash" />
<Ball number={23} gameId="megabucks" />
```

Renders a colored ball where the gradient reflects the game's theme color. Used for displaying the most recent drawing results.

## Status

Implemented with white and game-colored variants. Awaiting consumption by `DrawingCard` and `TicketDisplay`.
