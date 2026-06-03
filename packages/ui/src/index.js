// Single import entrypoint for all RIC UI packages.
// Import everything from one place:
//   import { tokens, themes, iconography, getIcon, emojiCatalog, getEmoji, components } from '@ric/ui';
// Or use sub-path exports for tree-shaking:
//   import { tokens } from '@ric/ui/tokens';
//   import { iconography } from '@ric/ui/icons';

export { tokens, themes } from '@ric/ui-tokens';
export { components, accessibilityBaseline } from '@ric/ui-core';
export { iconography, getIcon, findIconsByTag } from '@ric/icons';
export { emojiCatalog, getEmoji, findEmoji } from '@ric/emoji';
