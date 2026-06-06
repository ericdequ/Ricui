import assert from 'node:assert/strict';
import test from 'node:test';

import { cosineSimilarity, normalizeVector } from '../src/index.js';
import { bakedVector, isBaked, semanticEmojiVector } from '../src/baked.js';

// A tiny mock baked table (4-d) — stands in for a real model bake in tests.
const mock = {
  provider: 'mock',
  model: 'test',
  dimensions: 4,
  vectors: {
    '🍺': normalizeVector([1, 0.9, 0, 0]),
    '🍻': normalizeVector([0.9, 1, 0, 0]), // intentionally close to 🍺
    '⛳': normalizeVector([0, 0, 1, 0.2]), // far from drinks
  },
};

test('bakedVector tolerates emoji-presentation variation selectors (🍽️ → 🍽)', () => {
  const table = { dimensions: 2, vectors: { '🍽': [1, 0] } };
  assert.deepEqual(bakedVector('🍽️', table), [1, 0], 'FE0F stripped to base glyph');
  assert.deepEqual(bakedVector('🍽', table), [1, 0], 'base glyph still resolves');
  assert.equal(bakedVector('🦄', table), null, 'genuinely-absent glyph → null');
});

test('an empty table reports not-baked and falls back to the 32-d space', () => {
  const empty = { dimensions: 0, vectors: {} };
  assert.equal(isBaked(empty), false);
  const v = semanticEmojiVector('🍺', { table: empty });
  assert.equal(v.length, 32, 'empty table → deterministic 32-d fallback');
});

test('baked table is used: exact glyph returns its baked vector', () => {
  assert.equal(isBaked(mock), true);
  const v = semanticEmojiVector('🍺', { table: mock });
  assert.equal(v.length, 4);
  const expected = bakedVector('🍺', mock); // stored already-unit; re-norm is ~identity
  v.forEach((val, i) => assert.ok(Math.abs(val - expected[i]) < 1e-9, `dim ${i}`));
});

test('baked semantics: 🍺 closer to 🍻 than to ⛳', () => {
  const beer = semanticEmojiVector('🍺', { table: mock });
  const clink = semanticEmojiVector('🍻', { table: mock });
  const golf = semanticEmojiVector('⛳', { table: mock });
  assert.ok(
    cosineSimilarity(beer, clink) > cosineSimilarity(beer, golf),
    'drinks cluster, golf apart'
  );
});

test('composed string averages baked component vectors', () => {
  const composed = semanticEmojiVector('🍺⛳', { table: mock }); // not an exact key
  assert.equal(composed.length, 4, 'composed at baked dimensionality');
  // lies between the two component directions
  const beer = bakedVector('🍺', mock);
  const golf = bakedVector('⛳', mock);
  assert.ok(cosineSimilarity(composed, beer) > 0);
  assert.ok(cosineSimilarity(composed, golf) > 0);
});

test('miss in a baked table falls back at the baked dimensionality', () => {
  const v = semanticEmojiVector('🦄', { table: mock }); // not baked, single glyph
  assert.equal(v.length, 4, 'fallback matches baked dims so cosine length-aligns');
});
