/**
 * TicketCard — renders generated lottery tickets as physical-ticket-style cards.
 *
 * @param {Object} props
 * @param {Object} props.game - Game details object with keys: `id` (string), `name` (string)
 * @param {number[][][]} props.tickets - Nested array: [ticket][panel][number]. Each ticket is an array of panels, each panel is a number array.
 */
import Ball from './Ball';

const GAME_CONFIG = {
  'badger-five':   { initials: 'BF', color: '#ed1c24', light: '#fecdd3' },
  'supercash':     { initials: 'SC', color: '#0081c6', light: '#bae6fd' },
  'megabucks':     { initials: 'MB', color: '#ff7200', light: '#fed7aa' },
};

/** @returns {{ initials: string, color: string, light: string }} */
function getGameConfig(game) {
  return GAME_CONFIG[game.id] || { initials: '??', color: '#6b7280', light: '#e5e7eb' };
}

/** Format ticket ID as `[INITIALS]-[yymmdd]-[NN]`. */
function ticketId(initials, index) {
  const now = new Date();
  const yymmdd = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  return `${initials}-${yymmdd}-${String(index + 1).padStart(2, '0')}`;
}

/** Map panel index to label (0→"A", 1→"B", etc.). */
function panelLabel(index) {
  return String.fromCharCode(65 + index);
}

/** Format current time as "July 26, 2026 · 09:41 AM". */
function formatTimestamp() {
  const now = new Date();
  const datePart = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${datePart} · ${timePart}`;
}

/** Generate a static decorative barcode row. */
function Barcode() {
  const bars = [3, 1.5, 4, 1, 2, 3.5, 1, 4, 1.5, 2, 3, 1, 2.5];
  const heights = [24, 30, 26, 28, 22, 32, 20, 28, 26, 30, 24, 28, 22];

  return (
    <div className="inline-flex items-end gap-[1.5px]" aria-hidden="true">
      {bars.map((width, i) => (
        <span
          key={i}
          className="bg-gray-400 rounded-[1px]"
          style={{ width: `${width}px`, height: `${heights[i]}px` }}
        />
      ))}
    </div>
  );
}

/** Perforation divider between tickets. */
function Perforation() {
  return (
    <div
      className="mx-8 my-1"
      style={{
        backgroundImage: 'radial-gradient(circle, #d1d5db 2px, transparent 2.5px)',
        backgroundSize: '16px 16px',
        height: '14px',
      }}
      aria-hidden="true"
    />
  );
}

/** Single panel within a ticket. */
function Panel({ numbers, index, color, lightColor }) {
  return (
    <div className="relative rounded-lg border-1 border-dashed border-gray-300 border-l-0 min-h-[80px] overflow-hidden">
      {/* Accent bar on left edge */}
      <div
        className="absolute left-0 top-0 w-[6px] h-full rounded-l-md"
        style={{ backgroundColor: color }}
      />

      {/* Panel badge */}
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ color, backgroundColor: lightColor }}
        >
          Panel {panelLabel(index)}
        </span>
      </div>

      {/* Balls row */}
      <div className="flex items-center gap-2.5 px-4 py-2">
        {numbers.map((n) => (
          <Ball key={n} number={n} />
        ))}
      </div>
    </div>
  );
}

/** Single ticket card. */
function TicketCard({ game, ticketData, index }) {
  const config = getGameConfig(game);
  const timestamp = formatTimestamp();

  return (
    <article className="group ticket-card relative rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-600">{game.name}</h2>
            <span className="text-sm text-gray-600">Ticket #{ticketId(config.initials, index)}</span>
          </div>
          <Barcode />
        </div>
      </div>

      {/* Panels */}
      <div className="px-5 pb-5 space-y-3">
        {ticketData.map((panelNumbers, panelIndex) => (
          <Panel
            key={panelIndex}
            numbers={panelNumbers}
            index={panelIndex}
            color={config.color}
            lightColor={config.light}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-2.5 flex items-center justify-end">
        <span className="text-[11px] text-gray-400">{timestamp}</span>
      </div>
    </article>
  );
}

/**
 * TicketCard — renders generated lottery tickets as physical-ticket-style cards.
 *
 * @param {Object} props
 * @param {Object} props.game - Game details object with keys: `id` (string), `name` (string)
 * @param {number[][][]} props.tickets - Nested array: [ticket][panel][number]. Each ticket is an array of panels, each panel is a number array.
 */
function TicketList({ game, tickets }) {
  return (
    <div className="space-y-0">
      {tickets.map((ticketData, index) => (
        <>
          <TicketCard key={index} game={game} ticketData={ticketData} index={index} />
          {index < tickets.length - 1 && <Perforation />}
        </>
      ))}
    </div>
  );
}

export default TicketList;
