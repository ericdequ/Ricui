import assert from 'node:assert/strict';
import test from 'node:test';

import { centerTable } from '../src/center.js';
import { cosineSimilarity, normalizeVector } from '../src/index.js';
import { dequantizeTable, quantizeTable } from '../src/quantize.js';

// Three vectors sharing a big common component → inflated cosines.
const COMMON = [1, 1, 1, 0];
const mk = (extra) => normalizeVector(COMMON.map((c, i) => c + (extra[i] || 0)));
const table = {
  dimensions: 4,
  vectors: {
    a: mk([0.3, 0, 0, 0]),
    b: mk([0.25, 0.05, 0, 0]), // close to a
    c: mk([0, 0, 0, 0.4]), // different direction
  },
};

const sim = (t, x, y) =>
  cosineSimilarity(
    normalizeVector(dequantizeTable(t).vectors[x]),
    normalizeVector(dequantizeTable(t).vectors[y])
  );

test('centering widens margins while preserving ranking', () => {
  const centered = centerTable(table);
  assert.equal(centered.centered, true);
  // ranking preserved: a~b closer than a~c, before and after
  assert.ok(sim(table, 'a', 'b') > sim(table, 'a', 'c'), 'before');
  assert.ok(sim(centered, 'a', 'b') > sim(centered, 'a', 'c'), 'after');
  // the distinct pair drops more once the shared component is removed
  assert.ok(
    sim(centered, 'a', 'c') < sim(table, 'a', 'c') - 0.1,
    'distinct pair spreads apart'
  );
});

test('centering round-trips an int8 table (stays int8)', () => {
  const centered = centerTable(quantizeTable(table));
  assert.equal(centered.quantization, 'int8');
  assert.equal(centered.centered, true);
});
