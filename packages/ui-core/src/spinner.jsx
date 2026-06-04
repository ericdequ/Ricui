// =============================================================================
// @ric/ui-core/spinner — canonical loading ring (pure CSS)
// =============================================================================
// Upstreamed from BEV src/ui/Loading. A ring that spins via animate-spin (no
// framer). `size="inherit"` skips the w/h classes so a parent (button/icon slot)
// drives dimensions; `color="current"` inherits the parent's text color.
// =============================================================================

import { cx } from './index.js';

const SIZES = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
  inherit: 'border-2',
};

const COLORS = {
  purple: 'border-purple-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  blue: 'border-blue-500 border-t-transparent',
  green: 'border-green-500 border-t-transparent',
  fuchsia: 'border-white/20 border-t-fuchsia-500',
  current: 'border-current/35 border-t-current',
};

/**
 * @param {object} props
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'inherit'} [props.size]
 * @param {string} [props.className]
 * @param {'purple'|'white'|'blue'|'green'|'fuchsia'|'current'} [props.color]
 */
export function Spinner({ size = 'md', className = '', color = 'purple' }) {
  return (
    <div className={cx(SIZES[size] || SIZES.md, COLORS[color] || COLORS.purple, 'animate-spin rounded-full motion-reduce:animate-none', className)} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
