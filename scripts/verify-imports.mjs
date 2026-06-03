import {
  tokens, themes,
  iconography, getIcon, findIconsByTag,
  emojiCatalog, getEmoji, findEmoji,
  components, accessibilityBaseline
} from '@ric/ui';

// --- tokens ---
const hasTokenColor    = Boolean(tokens?.color?.primary);
const hasExtendedColor = Boolean(tokens?.color?.secondary && tokens?.color?.info);
const hasSpacing2xl    = tokens?.spacing?.['2xl'] === 32;
const hasShadow        = Boolean(tokens?.shadow?.focus);
const hasTypoSize      = Boolean(tokens?.typography?.size?.md);
const hasZIndex        = typeof tokens?.zIndex?.modal === 'number';

// --- themes ---
const hasDarkTheme     = Boolean(themes?.dark?.background);
const hasLightTheme    = Boolean(themes?.light?.background);
const hasBrandTheme    = Boolean(themes?.brand?.primary);

// --- icons ---
const hasIcons         = Object.keys(iconography ?? {}).length >= 10;
const hasGetIcon       = getIcon('success')?.glyph === '✅';
const hasFindIcons     = findIconsByTag('legal').includes('legal');

// --- emoji ---
const hasEmoji         = Object.keys(emojiCatalog ?? {}).length >= 10;
const hasGetEmoji      = getEmoji('success') === '✅';
const hasFindEmoji     = findEmoji('code').includes('code');

// --- components ---
const hasComponents    = Object.keys(components ?? {}).length >= 10;
const hasCardComp      = Boolean(components?.card);
const hasModalComp     = Boolean(components?.modal);
const hasToastComp     = Boolean(components?.toast);
const hasNavComp       = Boolean(components?.nav);
const hasA11y          = Boolean(accessibilityBaseline?.contrastRatio);
const hasMotionSafe    = Boolean(accessibilityBaseline?.motionSafe);

const checks = {
  hasTokenColor, hasExtendedColor, hasSpacing2xl, hasShadow, hasTypoSize, hasZIndex,
  hasDarkTheme, hasLightTheme, hasBrandTheme,
  hasIcons, hasGetIcon, hasFindIcons,
  hasEmoji, hasGetEmoji, hasFindEmoji,
  hasComponents, hasCardComp, hasModalComp, hasToastComp, hasNavComp,
  hasA11y, hasMotionSafe
};

const failures = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);

if (failures.length > 0) {
  throw new Error(`Unified package imports failed validation:\n  ${failures.join('\n  ')}`);
}

console.log(`Unified package imports validated (${Object.keys(checks).length} checks passed).`);
