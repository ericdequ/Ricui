# Migration and adoption plan

## Rollout order
1. BEV pilot
2. blogs
3. ric
4. legalet
5. wcs
6. lswd
7. robot

## Migration rules
- Replace duplicated local UI first with `@ric/ui` imports.
- Move reusable project-specific components into `@ric/ui-core` only after pilot validation.
- Replace icon and emoji ad-hoc usage with `@ric/icons` and `@ric/emoji` semantic keys.

## Release/adoption
- Use Changesets for versioning policy.
- Publish `@ric/*` to npm.
- Track app migration status in `PROJECTS/AUDIT_MATRIX.md`.
