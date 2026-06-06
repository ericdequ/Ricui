import assert from 'node:assert/strict';
import test from 'node:test';

import { describeEmojiGlyph } from '../src/index.js';
import {
  algorithmicName,
  describeCodepoint,
  loadUnicodeNames,
  unicodeName,
} from '../src/unicode.js';

test('algorithmic names cover the big ranges with zero stored data', () => {
  assert.equal(algorithmicName('中'), 'CJK UNIFIED IDEOGRAPH-4E2D');
  assert.equal(algorithmicName('𠀀'), 'CJK UNIFIED IDEOGRAPH-20000'); // Ext B
  assert.equal(algorithmicName('가'), 'HANGUL SYLLABLE GA');
  assert.equal(algorithmicName('김'), 'HANGUL SYLLABLE GIM'); // L+V+T
  assert.equal(algorithmicName('힣'), 'HANGUL SYLLABLE HIH'); // last syllable
  assert.equal(algorithmicName('a'), null); // explicit, not a range
  assert.equal(algorithmicName('😀'), null);
});

test('explicit names resolve via the lazy table (all assigned covered)', async () => {
  const names = await loadUnicodeNames();
  assert.ok(Object.keys(names).length > 40000, '~40k explicit names');
  assert.equal(unicodeName('a', { names }), 'LATIN SMALL LETTER A');
  assert.equal(unicodeName('✓', { names }), 'CHECK MARK');
  assert.equal(unicodeName('α', { names }), 'GREEK SMALL LETTER ALPHA');
  assert.equal(unicodeName('中'), 'CJK UNIFIED IDEOGRAPH-4E2D'); // algorithmic, no table needed
});

test('describeCodepoint: shape + source provenance', () => {
  const cjk = describeCodepoint('中');
  assert.equal(cjk.hex, 'U+4E2D');
  assert.equal(cjk.char, '中');
  assert.equal(cjk.source, 'algorithmic');
  assert.equal(describeCodepoint(0x1f600).source, 'unknown'); // explicit, no table passed
});

test('describeEmojiGlyph falls back to the algorithmic name for non-emoji glyphs', () => {
  assert.equal(describeEmojiGlyph('中').label, 'CJK UNIFIED IDEOGRAPH-4E2D');
  assert.equal(describeEmojiGlyph('🍕').label, 'pizza'); // emoji name still wins
});
