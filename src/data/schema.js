/**
 * Canonical TBAR story shape. Runtime code uses plain objects so V1 has zero build dependencies.
 * Required timing fields: publishedAt, discoveredAt, processedAt, updatedAt.
 */
export const STORY_FIELDS = [
  'storyId','title','originalTitle','sourceName','sourceUrl','sourceType',
  'publishedAt','discoveredAt','processedAt','updatedAt','language','country','region',
  'contentType','people','companies','industries','topics','rawSummary','executiveSummary',
  'whatChanged','whyNow','whyItMatters','businessImpact','taiwanImpact','marketImpact',
  'keyQuotes','originalVideo','curatedVideo','durationMinutes','freshnessScore','importanceScore',
  'businessScore','taiwanScore','sourceQualityScore','confidenceScore','noveltyScore','tbarScore',
  'duplicateClusterId','lane','watchlistTopic','evidence'
];
