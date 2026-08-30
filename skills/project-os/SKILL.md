# Project OS — PM + SA + Execution Control

## Purpose
Project OS is a reusable development operating system for software/project work. It exists to prevent requirement loss, wrong-version work, session drift, accidental regression, incomplete deployment, repeated re-explanation, and cross-device UX divergence.

The system is intentionally broader than coding. It coordinates project management, system analysis, change control, session recovery, version control, stable-core protection, execution, regression QA, deployment verification, documentation, handoff, and cross-device consistency.

## Invocation intent
Use this skill before starting meaningful project design, debugging, feature work, UI changes, data changes, deployment work, or when resuming a project after a session/time gap.

## Operating model

PORTFOLIO PM → PROJECT PM → SA → CHANGE CONTROL → SESSION/VERSION CONTROL → EXECUTION → QA/REGRESSION → DEPLOY/VERIFY → VERSION/HANDOFF

## Canonical Truth Priority — mandatory
When sources disagree, use this order:

1. Project-local `PROJECT_STATE.md` / explicit locked baseline record
2. Project-local release/version ledger and Feature Manifest
3. Verified Git commit + deployment mapping
4. README / AGENTS / canonical project context
5. Portfolio Dashboard summary
6. Conversation history / memory
7. Guessing — never use when any higher source exists

Rules:
- Portfolio PM must never override project-local canonical state.
- Chat memory is supporting evidence, not the source of truth.
- A user statement such as “lock this version” must be persisted into project-local state during the same work cycle.
- If a locked version contains known defects, keep it as the baseline and record the defects separately. Do not silently replace the architecture baseline with a later rough fix.

## Global Cross-Device Consistency Rule — mandatory for every UI project
All user-facing projects must maintain one shared interface / UI / UX baseline across iPhone, iPad/tablet, and desktop browser.

Allowed:
- Responsive rearrangement for screen size
- Different column counts, spacing, typography scale, touch targets, and information density
- Desktop may expose more information simultaneously when the same underlying hierarchy and workflow are preserved

Not allowed:
- Separate product versions per device
- Different navigation logic, feature availability, labels, wording, or business rules by device unless explicitly required and recorded
- Mobile being updated while desktop/tablet remains stale, or vice versa
- Rebuilding one platform independently and losing approved behavior from another

Cross-device regression must verify:
- Same feature set and business logic
- Same information architecture and navigation intent
- Same canonical data/state
- Same labels/content meaning
- Responsive adaptation only, not product forks

Any deliberate platform-specific exception must be recorded in the project's Feature Manifest and Delta Contract.

---

## 1. Portfolio PM — Cross-project management
Goal: manage multiple projects without mixing their implementation details.

The Portfolio PM reads only each project's state contract, not every project file.

For each project track:
- Project name
- Repository / canonical source
- Current status: GREEN / YELLOW / RED / PAUSED / VERIFY
- Current Approved or Locked Version
- Production Version
- Last verified timestamp
- Current objective
- Next action
- Blockers / risks
- Link/path to PROJECT_STATE.md

Rules:
- Never infer project health from chat recency alone.
- Never treat latest commit as approved production automatically.
- Portfolio PM is a control plane, not the place where project details are stored.
- Project details remain inside each project.
- If Portfolio and project state conflict, project state wins unless proven stale by repository/deployment evidence.

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
- Separate idea, approved requirement, in progress, final/locked, deployed, verified, and formally approved.
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
- For UI work, identify all supported device classes and verify the shared UX baseline before changing one viewport.

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
- Affected device classes
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

1. Identify the exact project.
2. Read project-local `PROJECT_STATE.md` first.
3. Read CURRENT_APPROVED_VERSION / LOCKED_VERSION and GOLDEN_BASELINE.
4. Read known remaining issues and Pending Change.
5. Check current repository head / relevant recent commit.
6. Check production deployment/version if applicable.
7. Compare project state, repo and production.
8. Read README.md and AGENTS.md.
9. Only then resume work.

Session Recovery must answer:
- What project am I in?
- What is the locked/approved baseline?
- When was it locked?
- What features define that baseline?
- What is actually in production?
- What changed since the lock?
- What was pending when work stopped?
- What is the next safe action?

Never reconstruct state from vague conversational memory when project state is available.

---

## 6. Version Control
Version identity must include:
- Version label
- Date
- Exact time and timezone
- Git commit SHA when available
- Deployment identifier / URL if applicable
- Status
- Test result
- User lock/approval status
- Known defects that do not invalidate the baseline

Maintain these separately:
- CURRENT_LOCKED_VERSION
- CURRENT_APPROVED_VERSION
- GOLDEN_BASELINE
- LATEST_COMMIT
- PRODUCTION_VERSION
- EXPERIMENTAL_VERSION / branch when applicable

Rules:
- Latest != Locked.
- Locked != Formally Approved unless explicitly approved.
- Deployed != Verified.
- Verified != Approved unless approval is recorded.
- Never silently replace the Golden Baseline with a newer rough version.
- When the user references a time such as 'five minutes ago', retrieve the version from that time window before substituting any older version.
- Every lock event must update `PROJECT_STATE.md` immediately.

---

## 7. Feature Manifest & Stable Core Protection
Each approved or locked version should have a Feature Manifest containing the important capabilities and UX decisions that must survive future changes.

For every protected feature record:
- Feature name
- Expected behavior
- Critical UI/data requirement
- Supported device classes
- Cross-device consistency requirement
- Regression test
- Status

Before deployment, compare changed behavior with the Feature Manifest.

Rules:
- A new feature cannot silently delete or simplify an approved stable-core feature.
- A change made for one device must not regress another supported device.

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
- For UI work, treat phone, tablet and desktop as one product baseline and test all supported device classes before completion.

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
- Phone / tablet / desktop consistency
- Data freshness / refresh behavior where relevant
- Navigation / back flow / language switching / auth where relevant

For user-facing UI projects, cross-device regression is mandatory unless the project explicitly supports only one device class.

Never announce READY TO TEST if regression-critical behavior is known to be broken.

---

## 10. Deployment, Documentation & Handoff
After successful implementation:
- Deploy if required.
- Test production.
- Update README.md if architecture, operation, setup, data source, deployment, supported devices, or failure modes changed.
- Update AGENTS.md if execution rules changed.
- Update PROJECT_STATE.md.
- Record release/version/timestamp/commit/deployment/test result.
- Update Portfolio Dashboard summary if project status materially changed.

Status model:
- 🟢 GREEN — deployed + production tested + core regression passed + docs/state verified. READY TO TEST.
- 🟡 YELLOW — work/testing/deployment incomplete. User should not test yet.
- 🔴 RED — blocked or failed critical test/deployment/data source.
- ⚪ PAUSED — intentionally not active; state preserved.
- 🔎 VERIFY — a version/source mapping exists but must be reconciled before new work.

---

## 11. Handoff Contract
At the end of a work cycle record:
- What changed
- What did not change
- Current Locked Version
- Current Approved Version
- Production Version
- Test results by supported device class when UI is affected
- Known issues
- Pending work
- Next recommended action

This contract allows a new session or another agent to continue safely.

---

## 12. Anti-patterns Project OS must prevent
- Starting from an old version after switching sessions.
- Asking the user to remember which version was correct when the project should already know.
- Rebuilding a UI from scratch for a small change.
- Losing features because only the latest request was remembered.
- Saying 'done' after a commit without deployment verification.
- Testing only the changed button and missing regressions elsewhere.
- Treating production as current simply because a URL loads.
- Mixing several projects' requirements into one project state.
- Letting Portfolio PM override project-local state.
- Allowing iPhone, iPad and desktop to drift into different product versions.
- Requiring the user to repeatedly ask 'Is it ready?'.

---

## Default behavior when invoked
1. Identify the project or portfolio intent.
2. Recover project-local state using Canonical Truth Priority.
3. Show a concise status summary.
4. Convert the new request into a Delta Contract.
5. Run SA before implementation.
6. Execute the change.
7. Run targeted + regression tests, including cross-device checks for UI projects.
8. Deploy and verify when required.
9. Update version/state/docs and Portfolio summary.
10. Report traffic-light status and only say READY TO TEST when truly ready.
