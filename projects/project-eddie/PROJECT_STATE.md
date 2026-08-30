# Project Eddie — Project OS State

> Canonical management record inside Project OS until Eddie has its own canonical repository/state location.

## Status
- Project: Project Eddie / coach scheduling
- Project OS status: 🔎 VERIFY SOURCE SNAPSHOT, but **Golden Baseline identity is now known**
- Canonical baseline type: **COACH-TESTED GOLDEN BASELINE**
- Coach-tested production URL: `https://project-eddie.jonwang329.chatgpt.site`
- User confirmation: this is the version previously shown to the coach and considered good enough for coach feedback
- Exact source-file / commit mapping behind that URL: **TO RECONCILE — do not guess or replace**
- Known version lineage evidence: V16 scheduling-rule baseline; V17 adds isolated Test Mode, but neither may replace the coach-tested URL baseline merely because of filename/version number

## Golden Baseline Rule
The Golden Baseline is the production/site version actually shown to the coach:

`https://project-eddie.jonwang329.chatgpt.site`

Do NOT choose a baseline simply because a filename/version number is newer.
Do NOT replace this coach-tested UI/flow with an earlier rough prototype or a later simplified rewrite.
Until exact source-file/commit mapping is reconciled, the public coach-tested site is the authoritative product baseline and the known behavior below is the Stable Core.

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
- Lessons per student cumulative to date
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
- Preserve coach-tested Golden Baseline at `https://project-eddie.jonwang329.chatgpt.site`
- Add drag/touch rescheduling
- Add simple coach statistics and dated history
- Do not simplify/rebuild existing scheduling workflow
- Do not contaminate production/history with test activity

## Recovery / Mapping Task
Before any new Eddie implementation:
1. Treat the coach-tested URL above as the Golden Baseline.
2. Identify the exact source file/version/commit/deployment that produced that site.
3. Compare it with V16 and V17 lineage evidence.
4. Record exact filename/version/timestamp/commit/deployment when available.
5. Do not block product understanding on source mapping, but do not modify production until the source baseline is reconciled.
6. Implement only the two approved deltas on top of the reconciled coach-tested baseline.

## Known Evidence
- User explicitly identified the public Eddie site above as the version shown to the coach.
- Canonical context records the V16 scheduling rule: required sessions separate from candidate slots.
- Canonical context records drag-and-drop rescheduling, six-month history and monthly statistics as future roadmap.
- Canonical context records Test Mode isolation from production state/history.

## Next Safe Action
Reconcile the source/commit behind the coach-tested URL, freeze that exact source snapshot, and continue only with the two coach-requested deltas.
