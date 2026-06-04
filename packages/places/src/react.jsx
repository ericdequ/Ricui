// =============================================================================
// @ric/places/react — generic, prop-driven place field components
// =============================================================================
// Each component takes RESOLVED VALUES (a string address, a number rating, an
// isOpen boolean) — never a domain object. An app maps its own record to a
// PlaceView (see ./index.js) once, then reuses every component for any place
// kind: bar, restaurant, park, venue, event.
//
// Icons arrive as props (`icon`) with text-free fallbacks, so the package
// carries no icon-pack dependency. Every component null-renders when its value
// is absent (strict-addition principle).
// =============================================================================

import { cx } from '@ric/ui-core';
import { Card, Pill, StatusDot } from '@ric/ui-core/react';

import {
  formatDistance,
  formatPriceLevel,
  formatRating,
  getPlaceKind,
  resolvePlaceState,
} from './index.js';

/** Place name with optional kind-accent. @param {{name?:string, kind?:string, className?:string, as?:any}} props */
export function PlaceName({ name, kind, className, as: Tag = 'h3' }) {
  if (!name) return null;
  return <Tag className={cx('truncate font-semibold text-white', className)}>{name}</Tag>;
}

/** Address one-liner. @param {{address?:string, icon?:any, clamp?:1|2|3, className?:string}} props */
export function PlaceAddress({ address, icon, clamp = 2, className }) {
  if (!address) return null;
  const clampClass = clamp === 1 ? 'line-clamp-1' : clamp === 3 ? 'line-clamp-3' : 'line-clamp-2';
  return (
    <div className={cx('flex items-start gap-1.5 text-xs text-white/80', className)}>
      {icon ? <span className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/70">{icon}</span> : null}
      <span className={cx('leading-snug', clampClass)}>{address}</span>
    </div>
  );
}

/**
 * Star rating + optional review count. Compact single-star or `pill` shell.
 * @param {{rating?:number, reviewCount?:number, pill?:boolean, size?:'sm'|'md'|'lg', className?:string}} props
 */
export function PlaceRating({ rating, reviewCount, pill, size = 'md', className }) {
  const value = formatRating(rating);
  if (!value) return null;
  const body = (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true" className="text-amber-300">★</span>
      <span className="font-semibold text-white">{value}</span>
      {reviewCount ? <span className="text-white/60">({reviewCount})</span> : null}
    </span>
  );
  if (pill) {
    return (
      <Pill tone="amber" size={size} className={className} aria-label={`Rated ${value} out of 5`}>
        {body}
      </Pill>
    );
  }
  return <span className={cx('text-xs', className)} aria-label={`Rated ${value} out of 5`}>{body}</span>;
}

const STATE_META = {
  open: { tone: 'emerald', label: 'Open', pulse: true },
  closed: { tone: 'rose', label: 'Closed', pulse: false },
  temp: { tone: 'rose', label: 'Temporarily closed', pulse: true },
};

/**
 * Open / closed / temporarily-closed indicator. `chip` renders the translucent
 * over-photo style; default renders an inline dot + label.
 * @param {{isOpen?:boolean, isTemporarilyClosed?:boolean, chip?:boolean, size?:'sm'|'md'|'lg', className?:string}} props
 */
export function PlaceStatus({ isOpen, isTemporarilyClosed, chip, size = 'md', className }) {
  const state = resolvePlaceState({ isOpen, isTemporarilyClosed });
  if (!state) return null;
  const meta = STATE_META[state];
  if (chip) {
    return (
      <Pill tone={meta.tone} size={size} className={cx('uppercase tracking-wide', className)} role="status" aria-label={meta.label}>
        <StatusDot tone={meta.tone} pulse={meta.pulse} />
        {meta.label}
      </Pill>
    );
  }
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-xs font-medium text-white/85', className)} role="status" aria-label={meta.label}>
      <StatusDot tone={meta.tone} pulse={meta.pulse} />
      {meta.label}
    </span>
  );
}

/**
 * Type tags. Uses the place-kind registry tone when `kind` is supplied.
 * @param {{types?:string[], kind?:string, max?:number, size?:'xs'|'sm'|'md', className?:string}} props
 */
export function PlaceTypes({ types, kind, max = 3, size = 'sm', className }) {
  if (!types?.length) return null;
  const tone = getPlaceKind(kind)?.tone || 'slate';
  const shown = types.slice(0, max);
  return (
    <div className={cx('flex flex-wrap gap-1', className)}>
      {shown.map((t) => (
        <Pill key={t} tone={tone} size={size}>{t}</Pill>
      ))}
      {types.length > max ? <Pill tone="slate" size={size}>+{types.length - max}</Pill> : null}
    </div>
  );
}

/** Distance chip. @param {{distanceMeters?:number, imperial?:boolean, icon?:any, className?:string}} props */
export function PlaceDistance({ distanceMeters, imperial, icon, className }) {
  const label = formatDistance(distanceMeters, { imperial });
  if (!label) return null;
  return (
    <span className={cx('inline-flex items-center gap-1 text-xs text-white/70', className)}>
      {icon ? <span className="h-3.5 w-3.5">{icon}</span> : null}
      {label}
    </span>
  );
}

/** Price level. @param {{priceLevel?:number, className?:string}} props */
export function PlacePrice({ priceLevel, className }) {
  const label = formatPriceLevel(priceLevel);
  if (!label) return null;
  return (
    <span className={cx('text-xs font-semibold text-emerald-300', className)} aria-label={`Price level ${label.length} of 4`}>
      {label}
    </span>
  );
}

/**
 * Slot-based place card. Fans a resolved `place` (PlaceView) into the field
 * components, but every region is a slot you can override or extend:
 *   • `media`   — top media (image, map, photo wall).
 *   • `actions` — footer action row (like, RSVP, share — domain-owned).
 *   • children  — extra body content under the default field stack.
 * This is the only place a `place` object is accepted, and it just maps the
 * already-resolved view onto the prop-driven field components — no domain
 * knowledge, so a bar, restaurant, or park card is the same component.
 *
 * @param {object} props
 * @param {import('./index.js').PlaceView} props.place
 * @param {import('react').ReactNode} [props.media]
 * @param {import('react').ReactNode} [props.actions]
 * @param {boolean} [props.imperial]
 * @param {() => void} [props.onOpen]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export function PlaceCard({ place = {}, media, actions, imperial, onOpen, className, children }) {
  return (
    <Card
      media={media}
      onClick={onOpen}
      className={className}
      header={
        <div className="flex items-start justify-between gap-2">
          <PlaceName name={place.name} kind={place.kind} />
          <PlaceStatus isOpen={place.isOpen} isTemporarilyClosed={place.isTemporarilyClosed} />
        </div>
      }
      footer={actions}
    >
      <PlaceAddress address={place.address} />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <PlaceRating rating={place.rating} reviewCount={place.reviewCount} />
        <PlacePrice priceLevel={place.priceLevel} />
        <PlaceDistance distanceMeters={place.distanceMeters} imperial={imperial} />
      </div>
      <PlaceTypes types={place.types} kind={place.kind} />
      {children}
    </Card>
  );
}
