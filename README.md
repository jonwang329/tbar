# TBAR — Taiwan Business & AI Radar

TBAR is a phone-first intelligence filter, not a news feed.

## Frozen V1 output
1. Must Know — max 3
2. Important Signals — max 5
3. Deep Dive — 0–2 (event + strategic/country)
4. Watchlist — living signals

## Core pipeline
SOURCE → COLLECT → TIMESTAMP → NORMALIZE → STORY CLUSTER → SCORE → AI JUDGMENT → 1/2/3/4 OUTPUT

## Data principles
- Timeliness is a ranking input, with published/discovered/processed/updated timestamps.
- Primary sources are truth sources; curated sources such as WeChat are discovery/interpretation sources.
- One event becomes one Story with multiple evidence sources, not duplicate headlines.
- Taiwan relevance and business impact are first-class scoring dimensions.

## Country Deep Dive
Taiwan / Korea / Japan / Singapore across GPU compute, AI data-center capacity, sovereign AI, cloud, near/middle-tier cloud, utilization/sharing, networking, power/cooling, enterprise adoption, policy/investment, and Taiwan opportunity gap.

## Local development
```bash
npm run test
npm run collect
python3 -m http.server 8000
```

The initial collector implements RSS sources first; HTML/manual adapters are explicitly registered but not silently scraped until source-specific adapters are implemented and validated.
