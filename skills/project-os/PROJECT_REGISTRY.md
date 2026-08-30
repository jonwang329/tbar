# Project OS — Project Registry Contract

## Purpose
The registry lets one Project OS manage many projects without mixing their detailed context.

Each project is registered by pointer + management metadata. The detailed truth remains inside that project's own `PROJECT_STATE.md`.

## Required registry fields
For each project record:
- Project ID
- Project name
- Canonical repository / source
- PROJECT_STATE location
- Status
- Current locked/approved version
- Production version
- Last verified timestamp
- Current objective
- Next action
- Risk / blocker

## Registry rules
1. Registry is summary only.
2. Project-local state has priority.
3. Missing project-local state means status must be VERIFY or UNREGISTERED, not guessed.
4. A project becomes ACTIVE only after its canonical source and baseline are mapped.
5. A lock/final event must be written project-locally first, then reflected in registry/portfolio.
6. Never copy full project requirements into the registry.

## Initial portfolio targets

### TBAR
- Canonical source: `jonwang329/tbar`
- Project state: `PROJECT_STATE.md`
- Status: ACTIVE / GREEN for Project OS documentation pilot

### Taiwan MLB Tracker
- Canonical source: `jonwang329/taiwan-mlb-tracker-`
- Project state: pending Project OS onboarding
- Status: VERIFY until project-local baseline is written

### Cisco Replacement
- Canonical source: resolve from its own project folder/repository before editing
- Known locked baseline from project record: `v1.0-FIX2`
- Locked at: `2026-08-29 18:24 TPE`
- Architecture signature: 7-layer guided customer discovery with deep content, customer questions/possible answers, reasons/insights, product mapping, and must-collect information
- Rule: the above baseline must be confirmed against the Cisco project-local record before any new code change; do not substitute later rough versions
- Status: VERIFY until its own `PROJECT_STATE.md` is created in the canonical project source

### Project Eddie
- Canonical source: resolve before editing
- Project state: pending Project OS onboarding
- Status: VERIFY

### Personal Brand – Jon Wang
- Canonical source: resolve before editing
- Project state: pending Project OS onboarding
- Status: VERIFY

## Onboarding sequence
For each project:
1. Locate canonical project folder/repository.
2. Read existing README/AGENTS/context/version records.
3. Identify the user's last locked/final baseline from project-local evidence.
4. Map commit/deployment/time where available.
5. Create `PROJECT_STATE.md`.
6. Build Feature Manifest.
7. Record current known defects separately from baseline.
8. Update Portfolio Dashboard.
9. Mark ACTIVE only after recovery is internally consistent.
