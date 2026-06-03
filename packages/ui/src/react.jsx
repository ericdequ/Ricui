// =============================================================================
// @ric/ui/react — single React entrypoint
// =============================================================================
// Re-exports every component from the @ric/* React surfaces. Import from here
// in app code (bundler transpiles JSX); import the node-safe contracts/tokens
// from "@ric/ui".
// =============================================================================

export * from '@ric/ui-core/react';
export * from '@ric/places/react';
export * from '@ric/meetups/react';
export * from '@ric/chat/react';
