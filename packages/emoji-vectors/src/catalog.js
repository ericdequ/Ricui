// @ric/emoji-vectors/catalog — the bridge to @ric/emoji's named glyph catalog.
// Vectorize any catalog key ("nightlife" → 🍸 → vector) so a shared, named emoji
// vocabulary gains a feature space. Kept separate from the pure core so the
// engine stays dependency-free; this file is the only one that imports @ric/emoji.
import { emojiCatalog, getEmoji } from '@ric/emoji';

import {
  buildEmojiVectorItems,
  describeEmojiGlyph,
  emojiSimilarity,
  emojiVector,
} from './index.js';

export { emojiCatalog, getEmoji };

/** Feature vector for a named catalog key (e.g. 'nightlife'). */
export const vectorForKey = (key, options) =>
  emojiVector(getEmoji(key), options);

/** Cosine [0,1] between two named catalog keys. */
export const similarityForKeys = (a, b, options) =>
  emojiSimilarity(getEmoji(a), getEmoji(b), options);

/** Human description for a named catalog key. */
export const describeKey = (key) => ({ key, ...describeEmojiGlyph(getEmoji(key)) });

/** Plottable, 2-D-projected items for the entire @ric/emoji catalog. */
export const catalogVectorItems = (options) =>
  buildEmojiVectorItems({ emojis: Object.values(emojiCatalog), ...options });
