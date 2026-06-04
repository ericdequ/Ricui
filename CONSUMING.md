# Consuming `@ric/*` via git (no npm registry)

Use the shared UI library straight from GitHub — **no npm publish, no registry
dependency**. Ricui is public, so this needs no auth for installs (including in
CI / Vercel). Verified with pnpm 11.

## The catch, and the fix

Ricui is a monorepo (`packages/@ric-*`), and a git dep can only point at a
subdirectory via pnpm's `#path:` syntax. The umbrella `@ric/ui` also depends on
the other `@ric/*` packages by version range (`^0.1.0`) — which would hit npm.
So the consumer **overrides every `@ric/*` to its git subdir**. This lives
entirely in the consumer; Ricui stays clean and npm-ready.

## Add to a consumer's `package.json` (e.g. BEV)

```jsonc
{
  "dependencies": {
    "@ric/ui": "github:ericdequ/Ricui#path:packages/ui"
  },
  "pnpm": {
    "overrides": {
      "@ric/ui-tokens": "github:ericdequ/Ricui#path:packages/ui-tokens",
      "@ric/emoji":     "github:ericdequ/Ricui#path:packages/emoji",
      "@ric/icons":     "github:ericdequ/Ricui#path:packages/icons",
      "@ric/map-ui":    "github:ericdequ/Ricui#path:packages/map-ui",
      "@ric/ui-core":   "github:ericdequ/Ricui#path:packages/ui-core",
      "@ric/places":    "github:ericdequ/Ricui#path:packages/places",
      "@ric/meetups":   "github:ericdequ/Ricui#path:packages/meetups",
      "@ric/chat":      "github:ericdequ/Ricui#path:packages/chat",
      "@ric/ui":        "github:ericdequ/Ricui#path:packages/ui"
    }
  }
}
```

```bash
pnpm install
```

`#path:packages/ui` tracks the default branch. For **reproducible builds, pin a
commit**:

```
github:ericdequ/Ricui#8e79f9f6b06cb4074d25cacc7cac5ac41a320d59&path:packages/ui
```

(Bump the SHA to adopt a new release. Same form in every override.)

## Use it

```js
import { tokens, resolveTone, RSVP, CHAT_SCOPE } from '@ric/ui';          // contracts/tokens
import { Pill, Toggle, Modal, PlaceCard, MeetupCard } from '@ric/ui/react'; // components
```

Then migrate the consumer's local UI to re-export shims (see
[`UI/MIGRATION.md`](UI/MIGRATION.md)) — e.g. BEV `src/ui/Toggle.jsx` becomes
`export { Toggle } from '@ric/ui-core/react'`, so every existing `@/ui/X` import
resolves to the shared library with zero call-site churn.

## Notes

- **Public repos** (Ricui, Arcade, waves_worx) install with no auth — works in
  Vercel/CI out of the box. **Private repos** (TST, CapacitoRidge) need a
  GitHub token in the CI environment to git-install.
- This is fully compatible with the npm path: when you later `npm run
  publish:all`, drop the overrides and switch the dep to a normal `^0.1.0`
  range. Nothing in Ricui changes either way.
