// GET /api/releases
// Pulls the latest GitHub releases for every app in _sources.js and returns them
// as headlines. Uses the GitHub API (set GITHUB_TOKEN in Vercel for a much higher
// rate limit) and falls back to each repo's public releases.atom feed when the API
// is rate limited or unreachable. Vercel's CDN caches the response for 30 minutes.

import { SOURCES } from './_sources.js';

const PER_REPO = 3;
const TIMEOUT_MS = 8000;
const MAX_HEADLINES = 60;
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
    .map((e) => ({ ...e, prerelease: /alpha|beta|rc|pre|test/i.test(e.tag + ' ' + e.title) }));
  return { ok: true, items };
}

async function loadRepo(src, opts, state) {
  if (!state.rateLimited) {
    try {
      const r = await fromApi(src, opts);
      if (r.ok) return { status: 'ok', items: r.items };
      if (r.status === 404) return { status: 'missing', items: [] };
      if (r.rateLimited) state.rateLimited = true;
    } catch {
      // network error or timeout, try the feed instead
    }
  }
  try {
    const a = await fromAtom(src, opts);
    if (a.ok) return { status: 'ok', items: a.items };
    return { status: a.status === 404 ? 'missing' : 'unavailable', items: [] };
  } catch {
    return { status: 'unavailable', items: [] };
  }
}

export async function collect({ fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN, sources = SOURCES } = {}) {
  const state = { rateLimited: false };
  const results = await Promise.all(sources.map((src) => loadRepo(src, { fetchImpl, token }, state)));

  const releases = [];
  const apps = sources.map((src, i) => {
    const { status } = results[i];
    // GitHub lists releases by creation date, not publish date, so re-sort before picking "latest".
    const items = [...results[i].items].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const it of items) {
      releases.push({ kind: 'release', repo: src.repo, app: src.name, ...it });
    }
    const latest = items[0] || null;
    return {
      repo: src.repo,
      name: src.name,
      about: src.about || '',
      status: status === 'ok' && !latest ? 'no-releases' : status,
      releasesUrl: `https://github.com/${src.repo}/releases`,
      latest: latest && { tag: latest.tag, date: latest.date, url: latest.url, prerelease: latest.prerelease }
    };
  });

  releases.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    fetchedAt: new Date().toISOString(),
    usingToken: !!token,
    rateLimited: state.rateLimited,
    releases: releases.slice(0, MAX_HEADLINES),
    apps
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
  res.setHeader('Cache-Control', code === 200 ? 's-maxage=1800, stale-while-revalidate=86400' : 'no-store');
  res.end(JSON.stringify(body));
}
