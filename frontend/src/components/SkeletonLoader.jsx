/**
 * SkeletonLoader — pulsing gray placeholder block for loading states.
 *
 * @param {Object} props
 * @param {string|number} [props.width] - CSS width of the block (e.g., "60%", "80px"); omit for full width.
 * @param {string|number} [props.height] - CSS height of the block (e.g., "32px"); defaults to 16px.
 * @param {'block'|'circle'} [props.variant='block'] - 'circle' renders a round placeholder; 'block' is a rounded rectangle.
 * @returns {JSX.Element}
 */
export default function SkeletonLoader({ width, height, variant = 'block' }) {
  const shapeClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg'

  return (
    <div
      className={`bg-gray-200 animate-pulse ${shapeClass}`}
      style={{
        width: width ?? '100%',
        height: height ?? '16px',
      }}
    />
  )
}
