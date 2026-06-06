import assert from 'node:assert/strict';
import test from 'node:test';

import { emojiCatalog, getEmoji } from '../src/index.js';

test('@ric/emoji catalog is non-empty and looks up by key', () => {
  const keys = Object.keys(emojiCatalog);
  assert.ok(keys.length > 0, 'catalog has entries');
  assert.ok(getEmoji(keys[0]), 'first catalog key resolves');
});
