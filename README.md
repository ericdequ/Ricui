# Ricui

Unified UI and iconography workspace for RIC projects. Built for **places —
not just bars**: a bar, restaurant, park, café, or venue all render the same
field set, so the components take resolved values and each app supplies a thin
adapter.

## Workspace packages

**Foundation**

- `@ric/ui-tokens` — design tokens (icon sizes, tones, role palette, motion) + a Tailwind preset (`@ric/ui-tokens/tailwind`)
- `@ric/ui-core` — generic primitives: `Pill`, `Badge`, `IconButton`, `Card`, `StatusDot` (`@ric/ui-core/react`)
- `@ric/icons` — shared icon catalog
- `@ric/emoji` — unicode emoji catalog used as semantic icons
- `@ric/emoji-vectors` — open-vocabulary Unicode emoji descriptions,
  deterministic fallback vectors, similarity, and 2-D projection helpers

**Domain (place-agnostic)**

- `@ric/places` — generic place fields: `PlaceName/Address/Rating/Status/Types/Distance/Price` + slot-based `PlaceCard`, a place-kind registry, and formatters
- `@ric/meetups` — a meetup *at a place*: RSVP + lifecycle (`Invited → Going → On My Way → Here`), `MeetupTime/Status/Attendees/MeetupCard`
- `@ric/chat` — scope-driven, transport-agnostic chat: `ChatThread/Message/Composer` + scope registry

**Entrypoint**

- `@ric/ui` — single import for all the above

## Two import surfaces

Contracts/tokens are pure JS (node-safe). Components are JSX under a `/react`
subpath so node tooling never needs a transform.

```js
import { tokens, resolveTone, RSVP, CHAT_SCOPE } from '@ric/ui';          // anywhere
import { PlaceCard, MeetupCard, ChatThread, Pill } from '@ric/ui/react';  // bundler
```

## The "more than bars" pattern

Components take **resolved values**, never a domain object. Each app maps its
record to a `PlaceView` once:

```js
// BEV
const placeView = (bar) => ({
  name: bar.name, address: getBarShapeAddress(bar), kind: 'bar',
  rating: bar.rating, isOpen: bar.open, types: bar.categories,
});

// A restaurants venture — same components, different adapter
const placeView = (r) => ({
  name: r.title, address: r.formattedAddress, kind: 'restaurant',
  rating: r.stars, priceLevel: r.price, isOpen: r.openNow,
});
```

See [`UI/ADAPTERS.md`](UI/ADAPTERS.md) for the full guide.

Additional map package:

- `@ric/map-ui` - shared map UI families, glyph hierarchy, legends, actions, and panel contracts

## Getting started

```bash
npm install
npm test   # node-safe contract smoke test (no JSX transform needed)
```

## Tailwind

Components emit standard hue classes, so they render in any Tailwind app. Add
the preset to unlock the `role-*` palette + gradients:

```js
import { ricTailwindPreset } from '@ric/ui-tokens/tailwind';
export default { presets: [ricTailwindPreset], content: [/* … */] };
```

## Improving this library

This library is meant to keep getting **better and more versatile through use**.
When you adopt it in a project and hit a gap — a missing variant, an awkward
API, a pattern worth generalizing — don't work around it locally:

1. Note it under **Usage learnings** below (or open an issue on this repo).
2. When the value is clear, **extend the library** (new export / variant / game /
   contract), add a test, then update the consumer. Prefer composition over
   variant sprawl, and keep it tested.

### Usage learnings

- _(append discoveries here as the library gets used — date + project + the change)_
