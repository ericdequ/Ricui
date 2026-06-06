import {
  buildEmojiEmbeddingText,
  buildEmojiVectorItems,
  codepointsForGlyph,
  cosineSimilarity,
  describeEmojiGlyph,
} from '@ric/emoji-vectors';
import {
  BAKED,
  isBaked,
  semanticEmojiVector,
} from '@ric/emoji-vectors/baked';

export const iconography = {
  check: {
    type: 'emoji',
    glyph: '\u2705',
    semantic: ['success', 'done', 'approved'],
  },
  warning: {
    type: 'emoji',
    glyph: '\u26A0\uFE0F',
    semantic: ['warning', 'attention'],
  },
  robot: {
    type: 'emoji',
    glyph: '\u{1F916}',
    semantic: ['automation', 'assistant'],
  },
  legal: {
    type: 'emoji',
    glyph: '\u2696\uFE0F',
    semantic: ['legal', 'policy'],
  },
  deploy: {
    type: 'emoji',
    glyph: '\u{1F680}',
    semantic: ['release', 'launch'],
  },
  map: {
    type: 'emoji',
    glyph: '\u{1F5FA}\uFE0F',
    semantic: ['map', 'place', 'geospatial'],
  },
  nightlife: {
    type: 'emoji',
    glyph: '\u{1F378}',
    semantic: ['bar', 'nightclub', 'bev'],
  },
  sports: {
    type: 'emoji',
    glyph: '\u{1F3DF}\uFE0F',
    semantic: ['sports', 'field', 'pickup'],
  },
  soundscape: {
    type: 'emoji',
    glyph: '\u{1F3B5}',
    semantic: ['music', 'podcast', 'creator'],
  },
  energia: {
    type: 'emoji',
    glyph: '\u{1F4AB}',
    semantic: ['camino', 'church', 'energy'],
  },
  ecology: {
    type: 'emoji',
    glyph: '\u{1F30E}',
    semantic: ['animal', 'plant', 'dex'],
  },
  contech: {
    type: 'emoji',
    glyph: '\u{1F3D7}\uFE0F',
    semantic: ['construction', 'lidar', 'cad'],
  },
  seshSenate: {
    type: 'emoji',
    glyph: '\u{1F451}',
    semantic: ['regional-royalty', 'vote', 'culture'],
  },
};

const iconEntries = () => Object.entries(iconography);

const semanticVectorModel = () =>
  isBaked()
    ? {
        provider: BAKED.provider || 'baked',
        model: BAKED.model || 'baked-emoji-vectors',
      }
    : {
        provider: 'deterministic-fallback',
        model: 'unicode-codepoint-wave-v1',
      };

const iconDescription = (icon = {}) => {
  if (icon.type !== 'emoji') {
    return {
      emoji: '',
      codepoints: [],
      label: icon.type || 'icon',
      type: icon.type || 'icon',
      emotion: 'non-emoji icon',
    };
  }
  return describeEmojiGlyph(icon.glyph);
};

export const describeUnicodeIcon = (
  glyph,
  { key = '', semantic = [], type = 'emoji' } = {}
) => {
  const description = describeEmojiGlyph(glyph);
  const vector = semanticEmojiVector(glyph);
  const model = semanticVectorModel();
  return {
    key,
    type,
    glyph,
    semantic,
    unicode: {
      glyph,
      codepoints: codepointsForGlyph(glyph),
      description,
    },
    vector: {
      provider: model.provider,
      model: model.model,
      baked: isBaked(),
      dimensions: vector.length,
      preview: vector.slice(0, 12),
      embeddingText: buildEmojiEmbeddingText(glyph),
    },
  };
};

export const iconMetadata = Object.freeze(
  Object.fromEntries(
    iconEntries().map(([key, icon]) => {
      const metadata =
        icon.type === 'emoji'
          ? describeUnicodeIcon(icon.glyph, {
              key,
              semantic: icon.semantic,
              type: icon.type,
            })
          : {
              key,
              ...icon,
              unicode: {
                glyph: icon.glyph,
                codepoints: [],
                description: iconDescription(icon),
              },
              vector: {
                provider: 'none',
                model: 'none',
                dimensions: 0,
                preview: [],
                embeddingText: '',
              },
            };
      return [
        key,
        {
          ...icon,
          ...metadata,
        },
      ];
    })
  )
);

export const listIcons = () => Object.keys(iconography);

export const describeIcon = (key) => iconMetadata[key] ?? null;

export const iconVector = (key, options) => {
  const icon = iconography[key];
  return icon?.type === 'emoji' ? semanticEmojiVector(icon.glyph, options) : [];
};

export const iconSimilarity = (leftKey, rightKey, options) => {
  const left = iconography[leftKey];
  const right = iconography[rightKey];
  if (!left || !right || left.type !== 'emoji' || right.type !== 'emoji') return 0;
  const leftVector = semanticEmojiVector(left.glyph, options);
  const rightVector = semanticEmojiVector(right.glyph, options);
  return Math.min(1, Math.max(0, (cosineSimilarity(leftVector, rightVector) + 1) / 2));
};

export const iconVectorItems = (options = {}) => {
  const entries = iconEntries().filter(([, icon]) => icon.type === 'emoji');
  const emojis = entries.map(([, icon]) => icon.glyph);
  return buildEmojiVectorItems({
    emojis,
    vectors: emojis.map((glyph) => semanticEmojiVector(glyph, options)),
    provider: semanticVectorModel().provider,
    model: semanticVectorModel().model,
    ...options,
  }).map((item, index) => {
    const [key, icon] = entries[index];
    return {
      key,
      semantic: icon.semantic,
      ...item,
    };
  });
};
