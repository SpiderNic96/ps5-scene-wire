// Pulls the homebrew.page catalogue (the one ProsperoStore installs from) and turns
// every entry with a GitHub source repo into a tracked app. Hand-picked entries in
// _sources.js always win, so their names, categories and descriptions stay as written.

import { SOURCES } from './_sources.js';

export const CATALOG_URL = 'https://homebrew.page/catalog/v1.json';
const TIMEOUT_MS = 8000;

export function repoFromUrl(url = '') {
  const m = String(url).match(/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:[/?#]|$)/);
  return m ? `${m[1]}/${m[2]}` : null;
}

export function shorten(text = '', max = 70) {
  const s = String(text).replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s.replace(/\.$/, '');
  const cut = s.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return (at > max * 0.5 ? cut.slice(0, at) : cut).replace(/[,;:.\s]+$/, '') + '…';
}

// Best-effort category from the entry's name, description and kind.
export function categorize({ name = '', description = '', kind = '' }) {
  const t = `${name} ${description}`.toLowerCase();
  if (/store\b/.test(name.toLowerCase())) return 'stores';
  if (/emulat|retroarch|pcsx|rpcs3|dolphin|cemu|azahar|xenia|xemu|\beden\b|swanstation|ppsspp|\bpsp\b|\bvita|snes|\bnes\b|\bgba\b|\bn64\b|melonds|mupen|fbneo|genesis|\bmame\b|pico-8|ruffle|psxs5|ps5sx2/.test(t)) return 'emulators';
  if (/pokemmo/.test(t)) return 'pc';
  // Games go to ports before the media check, so a port whose description mentions video isn't misfiled.
  if (kind === 'game' || /recomp|harkinian|port of|quake|doom|openmw|openrct|xash/.test(t)) return 'ports';
  if (/jellyfin|emby|stremio|\bvlc\b|nuvio|twitch|youtube|iptv|tv\b|radio|spotify|spot5|twisp|music|cd player|media|player\b|moonlight|remote play|steam link|cloud|geforce|opennow|stream|vr\b|video/.test(t)) return 'media';
  if (/\bwine?\b|windows|linux|\bjava\b/.test(t)) return 'pc';
  return 'tools';
}

export function fromCatalog(json) {
  const apps = Array.isArray(json?.apps) ? json.apps : [];
  const out = [];
  for (const a of apps) {
    const repo = repoFromUrl(a.source_repo);
    if (!repo) continue;
    out.push({
      cat: categorize(a),
      repo,
      name: String(a.name || repo.split('/')[1]).trim(),
      about: shorten(a.description || ''),
      inStore: true
    });
  }
  return out;
}

export function merge(manual, catalog) {
  const seen = new Map(manual.map((s) => [s.repo.toLowerCase(), { ...s }]));
  for (const c of catalog) {
    const key = c.repo.toLowerCase();
    if (seen.has(key)) seen.get(key).inStore = true;
    else seen.set(key, c);
  }
  return [...seen.values()];
}

export async function allSources({ fetchImpl = globalThis.fetch, manual = SOURCES } = {}) {
  try {
    const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined;
    const res = await fetchImpl(CATALOG_URL, { headers: { 'User-Agent': 'ps5-scene-wire', Accept: 'application/json' }, signal });
    if (!res.ok) throw new Error(String(res.status));
    const entries = fromCatalog(await res.json());
    return { sources: merge(manual, entries), catalog: { ok: true, count: entries.length } };
  } catch (err) {
    return { sources: manual.map((s) => ({ ...s })), catalog: { ok: false, count: 0, error: String(err?.message || err) } };
  }
}
