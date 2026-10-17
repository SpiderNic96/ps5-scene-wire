// GET /api/discover            -> PS5 homebrew repos found by searching GitHub, newest first
// Custom ?q= searches are not accepted from visitors, so nobody can spend the GitHub token's search quota.
// Unauthenticated GitHub search allows 10 requests a minute, so results are cached for an hour.

import { allSources } from './_catalog.js';

const DAYS = 90;
const TIMEOUT_MS = 8000;
const UA = 'ps5-scene-wire';

function since(days) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

export function defaultQueries(now = Date.now()) {
  const d = new Date(now - DAYS * 86400000).toISOString().slice(0, 10);
  const recent = `fork:false pushed:>${d}`;
  // GitHub allows 10 unauthenticated searches a minute, so keep this list at 9 or fewer.
  return [
    `topic:ps5-homebrew ${recent}`,
    `topic:ps5-payload ${recent}`,
    `ps5 payload in:name,description ${recent}`,
    `ps5 homebrew in:name,description ${recent}`,
    `"jailbroken ps5" in:description ${recent}`,
    `ps5 port in:name,description ${recent}`,
    `prospero in:name ${recent}`,
    `"13.60" ps5 in:readme ${recent}`,
    `etaHEN in:readme,description ${recent}`
  ];
}

// Things that match "ps5" but aren't console homebrew.
const NOISE = /dualsense|controller|stock|restock|price|bot\b|availability|scalper|chiaki|wallpaper|emulator for (pc|windows|android)|on pc\b|anyps5|kyty|sharpemu|cheat|aimbot|\besp\b/i;
// Anything that looks like a commercial-game catalogue is left out of the public list.
const GAME_CATALOGUE = /free games|\d[\d,.]*\+?\s*(ps4 |ps5 )?games|game store|games? catalog|catalog browsing|download manager|game library|dlcs?\b|overdrive|orbit[ -]?store|google drive|patches the game|store front-?end/i;
// The repo has to look like PS5 console software.
const PS5ISH = /ps5|playstation ?5|prospero|jailbr|homebrew|payload|etahen|kstuff|elfldr|shadowmount/i;

export function shape(repo, matched) {
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`;
  return {
    repo: repo.full_name,
    name: repo.name,
    description: (repo.description || '').trim(),
    url: repo.html_url,
    stars: repo.stargazers_count || 0,
    createdAt: repo.created_at,
    pushedAt: repo.pushed_at,
    topics: repo.topics || [],
    mentions1360: /13\.6\d?/.test(text) || matched.includes('13.60'),
    archived: !!repo.archived,
    noise: NOISE.test(text) || GAME_CATALOGUE.test(text) || !PS5ISH.test(text) || !(repo.description || '').trim()
  };
}

async function search(q, { fetchImpl, token }) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': UA, 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=50`;
  const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined;
  const res = await fetchImpl(url, { headers, signal });
  if (!res.ok) return { ok: false, status: res.status, items: [] };
  const data = await res.json();
  return { ok: true, items: data.items || [] };
}

export async function discover({ q, fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN, sources, now = Date.now() } = {}) {
  if (!sources) ({ sources } = await allSources({ fetchImpl }));
  const queries = q ? [q] : defaultQueries(now);
  const tracked = new Set(sources.map((s) => s.repo.toLowerCase()));
  const found = new Map();
  const failed = [];

  // Run sequentially: GitHub's search API dislikes bursts.
  for (const query of queries) {
    try {
      const r = await search(query, { fetchImpl, token });
      if (!r.ok) { failed.push({ query, status: r.status }); if (r.status === 403 || r.status === 429) break; continue; }
      for (const item of r.items) {
        const key = item.full_name.toLowerCase();
        const prev = found.get(key);
        const row = prev || shape(item, query);
        if (prev) row.mentions1360 = row.mentions1360 || query.includes('13.60');
        row.matchedBy = [...new Set([...(prev?.matchedBy || []), query.replace(/ fork:false pushed:>\S+/, '')])];
        found.set(key, row);
      }
    } catch (err) {
      failed.push({ query, status: String(err?.name || 'error') });
    }
  }

  const repos = [...found.values()]
    .filter((r) => !r.archived && !GAME_CATALOGUE.test(`${r.name} ${r.description}`) && (q || (!r.noise && r.stars >= 3)))
    .map((r) => ({ ...r, tracked: tracked.has(r.repo.toLowerCase()) }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    fetchedAt: new Date(now).toISOString(),
    windowDays: DAYS,
    usingToken: !!token,
    queries: queries.map((x) => x.replace(/ fork:false pushed:>\S+/, '')),
    failed,
    count: repos.length,
    repos
  };
}

// Reuse a recent result in this server instance, so URLs with junk query strings
// (which skip Vercel's cache) can't trigger fresh GitHub calls on every request.
const MEMO_MS = 15 * 60 * 1000;
let memo = null;

export default async function handler(req, res) {
  let body;
  let code = 200;
  try {
    if (memo && Date.now() - memo.at < MEMO_MS) body = await memo.body;
    else {
      memo = { at: Date.now(), body: discover() };
      body = await memo.body;
    }
  } catch (err) {
    memo = null;
    code = 502;
    body = { error: 'GitHub scan failed', detail: String(err?.message || err) };
  }
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', code === 200 ? 's-maxage=3600, stale-while-revalidate=86400' : 'no-store');
  res.end(JSON.stringify(body));
}

export { since };
