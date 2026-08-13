function tokens(text) { return new Set(text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff ]/g,' ').split(/\s+/).filter(t=>t.length>2)); }
export function titleSimilarity(a,b) { const A=tokens(a), B=tokens(b); const common=[...A].filter(x=>B.has(x)).length; return common/(new Set([...A,...B]).size||1); }
export function clusterStories(stories, threshold=.48) { const clusters=[]; for (const story of stories) { const match=clusters.find(c=>titleSimilarity(c[0].title,story.title)>=threshold); if(match)match.push(story);else clusters.push([story]); } return clusters; }
export function chooseCanonical(cluster) { return [...cluster].sort((a,b)=>b.sourceQualityScore-a.sourceQualityScore||b.tbarScore-a.tbarScore)[0]; }
