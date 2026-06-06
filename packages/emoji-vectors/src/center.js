// @ric/emoji-vectors/center — spread the similarity band.
//
// Embedding models pack cosine similarities into a narrow high range (every pair
// 0.8+), because all vectors share a large common component. Subtracting the
// global mean direction and re-normalizing ("all-but-the-mean" / centering)
// removes that shared component, so cosine reflects what's DISTINCTIVE about each
// glyph — ranking is preserved, margins widen sharply. Pure; round-trips int8.
import { normalizeVector } from './index.js';
import { dequantizeTable, quantizeTable } from './quantize.js';

export const centerTable = (table) => {
  if (!table?.vectors) return table;
  const wasInt8 = table.quantization === 'int8';
  const floatTable = wasInt8 ? dequantizeTable(table) : table;
  const entries = Object.entries(floatTable.vectors);
  if (!entries.length) return table;

  const dims = entries[0][1].length;
  const mean = Array.from(
    { length: dims },
    (_, i) => entries.reduce((sum, [, v]) => sum + (v[i] || 0), 0) / entries.length
  );

  const centered = {
    ...floatTable,
    centered: true,
    vectors: Object.fromEntries(
      entries.map(([emoji, v]) => [
        emoji,
        normalizeVector(v.map((x, i) => x - mean[i])),
      ])
    ),
  };
  return wasInt8 ? quantizeTable(centered) : centered;
};
