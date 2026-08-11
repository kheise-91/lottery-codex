/**
 * TicketCarousel — displays generated lottery tickets one at a time in a horizontal carousel.
 *
 * @param {Object} props
 * @param {Array<Object>} props.tickets - Array of ticket objects compatible with TicketCard (each has `game`, `ticketData`, and will be passed an `index`).
 * @param {Object} props.game - Game details object with keys: `id` (string), `name` (string). Used to determine the active dot color.
 * @returns {JSX.Element}
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import TicketCard from './TicketCard';

const GAME_COLOR_MAP = {
  'badger-five': '--color-badger-five',
  supercash: '--color-supercash',
  megabucks: '--color-megabucks',
};

/** Resolve the CSS variable name for a given gameId, falling back to --color-primary. */
function getThemeColorVar(gameId) {
  return GAME_COLOR_MAP[gameId] || '--color-primary';
}

const TRANSITION_STYLE = {
  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
};

export default function TicketCarousel({ tickets, game }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef(null);
  const count = tickets?.length ?? 0;

  // Reset to first slide when tickets change
  useEffect(() => {
    setActiveIndex(0);
  }, [tickets]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, count - 1));
  }, [count]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (count <= 1) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    },
    [count, goPrev, goNext],
  );

  const themeColorVar = game ? getThemeColorVar(game.id) : '--color-primary';

  if (count === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Generate tickets to see results
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className="px-0.5">
        <TicketCard game={game} ticketData={tickets[0].ticketData} index={tickets[0].index} />
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="carousel-viewport relative"
      style={{ padding: '0 2px' }}
    >
      {/* Left Arrow */}
      <button
        onClick={goPrev}
        aria-label="Previous ticket"
        disabled={activeIndex === 0}
        className={`absolute top-1/2 -translate-y-1/2 left-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-white/85 backdrop-blur-sm border border-gray-200 hover:bg-white transition-colors duration-150 z-10 ${
          activeIndex === 0 ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goNext}
        aria-label="Next ticket"
        disabled={activeIndex === count - 1}
        className={`absolute top-1/2 -translate-y-1/2 right-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-white/85 backdrop-blur-sm border border-gray-200 hover:bg-white transition-colors duration-150 z-10 ${
          activeIndex === count - 1 ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
      </button>

      {/* Carousel Track */}
      <div className="carousel-track overflow-hidden">
        <div
          className="flex"
          style={{ ...TRANSITION_STYLE, transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {tickets.map((ticket, slideIndex) => (
            <div key={slideIndex} className="carousel-slide min-w-full flex-shrink-0 px-1">
              <TicketCard game={game} ticketData={ticket.ticketData} index={ticket.index} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {tickets.map((_, dotIndex) => {
          const isActive = dotIndex === activeIndex;
          return (
            <button
              key={dotIndex}
              onClick={() => goTo(dotIndex)}
              aria-label={`Go to ticket ${dotIndex + 1}`}
              className="transition-all duration-200 cursor-pointer"
              style={{
                width: isActive ? '24px' : '8px',
                height: '8px',
                borderRadius: isActive ? '4px' : '9999px',
                backgroundColor: isActive ? `var(${themeColorVar})` : '#d1d5db',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
