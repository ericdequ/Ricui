// @ric/icons/attrs — the embedded metadata, as DOM attributes (pure, testable).
//
// This is the logic behind `<Emoji>`/`<Icon>`: turn a glyph (or a named icon)
// into the accessible + machine-readable attributes that travel with it —
// `aria-label` (meaning, for screen readers), `title` (hover), and `data-*`
// (type, codepoints, vector provenance, for SEO/EPU/automation). Keeping it pure
// means the metadata contract is unit-tested; the React layer just spreads it.
import { describeEmojiGlyph } from '@ric/emoji-vectors';
import { isBaked } from '@ric/emoji-vectors/baked';

import { describeIcon, iconography } from './index.js';

/** Accessible + machine-readable attributes for an arbitrary glyph. */
export const emojiAttrs = (glyph, { label } = {}) => {
  const d = describeEmojiGlyph(glyph);
  return {
    role: 'img',
    'aria-label': label || d.label || d.type,
    title: d.emotion || d.label,
    'data-emoji': d.emoji,
    'data-emoji-type': d.type,
    'data-codepoints': (d.codepoints || []).join(' '),
  };
};

/** As above, plus registry metadata (semantic tags + baked-vector provenance). */
export const iconAttrs = (name, { label } = {}) => {
  const icon = iconography[name];
  if (!icon) return null;
  const meta = describeIcon(name);
  const base = emojiAttrs(icon.glyph, { label: label || name });
  const semantic = (icon.semantic || []).join(', ');
  const uncurated = meta?.unicode?.description?.type === 'unicode-symbol';
  return {
    ...base,
    // For glyphs not in the curated meanings, the registry's semantic tags are a
    // richer hover/label than the bare codepoint description.
    title: uncurated && semantic ? semantic : base.title,
    'aria-label': label || (uncurated && semantic ? `${name}: ${semantic}` : base['aria-label']),
    'data-icon-key': name,
    'data-icon-semantic': (icon.semantic || []).join(' '),
    'data-vector-model': meta?.vector?.model,
    'data-vector-baked': String(isBaked()),
  };
};
