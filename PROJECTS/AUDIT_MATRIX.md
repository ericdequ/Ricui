# Cross-repo UI and icon audit matrix

| Project | Status | UI inventory | Token usage | Icon usage | Emoji usage | Duplicates found | Proposed `@ric/*` mapping |
|---|---|---|---|---|---|---|---|
| bev | inventory captured (pilot) | 94 `.jsx` in `src/ui/` — ~27 portable primitives + ~30 domain-bound; + map shell/panels/legends/action buttons → `@ric/map-ui` | `src/ui/icons/tokens.js` (frozen icon-size + tone tables) + Tailwind `theme.extend.colors` palette + `src/styles/system/{glass,motion}.js` | 30 icon modules in `src/ui/Icons/` (24 heroBev set, `BevVectorIcon`, `brand`, `vectorRegistry.generated`, 1 social); `BrandGradient`+`useId()` in 3; map family/subtype glyphs in `@ric/map-ui` | 4 files use raw emoji literals (`BevErrorBoundary`, `venue/BarPageLink`, `FriendsPrimitives/avatar`, `meetup/MeetupStatus`) | Within-BEV drift already audited+collapsed (see [[feedback_blocking_styles_drift]], [[feedback_shared_ui_first]]); cross-repo dupes pending peer inventory | See appendix below |
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

---

## BEV inventory appendix (pilot)

Captured from `src/ui/` on 2026-06-03. The split rule: **chrome-agnostic primitives lift; domain-bound components stay in BEV and compose the lifted primitives.** This mirrors BEV's own venue/meetup/customSpot design-system boundary — those compose `<Pill>`/`<IconButton>` etc., which are the parts that travel.

### → `@ric/ui-core` (portable primitives, lift in pilot)

Chrome-agnostic, no BEV domain knowledge. These are the real implementations behind the `ui-core` contract stub (`button`/`input`/`badge` shapes):

- **Actions:** `Button.jsx`, `ButtonGroup.jsx`, `IconButton.jsx`, `Toggle.jsx`
- **Chips/badges:** `Pill.jsx`, `CountBadge.jsx`, `StatPill.jsx`, `StatusBanner.jsx`
- **Surfaces/overlays:** `Modal.jsx`, `BottomSheet.jsx`, `GlassPanel.jsx`, `Toast.jsx`
- **Layout/state:** `SectionHeader.jsx`, `StateCard.jsx`, `PageStates.jsx`, `StaticPageShell.jsx`, `StepProgressBar.jsx`
- **Lists/pagination:** `VirtualizedList.jsx`, `ResultRow.jsx`, `PaginationControls.jsx`, `PaginationDot.jsx`, `TabPrimitives.jsx`
- **Forms:** `form/Input.jsx`, `form/Textarea.jsx`, `form/FieldFeedback.jsx`
- **Feedback/boundaries:** `Loading.jsx`, `BevErrorBoundary.jsx`, `SectionErrorBoundary.jsx`
- **Misc reusable:** `StarRating.jsx`, `ProfileAvatarImage.jsx`, `ExperiencePrimitives.jsx`

### → `@ric/ui-tokens`

- `src/ui/icons/tokens.js` — frozen icon-size scales (`BUTTON_ICON_SIZE` etc.) + semantic-variant→tone map shared by Button/IconButton/Pill. **This is the canonical token module to lift first.**
- Tailwind `theme.extend.colors` — the per-color canonical-shade palette (purple/violet/.../indigo + slate-as-gray rules). Needs extraction to a framework-neutral token object so `@ric/ui-tokens` is the source and Tailwind consumes it (not vice-versa).
- `src/styles/system/glass.js` + `motion.js` — glass surface + motion tokens (already JS objects, lift cleanly).

### → `@ric/icons`

- `src/ui/Icons/` — 24-glyph `heroBev/` set (bespoke, brand-idiom; `_makeIcon.jsx` factory + `solid.jsx`/`fallbacks.jsx`), `BevVectorIcon.jsx`, `brand.jsx` (`BrandGradient` + `useId()` pattern), `vectorIcons.jsx`, `vectorRegistry.generated.jsx`, `social/XSocialIcon.jsx`.
- The `_makeIcon` factory + `BrandGradient`/`useId()` + standalone-`.svg`-twin discipline is the reusable contract — lift the factory and authoring convention, not just the glyphs.

### → `@ric/emoji`

- Only 4 files carry raw emoji literals today; BEV does **not** yet have a semantic-emoji catalog. **Action:** harvest the in-use glyphs into the `@ric/emoji` catalog with semantic keys, then replace the 4 literal sites with `getEmoji('...')`. This catalog is also the grounding vocabulary TST consumes (emoji→meaning before embedding) — coordinate keys with the TST repo.

### → `@ric/places` + `@ric/meetups` + `@ric/chat` (generalized — built 2026-06-03)

**Design shift from the original "stays in BEV" plan.** BEV's `venue/*` and
`meetup/*` were already place-generic in spirit (their copy literally says
"this venue is open") — only their *data resolution* was bar-coupled. So the
**presentation lifts** to new place-agnostic packages and **BEV keeps a thin
`bar → PlaceView` adapter**:

- `@ric/places` ← the generic field set behind `venue/*` (Name/Address/Rating/Status/Types/Distance/Price + slot `PlaceCard`) + a place-kind registry so bar/restaurant/park/venue all reuse it.
- `@ric/meetups` ← the locked RSVP + `Invited→Going→On My Way→Here` lifecycle + `MeetupTime/Status/Attendees/MeetupCard` (a meetup at *any* place).
- `@ric/chat` ← scope-driven, transport-agnostic chat shell (BEV's meetup/public scopes generalize to an open scope registry).

See [`../UI/ADAPTERS.md`](../UI/ADAPTERS.md) for the adapter pattern.

### → `@ric/map-ui` (built — node-safe map registry)

Shared map UI families, glyph hierarchy, legends, panel models, and map action
contracts. Pure-JS / node-safe (no `/react`), so it rides the same barrel
contract surface as places/meetups/chat. Glyph keys use the TST composite-key
format (`field@djn4k5e#baseball`) — map UI, places, and TST grounding share one
vocabulary. Covers BEV map variants: nightlife, Spot/here-now, Hathlo
soundscape, Sports pickup, Energia/Camino, Ecology Dex, ConTech, Sesh Senate,
world rendering.

### Genuinely stays in BEV (bar-specific data + branded chrome)

The `bar → *View` **adapters** (`getBarShapeAddress` resolution, bar schema),
`customSpot/*` (OwnerControls), `CustomSpotBadge.jsx`, `AddressLink.jsx`,
`maps/MapStyleMenu.jsx`, `FriendsPrimitives/*`, `interactions/*`, and
`BevLoadingScreen.jsx` (BEV-branded). These supply resolved props to / wrap the
lifted generic components.

### Pilot acceptance criteria

1. `@ric/ui-tokens` exports the real icon-size + palette tokens; BEV imports them back (no local copy).
2. ≥3 portable primitives (start: `Pill`, `IconButton`, `CountBadge`) ship from `@ric/ui-core` and BEV imports them via `@ric/ui`.
3. `@ric/icons` exposes the `_makeIcon` factory + `BrandGradient`; BEV's `Icons/` re-exports from it.
4. `scripts/verify-imports.mjs` stays green; BEV `pnpm lint` stays green ([[feedback_lint_not_full_build]]).
5. No BEV behavior/visual change — extraction is a move, not a rewrite ([[feedback_refactor_dont_delete]]).
