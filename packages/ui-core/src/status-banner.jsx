// =============================================================================
// @ric/ui-core/status-banner — success/error banner (panel or inline)
// =============================================================================
// Upstreamed from BEV src/ui/StatusBanner, replacing @ric's lean StatusBanner
// (no internal consumers). De-BEV'd: framer ENTER.drop → .ric-drop-in keyframe
// (styles.css); the default success/error glyphs are inlined (override via
// `icon`). Two appearances: `panel` (filled card) and `inline` (compact row).
// =============================================================================

import { memo } from 'react';

import { cx } from './index.js';

function CheckGlyph({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" clipRule="evenodd" />
    </svg>
  );
}
function WarnGlyph({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
      <path fillRule="evenodd" d="M8.26 3.1c.77-1.33 2.71-1.33 3.48 0l5.58 9.65c.77 1.33-.19 3-1.74 3H4.42c-1.55 0-2.51-1.67-1.74-3L8.26 3.1ZM10 7a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
  );
}

const VARIANT_GLYPH = { success: CheckGlyph, error: WarnGlyph };

const STYLES = {
  panel: {
    shell: 'rounded-xl border p-4',
    row: 'flex items-center gap-3',
    icon: 'h-5 w-5',
    message: 'text-sm font-medium',
    variants: {
      success: { shell: 'border-green-500/50 bg-green-500/20', icon: 'text-green-400', message: 'text-green-300' },
      error: { shell: 'border-red-500/50 bg-red-500/20', icon: 'text-red-400', message: 'text-red-300' },
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
 * @param {'success'|'error'} [props.variant]
 */
export const StatusBanner = memo(function StatusBanner({ appearance = 'panel', children, className = '', icon, message, variant = 'error' }) {
  const styles = STYLES[appearance] || STYLES.panel;
  const v = variant === 'success' ? 'success' : 'error';
  const vs = styles.variants[v];
  const Icon = icon || VARIANT_GLYPH[v];
  const content = children || message;
  if (!content) return null;

  return (
    <div className={cx('ric-drop-in', styles.shell, vs.shell, className)}>
      <div className={styles.row}>
        {Icon ? <Icon className={cx(styles.icon, vs.icon)} /> : null}
        <span className={cx(styles.message, vs.message)}>{content}</span>
      </div>
    </div>
  );
});
