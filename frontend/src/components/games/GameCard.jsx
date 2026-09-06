import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * Game-specific color palette.
 * Keys match gameId values; values correspond to CSS variables defined in index.css @theme.
 */
const gameColors = {
  'badger-5': { main: '#ed1c24', light: '#fecdd3' },
  supercash: { main: '#0081c6', light: '#bae6fd' },
  megabucks: { main: '#ff7200', light: '#fed7aa' },
};

/**
 * Game selection card component.
 * Displays game image, status badge, stats pills, and CTA within a clickable card.
 *
 * @param {Object} props
 * @param {string} props.gameId - Game identifier used for link href and imageSrc fallback (e.g., "badger-5")
 * @param {string} props.name - Display name of the game (e.g., "Badger 5")
 * @param {string} props.description - Short game description (e.g., "Pick 5 numbers from 1 to 39")
 * @param {string} props.imageSrc - SVG image path (e.g., "/badger-5.svg")
 * @param {string} props.status - Backend status: "enabled" or "disabled"
 * @param {string} props.drawFrequency - Draw schedule (e.g., "Wed/Sun", "Daily")
 * @param {string} props.oddsOfWinning - Odds display string (e.g., "1 in 575")
 * @param {string} props.jackpot - Jackpot amount placeholder (e.g., "$50,000")
 * @param {boolean} props.enabled - Whether the game is currently playable
 */
function GameCard({
  gameId,
  name,
  description,
  imageSrc,
  status,
  drawFrequency,
  oddsOfWinning,
  jackpot,
  enabled,
}) {
  const colors = gameColors[gameId] ?? { main: '#6b7280', light: '#f3f4f6' };

  return (
    <Link
      to={`/games/${gameId}`}
      className="group block bg-white rounded-lg card-shadow overflow-hidden cursor-pointer"
    >
      {/* Image area with status badge */}
      <div
        className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg border-b border-gray-200"
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={name}
            className="h-28 w-auto object-contain pt-6"
          />
        )}
        <span
          className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            enabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}
        >
          {enabled ? 'Live' : 'Coming Soon'}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5 pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1.5">{name}</h3>
        {description && (
          <p className="text-sm text-gray-500 mb-4">{description}</p>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="stat-pill rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: colors.light, color: `var(--color-${gameId})` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="block text-[10px] uppercase tracking-wide font-medium">
              Draw
            </span>
            <span className="block text-xs font-semibold text-gray-700">
              {Array.isArray(drawFrequency) && drawFrequency.length === 1 && drawFrequency[0] === 'Daily' ? 'Daily' : drawFrequency.map(d => d.slice(0, 3)).join('|')}
            </span>
          </div>
          <div className="stat-pill rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: colors.light, color: `var(--color-${gameId})` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="block text-[10px] uppercase tracking-wide font-medium">
              Odds
            </span>
            <span className="block text-xs font-semibold text-gray-700">
              {oddsOfWinning}
            </span>
          </div>
          <div className="stat-pill rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: colors.light, color: `var(--color-${gameId})` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="block text-[10px] uppercase tracking-wide font-medium">
              Jackpot
            </span>
            <span className="block text-xs font-semibold text-gray-700">
              {jackpot}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5 pt-1 border-t border-gray-100">
        {enabled ? (
          <button
            className="inline-flex items-center px-4 py-2 my-3 rounded-md text-sm font-semibold text-white transition-colors float-right cursor-pointer"
            style={{ backgroundColor: colors.main }}
          >
            Play Now
            <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <span className="inline-flex items-center text-sm font-medium text-gray-500 cursor-not-allowed">
            Coming Soon
          </span>
        )}
      </div>
    </Link>
  );
}

export default GameCard;
