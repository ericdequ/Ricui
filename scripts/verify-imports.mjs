// Node-safe smoke test: every @ric/* contract resolves through the @ric/ui
// barrel without a JSX transform. Component rendering is validated by the
// consuming app's build; here we only assert the pure-JS surface is wired.

import {
  // map-ui
  buildMapUiFeatureProps,
  buildMapUiPanelModel,
  // chat
  CHAT_SCOPE,
  emojiCatalog,
  formatDistance,
  getChatScope,
  getEmoji,
  getPlaceKind,
  describeIcon,
  describeUnicodeIcon,
  ICON_SIZE,
  iconMetadata,
  iconography,
  iconSimilarity,
  iconVector,
  listPlaceKinds,
  mapUiFamilies,
  MEETUP_STATE,
  resolveMapUiGlyphPath,
  resolveMeetupState,
  // places
  resolvePlaceState,
  resolveTone,
  ROLE_PALETTE,
  // meetups
  RSVP,
  summarizeMapUiCoverage,
  tokens,
  validateMapUiRegistry,
} from '@ric/ui';

const mapRegistry = validateMapUiRegistry();
const mapCoverage = summarizeMapUiCoverage();
const baseballGlyphPath = resolveMapUiGlyphPath('baseball');
const sportsPanel = buildMapUiPanelModel({ familyId: 'sports-pickup', activeVariantId: 'baseball' });
const featureProps = buildMapUiFeatureProps({
  familyId: 'sports-pickup',
  variantId: 'baseball',
  key: 'field@djn4k5e#baseball',
});

const checks = {
  'tokens.color.primary': Boolean(tokens?.color?.primary),
  'resolveTone alias': resolveTone(undefined, 'success') === 'emerald',
  'icon size scale': Boolean(ICON_SIZE?.pill?.md),
  'role palette': Boolean(ROLE_PALETTE?.meetup?.[500]),
  iconography: Object.keys(iconography ?? {}).length > 0,
  'icon unicode metadata': describeIcon('nightlife')?.unicode?.codepoints?.length > 0,
  'icon vector metadata': iconMetadata?.nightlife?.vector?.preview?.length === 12,
  'icon vector helper': iconVector('nightlife')?.length > 0,
  'icon similarity helper': iconSimilarity('nightlife', 'nightlife') === 1,
  'unicode icon fallback': describeUnicodeIcon('🧭')?.unicode?.codepoints?.[0] === 'U+1F9ED',
  emoji: Object.keys(emojiCatalog ?? {}).length > 0,
  'emoji semantic': getEmoji('success') === '✅',
  'place state': resolvePlaceState({ isOpen: true }) === 'open',
  'distance fmt': formatDistance(1500) === '1.5 km',
  'place kinds seeded': listPlaceKinds().length >= 5 && Boolean(getPlaceKind('park')),
  'meetup rsvp': RSVP.YES === 'yes',
  'meetup state derive': resolveMeetupState({ rsvp: 'yes' }) === MEETUP_STATE.GOING,
  'chat scope': Boolean(getChatScope(CHAT_SCOPE.MEETUP)),
  // map-ui
  'map registry valid': mapRegistry.valid === true,
  'map family coverage': mapCoverage.familyCount >= 9 && mapUiFamilies.length >= 9,
  'map glyph path': baseballGlyphPath.main.id === 'sports' && baseballGlyphPath.glyph.id === 'sport-baseball',
  'map panel model': sportsPanel.activeVariant?.variantId === 'baseball',
  'map feature props': featureProps.mainGlyphId === 'sports',
};

const failed = Object.entries(checks)
  .filter(([, ok]) => !ok)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`Unified package imports failed validation: ${failed.join(', ')}`);
}

console.log(`Unified package imports validated (${Object.keys(checks).length} checks).`);
