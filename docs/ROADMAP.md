# Roadmap

This file updates in the same commit as the work it records.

## Now

14 held-out packages await a Brian ruling before they can convert. Plain
language in `docs/NICK-SWEEP-NOTES.md`, full detail in
`docs/BATCH-TWO-ORDER.md`'s flagged list.

## Next

Fix the 14 held-out packages once Brian rules on each. Fix the two
pre-existing broken routes found during the render pass
(`/chronicle/[...slug]`, `/stories/[...slug]`, both empty page files).

## Done

Batch one, 20 packages, on `design/global-sweep`.

Docs governance restructure.

Batch two, 172 packages converted (9 app-shell, 10 pre-approved, 153
component), 179 of 179 in-scope packages verified PASS, zero circuit
breakers, zero frozen packages. Holistic browser review of all 67 app
routes at 390 and 1440 widths, zero restyle regressions found. See
`docs/SWEEP-REPORT.md`.

## Blocked on Brian

Wash value ruling.

14 held-out packages (`docs/NICK-SWEEP-NOTES.md`).

## Gates

Holistic browser review after batch two lands: done, see
`docs/SWEEP-REPORT.md`.
