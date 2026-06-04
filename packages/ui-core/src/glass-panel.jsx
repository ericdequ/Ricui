// =============================================================================
// @ric/ui-core/glass-panel — glass surface system (panel + pill + button + cards)
// =============================================================================
// Upstreamed from BEV src/ui/GlassPanel. Thin JSX over the data-attribute glass
// tones shipped in @ric/ui-core/styles.css (import it once). De-BEV'd: the
// CheckCircle icon is inlined (was a BEV icon-pack import) and the button sheen
// uses .ric-button-shine. Icons arrive as components/elements.
// =============================================================================

import { cloneElement, createElement, isValidElement, memo } from 'react';

import { CheckCircle } from './glyphs.jsx';
import { cx } from './index.js';

const canInstantiateComponentType = (value) =>
  Boolean(value && !isValidElement(value) && (typeof value === 'function' || (typeof value === 'object' && value.$$typeof)));

/**
 * Small tone-styled status pill (data-tone-pill-* → styles.css).
 * @param {object} props
 * @param {import('react').ElementType} [props.icon]
 * @param {string} [props.tone] @param {'dark'|'light'} [props.theme]
 * @param {boolean} [props.caps] @param {'xs'|'sm'} [props.size]
 * @param {string} [props.className] @param {import('react').ReactNode} [props.children]
 */
export const TonePill = memo(function TonePill({ icon: Icon = null, tone = 'slate', theme = 'dark', caps = true, size = 'sm', className = '', children }) {
  return (
    <span
      data-tone-pill-theme={theme}
      data-tone-pill-tone={tone}
      className={cx(
        'tone-pill inline-flex items-center gap-1.5 border font-semibold shadow-[0_10px_24px_rgba(2,6,23,0.12)] backdrop-blur-xl',
        size === 'xs' ? 'rounded-full px-2.5 py-1 text-[10px]' : 'rounded-full px-3.5 py-1.5 text-[11px]',
        caps ? 'font-display-label' : 'tracking-[-0.018em]',
        className,
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span>{children}</span>
    </span>
  );
});

/**
 * Glass button shell with tone/variant/size + polymorphic `as`.
 * @param {object} props
 * @param {import('react').ElementType} [props.as]
 * @param {string} [props.tone] @param {'soft'|'solid'} [props.variant] @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.block] @param {string} [props.className] @param {import('react').ReactNode} [props.children]
 */
export const ToneButton = memo(function ToneButton({ as: Component = 'button', tone = 'neutral', variant = 'soft', size = 'md', block = false, className = '', children, ...props }) {
  return (
    <Component
      data-tone-button-tone={tone}
      data-tone-button-variant={variant}
      data-tone-button-size={size}
      className={cx(
        'tone-button-tone tone-button-size ric-button-shine inline-flex items-center justify-center gap-2 border font-semibold leading-none tracking-[-0.018em] shadow-[0_18px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60',
        block ? 'flex w-full' : '',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

/**
 * Shared inner surface used inside larger glass panels.
 * @param {object} props
 * @param {import('react').ElementType} [props.as] @param {'neutral'|'cyan'|'dashed'} [props.tone]
 * @param {string} [props.className] @param {import('react').ReactNode} [props.children]
 */
export const InsetPanel = memo(function InsetPanel({ as: Component = 'div', tone = 'neutral', className = '', children, ...props }) {
  return (
    <Component data-inset-tone={tone} className={cx('inset-panel rounded-3xl border p-4', className)} {...props}>
      {children}
    </Component>
  );
});

/**
 * Selectable card for radio-like option grids. `icon` may be an element, a
 * component, or a string/number.
 * @param {object} props
 */
export const SelectableGlassCard = memo(function SelectableGlassCard({
  as: Component = 'button',
  type = 'button',
  active = false,
  icon = null,
  iconClassName = '',
  title,
  description,
  tone = 'neutral',
  className = '',
  children = null,
  ...props
}) {
  const iconContent = isValidElement(icon)
    ? cloneElement(icon, { className: cx('h-5 w-5', icon.props?.className, iconClassName) })
    : canInstantiateComponentType(icon)
      ? createElement(icon, { className: cx('h-5 w-5', iconClassName) })
      : typeof icon === 'string' || typeof icon === 'number'
        ? icon
        : null;

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={cx(
        'group flex h-full w-full flex-col rounded-3xl border p-4 text-left transition duration-200',
        active ? 'border-white/30 bg-white/[0.14] shadow-[0_18px_42px_rgba(2,6,23,0.2)]' : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          data-selectable-tone={tone}
          className={cx(
            'selectable-icon-shell inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-[0_14px_30px_rgba(2,6,23,0.18)]',
            typeof iconContent === 'string' ? 'text-xl' : '',
            active ? 'border-white/24 bg-white/14' : 'border-white/10 bg-white/[0.06]',
          )}
        >
          {iconContent}
        </span>
        {active ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
            <CheckCircle className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      {title ? <p className="mt-3 text-sm font-semibold tracking-[-0.018em] text-white">{title}</p> : null}
      {description ? <p className="mt-1 text-sm leading-5 text-white/60">{description}</p> : null}
      {children}
    </Component>
  );
});

/**
 * Primary glass surface with optional eyebrow/title/description/action header.
 * @param {object} props
 */
export const GlassPanel = memo(function GlassPanel({ eyebrow, title, description, action = null, tone = 'neutral', compact = false, className = '', children, ...props }) {
  return (
    <section
      data-glass-tone={tone}
      className={cx('glass-panel app-panel-shell relative overflow-hidden border shadow-[0_24px_80px_rgba(0,0,0,0.28)]', compact ? 'rounded-3xl p-4' : 'rounded-[30px] p-4 sm:p-5', className)}
      {...props}
    >
      <div className="glass-panel-glow pointer-events-none absolute inset-0" />
      <div className="relative">
        {(eyebrow || title || description || action) && (
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              {eyebrow ? <p className="font-display-label text-[11px] text-white/45">{eyebrow}</p> : null}
              {title ? <h3 className="font-display-title text-base font-black tracking-[-0.03em] text-white sm:text-lg">{title}</h3> : null}
              {description ? <p className="text-copy-soft max-w-2xl text-[0.94rem] leading-6 text-white/68">{description}</p> : null}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
});
