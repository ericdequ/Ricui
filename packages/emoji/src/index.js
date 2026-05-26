export const emojiCatalog = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  robot: '🤖',
  legal: '⚖️',
  blog: '📝',
  package: '📦',
  launch: '🚀',
  spark: '✨'
};

export function getEmoji(key, fallback = '✨') {
  return emojiCatalog[key] ?? fallback;
}
