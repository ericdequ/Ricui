# Adapters — making Ricui work for more than bars

Ricui components are **presentation-only**: they take resolved values, never a
domain record. The one piece each app owns is a tiny **adapter** that maps its
record to the Ricui view shape. That single seam is what lets a bar app, a
restaurant app, and a park-finder all reuse the same components.

```
domain record ──adapter──▶ PlaceView / MeetupView / ChatMessageView ──▶ @ric/* components
   (yours)        (yours)              (Ricui contract)                    (Ricui)
```

## 1. Register your place kinds

Kinds drive the accent tone + label. Declared once at app startup:

```js
import { definePlaceKind } from '@ric/places';

definePlaceKind({ key: 'rooftop', label: 'Rooftop', tone: 'violet' });
definePlaceKind({ key: 'brewery', label: 'Brewery', tone: 'amber' });
```

`bar / restaurant / cafe / park / venue` are seeded by default.

## 2. Write the adapter

```js
// BEV: bar -> PlaceView. The bar-schema coupling that used to live INSIDE the
// components now lives here, in one function.
import { getBarShapeAddress } from '@/domain/bars/schema';

export const barToPlaceView = (bar) => ({
  name: bar.name,
  address: getBarShapeAddress(bar),
  kind: 'bar',
  rating: bar.rating,
  reviewCount: bar.reviewCount,
  types: bar.categories,
  distanceMeters: bar.distanceMeters,
  isOpen: bar.open,
  isTemporarilyClosed: bar.tempClosed,
});
```

## 3. Render

```jsx
import { PlaceCard } from '@ric/ui/react';

<PlaceCard
  place={barToPlaceView(bar)}
  media={<BarPhoto bar={bar} />}        // app-owned slot
  actions={<LikeButton barId={bar.id} />} // app-owned slot
  onOpen={() => router.push(`/bar/${bar.geohash}`)}
/>
```

## Meetups — same idea, one level up

```js
import { resolveMeetupState } from '@ric/meetups';

export const toMeetupView = (m, presence) => ({
  place: barToPlaceView(m.bar),          // reuse the place adapter
  startsAt: m.startsAt,
  rsvp: m.myRsvp,
  state: resolveMeetupState({ rsvp: m.myRsvp, isHere: presence.here, isEnRoute: presence.enRoute }),
  attendees: m.going,
  note: m.note,
});
```

```jsx
import { MeetupCard } from '@ric/ui/react';
<MeetupCard meetup={toMeetupView(m, presence)} now={Date.now()} actions={<RsvpButtons id={m.id} />} />
```

> `now` is passed in (not read inside the component) so the component stays
> pure and the app controls the re-render cadence.

## Chat — scope in, messages in, `onSend` out

The components never know your transport (Firestore / RTDB / local mesh /
websocket). Resolve messages to `ChatMessageView`, hand them in, handle sends.

```jsx
import { ChatThread, ChatComposer, ChatScopeBadge } from '@ric/ui/react';
import { CHAT_SCOPE } from '@ric/ui';

<ChatScopeBadge scope={CHAT_SCOPE.MEETUP} />
<ChatThread scope={CHAT_SCOPE.MEETUP} messages={messages.map(toMessageView)} />
<ChatComposer onSend={(text) => sendMessage(meetupId, text)} />
```

Add scopes per venture with `defineChatScope({ key, label, tone })`.

## The rule

If you're tempted to pass a `bar` (or `restaurant`, or `event`) straight into a
Ricui component, stop — add the field to the relevant `*View` contract and
resolve it in your adapter instead. Keeping domain knowledge out of the
components is the whole reason they travel.
