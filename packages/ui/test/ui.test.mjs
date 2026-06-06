import assert from 'node:assert/strict';
import test from 'node:test';

import * as ui from '../src/index.js';

// @ric/ui is the aggregate barrel. This guards against a sub-package export
// silently dropping out of the public surface (the failure mode that broke the
// icons embedding-text contract): if any of these disappear, the barrel is stale.
test('@ric/ui re-exports the sub-package surface', () => {
  for (const name of [
    'cx',
    'describeIcon',
    'describeUnicodeIcon',
    'getEmoji',
    'MEETUP_STATE',
    'GRADIENTS',
    'MOTION',
    'ICON_SIZE',
  ]) {
    assert.ok(name in ui, `@ric/ui missing re-export: ${name}`);
  }
  assert.ok(Object.keys(ui).length >= 40, 'barrel surface is broad');
});
