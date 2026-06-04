# Publishing `@ric/*` to npm

The shared UI library publishes as scoped public packages so any RIC project —
BEV included — can `pnpm add @ric/ui` instead of vendoring components.

## One-time

1. Auth + scope (verified working for `ricuvedo`: the `ric` org exists and you
   own it, so `@ric/*` is yours to publish):
   ```bash
   npm login
   npm whoami            # ricuvedo
   npm org ls ric        # you = owner
   ```
   Every package declares `publishConfig.access = "public"`, so scoped
   publishing won't be blocked as private.

2. **Clear the 2FA-on-writes block.** Accounts default to `auth-and-writes`,
   which demands a one-time code for *every* publish — fatal for a 9-package
   loop. Pick one (all keep 2FA on your login):

   **A. Set 2FA to authorization-only (simplest — one code, then done):**
   ```bash
   npm profile set two-factor-auth auth-only --otp=<6 digits from your app>
   npm run publish:all
   ```
   **B. Use a bypass-2FA token (best for CI / repeat releases):** at
   npmjs.com → Access Tokens, create a **Granular** token (Read+Write, packages
   scope `@ric`, "Bypass two-factor authentication" enabled) *or* a classic
   **Automation** token, then:
   ```bash
   npm config set //registry.npmjs.org/:_authToken <token>
   npm run publish:all
   ```
   **C. Per-run code (tedious):** `npm run publish:all -- --otp=<6 digits>` —
   the code is consumed per package, so re-run with a fresh code to resume
   (already-published packages are skipped).

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
