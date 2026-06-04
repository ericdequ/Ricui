// =============================================================================
// @ric/ui-core/modal — unified portal modal (center / bottom sheet / top / full)
// =============================================================================
// Upstreamed from BEV src/ui/Modal, de-BEV'd framer→CSS:
//   • entrance/exit: framer AnimatePresence + spring variants → a mount→enter→
//     exit→unmount state machine with CSS transitions (settle bezier; reduced-
//     motion falls back to opacity via motion-reduce).
//   • drag-to-dismiss (bottom sheets): framer drag → pointer events on the
//     handle/header zone; past 120px or fast flick commits the dismiss.
//   • haptics: Capacitor import → optional `hapticsImpl` ({open,dismiss}) prop,
//     so @ric stays platform-free (BEV injects its haptics).
//   • a11y via @ric/ui-core/a11y hooks; close button is the @ric IconButton.
// Same prop/slot vocabulary as BEV (position/entrance/backdrop/size/title/header/
// footer/dragToDismiss/…) so call sites are unchanged.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useFocusReturn, useFocusTrap, useKeyboardNav } from './a11y.js';
import { Button } from './button.jsx';
import { cx } from './index.js';
import { IconButton } from './icon-button.jsx';

const BACKDROP_STYLE = {
  blur: 'bg-slate-950/80 backdrop-blur-md',
  dim: 'bg-slate-950/92',
  none: 'pointer-events-none bg-transparent',
};

const POSITION_LAYOUT = {
  center: 'items-center justify-center p-4 sm:p-5',
  bottom: 'items-end justify-center sm:items-center sm:p-5',
  top: 'items-start justify-center pt-[max(var(--app-safe-top),1rem)] px-4',
  fullscreen: 'items-stretch justify-stretch',
};

const POSITION_PANEL = {
  center: 'rounded-[30px] border border-white/12 shadow-[0_36px_120px_rgba(2,6,23,0.38)]',
  bottom: 'rounded-t-[28px] border border-b-0 border-white/12 shadow-[0_-24px_80px_rgba(2,6,23,0.55)] sm:rounded-[30px] sm:border-b sm:shadow-[0_36px_120px_rgba(2,6,23,0.38)]',
  top: 'rounded-[24px] border border-white/12 shadow-[0_24px_80px_rgba(2,6,23,0.38)]',
  fullscreen: 'rounded-none border-0 shadow-none',
};

const POSITION_MAX_H = {
  center: 'max-h-[calc(var(--viewport-height)-max(var(--app-safe-top),0.75rem)-max(var(--app-safe-bottom),1rem)-1rem)]',
  bottom: 'max-h-[calc(var(--viewport-height)-max(var(--app-safe-top),0.75rem)-max(var(--app-safe-bottom),0.5rem)-1rem)]',
  top: 'max-h-[calc(var(--viewport-height)-max(var(--app-safe-top),1rem)-max(var(--app-safe-bottom),1rem)-2rem)]',
  fullscreen: 'h-[100dvh] max-h-[100dvh]',
};

const POSITION_PANEL_SELF = {
  center: 'self-center',
  bottom: 'self-end sm:self-center',
  top: 'self-start',
  fullscreen: 'self-stretch',
};

const SIZE_MAX_WIDTH = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
  '3xl': 'max-w-7xl',
  full: 'max-w-full mx-4',
};

// Entrance: [hidden, shown] transform/opacity class pairs (CSS replaces the
// framer spring variants). The transition + settle bezier are on the panel base.
const ENTRANCE = {
  scale: ['translate-y-5 scale-95 opacity-0', 'translate-y-0 scale-100 opacity-100'],
  'slide-up': ['translate-y-full opacity-0', 'translate-y-0 opacity-100'],
  'slide-down': ['-translate-y-full opacity-0', 'translate-y-0 opacity-100'],
  fade: ['opacity-0', 'opacity-100'],
};

const POSITION_DEFAULT_ENTRANCE = { center: 'scale', bottom: 'slide-up', top: 'slide-down', fullscreen: 'fade' };
const POSITION_DEFAULT_HAPTICS = { center: false, bottom: true, top: false, fullscreen: false };

const DRAG_DISMISS_OFFSET_PX = 120;
const DRAG_DISMISS_VELOCITY = 600; // px/s
const EXIT_MS = 300;

const stopPropagation = (e) => e.stopPropagation();

/**
 * Unified portal modal. See the file header for the framer→CSS notes.
 * @param {object} props (BEV-compatible: isOpen/onClose/position/entrance/backdrop/
 *   size/title/header/children/footer/showCloseButton/closeOnBackdrop/closeOnEscape/
 *   dragToDismiss/haptics/bodyScrollLock/contentGrow/className/contentClassName/
 *   backdropClassName/panelHeightClass/baseZIndex). Extra: `hapticsImpl` ({open,dismiss}).
 */
export function Modal({
  isOpen,
  onClose,
  position = 'center',
  entrance,
  backdrop = 'blur',
  size = 'md',
  title,
  header,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  dragToDismiss,
  haptics: hapticsEnabledProp,
  hapticsImpl,
  bodyScrollLock = true,
  contentGrow = true,
  className = '',
  contentClassName = '',
  backdropClassName = '',
  panelHeightClass = '',
  baseZIndex,
  ...props
}) {
  const panelRef = useRef(null);
  // Mount/enter/exit state machine (replaces AnimatePresence).
  const [mounted, setMounted] = useState(isOpen);
  const [entered, setEntered] = useState(false);

  useFocusTrap(panelRef, mounted);
  useFocusReturn(isOpen);
  useKeyboardNav(panelRef, null, closeOnEscape ? onClose : null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const id = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!mounted || !bodyScrollLock) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted, bodyScrollLock]);

  const hapticsEnabled = hapticsEnabledProp ?? POSITION_DEFAULT_HAPTICS[position];
  useEffect(() => {
    if (isOpen && hapticsEnabled) hapticsImpl?.open?.();
  }, [isOpen, hapticsEnabled, hapticsImpl]);

  // Honor reduced motion at the CSS layer (motion-reduce on the panel), but the
  // drag is also disabled for reduced-motion users.
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const dragEnabled = (dragToDismiss ?? position === 'bottom') && !prefersReduced;

  // Pointer drag-to-dismiss from the handle/header zone (avoids scroll conflict).
  const drag = useRef({ active: false, startY: 0, lastY: 0, lastT: 0, v: 0 });
  const onPointerDown = useCallback(
    (e) => {
      if (!dragEnabled || !panelRef.current) return;
      drag.current = { active: true, startY: e.clientY, lastY: e.clientY, lastT: e.timeStamp, v: 0 };
      panelRef.current.style.transition = 'none';
      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    [dragEnabled],
  );
  const onPointerMove = useCallback((e) => {
    const d = drag.current;
    if (!d.active || !panelRef.current) return;
    const dy = Math.max(0, e.clientY - d.startY);
    panelRef.current.style.transform = `translateY(${dy}px)`;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = ((e.clientY - d.lastY) / dt) * 1000;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
  }, []);
  const onPointerUp = useCallback(
    (e) => {
      const d = drag.current;
      if (!d.active || !panelRef.current) return;
      d.active = false;
      const dy = Math.max(0, e.clientY - d.startY);
      panelRef.current.style.transition = '';
      if (dy > DRAG_DISMISS_OFFSET_PX || d.v > DRAG_DISMISS_VELOCITY) {
        if (hapticsEnabled) hapticsImpl?.dismiss?.();
        onClose?.();
      } else {
        panelRef.current.style.transform = '';
      }
    },
    [hapticsEnabled, hapticsImpl, onClose],
  );

  if (!mounted || typeof window === 'undefined' || typeof document === 'undefined') return null;

  const labelledById = title ? 'ric-modal-title' : undefined;
  const heightClass = panelHeightClass || `!h-auto ${POSITION_MAX_H[position] || POSITION_MAX_H.center}`;
  const sizeClass = position === 'fullscreen' ? 'w-full' : `w-full ${SIZE_MAX_WIDTH[size] || SIZE_MAX_WIDTH.md}`;
  const safePadClass = position === 'fullscreen' ? '' : 'safe-top-pad safe-bottom-pad';
  const backdropInteractive = backdrop !== 'none' && closeOnBackdrop;
  const [hiddenCls, shownCls] = ENTRANCE[entrance || POSITION_DEFAULT_ENTRANCE[position] || 'scale'] || ENTRANCE.scale;
  const showHandle = dragEnabled && position === 'bottom';
  const hasChrome = header || title || showCloseButton;

  const dragZoneHandlers = dragEnabled ? { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } : null;

  return createPortal(
    <>
      <div
        onClick={backdropInteractive ? onClose : undefined}
        className={cx('fixed inset-0 transition-opacity duration-300 motion-reduce:duration-150', BACKDROP_STYLE[backdrop] || BACKDROP_STYLE.blur, entered ? 'opacity-100' : 'opacity-0', backdropClassName)}
        style={{ zIndex: baseZIndex ?? 40 }}
        aria-hidden="true"
      />
      <div
        className={cx(safePadClass, 'pointer-events-none fixed inset-0 flex', POSITION_LAYOUT[position] || POSITION_LAYOUT.center)}
        style={{ zIndex: baseZIndex != null ? baseZIndex + 10 : 50 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
      >
        <div
          ref={panelRef}
          onClick={stopPropagation}
          className={cx(
            'app-panel-shell pointer-events-auto flex transform-gpu flex-col overflow-hidden text-white',
            'transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-opacity motion-reduce:duration-150',
            entered ? shownCls : hiddenCls,
            heightClass,
            POSITION_PANEL_SELF[position] || POSITION_PANEL_SELF.center,
            sizeClass,
            POSITION_PANEL[position] || POSITION_PANEL.center,
            className,
          )}
          {...props}
        >
          {/* Drag zone: handle + header own the dismiss-drag pointer handlers. */}
          <div {...dragZoneHandlers} className={cx(dragEnabled && 'touch-none', showHandle && 'cursor-grab active:cursor-grabbing')}>
            {showHandle ? (
              <div className="flex shrink-0 justify-center pb-1 pt-2 sm:hidden" aria-hidden="true">
                <div className="h-1.5 w-10 rounded-full bg-white/25" />
              </div>
            ) : null}
            {hasChrome ? (
              <div className="relative shrink-0 border-b border-white/10 bg-white/[0.045] px-6 py-4 sm:px-7 sm:py-5">
                {header || (title && <h2 id={labelledById} className="font-display-title pr-10 text-[1.4rem] font-black tracking-[-0.035em] text-white">{title}</h2>)}
                {showCloseButton ? (
                  <IconButton
                    icon={CloseGlyph}
                    onClick={onClose}
                    ariaLabel="Close"
                    size="md"
                    className="absolute right-4 top-3 border-white/10 bg-white/[0.08] text-white/70 hover:bg-white/[0.14] hover:text-white focus-visible:ring-sky-300"
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          <div className={cx('custom-scrollbar text-copy-soft min-h-0 overflow-y-auto overscroll-contain px-6 py-5 text-[15px] [-webkit-overflow-scrolling:touch] sm:px-7', contentGrow ? 'flex-1' : 'shrink-0', contentClassName)}>
            {children}
          </div>

          {footer ? (
            <div className={cx('shrink-0 border-t border-white/10 bg-white/[0.045] px-6 sm:px-7', position === 'bottom' ? 'pb-[max(var(--app-safe-bottom),1rem)] pt-4' : 'py-4')}>{footer}</div>
          ) : position === 'bottom' ? (
            <div aria-hidden="true" className="h-[var(--app-safe-bottom,0px)] shrink-0" />
          ) : null}
        </div>
      </div>
    </>,
    document.body,
  );
}

/** Default close glyph (X) — inline so the close button needs no icon import. */
function CloseGlyph({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M6 6l8 8M14 6l-8 8" />
    </svg>
  );
}

/**
 * Quick confirmation dialog — a small centered Modal with a Cancel/Confirm footer.
 * @param {object} props
 */
export function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', loading = false }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      contentGrow={false}
      footer={
        <div className="flex gap-3">
          <Button onClick={onClose} disabled={loading} variant="soft" size="md" shape="soft" className="flex-1 font-medium tracking-[-0.015em]">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} disabled={loading} loading={loading} loadingLabel="Processing..." variant={variant} size="md" shape="soft" className="flex-1">
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="leading-relaxed text-white/80">{message}</p>
    </Modal>
  );
}

/**
 * iOS-style bottom sheet — a thin preset over <Modal position="bottom">.
 * Translates the legacy `disableDrag` flag into `dragToDismiss`.
 * @param {object} props
 */
export function BottomSheet({ disableDrag = false, ...rest }) {
  return <Modal position="bottom" dragToDismiss={!disableDrag} {...rest} />;
}
