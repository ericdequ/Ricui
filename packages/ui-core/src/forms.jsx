// =============================================================================
// @ric/ui-core/react — form + section primitives (migrated from BEV src/ui)
// =============================================================================
// Prop-driven, domain-agnostic. De-BEV'd reimplementations of BEV's Toggle,
// form/{Input,Textarea,FieldFeedback}, SectionHeader, and StatusBanner. CSS
// micro-interactions (no framer-motion), React peer only. Re-exported from
// ./react.jsx so they ship under "@ric/ui-core/react".
// =============================================================================

import { cx, toneChipClass } from './index.js';

/**
 * On/off switch. Controlled via `checked` + `onChange(next)`.
 * @param {{checked?:boolean, onChange?:(v:boolean)=>void, label?:string, disabled?:boolean, size?:'sm'|'md', className?:string}} props
 */
export function Toggle({ checked = false, onChange, label, disabled, size = 'md', className }) {
  const dims = size === 'sm' ? { track: 'h-5 w-9', knob: 'h-4 w-4', shift: 'translate-x-4' } : { track: 'h-6 w-11', knob: 'h-5 w-5', shift: 'translate-x-5' };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cx(
        'relative inline-flex shrink-0 items-center rounded-full border border-white/10 transition-colors duration-200 motion-reduce:transition-none',
        dims.track,
        checked ? 'bg-emerald-500/70' : 'bg-white/15',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span
        className={cx(
          'inline-block transform rounded-full bg-white shadow transition-transform duration-200 motion-reduce:transition-none',
          dims.knob,
          checked ? dims.shift : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

/**
 * Field validation/help line under an input.
 * @param {{state?:'error'|'success'|'hint', children?:any, className?:string}} props
 */
export function FieldFeedback({ state = 'hint', children, className }) {
  if (!children) return null;
  const tone = state === 'error' ? 'text-rose-300' : state === 'success' ? 'text-emerald-300' : 'text-white/50';
  return (
    <p role={state === 'error' ? 'alert' : undefined} className={cx('mt-1 text-xs', tone, className)}>
      {children}
    </p>
  );
}

const FIELD_BASE =
  'w-full rounded-xl border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 transition-colors';

const fieldTone = (error) =>
  error
    ? 'border-rose-400/40 focus-visible:ring-rose-400/40'
    : 'border-white/10 focus-visible:ring-fuchsia-400/40';

/**
 * Text input with label + error wiring.
 * @param {{label?:string, error?:string, hint?:string, className?:string, [k:string]:any}} props
 */
export function Input({ label, error, hint, className, id, ...rest }) {
  const inputId = id || (label ? `f-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <label className={cx('block', className)} htmlFor={inputId}>
      {label ? <span className="mb-1 block text-xs font-medium text-white/70">{label}</span> : null}
      <input id={inputId} aria-invalid={Boolean(error)} className={cx(FIELD_BASE, fieldTone(error))} {...rest} />
      <FieldFeedback state={error ? 'error' : 'hint'}>{error || hint}</FieldFeedback>
    </label>
  );
}

/** Multiline input. Same contract as Input. */
export function Textarea({ label, error, hint, rows = 3, className, id, ...rest }) {
  const inputId = id || (label ? `t-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <label className={cx('block', className)} htmlFor={inputId}>
      {label ? <span className="mb-1 block text-xs font-medium text-white/70">{label}</span> : null}
      <textarea id={inputId} rows={rows} aria-invalid={Boolean(error)} className={cx(FIELD_BASE, 'resize-y', fieldTone(error))} {...rest} />
      <FieldFeedback state={error ? 'error' : 'hint'}>{error || hint}</FieldFeedback>
    </label>
  );
}

/**
 * Section header: title + optional subtitle + trailing actions slot.
 * @param {{title:any, subtitle?:any, actions?:any, as?:any, className?:string}} props
 */
export function SectionHeader({ title, subtitle, actions, as: Tag = 'h2', className }) {
  return (
    <div className={cx('mb-3 flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <Tag className="truncate text-base font-semibold text-white">{title}</Tag>
        {subtitle ? <p className="mt-0.5 text-sm text-white/60">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/**
 * Inline status banner.
 * @param {{tone?:string, variant?:string, icon?:any, children:any, className?:string}} props
 */
export function StatusBanner({ tone, variant, icon, children, className }) {
  return (
    <div role="status" className={cx('flex items-start gap-2 rounded-xl border px-3 py-2 text-sm', toneChipClass({ tone, variant }), className)}>
      {icon ? <span className="mt-0.5 h-4 w-4 shrink-0">{icon}</span> : null}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
