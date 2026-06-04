// =============================================================================
// @ric/ui-core/button — unified, accessible button (CSS-first, no framer)
// =============================================================================
// Upstreamed from BEV src/ui/Button, de-BEV'd:
//   • cva -> plain variant maps composed with cx (no class-variance-authority).
//   • framer-motion press spring -> Tailwind transform utilities (hover lift +
//     active tap), gated by motion-reduce. pressEffect picks the intensity.
//   • the JS tap ripple + hover sheen keep their look via @ric/ui-core/styles.css
//     (.ric-ripple / .ric-button-shine) — import it once in the consuming app.
//   • Spinner inlined as a pure-CSS ring (currentColor) for the loading state.
//   • a small self-contained double-activation guard replaces BEV's app-global
//     actionDedupe — suppresses a second click within 350ms (double-submit).
//   • icons arrive as components via `icon`/`rightIcon` (unchanged BEV contract).
// =============================================================================

import { forwardRef, useCallback, useRef, useState } from 'react';

import { cx } from './index.js';

const BASE = [
  'inline-flex items-center justify-center gap-2',
  'ric-button-shine border leading-none font-semibold tracking-[-0.018em] antialiased',
  'shadow-[0_18px_42px_rgba(2,6,23,0.18)] backdrop-blur-xl',
  'transition-all duration-300 transform-gpu',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'relative overflow-hidden',
];

const VARIANT = {
  primary: 'border-orange-200/40 bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 hover:from-orange-400 hover:via-rose-500 hover:to-fuchsia-500 text-white shadow-lg hover:shadow-xl hover:shadow-rose-500/25 focus-visible:ring-rose-400',
  google: 'border-white/10 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-600 hover:from-fuchsia-400 hover:via-violet-400 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl hover:shadow-violet-500/25 focus-visible:ring-violet-400',
  apple: 'border-white/16 bg-slate-950 hover:bg-black text-white shadow-lg focus-visible:ring-white/70',
  secondary: 'border-white/18 bg-white/10 hover:border-white/26 hover:bg-white/16 text-white focus-visible:ring-white/90',
  ghost: 'border-transparent bg-white/[0.03] hover:bg-white/[0.09] text-white/90 hover:text-white shadow-none focus-visible:ring-white/90',
  outline: 'bg-transparent border-white/24 hover:bg-white/[0.08] text-white shadow-none focus-visible:ring-white/90',
  glass: 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15 text-white shadow-lg shadow-black/10 hover:shadow-xl focus-visible:ring-white/50',
  light: 'border-white/30 bg-slate-100/80 hover:border-white/40 hover:bg-slate-100/90 text-slate-950 shadow-[0_12px_30px_rgba(2,6,23,0.24)] hover:shadow-[0_16px_38px_rgba(2,6,23,0.3)] focus-visible:ring-rose-200/80',
  soft: 'border-white/15 bg-white/[0.075] hover:border-white/24 hover:bg-white/[0.12] text-white/90 hover:text-white shadow-[0_12px_30px_rgba(2,6,23,0.14)] focus-visible:ring-white/70',
  muted: 'border-slate-700/70 bg-slate-950/72 hover:border-slate-500/80 hover:bg-slate-900/80 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-visible:ring-slate-300',
  dashed: 'border-dashed border-white/14 bg-white/[0.04] hover:border-white/24 hover:bg-white/[0.08] text-white/82 hover:text-white shadow-none focus-visible:ring-white/70',
  info: 'border-cyan-300/40 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 focus-visible:ring-cyan-300',
  accent: 'border-violet-300/40 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl hover:shadow-fuchsia-500/25 focus-visible:ring-fuchsia-300',
  danger: 'border-red-300/40 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 focus-visible:ring-red-400',
  success: 'border-emerald-300/40 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 focus-visible:ring-emerald-400',
  warning: 'border-amber-200/50 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/25 focus-visible:ring-amber-300',
  custom: 'border-transparent bg-transparent text-inherit shadow-none hover:shadow-none focus-visible:ring-white/70 focus-visible:ring-offset-0',
};

const SIZE = {
  xs: 'min-h-[34px] px-3 py-1.5 text-xs',
  sm: 'min-h-[38px] px-3.5 py-2 text-sm',
  md: 'min-h-[46px] px-4.5 py-2.5 text-base',
  lg: 'min-h-[50px] px-6 py-3 text-lg',
  xl: 'min-h-[54px] px-8 py-4 text-xl',
  none: 'p-0',
};

const SHAPE = {
  control: 'rounded-[1.15rem]',
  soft: 'rounded-2xl',
  pill: 'rounded-full',
  tile: 'rounded-[22px]',
  none: '',
};

// Press intensities (framer spring -> CSS transforms). All compositor-only and
// auto-disabled by motion-reduce. `cta` lifts + taps; `row`/`icon` tap only.
const PRESS = {
  cta: 'transition-transform hover:-translate-y-px hover:scale-[1.01] active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100',
  row: 'transition-transform active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100',
  icon: 'transition-transform active:scale-[0.94] motion-reduce:transition-none motion-reduce:active:scale-100',
  none: '',
};

// Icon box per size — mirrors BEV BUTTON_ICON_SIZE so the glyph-to-frame ratio
// stays constant across Button / IconButton / Pill.
const ICON_BOX = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-[22px] w-[22px]',
  xl: 'h-6 w-6',
  none: 'h-3.5 w-3.5',
};

/** Pure-CSS ring spinner that inherits the button's text color + icon box. */
function Spinner({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cx('inline-block animate-spin rounded-full border-2 border-current/35 border-t-current motion-reduce:animate-none', className)}
    />
  );
}

/**
 * Unified accessible button. Icons are components (`icon={ChevronLeftIcon}`).
 * Import `@ric/ui-core/styles.css` once for the ripple + sheen effects.
 *
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {keyof typeof VARIANT} [props.variant]
 * @param {keyof typeof SIZE} [props.size]
 * @param {keyof typeof SHAPE} [props.shape]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading] - Show spinner + block interaction.
 * @param {string} [props.loadingLabel]
 * @param {'cta'|'row'|'icon'|'none'} [props.pressEffect]
 * @param {boolean} [props.showRipple]
 * @param {boolean} [props.showHighlight] - Subtle top radial highlight.
 * @param {import('react').ElementType} [props.icon] - Leading icon component.
 * @param {import('react').ElementType} [props.rightIcon] - Trailing icon component.
 * @param {string} [props.iconClassName]
 * @param {(e: import('react').MouseEvent) => void} [props.onClick]
 * @param {'button'|'submit'|'reset'} [props.type]
 * @param {string} [props.className]
 * @param {string} [props.contentClassName]
 * @param {string} [props.ariaLabel]
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    shape = 'control',
    fullWidth = false,
    disabled = false,
    loading = false,
    loadingLabel,
    pressEffect = 'cta',
    showRipple = true,
    showHighlight = true,
    icon: Icon,
    rightIcon: RightIcon,
    iconClassName = '',
    onClick,
    type = 'button',
    className = '',
    contentClassName = '',
    ariaLabel,
    ...rest
  },
  ref,
) {
  const iconBox = ICON_BOX[size] || ICON_BOX.md;
  const inert = disabled || loading;

  // Double-activation guard: suppress a second click within 350ms (covers the
  // touch->click ghost and accidental double-submit) without an app-global
  // event-marking system.
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

  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);
  const rippleOff = inert || !showRipple;

  const handlePointerDown = useCallback(
    (event) => {
      if (rippleOff) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const span = Math.hypot(rect.width, rect.height);
      const id = rippleId.current++;
      setRipples((prev) => [
        ...prev,
        { id, x: event.clientX - rect.left - span / 2, y: event.clientY - rect.top - span / 2, span },
      ]);
    },
    [rippleOff],
  );

  const dropRipple = useCallback((id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <button
      ref={ref}
      type={type}
      disabled={inert}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      aria-disabled={inert}
      className={cx(
        BASE,
        VARIANT[variant] || VARIANT.primary,
        SIZE[size] || SIZE.md,
        SHAPE[shape] || SHAPE.control,
        fullWidth ? 'w-full' : 'w-auto',
        pressEffect !== 'none' && !inert && (PRESS[pressEffect] || PRESS.cta),
        className,
      )}
      {...rest}
    >
      {showHighlight && variant !== 'custom' ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]"
        />
      ) : null}

      <span className={cx('group/btn relative z-10 inline-flex items-center gap-2', contentClassName)}>
        {loading ? (
          <>
            <Spinner className={cx(iconBox, 'flex-shrink-0')} />
            {loadingLabel ? <span>{loadingLabel}</span> : null}
          </>
        ) : (
          <>
            {Icon ? (
              <Icon
                aria-hidden="true"
                className={cx(iconBox, 'flex-shrink-0 transition-transform duration-300 ease-out group-hover/btn:-translate-x-px motion-reduce:transform-none motion-reduce:transition-none', iconClassName)}
              />
            ) : null}
            {children}
            {RightIcon ? (
              <RightIcon
                aria-hidden="true"
                className={cx(iconBox, 'flex-shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-px motion-reduce:transform-none motion-reduce:transition-none', iconClassName)}
              />
            ) : null}
          </>
        )}
      </span>

      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="ric-ripple pointer-events-none absolute rounded-full bg-white/30"
          style={{ left: r.x, top: r.y, width: r.span, height: r.span }}
          onAnimationEnd={() => dropRipple(r.id)}
        />
      ))}
    </button>
  );
});
