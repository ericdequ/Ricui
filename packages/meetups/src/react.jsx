// =============================================================================
// @ric/meetups/react — meetup-at-a-place components
// =============================================================================
// Prop-driven; composes @ric/places for the place portion and @ric/ui-core
// for chrome. A meetup at a bar, a park, or a gallery is the same component —
// only the PlaceView passed in differs.
// =============================================================================

import { PlaceAddress,PlaceName } from '@ric/places/react';
import { cx } from '@ric/ui-core';
import { Card, Pill, StatusDot } from '@ric/ui-core/react';

import { formatMeetupTime, MEETUP_STATE_META, resolveMeetupState } from './index.js';

/**
 * Relative start time. Pass `now` (epoch ms) so the component stays pure and
 * the consumer controls the clock / re-render cadence.
 * @param {{startsAt?:number, now:number, icon?:any, className?:string}} props
 */
export function MeetupTime({ startsAt, now, icon, className }) {
  const label = formatMeetupTime(startsAt, now);
  if (!label) return null;
  return (
    <span className={cx('inline-flex items-center gap-1 text-xs font-medium text-white/85', className)}>
      {icon ? <span className="h-3.5 w-3.5 text-white/70">{icon}</span> : null}
      {label}
    </span>
  );
}

/**
 * Display-state badge: Invited → Going → On My Way → Here.
 * @param {{state?:string, rsvp?:string, isHere?:boolean, isEnRoute?:boolean, size?:'xs'|'sm'|'md', className?:string}} props
 */
export function MeetupStatus({ state, rsvp, isHere, isEnRoute, size = 'sm', className }) {
  const resolved = state || resolveMeetupState({ rsvp, isHere, isEnRoute });
  const meta = MEETUP_STATE_META[resolved];
  if (!meta) return null;
  return (
    <Pill tone={meta.tone} size={size} className={className} role="status" aria-label={meta.label}>
      <StatusDot tone={meta.tone === 'meetup' ? 'sky' : meta.tone} pulse={resolved === 'here'} />
      {meta.label}
    </Pill>
  );
}

/**
 * Overlapping attendee avatars + overflow count.
 * @param {{attendees?:Array<{id:string,name?:string,avatarUrl?:string}>, max?:number, size?:number, className?:string}} props
 */
export function MeetupAttendees({ attendees, max = 4, size = 28, className }) {
  if (!attendees?.length) return null;
  const shown = attendees.slice(0, max);
  const overflow = attendees.length - shown.length;
  return (
    <div className={cx('flex items-center', className)} aria-label={`${attendees.length} attending`}>
      {shown.map((a, i) => (
        <span
          key={a.id}
          className="relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-slate-900 bg-slate-700 text-[10px] font-semibold text-white"
          style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -size / 3, zIndex: shown.length - i }}
        >
          {a.avatarUrl ? (
             
            <img src={a.avatarUrl} alt={a.name || ''} className="h-full w-full object-cover" />
          ) : (
            (a.name || '?').slice(0, 1).toUpperCase()
          )}
        </span>
      ))}
      {overflow > 0 ? (
        <span
          className="relative inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-slate-600 text-[10px] font-semibold text-white"
          style={{ width: size, height: size, marginLeft: -size / 3 }}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Slot-based meetup card. Composes the place identity + time + status +
 * attendees; `actions` and children are slots for domain-owned controls
 * (RSVP buttons, chat entry, share).
 *
 * @param {object} props
 * @param {import('./index.js').MeetupView} props.meetup
 * @param {number} props.now - epoch ms.
 * @param {import('react').ReactNode} [props.actions]
 * @param {() => void} [props.onOpen]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export function MeetupCard({ meetup = {}, now, actions, onOpen, className, children }) {
  const place = meetup.place || {};
  return (
    <Card
      onClick={onOpen}
      className={className}
      header={
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <PlaceName name={place.name} kind={place.kind} as="h3" />
            <PlaceAddress address={place.address} clamp={1} className="mt-0.5" />
          </div>
          <MeetupStatus state={meetup.state} rsvp={meetup.rsvp} />
        </div>
      }
      footer={actions}
    >
      <div className="flex items-center justify-between gap-2">
        <MeetupTime startsAt={meetup.startsAt} now={now} />
        <MeetupAttendees attendees={meetup.attendees} />
      </div>
      {meetup.note ? <p className="text-xs text-white/70">{meetup.note}</p> : null}
      {children}
    </Card>
  );
}
