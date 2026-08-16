# Project Eddie — V22 Baseline

Status: CORE LOGIC FROZEN

Baseline principle:

> Logic first. UI can evolve, but UI must not rewrite logic.

## Frozen core

The following behavior is treated as the V22 baseline and should not be changed during ordinary UI work:

1. One reusable StudentModule for every current and future student.
2. Student modes: fixed / coach choices / free availability.
3. 1–3 weekly sessions.
4. Initial selection and confirmation.
5. Direct replacement of a selected slot.
6. Live availability for confirmed schedule changes.
7. Conflict-free schedule change completes immediately; no coach approval required.
8. Coach receives an unread NEW change notification and explicitly acknowledges it.
9. Fixed weekly schedule remains the long-term default; a one-week override does not rewrite the recurring fixed schedule.
10. Same-origin tabs share browser localStorage during prototype testing.

## Change rule

UI-only changes may adjust typography, spacing, colors, wording, button size, layout, and information hierarchy.

A UI-only change must not alter StudentModule, availability ownership rules, booking state transitions, confirmation state, change-time behavior, notification state, or localStorage schema unless explicitly treated as a new logic version and re-tested end-to-end.

## Required regression test before accepting a new UI version

1. Add a brand-new student at the end of the list.
2. Set that student to each scheduling mode at least once.
3. Set 1, 2, and 3 weekly sessions.
4. Coach assigns/opens valid choices.
5. Student selects and confirms.
6. Student replaces a pre-confirmation choice.
7. Confirmed student changes to a currently available slot.
8. Coach receives NEW change notification.
9. Coach acknowledges the change and the unread indicator clears.
10. Re-test the last/newest student to prove all functionality comes from StudentModule rather than name-specific handlers.

## Release gate

A UI version is not considered accepted until all regression items pass. If one fails, fix the regression before making further UI changes.
