# Project OS — Portfolio PM Dashboard

> Cross-project control plane. This dashboard manages status and continuity, not project implementation details.

## Design principle
Each project owns its own `PROJECT_STATE.md`. The Portfolio PM reads only the summary contract from each project and never assumes that newest commit = approved version.

## Portfolio View

| Project | Repo / canonical source | Status | Current Locked / Approved Version | Production Version | Current Objective | Next Action | Risk / Blocker | Project State |
|---|---|---|---|---|---|---|---|---|
| TBAR | jonwang329/tbar | 🟢 GREEN | Frozen V1 output structure | VERIFY | Project OS pilot integrated without changing product behavior | Map production version on next deployment cycle | Production mapping not explicit | `PROJECT_STATE.md` |
| Taiwan MLB Tracker | jonwang329/taiwan-mlb-tracker- | 🔎 VERIFY | Canonical project context recovered; exact current locked version still to reconcile | VERIFY | Onboard into Project OS while preserving current stats/LINE/data architecture | Create project-local `PROJECT_STATE.md`; map current commit/deployment; preserve cross-device baseline | Historical version/session drift; data freshness and desktop/phone sync are critical | pending |
| Cisco Replacement | canonical project source to resolve | 🔎 VERIFY | `v1.0-FIX2` — locked 2026-08-29 18:24 TPE; 7-layer guided customer-discovery architecture | VERIFY | Preserve locked baseline and onboard into Project OS | Resolve canonical source; create project-local `PROJECT_STATE.md`; map commit/deployment | Baseline identity known, canonical source mapping still incomplete | pending |
| Project Eddie | Library canonical context + V16/V17 prototype files | 🔎 VERIFY | V16 = locked scheduling-rule baseline; V17 = Test Mode increment on top of V16; exact deployed lineage to reconcile | VERIFY | Restore coach-testable canonical build without regressing scheduling logic | Create `PROJECT_STATE.md`; compare V16/V17 against last deployed/tested build; preserve Test Mode isolation | Prior regression made coach testing unusable; version lineage and deployment mapping must be reconciled | pending |
| Personal Brand – Jon Wang | Library canonical project files; public site known | 🔎 VERIFY | Approved visual direction recovered; exact latest approved visual build not yet mapped | VERIFY | Reconnect editable source and preserve approved visual baseline | Create `PROJECT_STATE.md`; reconnect source; map deployment/version | Source reconnection/version continuity | pending |
| Project Concierge | Library `Project_Concierge_Context.md` | 🔎 VERIFY | V1 scope recovered: restaurant reservation + repeat shopping; no universal-assistant expansion | N/A/VERIFY | Preserve V1 scope and onboard when active | Create `PROJECT_STATE.md` when build resumes | Scope creep risk; external workflow reliability | pending |

## Global UI Rule — applies to every user-facing project
One shared UI/UX product baseline across **iPhone, iPad/tablet, and desktop browser**.

Allowed: responsive layout adaptation, density changes, column rearrangement, spacing and touch-target changes.

Not allowed: separate platform versions, divergent navigation, stale desktop while mobile is updated, stale mobile while tablet/desktop is updated, or different business logic/content by device unless explicitly documented as an approved exception.

## Status meanings
- 🟢 GREEN — deployed, production tested, core regression passed, docs/state verified.
- 🟡 YELLOW — active but work/testing/deployment incomplete.
- 🔴 RED — blocked or critical failure.
- ⚪ PAUSED — state preserved and intentionally inactive.
- 🔎 VERIFY — known project/version evidence exists, but canonical source/version/deployment mapping is not yet fully reconciled.

## Portfolio PM rules
1. Never open all project code just to build the dashboard.
2. Read each project's `PROJECT_STATE.md` and release/version metadata.
3. Show only management-level fields: status, baseline, production, objective, next action, blocker.
4. When a project changes materially, update its own state first; dashboard second.
5. If dashboard and project state conflict, project state wins unless evidence shows it is stale.
6. If project state and production conflict, mark VERIFY/RED/YELLOW; never guess.
7. Cross-project priorities may be managed here, but implementation decisions stay inside the project.
8. Conversation memory can help locate a record but cannot overwrite canonical project-local state.
9. Cross-device consistency is a portfolio-level non-negotiable rule for every UI project.

## Weekly / session-level PM view
For each active project answer:
- Is the locked/approved baseline known?
- Is production mapped to a version/commit?
- Is there an active Delta Contract?
- Is there a blocker?
- What is the next safe action?
- Is user testing actually ready?
- Are phone/tablet/desktop on the same product baseline?

## Registration checklist for a new project
A project becomes fully Project-OS-managed when it has:
- `PROJECT_STATE.md`
- CURRENT_LOCKED_VERSION and/or CURRENT_APPROVED_VERSION
- GOLDEN_BASELINE
- PRODUCTION_VERSION or explicit VERIFY status
- Exact lock timestamp when applicable
- Current objective
- Stable Core / Feature Manifest
- Supported device classes and cross-device baseline rule
- Active Delta Contract or explicit no-active-change state
- README / AGENTS linkage
- Repository/canonical-source mapping

## Why this scales to 5–20 projects
The Portfolio PM does not retain every requirement for every project. Each project is a self-contained state machine. The dashboard holds only pointers and health summaries, so adding projects does not make one giant context window or mix requirements between projects.
