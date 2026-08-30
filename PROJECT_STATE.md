# TBAR — Project State Contract

> This file is the canonical session-recovery and version-control state for TBAR.

## Identity
- Project: TBAR — Taiwan Business & AI Radar
- Repository: jonwang329/tbar
- Canonical branch: main
- State status: 🟡 YELLOW — Project OS integration in progress

## Version Truth
- CURRENT_APPROVED_VERSION: TBAR Frozen V1 output structure
- GOLDEN_BASELINE: Existing production/working baseline prior to Project OS integration
- LATEST_COMMIT: 8278830a6006925a3ee7cdb9a4c271ff90b3f7c8
- PRODUCTION_VERSION: verify before claiming
- EXPERIMENTAL_VERSION: none recorded
- Last state update: 2026-08-30 Asia/Taipei

## Current Objective
Pilot the reusable Project OS system in TBAR without changing TBAR product behavior.

## Approved Product Core
TBAR is a phone-first intelligence filter, not a news feed.

Frozen V1 output:
1. Must Know — max 3
2. Important Signals — max 5
3. Deep Dive — 0–2
4. Watchlist — living signals

Core pipeline:
SOURCE → COLLECT → TIMESTAMP → NORMALIZE → STORY CLUSTER → SCORE → AI JUDGMENT → 1/2/3/4 OUTPUT

## Stable Core / Do Not Change During Project OS Integration
- Frozen V1 output structure
- Phone-first orientation
- Existing source/data principles
- Existing collector behavior
- Current application UI and runtime behavior

## Current Change — Delta Contract
- Change request: Add Project OS management structure and reusable skill.
- Why: improve PM, SA, session recovery, version control, regression protection, execution discipline, and cross-project continuity.
- Acceptance criteria:
  - reusable Project OS skill exists
  - project state contract exists
  - portfolio dashboard contract exists
  - AGENTS references the system
  - no TBAR application/product behavior changes
- Protected behavior: all existing TBAR product behavior.
- Deployment required: no product deployment required for documentation-only integration.

## Feature Manifest — Protected Core
| Feature | Expected behavior | Regression check | Status |
|---|---|---|---|
| Frozen V1 output | 3/5/0–2/watchlist structure preserved | README/product structure unchanged | Protected |
| Phone-first design | mobile orientation preserved | no app code changed | Protected |
| Core pipeline | collection/judgment pipeline preserved | no runtime code changed | Protected |
| Source principles | primary-source truth hierarchy preserved | README unchanged unless explicitly documented | Protected |

## PM Status
### Done
- Existing execution standard in AGENTS.md
- Project OS architecture defined
- Reusable `skills/project-os/SKILL.md` added

### In Progress
- Add portfolio dashboard template
- Link AGENTS.md to Project OS
- Verify documentation consistency

### Next
- Complete TBAR pilot documentation integration
- Use this model to register other active projects
- Package Project OS as an installable ChatGPT Plugin if desired

## Risks / Blockers
- Repository-local skill is not automatically an @-mentionable ChatGPT Plugin.
- Production version is not yet explicitly mapped in this state file and must not be guessed.

## Session Recovery Checklist
When resuming TBAR:
1. Read this file.
2. Read `skills/project-os/SKILL.md`.
3. Read README.md and AGENTS.md.
4. Check repo head and production separately.
5. Confirm current Delta Contract.
6. Continue from Next, not from conversation memory alone.

## Handoff
- What changed: Project OS reusable skill introduced.
- What did not change: TBAR product/runtime behavior.
- Known issues: production version mapping still needs explicit verification.
- Next safe action: finish documentation linkage and portfolio dashboard.
