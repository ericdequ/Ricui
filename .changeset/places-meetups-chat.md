---
"@ric/ui-tokens": minor
"@ric/ui-core": minor
"@ric/places": minor
"@ric/meetups": minor
"@ric/chat": minor
"@ric/ui": minor
---

Generalize the design system beyond bars. Real token implementations
(icon-size scales, canonical tones, role palette, Tailwind preset) lifted from
BEV; new prop-driven primitives (`Pill`, `Badge`, `IconButton`, `Card`,
`StatusDot`); and three place-agnostic domain packages — `@ric/places`
(place fields + kind registry), `@ric/meetups` (RSVP/lifecycle, meetup-at-a-
place), and `@ric/chat` (scope-driven, transport-agnostic). Components take
resolved view shapes so any place kind (bar/restaurant/park/venue) reuses them
via a thin adapter.
