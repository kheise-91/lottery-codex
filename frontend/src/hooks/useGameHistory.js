import { useState, useEffect } from 'react';
import { fetchHistory } from '../services/api';

export function useGameHistory(gameId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
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
