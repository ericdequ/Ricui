// @ric/emoji-vectors/react — display + visualize the emoji feature space.
// <EmojiVectorScatter/> plots each emoji as a direction on a unit disc (the 2-D
// projection from the core), so the vector space is legible at a glance. Pure
// SVG, self-contained styling (no CSS dependency), themeable via `accent`.
import React from 'react';

import { buildEmojiVectorItems } from './index.js';

const clampPlot = (value) =>
  50 + Math.max(-40, Math.min(40, (Number(value) || 0) * 40));

/**
 * @param {object} props
 * @param {Array}  [props.items]   pre-built items (from buildEmojiVectorItems)
 * @param {string[]} [props.emojis] emojis to build items from, if `items` absent
 * @param {string[]} [props.selected] glyphs to highlight
 * @param {number} [props.size=440] pixel height
 * @param {string} [props.accent='#67e8f9'] highlight colour
 */
export const EmojiVectorScatter = ({
  items: itemsProp,
  emojis,
  selected = [],
  size = 440,
  accent = '#67e8f9',
}) => {
  const items = itemsProp || buildEmojiVectorItems({ emojis: emojis || [] });
  const sel = new Set(selected);
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Emoji vector direction plot"
      style={{ width: '100%', height: size, overflow: 'visible' }}
    >
      <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.16)" strokeWidth="0.45" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.16)" strokeWidth="0.45" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(103,232,249,0.2)" strokeWidth="0.5" />
      {items.map((item) => {
        const x = clampPlot(item.direction?.x);
        const y = clampPlot(-(item.direction?.y || 0));
        const isSel = sel.has(item.emoji);
        return (
          <g key={item.emoji}>
            <line
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke={isSel ? accent : 'rgba(255,255,255,0.2)'}
              strokeWidth={isSel ? 0.7 : 0.35}
            />
            <circle
              cx={x}
              cy={y}
              r={isSel ? 4.2 : 3.3}
              fill={isSel ? accent : '#111827'}
              stroke={isSel ? '#ecfeff' : 'rgba(255,255,255,0.5)'}
              strokeWidth="0.6"
            />
            <text
              x={x}
              y={y + 1.7}
              textAnchor="middle"
              style={{ fontSize: 4, userSelect: 'none' }}
            >
              {item.emoji}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default EmojiVectorScatter;
