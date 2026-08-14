# Roadmap

This file updates in the same commit as the work it records.

## Now

- [ ] Advanced editor page rebuild: the full-featured creation editor
  page, rebuilt on the new hero-plus-accordion layout to Brian's
  13 Aug direction, built and checked against both a phone-width and
  a desktop-width screen in the internal preview mirror; still
  waiting on Brian's own look at the live page before this line can
  close (ED1b, ED1c).

14 held-out changes are waiting on a decision from Brian before they
can be made. Plain-language list in `docs/NICK-SWEEP-NOTES.md`, full
detail in `docs/BATCH-TWO-ORDER.md`'s flagged list.

Roughly 81 more small styling clean-ups remain open in
`docs/CLOSING-INVENTORY.md`, set aside for a dedicated follow-up pass.

## Next

Make the 14 held-out changes once Brian decides on each. Fix the two
pre-existing broken pages found while reviewing the site
(`/chronicle/[...slug]`, `/stories/[...slug]`, both empty page files,
confirmed still broken as of this run).

Finish the remaining roughly 85 small styling clean-ups in
`docs/CLOSING-INVENTORY.md`. Review every internal preview page, not
just the 4-page spot check this run did.

## Done

Unattended run, 6 Aug 2026: fixed a shared label style used across all
seven "creator stops" screens (they used the wrong text size for tags
and captions instead of the standard one); converted 4 account-related
screens to the current design system (default player-character
picker, account coins, account metrics, account profile): squared-off
panels rounded to the standard corner size, two popup dialogs given
slightly larger rounded corners per the final ruling on corners, one
dialog's background dimming color standardized, and raw red/green
status colors replaced with the standard danger/success color pair.
All four checked at phone width and desktop width, no new errors, the
production build completed successfully. This run's brief pointed at
`docs/BATCH-TWO-SCOPE.md` for the next block of work, but that
document's own scope was already fully converted per this file's
"Done" section above, so this run worked from the actual open list in
`docs/CLOSING-INVENTORY.md` instead and logged the substitution rather
than guessing or stalling. Roughly 81 items of that open list remained
after this run.

Batch one, 20 screens converted to the current design system.

Documentation reorganization.

Batch two, 172 screens converted (9 app-shell screens, 10
pre-approved, 153 components), all 179 in-scope screens verified
passing, zero blocking failures, zero screens left unconverted.
Full-site review of all 67 pages at phone width and desktop width,
zero style regressions found. See `docs/SWEEP-REPORT.md`.

Overnight clean-up pass, 4-5 Aug 2026: fresh list of 222 screens built
from scanning the codebase (`docs/CLOSING-INVENTORY.md`, 652
individual findings), 63 screens converted covering dialog corners,
delete controls, and a bounded slice of the remaining list; a
creator-card banner display bug fixed. See `docs/CLOSING-REPORT.md`.

## Blocked on Brian

A decision on how "wash" (a color/tone setting) should work.

14 held-out changes, listed in `docs/NICK-SWEEP-NOTES.md`.

A text-truncation bug on the creator card at phone width; screenshots
saved in `docs/review-artifacts/` from this run.

## Gates

Full-site review after batch two shipped: done, see
`docs/SWEEP-REPORT.md`.
