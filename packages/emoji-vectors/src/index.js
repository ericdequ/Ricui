// =============================================================================
// @ric/emoji-vectors — emoji ↔ unicode ↔ feature-vector space.
//
// A symbol is the bit-for-byte champion of carrying meaning: one emoji grounds a
// complex vibe that both humans and machines read instantly. This package turns
// any emoji (or composed emoji string like "📍🍺") into a continuous feature
// vector, compares two by cosine, and projects a set to 2-D for visualization.
//
// Pure + dependency-free + node-safe (no React, no I/O). Vectors come from a
// deterministic codepoint-wave fallback by default; pass real model embeddings
// (e.g. an embeddings API over `buildEmojiEmbeddingText`) to upgrade in place.
// The @ric/emoji catalog integration lives in `./catalog`; the SVG plot in
// `./react`. Companion to @ric/tst, whose key grounds a record in space·time·
// type *before* it is vector-embedded here.
// =============================================================================

const DEFAULT_FALLBACK_DIMENSIONS = 32;
const MAX_EMOJI_COUNT = 48;
const EPSILON = 1e-12;

export const DEFAULT_DIMENSIONS = DEFAULT_FALLBACK_DIMENSIONS;

// Interpretable seed meanings — the human-readable grounding under the vectors.
// Extend freely; unknown glyphs degrade to a codepoint description + fallback
// vector, so the space is open-vocabulary.
export const EMOJI_MEANINGS = Object.freeze({
  '🍺': { label: 'beer', type: 'bar', emotion: 'casual nightlife refreshment' },
  '🍻': { label: 'clinking beers', type: 'meetup', emotion: 'shared drink meetup celebration' },
  '🍽️': { label: 'dining', type: 'restaurant', emotion: 'shared meal sit-down' },
  '☕': { label: 'coffee', type: 'cafe', emotion: 'calm focus daytime chat' },
  '⛳': { label: 'golf flag', type: 'golf', emotion: 'active leisure open-air play' },
  '🎸': { label: 'guitar', type: 'live-music', emotion: 'live music energy performance' },
  '😂': { label: 'laughing', type: 'emotion', emotion: 'funny joy release' },
  '😄': { label: 'smile', type: 'emotion', emotion: 'open happy welcome' },
  '😌': { label: 'relieved', type: 'emotion', emotion: 'calm comfort settled' },
  '🔥': { label: 'fire', type: 'vibe', emotion: 'high energy exciting hot streak' },
  '🎉': { label: 'party popper', type: 'event', emotion: 'party celebration group energy' },
  '💃': { label: 'dancing', type: 'vibe', emotion: 'dance movement nightlife spark' },
  '💬': { label: 'chat', type: 'message', emotion: 'conversation social signal' },
  '📸': { label: 'camera flash', type: 'photo', emotion: 'captured memory visible moment' },
  '📍': { label: 'pin', type: 'place', emotion: 'here now place anchor' },
  '👬': { label: 'two people', type: 'friend', emotion: 'friends together presence check-in' },
  '✨': { label: 'sparkles', type: 'vibe', emotion: 'magic polish bright potential' },
});

export const DEFAULT_EMOJIS = Object.freeze(Object.keys(EMOJI_MEANINGS));

export const codepointsForGlyph = (glyph) =>
  Array.from(glyph || '').map(
    (char) => `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`
  );

const splitGraphemes = (input) => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(input), (part) => part.segment);
  }
  return Array.from(input);
};

/** Parse free text / a glyph string into a de-duped ordered emoji list. */
export const parseEmojiInput = (input, limit = MAX_EMOJI_COUNT) => {
  const raw = typeof input === 'string' ? input.trim() : '';
  if (!raw) return [];
  const tokens = /[,\n\r;]/u.test(raw)
    ? raw.split(/[,\n\r;]+/u).map((t) => t.trim()).filter(Boolean)
    : raw.includes(' ')
      ? raw.split(/\s+/u).filter(Boolean)
      : splitGraphemes(raw).filter((t) => t.trim());
  const seen = new Set();
  const emojis = [];
  for (const token of tokens) {
    if (seen.has(token)) continue;
    seen.add(token);
    emojis.push(token);
    if (emojis.length >= limit) break;
  }
  return emojis;
};

const describeEmojiString = (emoji) => {
  const parts = splitGraphemes(emoji).filter((p) => p.trim());
  if (parts.length <= 1) return null;
  const components = parts.map((p) => describeEmojiGlyph(p));
  const types = Array.from(new Set(components.map((c) => c.type)));
  return {
    emoji,
    codepoints: codepointsForGlyph(emoji),
    label: components.map((c) => c.label).join(' + '),
    type: types.length === 1 ? types[0] : 'emoji-string',
    emotion: `emoji string: ${components.map((c) => c.emotion).join(' + ')}`,
    components,
    knownComponentCount: components.filter((c) => EMOJI_MEANINGS[c.emoji]).length,
  };
};

/** Human-readable description for a glyph or composed string. */
export const describeEmojiGlyph = (emoji) => {
  const curated = EMOJI_MEANINGS[emoji];
  const composed = curated ? null : describeEmojiString(emoji);
  if (composed) return composed;
  const codepoints = codepointsForGlyph(emoji);
  return {
    emoji,
    codepoints,
    label: curated?.label || codepoints.join(' '),
    type: curated?.type || 'unicode-symbol',
    emotion: curated?.emotion || `Unicode symbol ${codepoints.join(' ')}`,
  };
};

/** The text fed to an embeddings model to upgrade a glyph from fallback. */
export const buildEmojiEmbeddingText = (emoji) => {
  const d = describeEmojiGlyph(emoji);
  return [
    `Emoji ${d.emoji}`,
    `Codepoints ${d.codepoints.join(' ')}`,
    `Type ${d.type}`,
    `Emotion and vibe meaning: ${d.emotion}`,
    `Use as a compact human and machine readable symbol for Time Space Type indexing.`,
  ].join('. ');
};

export const normalizeVector = (vector) => {
  const magnitude = Math.sqrt(vector.reduce((t, v) => t + v * v, 0));
  if (magnitude <= EPSILON) return vector.map(() => 0);
  return vector.map((v) => v / magnitude);
};

export const cosineSimilarity = (left, right) => {
  const length = Math.min(left.length, right.length);
  if (!length) return 0;
  let dotP = 0;
  let lMag = 0;
  let rMag = 0;
  for (let i = 0; i < length; i += 1) {
    const l = left[i] || 0;
    const r = right[i] || 0;
    dotP += l * r;
    lMag += l * l;
    rMag += r * r;
  }
  const denom = Math.sqrt(lMag) * Math.sqrt(rMag);
  return denom <= EPSILON ? 0 : dotP / denom;
};

/** A deterministic, open-vocabulary fallback vector from the glyph codepoints. */
export const buildFallbackVector = (emoji, dimensions = DEFAULT_FALLBACK_DIMENSIONS) => {
  const codepoints = Array.from(emoji || '', (char) => char.codePointAt(0));
  const seed = codepoints.reduce(
    (t, cp, i) => (t + cp * (i + 17) + (cp % 97) * 131) >>> 0,
    2166136261
  );
  const vector = [];
  let state = seed || 1;
  for (let i = 0; i < dimensions; i += 1) {
    state = (1664525 * state + 1013904223 + i * 7919) >>> 0;
    const base = state / 0xffffffff;
    const wave =
      Math.sin((codepoints[0] || 1) * (i + 1) * 0.017) +
      Math.cos((codepoints.at(-1) || 1) * (i + 3) * 0.013);
    vector.push(base * 2 - 1 + wave * 0.25);
  }
  return normalizeVector(vector);
};

/** Vector for a single glyph or composed string (mean of component vectors). */
export const emojiVector = (emoji, { dimensions = DEFAULT_FALLBACK_DIMENSIONS } = {}) => {
  const parts = splitGraphemes(String(emoji || '')).filter((p) => p.trim());
  if (parts.length <= 1) return buildFallbackVector(emoji, dimensions);
  const vectors = parts.map((p) => buildFallbackVector(p, dimensions));
  const mean = Array.from({ length: dimensions }, (_, i) =>
    vectors.reduce((s, v) => s + (v[i] || 0), 0) / vectors.length
  );
  return normalizeVector(mean);
};

/** Cosine similarity between two glyphs/strings, mapped to [0, 1]. */
export const emojiSimilarity = (a, b, options = {}) => {
  const sim = cosineSimilarity(emojiVector(a, options), emojiVector(b, options));
  return Math.min(1, Math.max(0, (sim + 1) / 2));
};

const dot = (l, r) => l.reduce((t, v, i) => t + v * (r[i] || 0), 0);
const subtractProjection = (vector, axis) => {
  const amount = dot(vector, axis);
  return vector.map((v, i) => v - amount * (axis[i] || 0));
};
const chooseAxis = (vectors) => {
  let selected = vectors[0] || [];
  let best = -1;
  for (const vector of vectors) {
    const m = dot(vector, vector);
    if (m > best) {
      selected = vector;
      best = m;
    }
  }
  return normalizeVector(selected);
};

/** Project items (each {vector}) to a unit 2-D `direction` for plotting. */
export const projectVectors2d = (items) => {
  if (!items.length) return [];
  const normalized = items.map((item) => normalizeVector(item.vector));
  const dims = normalized[0]?.length || 0;
  const mean = Array.from({ length: dims }, (_, i) =>
    normalized.reduce((s, v) => s + (v[i] || 0), 0) / normalized.length
  );
  const centered = normalized.map((v) => v.map((val, i) => val - (mean[i] || 0)));
  const axisX = chooseAxis(centered);
  const residuals = centered.map((v) => subtractProjection(v, axisX));
  const axisY = chooseAxis(residuals);
  const raw = centered.map((v) => ({ x: dot(v, axisX), y: dot(v, axisY) }));
  const maxAbs = Math.max(
    0.001,
    ...raw.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)])
  );
  return items.map((item, i) => ({
    ...item,
    direction: { x: raw[i].x / maxAbs, y: raw[i].y / maxAbs },
  }));
};

/**
 * Build plottable items for a set of emojis. Pass `vectors` (model embeddings,
 * index-aligned) to upgrade from the fallback; omit for the deterministic space.
 */
export const buildEmojiVectorItems = ({
  emojis,
  vectors = [],
  provider = 'deterministic-fallback',
  model = 'unicode-codepoint-wave-v1',
  dimensions = DEFAULT_FALLBACK_DIMENSIONS,
} = {}) => {
  const base = (emojis || []).map((emoji, i) => {
    const vector = normalizeVector(vectors[i] || emojiVector(emoji, { dimensions }));
    return {
      ...describeEmojiGlyph(emoji),
      provider,
      model,
      dimensions: vector.length,
      vectorPreview: vector.slice(0, 12),
      vector,
    };
  });
  return projectVectors2d(base);
};

/** All unique pairwise cosine comparisons across plottable items. */
export const buildEmojiComparisons = (items) => {
  const out = [];
  for (let l = 0; l < items.length; l += 1) {
    for (let r = l + 1; r < items.length; r += 1) {
      out.push({
        left: items[l].emoji,
        right: items[r].emoji,
        cosine: cosineSimilarity(items[l].vector, items[r].vector),
      });
    }
  }
  return out;
};
