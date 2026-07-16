# Layout

**File:** `frontend/src/components/layout/Layout.jsx`

## Purpose

Application layout shell that wraps all page routes. Provides a consistent branded header with gradient styling and decorative SVG patterns, plus a full-height responsive container for nested route content via React Router's `<Outlet />`.

## Props

None. The component accepts no props.

## State

No state. Layout is a pure presentational wrapper.

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Children

Layout does not accept children directly. Instead it renders nested route content through React Router's `<Outlet />` component, which populates the main area when routes have child paths configured.

```jsx
<Outlet />   {/* renders matched child route */}
```

To use Layout as a layout shell:

```jsx
<Route element={<Layout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/game/:id" element={<GamePage />} />
</Route>
```

## Structure

The component renders three visual regions:

### Header (gradient hero bar)

- Full-width gradient background: `bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400`
- Decorative SVG grid overlay at 10% opacity spanning the full header area
- Centered branding block (max-width 4xl, responsive padding) with:
  - Logo icon -- bar chart SVG inside a translucent rounded container
  - "Lottery Codex" title in white, bold, 28px font size
  - Subtitle "Pattern Analysis & Ticket Generation" in blue-100, small text
- Decorative wavy bottom curve using an SVG path that transitions the header into the page background (`#f9fafb`)

### Main content area

- Flex-1 to fill remaining viewport height
- Responsive padding: `pt-8 pb-8 px-4` (larger top padding accounts for header)
- Centered container with `max-w-4xl mx-auto`

### Page background

- Root wrapper uses `bg-gray-50` (`#f9fafb`) as the page canvas color
- Bottom SVG curve fills to this same color, creating a seamless visual transition

## Styling

All styling is via Tailwind utility classes with two inline style overrides for exact font sizing:

| Element | Key Classes / Styles |
|---------|---------------------|
| Root container | `flex flex-col min-h-screen bg-gray-50` |
| Header background | `bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 shadow-lg` |
| Grid overlay | `absolute inset-0 opacity-10` |
| Logo icon container | `bg-white/20 backdrop-blur-sm rounded-lg p-2.5 shadow-inner` |
| Title font size | inline: `fontSize: '1.75rem', lineHeight: '1.2'` |
| Main content area | `flex-1 pt-8 pb-8 px-4` |
| Content container | `max-w-4xl mx-auto` |

## Responsive Behavior

- Header padding scales with screen size: `py-6` on mobile, `sm:py-8` on small screens and up
- Logo icon and title stack vertically using flexbox with a 12px gap (`gap-3`)
- Content area uses fluid horizontal padding that adapts to viewport width

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `react-router-dom` (Outlet) | Renders nested route children in the main content area |

## Usage

Layout is intended as a route-level element, not rendered directly inside pages. It should wrap all page routes at the top of the route tree:

```jsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/game/:id', element: <GamePage /> },
    ],
  },
])
```

## Status

Implemented but not yet wired into the application's route configuration. Currently exists on disk at `frontend/src/components/layout/Layout.jsx` awaiting integration with a route definition in `main.jsx`.
