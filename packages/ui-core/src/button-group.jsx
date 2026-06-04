// =============================================================================
// @ric/ui-core/button-group — segmented / docked / floating button rail
// =============================================================================
// Upstreamed from BEV src/ui/ButtonGroup, de-BEV'd (cx, JSDoc, @ric CountBadge).
// ButtonGroup is the container shell; ButtonGroupItem is a self-contained nav
// button (NOT the Button primitive) with an optional icon shell + count badge.
// Icons arrive as components via `icon` (consistent with Button).
// =============================================================================

import { cx } from './index.js';
import { CountBadge } from './react.jsx';

const GROUP_VARIANTS = {
  bare: '',
  floating:
    'relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,31,0.92),rgba(7,17,31,0.82))] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl',
  docked:
    'custom-scrollbar flex items-center gap-1 overflow-x-auto rounded-t-[1.5rem] border-t border-white/10 bg-zinc-950/92 px-3 py-2.5 shadow-[0_-12px_34px_rgba(0,0,0,0.46)] backdrop-blur-2xl',
  segmented:
    'grid rounded-[28px] border border-white/10 bg-white/[0.06] p-2 shadow-[0_22px_55px_rgba(0,0,0,0.36)] backdrop-blur-2xl',
};

const ITEM_SIZE = {
  compact: 'min-h-[48px] px-2 py-2 text-[10px]',
  comfortable: 'min-h-[58px] px-3 py-3 text-sm',
  tall: 'min-h-[68px] px-2 py-3 text-[10px]',
};

const ITEM_ORIENTATION = {
  row: 'flex-row gap-2',
  column: 'flex-col gap-1.5 text-center',
};

const ICON_SHELL_SIZE = { none: '', sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-10 w-10' };

/**
 * Button rail container. `variant` picks the shell (bare/floating/docked/segmented).
 * @param {object} props
 * @param {import('react').ElementType} [props.as]
 * @param {import('react').ReactNode} [props.children]
 * @param {keyof typeof GROUP_VARIANTS} [props.variant]
 * @param {string} [props.className]
 */
export function ButtonGroup({ as: Component = 'div', children, variant = 'bare', className, ...rest }) {
  return (
    <Component className={cx(GROUP_VARIANTS[variant] || GROUP_VARIANTS.bare, className)} {...rest}>
      {children}
    </Component>
  );
}

/**
 * One rail button: optional icon (in an optional shell) + count badge + label,
 * with an active treatment (gradient or custom background node).
 *
 * @param {object} props
 * @param {import('react').ElementType} [props.icon] - Leading icon component.
 * @param {object} [props.iconProps]
 * @param {keyof typeof ICON_SHELL_SIZE} [props.iconShell]
 * @param {import('react').ReactNode} [props.label]
 * @param {number} [props.badge] - Count badge value (hidden when ≤ 0).
 * @param {string} [props.badgeTone]
 * @param {boolean} [props.active]
 * @param {boolean} [props.disabled]
 * @param {string} [props.activeGradient] - `from-… to-…` gradient for the active wash.
 * @param {import('react').ReactNode} [props.activeBackground] - Custom active bg node.
 * @param {string} [props.activeClassName]
 * @param {string} [props.inactiveClassName]
 * @param {string} [props.iconClassName]
 * @param {string} [props.iconShellClassName]
 * @param {string} [props.labelClassName]
 * @param {keyof typeof ITEM_ORIENTATION} [props.orientation]
 * @param {keyof typeof ITEM_SIZE} [props.size]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {() => void} [props.onClick]
 * @param {'button'|'submit'|'reset'} [props.type]
 */
export function ButtonGroupItem({
  icon: Icon,
  iconProps = null,
  iconShell = 'none',
  label,
  badge = 0,
  badgeTone = 'rose',
  active = false,
  disabled = false,
  activeGradient = '',
  activeBackground = null,
  activeClassName = '',
  inactiveClassName = '',
  iconClassName = '',
  iconShellClassName = '',
  labelClassName = '',
  orientation = 'column',
  size = 'comfortable',
  className = '',
  children = null,
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      data-active={active ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      className={cx(
        'group relative isolate flex w-full min-w-0 items-center justify-center overflow-hidden rounded-[1.35rem] border font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
        ITEM_ORIENTATION[orientation] || ITEM_ORIENTATION.column,
        ITEM_SIZE[size] || ITEM_SIZE.comfortable,
        active
          ? cx('border-white/0 text-white', activeClassName)
          : cx('border-white/10 bg-white/[0.035] text-white/64 hover:-translate-y-px hover:bg-white/[0.075] hover:text-white', inactiveClassName),
        className,
      )}
      {...rest}
    >
      {activeBackground}
      {active && !activeBackground && activeGradient ? (
        <>
          <span className={cx('absolute inset-0 rounded-[inherit] bg-gradient-to-br shadow-[0_18px_40px_rgba(0,0,0,0.28)]', activeGradient)} />
          <span className="absolute inset-x-5 top-0 h-px bg-white/35" />
        </>
      ) : null}
      {Icon ? (
        <span className="relative inline-flex overflow-visible">
          <span className={cx('relative z-[1] flex shrink-0 items-center justify-center rounded-full transition', ICON_SHELL_SIZE[iconShell] || '', iconShellClassName)}>
            <Icon
              {...iconProps}
              className={cx('transition-transform duration-200 group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100', iconClassName)}
            />
          </span>
          <CountBadge count={badge} size="sm" tone={badgeTone} className="pointer-events-none absolute -right-3 -top-2 z-[2] shadow-lg ring-2 ring-slate-950" />
        </span>
      ) : null}
      {label ? <span className={cx('relative max-w-full truncate tracking-wide', labelClassName)}>{label}</span> : null}
      {children}
    </button>
  );
}
