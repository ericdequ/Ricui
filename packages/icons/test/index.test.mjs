import assert from 'node:assert/strict';
import test from 'node:test';

import { BAKED, isBaked } from '@ric/emoji-vectors/baked';

import {
  describeIcon,
  describeUnicodeIcon,
  iconMetadata,
  iconSimilarity,
  iconVector,
  iconVectorItems,
  listIcons,
} from '../src/index.js';

test('icon metadata includes Unicode description and baked-aware vector preview', () => {
  const nightlife = describeIcon('nightlife');

  assert.equal(nightlife.glyph, '🍸');
  assert.deepEqual(nightlife.unicode.codepoints, ['U+1F378']);
  assert.equal(
    nightlife.vector.provider,
    isBaked() ? BAKED.provider : 'deterministic-fallback'
  );
  assert.equal(nightlife.vector.baked, isBaked());
  assert.equal(nightlife.vector.preview.length, 12);
  assert.match(nightlife.vector.embeddingText, /Emoji 🍸/);
});

test('icon vectors are deterministic and identity similarity is 1', () => {
  assert.deepEqual(iconVector('robot'), iconVector('robot'));
  assert.equal(iconVector('robot').length, isBaked() ? BAKED.dimensions : 32);
  assert.equal(iconSimilarity('robot', 'robot'), 1);
  assert.equal(iconSimilarity('robot', 'does-not-exist'), 0);
});

test('icon vector items are plottable and keyed', () => {
  const items = iconVectorItems();

  assert.equal(items.length, listIcons().length);
  assert.ok(items.every((item) => item.key && item.direction));
});

test('describeUnicodeIcon supports arbitrary full-Unicode glyphs', () => {
  const compass = describeUnicodeIcon('🧭', {
    key: 'direction',
    semantic: ['navigation'],
  });

  assert.equal(compass.key, 'direction');
  assert.deepEqual(compass.unicode.codepoints, ['U+1F9ED']);
  assert.equal(compass.vector.preview.length, 12);
  assert.equal(compass.vector.baked, isBaked());
  assert.match(compass.vector.embeddingText, /Emoji 🧭/);
});

test('metadata covers the full current iconography catalog', () => {
  assert.deepEqual(Object.keys(iconMetadata).sort(), listIcons().sort());
});
