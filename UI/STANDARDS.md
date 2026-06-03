# RIC UI standards (v1)

## Naming
- Components: `PascalCase` (e.g., `PrimaryButton`)
- Tokens: semantic keys (e.g., `color.primary`, `spacing.md`)
- Icons/emoji keys: lowercase semantic names (e.g., `success`, `warning`, `robot`, `legal`)

## Accessibility baseline
- Color contrast target: WCAG AA
- Keyboard focus indicators are required
- Decorative icons must be `aria-hidden`
- Semantic icons must include accessible labels

## Theming
- Shared themes: `light`, `dark`, `brand`
- Tokens map to semantic values, not hardcoded product names

## Map UI
- Map families must expose a main unicode glyph and subtype glyphs.
- Canonical map records stay data-first; UI packages provide render contracts.
- Shared map actions use stable ids such as `map.open-place` and `map.toggle-layer`.
- Project-specific map experiments should promote reusable chrome, legends, and glyph rules into `@ric/map-ui`.
