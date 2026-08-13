import test from 'node:test';
import assert from 'node:assert/strict';
import { readableTitle, canonicalKey, buildReviewQueue } from '../src/data/review.js';

const base = {
  sourceId: 'test', sourceName: 'Test', sourceKind: 'primary', sourcePriority: 'P1',
  publishedAt: '2026-08-13T12:00:00Z', discoveredAt: '2026-08-13T12:01:00Z',
  freshnessScore: 100, sourceQualityScore: 96, taiwanScore: 35,
  businessScore: 85, importanceScore: 82, confidenceScore: 95, leaderMatch: false
};

test('readableTitle converts URL-only titles into readable text', () => {
  const title = readableTitle({ title:'https://openai.com/index/virgin-atlantic/chatgpt-work', url:'https://openai.com/index/virgin-atlantic/chatgpt-work' });
  assert.equal(title, 'Chatgpt Work');
});

test('MODA Chinese and English variants share one canonical key', () => {
  assert.equal(
    canonicalKey({ url:'https://moda.gov.tw/en/press/370' }),
    canonicalKey({ url:'https://moda.gov.tw/press/370' })
  );
});

test('review queue deduplicates, respects lane caps and requires human review', () => {
  const candidates = [
    { ...base, id:'a', url:'https://moda.gov.tw/en/press/370', title:'News and Releases', description:'' },
    { ...base, id:'b', url:'https://moda.gov.tw/press/370', title:'台灣 AI 基礎建設投資公告', description:'政府公布新的 AI infrastructure investment plan.', taiwanScore:90 },
    ...Array.from({ length: 8 }, (_, i) => ({
      ...base, id:`signal-${i}`, url:`https://example.com/story-${i}`,
      title:`AI infrastructure investment signal ${i}`,
      description:'Major business and infrastructure update.', taiwanScore:90
    }))
  ];
  const queue = buildReviewQueue(candidates, '2026-08-13T12:05:00Z');
  const all = [...queue.mustKnow, ...queue.importantSignals, ...queue.deepDive, ...queue.watchlist];
  assert.equal(all.filter(x => x.canonicalKey === 'moda:370').length, 1);
  assert.ok(queue.mustKnow.length <= 3);
  assert.ok(queue.importantSignals.length <= 5);
  assert.ok(queue.deepDive.length <= 2);
  assert.ok(queue.watchlist.length <= 10);
  assert.equal(queue.publishStatus, 'human_review_required');
  assert.ok(all.every(x => x.needsHumanReview === true && x.reviewStatus === 'pending'));
});
