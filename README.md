# TBAR — Taiwan Business & AI Radar

TBAR is a phone-first executive intelligence filter, not a news feed.

## Project OS — release gate

- Every testable release records Version + Date + exact Time + commit SHA.
- Keep one explicit LOCKED STABLE BASELINE; never silently roll back UI or content.
- Data refresh jobs must not alter UI structure or stable behavior.
- READY TO TEST is forbidden until the deployed production page itself passes regression checks.
- If a previously fixed behavior regresses, status is NOT READY TO TEST.

## LOCKED STABLE BASELINE

- Version: **TBAR V1.1**
- Date: **2026-09-05**
- UI/content commit: **d19c900a3ba2b04525aec50fa1f5f540c58c1721**
- V1.1 smoke-gate commit: **e77c0c1f6782e2dd9d42b91d05f6ea9cc86b956a**
- Production: **https://jonwang329.github.io/tbar/**

Mandatory regression surface: Executive Snapshot with four distinct decision questions; Must Know without repeating snapshot stories; Important People / Video Intelligence with native mobile-safe drilldown; Dario, Sam, Jensen, Elon P0; all 10 tracked global leaders; 哈佛老徐 with video/source, key takeaways, why it matters, Taiwan lens, HPE lens, and original-source separation; 簡立峰; Taiwan Intelligence; Taiwan/Korea/Japan/Singapore Country Deep Dive; Executive Dashboard and HPE Opportunity.

## Output structure

1. Executive Snapshot — four different questions, not repeated headlines
2. Must Know — decision-relevant items without snapshot duplication
3. Important People / Video Intelligence — source/video plus synthesized takeaways
4. Taiwan Intelligence
5. Country Deep Dive — Taiwan / Korea / Japan / Singapore
6. Executive Dashboard + HPE Opportunity

## Leader Intelligence

Track 10 global leaders: Dario Amodei, Sam Altman, Jensen Huang, Elon Musk, Demis Hassabis, Sundar Pichai, Satya Nadella, Lisa Su, Mark Zuckerberg, Andy Jassy. P0 priority: Dario / Sam / Jensen / Elon. Taiwan priority includes 簡立峰.

哈佛老徐 / 徐彬 is an Interpreter / Curator, never the sole primary source for material facts. His entries must show what was said, important evidence or numbers, why it matters, Taiwan lens, HPE lens, video/source, and an original-source trail when available.

## Mobile interaction rule

Important People / Video Intelligence uses native HTML details/summary drilldown. A row that looks clickable but does not open on mobile is a release blocker.

## Data principles

SOURCE → COLLECT → TIMESTAMP → NORMALIZE → STORY CLUSTER → SCORE → AI JUDGMENT → OUTPUT

Primary sources are truth sources; curated sources are discovery/interpretation sources. One event becomes one story with multiple evidence sources, not duplicate headlines. Timeliness, Taiwan relevance, and business impact are first-class ranking inputs.

## Taiwan Intelligence

Keep active official and high-value sources including MODA/ADI, NCHC, MOEA, NDC, public procurement, major enterprise AI investment, 天下/CommonWealth, 遠見/Global Views, and 商業周刊. Material claims should route back to primary evidence when available.

## Production verification

The GitHub Pages post-deploy smoke gate must verify TBAR V1.1, distinct Executive Snapshot, native leader drilldown, 哈佛老徐 video/source intelligence, Why/Taiwan/HPE lenses, all tracked leaders, Taiwan Intelligence, Country Deep Dive, Executive Dashboard, and HPE Opportunity before GREEN.

## Local checks

Use `npm run test`, `npm run collect`, and `npm run build` before deployment when relevant.