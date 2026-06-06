// @ric/emoji-vectors/serve — a framework-agnostic endpoint for the vector table.
//
// `emojiVectorsResponse(request, { table, token })` takes a Web `Request` and
// returns a Web `Response`, so the SAME handler mounts on Cloudflare Workers,
// Next App Router (route.js), Bun, Deno, and the edge. Designed for internal use
// at robotric.org: bake once → serve the quantized all-emoji table to every app.
//
//   GET /emoji-vectors                 → full quantized table (+ metadata)
//   GET /emoji-vectors?emojis=🍺🍻⛳     → just those (server-side subset)
//   GET /emoji-vectors?format=float    → dequantized floats
//   Authorization: Bearer <token>      → internal gate (or ?token=)
//
// The table is whatever `quantizeTable(bakedTable)` produced; this module never
// imports a provider or a key — it only serves a precomputed artifact.
import { dequantizeTable } from './quantize.js';

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

const splitGlyphs = (input) =>
  typeof Intl !== 'undefined' && Intl.Segmenter
    ? Array.from(
        new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(
          String(input || '')
        ),
        (p) => p.segment
      ).filter((p) => p.trim())
    : Array.from(String(input || '')).filter((p) => p.trim());

/**
 * @param {Request} request  a Web Request
 * @param {{ table: object, token?: string, maxAgeSeconds?: number }} opts
 * @returns {Response}
 */
export const emojiVectorsResponse = (request, opts = {}) => {
  const { table, token, maxAgeSeconds = 86400 } = opts;
  if (!table) return json({ error: 'no table configured' }, 503);

  const url = new URL(request.url);

  // Internal gate (optional): Bearer header or ?token=.
  if (token) {
    const bearer = (request.headers.get('authorization') || '').replace(
      /^Bearer\s+/i,
      ''
    );
    const provided = bearer || url.searchParams.get('token') || '';
    if (provided !== token) return json({ error: 'unauthorized' }, 401);
  }

  let out = table;

  // Server-side subset by ?emojis=
  const emojisParam = url.searchParams.get('emojis');
  if (emojisParam) {
    const wanted = new Set(splitGlyphs(emojisParam));
    const vectors = {};
    for (const emoji of wanted) {
      if (table.vectors?.[emoji]) vectors[emoji] = table.vectors[emoji];
    }
    out = { ...table, vectors, count: Object.keys(vectors).length };
  }

  // Optional float expansion.
  if (url.searchParams.get('format') === 'float') out = dequantizeTable(out);

  return json(
    { count: Object.keys(out.vectors || {}).length, ...out },
    200,
    {
      'cache-control': `public, max-age=${maxAgeSeconds}, immutable`,
      'access-control-allow-origin': '*',
    }
  );
};

/**
 * Convenience: bind a table + token once, get a `(request) => Response` handler.
 *   export const GET = createEmojiVectorsHandler({ table, token });
 */
export const createEmojiVectorsHandler = (opts) => (request) =>
  emojiVectorsResponse(request, opts);
