// =============================================================================
// @ric/ui-core/react — overlays, nav, and display primitives (migrated from BEV)
// =============================================================================
// Modal, BottomSheet, Toast, Tabs, Pagination, StarRating. De-BEV'd, prop-driven,
// CSS transitions (no framer-motion), React peer only (no react-dom portal — a
// consumer can wrap in its own portal if needed). Re-exported from ./react.jsx.
// =============================================================================

import { useEffect } from 'react';

import { cx, toneChipClass } from './index.js';

function useEscape(active, onClose) {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, onClose]);
}

const OVERLAY = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm';

/** Centered modal dialog. Renders nothing when `open` is false. */
export function Modal({ open, onClose, title, children, footer, className }) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className={OVERLAY} onClick={onClose} role="presentation">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
          onClick={(e) => e.stopPropagation()}
          className={cx('w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-4 text-white shadow-2xl', className)}
        >
          {title ? <h2 className="mb-3 text-lg font-semibold">{title}</h2> : null}
          <div>{children}</div>
          {footer ? <div className="mt-4 flex justify-end gap-2">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

/** Bottom sheet that slides up from the edge. */
export function BottomSheet({ open, onClose, title, children, className }) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className={OVERLAY} onClick={onClose} role="presentation">
      <div className="flex min-h-full items-end justify-center">
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className={cx(
            'w-full max-w-lg rounded-t-3xl border-t border-white/10 bg-slate-900 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-white',
            className,
          )}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" aria-hidden="true" />
          {title ? <h2 className="mb-2 text-base font-semibold">{title}</h2> : null}
          {children}
        </div>
      </div>
    </div>
  );
}

/** A single toast. The app owns the queue/positioning; this renders one. */
export function Toast({ tone, variant, icon, children, onDismiss, className }) {
  return (
    <div role="status" className={cx('flex items-start gap-2 rounded-xl border px-3 py-2 text-sm shadow-lg', toneChipClass({ tone, variant }), className)}>
      {icon ? <span className="mt-0.5 h-4 w-4 shrink-0">{icon}</span> : null}
      <div className="min-w-0 flex-1">{children}</div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="shrink-0 text-white/50 hover:text-white">×</button>
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
              'flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none',
              on ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white',
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
  const btn = 'rounded-full px-3 py-1 text-sm text-white/80 enabled:hover:bg-white/10 disabled:opacity-40';
  return (
    <div className={cx('flex items-center justify-center gap-2', className)}>
      <button type="button" className={btn} disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous">‹</button>
      <span className="text-xs text-white/60">{page} / {pages}</span>
      <button type="button" className={btn} disabled={page >= pages} onClick={() => go(page + 1)} aria-label="Next">›</button>
    </div>
  );
}

// StarRating moved to ./star-rating.jsx — the precise fractional (SVG gradient)
// version upstreamed from BEV, replacing this ★-glyph rounding one.
