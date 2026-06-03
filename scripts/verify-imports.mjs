import {
  tokens,
  iconography,
  emojiCatalog,
  getEmoji,
  buildMapUiFeatureProps,
  buildMapUiPanelModel,
  mapUiFamilies,
  resolveMapUiGlyphPath,
  summarizeMapUiCoverage,
  validateMapUiRegistry,
} from '../packages/ui/src/index.js';

const hasTokenColor = Boolean(tokens?.color?.primary);
const hasIcons = Object.keys(iconography ?? {}).length > 0;
const hasEmoji = Object.keys(emojiCatalog ?? {}).length > 0;
const hasExpectedSemantic = getEmoji('success') === '\u2705';
const mapRegistry = validateMapUiRegistry();
const mapCoverage = summarizeMapUiCoverage();
const baseballGlyphPath = resolveMapUiGlyphPath('baseball');
const sportsPanel = buildMapUiPanelModel({
  familyId: 'sports-pickup',
  activeVariantId: 'baseball',
});
const featureProps = buildMapUiFeatureProps({
  familyId: 'sports-pickup',
  variantId: 'baseball',
  key: 'field@djn4k5e#baseball',
});

if (
  !hasTokenColor ||
  !hasIcons ||
  !hasEmoji ||
  !hasExpectedSemantic ||
  !mapRegistry.valid ||
  mapCoverage.familyCount < 9 ||
  mapUiFamilies.length < 9 ||
  baseballGlyphPath.main.id !== 'sports' ||
  baseballGlyphPath.glyph.id !== 'sport-baseball' ||
  sportsPanel.activeVariant?.variantId !== 'baseball' ||
  featureProps.mainGlyphId !== 'sports'
) {
  throw new Error('Unified package imports failed validation.');
}

console.log('Unified package imports validated.');
