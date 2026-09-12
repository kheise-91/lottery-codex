/**
 * Renders a jackpot value in one of three shapes:
 * - object `{ annuity, cash }` → two side-by-side labeled columns with a vertical divider (Megabucks)
 * - string → single value span (visually identical to the raw string)
 * - null / undefined → "—"
 *
 * @param {Object} props
 * @param {string|{annuity: string, cash: string}|null|undefined} props.jackpot - Jackpot value from the API
 * @param {string} [props.className] - Classes applied to the value text (no default; each caller passes its own)
 * @param {Object} [props.colorStyle] - Inline style object (e.g., game color) applied to the labels in the object case
 * @returns {JSX.Element}
 */
function JackpotValue({ jackpot, className, colorStyle }) {
  if (jackpot === null || jackpot === undefined) {
    return <span className={className}>—</span>;
  }

  if (typeof jackpot === 'string') {
    return <span className={className}>{jackpot}</span>;
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-center w-1/2">
        <span className={className}>{jackpot.annuity}</span>
        <span className="text-[9px] uppercase tracking-wide font-medium leading-none" style={colorStyle}>Annuity</span>
      </div>
      <div className="flex flex-col items-center w-1/2 border-l border-gray-200">
        <span className={className}>{jackpot.cash}</span>
        <span className="text-[9px] uppercase tracking-wide font-medium leading-none" style={colorStyle}>Cash</span>
      </div>
    </div>
  );
}

export default JackpotValue;
