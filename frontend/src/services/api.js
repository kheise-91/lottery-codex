const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetches the list of available lottery games from the backend.
 * @returns {Promise<Object>} List of available games
 * @throws {Error} If the API request fails
 */
export async function fetchGames() {
  const res = await fetch(`${BASE}/games`);
  if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
  return res.json();
}

/**
 * Fetches details and rules for a specific lottery game.
 * @param {string} id - The game ID (e.g., 'badger-five', 'super-cash')
 * @returns {Promise<Object>} Game details including name, rules, and drawing information
 * @throws {Error} If the API request fails
 */
export async function fetchGameDetails(id) {
  const res = await fetch(`${BASE}/games/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch game details for ${id}: ${res.status}`);
  return res.json();
}

/**
 * Fetches historical drawing data for a given game.
 * @param {string} id - The game ID (e.g., 'badger-five')
 * @returns {Promise<Object>} Historical drawings keyed by date
 * @throws {Error} If the API request fails
 */
export async function fetchHistory(id) {
  const res = await fetch(`${BASE}/games/${id}/history`);
  if (!res.ok) throw new Error(`Failed to fetch history for ${id}: ${res.status}`);
  return res.json();
}

/**
 * Generates optimized lottery tickets for a given game via the backend.
 * @param {string} id - The game ID (e.g., 'badger-five')
 * @param {number} count - Number of tickets to generate
 * @returns {Promise<Object>} Generated tickets data
 * @throws {Error} If the API request fails
 */
export async function generateTickets(id, count) {
  const res = await fetch(`${BASE}/games/${id}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
  if (!res.ok) throw new Error(`Failed to generate tickets for ${id}: ${res.status}`);
  return res.json();
}
