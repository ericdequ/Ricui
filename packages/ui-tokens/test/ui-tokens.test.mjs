import assert from 'node:assert/strict';
import test from 'node:test';

import {
  GRADIENTS,
  MOTION,
  RADIUS,
  ROLE_PALETTE,
  TONES,
  TONE_ALIAS,
  resolveTone,
  tokens,
} from '../src/index.js';

test('@ric/ui-tokens exposes the design-token surface', () => {
  for (const group of [GRADIENTS, MOTION, RADIUS, ROLE_PALETTE, TONES, TONE_ALIAS, tokens]) {
    assert.equal(typeof group, 'object');
    assert.ok(group !== null);
  }
  assert.ok(Object.keys(tokens).length > 0, 'tokens are non-empty');
  assert.equal(typeof resolveTone, 'function');
});
