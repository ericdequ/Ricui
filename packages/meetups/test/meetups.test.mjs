import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MEETUP_STATE,
  MEETUP_STATE_META,
  MEETUP_STATE_ORDER,
  RSVP,
  formatMeetupTime,
  resolveMeetupState,
} from '../src/index.js';

test('@ric/meetups state machine is well-formed', () => {
  assert.equal(typeof MEETUP_STATE, 'object');
  assert.equal(typeof RSVP, 'object');
  assert.ok(Array.isArray(MEETUP_STATE_ORDER) && MEETUP_STATE_ORDER.length > 0);
  // every ordered state has metadata
  for (const state of MEETUP_STATE_ORDER) {
    assert.ok(MEETUP_STATE_META[state], `meta for ${state}`);
  }
  assert.equal(typeof formatMeetupTime, 'function');
  assert.equal(typeof resolveMeetupState, 'function');
});
