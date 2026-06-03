/**
 * @ric/icons — semantic icon catalog for all RIC projects.
 *
 * Each entry carries:
 *   type     — 'emoji' | 'svg-id' (future SVG sprite support)
 *   glyph    — unicode emoji (or SVG symbol id)
 *   semantic — array of semantic aliases for look-up
 */
export const iconography = {
  // Status
  check:    { type: 'emoji', glyph: '✅', semantic: ['success', 'done', 'approved', 'check'] },
  warning:  { type: 'emoji', glyph: '⚠️', semantic: ['warning', 'attention', 'caution'] },
  error:    { type: 'emoji', glyph: '❌', semantic: ['error', 'fail', 'rejected'] },
  info:     { type: 'emoji', glyph: 'ℹ️', semantic: ['info', 'information', 'help'] },
  pending:  { type: 'emoji', glyph: '🕐', semantic: ['pending', 'waiting', 'in-progress'] },
  blocked:  { type: 'emoji', glyph: '🚫', semantic: ['blocked', 'forbidden', 'stop'] },

  // Actions
  deploy:   { type: 'emoji', glyph: '🚀', semantic: ['release', 'launch', 'deploy', 'publish'] },
  edit:     { type: 'emoji', glyph: '✏️', semantic: ['edit', 'modify', 'update'] },
  delete:   { type: 'emoji', glyph: '🗑️', semantic: ['delete', 'remove', 'trash'] },
  copy:     { type: 'emoji', glyph: '📋', semantic: ['copy', 'clipboard', 'duplicate'] },
  download: { type: 'emoji', glyph: '⬇️', semantic: ['download', 'export', 'save'] },
  upload:   { type: 'emoji', glyph: '⬆️', semantic: ['upload', 'import'] },
  share:    { type: 'emoji', glyph: '🔗', semantic: ['share', 'link', 'connect'] },
  search:   { type: 'emoji', glyph: '🔍', semantic: ['search', 'find', 'lookup'] },
  filter:   { type: 'emoji', glyph: '🔽', semantic: ['filter', 'sort', 'refine'] },
  refresh:  { type: 'emoji', glyph: '🔄', semantic: ['refresh', 'reload', 'sync'] },
  settings: { type: 'emoji', glyph: '⚙️', semantic: ['settings', 'config', 'preferences'] },
  close:    { type: 'emoji', glyph: '✖️', semantic: ['close', 'dismiss', 'cancel'] },
  add:      { type: 'emoji', glyph: '➕', semantic: ['add', 'create', 'new'] },

  // Navigation
  home:     { type: 'emoji', glyph: '🏠', semantic: ['home', 'dashboard', 'start'] },
  back:     { type: 'emoji', glyph: '◀️', semantic: ['back', 'previous', 'left'] },
  forward:  { type: 'emoji', glyph: '▶️', semantic: ['forward', 'next', 'right'] },
  menu:     { type: 'emoji', glyph: '☰',  semantic: ['menu', 'hamburger', 'nav'] },
  external: { type: 'emoji', glyph: '↗️', semantic: ['external', 'open-new', 'out'] },

  // Domains
  robot:    { type: 'emoji', glyph: '🤖', semantic: ['automation', 'assistant', 'ai', 'bot'] },
  legal:    { type: 'emoji', glyph: '⚖️', semantic: ['legal', 'policy', 'compliance', 'law'] },
  blog:     { type: 'emoji', glyph: '📝', semantic: ['blog', 'article', 'post', 'write'] },
  package:  { type: 'emoji', glyph: '📦', semantic: ['package', 'module', 'library', 'npm'] },
  spark:    { type: 'emoji', glyph: '✨', semantic: ['spark', 'new', 'magic', 'featured'] },
  lock:     { type: 'emoji', glyph: '🔒', semantic: ['lock', 'secure', 'private', 'auth'] },
  unlock:   { type: 'emoji', glyph: '🔓', semantic: ['unlock', 'public', 'open'] },
  user:     { type: 'emoji', glyph: '👤', semantic: ['user', 'person', 'account', 'profile'] },
  team:     { type: 'emoji', glyph: '👥', semantic: ['team', 'group', 'users', 'org'] },
  calendar: { type: 'emoji', glyph: '📅', semantic: ['calendar', 'date', 'schedule', 'event'] },
  chart:    { type: 'emoji', glyph: '📊', semantic: ['chart', 'analytics', 'stats', 'metrics'] },
  code:     { type: 'emoji', glyph: '💻', semantic: ['code', 'dev', 'engineering', 'terminal'] },
  cloud:    { type: 'emoji', glyph: '☁️', semantic: ['cloud', 'storage', 'remote', 'server'] },
  key:      { type: 'emoji', glyph: '🔑', semantic: ['key', 'api-key', 'token', 'credential'] },
  bell:     { type: 'emoji', glyph: '🔔', semantic: ['bell', 'notification', 'alert'] },
  star:     { type: 'emoji', glyph: '⭐', semantic: ['star', 'favorite', 'bookmark', 'rate'] },
  flag:     { type: 'emoji', glyph: '🚩', semantic: ['flag', 'feature-flag', 'milestone'] }
};

/**
 * Look up an icon by semantic alias. Returns the first match or null.
 * @param {string} alias
 * @returns {{ type: string, glyph: string, semantic: string[] } | null}
 */
export function getIcon(alias) {
  const lower = alias.toLowerCase();
  for (const icon of Object.values(iconography)) {
    if (icon.semantic.includes(lower)) return icon;
  }
  return null;
}

/**
 * Return all icon keys that match any of the provided semantic tags.
 * @param {...string} tags
 * @returns {string[]}
 */
export function findIconsByTag(...tags) {
  const lower = tags.map(t => t.toLowerCase());
  return Object.entries(iconography)
    .filter(([, icon]) => icon.semantic.some(s => lower.includes(s)))
    .map(([key]) => key);
}
