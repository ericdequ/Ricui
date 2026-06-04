// =============================================================================
// @ric/ui-core/icon-button — canonical icon-only button (component OR node icon)
// =============================================================================
// Unifies BEV's richer IconButton with @ric/ui-core's earlier lean one. The
// `icon` prop accepts EITHER a component (BEV: icon={XIcon}) OR a rendered node
// (@ric/chat: icon={<XIcon/>}) — both are sized into the glyph box. Accessible
// label resolves from ariaLabel → label → tooltip, so old @ric/chat call sites
// (label=…) and BEV call sites (ariaLabel/tooltip=…) both keep working.
//
// De-BEV'd: tone/size tables inlined, framer/bev-pressable press → Tailwind
// transforms, useDedupedActivation → a self-contained 350ms double-activation
// guard (same as Button).
// =============================================================================

import { forwardRef, useCallback, useRef } from 'react';

import { cx } from './index.js';

const TONES = {
  plain: 'border-transparent bg-transparent text-white/65 shadow-none hover:bg-white/[0.08] hover:text-white',
  slate: 'border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.14]',
  fuchsia: 'border-fuchsia-400/30 bg-fuchsia-400/20 text-fuchsia-200 hover:bg-fuchsia-400/25',
  emerald: 'border-emerald-400/30 bg-emerald-400/20 text-emerald-200 hover:bg-emerald-400/25',
  amber: 'border-amber-400/30 bg-amber-400/20 text-amber-200 hover:bg-amber-400/25',
  rose: 'border-rose-400/30 bg-rose-400/20 text-rose-200 hover:bg-rose-400/25',
  cyan: 'border-cyan-400/30 bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/25',
  sky: 'border-sky-400/30 bg-sky-400/20 text-sky-200 hover:bg-sky-400/25',
  violet: 'border-violet-400/30 bg-violet-400/20 text-violet-200 hover:bg-violet-400/25',
};

const FRAME = { xs: 'h-7 w-7', sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
const GLYPH = { xs: 'h-3.5 w-3.5', sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
const VARIANT_ALIAS = { default: 'slate', primary: 'fuchsia', success: 'emerald', warning: 'amber', danger: 'rose', info: 'cyan' };

const resolveTone = (tone, variant) => {
  if (tone && TONES[tone]) return tone;
  if (variant && TONES[VARIANT_ALIAS[variant]]) return VARIANT_ALIAS[variant];
  return 'slate';
};

/**
 * Square icon-only button. `icon` is a component or a rendered node.
 *
 * @param {object} props
 * @param {import('react').ElementType|import('react').ReactNode} props.icon
 * @param {keyof typeof TONES} [props.tone]
 * @param {'default'|'primary'|'success'|'warning'|'danger'|'info'} [props.variant]
 * @param {'xs'|'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.label] - Accessible label (legacy @ric name).
 * @param {string} [props.ariaLabel] - Accessible label (preferred).
 * @param {string} [props.tooltip] - Native title + label fallback.
 * @param {string} [props.iconClassName]
 * @param {string} [props.className]
 * @param {(e: import('react').MouseEvent) => void} [props.onClick]
 * @param {'button'|'submit'|'reset'} [props.type]
 */
export const IconButton = forwardRef(function IconButton(
  { icon, tone, variant, size = 'md', label, ariaLabel, tooltip, iconClassName = '', className = '', onClick, type = 'button', ...rest },
  ref,
) {
  const resolvedTone = resolveTone(tone, variant);
  const glyph = GLYPH[size] || GLYPH.md;

  const lastClickRef = useRef(0);
  const handleClick = useCallback(
    (event) => {
      const now = event.timeStamp || Date.now();
      if (now - lastClickRef.current < 350) return;
      lastClickRef.current = now;
      onClick?.(event);
    },
    [onClick],
  );

  const glyphClass = cx(glyph, 'transition-transform duration-300 ease-out group-hover/iconbtn:scale-[1.06] motion-reduce:transform-none motion-reduce:transition-none', iconClassName);
  const Icon = icon;
  const renderedIcon =
    typeof icon === 'function'
      ? <Icon className={glyphClass} aria-hidden="true" />
      : <span className={cx('inline-flex items-center justify-center', glyphClass)} aria-hidden="true">{icon}</span>;

  return (
    <button
      ref={ref}
      type={type}
      title={tooltip}
      aria-label={ariaLabel || label || tooltip}
      onClick={handleClick}
      className={cx(
        'group/iconbtn flex items-center justify-center rounded-2xl border transition-all hover:scale-[1.04] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:scale-100 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100',
        TONES[resolvedTone] || TONES.slate,
        FRAME[size] || FRAME.md,
        className,
      )}
      {...rest}
    >
      {renderedIcon}
    </button>
  );
});
