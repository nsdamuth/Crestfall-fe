# PLAN-REVIEW-LOG: <PRD or PLAN name>

Purpose: the running adversarial review record for one PRD or PLAN,
one file per artifact under review. Filled by: the reviewing lane's
model, one row per finding, appended round over round.

The invariant applies: the reviewer is never the author.

## Before reviewing: packet completeness check

The reviewer opens every round by listing anything missing from the
packet handed to it (a referenced file not included, a contract not
linked, a PRD tier left unclear). List gaps first; do not review past
one without noting it.

## Findings table

Append new rows for each round; do not restart the table. Round is a
column, not a heading, so the whole review history stays in one
table.

| finding_id (F-NNN, stable across rounds) | round | reviewer (Claude or Sol) | severity (critical, high, medium, low) | location | claim (one checkable assertion) | evidence | disposition (accept, reject, defer) | rationale | owner | resolved_in |
|---|---|---|---|---|---|---|---|---|---|---|
| F-001 | 1 | ... | ... | ... | ... | ... | ... | ... | ... | ... |

Optional convention: group rows visually with a "## Round N" heading
above that round's rows for readability. The round column stays the
source of truth either way.

## Severity rubric

- critical: ships a defect, breaks a contract, or blocks deploy
- high: wrong behavior a user would notice
- medium: gap or ambiguity that costs rework later
- low: polish

## Stopping rule

- A round closes when the reviewer raises zero new critical or high
  findings. Medium and low may be deferred without blocking.
- Hard cap three rounds. Open criticals after round three go to Brian
  as a HANDOFF, never a fourth round.
- Verdict vocabulary for the reviewer: APPROVE, APPROVE WITH
  COMMENTS, BLOCK. Record the round's verdict as one line at the end
  of that round's rows.

## Optional (carried from v1, not a required column)

- author_response: free-text reply from whoever built the artifact,
  when disposition and rationale alone do not capture their side of
  it.
