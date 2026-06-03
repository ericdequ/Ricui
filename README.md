# Ricui

Unified UI and iconography workspace for RIC projects.  
All shared design primitives live here and are published as `@ric/*` npm packages.

## Workspace packages

| Package | Description |
|---|---|
| `@ric/ui-tokens` | Design tokens — colors, spacing, typography, shadows, motion, z-index; dark / light / brand themes |
| `@ric/ui-core` | Component contracts (button, card, modal, nav, table, toast …) and accessibility baseline |
| `@ric/icons` | 40+ semantic icons (emoji-backed) with alias look-up helpers |
| `@ric/emoji` | Unicode emoji catalog keyed by semantic name, with search helper |
| `@ric/ui` | Single import entrypoint for all of the above; also exposes sub-path exports for tree-shaking |

## Getting started

```bash
npm install
npm test          # validates all package imports (22 checks)
```

## Using the packages in an app

```bash
npm install @ric/ui
```

```js
// Everything from one import:
import { tokens, themes, iconography, getIcon, emojiCatalog, getEmoji, components } from '@ric/ui';

// Or tree-shake with sub-paths:
import { tokens, themes }    from '@ric/ui/tokens';
import { iconography }       from '@ric/ui/icons';
import { emojiCatalog }      from '@ric/ui/emoji';
import { components }        from '@ric/ui/core';
```

## Publishing packages

```bash
npm run publish:all      # publish every @ric/* package
npm run version:patch    # bump patch version across all packages
```

## Governance

See `UI/GOVERNANCE.md`.  BEV is the pilot app — new abstractions start there before entering the shared catalog.  
New icon / component proposals use `UI/COMPONENT_PROPOSAL_TEMPLATE.md`.

