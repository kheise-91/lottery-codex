const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchGames() {
  const res = await fetch(`${BASE}/games`);
  if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
  return res.json();
}

export async function fetchGameDetails(id) {
  const res = await fetch(`${BASE}/games/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch game details for ${id}: ${res.status}`);
  return res.json();
}

export async function fetchHistory(id) {
  const res = await fetch(`${BASE}/games/${id}/history`);
  if (!res.ok) throw new Error(`Failed to fetch history for ${id}: ${res.status}`);
  return res.json();
}

export async function generateTickets(id, count) {
  const res = await fetch(`${BASE}/games/${id}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
  if (!res.ok) throw new Error(`Failed to generate tickets for ${id}: ${res.status}`);
  return res.json();
}
