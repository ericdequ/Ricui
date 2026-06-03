// =============================================================================
// @ric/places (contract) — the generic "place" vocabulary
// =============================================================================
// The insight behind making BEV reusable for MORE THAN BARS: a bar, a
// restaurant, a park, a venue, an event space all render the same handful of
// fields — name, address, rating, open/closed, types, distance, price. BEV's
// `venue/*` components already proved this (their copy literally says "this
// venue is open"); they were only ever coupled to bar-schema *resolution*.
//
// This package owns the place FIELD CONTRACT (the resolved-value shape every
// place type fills) and a PLACE-KIND REGISTRY (so an app declares its own
// kinds: bar/restaurant/park/…). Components in ./react.jsx take resolved
// values — never a domain object — so each app writes a thin adapter
// (`bar -> PlaceView`) and reuses every component unchanged.
//
// Pure JS, node-safe. React lives in ./react.jsx ("@ric/places/react").
// =============================================================================

/**
 * The canonical resolved place shape consumed by @ric/places/react. Every
 * field is optional; components null-render anything missing (strict-addition
 * principle — never break a layout because a place type lacks a field).
 *
 * @typedef {Object} PlaceView
 * @property {string} [name]
 * @property {string} [address]
 * @property {number} [rating]            - 0–5.
 * @property {number} [reviewCount]
 * @property {string[]} [types]           - Human-readable type tags.
 * @property {string} [kind]              - Registered place-kind key.
 * @property {number} [distanceMeters]
 * @property {number} [priceLevel]        - 0–4 ($ … $$$$).
 * @property {boolean} [isOpen]
 * @property {boolean} [isTemporarilyClosed]
 */

/** Open-state resolution shared by every status presentation. */
export const PLACE_STATE = Object.freeze({ OPEN: 'open', CLOSED: 'closed', TEMP: 'temp' });

/**
 * @param {{isOpen?: boolean, isTemporarilyClosed?: boolean}} place
 * @returns {'open'|'closed'|'temp'|null}
 */
export function resolvePlaceState({ isOpen, isTemporarilyClosed } = {}) {
  if (isTemporarilyClosed) return PLACE_STATE.TEMP;
  if (isOpen === true) return PLACE_STATE.OPEN;
  if (isOpen === false) return PLACE_STATE.CLOSED;
  return null;
}

// --- Place-kind registry ---------------------------------------------------
// An app registers the kinds of place it deals in. The kind drives the accent
// tone + default label/icon, so "more than bars" is a data declaration, not a
// fork of the components.
const KINDS = new Map();

/**
 * Register (or override) a place kind.
 * @param {{key: string, label: string, icon?: import('react').ReactNode, tone?: string}} kind
 */
export function definePlaceKind(kind) {
  if (!kind?.key) throw new Error('definePlaceKind: `key` is required');
  KINDS.set(kind.key, { tone: 'default', ...kind });
  return kind;
}

/** @param {string} key @returns {{key:string,label:string,icon?:any,tone:string}|null} */
export function getPlaceKind(key) {
  return KINDS.get(key) || null;
}

export function listPlaceKinds() {
  return [...KINDS.values()];
}

// A couple of sensible defaults so the package is useful out of the box; apps
// extend or override via definePlaceKind.
definePlaceKind({ key: 'bar', label: 'Bar', tone: 'default' });
definePlaceKind({ key: 'restaurant', label: 'Restaurant', tone: 'amber' });
definePlaceKind({ key: 'cafe', label: 'Café', tone: 'amber' });
definePlaceKind({ key: 'park', label: 'Park', tone: 'emerald' });
definePlaceKind({ key: 'venue', label: 'Venue', tone: 'violet' });

// --- Formatters (generic, no domain coupling) ------------------------------

/**
 * Human distance. Metric by default; pass `imperial` for mi/ft.
 * @param {number} meters
 * @param {{imperial?: boolean}} [opts]
 * @returns {string}
 */
export function formatDistance(meters, { imperial = false } = {}) {
  if (meters == null || Number.isNaN(meters)) return '';
  if (imperial) {
    const feet = meters * 3.28084;
    if (feet < 1000) return `${Math.round(feet)} ft`;
    return `${(feet / 5280).toFixed(feet / 5280 < 10 ? 1 : 0)} mi`;
  }
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(meters / 1000 < 10 ? 1 : 0)} km`;
}

/**
 * Price level → `$`…`$$$$`. Returns '' for null/0-unknown.
 * @param {number} level - 0–4.
 * @returns {string}
 */
export function formatPriceLevel(level) {
  if (level == null || level <= 0) return '';
  return '$'.repeat(Math.min(4, Math.round(level)));
}

/**
 * Clamp + format a rating to one decimal.
 * @param {number} rating
 * @returns {string}
 */
export function formatRating(rating) {
  if (rating == null || Number.isNaN(rating)) return '';
  return Math.max(0, Math.min(5, rating)).toFixed(1);
}
