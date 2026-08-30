# Project OS — Portfolio PM Dashboard

> Executive control plane for all Project-OS-managed projects.

## What the user should see
The dashboard is designed for decision-making, not version memorization.

Default user-facing fields:
- Project
- Health / readiness status
- Current objective
- Next safe action
- Ready to test? yes/no
- Main blocker / risk

Version labels, timestamps, commits and deployment IDs are kept underneath in project-local state and shown only when tracing, recovering or auditing a project.

## Portfolio View

| Project | Status | Current Objective | Next Safe Action | Ready to Test? | Main Risk / Blocker |
|---|---|---|---|---|---|
| TBAR | 🟢 GREEN | Keep Frozen V1 stable under Project OS | Map production version on next deployment cycle | Yes for current stable baseline | Production mapping not explicit |
| Taiwan MLB Tracker | 🔎 VERIFY | Preserve current stats / LINE / data architecture and onboard safely | Reconcile exact locked build, current commit and production; create project-local state | No | Historical version/session drift; freshness and desktop/phone sync |
| Cisco Replacement | 🔎 VERIFY | Preserve locked 7-layer customer-discovery architecture | Resolve canonical source and map the known locked baseline to commit/deployment | No | Source/deployment mapping incomplete |
| Project Eddie | 🔎 VERIFY | Preserve coach-tested scheduling product and add only drag-reschedule + simple statistics | Map coach-tested live site to source/deployment, then implement the two coach deltas only | No | Prior regression destroyed coach-testable flow; exact source mapping still needed |
| Personal Brand – Jon Wang | 🔎 VERIFY | Preserve approved visual direction and reconnect editable source | Reconnect source and map current production build | No | Source reconnection/version continuity |
| Project Concierge | 🔎 VERIFY | Preserve V1 scope: restaurant reservation + repeat shopping | Create project state when build resumes | No | Scope creep and external-workflow reliability |

## Hidden control layer — Project OS manages this automatically
For every project, Project OS maintains:
- CURRENT_LOCKED_VERSION
- CURRENT_APPROVED_VERSION
- GOLDEN_BASELINE
- PRODUCTION_VERSION
- Exact timestamp / timezone
- Git commit / deployment mapping
- Feature Manifest / Stable Core
- Active Delta Contract
- Known issues
- Cross-device regression status

The user should not need to remember these values. Project OS must recover and compare them automatically before work resumes.

## Global UI Rule — applies to every user-facing project
One shared UI/UX product baseline across **iPhone, iPad/tablet, and desktop browser**.

Allowed: responsive layout adaptation, density changes, column rearrangement, spacing and touch-target changes.

Not allowed: separate platform versions, divergent navigation, stale desktop while mobile is updated, stale mobile while tablet/desktop is updated, or different business logic/content by device unless explicitly documented as an approved exception.

## Status meanings
- 🟢 GREEN — deployed, production tested, core regression passed, docs/state verified. Safe user testing.
- 🟡 YELLOW — active work/testing/deployment incomplete. Do not ask user to test.
- 🔴 RED — blocked or critical failure. Do not ask user to test.
- ⚪ PAUSED — state preserved and intentionally inactive.
- 🔎 VERIFY — project exists and useful evidence is known, but version/source/deployment must be reconciled before new work.

## Portfolio PM rules
1. The user should never need to choose or remember version numbers.
2. Project-local state is the source of truth; Portfolio is a summary only.
3. Never infer project health from chat recency or latest commit alone.
4. When a project changes materially, update project-local state first; Portfolio second.
5. If Portfolio and project state conflict, project state wins unless proven stale by repository/deployment evidence.
6. If project state and production conflict, mark VERIFY/YELLOW/RED; never guess.
7. Cross-project priorities live here; implementation decisions stay inside each project.
8. Cross-device consistency is mandatory for every UI project.

## User-facing commands
The intended interaction is simple:
- `@Project OS Show my projects`
- `@Project OS Continue Eddie`
- `@Project OS Continue MLB`
- `@Project OS Cisco Replacement — add this, keep everything else`
- `@Project OS Debug only — do not add requirements`
- `@Project OS Lock this version`

The user states the project and intent. Project OS owns version recovery, baseline selection, session recovery, regression scope, deployment verification and status reporting.

## Why this scales
Each project is a self-contained state machine. Portfolio PM reads only health, objective, next action and blockers. Detailed requirements and versions remain inside each project's state, preventing cross-project mixing and removing the need for the user to remember version history.
