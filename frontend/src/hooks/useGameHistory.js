import { useState, useEffect } from 'react';
import { fetchHistory } from '../services/api';

/**
 * Custom React hook that fetches historical drawing data for a given game.
 * @param {string} gameId - The game ID to fetch history for (e.g., 'badger-five')
 * @returns {{ data: Object | null, loading: boolean, error: string | null }}
 */
export function useGameHistory(gameId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setData(null);

    (async () => {
      try {
        const result = await fetchHistory(gameId);
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  return { data, loading, error };
}
