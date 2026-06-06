import assert from 'node:assert/strict';
import test from 'node:test';

import {
  accessibilityBaseline,
  components,
  cx,
  toneChipClass,
} from '../src/index.js';

test('@ric/ui-core cx joins truthy class names and drops falsy', () => {
  const result = cx('a', false, undefined, 'b');
  assert.match(result, /\ba\b/);
  assert.match(result, /\bb\b/);
  assert.doesNotMatch(result, /false|undefined/);
});

test('@ric/ui-core exposes primitives + a11y baseline', () => {
  assert.equal(typeof toneChipClass, 'function');
  assert.equal(typeof accessibilityBaseline, 'object');
  assert.equal(typeof components, 'object');
});
