// =============================================================================
// @ric/ui-core (contract) — node-safe design contract + class helpers
// =============================================================================
// Pure JS only. The React primitives live in ./react.jsx (subpath
// "@ric/ui-core/react") so this entry stays importable by node tooling
// (verify-imports, codegen) without a JSX transform.
// =============================================================================

import { resolveTone } from '@ric/ui-tokens';

export const components = {
  button: {
    variants: ['primary', 'secondary', 'ghost', 'danger'],
    states: ['default', 'hover', 'focus', 'disabled'],
  },
  input: {
    types: ['text', 'email', 'password', 'search'],
    states: ['default', 'focus', 'error', 'disabled'],
  },
  badge: {
    variants: ['neutral', 'success', 'warning', 'danger'],
  },
};

export const accessibilityBaseline = {
  contrastRatio: 'WCAG AA',
  focusIndicator: 'Visible 2px ring',
  iconLabeling: 'Decorative icons aria-hidden, semantic icons labeled',
};

/**
 * Tiny classnames joiner. Falsy entries drop out; everything else joins with
 * a space. Keeps component class composition readable without a clsx dep.
 * @param {...(string|false|null|undefined)} parts
 * @returns {string}
 */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

// Per-tone class recipe for translucent chips/badges on dark surfaces — the
// BEV "soft presence" look (border + tinted fill + light text). Standard
// Tailwind hues so it renders with or without the @ric/ui-tokens preset.
const TONE_CHIP = {
  slate: 'border-slate-400/30 bg-slate-500/15 text-slate-100',
  emerald: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
  amber: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  rose: 'border-rose-400/30 bg-rose-500/15 text-rose-100',
  fuchsia: 'border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-100',
  cyan: 'border-cyan-400/30 bg-cyan-500/15 text-cyan-100',
  sky: 'border-sky-400/30 bg-sky-500/15 text-sky-100',
  violet: 'border-violet-400/30 bg-violet-500/15 text-violet-100',
};

/**
 * Resolve a (tone|variant) pair to the canonical chip class string.
 * @param {{tone?: string, variant?: string}} [opts]
 * @returns {string}
 */
export function toneChipClass({ tone, variant } = {}) {
  return TONE_CHIP[resolveTone(tone, variant)] || TONE_CHIP.slate;
}
