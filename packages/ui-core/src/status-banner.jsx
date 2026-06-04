// =============================================================================
// @ric/ui-core/status-banner — status banner (panel or inline), 4 canonical states
// =============================================================================
// Upstreamed from BEV src/ui/StatusBanner, replacing @ric's lean StatusBanner
// (no internal consumers). De-BEV'd: framer ENTER.drop → .ric-drop-in keyframe
// (styles.css); default glyphs are inlined (override via `icon`). Two appearances
// — `panel` (filled card) and `inline` (compact row) — across success / error /
// warning / info (matching the Toast vocabulary).
// =============================================================================

import { memo } from 'react';

import { CheckCircle, InfoCircle, WarnTriangle, XCircle } from './glyphs.jsx';
import { cx } from './index.js';

const VARIANT_GLYPH = { success: CheckCircle, error: XCircle, warning: WarnTriangle, info: InfoCircle };

const STYLES = {
  panel: {
    shell: 'rounded-xl border p-4',
    row: 'flex items-center gap-3',
    icon: 'h-5 w-5',
    message: 'text-sm font-medium',
    variants: {
      success: { shell: 'border-green-500/50 bg-green-500/20', icon: 'text-green-400', message: 'text-green-300' },
      error: { shell: 'border-red-500/50 bg-red-500/20', icon: 'text-red-400', message: 'text-red-300' },
      warning: { shell: 'border-amber-500/50 bg-amber-500/20', icon: 'text-amber-400', message: 'text-amber-300' },
      info: { shell: 'border-sky-500/45 bg-sky-500/15', icon: 'text-sky-400', message: 'text-sky-200' },
    },
  },
  inline: {
    shell: 'mt-3 flex items-start gap-2 rounded-[14px] border px-3.5 py-2.5 text-sm',
    row: 'contents',
    icon: 'mt-0.5 h-4 w-4 flex-shrink-0',
    message: '',
    variants: {
      success: { shell: 'border-emerald-400/30 bg-emerald-500/[0.12] text-emerald-200', icon: '', message: '' },
      error: { shell: 'border-rose-400/25 bg-rose-500/[0.10] text-rose-200', icon: '', message: '' },
      warning: { shell: 'border-amber-400/30 bg-amber-500/[0.12] text-amber-200', icon: '', message: '' },
      info: { shell: 'border-sky-400/30 bg-sky-500/[0.12] text-sky-200', icon: '', message: '' },
    },
  },
};

/**
 * @param {object} props
 * @param {'panel'|'inline'} [props.appearance]
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {import('react').ElementType} [props.icon] - Override the variant glyph.
 * @param {import('react').ReactNode} [props.message]
 * @param {'success'|'error'|'warning'|'info'} [props.variant]
 */
export const StatusBanner = memo(function StatusBanner({ appearance = 'panel', children, className = '', icon, message, variant = 'error' }) {
  const styles = STYLES[appearance] || STYLES.panel;
  const v = styles.variants[variant] ? variant : 'error';
  const vs = styles.variants[v];
  const Icon = icon || VARIANT_GLYPH[v];
  const content = children || message;
  if (!content) return null;

  return (
    <div role="status" className={cx('ric-drop-in', styles.shell, vs.shell, className)}>
      <div className={styles.row}>
        {Icon ? <Icon className={cx(styles.icon, vs.icon)} /> : null}
        <span className={cx(styles.message, vs.message)}>{content}</span>
      </div>
    </div>
  );
});
