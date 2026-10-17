// Checks data/compat.json (the /firmware directory data) and finds tracked apps
// that haven't been reviewed for firmware support yet.
//
//   node scripts/compat-check.mjs             validate; exits 1 on any error
//   node scripts/compat-check.mjs --missing   also list hand-picked apps with no entry
//                                             and not marked "unstated", with the
//                                             firmware lines from each README
//
// Run it before every push that touches data/compat.json or api/_sources.js.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { SOURCES } = await import(path.join(root, 'api/_sources.js'));
const file = path.join(root, 'data/compat.json');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

let C;
try { C = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error('compat.json is not valid JSON: ' + e.message); process.exit(1); }

const FW = /^\d{1,2}\.\d{2}$/;
const n = (v) => { const [a, b] = v.split('.'); return +a * 100 + +b; };
const today = new Date().toISOString().slice(0, 10);
const tracked = new Map(SOURCES.map((s) => [s.repo.toLowerCase(), s]));

// ---- firmwares ----
if (!Array.isArray(C.firmwares) || !C.firmwares.length) err('"firmwares" must be a non-empty list');
else {
  C.firmwares.forEach((v, i) => {
    if (!FW.test(v)) err(`firmwares: "${v}" isn't in X.YY form`);
    else if (i && FW.test(C.firmwares[i - 1]) && n(v) <= n(C.firmwares[i - 1])) err(`firmwares: "${v}" is out of order or repeated (after ${C.firmwares[i - 1]})`);
  });
}
const known = new Set(C.firmwares || []);

if (!/^\d{4}-\d{2}-\d{2}$/.test(C.updated || '')) err('"updated" must be a YYYY-MM-DD date');
else if (C.updated > today) err(`"updated" (${C.updated}) is in the future`);

// ---- shared field checks ----
function checkFields(where, o, { entry = false } = {}) {
  const allowed = entry ? ['repo', 'name', 'range', 'only', 'how', 'story', 'linux'] : ['range', 'tested', 'only', 'any', 'needs', 'note'];
  Object.keys(o).forEach((k) => { if (!allowed.includes(k)) err(`${where}: unknown field "${k}"`); });
  if (o.range !== undefined) {
    if (!Array.isArray(o.range) || o.range.length !== 2 || !o.range.every((v) => FW.test(v))) err(`${where}: "range" must be ["X.YY", "X.YY"]`);
    else if (n(o.range[0]) > n(o.range[1])) err(`${where}: range starts after it ends (${o.range.join('–')})`);
  }
  for (const k of ['tested', 'only']) {
    if (o[k] === undefined) continue;
    if (!Array.isArray(o[k]) || !o[k].length || !o[k].every((v) => FW.test(v))) { err(`${where}: "${k}" must be a list of "X.YY" firmwares`); continue; }
    o[k].filter((v) => !known.has(v)).forEach((v) => warn(`${where}: ${k} ${v} isn't in the firmware picker, so nobody can select it (add it to "firmwares")`));
  }
  if (o.range && o.only) err(`${where}: has both "range" and "only"; use one`);
  if (o.only && o.any) err(`${where}: "only" and "any" contradict each other`);
  if (o.range && o.tested) o.tested.filter((v) => FW.test(v) && (n(v) < n(o.range[0]) || n(v) > n(o.range[1]))).forEach((v) => warn(`${where}: tested on ${v}, outside its stated range ${o.range.join('–')}`));
  if (o.needs !== undefined && (!Array.isArray(o.needs) || !o.needs.every((x) => typeof x === 'string' && x))) err(`${where}: "needs" must be a list of names`);
  for (const k of ['note', 'how', 'name']) if (o[k] !== undefined && (typeof o[k] !== 'string' || !o[k].trim())) err(`${where}: "${k}" must be text`);
  if (!entry && !o.range && !o.tested && !o.only && !o.any) err(`${where}: says nothing about firmware (needs range, tested, only or any)`);
}

// ---- entry points ----
const entryRepos = new Set();
(C.entry || []).forEach((e, i) => {
  const where = `entry[${i}] ${e.repo || '?'}`;
  checkFields(where, e, { entry: true });
  if (!/^[\w.-]+\/[\w.-]+$/.test(e.repo || '')) err(`${where}: "repo" must be owner/repo`);
  if (!e.name) err(`${where}: missing "name"`);
  if (!e.how) err(`${where}: missing "how"`);
  if (!e.range && !e.only) err(`${where}: needs "range" or "only"`);
  if (entryRepos.has((e.repo || '').toLowerCase())) err(`${where}: listed twice`);
  entryRepos.add((e.repo || '').toLowerCase());
  if (!tracked.has((e.repo || '').toLowerCase())) warn(`${where}: not in api/_sources.js, so it won't appear in the Jailbreak list (only in the summary)`);
});

// ---- apps ----
const seen = new Map();
Object.entries(C.apps || {}).forEach(([repo, o]) => {
  const where = `apps["${repo}"]`;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) err(`${where}: key must be owner/repo`);
  const low = repo.toLowerCase();
  if (seen.has(low)) err(`${where}: duplicate of apps["${seen.get(low)}"] (repo names aren't case-sensitive)`);
  seen.set(low, repo);
  if (entryRepos.has(low)) warn(`${where}: also in "entry"; the apps entry wins on the page`);
  const src = tracked.get(low);
  if (!src) warn(`${where}: not in api/_sources.js (fine if it comes from the ProsperoStore catalogue, otherwise it never shows)`);
  else if (src.repo !== repo) warn(`${where}: _sources.js spells it "${src.repo}"`);
  if (o && typeof o === 'object') checkFields(where, o); else err(`${where}: must be an object`);
});

// ---- reviewed, nothing stated ----
const unstated = new Set((C.unstated || []).map((r) => r.toLowerCase()));
(C.unstated || []).forEach((r) => { if (seen.has(r.toLowerCase())) warn(`unstated: "${r}" also has an apps entry; remove it from "unstated"`); });

// ---- report ----
const reviewed = (r) => seen.has(r) || entryRepos.has(r) || unstated.has(r);
const missing = SOURCES.filter((s) => !reviewed(s.repo.toLowerCase()));

console.log(`compat.json: ${C.firmwares?.length || 0} firmwares, ${(C.entry || []).length} entry points, ${Object.keys(C.apps || {}).length} apps, ${unstated.size} reviewed with nothing stated, updated ${C.updated}`);
console.log(`Hand-picked apps not reviewed yet: ${missing.length}`);
warnings.forEach((w) => console.log('  warning: ' + w));
errors.forEach((e) => console.log('  ERROR: ' + e));

if (process.argv.includes('--missing') && missing.length) {
  console.log('\nTo review (add an apps entry if the README states PS5 firmware, otherwise add the repo to "unstated"):');
  for (const s of missing) {
    let text = '';
    for (const f of ['README.md', 'readme.md', 'Readme.md']) {
      const r = await fetch(`https://raw.githubusercontent.com/${s.repo}/HEAD/${f}`).catch(() => null);
      if (r && r.ok) { text = await r.text(); break; }
    }
    const lines = text.split('\n')
      .filter((l) => /firmware|\bfw\b|tested|supports?|requires?|compatib/i.test(l) && /\b\d{1,2}\.\d{2}\b/.test(l))
      .slice(0, 6).map((l) => '      ' + l.trim().slice(0, 200));
    console.log(`\n  ${s.repo} (${s.cat}) ${text ? '' : '— no README found'}`);
    console.log(lines.length ? lines.join('\n') : '      no firmware lines found');
  }
}

if (errors.length) { console.log(`\n${errors.length} error(s). Fix these before pushing.`); process.exit(1); }
console.log('\nOK');
