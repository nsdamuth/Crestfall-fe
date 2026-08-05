# Sweep progress checkpoint

Generated audit artifact for the overnight mechanical sweep (brief dated
4 Aug 2026). Exempt from the em dash law. Deleted at end of life. If a
session is unsure what phase it is in, read this file and resume from it.
Never ask Brian to restate the brief; this file is the resume point.

## Current phase

Phase A.3, step 0: minting `--blur-panel` into `app/theme.css` (prerequisite
for converting Blur-category findings; named-token-only, no new literal
values, one commit).

## Completed

- Phase A.1: scope verification. Scanned every surface outside
  `docs/BATCH-TWO-SCOPE.md` (app routes, layouts, globals.css, theme.css,
  token-bridge.css, not-found.js). Found 9 packages / 14 findings, appended
  as sub-batch 0 in `docs/BATCH-TWO-ORDER.md`. Commit c2bebf6.
- Standing ruling from Brian, 4 Aug 2026: the public marketing site and
  old lore pages (`app/page.js`, `.sourcebook-page`/`.sourcebook-button`
  in `app/globals.css`, every parchment-theme public route) are throwaway,
  being rebuilt from scratch on a new content system. Permanently out of
  scope, not flagged, not swept, not rendered or verified in Phase C, not
  carried into the morning report. Recorded in `docs/BATCH-TWO-ORDER.md`
  under "Out of scope by ruling, not flagged."
- Phase A.2: QA gate ruled verbatim into CLAUDE.md section 8. Commit 799fbc8.
- Sub-batch 1 (10 packages): already converted and Brian-approved before
  this run started (pilot requirement satisfied per the brief's standing
  facts). Commits: 3e16bbd, bc81a0f, c840866, 7994adf, 46d9119, ddac236,
  1158aa8, 7690e83, 997546b, and one more for filterable-index.

## Remaining

- Mint `--blur-panel: 2px` into `app/theme.css` (in progress).
- Convert sub-batch 0 (9 app-shell packages from Phase A.1).
- Convert sub-batches 2 through 19 from `docs/BATCH-TWO-ORDER.md`, excluding
  the 14 flagged packages. One package, one worktree, one commit.
- Phase B: verification convergence pass (different agents than editors),
  max 3 fix loops per package, circuit breaker at 4+ same-reason failures.
- Phase C: judged render pass of the whole app, 390x844x2 then 1440x900x1,
  contact sheets under `docs/review-artifacts/`, console message sweep.
- Phase D: read-only audit of the 14 held-out packages (plain language,
  contract/ViewModel touch check, no edits).
- Phase E: `docs/NICK-SWEEP-NOTES.md` (DRAFT), `docs/SWEEP-REPORT.md`,
  tick `docs/ROADMAP.md`, final verify checklist, report to Brian.

## Rule notes carried forward (do not re-derive)

- Corners: LARGE surfaces (full-width, floating panels) -> `--radius-lg`
  (20px). STANDARD (grid siblings, controls, nested-in-large) ->
  `--radius-md` (12px). PILL -> `--radius-full`, tags and icon buttons
  only. `rounded-2xl` (16px) is always retired; each finding in
  `docs/BATCH-TWO-SCOPE.md` already states its target resolution -- follow
  the finding's stated resolution literally, do not re-derive from the
  general tier rule, since the audit already made that judgment call.
- Shape law: `--radius-full` reserved for tags and icon buttons. Every
  clickable action (including search inputs, tabs, filter chips) is
  `--radius-md`, no exceptions.
- Destructive: geometry always ordinary (same as sibling buttons). In-page
  trigger: no fill, quiet, `--status-danger` text only. Confirming button
  inside a confirm step: filled `--status-danger` + `--ink` text, the only
  filled red anywhere. Every destructive control ships with a visible word,
  never icon-only. Missing confirm-step implementation is a UX/design call,
  not mechanical -- flag it, do not invent a confirm flow.
- Blur: one strength only, `blur(2px)` paired with `--scrim-strong` (.70).
  Floating panels only (modals/sheets/pickers), never tile art, banners, or
  tag beds.
- Wash: `--scrim` (.40) replaces `--scrim-strong` only where a tag already
  carries its own `--tag-bed-art` bed on the same artwork.
- Banner taxonomy: three treatments only -- (a) bottom promo, uniform .70,
  centered; (b) in-flow banner card, fade from left, bottom-left copy;
  (c) top/hero banner, fade from bottom, bottom-left copy. Nothing else is
  valid.
- No new hex outside token blocks. No em dashes in permanent files (this
  file and other generated audit artifacts are exempt). Never sed/awk on
  markup or CSS. Views stay presentation-only.
