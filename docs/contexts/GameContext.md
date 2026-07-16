# GameContext

Central state management for the Lottery Codex frontend, powered by `useReducer` and the Context API. Provides shared game selection, history data, and ticket generation results across the component tree.

## Purpose

Replaces prop-drilling and per-hook state duplication by giving any descendant component read/write access to:

- The list of available games
- The currently selected game
- Historical drawing data keyed by game ID
- Generated ticket panels keyed by game ID

## Usage

The `<GameProvider>` should wrap the entire application tree — placed **outside** any router so all routes share state:

```jsx
import { StrictMode } from 'react';
import { GameProvider } from './contexts/GameContext';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GameProvider>
  </StrictMode>,
);
```

The provider auto-fetches the games list from `/api/games` on mount. Components consume state via the `useGame()` hook:

```jsx
import { useGame } from './contexts/GameContext';

function GamePanel() {
  const { state, dispatch } = useGame();

  if (!state.selectedGame) return <div>No game selected</div>;

  return (
    <div>
      <h2>{state.selectedGame}</h2>
      {/* render history or ticket results */}
    </div>
  );
}
```

## Initial State

| Property       | Type              | Default         | Description                                  |
|----------------|-------------------|-----------------|----------------------------------------------|
| `games`        | array             | `[]`            | List of available game objects               |
| `selectedGame` | string \| null    | `null`          | Currently selected game ID                   |
| `history`      | object (gameId)   | `{}`            | Historical drawing data per game             |
| `ticketResults`| object (gameId)   | `{}`            | Generated ticket panels per game             |

## Reducer Actions

### `SET_GAMES`

Replaces the games list.

| Field    | Type  | Description                    |
|----------|-------|--------------------------------|
| `type`   | string | `"SET_GAMES"`                 |
| `payload`| array | Array of game objects          |

```js
dispatch({ type: 'SET_GAMES', payload: [{ id: 'badger-five', name: 'Badger 5' }] });
```

### `SELECT_GAME`

Switches the selected game and clears that game's cached history and ticket results.

| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| `type`   | string | `"SELECT_GAME"`                |
| `payload`| string | Game ID to select              |

```js
dispatch({ type: 'SELECT_GAME', payload: 'badger-five' });
```

### `FETCH_HISTORY`

Stores historical drawing data for a specific game.

| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| `type`   | string | `"FETCH_HISTORY"`              |
| `payload.gameId` | string | Game ID            |
| `payload.history` | object | Drawing data for the game |

```js
dispatch({
  type: 'FETCH_HISTORY',
  payload: { gameId: 'badger-five', history: { '2025-01-01': { numbers: [1,2,3,4,5] } } },
});
```

### `GENERATE_TICKETS`

Stores generated ticket panels for a specific game.

| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| `type`   | string | `"GENERATE_TICKETS"`           |
| `payload.gameId` | string | Game ID            |
| `payload.tickets` | array  | Array of ticket panels     |

```js
dispatch({
  type: 'GENERATE_TICKETS',
  payload: { gameId: 'badger-five', tickets: [[1,2,3,4,5], [6,7,8,9,10]] },
});
```

## Exported Values

| Export        | Type     | Description                                    |
|---------------|----------|------------------------------------------------|
| `GameContext` | Context  | The raw React context object (for advanced use) |
| `gameReducer` | function | Pure reducer function (for testing)             |
| `initialState`| object   | Default state shape (for testing)               |
| `GameProvider`| component| Provider component wrapping the app tree        |
| `useGame`     | hook     | Custom hook returning `{ state, dispatch }`     |

## Design Decisions

- **`useReducer` over `useState`** -- The state shape has multiple interdependent fields (selecting a game must clear both history and ticket results for that game). A reducer centralizes this logic and prevents inconsistent intermediate states.
- **Immutable updates via spread** -- Every action returns a new state object with shallow-spread copies of unchanged fields, ensuring React's referential equality checks work correctly.
- **`undefined` clearing on game switch** -- `SELECT_GAME` sets the target game's history and ticket results entries to `undefined` rather than deleting the keys. This preserves object shape stability for consumers that may check `state.history[gameId] !== undefined`.
- **No default export** -- All five exports are named to encourage explicit imports and make tree-shaking straightforward.
- **Auto-fetch on mount** -- The `GameProvider` dispatches a `SET_GAMES` action immediately after the component mounts, fetching from `/api/games` via `fetchGames()`. Errors are logged to `console.error` rather than re-thrown, so the app remains usable even if the backend is temporarily unavailable.
