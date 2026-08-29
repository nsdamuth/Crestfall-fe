# Collaborative workflow PRD

Drafted 26 Aug 2026 for Brian's ruling and Sol's review. Where the
repo already has a working equivalent, this document points at it and
does not duplicate it.

## The invariant

**Whoever made the thing never grades it.** The same rule the repo
already applies to agents ("No agent grades its own work",
docs/FRONTEND-SOP.md section 11) now applies across lanes and models:
Claude-built work is reviewed by Sol or by Nick; Chassis-built work is
reviewed by Claude or by Brian; every PRD is attacked by the model
family that did not write it; Brian rules what neither side can.

## Lanes

| Lane | People | Owns | Never touches |
|---|---|---|---|
| Design and front end | Brian (design authority) + Claude | Views, Kit, tokens, fixtures, page composition; this bible | Routes, application logic, application ViewModels, data |
| Chassis | Nick + Sol (reader only) | Routes, application logic, application ViewModels, authoritative Binding Shells, contracts, data, deployment | Visual design law, tokens, fixtures, page composition |

Sol reads documents Nick hands it and returns written findings. Sol
never edits this repo. Boundary rule of record: FE-REVIEW-01
(CLAUDE.md).

## The pipeline: seven stations, three human gates

1. **Intake.** Every idea, defect, or request becomes one tracked
   item the day it appears. Single dev tracker: GitHub Issues,
   RULED by Brian 26 Aug 2026, pending Nick's confirmation (asked in
   the Sol handoff).
   Anything blocked on the Chassis is ALSO a CR in
   docs/CONTRACT-REQUESTS.md; that file stays the only mechanism for
   Chassis contract changes.
2. **Backlog.** Items sit ordered, not scheduled. The roadmap ledger
   stays docs/ROADMAP.md.
   **GATE 1, sprint pick (Brian):** three candidate sprints, one
   recommended, costs stated; Brian picks one (gate rules per
   docs/FRONTEND-SOP.md section 9).
3. **PRD with cross-model review.** The building lane drafts the PRD
   from bible/templates/PRD.md. The other lane's model attacks it
   (Claude drafts, Sol attacks; Sol drafts, Claude attacks), findings
   written into a PLAN-REVIEW-LOG per bible/templates/
   PLAN-REVIEW-LOG.md, rounds until no new findings.
   **GATE 2, PRD sign-off (Brian, plus Nick where the Chassis is
   touched):** no build starts on an unsigned PRD; this restates
   docs/FRONTEND-SOP.md section 14, it does not replace it.
4. **Build.** Each lane builds in its own repo per a BRIEF
   (bible/templates/BRIEF.md). FE work follows the existing law
   stack (CLAUDE.md's four law documents); nothing here changes it.
5. **Integrate.** The lanes merge: FE trunk and Nick's branches
   reconciled per the standing handoff mechanism
   (docs/handoffs/HANDOFF-NICK-*.md), collisions read side by side,
   never auto-resolved (the standing ask in the 23 Aug handoff).
6. **Live-staging review.**
   **GATE 3, live staging review (Brian, with Nick available):**
   Brian uses the staged site; flags are fixed or explicitly waived
   before release. What staging IS is an open environment question
   for Nick (see the Sol handoff).
7. **Release and features DB.** Nick tags and deploys (mechanism:
   open environment question). Every released feature gets a row in
   bible/FEATURES.csv and release notes from
   bible/templates/RELEASE-NOTES.md.

## The bible folder, target shape

    bible/
      CONTEXT.md              glossary (this pass)
      COLLAB-WORKFLOW-PRD.md  this document
      STATUS.md               ten lines, always current
      LANES.md                who owns what, where things live
      FEATURES.csv            released features; columns: id, name,
                              date, lane, visibility, notes-file
      PLAN-REVIEW-LOG.md      the live review log for the current PRD
      decisions/              dated one-page decision records
      handoffs/               dated handoff briefs (Nick, Sol)
      prds/                   finished PRDs, one dated file each
                              (R5 improvement 9, 29 Aug 2026)
      templates/
        PRD.md
        PLAN.md
        PLAN-REVIEW-LOG.md
        GATES.md
        BRIEF.md
        HANDOFF.md
        RELEASE-NOTES.md

Existing equivalents this folder points at, never duplicates:
contract changes live in docs/CONTRACT-REQUESTS.md; verification law
in docs/FRONTEND-SOP.md section 8; gate conduct in section 9; the
function ledger in docs/APP-FUNCTION-MAP.csv; the phase ledger in
docs/ROADMAP.md; design law in docs/DESIGN-TOKENS.md.

## Release communications

- **Notifications panel (default).** Every release posts to the
  in-app notifications panel. The panel is real and fixture-driven
  today with no live feed (CR-017); live posting waits on that CR.
- **Login modal.** At most monthly, reserved for the largest
  releases; never two in one month.
- **Monthly email.** One digest per month built from that month's
  FEATURES.csv rows.
- **Public changelog.** Generated from FEATURES.csv rows whose
  visibility column reads "public"; rows marked "internal" never
  appear. The visibility column is the one switch.
