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
export { components, accessibilityBaseline, cx, toneChipClass } from '@ric/ui-core';

// Icons + emoji catalogs
export { iconography } from '@ric/icons';
export { emojiCatalog, getEmoji } from '@ric/emoji';

// Domain contracts (node-safe — enums, registries, formatters)
export * from '@ric/places';
export * from '@ric/meetups';
export * from '@ric/chat';

// Map UI — families, glyph hierarchy, legends, panel/action contracts (node-safe)
export * from '@ric/map-ui';
