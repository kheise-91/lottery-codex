import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * Game selection card component.
 * Displays game image, status badge, stats pills, and CTA within a clickable card.
 *
 * @param {Object} props
 * @param {string} props.gameId - Game identifier used for link href and imageSrc fallback (e.g., "badger-five")
 * @param {string} props.name - Display name of the game (e.g., "Badger 5")
 * @param {string} props.description - Short game description (e.g., "Pick 5 numbers from 1 to 39")
 * @param {string} props.imageSrc - SVG image path (e.g., "/badger-five.svg")
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
  return (
    <Link
      to={`/games/${gameId}`}
      className="group block bg-white rounded-lg card-shadow hover:card-shadow-hover overflow-hidden transition-transform duration-200 ease-out group-hover:-translate-y-1"
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
          <div className="stat-pill rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: `var(--color-${gameId}-light)` }}>
            <span className="block text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Draw
            </span>
            <span className="block text-xs font-semibold" style={{ color: `var(--color-${gameId})` }}>
              {drawFrequency === 'Daily' ? 'Daily' : drawFrequency.join('|')}
            </span>
          </div>
          <div className="stat-pill rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: `var(--color-${gameId}-light)` }}>
            <span className="block text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Odds
            </span>
            <span className="block text-xs font-semibold" style={{ color: `var(--color-${gameId})` }}>
              {oddsOfWinning}
            </span>
          </div>
          <div className="stat-pill rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: `var(--color-${gameId}-light)` }}>
            <span className="block text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Jackpot
            </span>
            <span className="block text-xs font-semibold" style={{ color: `var(--color-${gameId})` }}>
              {jackpot}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5 pt-1 border-t border-gray-100">
        {enabled ? (
          <button
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold transition-colors ml-auto"
            style={{ backgroundColor: `var(--color-${gameId})`, color: '#ffffff' }}
          >
            Play Now
            <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <span className="inline-flex items-center text-sm font-medium text-gray-400 cursor-not-allowed">
            Coming Soon
          </span>
        )}
      </div>
    </Link>
  );
}

export default GameCard;
