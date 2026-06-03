Unified UI source of truth for all RIC projects.

See `UI/STANDARDS.md` for naming, accessibility, and theming rules.

Map UI contracts live in `@ric/map-ui` and are re-exported from `@ric/ui`.
BEV is the pilot source for map families, glyph hierarchy, legends, and
map-action contracts that future RIC projects should import instead of
duplicating local map chrome.
