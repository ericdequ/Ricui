// =============================================================================
// @ric/emoji-vectors/unicode — universal Unicode name resolver.
//
// A name for ANY code point in the 1,114,112-wide space, tiered for size:
//   • ALGORITHMIC (sync, ~828 B bundled): ~120k chars — CJK ideographs, Hangul
//     syllables, Tangut, … — whose names come from a RULE, so they cost zero
//     storage. `unicodeName(cp)` resolves these with no data loaded.
//   • EXPLICIT (lazy, ~265 KB gz): the ~40k individually-named chars. Loaded on
//     demand via `loadUnicodeNames()`, then passed in — never eagerly bundled.
//   • UNASSIGNED / Private Use / surrogates: derived or null.
//
// This is "store only what can't be derived" — the optimization for the full
// code-point space. Pure + node/browser-safe.
import { UNICODE_RANGES } from './unicode-ranges.data.js';

const toCodePoint = (input) =>
  typeof input === 'number' ? input : String(input || '').codePointAt(0) ?? -1;

const hex = (cp) => cp.toString(16).toUpperCase().padStart(4, '0');

// Hangul syllable composition (UAX #44 §4.8).
const S_BASE = 0xac00;
const N_COUNT = 588;
const T_COUNT = 28;
const L_JAMO = ['G', 'GG', 'N', 'D', 'DD', 'R', 'M', 'B', 'BB', 'S', 'SS', '', 'J', 'JJ', 'C', 'K', 'T', 'P', 'H'];
const V_JAMO = ['A', 'AE', 'YA', 'YAE', 'EO', 'E', 'YEO', 'YE', 'O', 'WA', 'WAE', 'OE', 'YO', 'U', 'WEO', 'WE', 'WI', 'YU', 'EU', 'YI', 'I'];
const T_JAMO = ['', 'G', 'GG', 'GS', 'N', 'NJ', 'NH', 'D', 'L', 'LG', 'LM', 'LB', 'LS', 'LT', 'LP', 'LH', 'M', 'B', 'BS', 'S', 'SS', 'NG', 'J', 'C', 'K', 'T', 'P', 'H'];

const hangulSyllableName = (cp) => {
  const s = cp - S_BASE;
  const l = Math.floor(s / N_COUNT);
  const v = Math.floor((s % N_COUNT) / T_COUNT);
  const t = s % T_COUNT;
  return `HANGUL SYLLABLE ${L_JAMO[l]}${V_JAMO[v]}${T_JAMO[t]}`;
};

const findRange = (cp) =>
  UNICODE_RANGES.find(([first, last]) => cp >= first && cp <= last) || null;

/** Algorithmic (rule-derived) name for a code point, or null if not in a range. */
export const algorithmicName = (input) => {
  const cp = toCodePoint(input);
  if (cp < 0) return null;
  const range = findRange(cp);
  if (!range) return null;
  const prefix = range[2];
  if (prefix === 'HANGUL SYLLABLE') return hangulSyllableName(cp);
  if (prefix === 'PRIVATE USE') return `PRIVATE USE-${hex(cp)}`;
  return `${prefix}-${hex(cp)}`;
};

/**
 * The Unicode name for a code point. Resolves algorithmic ranges with no data;
 * for explicitly-named chars pass the table from `loadUnicodeNames()`.
 * @param {number|string} input  a code point or a single-char string
 * @param {{ names?: Record<string,string> }} [opts]
 * @returns {string} the name, or '' if unknown without the explicit table
 */
export const unicodeName = (input, { names } = {}) => {
  const cp = toCodePoint(input);
  if (cp < 0) return '';
  return algorithmicName(cp) || names?.[hex(cp)] || '';
};

/**
 * Describe a code point: `{ codepoint, hex, char, name, source }`. `source` is
 * 'algorithmic' | 'explicit' | 'unknown' (explicit needs the loaded table).
 */
export const describeCodepoint = (input, { names } = {}) => {
  const cp = toCodePoint(input);
  const algorithmic = cp >= 0 ? algorithmicName(cp) : null;
  const explicit = !algorithmic && names ? names[hex(cp)] : null;
  return {
    codepoint: cp,
    hex: cp >= 0 ? `U+${hex(cp)}` : '',
    char: cp >= 0 ? String.fromCodePoint(cp) : '',
    name: algorithmic || explicit || '',
    source: algorithmic ? 'algorithmic' : explicit ? 'explicit' : 'unknown',
  };
};

/** Describe the first code point of a string. */
export const describeChar = (char, opts) =>
  describeCodepoint(toCodePoint(char), opts);

let cachedNames = null;
/** Lazy-load the ~40k explicit-name table (one ~265 KB-gz chunk, then cached). */
export const loadUnicodeNames = async () => {
  if (!cachedNames) {
    ({ UNICODE_NAMES: cachedNames } = await import('./unicode-names.data.js'));
  }
  return cachedNames;
};
