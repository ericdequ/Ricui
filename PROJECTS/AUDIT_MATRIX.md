# Cross-repo UI and icon audit matrix

| Project | Status | UI inventory | Token usage | Icon usage | Emoji usage | Duplicates found | Proposed `@ric/*` mapping |
|---|---|---|---|---|---|---|---|
| bev | in-progress (pilot) | map shell, panels, legends, action buttons | shared tokens via `@ric/ui` target | map/icon actions to `@ric/icons` | map family and subtype glyphs in `@ric/map-ui` | local BEV map chrome and glyph registries | migrate reusable map UI contracts to `@ric/map-ui` |
| blogs | queued | pending | pending | pending | pending | pending | pending |
| ric | queued | pending | pending | pending | pending | pending | pending |
| legalet | queued | pending | pending | pending | pending | pending | pending |
| wcs | queued | pending | pending | pending | pending | pending | pending |
| lswd | queued | pending | pending | pending | pending | pending | pending |
| robot | queued | pending | pending | pending | pending | pending | pending |

## Audit method
1. Inventory components, tokens, icons, and emoji per repo.
2. Flag duplicates and near-duplicates.
3. Map each item to existing or proposed `@ric/*` modules.
4. Record migration blockers and acceptance criteria.
