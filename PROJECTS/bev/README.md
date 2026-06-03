BEV is the pilot project for Ricui map UI extraction.

## Map UI migration target

- Import shared map families, glyph hierarchy, legends, panel models, and map
  action contracts from `@ric/ui`.
- Keep BEV domain data in BEV; promote reusable map chrome and semantic glyph
  rules into `@ric/map-ui`.
- Current BEV map variants covered by Ricui: nightlife, Spot/here-now,
  Hathlo soundscape, Sports pickup, Energia/Camino, Ecology Dex, ConTech,
  Sesh Senate, and world rendering.

## Acceptance

- Every map family has a main unicode glyph.
- Every subtype, such as baseball under sports, has its own subtype glyph.
- `npm test` verifies package imports and map UI coverage before migration work
  is considered ready.
