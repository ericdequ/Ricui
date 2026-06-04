// =============================================================================
// @ric/ui-core/a11y — focus-trap / focus-return / keyboard-nav hooks
// =============================================================================
// Upstreamed from BEV src/hooks/ui/useAccessibility. Generic overlay a11y
// plumbing used by Modal: trap Tab focus inside a panel, restore focus to the
// trigger on close, and wire Enter/Escape. Node-safe (guards window/document).
// =============================================================================

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const getFocusableElements = (element) =>
  Array.from(element?.querySelectorAll?.(FOCUSABLE_SELECTOR) || []).filter(
    (node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true',
  );

/** Wire Enter/Escape handlers to an element ref. */
export const useKeyboardNav = (ref, onEnter, onEscape) => {
  useEffect(() => {
    const element = ref?.current;
    if (!element || (!onEnter && !onEscape)) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && onEnter) {
        e.preventDefault();
        onEnter();
      }
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };
    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, onEnter, onEscape]);
};

/** Trap Tab focus within `ref` while `isActive`; focus the first element on mount. */
export const useFocusTrap = (ref, isActive = true) => {
  useEffect(() => {
    if (!isActive || !ref?.current || !isBrowser()) return undefined;
    const element = ref.current;

    const focusInitialElement = () => {
      const focusable = getFocusableElements(element);
      if (!focusable.length) {
        if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
        element.focus();
        return;
      }
      if (!element.contains(document.activeElement)) focusable[0].focus();
    };

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements(element);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last?.focus();
          e.preventDefault();
        }
      } else if (document.activeElement === last) {
        first?.focus();
        e.preventDefault();
      }
    };

    element.addEventListener('keydown', handleTabKey);
    window.requestAnimationFrame(focusInitialElement);
    return () => element.removeEventListener('keydown', handleTabKey);
  }, [ref, isActive]);
};

/** Restore focus to the previously-focused element when `isOpen` goes false. */
export const useFocusReturn = (isOpen) => {
  const previousFocus = useRef(null);
  useEffect(() => {
    if (!isBrowser()) return;
    if (isOpen) {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (previousFocus.current?.isConnected) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [isOpen]);
};
