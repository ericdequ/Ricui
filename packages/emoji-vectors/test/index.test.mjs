import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildEmojiComparisons,
  buildEmojiEmbeddingText,
  buildEmojiVectorItems,
  codepointsForGlyph,
  cosineSimilarity,
  describeEmojiGlyph,
  emojiSimilarity,
  emojiVector,
  parseEmojiInput,
  projectVectors2d,
} from '../src/index.js';

test('codepointsForGlyph: 🍺 → U+1F37A, 🍻 → U+1F37B', () => {
  assert.deepEqual(codepointsForGlyph('🍺'), ['U+1F37A']);
  assert.deepEqual(codepointsForGlyph('🍻'), ['U+1F37B']);
});

test('parseEmojiInput: splits + de-dupes graphemes and tokens', () => {
  assert.deepEqual(parseEmojiInput('🍺🍻🍺'), ['🍺', '🍻']);
  assert.deepEqual(parseEmojiInput('🍺, 🍻, ⛳'), ['🍺', '🍻', '⛳']);
});

test('buildEmojiEmbeddingText: distinctive (name + group), no shared boilerplate', () => {
  const beer = buildEmojiEmbeddingText('🍺'); // curated
  assert.match(beer, /beer/);
  assert.match(beer, /category: Food & Drink/);
  assert.match(beer, /used for bar/);
  const pizza = buildEmojiEmbeddingText('🍕'); // named, not curated
  assert.match(pizza, /pizza/);
  assert.match(pizza, /category: Food & Drink/);
  // The old boilerplate that inflated baseline cosine is gone.
  for (const text of [beer, pizza]) {
    assert.doesNotMatch(text, /Codepoints|compact human and machine|Time Space Type/);
  }
});

test('describeEmojiGlyph: curated meaning + compositional string', () => {
  assert.equal(describeEmojiGlyph('🍺').type, 'bar');
  const composed = describeEmojiGlyph('📍🍻');
  assert.equal(composed.components.length, 2);
  assert.equal(composed.knownComponentCount, 2);
  assert.match(composed.emotion, /emoji string/);
});

test('emojiVector: unit length, deterministic, composes a string', () => {
  const v = emojiVector('🍺');
  assert.equal(v.length, 32);
  const norm = Math.sqrt(v.reduce((s, c) => s + c * c, 0));
  assert.ok(Math.abs(norm - 1) < 1e-9, 'unit length');
  assert.deepEqual(emojiVector('🍺'), emojiVector('🍺'), 'deterministic');
  assert.equal(emojiVector('📍🍺').length, 32, 'composed string still 32-dim');
});

test('cosineSimilarity / emojiSimilarity: identity high, mapped to [0,1]', () => {
  assert.ok(cosineSimilarity(emojiVector('🍺'), emojiVector('🍺')) > 0.999);
  const s = emojiSimilarity('🍺', '⛳');
  assert.ok(s >= 0 && s <= 1, `in range: ${s}`);
  assert.ok(Math.abs(emojiSimilarity('🍺', '🍺') - 1) < 1e-9, 'self = 1');
});

test('projectVectors2d: every item gets a unit-bounded 2-D direction', () => {
  const items = buildEmojiVectorItems({ emojis: ['🍺', '🍻', '⛳', '🔥'] });
  assert.equal(items.length, 4);
  for (const item of items) {
    assert.ok(Math.abs(item.direction.x) <= 1.0001, 'x bounded');
    assert.ok(Math.abs(item.direction.y) <= 1.0001, 'y bounded');
  }
  // re-project directly to confirm the helper is pure
  const reprojected = projectVectors2d(items);
  assert.equal(reprojected.length, 4);
});

test('buildEmojiComparisons: N*(N-1)/2 unique pairs', () => {
  const items = buildEmojiVectorItems({ emojis: ['🍺', '🍻', '⛳'] });
  assert.equal(buildEmojiComparisons(items).length, 3);
});
