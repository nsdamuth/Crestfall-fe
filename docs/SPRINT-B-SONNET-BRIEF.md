# SPRINT-B-SONNET-BRIEF v1.0.0, SUPERSEDED 10 Aug 2026 by docs/SPRINT-D-SONNET-BRIEF.md

**SUPERSEDED.** This brief is replaced by
docs/SPRINT-D-SONNET-BRIEF.md, whose phase 6 (workstream W2) carries
this sprint's scope updated to inherit rulings R1 through R7 of the
10 Aug 2026 modal-system gate. Do not run this brief. Kept for
lineage only.

# SPRINT-B-SONNET-BRIEF v1.0.0, written 10 Aug 2026, for one unattended Sonnet session

Engine Sonnet, effort high, auto-accept. Execute the three phases
below in order, unattended. This brief plus the repo is everything
you need; nothing lives in any prior chat. This sprint runs AFTER
the Sprint A polish brief has landed; its premise check is below.

## FIRST ACTIONS

1. Run `git status`. You must be on `design/kit-polish-3` with a
   clean tree. Never touch main. If the tree is dirty or the branch
   is wrong, STOP and write the handoff (see STOP RULES).
2. Premise check: `components/kit/studio-page/` and
   `components/kit/credits/` must exist, and
   `components/kit/image-overlay/KitImageOverlay.view.jsx` must
   carry the gold-hairline-and-shelf treatment (grep it for
   `--gold-ornament`). If any is missing, the Sprint A polish pass
   has not landed: STOP and report; do not build on the old
   skeleton.
3. Read, in this order: `CLAUDE.md`, `docs/SPRINT-B-PLAN.md` (the
   execution spec; where this brief says "per plan section N" that
   section is authoritative detail), `docs/SPRINT-A-POLISH-PLAN.md`
   (rulings R1 through R11 this page inherits),
   `docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md` sections 1, 2, 3,
   8, 13, 14, 17, `docs/BUILD-BLUEPRINT.md` sections 2.16, 3.3, 3.4,
   and `docs/HANDOFF-NEXT-CHAT.md` (top section).
4. Read before writing any code:
   `components/kit/studio-page/` (all files),
   `app/studio/v2/vault/VaultV2Mockup.jsx` and
   `app/dev/ui-preview/vault-v2-page/` (the closest existing page
   pair; this page follows their shapes),
   `components/kit/studio-filter-bar/KitStudioFilterBar.view.jsx`,
   `components/kit/creation-card/KitCreationCard.contract.js`,
   `lib/shared/presentation/terminology.js`, and
   `components/studio/studio-sidebar/useStudioSidebarViewModel.js`.

## RULES IN FORCE

- Tokens only. Every color, size, and typography value resolves
  through `var(--token)` per `docs/DESIGN-TOKENS.md` and the
  token-first directive (FRONTEND-SOP section 17). A value with no
  token is a missing token: stop that unit and report it, never
  invent a literal. This sprint mints NO new token.
- Content width law (R1): one content width per page; heading block,
  sticky filter line, card grid and list, load-more, and bottom
  banner share the same left and right edges, flush to the shell's
  section padding, via the `studio-page` scaffold. No max-width, no
  second padding layer, no element narrower than the filter line.
- Banner law (R2): fixed proportions, scales with content width,
  never narrower or shorter than the content above it.
- Card law: full-bleed art in BOTH grid and list layouts,
  overlay-top actions, no bottom action bar.
- Filter line law: one sticky line of branded dropdowns, search
  anchored left, control group anchored right; below 700px search on
  its own full-width row, the control line scrolls horizontally.
- Tag economy: a badge renders only when it informs; Canon is the
  only gold badge; visibility badges only in own-work contexts;
  never a badge restating an active filter selection. This page
  ships badge-free cards per plan section 3.
- Selection states: gold mark plus light `--fill` wash. Focus law:
  subtle line only, nothing on pointer. Corners two tiers; PILL for
  tags and icon buttons only.
- Ratings are read from `lib/shared/presentation/terminology.js`,
  never assumed. Backend names unchanged; display text only through
  the terminology module.
- Held pages out of scope entirely: Adventures, Studio, Home, Lore.
  The old image-studio and image-library pages are read-only
  reference for the parity echo; never edit them.
- Subagents are read-only. Every edit happens serially in this main
  session.
- Never run /init. Never run a production build or clear caches
  while the dev server runs; skip the production build and flag it.
- No em dashes anywhere, in code or docs. Verify with
  `grep -rn $'\xe2\x80\x94'` on every file you touch before each
  commit. Never sed or awk on markup or CSS.
- Dev server law: Brian's server may be on 3001; check first
  (`lsof -i :3001`), use it if present, NEVER restart or kill it.
  Anything you start uses its own port and PID; kill only that PID.
- Contract law: presentation may change; what a component reports
  may not. NO contract change of any kind is authorized in this
  brief; this page only consumes existing kit contracts. If a step
  appears to need one, STOP that phase and write it up.
- No decision is made for Brian. Anything ambiguous beyond the
  plan's written defaults goes in the report under OPEN FOR BRIAN
  with the work stopped there, not guessed past.
- Definition of done: `docs/APP-FUNCTION-MAP.csv` gains a row for
  every control shipped, in the same commit; never hand-edit the
  markdown rollup; log "rollup not regenerated, script not in repo".

## STOP RULES

- Commit and push at the end of every phase, with a descriptive
  message per logical chunk.
- Never start a phase you cannot finish AND verify inside your
  remaining context.
- If a phase fails verification twice, or your remaining context
  drops below roughly 15 percent: stop immediately, write
  `docs/HANDOFF-NEXT-CHAT.md` with exact per-phase state, zero em
  dashes, commit, push, end the session.
- If a rule cannot be applied mechanically, or the repo contradicts
  this brief's premise anywhere, stop that unit and report it.
  Never guess.

## VERIFY (end of every phase)

Rendered checks only, Chrome DevTools MCP, on
`/dev/ui-preview/images-v2-page` and the package previews touched:

1. 390x844, deviceScaleFactor 2, mobile, touch, FIRST: every fixture
   state, no horizontal overflow, nothing clipped, everything
   reachable.
2. Then 1440, sidebar expanded AND collapsed in the mirror.
3. R1 measurement: getBoundingClientRect left/right of the filter
   line inner control row, heading block, grid container, load-more,
   and banner; all five match within 1px at both widths, both
   sidebar states. Report the numbers.
4. Walk: search, both dropdowns (multi-select counts, sheet at 390,
   popover at 1440), sort, view toggle both layouts, a card open
   into the overlay (hairline, shelf, zoom in and out), load more to
   exhaustion, empty and loading modes, banner CTA reachable.
5. Console: zero NEW errors (the crestfall-seal.svg preload warning
   is known). ESLint: zero NEW errors (the three
   StudioSidebar.view.jsx errors are known, untouched).
6. Production build SKIPPED, flagged "pending morning check".
   Anything unverified is reported as unverified, never as done.

## THE THREE PHASES

### Phase 1: the page and its mirror

Per plan sections 1 through 3. Build `app/studio/v2/images/page.jsx`
plus `ImagesV2Mockup.jsx` composed on `KitStudioPageView`
(harness, header, filter bar, content, banner slots): header eyebrow
"Create", title "Images", plan-2 description; filter bar with
Linked asset (Characters, Stories, Adventures, Unlinked) and Style
(Anime, Realistic) multi-selects, sorts Newest/Most hearted/Most
saved, view toggle; eighteen fixture images per plan section 3 with
linked-asset and style fields; badge-free cards, stats
hearts/saves only; every card opens `KitImageOverlay`; Love/Save
local toggles; load more PAGE_SIZE 12; empty and loading states on
the standing recipes; bottom banner selling the Vault. Mirror at
`app/dev/ui-preview/images-v2-page/` on the exact existing preview
client pattern (StudioShellView, preview sidebar fixture with
collapse state, real StudioTopBar), `notFound()` in production.
VERIFY. Commit, push.

### Phase 2: sidebar preview flip and CSV

Per plan sections 3 and 5. Flip Images to `isBuilt: true` in
`useStudioSidebarViewModel.js` and the sidebar preview fixture (the
preview surface only; the real sidebar gains nothing). Add the CSV
rows for every control shipped in Phase 1, destination "Create >
Images". VERIFY (the preview nav routes Images correctly at both
widths; nothing else in the sidebar changed). Commit, push.

### Phase 3: parity echo, handoff, report

Per plan section 4. Echo every CSV row for `/studio/image-studio`
(48) and `/studio/my-creations/[id]/image-library` (22), 70 rows,
each Present (file and line), Deliberately excluded (ruling cited by
name), or Flagged for Brian. A fixture no-op is not Present.
Composer rows land Flagged (no ruling exists; do not invent one).
Note in the echo header that the Vault echo previously counted the
22 image-library rows under its own reconciliation. Update
`docs/HANDOFF-NEXT-CHAT.md` (top section: this sprint's state, the
echo summary, open picks), zero em dashes, commit, push as the
final commit.

## REPORT (end of session)

Echo this brief's manifest part by part, DONE or STOPPED, in the
established style:

1. Per phase: DONE with commit hash(es), or STOPPED with exact
   state and next action.
2. The full 70-row parity echo.
3. The R1 edge measurements as measured.
4. Every OPEN FOR BRIAN item: the plan's five plus anything new.
   Never resolve one.
5. Everything unverified, named as unverified: at minimum
   "production build pending morning check" and "rollup not
   regenerated, script not in repo".
6. Final `git status` output confirming a clean tree and the branch
   pushed.
