const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// 90s must exceed the backend's worst-case sequential scrape time:
// HistoryScraper/JackpotScraper use CURLOPT_TIMEOUT=30, and list() can run up
// to two sequential jackpot scrapes (~60-65s total). Raise if live scraping
// is observed to exceed it — do not raise the backend cURL timeout.
const REQUEST_TIMEOUT_MS = 90_000;

let gamesPromise = null;

/**
 * Performs a fetch against the API with a request timeout and normalized
 * error messages. Backend error bodies (`error` or `message`) are surfaced
 * verbatim to the caller.
 * @param {string} path - API path relative to the base URL (e.g., '/games')
 * @param {RequestInit} [options] - Optional fetch options (method, headers, body)
 * @returns {Promise<Object>} Parsed JSON response body
 * @throws {Error} Timeout, network failure, or backend error with its message text
 */
async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, { ...options, signal: controller.signal });
    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        message = body.error || body.message || message;
      } catch {
        // Non-JSON body — fall back to the generic message.
      }
      throw new Error(message);
    }
    return res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The lottery site may be slow to respond. Please try again.');
    }
    if (err instanceof TypeError) {
      throw new Error('Network error — check your connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches the list of available lottery games from the backend.
 * The request is memoized per page load so React StrictMode's double-invoked
 * mount effects in development do not fire a second network request.
 * @returns {Promise<Object>} List of available games
 * @throws {Error} If the API request fails, times out (90s), or the network is unavailable
 */
export function fetchGames() {
  if (!gamesPromise) {
    gamesPromise = request('/games');
    gamesPromise.catch(() => {
      gamesPromise = null;
    });
  }
  return gamesPromise;
}

/**
 * Fetches details and rules for a specific lottery game.
 * @param {string} id - The game ID (e.g., 'badger-5', 'super-cash')
 * @returns {Promise<Object>} Game details including name, rules, and drawing information
 * @throws {Error} If the API request fails, times out (90s), or the network is unavailable
 */
export async function fetchGameDetails(id) {
  return request(`/games/${id}`);
}

/**
 * Fetches historical drawing data for a given game.
 * @param {string} id - The game ID (e.g., 'badger-5')
 * @returns {Promise<Object>} Historical drawings keyed by date
 * @throws {Error} If the API request fails, times out (90s), or the network is unavailable
 */
export async function fetchHistory(id) {
  return request(`/games/${id}/history`);
}

/**
 * Generates optimized lottery tickets for a given game via the backend.
 * @param {string} id - The game ID (e.g., 'badger-5')
 * @param {number} count - Number of tickets to generate
 * @returns {Promise<Object>} Generated tickets data
 * @throws {Error} If the API request fails, times out (90s), or the network is unavailable
 */
export async function generateTickets(id, count) {
  return request(`/games/${id}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
}
