# TBAR — Taiwan Business & AI Radar

TBAR is a phone-first intelligence filter, not a news feed.

## Project OS — mandatory version control gate

This rule is mandatory before every user test and applies to every release, hotfix, data refresh, and UI change.

- Every testable release must expose or record **Version + Date + exact Time + commit SHA**.
- Keep one explicit **LOCKED STABLE BASELINE**. Never silently replace it with an older, alternate, or partially refreshed UI.
- Before any change, identify the current production version and compare it with the locked baseline.
- After any change, run regression checks for previously fixed critical behavior, not only the new delta.
- Data/snapshot refresh jobs must not alter UI structure, navigation, or stable product behavior unless the change explicitly requires it.
- If production differs from source, first determine whether the cause is an old deployment, alternate UI path, cache, branch mismatch, snapshot overwrite, or mixed assets. Do not ask the user to diagnose this.
- **READY TO TEST is forbidden** until production itself has been opened and verified against the expected version and locked baseline.
- If any prior fixed behavior regresses, status is **FAIL / NOT READY TO TEST**.
- When returning to the project in a later session, start from the latest locked stable baseline, never from a guessed or merely recent commit.

## LOCKED STABLE BASELINE
- Version: **TBAR V1.0**
- Date: **2026-09-05**
- Final UI/content commit: **69b4ba0c389c98c1f9a516451cd0fd44df307795**
- Production smoke-gate commit: **6eee46567e39bfb80403b33d72f0f43f20a53747**
- Production URL: **https://jonwang329.github.io/tbar/**
- Mandatory regression surface: bilingual toggle; four non-duplicated summaries; Must Know; Important Signals; list-style Key AI Voices with drill-in; Dario/Sam/Jensen/Elon P0; 哈佛老徐 interpreter/source separation; 簡立峰; all 10 tracked global leaders; Taiwan Intelligence including MODA, NCHC, MOEA, NDC, public procurement, major enterprise AI investment, 天下, 遠見, 商業周刊; Taiwan/Korea/Japan/Singapore Country Deep Dive; final Executive Dashboard/HPE opportunity.

## Frozen V1 output
1. Must Know — max 3
2. Important Signals — max 5
3. Deep Dive — 0–2 (event + strategic/country)
4. Watchlist — living signals

## Core pipeline
SOURCE → COLLECT → TIMESTAMP → NORMALIZE → STORY CLUSTER → SCORE → AI JUDGMENT → 1/2/3/4 OUTPUT

## Data principles
- Timeliness is a ranking input, with published/discovered/processed/updated timestamps.
- Primary sources are truth sources; curated sources such as WeChat/哈佛老徐 are discovery/interpretation sources.
- One event becomes one Story with multiple evidence sources, not duplicate headlines.
- Taiwan relevance and business impact are first-class scoring dimensions.

## Leader Intelligence
Track 10 global leaders: Dario Amodei, Sam Altman, Jensen Huang, Elon Musk, Demis Hassabis, Sundar Pichai, Satya Nadella, Lisa Su, Mark Zuckerberg, Andy Jassy. P0 priority is Dario / Sam / Jensen / Elon. Taiwan priority includes 簡立峰. 哈佛老徐 / 徐彬 is an Interpreter / Curator, never a primary source; original-speaker/source trail must remain separate from his interpretation.

## Taiwan Intelligence
Keep active official and high-value discovery sources including MODA/ADI, NCHC, MOEA, NDC, government/public procurement, major enterprise AI investment, 天下/CommonWealth, 遠見/Global Views, 商業周刊. Material claims should route back to primary evidence when available.

## Country Deep Dive
Taiwan / Korea / Japan / Singapore across GPU compute, AI data-center capacity, sovereign AI, cloud, near/middle-tier cloud, utilization/sharing, networking, power/cooling, enterprise adoption, policy/investment, and Taiwan opportunity gap.

## Production verification
Every GitHub Pages deployment includes a post-deploy smoke gate that fetches the live production URL and verifies the V1.0 version plus required sections/leader/source markers before the release can be treated as green.

## Local development
```bash
npm run test
npm run collect
python3 -m http.server 8000
```

The initial collector implements RSS sources first; HTML/manual adapters are explicitly registered but not silently scraped until source-specific adapters are implemented and validated.
