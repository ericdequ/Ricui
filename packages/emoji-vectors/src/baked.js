// @ric/emoji-vectors/baked — prefer real model embeddings, fall back gracefully.
//
// The pure core's vectors are a deterministic codepoint-wave (open-vocabulary,
// offline, but NOT semantic — 🍺 and 🍻 are not truly "close"). Run `npm run
// bake` to embed the vocabulary through a real model once and write baked.data.js;
// then `semanticEmojiVector` returns those vectors, with the codepoint-wave space
// as the fallback for any glyph the bake didn't cover. Fallbacks are generated at
// the baked dimensionality so every vector in play is the same length.
import { BAKED } from './baked.data.js';
import { DEFAULT_DIMENSIONS, emojiVector, normalizeVector } from './index.js';
import { dequantizeTable } from './quantize.js';

export { BAKED };

const EMOJI_VECTORS_CACHE = 'ric-emoji-vectors-v1';

const decodeTable = (table) =>
  table?.quantization === 'int8' ? dequantizeTable(table) : table;

/**
 * Fetch a baked table from an endpoint (e.g. robotric.org's internal emoji-
 * vectors API), dequantizing int8 → float. Persists the response in the Cache
 * API (browser) so the multi-MB table is fetched ONCE per device, then served
 * offline — the bundle never carries it. No-ops the cache gracefully where the
 * Cache API is absent (node/SSR). Returns a table for `semanticEmojiVector({table})`.
 * @param {string} url
 * @param {{ token?: string, fetchImpl?: typeof fetch, cache?: boolean }} [opts]
 */
export const fetchBakedVectors = async (
  url,
  { token, fetchImpl = fetch, cache = true } = {}
) => {
  const headers = token ? { authorization: `Bearer ${token}` } : undefined;
  const canCache = cache && typeof caches !== 'undefined';

  if (canCache) {
    try {
      const store = await caches.open(EMOJI_VECTORS_CACHE);
      const hit = await store.match(url);
      if (hit) return decodeTable(await hit.json());
    } catch {
      /* cache unavailable — fall through to network */
    }
  }

  const res = await fetchImpl(url, headers ? { headers } : undefined);
  if (!res.ok) throw new Error(`emoji-vectors fetch ${res.status}`);

  if (canCache && typeof res.clone === 'function') {
    try {
      const store = await caches.open(EMOJI_VECTORS_CACHE);
      await store.put(url, res.clone());
    } catch {
      /* best-effort cache write */
    }
  }

  return decodeTable(await res.json());
};

/** True once a real bake has populated the table. */
export const isBaked = (table = BAKED) =>
  Object.keys(table?.vectors || {}).length > 0;

// Tolerate emoji-presentation variation selectors (U+FE0F/U+FE0E): the bake keys
// glyphs by base codepoint, so "🍽️" resolves to "🍽".
const stripVariation = (glyph) =>
  String(glyph || '').replace(/[\uFE0E\uFE0F]/g, '');

/** The baked vector for a glyph (variation-selector tolerant), or null. */
export const bakedVector = (emoji, table = BAKED) =>
  table?.vectors?.[emoji] || table?.vectors?.[stripVariation(emoji)] || null;

const splitGlyphs = (input) =>
  typeof Intl !== 'undefined' && Intl.Segmenter
    ? Array.from(
        new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(
          String(input || '')
        ),
        (p) => p.segment
      ).filter((p) => p.trim())
    : Array.from(String(input || '')).filter((p) => p.trim());

/**
 * Semantic vector for a glyph or composed string: exact baked vector → mean of
 * baked component vectors → deterministic fallback (at the baked dimensionality).
 * Always a unit vector. Pass `{ table }` to use a specific baked table (tests).
 */
export const semanticEmojiVector = (emoji, { table = BAKED } = {}) => {
  const exact = bakedVector(emoji, table);
  if (exact) return normalizeVector(exact);

  const parts = splitGlyphs(emoji);
  if (parts.length > 1) {
    const components = parts.map((p) => bakedVector(p, table)).filter(Boolean);
    if (components.length) {
      const dims = components[0].length;
      const mean = Array.from({ length: dims }, (_, i) =>
        components.reduce((sum, v) => sum + (v[i] || 0), 0) / components.length
      );
      return normalizeVector(mean);
    }
  }

  const dimensions = isBaked(table) ? table.dimensions : DEFAULT_DIMENSIONS;
  return emojiVector(emoji, { dimensions });
};
