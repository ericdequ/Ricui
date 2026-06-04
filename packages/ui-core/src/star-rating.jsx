// =============================================================================
// @ric/ui-core/star-rating — precise fractional star rating (SVG gradient fills)
// =============================================================================
// Upstreamed from BEV src/ui/StarRating over the earlier ★-glyph version, which
// could only round. Renders an exact fraction (e.g. 4.8 → 4 full + 1 at 80%) via
// a hard-stop linear gradient per partial star. Display-only; renders nothing
// when value isn't finite or ≤ 0 (strict-addition). useId keeps gradient ids
// unique across instances.
// =============================================================================

import { useId } from 'react';

const STAR_PATH =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

const FULL_COLOR = '#eab308'; // yellow-500
const EMPTY_COLOR = '#64748b'; // slate-500 (readable on dark surfaces, ~4:1)

function FullStar({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill={FULL_COLOR} d={STAR_PATH} />
    </svg>
  );
}

function EmptyStar({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill={EMPTY_COLOR} d={STAR_PATH} />
    </svg>
  );
}

function PartialStar({ size, fill, gradId }) {
  const pct = `${Math.round(fill * 100)}%`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset={pct} stopColor={FULL_COLOR} />
          <stop offset={pct} stopColor={EMPTY_COLOR} />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradId})`} d={STAR_PATH} />
    </svg>
  );
}

/**
 * Precise fractional star rating. e.g. value=3.3 → 3 full + 1 at 30% + 1 empty.
 * Renders nothing when value isn't finite or ≤ 0.
 *
 * @param {object} props
 * @param {number} props.value - Rating 0–5 (float).
 * @param {number} [props.size] - Pixel size per star (default 16).
 * @param {string} [props.className]
 */
export function StarRating({ value, size = 16, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `sr-${uid}`;

  if (!Number.isFinite(value) || value <= 0) return null;

  const clamped = Math.min(5, Math.max(0, value));
  const fullCount = Math.floor(clamped);
  const partial = parseFloat((clamped - fullCount).toFixed(4));
  const emptyCount = 5 - fullCount - (partial > 0 ? 1 : 0);

  return (
    <div className={`flex items-center gap-[2px] ${className}`} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: fullCount }, (_, i) => (
        <FullStar key={`f${i}`} size={size} />
      ))}
      {partial > 0 && <PartialStar size={size} fill={partial} gradId={gradId} />}
      {Array.from({ length: emptyCount }, (_, i) => (
        <EmptyStar key={`e${i}`} size={size} />
      ))}
    </div>
  );
}
