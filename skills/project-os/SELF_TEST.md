# Project OS — Self-Test Checklist

Project OS is not considered ready unless it can pass these scenarios.

## A. Session Recovery Test
Prompt: `Continue <project>.`

Pass if Project OS:
- identifies the exact project
- reads project-local state before relying on chat memory
- returns locked/approved baseline
- returns lock timestamp and baseline signature when available
- distinguishes baseline from production/latest commit
- resumes from pending work without asking the user to remember the version

## B. Wrong-Version Prevention Test
Setup: latest commit differs from locked baseline.

Pass if Project OS:
- does not replace the locked baseline with latest commit
- reports the discrepancy
- preserves Golden Baseline
- marks VERIFY if deployment mapping is uncertain

## C. Lock Test
Prompt: `Lock this version.`

Pass if Project OS records in the same work cycle:
- version label
- exact date/time/timezone
- commit SHA if available
- deployment ID/URL if available
- baseline signature
- Feature Manifest
- known defects separately
- PROJECT_STATE update
- Portfolio summary update

## D. Small UI Change Test
Prompt: `Change this one UI item; keep everything else.`

Pass if Project OS:
- writes a Delta Contract
- lists protected behavior
- does not redesign unrelated areas
- runs targeted test + relevant regression

## E. Debug-Only Test
Prompt: `Fix this bug only. No new features.`

Pass if Project OS:
- performs SA/root-cause analysis
- avoids scope expansion
- applies smallest coherent fix
- verifies production if deployed

## F. Portfolio Test
Prompt: `Show all my projects.`

Pass if Project OS:
- reads summary/state pointers
- does not merge detailed requirements across projects
- shows baseline, status, production mapping, objective, next action, blocker
- marks unknown mappings VERIFY instead of guessing

## G. Regression Test
Setup: a new change would remove a protected feature.

Pass if Project OS:
- detects Feature Manifest conflict
- prevents silent regression
- reports conflict before claiming GREEN

## H. Ready-to-Test Test
Pass only if Project OS says GREEN/READY TO TEST after:
- requested change completed
- required deployment completed
- production tested
- core regression passed
- documentation/state updated

Otherwise it must remain YELLOW/RED/VERIFY.

## I. Cisco Replacement Historical Recovery Test
Known recovery signature:
- project: Cisco Replacement
- locked baseline: `v1.0-FIX2`
- locked at: `2026-08-29 18:24 TPE`
- architecture signature: 7-layer guided customer discovery with deep content, customer questions/possible answers, reasons/insights, product mapping, and must-collect information

Pass if Project OS recovers this baseline instead of asking the user which version was correct, while still requiring canonical project-source mapping before new code changes.
