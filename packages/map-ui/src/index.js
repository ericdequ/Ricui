export const MAP_UI_LIBRARY_VERSION = 'ric-map-ui-v1';

const freeze = (value) => Object.freeze(value);
const unique = (values = []) => freeze([...new Set(values.filter(Boolean))]);
const asSlug = (value, fallback = 'item') =>
  String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback;

const makeGlyph = ({
  id,
  glyph,
  label,
  fallback,
  parentId = '',
  groupId = '',
  aliases = [],
}) =>
  freeze({
    id,
    glyph,
    label,
    fallback,
    parentId,
    groupId: groupId || parentId || id,
    aliases: freeze(aliases),
  });

export const mapUiGlyphs = freeze({
  map: makeGlyph({
    id: 'map',
    glyph: '\u{1F5FA}\uFE0F',
    label: 'Map',
    fallback: 'map',
    groupId: 'map',
    aliases: ['map', 'spot', 'place'],
  }),
  hereNow: makeGlyph({
    id: 'here-now',
    glyph: '\u{1F4CD}',
    label: 'Here-now mark',
    fallback: 'here now',
    groupId: 'here-now',
    aliases: ['here-now', 'geocache', 'local-mark'],
  }),
  competition: makeGlyph({
    id: 'competition',
    glyph: '\u{1F3C6}',
    label: 'Competition',
    fallback: 'competition',
    parentId: 'here-now',
    groupId: 'here-now',
    aliases: ['competition', 'vote', 'leaderboard'],
  }),
  nightlife: makeGlyph({
    id: 'nightlife',
    glyph: '\u{1F378}',
    label: 'Nightlife',
    fallback: 'nightlife',
    groupId: 'nightlife',
    aliases: ['bar', 'bars', 'club', 'nightlife', 'pub'],
  }),
  pub: makeGlyph({
    id: 'pub',
    glyph: '\u{1F37A}',
    label: 'Pub or brewery',
    fallback: 'pub',
    parentId: 'nightlife',
    groupId: 'nightlife',
    aliases: ['pub', 'brewery', 'taproom', 'beer'],
  }),
  nightclub: makeGlyph({
    id: 'nightclub',
    glyph: '\u{1FAA9}',
    label: 'Nightclub',
    fallback: 'nightclub',
    parentId: 'nightlife',
    groupId: 'nightlife',
    aliases: ['club', 'nightclub', 'dance'],
  }),
  sports: makeGlyph({
    id: 'sports',
    glyph: '\u{1F3DF}\uFE0F',
    label: 'Sports field',
    fallback: 'sports field',
    groupId: 'sports',
    aliases: ['sports', 'field', 'court', 'pitch'],
  }),
  soccer: makeGlyph({
    id: 'sport-soccer',
    glyph: '\u26BD',
    label: 'Soccer',
    fallback: 'soccer',
    parentId: 'sports',
    groupId: 'sports',
    aliases: ['soccer', 'futbol'],
  }),
  basketball: makeGlyph({
    id: 'sport-basketball',
    glyph: '\u{1F3C0}',
    label: 'Basketball',
    fallback: 'basketball',
    parentId: 'sports',
    groupId: 'sports',
    aliases: ['basketball', 'hoops'],
  }),
  baseball: makeGlyph({
    id: 'sport-baseball',
    glyph: '\u26BE',
    label: 'Baseball or softball',
    fallback: 'baseball',
    parentId: 'sports',
    groupId: 'sports',
    aliases: ['baseball', 'softball', 'diamond'],
  }),
  football: makeGlyph({
    id: 'sport-football',
    glyph: '\u{1F3C8}',
    label: 'Football',
    fallback: 'football',
    parentId: 'sports',
    groupId: 'sports',
    aliases: ['football', 'american-football'],
  }),
  tennis: makeGlyph({
    id: 'sport-tennis',
    glyph: '\u{1F3BE}',
    label: 'Tennis',
    fallback: 'tennis',
    parentId: 'sports',
    groupId: 'sports',
    aliases: ['tennis'],
  }),
  pickleball: makeGlyph({
    id: 'sport-pickleball',
    glyph: '\u{1F3D3}',
    label: 'Pickleball',
    fallback: 'pickleball',
    parentId: 'sports',
    groupId: 'sports',
    aliases: ['pickleball', 'paddle'],
  }),
  volleyball: makeGlyph({
    id: 'sport-volleyball',
    glyph: '\u{1F3D0}',
    label: 'Volleyball',
    fallback: 'volleyball',
    parentId: 'sports',
    groupId: 'sports',
    aliases: ['volleyball'],
  }),
  soundscape: makeGlyph({
    id: 'soundscape',
    glyph: '\u{1F3B5}',
    label: 'Soundscape',
    fallback: 'soundscape',
    groupId: 'soundscape',
    aliases: ['soundscape', 'hathlo', 'music'],
  }),
  dj: makeGlyph({
    id: 'dj-mix',
    glyph: '\u{1F3A7}',
    label: 'DJ mix',
    fallback: 'dj mix',
    parentId: 'soundscape',
    groupId: 'soundscape',
    aliases: ['dj', 'mix', 'dj-mix'],
  }),
  film: makeGlyph({
    id: 'short-film',
    glyph: '\u{1F3AC}',
    label: 'Short film',
    fallback: 'short film',
    parentId: 'soundscape',
    groupId: 'soundscape',
    aliases: ['film', 'short-film', 'video'],
  }),
  art: makeGlyph({
    id: 'visual-art',
    glyph: '\u{1F3A8}',
    label: 'Visual art',
    fallback: 'visual art',
    parentId: 'soundscape',
    groupId: 'soundscape',
    aliases: ['art', 'visual-art', 'mural'],
  }),
  podcast: makeGlyph({
    id: 'podcast',
    glyph: '\u{1F399}\uFE0F',
    label: 'Podcast',
    fallback: 'podcast',
    parentId: 'soundscape',
    groupId: 'soundscape',
    aliases: ['podcast', 'spoken-word'],
  }),
  energia: makeGlyph({
    id: 'energia',
    glyph: '\u{1F4AB}',
    label: 'Energia',
    fallback: 'energia',
    groupId: 'energia',
    aliases: ['energia', 'camino', 'sacred-grid'],
  }),
  church: makeGlyph({
    id: 'church',
    glyph: '\u26EA',
    label: 'Church or cathedral',
    fallback: 'church',
    parentId: 'energia',
    groupId: 'energia',
    aliases: ['church', 'cathedral', 'worship'],
  }),
  albergue: makeGlyph({
    id: 'albergue',
    glyph: '\u{1F6CF}\uFE0F',
    label: 'Albergue',
    fallback: 'albergue',
    parentId: 'energia',
    groupId: 'energia',
    aliases: ['albergue', 'hostel', 'pilgrim-bed'],
  }),
  vortex: makeGlyph({
    id: 'energy-vortex',
    glyph: '\u{1F300}',
    label: 'Energy vortex',
    fallback: 'energy vortex',
    parentId: 'energia',
    groupId: 'energia',
    aliases: ['vortex', 'energy-vortex'],
  }),
  energyLine: makeGlyph({
    id: 'energy-line',
    glyph: '\u2728',
    label: 'Energy line',
    fallback: 'energy line',
    parentId: 'energia',
    groupId: 'energia',
    aliases: ['ley-line', 'dragon-line', 'songline', 'energy-line'],
  }),
  ecology: makeGlyph({
    id: 'ecology',
    glyph: '\u{1F30E}',
    label: 'Ecology Dex',
    fallback: 'ecology',
    groupId: 'ecology',
    aliases: ['ecology', 'dex', 'animalgo', 'edendex'],
  }),
  animal: makeGlyph({
    id: 'animal',
    glyph: '\u{1F43E}',
    label: 'Animal observation',
    fallback: 'animal',
    parentId: 'ecology',
    groupId: 'ecology',
    aliases: ['animal', 'animalgo'],
  }),
  plant: makeGlyph({
    id: 'plant',
    glyph: '\u{1F33F}',
    label: 'Plant observation',
    fallback: 'plant',
    parentId: 'ecology',
    groupId: 'ecology',
    aliases: ['plant', 'edendex'],
  }),
  contech: makeGlyph({
    id: 'contech',
    glyph: '\u{1F3D7}\uFE0F',
    label: 'ConTech',
    fallback: 'contech',
    groupId: 'contech',
    aliases: ['contech', 'construction'],
  }),
  jobsite: makeGlyph({
    id: 'jobsite',
    glyph: '\u{1F6A7}',
    label: 'Construction site',
    fallback: 'jobsite',
    parentId: 'contech',
    groupId: 'contech',
    aliases: ['jobsite', 'construction-site'],
  }),
  lidar: makeGlyph({
    id: 'lidar',
    glyph: '\u{1F4E1}',
    label: 'LiDAR scan',
    fallback: 'lidar',
    parentId: 'contech',
    groupId: 'contech',
    aliases: ['lidar', 'scan', 'point-cloud'],
  }),
  bim: makeGlyph({
    id: 'bim',
    glyph: '\u{1F9F1}',
    label: 'BIM or CAD layer',
    fallback: 'bim cad',
    parentId: 'contech',
    groupId: 'contech',
    aliases: ['bim', 'cad', 'autocad', 'trimble'],
  }),
  seshSenate: makeGlyph({
    id: 'sesh-senate',
    glyph: '\u{1F451}',
    label: 'Sesh Senate',
    fallback: 'sesh senate',
    groupId: 'sesh-senate',
    aliases: ['sesh-senate', 'regional-royalty'],
  }),
  cultureCrown: makeGlyph({
    id: 'culture-crown',
    glyph: '\u{1F451}',
    label: 'Culture crown',
    fallback: 'culture crown',
    parentId: 'sesh-senate',
    groupId: 'sesh-senate',
    aliases: ['culture-crown', 'royalty', 'king', 'queen'],
  }),
  inventor: makeGlyph({
    id: 'inventor',
    glyph: '\u{1F4A1}',
    label: 'Inventor title',
    fallback: 'inventor',
    parentId: 'sesh-senate',
    groupId: 'sesh-senate',
    aliases: ['inventor', 'innovation-title'],
  }),
  healer: makeGlyph({
    id: 'healer',
    glyph: '\u2695\uFE0F',
    label: 'Healer title',
    fallback: 'healer',
    parentId: 'sesh-senate',
    groupId: 'sesh-senate',
    aliases: ['healer', 'health-title'],
  }),
  renderer: makeGlyph({
    id: 'renderer',
    glyph: '\u{1F9F1}',
    label: 'Voxel renderer',
    fallback: 'renderer',
    groupId: 'renderer',
    aliases: ['voxel', 'renderer', 'building-paint'],
  }),
  satellite: makeGlyph({
    id: 'satellite',
    glyph: '\u{1F6F0}\uFE0F',
    label: 'Satellite view',
    fallback: 'satellite',
    parentId: 'renderer',
    groupId: 'renderer',
    aliases: ['satellite', 'imagery'],
  }),
});

const glyphList = freeze(Object.values(mapUiGlyphs));
const glyphById = new Map(glyphList.map((glyph) => [glyph.id, glyph]));
const glyphAliasToId = new Map();
const setGlyphAlias = (alias, id, { overwrite = false } = {}) => {
  const key = asSlug(alias, '');
  if (!key) return;
  if (overwrite || !glyphAliasToId.has(key)) {
    glyphAliasToId.set(key, id);
  }
};

for (const glyph of glyphList) {
  setGlyphAlias(glyph.id, glyph.id, { overwrite: true });
  setGlyphAlias(
    glyph.groupId,
    glyphById.has(glyph.groupId) ? glyph.groupId : glyph.id
  );
  for (const alias of glyph.aliases) {
    setGlyphAlias(alias, glyph.id);
  }
}

const makeFamily = ({ id, label, glyphId, route, variants = [], canDo = [] }) =>
  freeze({
    id,
    label,
    glyphId,
    route,
    variants: freeze(variants),
    canDo: freeze(canDo),
  });

export const mapUiFamilies = freeze([
  makeFamily({
    id: 'bev-nightlife',
    label: 'BEV nightlife',
    glyphId: 'nightlife',
    route: '/MapMB',
    variants: ['nightlife', 'pub', 'nightclub', 'renderer'],
    canDo: ['scan-nightlife', 'open-storefront', 'paint-building'],
  }),
  makeFamily({
    id: 'spot-core',
    label: 'Spot core and here-now social',
    glyphId: 'map',
    route: '/MapMB/features',
    variants: ['map', 'here-now', 'competition'],
    canDo: ['index-place', 'post-mark', 'vote-best-place'],
  }),
  makeFamily({
    id: 'hathlo-soundscape',
    label: 'Hathlo soundscape',
    glyphId: 'soundscape',
    route: '/MapMB/soundscape',
    variants: ['soundscape', 'dj-mix', 'short-film', 'visual-art', 'podcast'],
    canDo: ['geotag-creator-work', 'search-city-music', 'match-venues'],
  }),
  makeFamily({
    id: 'sports-pickup',
    label: 'Sports pickup',
    glyphId: 'sports',
    route: '/MapMB/sports',
    variants: [
      'soccer',
      'basketball',
      'baseball',
      'football',
      'tennis',
      'pickleball',
      'volleyball',
    ],
    canDo: ['search-fields', 'filter-by-sport', 'build-pickup-meetup'],
  }),
  makeFamily({
    id: 'energia-camino',
    label: 'Energia and Camino',
    glyphId: 'energia',
    route: '/MapMB/energia',
    variants: ['church', 'albergue', 'energy-vortex', 'energy-line'],
    canDo: ['map-sacred-sites', 'track-pilgrims', 'compare-research-layers'],
  }),
  makeFamily({
    id: 'ecology-dex',
    label: 'Ecology Dex',
    glyphId: 'ecology',
    route: '/MapMB/ecology',
    variants: ['animal', 'plant'],
    canDo: ['capture-observation', 'rank-species-candidates', 'show-dex'],
  }),
  makeFamily({
    id: 'contech-construction',
    label: 'ConTech construction',
    glyphId: 'contech',
    route: '/MapMB/contech',
    variants: ['jobsite', 'lidar', 'bim', 'satellite'],
    canDo: ['toggle-cad', 'toggle-lidar', 'review-jobsite'],
  }),
  makeFamily({
    id: 'sesh-senate',
    label: 'Sesh Senate',
    glyphId: 'sesh-senate',
    route: '/MapMB/seshsenate',
    variants: ['culture-crown', 'inventor', 'healer', 'competition'],
    canDo: ['nominate-region-role', 'vote-culture-title', 'show-leaderboard'],
  }),
  makeFamily({
    id: 'world-rendering',
    label: 'World rendering sandbox',
    glyphId: 'renderer',
    route: '/MapMB/world',
    variants: ['renderer', 'satellite', 'jobsite', 'nightlife'],
    canDo: ['show-3d-building', 'toggle-satellite', 'paint-voxel-facade'],
  }),
]);

export const mapUiComponentContracts = freeze({
  MapShell: freeze({
    role: 'application',
    slots: ['viewport', 'toolbar', 'legend', 'detailsPanel', 'timeline'],
    requiredProps: ['familyId', 'features', 'activeVariantId'],
  }),
  MapToolbar: freeze({
    role: 'toolbar',
    controls: ['variantPicker', 'layerToggle', 'searchInput', 'timeFilter'],
  }),
  MapLegend: freeze({
    role: 'list',
    itemShape: ['glyph', 'label', 'fallback', 'groupId', 'variantId'],
  }),
  MapDetailsPanel: freeze({
    role: 'region',
    sections: ['identity', 'actions', 'metadata', 'sourceBoundary'],
  }),
  MapActionButton: freeze({
    role: 'button',
    states: ['default', 'focus', 'disabled', 'busy'],
  }),
});

export const mapUiActionContracts = freeze({
  openPlace: freeze({
    id: 'map.open-place',
    label: 'Open place',
    requiredPayload: ['placeId'],
  }),
  searchNearby: freeze({
    id: 'map.search-nearby',
    label: 'Search nearby',
    requiredPayload: ['query', 'geohash'],
  }),
  createMeetup: freeze({
    id: 'map.create-meetup',
    label: 'Create meetup',
    requiredPayload: ['placeId', 'placeType'],
  }),
  vote: freeze({
    id: 'map.vote',
    label: 'Vote',
    requiredPayload: ['competitionId', 'candidateId'],
  }),
  attachMedia: freeze({
    id: 'map.attach-media',
    label: 'Attach media',
    requiredPayload: ['placeId', 'mediaKind'],
  }),
  toggleLayer: freeze({
    id: 'map.toggle-layer',
    label: 'Toggle layer',
    requiredPayload: ['layerId'],
  }),
});

export function resolveMapUiGlyph(value, fallbackId = 'map') {
  const id = glyphAliasToId.get(asSlug(value, '')) || asSlug(fallbackId);
  return glyphById.get(id) || glyphById.get('map');
}

export function resolveMapUiGlyphPath(value, fallbackId = 'map') {
  const glyph = resolveMapUiGlyph(value, fallbackId);
  const parent = glyph.parentId ? glyphById.get(glyph.parentId) : null;
  const main = glyphById.get(glyph.groupId) || parent || glyph;
  const path = unique([main, parent, glyph]);
  return freeze({
    groupId: glyph.groupId,
    main,
    parent: parent || main,
    glyph,
    ids: freeze(path.map((item) => item.id)),
    glyphs: freeze(path.map((item) => item.glyph)),
    fallbacks: freeze(path.map((item) => item.fallback)),
  });
}

export function getMapUiFamily(id) {
  const slug = asSlug(id, '');
  return mapUiFamilies.find((family) => family.id === slug) || null;
}

export function listMapUiVariants(familyId) {
  const family = getMapUiFamily(familyId);
  if (!family) return freeze([]);
  return freeze(
    family.variants.map((variantId) => {
      const path = resolveMapUiGlyphPath(variantId, family.glyphId);
      return freeze({
        familyId: family.id,
        variantId,
        label: path.glyph.label,
        glyph: path.glyph.glyph,
        fallback: path.glyph.fallback,
        mainGlyph: path.main.glyph,
        mainFallback: path.main.fallback,
        glyphPath: path.ids.join('>'),
      });
    })
  );
}

export function buildMapUiLegend(familyId) {
  const family = getMapUiFamily(familyId);
  if (!family) return freeze([]);
  return freeze([
    freeze({
      familyId: family.id,
      variantId: family.glyphId,
      label: family.label,
      ...resolveMapUiGlyphPath(family.glyphId),
    }),
    ...listMapUiVariants(family.id),
  ]);
}

export function buildMapUiFeatureProps({
  familyId,
  variantId,
  key = '',
  label = '',
  geohash = '',
  time = '',
  type = '',
} = {}) {
  const family = getMapUiFamily(familyId) || getMapUiFamily('spot-core');
  const path = resolveMapUiGlyphPath(variantId || family.glyphId, family.glyphId);
  return freeze({
    schemaVersion: MAP_UI_LIBRARY_VERSION,
    familyId: family.id,
    variantId: variantId || family.glyphId,
    key,
    label,
    geohash,
    time,
    type,
    glyph: path.glyph.glyph,
    glyphId: path.glyph.id,
    glyphFallback: path.glyph.fallback,
    mainGlyph: path.main.glyph,
    mainGlyphId: path.main.id,
    parentGlyph: path.parent.glyph,
    parentGlyphId: path.parent.id,
    glyphPath: path.ids.join('>'),
    glyphFallbackPath: path.fallbacks.join(' > '),
  });
}

export function buildMapUiPanelModel({
  familyId,
  activeVariantId,
  title,
  subtitle = '',
  actions = [],
} = {}) {
  const family = getMapUiFamily(familyId) || getMapUiFamily('spot-core');
  const variants = listMapUiVariants(family.id);
  const activeVariant =
    variants.find((variant) => variant.variantId === activeVariantId) ||
    variants[0] ||
    null;
  return freeze({
    schemaVersion: MAP_UI_LIBRARY_VERSION,
    familyId: family.id,
    route: family.route,
    title: title || family.label,
    subtitle,
    glyph: resolveMapUiGlyph(family.glyphId).glyph,
    activeVariant,
    variants,
    actions: freeze(
      actions.map((action) => mapUiActionContracts[action] || action)
    ),
    componentContracts: mapUiComponentContracts,
  });
}

export function summarizeMapUiCoverage() {
  return freeze({
    schemaVersion: MAP_UI_LIBRARY_VERSION,
    familyCount: mapUiFamilies.length,
    glyphCount: glyphList.length,
    componentCount: Object.keys(mapUiComponentContracts).length,
    actionCount: Object.keys(mapUiActionContracts).length,
    families: freeze(
      mapUiFamilies.map((family) =>
        freeze({
          id: family.id,
          route: family.route,
          glyph: resolveMapUiGlyph(family.glyphId).glyph,
          variantCount: family.variants.length,
        })
      )
    ),
  });
}

export function validateMapUiRegistry({
  families = mapUiFamilies,
  glyphs = glyphList,
} = {}) {
  const glyphIds = new Set(glyphs.map((glyph) => glyph.id));
  const hasGlyphReference = (value) =>
    glyphIds.has(value) || glyphAliasToId.has(asSlug(value, ''));
  const problems = [];
  for (const family of families) {
    if (!glyphIds.has(family.glyphId)) {
      problems.push(`Missing family glyph ${family.glyphId} for ${family.id}`);
    }
    for (const variant of family.variants) {
      if (!hasGlyphReference(variant)) {
        problems.push(`Missing variant glyph ${variant} for ${family.id}`);
      }
    }
  }
  return freeze({
    valid: problems.length === 0,
    problems: freeze(problems),
  });
}
