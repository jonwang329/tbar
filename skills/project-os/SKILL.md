# Project OS — PM + SA + Execution Control

## Purpose
Project OS is a reusable development operating system for software/project work. It exists to prevent requirement loss, wrong-version work, session drift, accidental regression, incomplete deployment, and repeated re-explanation.

The system is intentionally broader than coding. It coordinates project management, system analysis, change control, session recovery, version control, stable-core protection, execution, regression QA, deployment verification, documentation, and handoff.

## Invocation intent
Use this skill before starting meaningful project design, debugging, feature work, UI changes, data changes, deployment work, or when resuming a project after a session/time gap.

## Operating model

PORTFOLIO PM → PROJECT PM → SA → CHANGE CONTROL → EXECUTION → QA/REGRESSION → DEPLOY/VERIFY → VERSION/HANDOFF

---

## 1. Portfolio PM — Cross-project management

Goal: manage multiple projects without mixing their implementation details.

The Portfolio PM reads only each project's state contract, not every project file.

For each project track:
- Project name
- Repository / canonical source
- Current status: GREEN / YELLOW / RED / PAUSED
- Current Approved Version
- Production Version
- Last verified timestamp
- Current objective
- Next action
- Blockers / risks
- Owner / environment if relevant
- Link/path to PROJECT_STATE.md

Rules:
- Never infer project health from chat recency alone.
- Never treat latest commit as approved production automatically.
- Portfolio PM is a control plane, not the place where project details are stored.
- Project details remain inside each project.

---

## 2. Project PM — Scope, priorities, decisions, backlog

Before implementation, maintain the project's working truth:
- Objective / user outcome
- Current scope
- In scope / explicitly out of scope
- Approved decisions
- Pending decisions
- Backlog
- Current priority
- Done / in progress / next
- Dependencies
- Risks / blockers

Rules:
- New requests are deltas to the current approved product unless explicitly declared a redesign.
- Do not silently drop earlier approved requirements.
- Separate 'idea', 'approved requirement', 'in progress', 'deployed', and 'verified'.
- Do not mark work done just because code exists.

---

## 3. SA — System Analysis

Before changing architecture or behavior:
- Read README.md, AGENTS.md, PROJECT_STATE.md, relevant code and deployment configuration.
- Identify current system architecture and data flow.
- Identify source of truth for data and configuration.
- Identify dependencies and affected components.
- Identify root cause before stacking patches.
- Determine blast radius and regression surface.
- Identify whether the issue is UI, data, state, infrastructure, deployment, cache, timing, auth, or version mismatch.

Required output before non-trivial work:
- Current behavior
- Expected behavior
- Root cause / best-supported hypothesis
- Files/components likely affected
- What must not change

---

## 4. Requirement & Change Control

Every meaningful change should be represented as a Delta Contract:

### Delta Contract
- Change request
- Why it matters
- Acceptance criteria
- Protected behavior / do-not-change list
- Affected surface
- Regression checks
- Deployment required? yes/no

Rules:
- Modify the delta, not rebuild the whole product.
- Preserve approved UX and features unless explicitly changed.
- If a request conflicts with an approved decision, surface the conflict before implementation.
- Avoid scope creep during debug-only cycles.

---

## 5. Session Control & Recovery

When starting or resuming after a session/time gap:

1. Read PROJECT_STATE.md.
2. Read CURRENT_APPROVED_VERSION and Golden Baseline.
3. Check current repository head / relevant recent commit.
4. Check production deployment/version if applicable.
5. Compare Pending Change with deployed state.
6. Read README.md and AGENTS.md.
7. Only then resume work.

Session Recovery must answer:
- What project am I in?
- What is the approved baseline?
- What is actually in production?
- What changed since approval?
- What was pending when work stopped?
- What is the next safe action?

Never reconstruct state from vague conversational memory when project state is available.

---

## 6. Version Control

Version identity must include:
- Version label
- Date
- Exact time / timezone when relevant
- Git commit SHA
- Deployment identifier / URL if applicable
- Status
- Test result

Maintain these separately:
- CURRENT_APPROVED_VERSION
- GOLDEN_BASELINE
- LATEST_COMMIT
- PRODUCTION_VERSION
- EXPERIMENTAL_VERSION / branch when applicable

Rules:
- Latest != Approved.
- Deployed != Verified.
- Verified != Approved unless approval is recorded.
- Never silently replace the Golden Baseline with a newer rough version.
- When the user references a time such as 'five minutes ago', retrieve the version from that time window before substituting any older version.

---

## 7. Feature Manifest & Stable Core Protection

Each approved version should have a Feature Manifest containing the important capabilities and UX decisions that must survive future changes.

For every protected feature record:
- Feature name
- Expected behavior
- Critical UI/data requirement
- Regression test
- Status

Before deployment, compare changed behavior with the Feature Manifest.

Rule: a new feature cannot silently delete or simplify an approved stable-core feature.

---

## 8. Execution Engine

The implementation cycle is:

UNDERSTAND → CHECK → FIX → TEST → DEPLOY → TEST PRODUCTION AGAIN → VERIFY DOCS → UPDATE STATE → REPORT

Execution rules:
- Make the smallest coherent change that fixes the root cause.
- Do not accumulate unrelated hotfix layers.
- Do not stop at code generation.
- A commit or push is not completion.
- Production deployment must be verified in the actual user-facing environment when deployment is part of the task.

---

## 9. QA & Regression Control

Testing has two layers:

### Change-specific test
Verify the exact requested change and acceptance criteria.

### Regression test
Verify protected nearby and core behavior, based on:
- Feature Manifest
- Affected dependency surface
- Known past failure modes
- Mobile / desktop behavior where relevant
- Data freshness / refresh behavior where relevant
- Navigation / back flow / language switching / auth where relevant

Never announce READY TO TEST if regression-critical behavior is known to be broken.

---

## 10. Deployment, Documentation & Handoff

After successful implementation:
- Deploy if required.
- Test production.
- Update README.md if architecture, operation, setup, data source, deployment, or failure modes changed.
- Update AGENTS.md if execution rules changed.
- Update PROJECT_STATE.md.
- Record release/version/timestamp/commit/deployment/test result.
- Update Portfolio Dashboard summary if project status materially changed.

Status model:
- 🟢 GREEN — deployed + production tested + core regression passed + docs/state verified. READY TO TEST.
- 🟡 YELLOW — work/testing/deployment incomplete. User should not test yet.
- 🔴 RED — blocked or failed critical test/deployment/data source.
- ⚪ PAUSED — intentionally not active; state preserved.

---

## 11. Handoff Contract

At the end of a work cycle record:
- What changed
- What did not change
- Current Approved Version
- Production Version
- Test results
- Known issues
- Pending work
- Next recommended action

This contract allows a new session or another agent to continue safely.

---

## 12. Anti-patterns Project OS must prevent

- Starting from an old version after switching sessions.
- Rebuilding a UI from scratch for a small change.
- Losing features because only the latest request was remembered.
- Saying 'done' after a commit without deployment verification.
- Testing only the changed button and missing regressions elsewhere.
- Treating production as current simply because a URL loads.
- Mixing several projects' requirements into one project state.
- Requiring the user to repeatedly ask 'Is it ready?'.

---

## Default behavior when invoked

1. Identify the project.
2. Recover project state.
3. Show a concise status summary.
4. Convert the new request into a Delta Contract.
5. Run SA before implementation.
6. Execute the change.
7. Run targeted + regression tests.
8. Deploy and verify when required.
9. Update version/state/docs.
10. Report traffic-light status and only say READY TO TEST when truly ready.
