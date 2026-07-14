import { useState } from 'react';
import { generateTickets } from '../services/api';

export function useGenerateTickets(gameId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generate(count = 1) {
    try {
      setLoading(true);
      setError(null);
      const result = await generateTickets(gameId, count);
      setTickets(result.tickets || []);
    } catch (err) {
      setError(err.message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }

  return { tickets, loading, error, generate };
}
