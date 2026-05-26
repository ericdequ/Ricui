import { tokens, iconography, emojiCatalog, getEmoji } from '@ric/ui';

if (!tokens || !iconography || !emojiCatalog || getEmoji('success') !== '✅') {
  throw new Error('Unified package imports failed validation.');
}

console.log('Unified package imports validated.');
