/**
 * Lottery number ball — renders a single number as a 3D sphere.
 * Supports a white variant (default, for historical drawings) and a colored
 * variant (for generated tickets) where the color reflects sub-pattern membership.
 *
 * @param {Object} props
 * @param {number} props.number - The lottery number to display
 * @param {'white'|'colored'} [props.variant='white'] - The visual variant
 * @param {string|null} [props.gameId=null] - Game identifier (e.g. 'badger-five')
 * @param {number|null} [props.subPatternIndex=null] - Sub-pattern index (0, 1, or 2)
 */
function Ball({ number, variant = 'white', gameId = null, subPatternIndex = null }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full w-12 h-12 lotto-ball';

  if (variant === 'colored' && subPatternIndex !== null && gameId !== null) {
    return (
      <div className={`${baseClasses} lotto-ball--colored lotto-ball--sp-${gameId}-${subPatternIndex}`}>
        {number}
      </div>
    );
  }

  // Default white variant
  return (
    <div className={`${baseClasses} lotto-ball--white`}>
      {number}
    </div>
  );
}

export default Ball;
