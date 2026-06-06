# @ric/emoji-vectors

Emoji ↔ unicode ↔ **feature-vector space**. A symbol is the bit-for-byte champion
of carrying meaning — one glyph grounds a complex vibe that humans and machines
both read instantly. This package turns any emoji (or a composed string like
`📍🍺`) into a continuous vector, compares two by cosine, and projects a set to
2-D so the space can be **displayed and visualized**.

Companion to [`@ric/tst`](../../TST): TST grounds a record in **space · time ·
type** *before* it is vector-embedded here. Extends [`@ric/emoji`](../emoji)'s
named glyph catalog with a feature space.

## Install

```sh
npm i @ric/emoji-vectors   # peer: react (only for /react)
```

## Core (pure, dependency-free, node-safe)

```js
import {
  emojiVector,         // 🍺 → 32-d unit vector (composes "📍🍺")
  emojiSimilarity,     // cosine in [0,1]
  describeEmojiGlyph,  // human meaning (curated + open-vocabulary fallback)
  buildEmojiVectorItems, // plottable items with a 2-D `direction`
  buildEmojiComparisons, // all pairwise cosines
} from '@ric/emoji-vectors';

emojiSimilarity('🍺', '🍻');   // ~ high (both drinking/social)
describeEmojiGlyph('📍🍻');     // { type:'emoji-string', components:[pin, meetup], ... }
buildEmojiVectorItems({ emojis, vectors, includeVector: false }); // plot, drop full vectors
```

Vectors come from a deterministic **codepoint-wave fallback** (open-vocabulary,
offline). To upgrade to real semantics, embed `buildEmojiEmbeddingText(glyph)`
with any model and pass the vectors into `buildEmojiVectorItems({ emojis, vectors })`.

## Catalog bridge — `@ric/emoji-vectors/catalog`

```js
import { vectorForKey, similarityForKeys, catalogVectorItems } from '@ric/emoji-vectors/catalog';
similarityForKeys('nightlife', 'sports'); // vectorize @ric/emoji named keys
```

## Visualize — `@ric/emoji-vectors/react`

```jsx
import { EmojiVectorScatter } from '@ric/emoji-vectors/react';
<EmojiVectorScatter emojis={['🍺','🍻','⛳','🔥','📍']} selected={['🍺']} />
```

Renders each glyph as a direction on a unit disc (pure SVG, themeable via `accent`).

## Semantic bake — `@ric/emoji-vectors/baked`

The core's default vectors are a deterministic codepoint-wave: open-vocabulary
and offline, but **not semantic** (🍺 and 🍻 aren't truly "close"). Bake real
model embeddings once and ship them static:

```sh
OPENAI_API_KEY=sk-... npm run bake          # writes src/baked.data.js
# options: --emojis "🍺🍻⛳🔥📍👬🎸" --model text-embedding-3-small --dimensions 256

# the whole emoji vocabulary (~1,800 glyphs), int8-quantized + batched:
OPENAI_API_KEY=sk-... npm run bake -- --all-emoji --dimensions 256 --quantize int8
# ~0.15¢ to embed; a few hundred KB gzipped at 256-d int8.
```

Then prefer baked vectors, with the codepoint-wave space as a graceful fallback
for any glyph the bake didn't cover (fallbacks generated at the baked
dimensionality, so every vector compares length-aligned):

```js
import { semanticEmojiVector, isBaked } from '@ric/emoji-vectors/baked';
isBaked();                       // false until you bake
semanticEmojiVector('🍺');       // baked vector → compose components → fallback
semanticEmojiVector('🍺⛳');      // mean of baked 🍺 + ⛳ when both are baked
```

The bake is provider-agnostic by response shape (`{data:[{index,embedding}]}`)
and compresses via the model's `dimensions` param so the static table stays small.

## Hosted endpoint (internal) — `@ric/emoji-vectors/serve`

Bake the quantized all-emoji table once, then serve it from one place
(e.g. **robotric.org**) so every app fetches the same vectors — no per-app key,
no per-app bake. The handler is a framework-agnostic `Request → Response`:

```js
// Next App Router — app/api/emoji-vectors/route.js
import { createEmojiVectorsHandler } from '@ric/emoji-vectors/serve';
import { BAKED } from '@ric/emoji-vectors/baked';
export const GET = createEmojiVectorsHandler({
  table: BAKED,                       // the baked (int8) table
  token: process.env.EMOJI_VECTORS_TOKEN, // internal gate (optional)
});
```

```js
// Cloudflare Worker
import { emojiVectorsResponse } from '@ric/emoji-vectors/serve';
import { BAKED } from '@ric/emoji-vectors/baked';
export default { fetch: (req) => emojiVectorsResponse(req, { table: BAKED, token: TOKEN }) };
```

Routes:

```
GET /api/emoji-vectors                 full quantized table (+ count, metadata)
GET /api/emoji-vectors?emojis=🍺🍻⛳     server-side subset
GET /api/emoji-vectors?format=float    dequantized floats
Authorization: Bearer <token>          internal gate (or ?token=)
```

Consume from any app (dequantizes int8 → float, then use the core):

```js
import { fetchBakedVectors, semanticEmojiVector } from '@ric/emoji-vectors/baked';
const table = await fetchBakedVectors('https://robotric.org/api/emoji-vectors', {
  token: process.env.EMOJI_VECTORS_TOKEN,
});
semanticEmojiVector('🍺🏌️', { table }); // real semantic vector, fetched once + cached
```

Bakes are **mean-centered by default** (`@ric/emoji-vectors/center`, `--no-center`
to skip): embedding models compress every cosine into a narrow high band, so
subtracting the global mean direction widens the margins (🍺~🍻 0.88→0.57,
🍺~⛳ 0.83→0.32) while preserving ranking.

## Names — global meaning, tiered for the whole code-point space

A name for *any* code point, sized by **store only what can't be derived**:

| layer | covers | size | how |
|---|---|---|---|
| emoji names (`./names`) | ~1.9k emoji | ~18 KB gz, bundled | CLDR names + group |
| algorithmic (`./unicode`) | ~120k chars (CJK, Hangul, …) | **~0.8 KB** bundled | a *rule*, not a table |
| explicit (`./unicode`, lazy) | ~40k named chars | ~265 KB gz, `loadUnicodeNames()` | UCD table, dynamic-imported |
| vectors (`./baked`) | the meaningful subset (emoji) | ~518 KB gz, **fetched + cached** | never bundled |

```js
import { algorithmicName, unicodeName, describeCodepoint, loadUnicodeNames } from '@ric/emoji-vectors/unicode';
algorithmicName('中');            // 'CJK UNIFIED IDEOGRAPH-4E2D'  (no data loaded)
algorithmicName('김');            // 'HANGUL SYLLABLE GIM'         (derived, no data)
const names = await loadUnicodeNames();
unicodeName('a', { names });      // 'LATIN SMALL LETTER A'        (lazy explicit table)
describeCodepoint('✓', { names }); // { hex:'U+2713', name:'CHECK MARK', source:'explicit', … }
```

Regenerate from the UCD (Unicode 17.0): `npm run build-unicode` (names) · `npm run build-names` (emoji).

> Vectors stay scoped to the *meaningful* subset — embedding all ~160k assigned
> chars would be ~41 MB of mostly-useless vectors. Names cover everything; vectors
> cover what's worth comparing.

## Improving

Gaps to close as this gets used (extend the lib, don't work around it):

- **Named, interpretable axes.** Offer a small hand-tuned basis
  (energy/social/intimacy/novelty/activity) as an alternative to opaque dims.
- **Compositional roles.** `📍🍺` = bar-spot vs `👬🍺` = friend check-in: parse by
  role (place/container/event/actor) so a string decodes to a structured signal —
  e.g. a BLE-header-sized payload.
- **Multi-codepoint glyphs / ZWJ sequences** in `codepointsForGlyph` round-trips.

A Go port (`BEV/GO/get`) mirrors `describe`/`prompt`/fallback-vector and is pinned
to this lib by a golden fixture (`GO/get/testdata/parity.json`, regenerated from
the canonical JS), so the two implementations cannot silently drift.
