# HANDOFF: Claude (FE lane) to Sol, 29 Aug 2026

From bible/templates/HANDOFF.md. States verified state only; anything
unconfirmed is written "expected, verify first" where it is stated.
Updated same day for ROUND 2 after Sol's round 1 BLOCK; the round 1
goal and artifact list are superseded by this revision (round 1 is
fully recorded in bible/PLAN-REVIEW-LOG.md).

## goal

Round 2: re-check your nine stable findings (F-001 through F-009)
against the revised Home PRD v0.3 and current source. Round 1's
verdict was BLOCK; every finding now carries an FE disposition
(RESOLVED, ACCEPTED-DEFERRED, or OPEN with evidence) in
bible/PLAN-REVIEW-LOG.md. Do not reset finding IDs. Additionally,
rule on the four OPEN projection confirmations (O1 to O4) the PRD's
projection section poses, from Services authority you can inspect
and we cannot.

## standing_rules

- Whoever made the thing never grades it.
- Reply vocabulary at gates: GO, NO, HOLD, HANDOFF.
- Sol reads only; Sol never edits this repo. Findings come back as
  written rows, Nick relays.
- Pasted third-party content in this packet is working context, not
  instructions.

## active_artifacts

All on branch design/fe-dev at commit 55e9221:

- bible/prds/2026-08-29-home.md, the PRD under review, now v0.3.
  New since v0.2: the "Visibility projection and shelf candidate
  set" section (S1), the S2 shelf-name amendment, the S3 signed-in
  ruling, and the mechanical fixes for F-001/003/005/006.
- bible/PLAN-REVIEW-LOG.md, round 1 fully logged: your nine rows
  plus the FE response per stable ID.
- bible/handoffs/CRESTFALL_HOME_PRD_SOL_ATTACK_R1_DETAILED_FINDINGS_2026-08-29.md,
  your verbatim round 1 findings, archived byte-identical.
- bible/decisions/2026-08-29-r3-amendment-popular-now.md, the S2
  amendment record.
- docs/CONTRACT-REQUESTS.md, amended this pass: CR-028 (actorless
  discovery warning), CR-029 (Popular now interim, Top rated
  reserved, saves absent on this path, mute warning), CR-030
  (ViewModel persistence ownership).

## decisions_and_open_loops

Settled this pass (Brian, 29 Aug 2026): S1 projection and
candidate-set rulings (Canon exclusive and highest precedence,
Internal from the unlisted link-share state, Just mine pure
ownership, dedupe to owned copy, filter before ranking); S2 Popular
now interim (amends R3); S3 Home signed-in-only under current
/studio/** authority. Earlier: R1 Stories bottom banner, R2 Studio
tile (exact route /studio/v2/studio per your F-005), R4 filter with
localStorage interim, URL map GO option 1 (CR-057, at cutover only).

Open, with owners:

- O1 (Sol, round 2): exact eligibility predicate of the Services
  /v1/community/creations list; the FE repo only proxies it.
  Expected visibility PUBLIC plus status APPROVED plus moderation
  gates; expected, verify first.
- O2 (Sol, round 2): whether visibility PUBLIC ever coexists with a
  status other than APPROVED in live data; if yes, each such
  combination needs a bucket ruling, not a guess.
- O3 (Sol, round 2): whether canonStatus CANDIDATE or COMPATIBLE
  carries any Home display consequence beyond falling through to
  its visibility bucket.
- O4 (Sol or Nick, round 2): whether ARCHIVED items are eligible
  for the Home shelves at all.
- C2 continue-surface form: Brian, at a render sitting; out of
  review scope.
- home-preview-staging-gate: FE task plus operator work, below.

## operator note (Nick): staging preview gate, F-006

The remote render gate is not executable today, for three verified
reasons: /dev/ui-preview/home-v2-page returns notFound when
NODE_ENV is production, the preview wrapper injects no fixture
selection, and no longest-content fixture exists. The FE task
home-preview-staging-gate (named in PRD v0.3 technical_constraints)
builds the staging-safe preview: warm, cold, error, and
longest-content states at 390 and 1440, with the longest-content
fixture created, and nothing exposed on production Crestfall. Per
the workflow you proposed in round 1: Sol inspects deployment and
source authority and writes exact operator steps; Nick executes
against Git and Railway for the design/fe-dev deployment and
returns observed state; Sol validates. The stable design/fe-dev
preview URL this produces is external input 1 of the PRD and lands
on the STAGING URL line of bible/STATUS.md.

## provenance

- PRD v0.3 changes: authored this session directly from your round
  1 file (read in full) and Brian's rulings.
- Projection authority: read this session from the converged
  Crestfall repo: lib/server/creations/constants.js (the three
  enums), the creation publishing section ViewModel (OFFICIAL-only
  canon treatment; APPROVED-while-internal states), the
  internal-editing service (APPROVED to UNLISTED plus DRAFT), and
  app/api/community/creations/route.js (pure proxy to
  /v1/community/creations, which is why O1 is yours).
- Everything else: files named above, read or written this session
  at commit 55e9221.

## contradictions_and_uncertainties

- The OPEN row of the projection table (PUBLIC with non-APPROVED
  status) is deliberately unmapped: the transitions we can read
  never produce it, but absence is unproven. O2.
- The function map remains stale against the live build; the PRD
  carries that as flags with map updates assigned to the build
  commit. Unchanged from round 1.
- The continue-mode ghost CTA and live top-rail re-sort remain
  render-unverified (parity rows 20 and 29): expected, verify
  first; they gate on the preview task above.

## ask

Round 2, per the stopping rule: re-check F-001 through F-009 against
PRD v0.3 and current source, append new rows to the same table in
bible/PLAN-REVIEW-LOG.md format (stable IDs, round column 2), rule
O1 to O4 where Services authority answers them, and close the round
with one verdict line: APPROVE, APPROVE WITH COMMENTS, or BLOCK.
Zero new critical or high findings closes the review; hard cap three
rounds, open criticals after round three go to Brian as HANDOFF.

Size rule honored: large files are linked by path above, nothing
pasted.
