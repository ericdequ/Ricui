// @ric/emoji-vectors/names — the global meaning layer: every emoji's canonical
// CLDR name + group (from unicode-emoji-json, baked by scripts/build-names.mjs).
//
// This is the icon-library-style display registry — small (~18 KB gz),
// tree-shakeable, named lookups — the counterpart to the (fetched) vector table.
// App-SPECIFIC bindings (🍺 → "bar") live in the consuming app, not here.
import { EMOJI_NAMES } from './names.data.js';

export { EMOJI_NAMES };

const stripVariation = (glyph) =>
  String(glyph || '').replace(/[\uFE0E\uFE0F]/g, '');

const lookup = (glyph) =>
  EMOJI_NAMES[glyph] || EMOJI_NAMES[stripVariation(glyph)] || null;

/** Canonical name for a glyph (variation-selector tolerant), e.g. "beer mug". */
export const emojiName = (glyph) => lookup(glyph)?.name || '';

/** CLDR group, e.g. "Food & Drink". */
export const emojiGroup = (glyph) => lookup(glyph)?.group || '';

/** Full `{ name, group }` entry, or null. */
export const describeEmojiName = (glyph) => lookup(glyph);

/** True if the glyph has a registered name. */
export const isNamedEmoji = (glyph) => Boolean(lookup(glyph));
