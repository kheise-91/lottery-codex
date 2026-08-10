# BottomNavTabs

Sticky bottom navigation bar for mobile screens that provides tab-based switching between "Drawings" (previous drawings) and "Tickets" (generated tickets) content panels. Visible on mobile (<768px), hidden on desktop (≥768px) where `GamePage` uses a side-by-side split layout.

## Purpose

Provides mobile-friendly navigation within the game detail page, allowing users to toggle between historical drawing data and generated ticket panels without leaving the page. On larger screens the component is invisible because `GamePage` displays both sections simultaneously in a split-view layout.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(index: number) => void` | — | Optional callback fired when the active tab changes; receives the new tab index (`0` or `1`). |

## Structure

```jsx
import BottomNavTabs from './components/layout/BottomNavTabs';

<BottomNavTabs onChange={(idx) => console.log('Tab changed to', idx)} />
```

The component internally uses `@headlessui/react`'s `<Tab.Group>` with two `<Tab>` elements. Content panels are **not** rendered by this component — the consumer (`GamePage`) provides them separately and coordinates tab state via the `onChange` callback.

## Behavior

- **Default tab:** "Drawings" (index 0)
- **Responsive visibility:** Visible on mobile (<768px), hidden on desktop (≥768px) via `flex md:hidden`
- **State management:** Handled entirely by `@headlessui/react` `<Tab.Group>` — no local React state
- **Accessibility:** Inherits keyboard navigation, ARIA roles, and focus management from headlessui Tab components

## Visual Design

| Aspect | Detail |
|--------|--------|
| Height | Fixed 56px (`h-14`) |
| Position | `fixed bottom-0 left-0 right-0 z-50` |
| Background | White with subtle upward shadow |
| Border | Top border using `border-gray-200` |
| Active color | `--color-primary` (`#059669`, emerald) for icon and label |
| Inactive color | Gray (`text-gray-400`) |
| Active indicator | 3px tall pill at top center of active tab |
| Icon size | 22×22px |
| Label font | 10px, semibold, no line-height spacing |

## Dependencies

- `@headlessui/react` — `<Tab.Group>`, `<Tab>` components
- `@heroicons/react/24/solid` — `ClockIcon` (Drawings tab), `TicketIcon` (Tickets tab)
- Tailwind CSS v4 utilities for all styling

## See Also

- [Components Index](./README.md)
- [GamePage](./GamePage.md) — consumes BottomNavTabs on mobile viewports
