// =============================================================================
// @ric/ui-core/react — overlays, nav, and display primitives (migrated from BEV)
// =============================================================================
// Toast, Tabs, Pagination. De-BEV'd, prop-driven, CSS transitions (no framer).
// (Modal/BottomSheet → ./modal.jsx; StarRating → ./star-rating.jsx.)
// Re-exported from ./react.jsx.
// =============================================================================

import { ChevronLeft, ChevronRight, XMark } from './glyphs.jsx';
import { cx, toneChipClass } from './index.js';

// Modal + BottomSheet moved to ./modal.jsx — the full portal modal system
// (center/bottom-sheet/top/fullscreen, framer→CSS drag-to-dismiss + a11y)
// upstreamed from BEV, replacing these lean overlays.

/** A single toast. The app owns the queue/positioning; this renders one. */
export function Toast({ tone, variant, icon, children, onDismiss, className }) {
  return (
    <div role="status" className={cx('flex items-start gap-2 rounded-xl border px-3 py-2 text-sm shadow-lg', toneChipClass({ tone, variant }), className)}>
      {icon ? <span className="mt-0.5 h-4 w-4 shrink-0">{icon}</span> : null}
      <div className="min-w-0 flex-1">{children}</div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40 motion-reduce:transition-none"
        >
          <XMark className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

/**
 * Controlled tab bar.
 * @param {{items:Array<{id:string,label:any}>, active:string, onChange:(id:string)=>void, className?:string}} props
 */
export function Tabs({ items, active, onChange, className }) {
  return (
    <div role="tablist" className={cx('flex gap-1 rounded-full bg-white/5 p-1', className)}>
      {items.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange?.(t.id)}
            className={cx(
              'flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 motion-reduce:transition-none',
              on ? 'bg-white/15 text-white shadow-sm' : 'text-white/60 hover:text-white',
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Prev/next + page indicator. 1-based `page`, `pages` total. */
export function Pagination({ page, pages, onChange, className }) {
  const go = (p) => p >= 1 && p <= pages && onChange?.(p);
  const btn =
    'inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors duration-200 enabled:hover:bg-white/10 enabled:hover:text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 motion-reduce:transition-none';
  return (
    <div className={cx('flex items-center justify-center gap-2', className)}>
      <button type="button" className={btn} disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-xs tabular-nums text-white/60">{page} / {pages}</span>
      <button type="button" className={btn} disabled={page >= pages} onClick={() => go(page + 1)} aria-label="Next">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// StarRating moved to ./star-rating.jsx — the precise fractional (SVG gradient)
// version upstreamed from BEV, replacing this ★-glyph rounding one.
