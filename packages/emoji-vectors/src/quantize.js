// @ric/emoji-vectors/quantize — symmetric int8 quantization for the vector table.
//
// Embeddings are ~unit floats in [-1, 1]. Storing them int8 (one byte per dim,
// scale 127) cuts the table ~4× vs float32 with negligible cosine error, so an
// all-emoji table is a few hundred KB gzipped — shippable from an API. Pure +
// cross-env (no Buffer/TypedArray transport assumptions; arrays of small ints
// gzip well, and the CDN/framework handles the gzip).

export const QUANT_SCALE = 127;

/** Float vector → int8 array (values in [-127, 127]). */
export const quantizeVector = (vector, scale = QUANT_SCALE) =>
  (vector || []).map((v) =>
    Math.max(-127, Math.min(127, Math.round((Number(v) || 0) * scale)))
  );

/** int8 array → float vector. */
export const dequantizeVector = (quantized, scale = QUANT_SCALE) =>
  (quantized || []).map((q) => q / scale);

/** Quantize a whole baked table `{..., vectors:{emoji:[float]}}` to int8. */
export const quantizeTable = (table, scale = QUANT_SCALE) => ({
  ...table,
  quantization: 'int8',
  scale,
  vectors: Object.fromEntries(
    Object.entries(table?.vectors || {}).map(([emoji, vector]) => [
      emoji,
      quantizeVector(vector, scale),
    ])
  ),
});

/** Dequantize an int8 table back to floats (no-op if already float). */
export const dequantizeTable = (table) => {
  if (!table || table.quantization !== 'int8') return table;
  const scale = table.scale || QUANT_SCALE;
  return {
    ...table,
    quantization: 'float',
    scale: 1,
    vectors: Object.fromEntries(
      Object.entries(table.vectors || {}).map(([emoji, q]) => [
        emoji,
        dequantizeVector(q, scale),
      ])
    ),
  };
};
