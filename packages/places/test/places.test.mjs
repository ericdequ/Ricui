import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PLACE_STATE,
  definePlaceKind,
  formatDistance,
  formatPriceLevel,
  formatRating,
  getPlaceKind,
  listPlaceKinds,
  resolvePlaceState,
} from '../src/index.js';

test('@ric/places exposes a non-empty kind registry', () => {
  assert.equal(typeof PLACE_STATE, 'object');
  const kinds = listPlaceKinds();
  assert.ok(Array.isArray(kinds) && kinds.length > 0, 'non-empty kinds');
});

test('@ric/places exposes its formatter + resolver surface', () => {
  for (const fn of [
    definePlaceKind,
    formatDistance,
    formatPriceLevel,
    formatRating,
    getPlaceKind,
    resolvePlaceState,
  ]) {
    assert.equal(typeof fn, 'function');
  }
});
