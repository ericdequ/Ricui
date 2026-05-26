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
