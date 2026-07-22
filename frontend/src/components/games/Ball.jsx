/**
 * Lottery number ball — renders a single number as a 3D sphere.
 * Supports a white variant and a colored variant based on the game-id.
 * 
 * @param {Object} props
 * @param {number} props.number - The lottery number to display
 * @param {string|null} [props.gameId=null] - Game identifier (e.g. 'badger-five') - defaults to white ball if no game-id is passed
 */
function Ball({ number, gameId = null }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full w-12 h-12 lotto-ball';
  const variantClasses = (gameId) ? `lotto-ball--colored lotto-ball--sp-${gameId}` : `lotto-ball--white`;

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      {number}
    </div>
  );
}

export default Ball;
