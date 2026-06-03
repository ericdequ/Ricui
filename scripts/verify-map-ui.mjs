import {
  buildMapUiFeatureProps,
  buildMapUiLegend,
  buildMapUiPanelModel,
  listMapUiVariants,
  mapUiFamilies,
  resolveMapUiGlyphPath,
  summarizeMapUiCoverage,
  validateMapUiRegistry,
} from '../packages/ui/src/index.js';

const requiredFamilies = [
  'bev-nightlife',
  'spot-core',
  'hathlo-soundscape',
  'sports-pickup',
  'energia-camino',
  'ecology-dex',
  'contech-construction',
  'sesh-senate',
  'world-rendering',
];

const fail = (message) => {
  throw new Error(`Map UI verification failed: ${message}`);
};

const registry = validateMapUiRegistry();
if (!registry.valid) fail(registry.problems.join('; '));

for (const familyId of requiredFamilies) {
  const family = mapUiFamilies.find((item) => item.id === familyId);
  if (!family) fail(`missing family ${familyId}`);
  const variants = listMapUiVariants(familyId);
  if (!variants.length) fail(`family ${familyId} has no variants`);
  const legend = buildMapUiLegend(familyId);
  if (legend.length < variants.length) fail(`family ${familyId} has no legend`);
}

const baseball = resolveMapUiGlyphPath('baseball');
if (baseball.main.id !== 'sports' || baseball.glyph.id !== 'sport-baseball') {
  fail('baseball must resolve as a sports subtype');
}

const sportsMain = resolveMapUiGlyphPath('sports');
if (sportsMain.main.id !== 'sports' || sportsMain.glyph.id !== 'sports') {
  fail('sports must resolve to the main sports glyph');
}

const energia = buildMapUiFeatureProps({
  familyId: 'energia-camino',
  variantId: 'albergue',
});
if (energia.mainGlyphId !== 'energia' || energia.glyphId !== 'albergue') {
  fail('albergue must resolve under Energia');
}

const contechPanel = buildMapUiPanelModel({
  familyId: 'contech-construction',
  activeVariantId: 'lidar',
  actions: ['toggleLayer'],
});
if (contechPanel.activeVariant?.variantId !== 'lidar') {
  fail('ConTech panel must activate LiDAR variant');
}

const coverage = summarizeMapUiCoverage();
if (coverage.familyCount !== requiredFamilies.length) {
  fail(`expected ${requiredFamilies.length} families, found ${coverage.familyCount}`);
}

console.log('Map UI library verified.');
