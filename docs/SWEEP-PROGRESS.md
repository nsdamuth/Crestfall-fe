# Sweep progress checkpoint

Generated audit artifact for the overnight mechanical sweep (brief dated
4 Aug 2026). Exempt from the em dash law. Deleted at end of life. If a
session is unsure what phase it is in, read this file and resume from it.
Never ask Brian to restate the brief; this file is the resume point.

## Current phase

Phase A.3 is DONE. All 160 packages across sub-batches 2-19 processed:
153 converted with real edits, 7 legitimately no_change_needed (finding
already matched the ruled resolution on disk, or was a logic-only
confirm-step file with no geometry). Combined with sub-batch 0 (9) and
the pre-existing sub-batch 1 (10), the sweep has touched every
mechanically-convertible package.

History of how the 153 landed: a first workflow (`wf_39d9729e-014`)
converted 134 via worktree isolation, cherry-picked one at a time into
`design/global-sweep` (132 clean, 2 hand-resolved conflicts against
newer HEAD content: actor-mechanics-profile-editor, creation-image-library-page,
where HEAD already had newer token names or a more-evolved Destructive
implementation than the worktree's stale base; kept HEAD's newer content,
applied only the incoming radius-token fix). A retry workflow for the
other 19 hit the SAME stale-worktree-base bug again (all 19 stuck at
commit afa856a regardless of relaunch), so those 19 were converted by
hand directly on `design/global-sweep`, one commit each, same rule
lookups, same skip discipline for non-mechanical findings (confirm-step
UX, unstated wash resolutions).

KNOWN INFRA ISSUE for any future phase that reaches for isolation:'worktree'
in this session: it appears to pin to a stale base commit rather than the
current branch tip. Prefer direct edits on the main checkout for small
batches; only retry worktree isolation for large batches if this is
confirmed fixed.

Production build verified exit 0 after both waves. No new em dashes
introduced anywhere in this phase (pre-existing em dashes in unrelated
UI copy/comments in a few touched files were left alone, per "no
adjacent tidying"). Worktrees pruned.

Next: Phase B, verification convergence pass, different agents than the
ones that edited, re-checking every converted package (batch one
included) against its assigned rule families.

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
- Minted `--blur-panel: 2px` into `app/theme.css`, paired with
  `--scrim-strong`, named token only. Commit 690780d.
- Sub-batch 0 (9 app-shell packages): converted, one commit each. Commits
  94346be, 6b46fd8, 2d7d1af, 1ac9c39, fd2af77, 14a976c, 91851e7, caef554,
  de340e2. Production build verified exit 0 after this sub-batch.

## Remaining

- Merge the 160-package Workflow's results into `design/global-sweep`
  (see Current phase above), package by package.
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
