// =============================================================================
// @ric/ui-tokens — the single source of design truth for all RIC projects
// =============================================================================
// Framework-neutral token objects + a Tailwind preset. Lifted from BEV's
// drift-audited token layer (`src/ui/icons/tokens.js`, the canonical role
// palette, and `styles/system/motion.js`). Every other @ric/* package and
// every consuming app reads sizing / tone / motion from here so nothing
// drifts ("xs is h-3.5 here but h-3 over there").
//
// Pure JS — node-importable, no React, no Tailwind runtime. The Tailwind
// PRESET (see ./tailwind-preset.js) is what teaches an app's tailwind.config
// the role palette + radii + gradients; components themselves emit standard
// Tailwind hue classes (emerald/rose/amber/…) so they also render in a
// vanilla-Tailwind app that hasn't adopted the preset.
// =============================================================================

// --- Icon sizing -----------------------------------------------------------
// Three scales, shared keys. Each primitive's icon proportion is tuned to its
// chrome (filled button vs. glyph-only button vs. pill body) but speaks the
// same xs/sm/md/lg vocabulary.
export const ICON_SIZE = Object.freeze({
  button: Object.freeze({
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-[22px] w-[22px]',
    xl: 'h-6 w-6',
  }),
  iconButtonGlyph: Object.freeze({
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }),
  iconButtonFrame: Object.freeze({
    xs: 'h-7 w-7',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }),
  pill: Object.freeze({
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  }),
});

// --- Tones -----------------------------------------------------------------
// Canonical tone keys (the palette census winners). Components build their
// class strings from these so a "success" pill is emerald everywhere.
export const TONES = Object.freeze([
  'slate',
  'emerald',
  'amber',
  'rose',
  'fuchsia',
  'cyan',
  'sky',
  'violet',
]);

// Semantic variant → tone alias. Lets a caller write variant="success" and
// have every primitive resolve it to emerald identically.
export const TONE_ALIAS = Object.freeze({
  default: 'slate',
  primary: 'fuchsia',
  success: 'emerald',
  warning: 'amber',
  danger: 'rose',
  info: 'cyan',
});

/**
 * Resolve a (tone, variant) pair to a canonical tone key.
 * Honors explicit `tone`, then the semantic `variant` alias, then 'slate'.
 * @param {string} [tone]
 * @param {string} [variant]
 * @returns {string}
 */
export function resolveTone(tone, variant) {
  if (tone && TONES.includes(tone)) return tone;
  if (variant && TONE_ALIAS[variant]) return TONE_ALIAS[variant];
  return 'slate';
}

// --- Role palette ----------------------------------------------------------
// BEV's semantic roles. An app re-skins a role with a one-line edit here.
// Exposed to Tailwind via the preset as `role-{name}-{shade}`.
export const ROLE_PALETTE = Object.freeze({
  default: { DEFAULT: '#a855f7', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea' }, // purple — primary chrome
  like: { DEFAULT: '#ef4444', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626' }, // red — favorites
  visited: { DEFAULT: '#f97316', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c' }, // orange — been there
  friends: { DEFAULT: '#10b981', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669' }, // emerald — social graph
  meetup: { DEFAULT: '#3b82f6', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' }, // blue — group plans
});

export const GRADIENTS = Object.freeze({
  'action-primary': 'linear-gradient(135deg,#6366f1 0%,#7c3aed 50%,#9333ea 100%)',
  'action-restart': 'linear-gradient(90deg,#c026d3 0%,#f43f5e 55%,#f97316 100%)',
  'card-primary': 'linear-gradient(135deg,#4f46e5 0%,#2563eb 100%)',
  'card-accent': 'linear-gradient(135deg,#7c3aed 0%,#2563eb 100%)',
});

export const RADIUS = Object.freeze({ xl: '1rem', '2xl': '1.25rem', '3xl': '1.5rem' });

// --- Motion ----------------------------------------------------------------
// CSS-first motion vocabulary (Ricui has no framer-motion dep). Durations in
// ms, easings as cubic-bezier strings; consumers spread into `transition`
// classes or inline style. Mirrors BEV's harmonized motion tokens.
export const MOTION = Object.freeze({
  duration: Object.freeze({ fast: 200, base: 280, slow: 400 }),
  ease: Object.freeze({
    standard: 'cubic-bezier(0.4,0,0.2,1)',
    settle: 'cubic-bezier(0.16,1,0.3,1)',
    pop: 'cubic-bezier(0.34,1.4,0.64,1)',
  }),
  // Tailwind class recipes for the canonical press / lift micro-interactions.
  // Applied as className so they respect motion-reduce automatically.
  tap: 'transition-transform duration-200 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100',
  lift: 'transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.96] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
});

// --- Backward-compatible flat token map ------------------------------------
// Kept so the original `tokens.color.primary` contract (and verify-imports)
// keeps resolving. New code should prefer the named exports above.
export const tokens = Object.freeze({
  color: Object.freeze({
    background: '#0F172A',
    surface: '#111827',
    text: '#E5E7EB',
    primary: ROLE_PALETTE.default[500],
    success: ROLE_PALETTE.friends[500],
    warning: '#F59E0B',
    danger: ROLE_PALETTE.like[500],
  }),
  radius: { sm: 4, md: 8, lg: 12, pill: 9999, ...RADIUS },
  motion: { quick: '200ms', normal: '280ms', slow: '400ms' },
});
