// GET /api/releases
// Pulls the latest GitHub releases for every app in _sources.js and returns them
// as headlines. With GITHUB_TOKEN set (Vercel env var) it uses the GitHub API.
// Without one it reads each repo's public releases.atom feed first, because the
// unauthenticated API only allows 60 calls an hour. Cached on Vercel for an hour.

import { CATEGORIES } from './_sources.js';
import { allSources } from './_catalog.js';

const PER_REPO = 3;
const TIMEOUT_MS = 8000;
const CONCURRENCY = 12;
const MAX_HEADLINES = 220;
const UA = 'ps5-scene-wire';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", nbsp: ' ' };

export function decodeEntities(s = '') {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

// Turns release notes (markdown or HTML) into one short plain-text line.
export function toSnippet(text = '', max = 240) {
  let s = String(text)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/[*_`~>|]/g, '')
    .replace(/https?:\/\/\S+/g, '');
  s = decodeEntities(s).replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : max).trim() + '…';
}

export function parseAtom(xml = '') {
  const entries = [];
  const re = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const pick = (r) => (block.match(r) || [])[1] || '';
    const url = pick(/<link[^>]*href="([^"]+)"/);
    const tag = decodeURIComponent((url.match(/\/releases\/tag\/([^/?#]+)/) || [])[1] || '');
    entries.push({
      title: decodeEntities(pick(/<title[^>]*>([\s\S]*?)<\/title>/)).trim(),
      date: pick(/<updated>([^<]+)<\/updated>/),
      url,
      tag,
      notes: toSnippet(decodeEntities(pick(/<content[^>]*>([\s\S]*?)<\/content>/)))
    });
  }
  return entries;
}

const looksPre = (s) => /alpha|beta|\brc\d*|pre|dev|test|preview|nightly/i.test(s);

function withTimeout() {
  return typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined;
}

async function fromApi(src, { fetchImpl, token }) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': UA, 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetchImpl(`https://api.github.com/repos/${src.repo}/releases?per_page=${PER_REPO}`, {
    headers,
    signal: withTimeout()
  });
  if (!res.ok) {
    const remaining = res.headers?.get?.('x-ratelimit-remaining');
    return { ok: false, status: res.status, rateLimited: res.status === 429 || (res.status === 403 && remaining === '0') };
  }
  const list = await res.json();
  const items = (Array.isArray(list) ? list : [])
    .filter((r) => !r.draft)
    .map((r) => ({
      tag: r.tag_name || '',
      title: (r.name || r.tag_name || '').trim(),
      date: r.published_at || r.created_at,
      prerelease: !!r.prerelease,
      url: r.html_url,
      notes: toSnippet(r.body || '')
    }));
  return { ok: true, items };
}

async function fromAtom(src, { fetchImpl }) {
  const res = await fetchImpl(`https://github.com/${src.repo}/releases.atom`, {
    headers: { 'User-Agent': UA, Accept: 'application/atom+xml' },
    signal: withTimeout()
  });
  if (!res.ok) return { ok: false, status: res.status };
  const items = parseAtom(await res.text())
    .slice(0, PER_REPO)
    .map((e) => ({ ...e, prerelease: looksPre(e.tag + ' ' + e.title) }));
  return { ok: true, items };
}

async function viaApi(src, opts, state) {
  if (state.rateLimited) return null;
  try {
    const r = await fromApi(src, opts);
    if (r.ok) return { status: 'ok', items: r.items };
    if (r.status === 404) return { status: 'missing', items: [] };
    if (r.rateLimited) state.rateLimited = true;
  } catch {
    // network error or timeout
  }
  return null;
}

async function viaAtom(src, opts) {
  try {
    const a = await fromAtom(src, opts);
    if (a.ok) return { status: 'ok', items: a.items };
    if (a.status === 404) return { status: 'missing', items: [] };
  } catch {
    // network error or timeout
  }
  return null;
}

async function loadRepo(src, opts, state) {
  // With a token the API is reliable and gives exact pre-release flags.
  // Without one, the atom feed avoids the 60-calls-an-hour limit.
  const first = opts.token ? viaApi : viaAtom;
  const second = opts.token ? viaAtom : viaApi;
  return (await first(src, opts, state)) || (await second(src, opts, state)) || { status: 'unavailable', items: [] };
}

async function pool(list, limit, fn) {
  const out = new Array(list.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, list.length) }, async () => {
    while (next < list.length) {
      const i = next++;
      out[i] = await fn(list[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

export async function collect({ fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN, sources } = {}) {
  let catalog = { ok: false, count: 0, skipped: true };
  if (!sources) ({ sources, catalog } = await allSources({ fetchImpl }));
  const state = { rateLimited: false };
  const results = await pool(sources, CONCURRENCY, (src) => loadRepo(src, { fetchImpl, token }, state));

  const releases = [];
  const apps = sources.map((src, i) => {
    const { status } = results[i];
    // GitHub lists releases by creation date, not publish date, so re-sort before picking "latest".
    const items = [...results[i].items].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const it of items) {
      releases.push({ kind: 'release', cat: src.cat, repo: src.repo, app: src.name, ...it });
    }
    const latest = items[0] || null;
    return {
      cat: src.cat,
      repo: src.repo,
      name: src.name,
      about: src.about || '',
      inStore: !!src.inStore,
      status: status === 'ok' && !latest ? 'no-releases' : status,
      repoUrl: `https://github.com/${src.repo}`,
      releasesUrl: `https://github.com/${src.repo}/releases`,
      latest: latest && { tag: latest.tag, date: latest.date, url: latest.url, prerelease: latest.prerelease }
    };
  });

  releases.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    fetchedAt: new Date().toISOString(),
    usingToken: !!token,
    rateLimited: state.rateLimited,
    catalog,
    categories: CATEGORIES,
    // Apps first: shorter, and readable even when a client truncates the response.
    apps,
    releases: releases.slice(0, MAX_HEADLINES)
  };
}

export default async function handler(req, res) {
  let body;
  let code = 200;
  try {
    body = await collect();
  } catch (err) {
    code = 502;
    body = { error: 'Release feed failed to load', detail: String(err?.message || err) };
  }
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', code === 200 ? 's-maxage=3600, stale-while-revalidate=86400' : 'no-store');
  res.end(JSON.stringify(body));
}
