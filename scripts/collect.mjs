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
const USER_AGENT = 'TBAR/0.8 (+https://github.com/jonwang329/tbar)';
const MAX_ITEMS_PER_SOURCE = 30;
const MAX_DETAIL_FETCHES_PER_SOURCE = 8;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = value => createHash('sha256').update(String(value)).digest('hex').slice(0, 20);
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const decodeHtml = value => String(value || '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const stripTags = value => clean(decodeHtml(String(value || '').replace(/<[^>]+>/g, ' ')));
const normalizeUrl = value => {
  try { const u = new URL(value); u.hash = ''; return u.toString().replace(/\/$/, ''); }
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
  const taiwanTerms = ['taiwan','台灣','台积电','台積電','聯發科','鴻海','廣達','緯創','緯穎','英業達','台達','智邦', ...TAIWAN_COMPANIES.map(x => x.toLowerCase())];
  const leaderTerms = AI_LEADERS.map(x => x.toLowerCase());
  const businessTerms = ['investment','投資','擴產','enterprise','data center','datacenter','資料中心','gpu','cloud','雲端','network','網路','semiconductor','半導體','partnership','合作','acquisition','併購','revenue','營收','factory','廠','infrastructure','基礎設施','capacity','產能','government','政府'];
  const importanceTerms = ['launch','introduc','announce','宣布','partnership','investment','投資','acquisition','併購','national','國家','infrastructure','model','gpu','data center','資料中心','sovereign','擴產','資本支出'];
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
    sourceLastModified: item.lastmod || null,
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
  const root = parseSitemap(xml);
  let sitemapEntries = [...root.urls];
  for (const childUrl of root.sitemaps.slice(0, 12)) {
    try {
      const child = parseSitemap(await fetchText(childUrl));
      sitemapEntries.push(...child.urls);
    } catch (error) {
      console.warn(`  child sitemap failed ${childUrl}: ${error}`);
    }
  }
  const entries = filterSitemapEntries(sitemapEntries, source)
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

function extractListingLinks(html, source) {
  const include = source.includePath ? new RegExp(source.includePath, 'i') : null;
  const exclude = source.excludePath ? new RegExp(source.excludePath, 'i') : null;
  const found = new Map();
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html))) {
    try {
      const absolute = normalizeUrl(new URL(decodeHtml(match[1]), source.url).toString());
      if (!/^https?:/i.test(absolute)) continue;
      if (include && !include.test(absolute)) continue;
      if (exclude && exclude.test(absolute)) continue;
      const label = stripTags(match[2]);
      if (label.length < 8) continue;
      if (!found.has(absolute) || label.length > found.get(absolute).title.length) found.set(absolute, { url: absolute, title: label });
    } catch {}
  }
  return [...found.values()].slice(0, MAX_ITEMS_PER_SOURCE);
}

async function collectHtmlList(source, previous, now) {
  const html = await fetchText(source.url);
  const links = extractListingLinks(html, source);
  const candidates = [];
  let detailFetches = 0;
  for (const item of links) {
    const prev = previous.items?.[item.url];
    let metadata = {
      title: item.title || prev?.title || '',
      description: prev?.description || '',
      publishedAt: prev?.publishedAt || null
    };
    if (!prev && detailFetches < MAX_DETAIL_FETCHES_PER_SOURCE) {
      try {
        const detail = parsePageMetadata(await fetchText(item.url), item.url);
        metadata = { ...metadata, ...detail, title: detail.title || metadata.title };
        detailFetches += 1;
        await sleep(150);
      } catch (error) {
        console.warn(`  detail fetch failed ${item.url}: ${error}`);
      }
    }
    candidates.push(toCandidate({ url:item.url, ...metadata }, source, previous, now));
  }
  return candidates;
}

const now = new Date();
await mkdir(DATA_DIR, { recursive: true });
const previousState = await loadJson(STATE_URL, { version: 1, items: {}, sourceStatus: {} });
const all = [];
const sourceStatus = { ...previousState.sourceStatus };

for (const source of SOURCE_REGISTRY.filter(s => ['rss','sitemap','html-list'].includes(s.adapter))) {
  try {
    const items = source.adapter === 'rss'
      ? await collectRss(source, previousState, now)
      : source.adapter === 'sitemap'
        ? await collectSitemap(source, previousState, now)
        : await collectHtmlList(source, previousState, now);
    all.push(...items);
    sourceStatus[source.id] = { status: 'ok', itemCount: items.length, lastSuccessAt: now.toISOString(), lastError: null };
    console.log(`✓ ${source.name}: ${items.length} candidates`);
  } catch (error) {
    const prior = sourceStatus[source.id] || {};
    sourceStatus[source.id] = { ...prior, status: 'error', lastError: String(error), lastAttemptAt: now.toISOString() };
    console.error(`✗ ${source.name}: ${error}`);
  }
}

const previousOutput = await loadJson(CANDIDATES_URL, null);
const keepAfter = now.getTime() - 7 * 24 * 60 * 60 * 1000;
const carriedForward = (previousOutput?.candidates || []).filter(item => {
  const published = new Date(item.publishedAt).getTime();
  return Number.isFinite(published) && published >= keepAfter;
});

const byUrl = new Map(carriedForward.map(item => [item.url, item]));
for (const candidate of all) {
  const current = byUrl.get(candidate.url);
  if (!current || candidate.sourceQualityScore > current.sourceQualityScore || candidate.sourceId === current.sourceId) byUrl.set(candidate.url, candidate);
}
const candidates = [...byUrl.values()]
  .sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  .slice(0, 180);

const itemState = { ...previousState.items };
for (const item of candidates) itemState[item.url] = {
  sourceId: item.sourceId,
  title: item.title,
  description: item.description,
  publishedAt: item.publishedAt,
  discoveredAt: item.discoveredAt,
  lastSeenAt: item.lastSeenAt,
  lastmod: item.sourceLastModified
};

const stableCandidates = candidates.map(({ lastSeenAt, ...item }) => item);
const newOutput = { version: 3, updatedAt: now.toISOString(), candidates: stableCandidates };
const comparable = value => JSON.stringify(value?.candidates || []);
const dataChanged = comparable(previousOutput) !== comparable(newOutput);

if (dataChanged || !previousOutput) {
  await writeFile(CANDIDATES_URL, JSON.stringify(newOutput, null, 2));
  await writeFile(STATE_URL, JSON.stringify({ version: 3, items: itemState, sourceStatus }, null, 2));
  console.log(`✓ wrote ${stableCandidates.length} candidates (data changed)`);
} else {
  await writeFile(STATE_URL, JSON.stringify({ version: 3, items: itemState, sourceStatus }, null, 2));
  console.log(`= no candidate changes; preserving committed candidate timestamp`);
}
