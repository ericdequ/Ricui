// =============================================================================
// @ric/chat (contract) — chat scoped to a place / meetup / public room
// =============================================================================
// "Chat at a place" is the same UI whether the scope is a public place room,
// a private meetup thread, or a global channel — only the scope and the
// message source differ. BEV runs two scopes today (meetup/public); this
// package keeps the scope an OPEN enum so a venture can add its own
// (place/event/dm/…) without forking the components.
//
// The components are TRANSPORT-AGNOSTIC: they render a list of messages and
// emit composer events. Where messages come from (Firestore, RTDB, a local
// mesh, websockets) is the app's concern — pass resolved messages in, handle
// `onSend` out.
//
// Pure JS, node-safe. React lives in ./react.jsx ("@ric/chat/react").
// =============================================================================

/** Built-in scopes; apps may register more via defineChatScope. */
export const CHAT_SCOPE = Object.freeze({
  PUBLIC: 'public',
  MEETUP: 'meetup',
  PLACE: 'place',
});

const SCOPES = new Map([
  [CHAT_SCOPE.PUBLIC, { key: 'public', label: 'Everyone here', tone: 'default' }],
  [CHAT_SCOPE.MEETUP, { key: 'meetup', label: 'Your meetup', tone: 'meetup' }],
  [CHAT_SCOPE.PLACE, { key: 'place', label: 'At this place', tone: 'violet' }],
]);

/**
 * Register or override a chat scope.
 * @param {{key:string,label:string,tone?:string}} scope
 */
export function defineChatScope(scope) {
  if (!scope?.key) throw new Error('defineChatScope: `key` is required');
  SCOPES.set(scope.key, { tone: 'default', ...scope });
  return scope;
}

/** @param {string} key */
export function getChatScope(key) {
  return SCOPES.get(key) || null;
}

export function listChatScopes() {
  return [...SCOPES.values()];
}

/**
 * @typedef {Object} ChatMessageView
 * @property {string} id
 * @property {string} [authorId]
 * @property {string} [authorName]
 * @property {string} [avatarUrl]
 * @property {string} text
 * @property {number} [sentAt]   - epoch ms.
 * @property {boolean} [mine]    - rendered as an outgoing bubble.
 * @property {boolean} [pending] - optimistic / unsent.
 */

/**
 * Whether `msg` continues the same author's run as `prev` (so the bubble can
 * drop the repeated avatar/name header). Direction must also match.
 * @param {ChatMessageView} [prev]
 * @param {ChatMessageView} [msg]
 * @returns {boolean}
 */
export function isSameAuthorRun(prev, msg) {
  if (!prev || !msg) return false;
  return Boolean(prev.authorId) && prev.authorId === msg.authorId && Boolean(prev.mine) === Boolean(msg.mine);
}
