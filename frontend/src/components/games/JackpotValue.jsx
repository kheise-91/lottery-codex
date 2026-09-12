/**
 * Renders a jackpot value in one of three shapes:
 * - object `{ annuity, cash }` → two stacked labeled rows (Megabucks)
 * - string → single value span (visually identical to the raw string)
 * - null / undefined → "—"
 *
 * @param {Object} props
 * @param {string|{annuity: string, cash: string}|null|undefined} props.jackpot - Jackpot value from the API
 * @param {string} [props.className] - Classes applied to the value text (no default; each caller passes its own)
 * @returns {JSX.Element}
 */
function JackpotValue({ jackpot, className }) {
  if (jackpot === null || jackpot === undefined) {
    return <span className={className}>—</span>;
  }

  if (typeof jackpot === 'string') {
    return <span className={className}>{jackpot}</span>;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-wide text-gray-400 font-medium leading-none">Annuity</span>
        <span className={className}>{jackpot.annuity}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-wide text-gray-400 font-medium leading-none">Cash</span>
        <span className={className}>{jackpot.cash}</span>
      </div>
    </>
  );
}

export default JackpotValue;
