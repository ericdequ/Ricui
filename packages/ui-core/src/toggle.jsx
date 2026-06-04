// =============================================================================
// @ric/ui-core/toggle — bespoke SVG switch with a brand-sparkle micro-interaction
// =============================================================================
// Upstreamed from BEV src/ui/Toggle, de-BEV'd framer→CSS:
//   • knob: framer spring on `cx` → a CSS transform:translateX transition with a
//     soft overshoot (cubic-bezier), motion-reduce-gated.
//   • sparkles: framer AnimatePresence → the `.ric-toggle-spark` keyframes from
//     @ric/ui-core/styles.css. The off→on trigger (mount three puffs for ~320ms)
//     stays in React state; CSS owns the animation + reduced-motion suppression.
//   • BrandGradient comes from ./brand.jsx (no icon-pack import).
//
// Track color is currentColor: callers set `text-cyan-400` etc. Sparkles always
// use the brand fuchsia→violet→indigo gradient. Needs '@ric/ui-core/styles.css'.
//
// Two exports: <Toggle> (full <button role="switch"> with a11y) and <ToggleGlyph>
// (visual SVG only, for use inside an already-clickable row).
// =============================================================================

import { useEffect, useId, useRef, useState } from 'react';

import { BrandGradient } from './brand.jsx';
import { cx } from './index.js';

const SIZES = {
  sm: { w: 36, h: 20, knobR: 7.5, off: 10, on: 26, box: 'h-5 w-9' },
  md: { w: 48, h: 26, knobR: 10, off: 13, on: 35, box: 'h-[26px] w-12' },
};

const KNOB_MOTION = 'transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none';

/**
 * Visual-only switch glyph. Use inside an already-clickable row (the container
 * owns role/aria/click); standalone use should prefer <Toggle>.
 * @param {object} props
 * @param {boolean} [props.checked]
 * @param {'sm'|'md'} [props.size]
 * @param {string} [props.className]
 */
export function ToggleGlyph({ checked = false, size = 'md', className }) {
  const reactId = useId();
  const gradId = `ric-tg-${reactId.replace(/:/g, '')}`;
  const sz = SIZES[size] || SIZES.md;

  // Fire sparkles only on the off→on edge (never on mount, never on off).
  const [sparkling, setSparkling] = useState(false);
  const prev = useRef(checked);
  useEffect(() => {
    const was = prev.current;
    prev.current = checked;
    if (!was && checked) {
      setSparkling(true);
      const t = setTimeout(() => setSparkling(false), 320);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [checked]);

  const sparks = [
    { cx: sz.on + 4, cy: sz.h / 2 - 5, r: 2.2, delay: '0ms' },
    { cx: sz.on - 2, cy: sz.h / 2 + 6, r: 1.6, delay: '60ms' },
    { cx: sz.on + 7, cy: sz.h / 2 + 2, r: 1.2, delay: '100ms' },
  ];

  return (
    <svg viewBox={`0 0 ${sz.w} ${sz.h}`} className={cx(sz.box, 'overflow-visible', className)} aria-hidden="true">
      <defs>
        <BrandGradient id={gradId} x1={sz.on - 4} y1={sz.h / 2 + 6} x2={sz.on + 8} y2={sz.h / 2 - 6} />
      </defs>

      {/* Track fill (currentColor) + hairline border. */}
      <rect
        x={0.5}
        y={0.5}
        width={sz.w - 1}
        height={sz.h - 1}
        rx={sz.h / 2}
        ry={sz.h / 2}
        fill="currentColor"
        className={cx('transition-opacity duration-200 motion-reduce:transition-none', checked ? 'opacity-90' : 'opacity-15')}
      />
      <rect x={0.5} y={0.5} width={sz.w - 1} height={sz.h - 1} rx={sz.h / 2} ry={sz.h / 2} fill="none" stroke="currentColor" strokeWidth={0.75} opacity={0.32} />

      {/* Knob — CSS transform:translateX (was a framer spring on cx). */}
      <circle
        cx={sz.off}
        cy={sz.h / 2}
        r={sz.knobR}
        fill="#ffffff"
        className={cx('drop-shadow-[0_1.5px_3px_rgba(2,6,23,0.4)]', KNOB_MOTION)}
        style={{ transform: checked ? `translateX(${sz.on - sz.off}px)` : 'translateX(0)' }}
      />

      {/* Sparkles — mount on the off→on edge; CSS owns the puff + reduced-motion. */}
      {sparkling ? (
        <g fill={`url(#${gradId})`}>
          {sparks.map((s) => (
            <circle key={`${s.cx}-${s.cy}`} cx={s.cx} cy={s.cy} r={s.r} className="ric-toggle-spark" style={{ animationDelay: s.delay }} />
          ))}
        </g>
      ) : null}
    </svg>
  );
}

/**
 * Full switch: <button role="switch"> with a11y + keyboard. `pending` shows a
 * pulse and blocks interaction (like disabled).
 * @param {object} props
 * @param {boolean} [props.checked]
 * @param {(next:boolean) => void} [props.onChange]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.pending]
 * @param {'sm'|'md'} [props.size]
 * @param {string} [props.label] - Accessible label.
 * @param {string} [props.className]
 */
export function Toggle({ checked = false, onChange, disabled = false, pending = false, size = 'md', label, className }) {
  const inert = disabled || pending;
  const handleClick = (event) => {
    if (inert) {
      event.preventDefault();
      return;
    }
    event.stopPropagation();
    onChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={inert}
      disabled={inert}
      onClick={handleClick}
      className={cx(
        'group relative inline-flex shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
        inert ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        pending && 'animate-pulse',
        className,
      )}
    >
      <ToggleGlyph checked={checked} size={size} />
    </button>
  );
}
