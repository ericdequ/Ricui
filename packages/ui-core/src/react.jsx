// =============================================================================
// @ric/ui-core/react — generic presentation primitives
// =============================================================================
// Prop-driven, domain-agnostic React components. No framer-motion (micro-
// interactions are CSS via MOTION.tap/lift), no icon pack (icons arrive as
// JSX through `leading`/`icon` props or children). React is a peer dependency.
//
// These are the chrome the @ric/places, @ric/meetups, and @ric/chat packages
// compose. Keep them lean: composition + slots over variant props.
// =============================================================================

import { MOTION } from '@ric/ui-tokens';

import { cx, toneChipClass } from './index.js';

// Form + section primitives (migrated from BEV src/ui).
export { FieldFeedback, Input, StatusBanner,Textarea } from './forms.jsx';
// SectionHeader is BEV's compact eyebrow label (replaced the title+subtitle one);
// SectionEyebrow + AccentBadge are the bar-tab micro-labels.
export { SectionHeader } from './section-header.jsx';
export { AccentBadge, SectionEyebrow } from './tab-primitives.jsx';
// Toggle is the bespoke brand-sparkle switch (richer than the old lean one).
export { Toggle, ToggleGlyph } from './toggle.jsx';
export { BrandGradient } from './brand.jsx';
// Overlays, nav, display (migrated from BEV src/ui).
export { BottomSheet, Modal, Pagination, Tabs, Toast } from './more.jsx';
// StarRating — precise fractional version upstreamed from BEV (was ★-rounded).
export { StarRating } from './star-rating.jsx';
// Button — CSS-first; needs the '@ric/ui-core/styles.css' import for ripple/sheen.
export { Button } from './button.jsx';
// Composite nav/flow primitives.
export { ButtonGroup, ButtonGroupItem } from './button-group.jsx';
export { StepProgressBar } from './step-progress.jsx';

// Pill — the bespoke radial-bloom chip upstreamed from BEV (richer than the old
// lean version: 14 tones, icon bubble, emoji, gradient, weight, uppercase).
export { Pill } from './pill.jsx';

/**
 * Tiny count / signal badge — circular when short, pill when wide.
 * @param {object} props
 * @param {string} [props.tone]
 * @param {string} [props.variant]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export function Badge({ tone, variant, className, children, ...rest }) {
  return (
    <span
      className={cx(
        'inline-flex min-w-[1.25rem] items-center justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold leading-none',
        toneChipClass({ tone, variant }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

const COUNT_TONE = {
  slate: 'border-white/15 bg-white/10 text-white',
  rose: 'border-rose-300/40 bg-rose-500/95 text-white',
  emerald: 'border-emerald-300/40 bg-emerald-500/95 text-white',
  amber: 'border-amber-300/40 bg-amber-500/95 text-white',
  fuchsia: 'border-fuchsia-300/40 bg-fuchsia-500/95 text-white',
  violet: 'border-violet-300/40 bg-violet-500/95 text-white',
  cyan: 'border-cyan-300/40 bg-cyan-500/95 text-white',
  sky: 'border-sky-300/40 bg-sky-500/95 text-white',
};

const COUNT_SIZE = {
  xs: 'h-4 min-w-[16px] px-1 text-[9px]',
  sm: 'h-5 min-w-[20px] px-1.5 text-[10px]',
  md: 'h-6 min-w-[24px] px-2 text-xs',
};

/**
 * Tiny numeric badge ("5" / "12" / "99+") for bells, tabs, presence. Renders
 * NOTHING when count is nullish or ≤ 0 (strict-addition: never an empty "0"),
 * and caps at `max` with a "+" suffix. Solid fills (not chip tones) so it reads
 * clearly when clipped onto a Pill or IconButton.
 *
 * @param {object} props
 * @param {number|null|undefined} props.count - Nullish or ≤ 0 renders nothing.
 * @param {number} [props.max] - Above this, display as `${max}+` (default 99).
 * @param {'slate'|'rose'|'emerald'|'amber'|'fuchsia'|'violet'|'cyan'|'sky'} [props.tone]
 * @param {'xs'|'sm'|'md'} [props.size]
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel] - Overrides the default "N items" label.
 */
export function CountBadge({ count, max = 99, tone = 'rose', size = 'sm', className, ariaLabel }) {
  const numeric = Number(count);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const display = numeric > max ? `${max}+` : String(numeric);
  return (
    <span
      aria-label={ariaLabel || `${numeric} ${numeric === 1 ? 'item' : 'items'}`}
      className={cx(
        'inline-flex items-center justify-center rounded-full border font-black tabular-nums',
        COUNT_TONE[tone] || COUNT_TONE.rose,
        COUNT_SIZE[size] || COUNT_SIZE.sm,
        className,
      )}
    >
      {display}
    </span>
  );
}

const STATPILL_TONE = {
  amber: 'border-amber-300/22 bg-amber-500/14 text-amber-100',
  cyan: 'border-cyan-300/22 bg-cyan-500/14 text-cyan-100',
  emerald: 'border-emerald-300/22 bg-emerald-500/14 text-emerald-100',
  fuchsia: 'border-fuchsia-300/22 bg-fuchsia-500/14 text-fuchsia-100',
  rose: 'border-rose-300/22 bg-rose-500/14 text-rose-100',
  slate: 'border-white/12 bg-white/[0.06] text-white/82',
};

/**
 * Score/stat display chip. Two shapes via `variant`: an inline tone-driven pill
 * (default), or a stacked label-over-value `card`. `value` is a node so it can
 * hold a count, text, or emoji.
 *
 * @param {object} props
 * @param {string} [props.label] - Muted label (uppercase).
 * @param {import('react').ReactNode} [props.value] - The stat value.
 * @param {'chip'|'card'} [props.variant]
 * @param {'amber'|'cyan'|'emerald'|'fuchsia'|'rose'|'slate'} [props.tone]
 * @param {string} [props.className]
 */
export function StatPill({ label, value, variant = 'chip', tone = 'slate', className }) {
  if (variant === 'card') {
    return (
      <div className={cx('rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-center', className)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{label}</p>
        <p className="mt-1 text-base font-black text-white">{value}</p>
      </div>
    );
  }
  return (
    <div
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]',
        STATPILL_TONE[tone] || STATPILL_TONE.slate,
        className,
      )}
    >
      {label != null ? <span className="opacity-60">{label}</span> : null}
      <span>{value}</span>
    </div>
  );
}

/**
 * Slotted final-board / leaderboard row: a full-width flex row whose border
 * switches to an amber wash for the winner/leader. Pure slot — the row body is
 * the caller's children.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.highlight] - Winner/leader emphasis (amber wash).
 * @param {string} [props.className]
 */
export function ResultRow({ children, highlight = false, className }) {
  return (
    <div
      className={cx(
        'flex items-center justify-between rounded-[20px] border px-4 py-3',
        highlight ? 'border-amber-300/30 bg-amber-500/12' : 'border-white/10 bg-white/[0.04]',
        className,
      )}
    >
      {children}
    </div>
  );
}

// IconButton moved to ./icon-button.jsx — BEV's richer version, adapted to accept
// EITHER a component or a node `icon` so @ric/chat (node + label) keeps working.
export { IconButton } from './icon-button.jsx';

/**
 * Generic dark-glass card surface. Slot-based: pass `media`, `header`,
 * `footer`, and/or children. No domain knowledge — @ric/places PlaceCard and
 * @ric/meetups MeetupCard compose this.
 *
 * @param {object} props
 * @param {import('react').ReactNode} [props.media] - Top media slot (image/map).
 * @param {import('react').ReactNode} [props.header]
 * @param {import('react').ReactNode} [props.footer]
 * @param {boolean} [props.interactive] - Add hover-lift + pointer affordance.
 * @param {() => void} [props.onClick]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export function Card({ media, header, footer, interactive, onClick, className, children, ...rest }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left backdrop-blur-md',
        (interactive || onClick) && cx('hover:border-white/20', MOTION.lift),
        className,
      )}
      {...rest}
    >
      {media ? <div className="relative">{media}</div> : null}
      {(header || children || footer) && (
        <div className="flex flex-1 flex-col gap-2 p-3">
          {header}
          {children}
          {footer ? <div className="mt-auto pt-1">{footer}</div> : null}
        </div>
      )}
    </Tag>
  );
}

const DOT_TONE = {
  emerald: 'bg-emerald-300',
  rose: 'bg-rose-300',
  amber: 'bg-amber-300',
  slate: 'bg-slate-300',
  sky: 'bg-sky-300',
};

/**
 * Status dot — solid colored dot, optionally pulsing (e.g. "live"/"open").
 * @param {object} props
 * @param {'emerald'|'rose'|'amber'|'slate'|'sky'} [props.tone]
 * @param {boolean} [props.pulse]
 * @param {string} [props.className]
 */
export function StatusDot({ tone = 'slate', pulse, className }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'inline-block h-2 w-2 rounded-full',
        DOT_TONE[tone] || DOT_TONE.slate,
        pulse && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
    />
  );
}
