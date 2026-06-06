// @ric/icons/react — render an emoji that CARRIES its meaning.
//
// Using an emoji through Ric UI shouldn't drop a bare glyph into the DOM — it
// should emit the embedded metadata with it (accessible label + hover title +
// machine-readable data-* from emojiAttrs/iconAttrs). Thin shell over the pure
// attribute builders in ./attrs.js (those carry the contract + the tests).
import React from 'react';

import { emojiAttrs, iconAttrs } from './attrs.js';
import { iconography } from './index.js';

/** Render an arbitrary glyph with embedded metadata. */
export const Emoji = ({ glyph, label, className, style, ...rest }) => (
  <span
    className={className}
    style={style}
    {...emojiAttrs(glyph, { label })}
    {...rest}
  >
    {glyph}
  </span>
);

/** Render a named registry icon with its full embedded metadata. */
export const Icon = ({ name, label, className, style, ...rest }) => {
  const attrs = iconAttrs(name, { label });
  if (!attrs) return null;
  return (
    <span className={className} style={style} {...attrs} {...rest}>
      {iconography[name].glyph}
    </span>
  );
};

export default Icon;
