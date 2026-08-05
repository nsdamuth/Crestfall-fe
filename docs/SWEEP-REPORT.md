# Sweep report

Generated audit artifact for the overnight mechanical sweep, branch
`design/global-sweep`, 4 Aug 2026. Exempt from the em dash law. Deleted
at end of life.

## Headline counts

- **Converted: 172 packages.** 9 app-shell packages (sub-batch 0, found
  by this run's own scope-verification pass), 10 pre-approved packages
  (sub-batch 1, done and Brian-approved before this run started), 153
  component packages (sub-batches 2 through 19).
- **Passed: 179 of 179 packages that were in scope for this run.** All
  172 converted packages plus 7 legitimately no-change-needed packages
  (their one finding was already compliant on disk, or was a
  logic-only file with no geometry to convert) passed verification.
  165 passed clean on the first verification loop. 13 needed one fix
  commit and passed on re-verify. 1 needed a second fix commit and
  passed its own follow-up re-check.
- **Flagged for Brian: 14 packages.** Held out entirely, zero edits,
  because at least one of their findings requires a design or UX
  decision this run is not authorized to guess at. Full list and plain-
  language description in docs/NICK-SWEEP-NOTES.md.
- **Frozen: 0.** No package hit the three-loop fix cap.
- **Circuit breaker events: 0.** No rule family failed on four or more
  packages for the same reason.

## Flags, by rule family, with the fix applied

Every flag below was found by verification agents that did not do the
original edit, then fixed and re-verified before this report was
written. None remain open.

**Destructive (10 flags)** -- the most common miss, mostly missed
findings or fills left on an otherwise-recolored control:
- `character-template-builder`: raw red hover classes, not
  `--status-danger`. Fixed: swapped to the quiet token treatment.
- `item-registry-builder`: fill correctly removed, but geometry
  (radius, height, padding) still didn't match sibling buttons. Fixed:
  brought onto the same control-size tokens as its siblings.
- `lore-editor`: one icon-only delete trigger missed among several
  already-fixed siblings in the same file. Fixed: matched the siblings.
- `mechanics-command-requirements`: icon-only trigger, no visible word.
  Fixed: added the word beside the icon.
- `scenario-cast-requirements-section`: raw red hover, package had no
  prior restyle commit at all. Fixed.
- `creation-image-library-page`: a prior commit's message claimed this
  was fixed but the diff never touched the file. Fixed for real this
  time: dropped the fill, quiet text-only treatment.
- `item-starting-assignment-editor`: icon-only trigger, no visible
  word. Fixed: added the word.
- `story-room-npc-participant-manager`: shared action button rendered
  every action (including remove) in the same color. Fixed in two
  passes: first swapped the label color, verification caught that the
  fill and border were still gold-tinted too, second pass dropped
  those as well.
- `story-room-runtime-mechanics-panel`: the mechanical half of the
  finding (text color) was skipped along with the confirm-step half,
  which legitimately needed a design call. Fixed: split them, text
  color changed, confirm-step gap still tracked separately.

**Corners (3 flags):**
- `image-studio-workbench`: two untokenized `rounded-xl` instances not
  named in the original findings but within this package's assigned
  rule family. Fixed.
- `media-history-grid`: the last of five off-scale corner sites in one
  file, four already fixed, one missed. Fixed.
- `story-room-chat-shell`: this flag was a verifier misattribution, not
  a real miss. It found issues in a file that belongs to the separately
  held-out `story-room-chat-shell` package (one of the 14, untouched by
  design), not to the `components/studio/story-rooms` package actually
  being checked. The real finding for that package was already correct.
  No fix needed, verified by direct inspection.

**Blur (1 flag):**
- `public-profile-donate-button`: blur strength was correctly moved to
  the token, but the paired scrim color was left as a raw value instead
  of its matching token. Fixed.

**Creator card ruling / Banner taxonomy (1 flag, structural):**
- `creator-card`: the only flag that was a real structural miss, not a
  token swap. The original conversion did the corner and wash fixes but
  skipped the two findings that required moving JSX around (engagement
  actions and the profile link were still overlapping the artwork
  instead of sitting below it, and the header wrapped across multiple
  lines instead of one). Fixed: artwork isolated into its own banner
  strip with a fade veil, avatar/handle/stats as one line inside it,
  everything else moved to a body section below.

## Frozen packages

None.

## Circuit breaker events

None.

## Contact sheet locations

`docs/review-artifacts/mobile/` and `docs/review-artifacts/desktop/`,
67 routes each, 134 PNGs total. Covers every real `app/` route (every
`page.js`/`page.jsx`, dynamic segments filled with placeholder values).
Does not cover the 224 `app/dev/ui-preview/*` component-preview routes;
that was a disclosed scope cut, not a silent one, made because every
package underneath those preview routes was already code-verified in
the verification pass above. See docs/SWEEP-PROGRESS.md for the full
render-pass log, including a caution about cross-talk between the four
concurrent rendering agents that shared one browser session (caught and
corrected before this report, one route's verdict flipped from a
contaminated PASS to its real result, a crash -- see below).

Render-pass verdict: zero restyle regressions across all 67 routes.
No off-scale corners, no filled destructive buttons, no misapplied blur
found anywhere, at either width.

Three pre-existing bugs surfaced by the render pass, none caused by
this sweep, none touched, all out of scope for a restyle run:
1. `app/chronicle/[...slug]/page.js` and `app/stories/[...slug]/page.js`
   are both 0-byte files (dated before this run started). Any URL under
   `/chronicle/<slug>` or `/stories/<slug>` hard-crashes.
2. A `LoreCard` component spreads a `key` prop into JSX, a React dev
   warning (not a runtime error) on `/`, `/characters`,
   `/factions/example-slug`, `/stories`.
3. `/locations` shows two broken image placeholders (400 on the image
   request) instead of cover art for two of three location cards.

## Phase timings

Approximate, this session:
- Phase A.1 (scope verification): under 20 minutes.
- Phase A.2 (QA gate ruled into CLAUDE.md): a few minutes.
- Blur token mint: a few minutes.
- Phase A.3 sub-batch 0 (9 packages, hand-converted): under 30 minutes.
- Phase A.3 sub-batches 2-19 (160 packages, first workflow wave): about
  37 minutes wall-clock (background), 134 converted, 19 stopped on a
  stale-worktree-base bug in this session's isolation:'worktree'
  mechanism (see docs/SWEEP-PROGRESS.md for the known-issue note).
- Phase A.3 retry (19 packages, second workflow wave): about 1 minute,
  hit the identical stale-base bug on every package, so all 19 were
  hand-converted directly instead, roughly 25 minutes.
- Phase B verification loop 1 (179 packages): about 10 minutes
  wall-clock (background), 165 PASS, 14 FLAG.
- Phase B fix pass (14 packages, hand-fixed): about 20 minutes.
- Phase B verification loop 2 (13 packages): about 1 minute wall-clock.
- Phase B fix loop 2 (1 package) plus single-package re-check: a few
  minutes.
- Phase C render pass (67 routes x 2 widths, 4 parallel agents plus a
  4-route gap-fill and one corrected re-check): about 25 minutes
  wall-clock.
- Phase D audit (14 held-out packages, read-only): under 10 minutes.
- Phase E (this report plus docs/NICK-SWEEP-NOTES.md): under 10 minutes.

## Verify-at-end-of-run checklist

- Every commit maps to exactly one package or one file: yes, checked
  by construction (one Edit/commit cycle per package throughout).
- Zero contracts or ViewModels modified: yes, every change this run was
  to a `.view.jsx`/`.jsx` markup file or `app/theme.css` (the one
  `--blur-panel` token mint); no `.contract.js` or ViewModel hook file
  was touched.
- Zero of the 14 held-outs edited: yes, confirmed by `git log` showing
  no commits touching any of the 14 package directories this run.
- Zero new hex outside token blocks: yes, every conversion used
  `var(--token-name)`, no new literal color or radius values introduced.
- Zero em dashes in permanent files: yes, checked file by file across
  every commit this run (generated audit artifacts, this file and
  docs/BATCH-TWO-ORDER.md's finding-bullet format, are exempt by
  standing rule). Pre-existing em dashes in unrelated UI copy/comments
  in a handful of touched files were left alone, not touched, per
  "no adjacent tidying."
- Production build exits 0: yes, verified after sub-batch 0, after the
  full sub-batch 2-19 merge, after all Phase B fixes.
- Git clean and pushed: clean, not yet pushed (see note to Brian).
