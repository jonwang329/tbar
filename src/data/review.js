import { calculateTbarScore, selectLane } from './scoring.js';

const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const titleCase = value => value.split(/[-_]+/).filter(Boolean).map(word => word.length <= 3 ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)).join(' ');

export function readableTitle(item) {
  const raw = clean(item.title);
  if (raw && !/^https?:\/\//i.test(raw)) return raw;
  try {
    const url = new URL(item.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const slug = parts.at(-1) || parts.at(-2) || url.hostname;
    return titleCase(decodeURIComponent(slug));
  } catch {
    return raw || 'Untitled candidate';
  }
}

export function canonicalKey(item) {
  try {
    const url = new URL(item.url || item.sourceUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const path = url.pathname.replace(/\/+$/, '') || '/';
    if (host === 'moda.gov.tw') {
      const normalized = path.replace(/^\/en(?=\/)/, '');
      const id = normalized.match(/\/(\d+)$/)?.[1];
      return id ? `moda:${id}` : `moda:${normalized}`;
    }
    return `${host}:${path}`;
  } catch {
    return clean(item.url || item.sourceUrl || item.storyId).toLowerCase();
  }
}

function evidenceReasons(item) {
  const reasons = [];
  if (item.sourcePriority === 'P1') reasons.push('P1 source');
  if ((item.taiwanScore || 0) >= 80) reasons.push('Taiwan relevance');
  if ((item.businessScore || 0) >= 80) reasons.push('business impact');
  if ((item.importanceScore || 0) >= 80) reasons.push('high importance');
  if (item.leaderMatch) reasons.push('AI leader match');
  if ((item.freshnessScore || 0) >= 90) reasons.push('very fresh');
  return reasons.slice(0, 3);
}

function qualityPenalty(item) {
  const title = readableTitle(item);
  let penalty = 0;
  if (!clean(item.description || item.executiveSummary)) penalty += 5;
  if (title.length < 8) penalty += 6;
  if (/^(news and releases|background information|公告訊息|多媒體專區)$/i.test(title)) penalty += 12;
  return penalty;
}

function executiveRelevant(item) {
  if (item.contentType && ['interview','podcast','speech','keynote','fireside chat','q&a'].includes(String(item.contentType).toLowerCase())) return true;
  if (item.leaderMatch) return true;
  if ((item.importanceScore || 0) >= 88 && (item.businessScore || 0) >= 75) return true;
  if ((item.businessScore || 0) < 75) return false;
  const text = `${item.title || ''} ${item.description || ''} ${(item.topics || []).join(' ')}`.toLowerCase();
  return /(\bai\b|gpu|semiconductor|chip|data\s*center|datacenter|cloud|network|model|agent|inference|training|compute|capex|earnings|infrastructure|sovereign ai|power|cooling|open source|open model)/i.test(text);
}

export function toReviewCandidate(item) {
  const normalized = {
    ...item,
    url: item.url || item.sourceUrl,
    title: readableTitle(item),
    noveltyScore: Number.isFinite(item.noveltyScore) ? item.noveltyScore : 70
  };
  normalized.tbarScore = Math.max(0, calculateTbarScore(normalized) - qualityPenalty(normalized));
  normalized.lane = item.lane || selectLane(normalized);
  normalized.reviewStatus = 'pending';
  normalized.needsHumanReview = true;
  normalized.reviewReason = evidenceReasons(normalized).join(' · ') || 'monitor';
  normalized.canonicalKey = canonicalKey(normalized);
  return normalized;
}

function preferCandidate(a, b) {
  const aTitleQuality = /^https?:\/\//i.test(clean(a.title)) ? 0 : 1;
  const bTitleQuality = /^https?:\/\//i.test(clean(b.title)) ? 0 : 1;
  const aDescription = clean(a.description || a.executiveSummary).length;
  const bDescription = clean(b.description || b.executiveSummary).length;
  const aEnglishPenalty = /\/en\//.test(a.url || '') ? 1 : 0;
  const bEnglishPenalty = /\/en\//.test(b.url || '') ? 1 : 0;
  const aScore = a.tbarScore * 1000 + aTitleQuality * 100 + Math.min(aDescription, 99) - aEnglishPenalty;
  const bScore = b.tbarScore * 1000 + bTitleQuality * 100 + Math.min(bDescription, 99) - bEnglishPenalty;
  return bScore > aScore ? b : a;
}

export function buildReviewQueue(candidates, generatedAt = new Date().toISOString()) {
  const byKey = new Map();
  for (const raw of candidates || []) {
    const item = toReviewCandidate(raw);
    if (!executiveRelevant(item)) continue;
    const existing = byKey.get(item.canonicalKey);
    byKey.set(item.canonicalKey, existing ? preferCandidate(existing, item) : item);
  }

  const ranked = [...byKey.values()].sort((a, b) => b.tbarScore - a.tbarScore || new Date(b.publishedAt) - new Date(a.publishedAt));
  const take = (lane, limit) => ranked.filter(item => item.lane === lane).slice(0, limit);
  const queue = {
    version: 4,
    generatedAt,
    publishStatus: 'human_review_required',
    mustKnow: take('must_know', 3),
    importantSignals: take('important_signal', 5),
    deepDive: take('deep_dive', 2),
    watchlist: take('watchlist', 10)
  };
  queue.totalPending = queue.mustKnow.length + queue.importantSignals.length + queue.deepDive.length + queue.watchlist.length;
  return queue;
}
