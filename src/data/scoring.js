const clamp = n => Math.max(0, Math.min(100, Math.round(n)));
export function freshnessScore(publishedAt, now = new Date()) {
  const hours = Math.max(0, (now.getTime() - new Date(publishedAt).getTime()) / 3_600_000);
  if (hours <= 1) return 100; if (hours <= 3) return 95; if (hours <= 6) return 90;
  if (hours <= 12) return 82; if (hours <= 24) return 70; if (hours <= 48) return 50;
  if (hours <= 96) return 30; return 10;
}
export function calculateTbarScore(s) {
  return clamp(s.importanceScore*.30 + s.businessScore*.20 + s.taiwanScore*.20 + s.freshnessScore*.15 + s.sourceQualityScore*.10 + s.noveltyScore*.05);
}
export function selectLane(s) {
  if (s.tbarScore >= 82 && s.importanceScore >= 80 && s.confidenceScore >= 70) return 'must_know';
  if (s.tbarScore >= 68 && s.confidenceScore >= 60) return 'important_signal';
  if (s.importanceScore >= 78 && s.confidenceScore >= 75) return 'deep_dive';
  return 'watchlist';
}
