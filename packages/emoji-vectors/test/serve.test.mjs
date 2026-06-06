import assert from 'node:assert/strict';
import test from 'node:test';

import {
  dequantizeVector,
  quantizeTable,
  quantizeVector,
} from '../src/quantize.js';
import { emojiVectorsResponse } from '../src/serve.js';

const floatTable = {
  provider: 'mock',
  model: 'test',
  dimensions: 4,
  vectors: {
    '🍺': [1, 0, 0, 0],
    '🍻': [0.9, 0.1, 0, 0],
    '⛳': [0, 0, 1, 0],
  },
};
const int8Table = quantizeTable(floatTable);

test('quantize round-trips within int8 precision', () => {
  const q = quantizeVector([1, -1, 0.5, -0.25]);
  assert.deepEqual(q, [127, -127, 64, -32]);
  const back = dequantizeVector(q);
  back.forEach((v, i) =>
    assert.ok(Math.abs(v - [1, -1, 0.5, -0.25][i]) < 0.01, `dim ${i}`)
  );
});

test('quantizeTable marks int8 + scale and shrinks values to bytes', () => {
  assert.equal(int8Table.quantization, 'int8');
  assert.equal(int8Table.scale, 127);
  assert.deepEqual(int8Table.vectors['🍺'], [127, 0, 0, 0]);
});

test('serve: full table, count + cache headers', async () => {
  const res = emojiVectorsResponse(new Request('https://robotric.org/api/emoji-vectors'), {
    table: int8Table,
  });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('cache-control'), /max-age=86400/);
  const body = await res.json();
  assert.equal(body.count, 3);
  assert.equal(body.quantization, 'int8');
});

test('serve: ?emojis= returns a server-side subset', async () => {
  const res = emojiVectorsResponse(
    new Request('https://robotric.org/api/emoji-vectors?emojis=🍺⛳'),
    { table: int8Table }
  );
  const body = await res.json();
  assert.deepEqual(Object.keys(body.vectors).sort(), ['⛳', '🍺']);
  assert.equal(body.count, 2);
});

test('serve: ?format=float dequantizes', async () => {
  const res = emojiVectorsResponse(
    new Request('https://robotric.org/api/emoji-vectors?emojis=🍺&format=float'),
    { table: int8Table }
  );
  const body = await res.json();
  assert.equal(body.quantization, 'float');
  assert.ok(Math.abs(body.vectors['🍺'][0] - 1) < 0.01);
});

test('serve: token gate rejects without/with wrong token, accepts Bearer', async () => {
  const opts = { table: int8Table, token: 'sekret' };
  assert.equal(
    emojiVectorsResponse(new Request('https://robotric.org/x'), opts).status,
    401
  );
  const ok = emojiVectorsResponse(
    new Request('https://robotric.org/x', {
      headers: { authorization: 'Bearer sekret' },
    }),
    opts
  );
  assert.equal(ok.status, 200);
  const okQuery = emojiVectorsResponse(
    new Request('https://robotric.org/x?token=sekret'),
    opts
  );
  assert.equal(okQuery.status, 200);
});

test('serve: missing table → 503', () => {
  assert.equal(emojiVectorsResponse(new Request('https://x/')).status, 503);
});
