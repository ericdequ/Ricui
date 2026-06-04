// =============================================================================
// @ric/ui-core/pagination-controls — glassy prev/next + page-dot pager
// =============================================================================
// Upstreamed from BEV src/ui/PaginationControls (+ PaginationDot), de-BEV'd
// framer→CSS: the active-dot grow/glow → CSS transitions; the container rise →
// .ric-rise-in (styles.css). Prev/next default to inline chevron glyphs
// (override via prevIcon/nextIcon). Uses the @ric IconButton. Null-renders when
// totalCount is 0. (Distinct from @ric's simple `Pagination`.)
// =============================================================================

import { ChevronLeft, ChevronRight } from './glyphs.jsx';
import { cx } from './index.js';
import { IconButton } from './icon-button.jsx';

/** A single page dot — grows + cyan-glows when active. */
function PaginationDot({ dot, pageIndex }) {
  const active = dot === pageIndex;
  const isEllipsis = dot === '...';
  return (
    <div
      className={cx(
        'h-2 rounded-full transition-all duration-[250ms] ease-in-out',
        active ? 'w-6 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.55)]' : isEllipsis ? 'w-2 bg-white/15' : 'w-2 bg-white/25',
      )}
    />
  );
}

function buildPageDots(current, total, maxDots) {
  if (total <= maxDots) return Array.from({ length: total }, (_, i) => i);
  const half = Math.floor(maxDots / 2);
  const dots = [];
  if (current <= half) {
    for (let i = 0; i < maxDots - 2; i += 1) dots.push(i);
    dots.push('...', total - 1);
  } else if (current >= total - half - 1) {
    dots.push(0, '...');
    for (let i = total - (maxDots - 2); i < total; i += 1) dots.push(i);
  } else {
    dots.push(0, '...');
    for (let i = current - 1; i <= current + 1; i += 1) dots.push(i);
    dots.push('...', total - 1);
  }
  return dots;
}

/**
 * Glassy prev/next + page-dot pager. Null-renders when `totalCount` is 0.
 * @param {object} props
 * @param {number} [props.pageIndex] @param {number} [props.pageCount]
 * @param {() => void} [props.onPrev] @param {() => void} [props.onNext]
 * @param {number} [props.shownCount] @param {number} [props.totalCount]
 * @param {boolean} [props.isTransitioning]
 * @param {string} [props.unitLabel] - Plural noun for the subtitle (default "items").
 * @param {import('react').ElementType} [props.prevIcon] @param {import('react').ElementType} [props.nextIcon]
 */
export function PaginationControls({ pageIndex, pageCount, onPrev, onNext, shownCount, totalCount, isTransitioning, unitLabel = 'items', prevIcon, nextIcon }) {
  if (totalCount === 0) return null;

  const dots = buildPageDots(pageIndex, pageCount, 7);
  const canGoPrev = pageIndex !== 0 && !isTransitioning;
  const canGoNext = pageIndex < pageCount - 1 && !isTransitioning;

  return (
    <div className="ric-rise-in mt-10 flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 shadow-xl backdrop-blur-xl">
        <IconButton
          icon={prevIcon || ChevronLeft}
          tone="plain"
          size="sm"
          onClick={onPrev}
          disabled={pageIndex === 0 || isTransitioning}
          className={cx('inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200', canGoPrev ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'cursor-not-allowed text-white/20')}
          ariaLabel="Previous page"
        />
        <div className="flex items-center gap-1.5 px-1">
          {dots.map((dot, i) => (
            <PaginationDot key={`dot-${i}`} dot={dot} pageIndex={pageIndex} />
          ))}
        </div>
        <IconButton
          icon={nextIcon || ChevronRight}
          tone="plain"
          size="sm"
          onClick={onNext}
          disabled={pageIndex >= pageCount - 1 || isTransitioning}
          className={cx('inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200', canGoNext ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'cursor-not-allowed text-white/20')}
          ariaLabel="Next page"
        />
      </div>
      <p className="text-xs font-medium text-white/40">
        Page {pageIndex + 1} of {pageCount} &middot; {shownCount} of {totalCount} {unitLabel}
      </p>
    </div>
  );
}

export { PaginationDot };
