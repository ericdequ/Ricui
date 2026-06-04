# Migrating BEV's `src/ui/` into the shared library

Goal: BEV's entire `src/ui/` folder (~94 components) lives in `@ric/*` and BEV
imports it back — so every RIC project shares one UI library. This is the
playbook.

## The mechanism: lift-and-reexport

For each component, two moves keep BEV working the whole way:

1. **Lift** the component into the right `@ric/*` package, **de-BEV'd**:
   - replace `@/…` imports (no `@/domain`, `@/lib`, app context)
   - icons arrive as props, not imported icon packs
   - framer-motion → CSS micro-interactions (`active:`/`group-hover:`/`motion-reduce:`)
   - keep the a11y (roles, aria, focus rings) intact
2. **Re-export shim** in BEV: `src/ui/Toggle.jsx` becomes
   ```js
   export { Toggle } from '@ric/ui-core/react';
   ```
   Every existing `import { Toggle } from '@/ui/Toggle'` in BEV keeps working —
   no call-site churn. Delete the shim later once imports are repointed.

Domain-bound components (`venue/*`, `meetup/*`, `customSpot/*`) **do not lift** —
they compose the shared primitives and stay in BEV (see `PROJECTS/AUDIT_MATRIX.md`).

## The decision that gates everything: how BEV resolves `@ric/*`

BEV is a separate repo; the eco repos are separate too. Pick one (this is a
one-time architectural call):

| Option | What | Trade-off |
|--------|------|-----------|
| **npm publish** | publish `@ric/*` to npm; BEV `npm i @ric/ui` | clean versioned deps; needs an npm org + a release flow |
| **file: dependency** | BEV `package.json`: `"@ric/ui": "file:../eco/Ricui/packages/ui"` | zero publish; brittle for clones that don't have `eco/` alongside |
| **monorepo** | move the eco repos into a BEV workspace (pnpm workspace) | one install, instant linking; couples the repos' release cadence |

The same question was answered for the Go side by publishing `waves_worx/go`
and having BEV `require` it. The JS equivalent is **npm publish** — recommended
for the same reasons (versioned, clone-safe, decoupled cadence).

## Wave plan (dependency order)

1. **Tokens** — `@ric/ui-tokens` (done; the real `tokens.js` + palette source).
2. **Core primitives** — `@ric/ui-core/react`: Pill, Badge, IconButton, Card,
   StatusDot (done) → Toggle, Input, Textarea, FieldFeedback, SectionHeader,
   StatusBanner (this wave) → Modal, BottomSheet, Toast, Tabs, Pagination,
   StarRating, VirtualizedList, boundaries (next).
3. **Icons** — `@ric/icons`: the `_makeIcon` factory + `BrandGradient`.
4. **Domain systems** stay in BEV, recomposed onto the shared primitives.

Each wave: lift → shim → `npm test` (contract) green → repoint BEV imports →
drop shims.

## Per-component checklist

- [ ] no `@/…` imports; props instead of app context
- [ ] icons as props; framer-motion → CSS
- [ ] a11y preserved (role/aria/focus)
- [ ] exported from the package's `/react` entry
- [ ] BEV re-export shim added (or import repointed)
- [ ] contract test green
