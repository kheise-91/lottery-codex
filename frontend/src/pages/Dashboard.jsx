import { useGames } from '../hooks/useGames';
import GameCard from '../components/games/GameCard';

/**
 * Dashboard page — game selection landing.
 * Fetches available games and displays them in a responsive card grid.
 */
function Dashboard() {
  const { data, loading, error } = useGames();
  const games = data?.games ?? [];

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Choose a Game</h2>
      <p className="text-sm text-gray-500 mb-8">
        Select a lottery game below to view analysis, history, and generate optimized panels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <p className="col-span-full text-center text-gray-500 py-8">Loading games...</p>
        )}
        {error && (
          <p className="col-span-full text-center text-red-500 py-8">{error}</p>
        )}
        {!loading && !error && games.map((game) => (
          <div key={game.id}>
            <GameCard
              gameId={game.id}
              name={game.name}
              description={game.description ?? ''}
              imageSrc={`/${game.id}.svg`}
              status={game.status}
              drawFrequency={game.drawFrequency ?? 'N/A'}
              oddsOfWinning={game.oddsOfWinning ?? 'N/A'}
              jackpot={game.jackpot ?? '—'}
              enabled={game.status === 'enabled'}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
