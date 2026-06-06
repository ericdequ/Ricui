import assert from 'node:assert/strict';
import test from 'node:test';

import { emojiAttrs, iconAttrs } from '../src/attrs.js';

test('emojiAttrs: glyph carries accessible + machine-readable metadata', () => {
  const a = emojiAttrs('🍺');
  assert.equal(a.role, 'img');
  assert.equal(a['aria-label'], 'beer'); // curated meaning → screen readers
  assert.equal(a['data-emoji-type'], 'bar');
  assert.equal(a['data-codepoints'], 'U+1F37A');
  assert.match(a.title, /nightlife/);
});

test('emojiAttrs: explicit label overrides aria-label', () => {
  assert.equal(emojiAttrs('🍺', { label: 'Happy hour' })['aria-label'], 'Happy hour');
});

test('iconAttrs: registry icon carries semantic tags + vector provenance', () => {
  const a = iconAttrs('nightlife');
  assert.equal(a['data-icon-key'], 'nightlife');
  assert.equal(a['data-icon-semantic'], 'bar nightclub bev');
  assert.equal(a.role, 'img');
  assert.ok(a['data-emoji']);
  assert.ok('data-vector-baked' in a);
});

test('iconAttrs: unknown name → null (component renders nothing, never throws)', () => {
  assert.equal(iconAttrs('does-not-exist'), null);
});
