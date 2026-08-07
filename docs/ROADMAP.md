# Roadmap

This file updates in the same commit as the work it records.

## Now

14 held-out packages await a Brian ruling before they can convert. Plain
language in `docs/NICK-SWEEP-NOTES.md`, full detail in
`docs/BATCH-TWO-ORDER.md`'s flagged list.

Roughly 81 packages of mechanical-only findings remain open in
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

Unattended run, 6 Aug 2026, `design/creator-stops`: fixed the shared
creator-stops eyebrow (all seven stops used the tag-and-meta type scale
instead of the ruled global eyebrow scale; now `--text-eyebrow`/
`--lh-eyebrow`/`--track-eyebrow` and the `--grad-rule` token). Converted
4 account-family packages against `docs/CLOSING-INVENTORY.md`'s open
mechanical backlog (`default-player-character-picker`,
`studio-account-coins`, `studio-account-metrics`,
`studio-account-profile`): off-scale `rounded-xl` panels to
`--radius-md`, two floating dialogs from `--radius-md` up to
`--radius-lg` per the corners final ruling, one dialog scrim from
`bg-black/70` to `--scrim-strong`, and raw red/emerald status colors to
the `--status-danger`/`--status-success` token pairs. All four verified
at 390 and 1440 in `/dev/ui-preview`, zero new console errors, build
exit 0. This run's brief pointed at `docs/BATCH-TWO-SCOPE.md` for the
next block, but that file's own scope (179/179 packages) is already
fully converted per this doc's "Done" section above; the actual open
mechanical backlog lives in `docs/CLOSING-INVENTORY.md` per its own
superseding note, so this run worked from there instead and logged the
substitution rather than guessing or stalling. Roughly 81 packages of
`CLOSING-INVENTORY.md`'s mechanical-only backlog remain after this run.

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
