import { tokens, iconography, emojiCatalog, getEmoji } from '@ric/ui';

const hasTokenColor = Boolean(tokens?.color?.primary);
const hasIcons = Object.keys(iconography ?? {}).length > 0;
const hasEmoji = Object.keys(emojiCatalog ?? {}).length > 0;
const hasExpectedSemantic = getEmoji('success') === '✅';

if (!hasTokenColor || !hasIcons || !hasEmoji || !hasExpectedSemantic) {
  throw new Error('Unified package imports failed validation.');
}

console.log('Unified package imports validated.');
