# 🚦 Project Execution Standard — Read First

This rule applies to every development task in this project.

## Project OS integration

This project is managed by the reusable Project OS skill at:

`skills/project-os/SKILL.md`

Before meaningful design, debugging, feature work, UI changes, data changes, deployment work, or session recovery, use the Project OS sequence:

**PORTFOLIO PM → PROJECT PM → SA → CHANGE CONTROL → EXECUTION → QA/REGRESSION → DEPLOY/VERIFY → VERSION/HANDOFF**

Canonical project continuity is stored in `PROJECT_STATE.md`. Cross-project status is summarized in `PORTFOLIO_DASHBOARD.md`.

The rules below are the Execution layer of Project OS.

## Core principle

Do not stop at writing code. Fully understand the user's actual requirement, expected behavior, and current problem before changing anything.

The assistant owns the complete execution cycle:

**UNDERSTAND → CHECK → FIX → TEST → DEPLOY → TEST AGAIN → VERIFY DOCUMENTATION → REPORT STATUS → READY TO TEST**

## Mandatory workflow

1. **UNDERSTAND** — Read the existing conversation, README, project context, PROJECT_STATE.md, and current implementation. Confirm the intended user experience and expected result. Do not add layers of patches without understanding the root cause.
2. **CHECK** — Inspect current production behavior, code, recent changes, deployment status, logs, workflows, and relevant data sources. Identify the root cause before changing architecture.
3. **FIX** — Make the smallest coherent fix that addresses the root cause. Avoid stacking unrelated hotfixes.
4. **TEST** — Test the specific bug and important related behavior before deployment to catch regressions. Use the Stable Core / Feature Manifest in PROJECT_STATE.md as part of regression scope.
5. **DEPLOY** — Deploy the tested version to the real environment the user will use. A commit or push is not completion.
6. **TEST PRODUCTION AGAIN** — Verify the deployed site/app itself. Confirm page load, primary flow, data correctness, refresh/update behavior, no hanging state, no regression, and acceptable mobile behavior where relevant.
7. **VERIFY README / AGENTS / PROJECT STATE** — Read project documentation before and after the change. Update README.md / AGENTS.md when architecture, operation, deployment, testing, or known failure modes change. Update PROJECT_STATE.md whenever approved version, production version, active delta, stable core, status, or handoff changes.
8. **REPORT STATUS** — Always use the traffic-light model below.

## Traffic-light status

### 🟢 GREEN — READY TO TEST
Deployment completed and production testing passed. The user may test now.

Required final confirmation:
- Fix completed
- Deployed
- Production tested
- Core functions passed
- README / AGENTS / PROJECT_STATE verified
- Version/timestamp state updated
- **READY TO TEST**

### 🟡 YELLOW — IN PROGRESS / NOT READY
Work, deployment, or testing is still incomplete. Clearly state what is being worked on and what remains. Do **not** ask the user to test.

### 🔴 RED — BLOCKED / FAILED
A critical test, deployment, data source, or required function failed. Clearly state the failure and what is being fixed. Do **not** ask the user to test.

## Communication rule

The user should never need to repeatedly ask:
- “Is it ready?”
- “Can I test now?”
- “Did you deploy it?”
- “Did you test it?”

Provide proactive progress updates while work is ongoing.

Never say “fixed,” “done,” or “ready” merely because code was changed or committed. Only announce **🟢 GREEN — READY TO TEST** after deployment and assistant-side production verification have both succeeded.
