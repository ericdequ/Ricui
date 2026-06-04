// =============================================================================
// @ric/ui-core/pill — canonical radial-bloom pill / chip / tag
// =============================================================================
// Upstreamed from BEV src/ui/Pill, de-BEV'd:
//   • framer motion.span → plain span (no call site forwards framer props), and
//     useReducedMotion dropped (the pulse + press are motion-reduce CSS classes).
//   • icon-tone tokens inlined (PILL_ICON_SIZE + variant alias + local resolver).
//   • onClick renders through the @ric Button so press/focus stay unified.
// Tones are a radial bloom (strongest at center, dissolving to transparent) so a
// pill reads as a soft presence rather than a bordered chip. Leading-content
// priority: `leading` > `emoji` > `icon`.
// =============================================================================

import { Button } from './button.jsx';
import { cx } from './index.js';

// Radial-bloom tone bodies (border-transparent; color radiates from center).
const TONES = {
  slate: 'border-transparent text-white/95 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.08)_50%,transparent_85%)]',
  amber: 'border-transparent text-amber-50 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.55)_0%,rgba(245,158,11,0.18)_50%,transparent_85%)]',
  emerald: 'border-transparent text-emerald-50 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.55)_0%,rgba(16,185,129,0.18)_50%,transparent_85%)]',
  rose: 'border-transparent text-rose-50 bg-[radial-gradient(ellipse_at_center,rgba(251,113,133,0.55)_0%,rgba(244,63,94,0.18)_50%,transparent_85%)]',
  red: 'border-transparent text-red-50 bg-[radial-gradient(ellipse_at_center,rgba(248,113,113,0.55)_0%,rgba(239,68,68,0.18)_50%,transparent_85%)]',
  orange: 'border-transparent text-orange-50 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.55)_0%,rgba(249,115,22,0.18)_50%,transparent_85%)]',
  violet: 'border-transparent text-violet-50 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.55)_0%,rgba(139,92,246,0.18)_50%,transparent_85%)]',
  fuchsia: 'border-transparent text-fuchsia-50 bg-[radial-gradient(ellipse_at_center,rgba(232,121,249,0.55)_0%,rgba(217,70,239,0.18)_50%,transparent_85%)]',
  purple: 'border-transparent text-purple-50 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.55)_0%,rgba(168,85,247,0.18)_50%,transparent_85%)]',
  pink: 'border-transparent text-pink-50 bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.55)_0%,rgba(236,72,153,0.18)_50%,transparent_85%)]',
  cyan: 'border-transparent text-cyan-50 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.55)_0%,rgba(6,182,212,0.18)_50%,transparent_85%)]',
  sky: 'border-transparent text-sky-50 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.55)_0%,rgba(14,165,233,0.18)_50%,transparent_85%)]',
  blue: 'border-transparent text-blue-50 bg-[radial-gradient(ellipse_at_center,rgba(96,165,250,0.55)_0%,rgba(59,130,246,0.18)_50%,transparent_85%)]',
  indigo: 'border-transparent text-indigo-50 bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.55)_0%,rgba(99,102,241,0.18)_50%,transparent_85%)]',
};

// Hover intensifies the bloom uniformly (radial stops don't compose with
// hover:from-/to-, so lift brightness + saturation in lockstep).
const HOVER_BLOOM = 'hover:brightness-125 hover:saturate-125';

const SIZES = {
  xs: 'gap-1 px-2 py-0.5 text-[10px]',
  sm: 'gap-1.5 px-2.5 py-1 text-xs',
  md: 'gap-1.5 px-3 py-1 text-[11px] tracking-[0.02em]',
  chip: 'gap-1.5 px-3 py-1.5 text-xs',
  lg: 'gap-2 px-4 py-2 text-sm',
};

const PILL_ICON_SIZE = { xs: 'h-3 w-3', sm: 'h-3.5 w-3.5', md: 'h-3.5 w-3.5', chip: 'h-3.5 w-3.5', lg: 'h-4 w-4' };

// "Icon-bubble" treatment — icon sits in a smaller solid-fill circle that reads
// as a concentric ring catching the pill's color.
const BUBBLE_TONES = {
  slate: 'border-white/50 bg-white/18',
  amber: 'border-amber-300/70 bg-amber-500/40',
  emerald: 'border-emerald-300/70 bg-emerald-500/40',
  rose: 'border-rose-300/70 bg-rose-500/40',
  red: 'border-red-300/70 bg-red-500/40',
  orange: 'border-orange-300/70 bg-orange-500/40',
  violet: 'border-violet-300/70 bg-violet-500/40',
  fuchsia: 'border-fuchsia-300/70 bg-fuchsia-500/40',
  purple: 'border-purple-300/70 bg-purple-500/40',
  pink: 'border-pink-300/70 bg-pink-500/40',
  cyan: 'border-cyan-300/70 bg-cyan-500/40',
  sky: 'border-sky-300/70 bg-sky-500/40',
  blue: 'border-blue-300/70 bg-blue-500/40',
  indigo: 'border-indigo-300/70 bg-indigo-500/40',
};

const BUBBLE_SIZES = { xs: 'h-4 w-4', sm: 'h-5 w-5', md: 'h-[22px] w-[22px]', chip: 'h-5 w-5', lg: 'h-6 w-6' };
const BUBBLE_ICON_SIZES = { xs: 'h-2.5 w-2.5', sm: 'h-3 w-3', md: 'h-3 w-3', chip: 'h-3 w-3', lg: 'h-3.5 w-3.5' };

const WEIGHTS = { semibold: 'font-semibold', bold: 'font-bold', black: 'font-black' };
const UPPERCASE_LABEL = 'uppercase tracking-[0.14em]';

const VARIANT_ALIAS = { default: 'slate', primary: 'fuchsia', success: 'emerald', warning: 'amber', danger: 'rose', info: 'cyan' };

/** Resolve (tone, variant) against the pill's tone table; defaults to slate. */
const resolveTone = (tone, variant) => {
  if (tone && TONES[tone]) return tone;
  if (variant && TONES[VARIANT_ALIAS[variant]]) return VARIANT_ALIAS[variant];
  return 'slate';
};

const renderLeading = ({ leading, emoji, Icon, iconBubble, tone, size }) => {
  if (leading) return leading;
  if (emoji != null && emoji !== '') {
    return (
      <span className="text-[1.1em]" aria-hidden="true">
        {emoji}
      </span>
    );
  }
  if (!Icon) return null;
  const iconSize = PILL_ICON_SIZE[size] || PILL_ICON_SIZE.sm;
  if (iconBubble) {
    return (
      <span
        className={cx(
          'flex flex-shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ease-out group-hover/pill:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none',
          BUBBLE_TONES[tone] || BUBBLE_TONES.slate,
          BUBBLE_SIZES[size] || BUBBLE_SIZES.sm,
        )}
      >
        <Icon className={BUBBLE_ICON_SIZES[size] || BUBBLE_ICON_SIZES.sm} aria-hidden="true" />
      </span>
    );
  }
  return (
    <Icon
      className={cx('flex-shrink-0 transition-transform duration-300 ease-out group-hover/pill:-translate-x-px motion-reduce:transform-none motion-reduce:transition-none', iconSize)}
      aria-hidden="true"
    />
  );
};

/**
 * Canonical pill / chip / tag. Leading priority: `leading` > `emoji` > `icon`.
 * With `onClick` it renders through the @ric Button (unified press/focus).
 *
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {keyof typeof TONES} [props.tone]
 * @param {'default'|'primary'|'success'|'warning'|'danger'|'info'} [props.variant]
 * @param {'xs'|'sm'|'md'|'chip'|'lg'} [props.size]
 * @param {'semibold'|'bold'|'black'} [props.weight]
 * @param {boolean} [props.uppercase]
 * @param {import('react').ElementType} [props.icon] - Leading icon component.
 * @param {boolean} [props.iconBubble] - Wrap the icon in a colored circle.
 * @param {import('react').ReactNode} [props.emoji]
 * @param {import('react').ReactNode} [props.leading] - Arbitrary leading node (wins).
 * @param {boolean} [props.animate] - Loop an opacity pulse.
 * @param {string} [props.gradient] - `from-… to-…` classes that override the tone bg.
 * @param {() => void} [props.onClick] - When set, renders through Button.
 * @param {string} [props.ariaLabel]
 * @param {string} [props.className]
 */
export function Pill({
  children,
  tone,
  variant,
  size = 'sm',
  weight = 'semibold',
  uppercase = false,
  icon: Icon,
  iconBubble = false,
  emoji,
  leading,
  animate = false,
  gradient,
  onClick,
  ariaLabel,
  className = '',
  ...rest
}) {
  const resolvedTone = resolveTone(tone, variant);
  const bgClass = gradient
    ? cx(`bg-gradient-to-r ${gradient}`, `border-${resolvedTone}-400/40`, `text-${resolvedTone}-100`)
    : TONES[resolvedTone];
  const sizeClass = SIZES[size] || SIZES.sm;
  const weightClass = WEIGHTS[weight] || WEIGHTS.semibold;
  const labelClass = uppercase ? UPPERCASE_LABEL : '';
  const animateClass = animate ? 'animate-pulse motion-reduce:animate-none' : '';

  const baseClass = cx('group/pill inline-flex items-center rounded-full border', weightClass, bgClass, sizeClass, labelClass, animateClass, className);
  const lead = renderLeading({ leading, emoji, Icon, iconBubble, tone: resolvedTone, size });
  const body = children != null && children !== '' ? <span>{children}</span> : null;

  if (onClick) {
    return (
      <Button
        variant="custom"
        size="none"
        shape="none"
        pressEffect="row"
        showRipple={false}
        showHighlight={false}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cx(baseClass, gradient ? '' : HOVER_BLOOM, 'min-h-[32px] cursor-pointer transition-colors')}
        contentClassName="contents"
        {...rest}
      >
        {lead}
        {body}
      </Button>
    );
  }

  return (
    <span className={baseClass} aria-label={ariaLabel} {...rest}>
      {lead}
      {body}
    </span>
  );
}
