// =============================================================================
// @ric/ui-core/brand — the brand light (fuchsia → violet → indigo)
// =============================================================================
// Upstreamed from BEV src/ui/Icons/brand. A plain <linearGradient> (no filters)
// that branded vectors stop into so the whole set glows in one gradient. Render
// inside an <svg><defs>, give it a per-instance id from useId(), then paint with
// fill="url(#id)" / stroke="url(#id)".
// =============================================================================

const BRAND_STOPS = [
  { offset: 0, color: '#d946ef' }, // fuchsia
  { offset: 0.5, color: '#8b5cf6' }, // violet
  { offset: 1, color: '#4f46e5' }, // indigo
];

/**
 * @param {object} props
 * @param {string} props.id - Unique gradient id (use useId()).
 * @param {number} [props.x1] @param {number} [props.y1]
 * @param {number} [props.x2] @param {number} [props.y2]
 */
export function BrandGradient({ id, x1 = 3, y1 = 3, x2 = 21, y2 = 21 }) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
      {BRAND_STOPS.map((s) => (
        <stop key={s.offset} offset={s.offset} stopColor={s.color} />
      ))}
    </linearGradient>
  );
}
