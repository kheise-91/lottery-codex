/**
 * Lottery number ball — renders a single number as a 3D white sphere.
 * Consumed by DrawingCard (Phase 2.5) and TicketDisplay (Phase 2.6).
 *
 * @param {Object} props
 * @param {number} props.number - The lottery number to display
 */
function Ball({ number }) {
  return (
    <div className="inline-flex items-center justify-center rounded-full w-12 h-12 lotto-ball lotto-ball--white">
      {number}
    </div>
  );
}

export default Ball;
