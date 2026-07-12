# App

**File:** `frontend/src/App.jsx`

## Purpose

Placeholder/stub demo component. Displays a counter button to verify the frontend stack (React 18 + Vite + Tailwind CSS v4) is wired up correctly. Not an application page -- no routing paths defined yet, state management beyond local counter, or API integration exists.

## Props

None. The component accepts no props and has no configurable behavior.

## State

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `count` | number | `0` | Incremented each time the button is clicked. Demonstrates React `useState`. |

```jsx
const [count, setCount] = useState(0)
```

## Side Effects

None. No `useEffect`, no data fetching, no subscriptions.

## Styling

Inline styles only -- Tailwind CSS v4 is imported in `index.css` but not used by this component:

- Layout: centered flexbox (`minHeight: 100vh`, `display: flex`, `alignItems: center`, `justifyContent: center`)
- Font family: `system-ui, sans-serif`
- Button: blue background (`#3b82f6`), white text, rounded corners (`borderRadius: 0.5rem`)

## Text Content

```
Lottery Codex          (h1)
Frontend is ready. Backend coming soon.  (p)
Count: {count}         (button label)
```

## Children

None. The component renders a self-contained div tree with no `children` prop.

## Usage

App is rendered in the entry point (`frontend/src/main.jsx`) wrapped in both React StrictMode and `BrowserRouter`:

```jsx
<StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</StrictMode>
```

No route definitions exist yet -- App renders at every URL path.
