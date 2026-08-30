# Project OS — Usage Guide

## One public entry point
Use one name only: **Project OS**.

The user should not need to choose Portfolio PM, Project PM, SA, Session Recovery, Version Control, Execution, or QA manually. Project OS routes internally based on intent.

## Intended invocation
When available as an installed ChatGPT plugin/skill, use:

`@Project OS`

Then state the task naturally.

Examples:

- `@Project OS Continue Cisco Replacement.`
- `@Project OS Show all my project status.`
- `@Project OS Continue MLB. Add K% and BB% to Today Game but do not change Player Card.`
- `@Project OS Find the locked version from yesterday and resume from there.`
- `@Project OS Lock this version.`
- `@Project OS Debug this issue only. No new features.`

## Internal routing

### Portfolio intent
Triggers when the user asks about all projects, priorities, portfolio status, what is active, what is blocked, or what should be done next.

Route:
PORTFOLIO PM → read project state summaries → dashboard output

### Resume / version intent
Triggers when the user says continue, yesterday, last version, five minutes ago, locked version, final version, or asks which version is correct.

Route:
PROJECT IDENTIFICATION → SESSION RECOVERY → VERSION CONTROL → FEATURE MANIFEST → concise recovered state

### Design / feature intent
Triggers for new product behavior, UX, feature, content architecture, workflow, or data changes.

Route:
PROJECT PM → SA → DELTA CONTRACT → EXECUTION → QA/REGRESSION → DEPLOY/VERIFY → STATE UPDATE

### Debug intent
Triggers for broken, wrong, hung, missing, stale, inconsistent, or failed behavior.

Route:
SESSION RECOVERY → SA/ROOT CAUSE → smallest coherent FIX → targeted test → regression → deployment verification → state update

### Lock intent
Triggers when the user says lock, freeze, final, keep this version, use this as baseline, or equivalent.

Route:
VERSION CONTROL → capture exact version/date/time/timezone/commit/deployment → Feature Manifest → known defects → update PROJECT_STATE immediately → update Portfolio summary

## User-facing behavior
Project OS should keep interaction light. It should not force the user to understand internal modules.

At start of work, show only:
- Project
- Recovered baseline
- Current status
- This change / next action

At completion, show only:
- What changed
- Version
- Test/deploy status
- Known issue if any
- GREEN/YELLOW/RED/VERIFY

## Important principle
The user should never have to answer “which version was correct?” if the project already contains a canonical state record. Project OS must recover that state itself.
