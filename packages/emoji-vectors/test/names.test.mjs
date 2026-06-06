import assert from 'node:assert/strict';
import test from 'node:test';

import { describeEmojiGlyph } from '../src/index.js';
import {
  EMOJI_NAMES,
  describeEmojiName,
  emojiGroup,
  emojiName,
  isNamedEmoji,
} from '../src/names.js';

test('the names registry covers the emoji vocabulary', () => {
  assert.ok(Object.keys(EMOJI_NAMES).length > 1500, 'broad coverage');
});

test('canonical CLDR names + group, variation-selector tolerant', () => {
  assert.equal(emojiName('🍺'), 'beer mug');
  assert.equal(emojiGroup('🍺'), 'Food & Drink');
  assert.equal(emojiName('🍻'), 'clinking beer mugs');
  assert.equal(emojiName('🍽️'), 'fork and knife with plate'); // FE0F tolerated
  assert.equal(isNamedEmoji('🦄'), true);
  assert.equal(isNamedEmoji(''), false);
  assert.deepEqual(describeEmojiName('🍕'), { name: 'pizza', group: 'Food & Drink' });
});

test('describeEmojiGlyph uses the CLDR name for uncurated glyphs', () => {
  // curated meaning still wins
  assert.equal(describeEmojiGlyph('🍺').label, 'beer');
  // uncurated → real name instead of "Unicode symbol U+…"
  assert.equal(describeEmojiGlyph('🍕').label, 'pizza');
  assert.equal(describeEmojiGlyph('🦄').emotion, 'unicorn');
});
