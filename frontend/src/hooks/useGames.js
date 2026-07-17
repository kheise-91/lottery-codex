import { useState, useEffect } from 'react';
import { fetchGames } from '../services/api';

/**
 * Custom React hook that fetches the list of available lottery games.
 * @returns {{ data: Object | null, loading: boolean, error: string | null }}
 */
export function useGames() {
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
        const result = await fetchGames();
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
  }, []);

  return { data, loading, error };
}
