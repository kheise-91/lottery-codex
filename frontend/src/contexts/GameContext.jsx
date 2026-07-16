import { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchGames } from '../services/api';

export const initialState = {
  games: [],
  selectedGame: null,
  history: {},
  ticketResults: {},
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    case 'SELECT_GAME': {
      const gameId = action.payload;
      return {
        ...state,
        selectedGame: gameId,
        history: { ...state.history, [gameId]: undefined },
        ticketResults: { ...state.ticketResults, [gameId]: undefined },
      };
    }
    case 'FETCH_HISTORY':
      return {
        ...state,
        history: { ...state.history, [action.payload.gameId]: action.payload.history },
      };
    case 'GENERATE_TICKETS':
      return {
        ...state,
        ticketResults: { ...state.ticketResults, [action.payload.gameId]: action.payload.tickets },
      };
    default:
      return state;
  }
}

const GameContext = createContext(null);

function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const games = await fetchGames();
        dispatch({ type: 'SET_GAMES', payload: games });
      } catch (err) {
        console.error('Failed to fetch games:', err);
      }
    })();
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

export { GameContext, gameReducer, GameProvider, useGame };
