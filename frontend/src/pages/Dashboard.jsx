import { useGames } from '../hooks/useGames';

/**
 * Dashboard page — game selection landing.
 * Fetches available games and displays them in a responsive card grid.
 */
function Dashboard() {
  const { data, loading, error } = useGames();
  const games = data?.games ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading && (
        <p className="col-span-full text-center text-gray-500 py-8">Loading games...</p>
      )}
      {error && (
        <p className="col-span-full text-center text-red-500 py-8">{error}</p>
      )}
      {!loading && !error && games.map((game) => (
        <a key={game.id} href={`/games/${game.id}`}>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-900">{game.name}</h2>
            {game.description && (
              <p className="mt-1 text-sm text-gray-500">{game.description}</p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

export default Dashboard;
