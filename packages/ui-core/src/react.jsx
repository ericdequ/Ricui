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

import { ICON_SIZE, MOTION, resolveTone } from '@ric/ui-tokens';

import { cx, toneChipClass } from './index.js';

// Form + section primitives (migrated from BEV src/ui).
export { FieldFeedback, Input, SectionHeader, StatusBanner,Textarea, Toggle } from './forms.jsx';
// Overlays, nav, display (migrated from BEV src/ui).
export { BottomSheet, Modal, Pagination, StarRating,Tabs, Toast } from './more.jsx';

const PILL_SIZE = {
  xs: 'px-1.5 py-0.5 text-[10px] gap-1',
  sm: 'px-2 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-1.5',
};

/**
 * Canonical pill / chip / tag. Leading-content priority: `leading` (any JSX)
 * wins, else `icon`. When `onClick` is set it renders as a button with press
 * feedback; otherwise a span.
 *
 * @param {object} props
 * @param {string} [props.tone] - Explicit canonical tone.
 * @param {string} [props.variant] - Semantic alias (success/warning/danger/…).
 * @param {'xs'|'sm'|'md'|'lg'} [props.size]
 * @param {import('react').ReactNode} [props.leading] - Arbitrary leading node.
 * @param {import('react').ReactNode} [props.icon] - Leading icon node.
 * @param {() => void} [props.onClick]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export function Pill({
  tone,
  variant,
  size = 'md',
  leading,
  icon,
  onClick,
  className,
  children,
  ...rest
}) {
  const cls = cx(
    'inline-flex items-center rounded-full border font-medium',
    PILL_SIZE[size] || PILL_SIZE.md,
    toneChipClass({ tone, variant }),
    onClick && cx('cursor-pointer', MOTION.tap),
    className,
  );
  const lead = leading ?? (icon ? <span className={cx('shrink-0', ICON_SIZE.pill[size] || ICON_SIZE.pill.md)}>{icon}</span> : null);
  const inner = (
    <>
      {lead}
      <span className="truncate">{children}</span>
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} {...rest}>
        {inner}
      </button>
    );
  }
  return <span className={cls} {...rest}>{inner}</span>;
}

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

const ICONBTN_TONE = {
  slate: 'text-slate-200 hover:bg-slate-500/20',
  emerald: 'text-emerald-200 hover:bg-emerald-500/20',
  amber: 'text-amber-200 hover:bg-amber-500/20',
  rose: 'text-rose-200 hover:bg-rose-500/20',
  fuchsia: 'text-fuchsia-200 hover:bg-fuchsia-500/20',
  cyan: 'text-cyan-200 hover:bg-cyan-500/20',
  sky: 'text-sky-200 hover:bg-sky-500/20',
  violet: 'text-violet-200 hover:bg-violet-500/20',
};

/**
 * Glyph-only square button. `label` is required for a11y (aria-label).
 * @param {object} props
 * @param {import('react').ReactNode} props.icon
 * @param {string} props.label
 * @param {'xs'|'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.tone]
 * @param {string} [props.variant]
 * @param {() => void} [props.onClick]
 * @param {string} [props.className]
 */
export function IconButton({ icon, label, size = 'md', tone, variant, onClick, className, ...rest }) {
  const resolved = ICONBTN_TONE[resolveTone(tone, variant)] || ICONBTN_TONE.slate;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(
        'inline-flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40',
        ICON_SIZE.iconButtonFrame[size] || ICON_SIZE.iconButtonFrame.md,
        resolved,
        MOTION.tap,
        className,
      )}
      {...rest}
    >
      <span className={ICON_SIZE.iconButtonGlyph[size] || ICON_SIZE.iconButtonGlyph.md}>{icon}</span>
    </button>
  );
}

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
