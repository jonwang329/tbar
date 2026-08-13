import { SOURCE_REGISTRY, TAIWAN_COMPANIES, AI_LEADERS } from '../src/data/sourceRegistry.js';
import { parseRss } from '../src/data/rss.js';
import { parseSitemap, filterSitemapEntries } from '../src/data/sitemap.js';
import { parsePageMetadata } from '../src/data/html.js';
import { freshnessScore } from '../src/data/scoring.js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const DATA_DIR = new URL('../public/data/', import.meta.url);
const STATE_URL = new URL('../public/data/collector-state.json', import.meta.url);
const CANDIDATES_URL = new URL('../public/data/candidates.json', import.meta.url);
const USER_AGENT = 'TBAR/0.2 (+https://github.com/jonwang329/tbar)';
const MAX_ITEMS_PER_SOURCE = 30;
const MAX_DETAIL_FETCHES_PER_SOURCE = 8;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = value => createHash('sha256').update(String(value)).digest('hex').slice(0, 20);
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const normalizeUrl = value => {
  try { const u = new URL(value); u.hash = ''; u.search = ''; return u.toString().replace(/\/$/, ''); }
  catch { return clean(value); }
};

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8' },
    signal: AbortSignal.timeout(20_000)
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function loadJson(url, fallback) {
  try { return JSON.parse(await readFile(url, 'utf8')); } catch { return fallback; }
}

function sourceQuality(source) {
  if (['primary', 'government', 'market'].includes(source.kind)) return 96;
  if (source.priority === 'P1') return 88;
  return 78;
}

function scoreCandidate(item, source, now) {
  const text = `${item.title} ${item.description || ''}`.toLowerCase();
  const taiwanTerms = ['taiwan', 'tsmc', ...TAIWAN_COMPANIES.map(x => x.toLowerCase())];
  const leaderTerms = AI_LEADERS.map(x => x.toLowerCase());
  const businessTerms = ['investment','enterprise','data center','datacenter','gpu','cloud','network','semiconductor','partnership','acquisition','revenue','factory','infrastructure','capacity','government'];
  const importanceTerms = ['launch','introduc','announce','partnership','investment','acquisition','national','infrastructure','model','gpu','data center','sovereign'];
  const contains = terms => terms.some(term => text.includes(term));
  const publishedAt = item.publishedAt || item.lastmod || now.toISOString();
  return {
    freshnessScore: freshnessScore(publishedAt, now),
    sourceQualityScore: sourceQuality(source),
    taiwanScore: source.countries?.includes('Taiwan') || contains(taiwanTerms) ? 90 : 35,
    businessScore: contains(businessTerms) ? 85 : 60,
    importanceScore: contains(importanceTerms) ? 82 : 65,
    confidenceScore: ['primary','government','market'].includes(source.kind) ? 95 : 78,
    leaderMatch: contains(leaderTerms)
  };
}

function toCandidate(item, source, previous, now) {
  const url = normalizeUrl(item.url || item.link);
  const previousItem = previous.items?.[url];
  const publishedAt = item.publishedAt || item.lastmod || previousItem?.publishedAt || now.toISOString();
  const scores = scoreCandidate({ ...item, publishedAt }, source, now);
  return {
    id: `cand_${hash(`${source.id}|${url}`)}`,
    sourceId: source.id,
    sourceName: source.name,
    sourceKind: source.kind,
    sourcePriority: source.priority,
    url,
    title: clean(item.title) || url,
    description: clean(item.description),
    publishedAt,
    discoveredAt: previousItem?.discoveredAt || now.toISOString(),
    lastSeenAt: now.toISOString(),
    topics: source.topics || [],
    countries: source.countries || [],
    ...scores
  };
}

async function collectRss(source, previous, now) {
  const xml = await fetchText(source.url);
  return parseRss(xml, MAX_ITEMS_PER_SOURCE).map(item => toCandidate(item, source, previous, now));
}

async function collectSitemap(source, previous, now) {
  const xml = await fetchText(source.feedUrl || source.url);
  const entries = filterSitemapEntries(parseSitemap(xml), source)
    .sort((a, b) => String(b.lastmod || '').localeCompare(String(a.lastmod || '')))
    .slice(0, MAX_ITEMS_PER_SOURCE);

  const candidates = [];
  let detailFetches = 0;
  for (const entry of entries) {
    const url = normalizeUrl(entry.url);
    const prev = previous.items?.[url];
    let metadata = { title: prev?.title || '', description: prev?.description || '', publishedAt: prev?.publishedAt || null };
    const changed = !prev || (entry.lastmod && entry.lastmod !== prev.lastmod);
    if (changed && detailFetches < MAX_DETAIL_FETCHES_PER_SOURCE) {
      try {
        metadata = parsePageMetadata(await fetchText(url), url);
        detailFetches += 1;
        await sleep(150);
      } catch (error) {
        console.warn(`  detail fetch failed ${url}: ${error}`);
      }
    }
    candidates.push(toCandidate({ url, lastmod: entry.lastmod, ...metadata }, source, previous, now));
  }
  return candidates;
}

const now = new Date();
await mkdir(DATA_DIR, { recursive: true });
const previousState = await loadJson(STATE_URL, { version: 1, items: {}, sourceStatus: {} });
const all = [];
const sourceStatus = { ...previousState.sourceStatus };

for (const source of SOURCE_REGISTRY.filter(s => ['rss','sitemap'].includes(s.adapter))) {
  try {
    const items = source.adapter === 'rss'
      ? await collectRss(source, previousState, now)
      : await collectSitemap(source, previousState, now);
    all.push(...items);
    sourceStatus[source.id] = { status: 'ok', itemCount: items.length, lastSuccessAt: now.toISOString(), lastError: null };
    console.log(`✓ ${source.name}: ${items.length} candidates`);
  } catch (error) {
    const prior = sourceStatus[source.id] || {};
    sourceStatus[source.id] = { ...prior, status: 'error', lastError: String(error), lastAttemptAt: now.toISOString() };
    console.error(`✗ ${source.name}: ${error}`);
  }
}

const byUrl = new Map();
for (const candidate of all) {
  const current = byUrl.get(candidate.url);
  if (!current || candidate.sourceQualityScore > current.sourceQualityScore) byUrl.set(candidate.url, candidate);
}
const candidates = [...byUrl.values()]
  .sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  .slice(0, 150);

const itemState = { ...previousState.items };
for (const item of candidates) itemState[item.url] = {
  sourceId: item.sourceId,
  title: item.title,
  description: item.description,
  publishedAt: item.publishedAt,
  discoveredAt: item.discoveredAt,
  lastSeenAt: item.lastSeenAt
};

const stableCandidates = candidates.map(({ lastSeenAt, ...item }) => item);
const newOutput = { version: 2, updatedAt: now.toISOString(), candidates: stableCandidates };
const previousOutput = await loadJson(CANDIDATES_URL, null);
const comparable = value => JSON.stringify(value?.candidates || []);
const dataChanged = comparable(previousOutput) !== comparable(newOutput);

if (dataChanged || !previousOutput) {
  await writeFile(CANDIDATES_URL, JSON.stringify(newOutput, null, 2));
  await writeFile(STATE_URL, JSON.stringify({ version: 2, items: itemState, sourceStatus }, null, 2));
  console.log(`✓ wrote ${stableCandidates.length} candidates (data changed)`);
} else {
  console.log(`= no candidate changes; preserving committed data timestamps`);
}
