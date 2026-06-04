// =============================================================================
// @ric/ui-core/tab-primitives — section eyebrow + accent badge
// =============================================================================
// Upstreamed from BEV src/ui/TabPrimitives, de-BEV'd (cx, JSDoc). Two small
// labels: SectionEyebrow (uppercase micro-copy above a title) and AccentBadge (a
// color-coded relationship/utility pill). Self-contained, prop-driven.
// =============================================================================

import { cx } from './index.js';

const EYEBROW_TONE = {
  indigo: 'text-indigo-300',
  cyan: 'text-cyan-300',
  pink: 'text-pink-300',
  emerald: 'text-emerald-300',
  amber: 'text-amber-300',
  rose: 'text-rose-300',
};

/**
 * Uppercase micro-copy header rendered above a section title ("TONIGHT", "LIVE").
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {keyof typeof EYEBROW_TONE} [props.tone]
 * @param {string} [props.className]
 */
export function SectionEyebrow({ children, tone = 'indigo', className = '' }) {
  return (
    <span className={cx('block text-[11px] font-black uppercase tracking-[0.2em]', EYEBROW_TONE[tone] || EYEBROW_TONE.indigo, className)}>
      {children}
    </span>
  );
}

const ACCENT_TONE = {
  self: 'border-cyan-300/40 bg-cyan-400/20 text-cyan-100',
  cyan: 'border-cyan-300/40 bg-cyan-400/20 text-cyan-100',
  friend: 'border-pink-500/30 bg-pink-500/20 text-pink-300',
  pink: 'border-pink-500/30 bg-pink-500/20 text-pink-300',
  indigo: 'border-indigo-400/30 bg-indigo-500/20 text-indigo-200',
  emerald: 'border-emerald-500/30 bg-emerald-500/20 text-emerald-200',
  amber: 'border-amber-400/30 bg-amber-500/20 text-amber-200',
  rose: 'border-rose-400/30 bg-rose-500/20 text-rose-200',
  slate: 'border-slate-500/30 bg-slate-500/20 text-slate-200',
};

/**
 * Small color-coded pill ("You", "Friend", "Tonight").
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {keyof typeof ACCENT_TONE} [props.tone]
 * @param {string} [props.className]
 */
export function AccentBadge({ children, tone = 'indigo', className = '' }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]', ACCENT_TONE[tone] || ACCENT_TONE.indigo, className)}>
      {children}
    </span>
  );
}
