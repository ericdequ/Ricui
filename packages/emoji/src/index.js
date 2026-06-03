export const emojiCatalog = {
  success: '\u2705',
  warning: '\u26A0\uFE0F',
  error: '\u274C',
  info: '\u2139\uFE0F',
  robot: '\u{1F916}',
  legal: '\u2696\uFE0F',
  blog: '\u{1F4DD}',
  package: '\u{1F4E6}',
  launch: '\u{1F680}',
  spark: '\u2728',
  map: '\u{1F5FA}\uFE0F',
  nightlife: '\u{1F378}',
  sports: '\u{1F3DF}\uFE0F',
  baseball: '\u26BE',
  soundscape: '\u{1F3B5}',
  energia: '\u{1F4AB}',
  ecology: '\u{1F30E}',
  contech: '\u{1F3D7}\uFE0F',
  seshSenate: '\u{1F451}',
};

export function getEmoji(key, fallback = '\u2728') {
  return emojiCatalog[key] ?? fallback;
}
