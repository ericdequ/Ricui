// =============================================================================
// @ric/ui-core/section-header — compact uppercase section label + optional icon
// =============================================================================
// Upstreamed from BEV src/ui/SectionHeader over the earlier title+subtitle
// version (which had no @ric-internal consumers). A small "icon + UPPERCASE
// TRACKED LABEL + optional trailing" divider for inside cards — NOT a page
// header. Icons arrive as components. The `sm` (canonical eyebrow) size inlines
// BEV's .text-eyebrow recipe (11px / 0.22em / uppercase / leading-none).
// =============================================================================

import { cx } from './index.js';

const SIZES = {
  xs: { text: 'text-[10px] tracking-[0.22em]', icon: 'h-3 w-3', gap: 'gap-1.5' },
  sm: { text: 'text-[11px] tracking-[0.22em] leading-none', icon: 'h-3.5 w-3.5', gap: 'gap-2' },
  md: { text: 'text-sm tracking-[0.18em]', icon: 'h-4 w-4', gap: 'gap-2' },
};

/**
 * Compact in-card section heading: uppercase, wide-tracked, muted by default.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.label
 * @param {import('react').ElementType} [props.icon] - Leading icon component.
 * @param {'xs'|'sm'|'md'} [props.size]
 * @param {string} [props.tone] - Text/icon color class (default muted-on-dark).
 * @param {import('react').ReactNode} [props.trailing] - Content after the label.
 * @param {string} [props.className]
 * @param {'h2'|'h3'|'h4'|'div'} [props.as]
 */
export function SectionHeader({ label, icon: Icon, size = 'sm', tone = 'text-white/48', trailing, className = '', as: Tag = 'h3' }) {
  const sizing = SIZES[size] || SIZES.sm;
  return (
    <div className={cx('flex items-center justify-between', sizing.gap, className)}>
      <Tag className={cx('inline-flex items-center font-semibold uppercase', sizing.gap, sizing.text, tone)}>
        {Icon ? <Icon className={cx(sizing.icon, 'flex-shrink-0')} aria-hidden="true" /> : null}
        <span>{label}</span>
      </Tag>
      {trailing ? <div className="flex-shrink-0">{trailing}</div> : null}
    </div>
  );
}
