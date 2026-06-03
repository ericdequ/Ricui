// =============================================================================
// @ric/meetups (contract) — a meetup AT a place
// =============================================================================
// A meetup is "a plan to be at a place at a time, with people." Nothing about
// that is bar-specific — it's the pregame for any place kind. This package
// owns the RSVP + display-state vocabulary (lifted from BEV's locked meetup
// model) and time/attendee formatters; ./react.jsx renders them, composing
// @ric/places for the place portion.
//
// RSVP is the firm intent (yes/no/pending). DISPLAY STATE is the richer
// lifecycle a UI shows as the event approaches and presence is detected:
//   Invited → Going → On My Way → Here.
//
// Pure JS, node-safe. React lives in ./react.jsx ("@ric/meetups/react").
// =============================================================================

/** Firm RSVP intent. */
export const RSVP = Object.freeze({ YES: 'yes', NO: 'no', PENDING: 'pending' });

/** Display lifecycle (ordered). */
export const MEETUP_STATE = Object.freeze({
  INVITED: 'invited',
  GOING: 'going',
  ON_MY_WAY: 'on_my_way',
  HERE: 'here',
});

export const MEETUP_STATE_ORDER = Object.freeze([
  MEETUP_STATE.INVITED,
  MEETUP_STATE.GOING,
  MEETUP_STATE.ON_MY_WAY,
  MEETUP_STATE.HERE,
]);

export const MEETUP_STATE_META = Object.freeze({
  invited: { label: 'Invited', tone: 'slate' },
  going: { label: 'Going', tone: 'meetup' },
  on_my_way: { label: 'On My Way', tone: 'sky' },
  here: { label: 'Here', tone: 'emerald' },
});

/**
 * @typedef {Object} MeetupView
 * @property {import('@ric/places').PlaceView} [place] - Where it's happening.
 * @property {number} [startsAt]   - epoch ms.
 * @property {string} [rsvp]       - one of RSVP.*
 * @property {string} [state]      - one of MEETUP_STATE.*
 * @property {Array<{id:string,name?:string,avatarUrl?:string}>} [attendees]
 * @property {string} [note]
 */

/**
 * Derive the display state from RSVP + flags, when not explicitly set. Keeps
 * the lifecycle logic in one place so every surface agrees.
 * @param {{rsvp?:string, isHere?:boolean, isEnRoute?:boolean}} m
 * @returns {string}
 */
export function resolveMeetupState({ rsvp, isHere, isEnRoute } = {}) {
  if (isHere) return MEETUP_STATE.HERE;
  if (isEnRoute) return MEETUP_STATE.ON_MY_WAY;
  if (rsvp === RSVP.YES) return MEETUP_STATE.GOING;
  return MEETUP_STATE.INVITED;
}

/**
 * Relative-time label for a start timestamp. Self-contained (no date lib).
 * @param {number} startsAt - epoch ms.
 * @param {number} now      - epoch ms (caller passes; keeps this pure/testable).
 * @returns {string}
 */
export function formatMeetupTime(startsAt, now) {
  if (startsAt == null) return '';
  const diffMin = Math.round((startsAt - now) / 60000);
  if (diffMin <= -60) return 'Earlier today';
  if (diffMin < 0) return 'Now';
  if (diffMin < 1) return 'Now';
  if (diffMin < 60) return `in ${diffMin} min`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `in ${diffHr} hr`;
  const diffDay = Math.round(diffHr / 24);
  return `in ${diffDay} day${diffDay > 1 ? 's' : ''}`;
}
