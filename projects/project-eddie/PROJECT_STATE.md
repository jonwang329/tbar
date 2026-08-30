# Project Eddie — Project OS State

> Canonical management record inside Project OS until Eddie has its own canonical repository/state location.

## Status
- Project: Project Eddie / coach scheduling
- Project OS status: 🔎 VERIFY
- Canonical baseline type: **COACH-TESTED BASELINE**
- Exact coach-tested file/deployment mapping: **TO RECONCILE — do not guess or replace**
- Known version lineage evidence: V16 scheduling-rule baseline; V17 adds isolated Test Mode on top of that lineage

## Golden Baseline Rule
The Golden Baseline is the version actually shown to the coach and used for real coach feedback.

Do NOT choose a baseline simply because a filename/version number is newer.
Do NOT replace the coach-tested UI/flow with an earlier rough prototype or a later simplified rewrite.
Until exact file/deployment mapping is reconciled, preserve the known coach-tested product behavior below as the Stable Core.

## Stable Core — must not regress
- Weekly coach scheduling workflow
- Monday–Friday, 12:00–21:00 operating window
- Dinner 18:00–19:00 soft block / overridable
- Fixed recurring students and flexible students
- Coach can offer selected candidate slots to a student
- Required session count is separate from number of offered candidate slots
- Student confirms only required sessions; unused candidate slots auto-release
- Student confirmation flow via link / no student app required
- LINE is notification/handoff, not the place where scheduling negotiation lives
- Student-owned schedule and coach-owned blocked time remain visually distinguishable
- One shared product baseline across iPhone, iPad/tablet, and desktop; responsive adaptation only

## Coach Feedback — Approved Delta Requirements
These are additions to the coach-tested baseline, not reasons to redesign it.

### Delta 1 — Drag / Swipe Schedule Rescheduling
Coach wants to move an existing scheduled lesson directly with touch/mouse gesture.

Acceptance intent:
- Drag/touch a scheduled lesson and move it to another valid slot
- Works naturally on touch devices and desktop pointer devices
- Preserve student identity, session history, and booking meaning
- Prevent invalid conflicts / double booking
- Update the same underlying schedule state across phone, tablet and desktop
- Do not require rebuilding the scheduling UI

### Delta 2 — Coach Statistics
Coach wants simple operational statistics, not an analytics-heavy dashboard.

Minimum useful views:
- Which students have booked / confirmed
- Which students have not booked / still pending
- Lessons per student this month
- Lessons per student year-to-date / cumulative to date
- Coach total lessons this month
- Coach total lessons cumulative to date
- Session history / what lessons occurred, retained for at least six months

Design principle:
- Simple numbers and lists first
- No unnecessary complex charts
- Statistics derive from dated confirmed/completed sessions, not temporary offers or Test Mode activity

## Test Mode Protection
Known V17 Test Mode intent:
- Coach can simulate Student Portal without sending LINE
- Test operates on cloned in-memory state
- Exit restores production schedule unchanged
- Test activity never counts toward real history or statistics

This behavior is protected if the coach-tested baseline includes or later adopts Test Mode.

## Cross-Device Rule
Mandatory Project OS global rule:
- iPhone, iPad/tablet and desktop are one product/version
- Layout may respond to screen size
- Features, wording, navigation intent and business rules must not fork by device
- A UI change is not complete until all supported device classes pass regression

## Current Delta Contract
- Preserve coach-tested baseline
- Add drag/touch rescheduling
- Add simple coach statistics and dated history
- Do not simplify/rebuild existing scheduling workflow
- Do not contaminate production/history with test activity

## Recovery / Mapping Task
Before any new Eddie implementation:
1. Identify the exact file/version/deployment that was shown to the coach.
2. Compare it with V16 and V17 lineage evidence.
3. Record exact filename/version/timestamp/deployment when available.
4. Set CURRENT_LOCKED_VERSION and GOLDEN_BASELINE to that coach-tested build.
5. Only then implement the two approved deltas.

## Known Evidence
- Canonical context records the V16 scheduling rule: required sessions separate from candidate slots.
- Canonical context records drag-and-drop rescheduling, six-month history and monthly statistics as future roadmap.
- Canonical context records Test Mode isolation from production state/history.

## Next Safe Action
Resolve the exact coach-tested build, then continue from that baseline with the two coach-requested deltas only.
