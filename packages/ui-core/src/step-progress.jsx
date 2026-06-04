// =============================================================================
// @ric/ui-core/step-progress — generic step rail for multi-stage flows
// =============================================================================
// Upstreamed from BEV src/ui/StepProgressBar, de-BEV'd:
//   • uses the @ric Button (press via pressEffect, NOT framer whileHover/whileTap
//     props — those were dropped; the CSS press covers it).
//   • the done-step checkmark is owned here as a default inline glyph, so call
//     sites need no icon import; override with `checkIcon` if desired.
// Pure presentation: the host owns step list + current step + click target.
// Step shape: { id, num?, label, icon?, completed? }. Click-to-jump fires only
// on completed steps.
// =============================================================================

import { memo, useCallback } from 'react';

import { Button } from './button.jsx';
import { Check } from './glyphs.jsx';
import { cx } from './index.js';

const STEP_BASE = 'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all';
const STEP_CURRENT = 'border border-violet-300/30 bg-[linear-gradient(135deg,rgba(91,33,182,0.96),rgba(109,40,217,0.9),rgba(67,56,202,0.85))] text-white shadow-[0_10px_22px_rgba(76,29,149,0.34)]';
const STEP_DONE = 'cursor-pointer border border-violet-400/35 bg-[linear-gradient(135deg,rgba(76,29,149,0.32),rgba(67,56,202,0.24))] text-violet-100 hover:border-violet-300/45';
const STEP_TODO = 'border border-white/10 bg-white/5 text-white/40';
const ICON_WRAP = 'flex h-6 w-6 items-center justify-center rounded-lg';

const StepProgressItem = memo(function StepProgressItem({ step, isCurrent, isDone, isLast, onStepClick, checkIcon: CheckGlyph }) {
  const Icon = step.icon;
  const stepTarget = step.id || step.num;
  const handleClick = useCallback(() => {
    if (isDone) onStepClick?.(stepTarget);
  }, [isDone, onStepClick, stepTarget]);

  const stateClass = isCurrent ? STEP_CURRENT : isDone ? STEP_DONE : STEP_TODO;
  const CheckMark = CheckGlyph || Check;

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={!isDone}
        variant="custom"
        size="none"
        shape="soft"
        pressEffect="row"
        contentClassName="items-center gap-2"
        className={cx(STEP_BASE, stateClass)}
      >
        <div className={cx(ICON_WRAP, isCurrent ? 'bg-white/20' : isDone ? 'bg-violet-500/30' : 'bg-white/10')}>
          {isDone ? <CheckMark className="h-3 w-3" /> : Icon ? <Icon className="h-3 w-3" /> : null}
        </div>
        <span className="hidden sm:inline">{step.label}</span>
      </Button>
      {!isLast && <div className={cx('h-0.5 w-4 rounded-full lg:w-8', isDone ? 'bg-violet-500/70' : 'bg-white/10')} />}
    </>
  );
});

/**
 * Horizontal step rail. Completed steps are clickable (jump-back); incomplete
 * steps stay disabled.
 *
 * @param {object} props
 * @param {Array<{id?:string, num?:number, label:import('react').ReactNode, icon?:import('react').ElementType, completed?:boolean}>} props.steps
 * @param {string|number} [props.currentStep]
 * @param {(target:string|number) => void} [props.onStepClick]
 * @param {import('react').ElementType} [props.checkIcon] - Override the done-step glyph.
 * @param {string} [props.className]
 */
export function StepProgressBar({ steps, currentStep, onStepClick, checkIcon, className }) {
  return (
    <div className={cx('flex items-center justify-center gap-2', className)}>
      {steps.map((step, i) => {
        const isCurrent = step.id === currentStep || step.num === currentStep;
        const isDone = step.completed || (typeof step.num === 'number' && step.num < currentStep);
        return (
          <StepProgressItem
            key={step.id || step.num}
            step={step}
            isCurrent={isCurrent}
            isDone={isDone}
            isLast={i >= steps.length - 1}
            onStepClick={onStepClick}
            checkIcon={checkIcon}
          />
        );
      })}
    </div>
  );
}
