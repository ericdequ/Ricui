import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAP_UI_LIBRARY_VERSION,
  listMapUiVariants,
  mapUiFamilies,
  mapUiGlyphs,
  resolveMapUiGlyph,
} from '../src/index.js';

test('@ric/map-ui exposes a versioned glyph library', () => {
  assert.equal(typeof MAP_UI_LIBRARY_VERSION, 'string');
  assert.ok(MAP_UI_LIBRARY_VERSION.length > 0);
  assert.ok(Object.keys(mapUiGlyphs).length > 0, 'non-empty glyph map');
  assert.equal(typeof resolveMapUiGlyph, 'function');
});

test('@ric/map-ui families resolve to their variants', () => {
  assert.ok(Array.isArray(mapUiFamilies) && mapUiFamilies.length > 0);
  const variants = listMapUiVariants(mapUiFamilies[0].id);
  assert.ok(Array.isArray(variants) && variants.length > 0, 'family has variants');
});
