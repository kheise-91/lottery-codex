# Ball

**File:** `frontend/src/components/games/Ball.jsx`

## Purpose

Foundational UI primitive that renders a single lottery number as a 48px 3D sphere. Supports two visual variants:

- **White** (default) -- Used for historical drawing displays in `DrawingCard` (Phase 2.5).
- **Colored** -- Used for generated ticket displays in `TicketDisplay` (Phase 2.6), where each ball's color reflects its sub-pattern membership within the generated ticket pattern.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `number` | number | Yes | -- | The lottery number to display centered inside the ball |
| `variant` | `'white' \| 'colored'` | No | `'white'` | The visual variant of the ball |
| `gameId` | string \| null | No | `null` | Game identifier (e.g. `'badger-five'`, `'supercash'`, `'megabucks'`). Required when `variant='colored'`. |
| `subPatternIndex` | number \| null | No | `null` | Sub-pattern index (`0`, `1`, or `2`). Each game has at most 3 unique sub-patterns. Required when `variant='colored'`. |

## State

No internal state. The component is fully controlled by props.

## Structure

A single `<div>` element with:
- Tailwind utility classes for layout: `inline-flex items-center justify-center rounded-full w-12 h-12`
- Custom CSS classes for 3D visual styling: `lotto-ball` (base) plus a variant class (`lotto-ball--white` or `lotto-ball--colored`)
- When in colored mode, an additional sub-pattern class: `lotto-ball--sp-{gameId}-{subPatternIndex}`
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

#### Colored Variant

| Class | Purpose | Key Properties |
|-------|---------|----------------|
| `.lotto-ball--colored` | Colored base for ticket display | 1.5px solid border, white text color, text shadow for legibility, specular highlight `::after` pseudo-element |
| `.lotto-ball--sp-{gameId}-{index}` | Sub-pattern color (9 classes total) | Background gradient and border color derived from game theme colors. Index `0` uses the game's main color, `1` uses `{gameId}-light`, and `2` uses `{gameId}-lightest`. |

The nine sub-pattern color classes are:

| Game | Index 0 (main) | Index 1 (light) | Index 2 (lightest) |
|------|----------------|-----------------|-------------------|
| Badger Five | `.lotto-ball--sp-badger-five-0` | `.lotto-ball--sp-badger-five-1` | `.lotto-ball--sp-badger-five-2` |
| SuperCash | `.lotto-ball--sp-supercash-0` | `.lotto-ball--sp-supercash-1` | `.lotto-ball--sp-supercash-2` |
| Megabucks | `.lotto-ball--sp-megabucks-0` | `.lotto-ball--sp-megabucks-1` | `.lotto-ball--sp-megabucks-2` |

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

Renders a 48px white 3D sphere with the number centered inside. Suitable for historical drawing displays.

### Colored variant (generated tickets)

```jsx
<Ball number={7} variant="colored" gameId="badger-five" subPatternIndex={0} />
<Ball number={12} variant="colored" gameId="badger-five" subPatternIndex={1} />
<Ball number={23} variant="colored" gameId="supercash" subPatternIndex={2} />
```

Renders colored balls where the color reflects the sub-pattern index. Index 0 uses the game's main color, index 1 uses the light variant, and index 2 uses the lightest variant.

## Status

Implemented with both white and colored variants. Awaiting consumption by `DrawingCard` and `TicketDisplay`.
