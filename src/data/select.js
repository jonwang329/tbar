export function buildDailyBrief(stories, generatedAt = new Date().toISOString()) {
  const ranked=[...stories].sort((a,b)=>b.tbarScore-a.tbarScore);
  return { generatedAt,
    mustKnow: ranked.filter(s=>s.lane==='must_know').slice(0,3),
    importantSignals: ranked.filter(s=>s.lane==='important_signal').slice(0,5),
    deepDive: ranked.filter(s=>s.lane==='deep_dive').slice(0,2),
    watchlist: ranked.filter(s=>s.lane==='watchlist')
  };
}
