// =============================================================================
// @ric/ui-core/toast — animated notification system (card + container + hook)
// =============================================================================
// Upstreamed from BEV src/ui/Toast, de-BEV'd framer→CSS: the card enter →
// .ric-toast-in, the auto-dismiss progress bar → .ric-toast-progress with an
// inline duration (both in styles.css). Type glyphs are inlined (no icon pack);
// action/close use the @ric Button/IconButton. ToastContainer positions the
// stack top-right with safe-area insets. useToast owns the queue + helpers.
// =============================================================================

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from './button.jsx';
import { cx } from './index.js';
import { IconButton } from './icon-button.jsx';

const g = (path, opts = {}) => function Glyph({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill={opts.stroke ? 'none' : 'currentColor'} stroke={opts.stroke ? 'currentColor' : undefined} strokeWidth={opts.stroke ? 2 : undefined} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path fillRule={opts.stroke ? undefined : 'evenodd'} clipRule={opts.stroke ? undefined : 'evenodd'} d={path} />
    </svg>
  );
};

const CheckCircle = g('M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z');
const XCircle = g('M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.7 7.3a1 1 0 0 0-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 1 0 1.4 1.4L10 11.4l1.3 1.3a1 1 0 0 0 1.4-1.4L11.4 10l1.3-1.3a1 1 0 0 0-1.4-1.4L10 8.6 8.7 7.3Z');
const WarnTriangle = g('M8.26 3.1c.77-1.33 2.71-1.33 3.48 0l5.58 9.65c.77 1.33-.19 3-1.74 3H4.42c-1.55 0-2.51-1.67-1.74-3L8.26 3.1ZM10 7a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z');
const InfoCircle = g('M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm1 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z');
const XMark = g('M6 6l8 8M14 6l-8 8', { stroke: true });

const TYPE_GLYPH = { success: CheckCircle, error: XCircle, warning: WarnTriangle, info: InfoCircle };

const TYPE_COLORS = {
  success: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/40', text: 'text-green-200', icon: 'text-green-400', progress: 'bg-green-400' },
  error: { bg: 'from-red-500/20 to-pink-500/20', border: 'border-red-500/40', text: 'text-red-200', icon: 'text-red-400', progress: 'bg-red-400' },
  warning: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/40', text: 'text-amber-200', icon: 'text-amber-400', progress: 'bg-amber-400' },
  info: { bg: 'from-slate-950/95 via-sky-950/90 to-slate-950/95', border: 'border-sky-400/35', text: 'text-slate-50', icon: 'text-sky-300', progress: 'bg-sky-300' },
};

/**
 * Single animated notification card.
 * @param {object} props
 * @param {'success'|'error'|'warning'|'info'} [props.type]
 * @param {import('react').ReactNode} props.message @param {import('react').ReactNode} [props.description]
 * @param {number} [props.duration] - Auto-dismiss ms (also drives the progress bar); falsy disables.
 * @param {() => void} [props.onClose] @param {{label:string, onClick:() => void}} [props.action]
 */
function Toast({ type = 'info', message, description, duration = 5000, onClose, action }) {
  const Icon = TYPE_GLYPH[type] || InfoCircle;
  const colors = TYPE_COLORS[type] || TYPE_COLORS.info;

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration, onClose]);

  return (
    <div className={cx('ric-toast-in relative w-full max-w-md overflow-hidden rounded-2xl border bg-gradient-to-r shadow-2xl backdrop-blur-xl', colors.bg, colors.border)}>
      {duration ? <div className={cx('ric-toast-progress absolute left-0 top-0 h-1', colors.progress)} style={{ animationDuration: `${duration}ms` }} /> : null}
      <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1rem-1px)] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="flex items-start gap-3 p-4">
        <Icon className={cx('h-6 w-6 flex-shrink-0', colors.icon)} />
        <div className="min-w-0 flex-1">
          <p className={cx('text-sm font-semibold', colors.text)}>{message}</p>
          {description ? <p className={cx('mt-1 text-xs opacity-80', colors.text)}>{description}</p> : null}
          {action ? (
            <Button variant="custom" size="none" shape="none" pressEffect="row" showRipple={false} showHighlight={false} onClick={action.onClick} className={cx('mt-2 text-xs font-semibold transition-opacity hover:opacity-80', colors.text)} contentClassName="contents">
              {action.label}
            </Button>
          ) : null}
        </div>
        {onClose ? (
          <IconButton icon={XMark} tone="plain" size="xs" onClick={onClose} className={cx('h-7 w-7 flex-shrink-0 rounded-lg hover:bg-white/10', colors.text)} ariaLabel="Close notification" />
        ) : null}
      </div>
    </div>
  );
}

function ToastRow({ toast, removeToast }) {
  const handleClose = useCallback(() => removeToast(toast.id), [removeToast, toast.id]);
  return (
    <div className="pointer-events-auto">
      <Toast {...toast} onClose={handleClose} />
    </div>
  );
}

/**
 * Fixed top-right stack of active toasts (safe-area aware).
 * @param {object} props
 * @param {Array<{id:string|number}>} [props.toasts] @param {(id:string|number) => void} props.removeToast
 */
export function ToastContainer({ toasts = [], removeToast }) {
  return (
    <div className="pointer-events-none fixed z-[100] space-y-3 top-[calc(var(--app-safe-top,0px)+0.75rem)] right-[max(var(--app-safe-right,0px),0.75rem)]">
      {toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

// Monotonic id counter (Date.now collided for toasts fired in the same ms).
let toastIdCounter = 0;

/**
 * State + helpers for a toast queue.
 * @returns {{toasts:Array, addToast:Function, removeToast:Function, success:Function, error:Function, warning:Function, info:Function}}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    toastIdCounter += 1;
    const id = toastIdCounter;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, description) => addToast({ type: 'success', message, description }), [addToast]);
  const error = useCallback((message, description) => addToast({ type: 'error', message, description }), [addToast]);
  const warning = useCallback((message, description) => addToast({ type: 'warning', message, description }), [addToast]);
  const info = useCallback((message, description) => addToast({ type: 'info', message, description }), [addToast]);

  return useMemo(() => ({ toasts, addToast, removeToast, success, error, warning, info }), [toasts, addToast, removeToast, success, error, warning, info]);
}
