# Publishing `@ric/*` to npm

The shared UI library publishes as scoped public packages so any RIC project —
BEV included — can `pnpm add @ric/ui` instead of vendoring components.

## One-time

1. The `@ric` scope must exist on npm and you must be a member:
   ```bash
   npm login
   npm whoami                      # confirm you're authed
   npm org ls @ric 2>/dev/null     # (or create the @ric org at npmjs.com)
   ```
   Every package already declares `publishConfig.access = "public"`, so scoped
   publishing won't be blocked as private.

## Release

1. Bump versions with Changesets (scaffolded in `.changeset/`):
   ```bash
   npx changeset            # describe the change, pick semver bumps
   npx changeset version    # writes new versions + changelogs
   npm install              # refresh the lockfile
   npm test                 # contract test must pass
   ```
2. Publish all packages in dependency order:
   ```bash
   npm run publish:all              # leaves first; skips already-published
   npm run publish:all -- --dry-run # preview without publishing
   ```

`scripts/publish.mjs` publishes `ui-tokens → emoji → icons → map-ui → ui-core →
places → meetups → chat → ui`, so no dependent publishes before its deps.

## Consuming from BEV (pnpm)

Once published:

```bash
pnpm add @ric/ui                 # the umbrella, or individual packages
```

```js
import { tokens, RSVP } from '@ric/ui';          // node-safe contracts/tokens
import { Pill, Toggle, PlaceCard } from '@ric/ui/react'; // components
```

Then migrate BEV `src/ui/*` to re-export shims (see `UI/MIGRATION.md`) so every
existing `@/ui/X` import resolves to the shared library with zero call-site
churn.

> Until the first publish, local development resolves `@ric/*` through the npm
> workspace in this repo. BEV picks them up only after a real publish (or a
> `file:`/workspace link for local-only experiments).
