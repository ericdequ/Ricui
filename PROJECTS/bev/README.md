# bev (pilot mirror)

BEV is the **pilot source** for the `@ric/*` extraction. Its `src/ui/` is the
most drift-audited UI layer across RIC projects, so the real implementations
behind the `@ric/ui-core` / `@ric/ui-tokens` / `@ric/icons` contract stubs come
from here first.

## Inventory

Full captured inventory + `@ric/*` mapping lives in
[`../AUDIT_MATRIX.md`](../AUDIT_MATRIX.md) → "BEV inventory appendix".

Snapshot (2026-06-03):

- **94** `.jsx` components in `src/ui/` — ~27 portable primitives, ~30 domain-bound.
- **Tokens:** `src/ui/icons/tokens.js` (frozen icon-size + tone tables) + Tailwind palette + `styles/system/{glass,motion}.js`.
- **Icons:** 30 modules in `src/ui/Icons/` (24-glyph bespoke `heroBev` set + `BrandGradient`/`useId()` factory).
- **Emoji:** no semantic catalog yet — 4 raw-literal sites to harvest into `@ric/emoji`.

## Extraction order (pilot)

1. `@ric/ui-tokens` ← `tokens.js` + palette (everything else depends on tokens).
2. `@ric/icons` ← `_makeIcon` factory + `BrandGradient`.
3. `@ric/ui-core` ← `Pill` / `IconButton` / `CountBadge` first, then the rest.
4. BEV imports them **back** via `@ric/ui` — extraction is a move, not a fork.

## Boundary rule

Chrome-agnostic primitives lift. Domain-bound components (`venue/*`,
`meetup/*`, `customSpot/*`) **stay in BEV** and compose the lifted primitives —
the same boundary BEV's own design systems already draw.

## Map UI migration target (`@ric/map-ui`)

- Import shared map families, glyph hierarchy, legends, panel models, and map
  action contracts from `@ric/ui`.
- Keep BEV domain data in BEV; promote reusable map chrome and semantic glyph
  rules into `@ric/map-ui`.
- Current BEV map variants covered by Ricui: nightlife, Spot/here-now, Hathlo
  soundscape, Sports pickup, Energia/Camino, Ecology Dex, ConTech, Sesh Senate,
  and world rendering.
- Map glyph keys use the TST composite-key format (`field@djn4k5e#baseball`),
  keeping map UI, places, and TST grounding on one vocabulary.

### Map UI acceptance

- Every map family has a main unicode glyph.
- Every subtype (e.g. baseball under sports) has its own subtype glyph.
- `npm test` verifies package imports **and** map UI coverage before migration
  work is considered ready.
