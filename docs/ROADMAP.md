# Roadmap

This file updates in the same commit as the work it records.

## Now

14 held-out packages await a Brian ruling before they can convert. Plain
language in `docs/NICK-SWEEP-NOTES.md`, full detail in
`docs/BATCH-TWO-ORDER.md`'s flagged list.

Roughly 85 packages of mechanical-only findings remain open in
`docs/CLOSING-INVENTORY.md`, scoped for a dedicated follow-up pass.

## Next

Fix the 14 held-out packages once Brian rules on each. Fix the two
pre-existing broken routes found during the render pass
(`/chronicle/[...slug]`, `/stories/[...slug]`, both empty page files,
confirmed still broken as of this run).

Close the remaining ~85 mechanical-only packages in
`docs/CLOSING-INVENTORY.md`. Run the full render-pass gallery (every
`/dev/ui-preview/*` route), not the 4-surface spot-check this run did.

## Done

Batch one, 20 packages, on `design/global-sweep`.

Docs governance restructure.

Batch two, 172 packages converted (9 app-shell, 10 pre-approved, 153
component), 179 of 179 in-scope packages verified PASS, zero circuit
breakers, zero frozen packages. Holistic browser review of all 67 app
routes at 390 and 1440 widths, zero restyle regressions found. See
`docs/SWEEP-REPORT.md`.

Overnight closing pass, 4-5 Aug 2026: fresh 222-package inventory
derived from the codebase (`docs/CLOSING-INVENTORY.md`, 652 findings),
63 packages converted across dialog corners, delete controls, and a
bounded slice of the remaining inventory, creator-card banner fixed.
See `docs/CLOSING-REPORT.md`.

## Blocked on Brian

Wash value ruling.

14 held-out packages (`docs/NICK-SWEEP-NOTES.md`).

Creator card phone-width name truncation, renders in
`docs/review-artifacts/` from this run.

## Gates

Holistic browser review after batch two lands: done, see
`docs/SWEEP-REPORT.md`.
