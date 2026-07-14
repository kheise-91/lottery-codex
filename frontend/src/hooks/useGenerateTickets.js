import { useState } from 'react';
import { generateTickets } from '../services/api';

/**
 * Custom React hook for generating lottery tickets via the backend API.
 * @param {string} gameId - The game ID to generate tickets for (e.g., 'badger-five')
 * @returns {{ tickets: Array, loading: boolean, error: string | null, generate: Function }}
 */
export function useGenerateTickets(gameId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generates lottery tickets by calling the backend generate endpoint.
   * @param {number} [count=1] - Number of tickets to generate
   * @throws {Error} If the API request fails
   */
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
