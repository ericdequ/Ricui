# BEV — Pilot Integration Guide

BEV is the pilot application for `@ric/*` design-system abstractions.
Per governance policy, BEV is the first app to consume every new shared component
or icon before it graduates to the main catalog.

## Installing the shared UI packages

```bash
npm install @ric/ui
# or install sub-packages individually:
npm install @ric/ui-tokens @ric/ui-core @ric/icons @ric/emoji
```

## Import patterns

### Single unified import (recommended for most files)

```js
import { tokens, themes, iconography, getIcon, emojiCatalog, getEmoji, components } from '@ric/ui';
```

### Sub-path imports (tree-shake friendly)

```js
import { tokens, themes }                from '@ric/ui/tokens';
import { iconography, getIcon }          from '@ric/ui/icons';
import { emojiCatalog, getEmoji }        from '@ric/ui/emoji';
import { components, accessibilityBaseline } from '@ric/ui/core';
```

## Key exports

| Export | Package | Description |
|---|---|---|
| `tokens` | `@ric/ui-tokens` | Design tokens — colors, spacing, typography, motion, z-index |
| `themes` | `@ric/ui-tokens` | Named theme maps: `dark`, `light`, `brand` |
| `components` | `@ric/ui-core` | Component contracts: button, card, modal, nav, table, toast … |
| `accessibilityBaseline` | `@ric/ui-core` | WCAG AA rules applied to all components |
| `iconography` | `@ric/icons` | 40+ semantic icons; each carries `glyph` + `semantic[]` aliases |
| `getIcon(alias)` | `@ric/icons` | Look up an icon by semantic alias |
| `findIconsByTag(...tags)` | `@ric/icons` | Find icon keys matching any tag |
| `emojiCatalog` | `@ric/emoji` | Unicode emoji keyed by semantic name |
| `getEmoji(key, fallback)` | `@ric/emoji` | Safe emoji accessor with fallback |
| `findEmoji(...terms)` | `@ric/emoji` | Search catalog keys by substring |

## Adding a new icon/emoji

1. Propose it in `UI/COMPONENT_PROPOSAL_TEMPLATE.md`
2. Add the entry to `packages/icons/src/index.js` and/or `packages/emoji/src/index.js`
3. Run `npm test` to confirm import validation passes
4. Bump the affected package version and open a PR
