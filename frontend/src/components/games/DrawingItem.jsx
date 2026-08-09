/**
 * DrawingItem — renders a single historical lottery drawing as a flat list item.
 *
 * @param {Object} props
 * @param {Object} props.drawing - Single drawing object with keys: `date` (string), `numbers` (number[]), `pattern` (string)
 * @param {string|null} props.gameId=null - Game identifier for colored balls ('badger-five', 'supercash', 'megabucks'). Pass null for white variant.
 * @param {boolean} [props.isRecent=false] - If true, render game-colored balls and "Latest" badge; if false, render white balls and relative time ago text.
 */
import Ball from './Ball';

function DrawingItem({ drawing, gameId = null, isRecent = false }) {
  const formattedDate = drawing.date || 'Unknown date';
  const pattern = drawing.pattern || '';
  const numbers = drawing.numbers || [];

  return (
    <div className="border-b border-gray-200 pb-4 mb-2">
      {/* Date header strip */}
      <div className="px-2 pt-2 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">{formattedDate}</h2>
        {isRecent ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            <span className="live-dot"></span>
            Latest
          </span>
        ) : (
          <span className="text-[11px] text-gray-400 font-medium">
            {timeAgo(formattedDate)}
          </span>
        )}
      </div>

      {/* Pattern badge */}
      <div className="mb-3 flex justify-center items-center">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-relaxed tracking-tight bg-gray-100 text-gray-700 border border-gray-200 w-[20rem] justify-center">
          {/* Small chart icon */}
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>{pattern}</span>
        </span>
      </div>

      {/* Number balls */}
      <div className="flex items-center justify-center gap-2.5">
        {numbers.map((num) => (
          <Ball key={num} number={num} gameId={isRecent ? gameId : null} />
        ))}
      </div>
    </div>
  );
}

/**
 * Simple helper: compute approximate time-ago string from a date string.
 * Accepts formats like "Monday, July 1st" or any valid Date.parse()-compatible format.
 * @param {string} dateString - Date string to convert
 * @returns {string} Relative time ago (e.g., "3 days ago", "2 weeks ago")
 */
function timeAgo(dateString) {
  const now = new Date();
  let target;

  // Attempt native parse first; fall back to manual for legacy formats like "Monday, January 1st"
  try {
    target = new Date(dateString);
  } catch {
    return '';
  }

  if (isNaN(target.getTime())) return '';

  const diffMs = now - target;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
}

export default DrawingItem;
