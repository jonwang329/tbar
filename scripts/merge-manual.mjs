import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { SOURCE_REGISTRY, TAIWAN_COMPANIES, AI_LEADERS } from '../src/data/sourceRegistry.js';
import { freshnessScore } from '../src/data/scoring.js';

const INBOX_URL = new URL('../public/data/manual-inbox.json', import.meta.url);
const CANDIDATES_URL = new URL('../public/data/candidates.json', import.meta.url);
const hash = value => createHash('sha256').update(String(value)).digest('hex').slice(0, 20);
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();

async function loadJson(url, fallback) {
  try { return JSON.parse(await readFile(url, 'utf8')); } catch { return fallback; }
}

function score(item, source, now) {
  const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
  const contains = terms => terms.some(term => text.includes(term));
  const taiwanTerms = ['taiwan','台灣','台积电','台積電','聯發科','鴻海','廣達','緯創','緯穎','英業達','台達','智邦', ...TAIWAN_COMPANIES.map(x => x.toLowerCase())];
  const leaderTerms = AI_LEADERS.map(x => x.toLowerCase());
  const businessTerms = ['investment','投資','financing','finance','capital','revenue','營收','data center','datacenter','資料中心','gpu','compute','cloud','network','infrastructure','ai factory'];
  const importanceTerms = ['investment','投資','financing','capital','announce','宣布','infrastructure','gpu','compute','data center','ai factory'];
  return {
    freshnessScore: freshnessScore(item.publishedAt, now),
    sourceQualityScore: source.priority === 'P1' ? 88 : 78,
    taiwanScore: source.countries?.includes('Taiwan') || contains(taiwanTerms) ? 90 : 35,
    businessScore: contains(businessTerms) ? 85 : 60,
    importanceScore: contains(importanceTerms) ? 82 : 65,
    confidenceScore: 72,
    leaderMatch: contains(leaderTerms)
  };
}

const now = new Date();
const inbox = await loadJson(INBOX_URL, { items: [] });
const output = await loadJson(CANDIDATES_URL, { version: 3, candidates: [] });
const existingByUrl = new Map((output.candidates || []).map(item => [item.url, item]));
const sources = new Map(SOURCE_REGISTRY.map(source => [source.id, source]));

let added = 0;
for (const raw of inbox.items || []) {
  const source = sources.get(raw.sourceId);
  if (!source) {
    console.warn(`manual inbox skipped: unknown sourceId ${raw.sourceId}`);
    continue;
  }
  const url = clean(raw.url);
  if (!url) continue;
  const previous = existingByUrl.get(url);
  const publishedAt = raw.publishedAt || previous?.publishedAt || now.toISOString();
  const item = {
    id: previous?.id || `cand_${hash(`${source.id}|${url}`)}`,
    sourceLastModified: null,
    sourceId: source.id,
    sourceName: source.name,
    sourceKind: source.kind,
    sourcePriority: source.priority,
    url,
    title: clean(raw.title) || previous?.title || url,
    description: clean(raw.description) || previous?.description || '',
    publishedAt,
    discoveredAt: previous?.discoveredAt || now.toISOString(),
    topics: source.topics || [],
    countries: source.countries || [],
    ...score({ ...raw, publishedAt }, source, now)
  };
  existingByUrl.set(url, item);
  if (!previous) added += 1;
}

const keepAfter = now.getTime() - 7 * 24 * 60 * 60 * 1000;
const candidates = [...existingByUrl.values()]
  .filter(item => {
    const t = new Date(item.publishedAt).getTime();
    return Number.isFinite(t) && t >= keepAfter;
  })
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  .slice(0, 180);

const next = { version: 3, updatedAt: now.toISOString(), candidates };
const before = JSON.stringify(output.candidates || []);
const after = JSON.stringify(candidates);
if (before !== after) {
  await writeFile(CANDIDATES_URL, JSON.stringify(next, null, 2));
  console.log(`✓ merged manual inbox: ${added} new, ${candidates.length} total candidates`);
} else {
  console.log('= manual inbox produced no candidate changes');
}
