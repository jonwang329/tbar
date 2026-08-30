# Project OS — Portfolio PM Dashboard

> Cross-project control plane. This dashboard manages status and continuity, not project implementation details.

## Design principle
Each project owns its own `PROJECT_STATE.md`. The Portfolio PM reads only the summary contract from each project and never assumes that newest commit = approved version.

## Portfolio View

| Project | Repo / canonical source | Status | Current Approved Version | Production Version | Current Objective | Next Action | Risk / Blocker | Project State |
|---|---|---|---|---|---|---|---|---|
| TBAR | jonwang329/tbar | 🟡 YELLOW | Frozen V1 output structure | VERIFY | Integrate Project OS without changing product behavior | Finish docs linkage + verify state | Production mapping not explicit | `PROJECT_STATE.md` |
| Taiwan MLB Tracker | jonwang329/taiwan-mlb-tracker- | ⚪ UNREGISTERED | Read project state before assuming | VERIFY | Register under Project OS | Create/verify `PROJECT_STATE.md` | Version/session drift historically high | pending |
| Project Eddie | canonical source to register | ⚪ UNREGISTERED | Do not guess | VERIFY | Register stable approved build | Identify canonical source + state | Source/version continuity | pending |
| Personal Brand – Jon Wang | canonical source to register | ⚪ UNREGISTERED | Do not guess | VERIFY | Register approved visual baseline | Identify canonical source + state | Source reconnection/version continuity | pending |

## Status meanings
- 🟢 GREEN — deployed, production tested, core regression passed, docs/state verified.
- 🟡 YELLOW — active but work/testing/deployment/state verification incomplete.
- 🔴 RED — blocked or critical failure.
- ⚪ PAUSED / UNREGISTERED — state preserved or not yet onboarded into Project OS.

## Portfolio PM rules
1. Never open all project code just to build the dashboard.
2. Read each project's `PROJECT_STATE.md` and release/version metadata.
3. Show only management-level fields: status, baseline, production, objective, next action, blocker.
4. When a project changes materially, update its own state first; dashboard second.
5. If dashboard and project state conflict, project state wins unless evidence shows it is stale.
6. If project state and production conflict, mark VERIFY/RED/YELLOW; never guess.
7. Cross-project priorities may be managed here, but implementation decisions stay inside the project.

## Weekly / session-level PM view
For each active project answer:
- Is the approved baseline known?
- Is production mapped to a version/commit?
- Is there an active Delta Contract?
- Is there a blocker?
- What is the next safe action?
- Is user testing actually ready?

## Registration checklist for a new project
A project becomes Project-OS-managed when it has:
- `PROJECT_STATE.md`
- CURRENT_APPROVED_VERSION
- GOLDEN_BASELINE
- PRODUCTION_VERSION or explicit VERIFY status
- Current objective
- Stable Core / Feature Manifest
- Active Delta Contract or explicit no-active-change state
- README / AGENTS linkage
- Repository/canonical-source mapping

## Why this scales to 5–20 projects
The Portfolio PM does not retain every requirement for every project. Each project is a self-contained state machine. The dashboard holds only pointers and health summaries, so adding projects does not make one giant context window or mix requirements between projects.
