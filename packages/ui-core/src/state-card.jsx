// =============================================================================
// @ric/ui-core/state-card — polished loading/empty/error state card
// =============================================================================
// Upstreamed from BEV src/ui/StateCard, de-BEV'd framer→CSS: the mount fade+
// scale and the icon wobble ship as .ric-fade-scale-in / .ric-wobble in
// @ric/ui-core/styles.css (reduced-motion safe). Primary/secondary actions
// render through the @ric Button. Icon arrives as a component.
// =============================================================================

import { memo } from 'react';

import { Button } from './button.jsx';
import { cx } from './index.js';

/**
 * @param {object} props
 * @param {import('react').ElementType} [props.icon]
 * @param {import('react').ReactNode} [props.title] @param {import('react').ReactNode} [props.description]
 * @param {string} [props.ctaLabel] @param {() => void} [props.onPrimaryClick]
 * @param {{label:string, onClick:() => void}} [props.secondaryAction]
 * @param {string} [props.accent] - Tailwind gradient classes for the icon badge.
 * @param {string} [props.className] @param {import('react').ReactNode} [props.children]
 */
export const StateCard = memo(function StateCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onPrimaryClick,
  secondaryAction,
  accent = 'from-purple-500 via-pink-500 to-orange-500',
  className = '',
  children,
}) {
  return (
    <div className={cx('ric-fade-scale-in flex min-h-[clamp(24rem,58vh,42rem)] items-center justify-center px-4 sm:px-6', className)}>
      <div className="relative max-w-sm text-center sm:max-w-md">
        <div className="mb-6">
          <div className={cx('ric-wobble mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br shadow-2xl sm:h-24 sm:w-24', accent)}>
            {Icon ? <Icon className="h-10 w-10 text-white drop-shadow sm:h-12 sm:w-12" /> : null}
          </div>
        </div>

        <h3 className="mb-3 text-[1.7rem] font-bold text-white drop-shadow-lg sm:text-2xl">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-white/90 drop-shadow sm:text-base">{description}</p>
        {children}

        {ctaLabel && onPrimaryClick ? (
          <Button onClick={onPrimaryClick} variant="light" size="lg" shape="soft" className="px-5 py-3 sm:px-6">
            {ctaLabel}
          </Button>
        ) : null}

        {secondaryAction ? (
          <Button onClick={secondaryAction.onClick} variant="custom" size="none" shape="none" pressEffect="row" showHighlight={false} className="mt-3 text-sm font-medium text-white/80 underline">
            {secondaryAction.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
});
