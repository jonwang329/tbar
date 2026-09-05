import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { SOURCE_REGISTRY, TAIWAN_COMPANIES, AI_LEADERS } from '../src/data/sourceRegistry.js';
import { freshnessScore } from '../src/data/scoring.js';

const INBOX_URL = new URL('../public/data/manual-inbox.json', import.meta.url);
const CURATED_URL = new URL('../public/data/curated-intelligence.json', import.meta.url);
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
  const businessTerms = ['investment','投資','financing','capital','revenue','營收','data center','datacenter','資料中心','gpu','compute','cloud','network','infrastructure','ai factory'];
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

function isExecutiveRelevant(item) {
  if (item.curated) return true;
  const type = String(item.contentType || '').toLowerCase();
  if (['interview','podcast','speech','keynote','fireside chat','q&a'].includes(type)) return true;
  if (item.leaderMatch) return true;
  const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
  return /(\bai\b|artificial intelligence|人工智慧|人工智能|gpu|compute|算力|inference|training|agentic|\bagent\b|model|llm|data\s*center|datacenter|資料中心|ai factory|sovereign ai|open model|open source ai)/i.test(text);
}

const now = new Date();
const inbox = await loadJson(INBOX_URL, { items: [] });
const curated = await loadJson(CURATED_URL, { items: [] });
const output = await loadJson(CANDIDATES_URL, { version: 4, candidates: [] });
const existingByUrl = new Map((output.candidates || []).map(item => [item.url || item.sourceUrl, item]));
const sources = new Map(SOURCE_REGISTRY.map(source => [source.id, source]));

for (const raw of inbox.items || []) {
  const source = sources.get(raw.sourceId);
  if (!source) continue;
  const url = clean(raw.url);
  if (!url) continue;
  const previous = existingByUrl.get(url);
  const publishedAt = raw.publishedAt || previous?.publishedAt || now.toISOString();
  existingByUrl.set(url, {
    id: previous?.id || `cand_${hash(`${source.id}|${url}`)}`,
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
  });
}

for (const raw of curated.items || []) {
  const url = clean(raw.sourceUrl || raw.url);
  if (!url) continue;
  existingByUrl.set(url, {
    ...raw,
    id: raw.storyId || `curated_${hash(url)}`,
    url,
    curated: true,
    sourcePriority: 'P1',
    discoveredAt: raw.discoveredAt || now.toISOString(),
    description: raw.description || raw.executiveSummary || ''
  });
}

const sevenDays = now.getTime() - 7 * 24 * 60 * 60 * 1000;
const thirtyDays = now.getTime() - 30 * 24 * 60 * 60 * 1000;
const candidates = [...existingByUrl.values()]
  .filter(isExecutiveRelevant)
  .filter(item => {
    const t = new Date(item.publishedAt || item.discoveredAt).getTime();
    if (!Number.isFinite(t)) return false;
    return item.curated ? t >= thirtyDays : t >= sevenDays;
  })
  .sort((a, b) => {
    if (!!a.curated !== !!b.curated) return a.curated ? -1 : 1;
    const as = (a.importanceScore || 0) + (a.businessScore || 0);
    const bs = (b.importanceScore || 0) + (b.businessScore || 0);
    return bs - as || new Date(b.publishedAt) - new Date(a.publishedAt);
  })
  .slice(0, 60);

await writeFile(CANDIDATES_URL, JSON.stringify({ version: 5, updatedAt: now.toISOString(), candidates }, null, 2));
console.log(`✓ TBAR publish gate: ${candidates.length} executive-relevant candidates`);
