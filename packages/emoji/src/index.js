export const emojiCatalog = {
  // Status
  success: '✅',
  warning: '⚠️',
  error:   '❌',
  info:    'ℹ️',
  pending: '🕐',
  blocked: '🚫',

  // Actions
  robot:    '🤖',
  deploy:   '🚀',
  delete:   '🗑️',
  copy:     '📋',
  download: '⬇️',
  upload:   '⬆️',
  share:    '🔗',
  search:   '🔍',
  filter:   '🔽',
  refresh:  '🔄',
  settings: '⚙️',
  close:    '✖️',
  add:      '➕',

  // Domains
  legal:    '⚖️',
  blog:     '📝',
  package:  '📦',
  spark:    '✨',
  lock:     '🔒',
  unlock:   '🔓',
  user:     '👤',
  team:     '👥',
  calendar: '📅',
  chart:    '📊',
  code:     '💻',
  cloud:    '☁️',
  key:      '🔑',
  bell:     '🔔',
  star:     '⭐',
  flag:     '🚩',
  home:     '🏠',
  external: '↗️'
};

/**
 * Return the emoji glyph for a semantic key.
 * @param {string} key
 * @param {string} [fallback='✨']
 * @returns {string}
 */
export function getEmoji(key, fallback = '✨') {
  return emojiCatalog[key] ?? fallback;
}

/**
 * Return all catalog keys that contain any of the provided substrings.
 * @param {...string} terms
 * @returns {string[]}
 */
export function findEmoji(...terms) {
  const lower = terms.map(t => t.toLowerCase());
  return Object.keys(emojiCatalog).filter(k => lower.some(t => k.includes(t)));
}
