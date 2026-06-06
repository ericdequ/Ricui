// =============================================================================
// @ric/ui — single import entrypoint (node-safe contracts + tokens)
// =============================================================================
// This barrel re-exports only PURE-JS contracts, tokens, and helpers so it
// stays importable by node tooling (verify-imports, codegen) with no JSX
// transform. React components are re-exported from "@ric/ui/react".
//
//   import { tokens, resolveTone, RSVP, CHAT_SCOPE } from '@ric/ui';        // anywhere
//   import { Pill, PlaceCard, MeetupCard, ChatThread } from '@ric/ui/react'; // bundler
// =============================================================================

// Tokens
export * from '@ric/ui-tokens';

// Core contract + helpers
export { accessibilityBaseline, components, cx, toneChipClass } from '@ric/ui-core';

// Icons + emoji catalogs
export { emojiCatalog, getEmoji } from '@ric/emoji';
export {
  describeIcon,
  describeUnicodeIcon,
  iconMetadata,
  iconography,
  iconSimilarity,
  iconVector,
  iconVectorItems,
  listIcons,
} from '@ric/icons';

// Domain contracts (node-safe — enums, registries, formatters)
export * from '@ric/chat';
export * from '@ric/meetups';
export * from '@ric/places';

// Map UI — families, glyph hierarchy, legends, panel/action contracts (node-safe)
export * from '@ric/map-ui';
