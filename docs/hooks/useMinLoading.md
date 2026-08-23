# useMinLoading Hook

Wraps a raw boolean loading flag with a minimum visible duration, keeping skeleton loaders on screen even when the underlying request resolves quickly.

## Purpose

On fast networks, data-fetching hooks can resolve in 100–300ms, causing skeleton placeholders to flash briefly before real content pops in — a jarring visual swap. `useMinLoading` extends any loading state to remain visible for at least `minMs` (default 2000ms) after it starts, so skeletons and real content swap in a single synchronized transition rather than flickering.

## Usage

```jsx
import { useMinLoading } from '../hooks/useMinLoading';

function MyPage() {
  const { loading } = useSomeFetch();
  const showSkeleton = useMinLoading(loading, 2000);

  return showSkeleton ? <SkeletonLoader /> : <RealContent />;
}
```

## Parameters

| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| `loading` | boolean | Yes | — | The raw loading flag from a data-fetching hook (e.g., `useGameHistory`, `useGenerateTickets`) |
| `minMs`   | number | No | `2000` | Minimum visible duration in milliseconds for the loading state |

## Returns

A single `boolean`:

- `true` while `loading` is `true`, **or** until `minMs` has elapsed since the loading phase started.
- `false` only after the loading flag has been `false` for at least `minMs` milliseconds.

## Behavior

### Initial State

- `extendedLoading` is initialized to the initial value of `loading`. If the hook mounts with `loading: true`, it returns `true` immediately.

### While Loading (`loading === true`)

- The effect sets `extendedLoading: true` and returns early (no timer).
- The hook always returns `true` while `loading` is `true`, regardless of elapsed time.

### After Loading Ends (`loading === false`)

- A `setTimeout` timer is scheduled for `minMs` milliseconds.
- When the timer fires, `extendedLoading` is set to `false`.
- The hook returns `false` only after this timer completes.
- If the component unmounts or `loading`/`minMs` changes before the timer fires, the cleanup function clears the pending timer.

### Edge Cases

- **Instant resolution**: If `loading` flips from `true` to `false` within a few milliseconds, the hook still returns `true` for the full `minMs` window — preventing the flash-of-skeleton problem.
- **Slow request**: If the request takes longer than `minMs`, the hook simply mirrors the raw `loading` flag (returns `true` until the request completes, then holds for `minMs` more).
- **Re-entry**: If `loading` flips back to `true` before the timer fires, the cleanup cancels the pending timer and the loading state resumes from scratch.

## Side Effects

- **Timer**: A single `setTimeout` is scheduled when `loading` transitions to `false`; it is cancelled via the effect's cleanup function on unmount or dependency change.
- **State update**: One `useState` for the internal `extendedLoading` flag.

## Dependencies

- React (`useState`, `useEffect`)

No external dependencies. This hook is purely a timing wrapper and does not interact with the API service layer.
