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

## Phase B status

Loop 1 complete: 179 packages verified (workflow `wf_708b04c1-0f9`), 165
PASS, 14 FLAG. Of the 14: 13 were real mechanical misses (missed finding
instance, wrong/untokenized geometry, missing icon+word label, wrong
scrim token) and fixed with one `fix:` commit each. 1
(`components/studio/story-rooms`) was a verifier misattribution: it
found issues in `story-room-chat-shell/StoryRoomChatShell.view.jsx`, a
file that belongs to the separately held-out `story-room-chat-shell`
package (one of the original 14 flagged, not touched this run), not to
the `components/studio/story-rooms` package actually being checked.
The real finding for `components/studio/story-rooms`
(`StoryRoomMobileToolbar.jsx:9`) was already correctly converted.
`story-room-chat-shell` itself remains untouched, as it should be.

`components/studio/community/creator-card` was the one genuine structural
fix: the original conversion only did Corners/Wash and skipped the
Creator card ruling and Banner taxonomy findings (moving actions below
the artwork, single non-wrapping avatar/handle/stats line, isolating the
artwork into a proper top-banner strip). Rewritten to match; production
build verified after.

Production build verified exit 0 after all 13 fix commits. Re-verify
loop 2 (`wf_5d04d781-9ab`) came back 12/13 PASS. The one FLAG
(story-room-npc-participant-manager) was real: the unload button's text
went to --status-danger but its gold-tinted fill/border were left in
place, which the Destructive ruling's quiet-ghost geometry does not
allow. Fixed (loop 2 fix commit), build verified, single-package
re-verify agent launched to close the loop (this is loop 2 of the
3-loop cap for this package).

Phase B is CLOSED. 179/179 packages verified PASS: 165 clean on loop 1,
12 fixed once and passed loop 2, 1 (story-room-npc-participant-manager)
fixed twice and passed its own single-package re-check. Zero packages
frozen, zero circuit breakers triggered.

## Current phase

Phase C: judged render pass. Scope decision, disclosed not hidden: the
dev server was already running at localhost:3001. Rendering the 67 real
app routes (every page.js/page.jsx under app/, dynamic segments filled
with placeholder values) at 390x844x2 mobile then 1440x900x1, four
parallel agents each in their own isolated browser context covering
~17 routes, PASS/FLAG judged per route, screenshots to
docs/review-artifacts/mobile/ and docs/review-artifacts/desktop/.

NOT rendered this pass: the 224 app/dev/ui-preview/* routes. Those are
1:1 preview harnesses for individual components, and every one of the
179 packages actually in scope for this sweep already went through
Phase B's code-level rule verification (PASS). Rendering all 224 as
well was judged not worth the wall-clock at this point in an already
very long run; this is a disclosed scope cut, not a silent one. If
Brian wants the preview-route render pass done too, it is the same
mechanism, just more agents.

Phase C is DONE. 67/67 app routes rendered at 390x844x2 mobile then
1440x900x1 desktop, contact sheets in docs/review-artifacts/mobile/ and
docs/review-artifacts/desktop/ (134 PNGs). A chunking transcription
error left 4 routes uncovered by the 4 parallel agents (/studio, /lore,
/locations/example-slug, /stories/example-slug); rendered those directly
afterward, not silently dropped.

The 4 concurrent chunk agents shared one chrome-devtools MCP browser
instance with a single global "selected page" pointer, causing real
cross-talk: each agent had to repeatedly re-select its own tab and
retry captures. One contaminated read slipped through anyway:
chunk 1 reported /chronicle/example-slug as a clean redirect to the
chronicle list; a direct, uncontaminated re-check (this session, main
loop) shows that route actually hard-crashes ("The default export is
not a React Component in /chronicle/[...slug]/page"). Corrected below.
This is a caution for any future run reusing this pattern: concurrent
agents on one shared browser session need per-result spot verification,
not blind trust.

RESTYLE-RULE VERDICT: zero regressions from this sweep. Every route
checked clean against Corners, Shape law, Destructive, and Blur: no
off-scale rounded-2xl, no filled red destructive buttons, no misapplied
backdrop-blur, at either width, anywhere in the 67 routes.

Three real bugs surfaced, all pre-existing, none caused by the sweep,
none touched (out of scope, for Nick):

1. `app/chronicle/[...slug]/page.js` and `app/stories/[...slug]/page.js`
   are both literally 0-byte files (confirmed via `wc -c`, both dated
   2 Aug, before this sweep started). Any URL under /chronicle/<slug> or
   /stories/<slug> hard-crashes with "the default export is not a React
   Component." A real broken route pattern, not a design regression.
2. `LoreCard` spreads a `key` prop into JSX (React dev warning, not a
   runtime error). Seen on /, /characters, /factions/example-slug,
   /stories. One root cause, one component, cheap fix, not styling.
3. `/locations`: two of three location cards show broken images
   (400 Bad Request on the image URL) instead of the cover art. An
   asset/data issue, not a token or corner regression.

Neither of the two console items the brief called out as known
pre-existing (seal.svg preload, media-history 401) fired on any of
these 67 routes; most `/studio/*` routes redirect to the /login auth
gate before those code paths would run.

Not rendered: the 224 app/dev/ui-preview/* routes (see the scope note
above -- disclosed cut, not silent, all underlying packages already
Phase-B verified).

## Phase D: read-only audit of the 14 held-out packages

Zero edits made. For each: what it needs in plain language, and whether
it touches a contract or ViewModel. Precedent checked: `window.confirm`
is already the pattern used for confirm-step behavior elsewhere in this
codebase (`useCreationEditViewModel.js:356`, `useMediaLightboxViewModel.js`).
That pattern changes a ViewModel hook's internal handler body, not the
component's prop contract (the click-handler prop signature is
unchanged), so most confirm-step items below are ViewModel-touching but
NOT contract-touching, unless Brian wants a custom confirm dialog UI
instead of the plain browser confirm, which would need new open/close
state (could still be local View state, not necessarily a contract
change, but is a bigger lift than `window.confirm`).

1. **creation-studio** (CorePathCompleteBanner): needs a banner-treatment
   pick, one of the three named taxonomy treatments. Presentation-only,
   no contract or ViewModel change either way.
2. **npc-registry-builder**: the delete action is icon-only with no
   visible word; needs a label added beside the icon. Presentation-only.
3. **wardrobe-builder**: one off-scale radius with no stated target tier
   (needs a corners call); one confirm-step gap (see precedent above).
   Presentation-only for the radius; ViewModel-touching, not
   contract-touching, for the confirm step if `window.confirm` is used.
4. **custom-ingredient-editor**: one off-tier icon-button radius with no
   stated target tier. Presentation-only.
5. **my-creations** (top-level package): a wash and a blur pairing, both
   missing their stated target token. Presentation-only.
6. **character-appearance-section**: whether a small nested art
   thumbnail qualifies for the small-nested-art-thumbnail radius
   exception, or should be a standard tier. Presentation-only.
7. **location-registry-attachments-section**: one confirm-step gap.
   Same as item 3's confirm-step note.
8. **weather-module-config-modal**: one confirm-step gap on a "Remove"
   action that currently clears all trackers/guards in one click. Same
   confirm-step note; this one has real destructive-blast-radius stakes
   (removes everything at once), worth flagging to Nick as higher
   priority than the others.
9. **mechanics-composition-builder**: three confirm-step gaps (remove
   step/condition/effect). Same confirm-step note, times three.
10. **mechanics-status-blocks**: geometry mismatches between button
    variants with no stated target geometry. Needs a corners/control-size
    call. Presentation-only.
11. **mechanics-trackers**: same as mechanics-status-blocks, geometry
    mismatches with no stated target. Presentation-only.
12. **npc-registry-fields-section**: one confirm-step gap. Same
    confirm-step note.
13. **public-profile-hero**: the stats block sits outside the named
    banner-taxonomy anchor points, a layout/composition call with no
    stated target. Presentation-only, but is a real layout change
    (moving a block), not a one-line token swap.
14. **story-room-chat-shell**: two findings, one presents two candidate
    resolutions without picking one, the other states no resolution at
    all. Needs Brian's eye on the actual rendered component to pick.
    Presentation-only either way.

## Phase D, item 12: packages stopped for Nick, and why

All 14 above stopped because the parallelism law's escalation rule
("a workflow that meets a rule it cannot apply mechanically stops that
unit and reports it, never guesses") applied: each carries at least one
finding whose text does not state a mechanical target, or explicitly
requires a design/UX decision (confirm-step interaction pattern, banner
treatment choice, layout placement, radius-tier judgment call). No
other packages stopped in this run: the 179 that were in scope for
mechanical conversion all converted or verified clean; the two
route-crash bugs and the LoreCard/locations-image issues found in
Phase C are pre-existing and out of scope for this restyle sweep
entirely, not something that "stopped" -- they were never part of the
batch-two package list.

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
