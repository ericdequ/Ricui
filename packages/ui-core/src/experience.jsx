// =============================================================================
// @ric/ui-core/experience — full-screen ambient backdrop + section panel
// =============================================================================
// Upstreamed from BEV src/ui/ExperiencePrimitives. ExperienceCanvas is a
// gradient backdrop with three ambient blur orbs (the orb keyframes ship in
// @ric/ui-core/styles.css). ExperienceSectionPanel is a thin GlassPanel preset.
// =============================================================================

import { GlassPanel } from './glass-panel.jsx';
import { cx } from './index.js';

/**
 * Full-screen gradient backdrop with three ambient blur orbs.
 * `variant`/`accents` are accepted but ignored (kept for call-site compat).
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 */
export function ExperienceCanvas({ children, className = '' }) {
  return (
    <div className={cx('relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#020617_0%,#0f172a_40%,#111827_100%)] text-white', className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="experience-canvas-orb experience-canvas-orb-1" />
        <div className="experience-canvas-orb experience-canvas-orb-2" />
        <div className="experience-canvas-orb experience-canvas-orb-3" />
      </div>
      <div className="relative flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}

/**
 * Thin GlassPanel wrapper preset to the experience tone scale.
 * @param {object} props
 * @param {string} [props.tone]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export function ExperienceSectionPanel({ tone = 'slate', className = '', children, ...props }) {
  return (
    <GlassPanel tone={tone} className={className} {...props}>
      {children}
    </GlassPanel>
  );
}
