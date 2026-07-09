# App

**File:** `frontend/src/App.jsx`

## Purpose

Placeholder/stub demo component. Displays a counter button to prove the frontend stack (React 18 + Vite + Tailwind CSS) is wired up correctly. Not an application page -- no routing, state management, or API integration exists yet.

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
- Button: blue background (`#3b82f6`), white text, rounded corners

## Text Content

```
Lottery Codex          (h1)
Frontend is ready. Backend coming soon.  (p)
Count: {count}         (button label)
```

## Children

None. The component renders a self-contained div tree with no `children` prop.

## Usage

App is rendered directly in the entry point (`frontend/src/main.jsx`) wrapped in React StrictMode:

```jsx
<StrictMode>
  <App />
</StrictMode>
```

No routing exists -- App renders at every URL path.
