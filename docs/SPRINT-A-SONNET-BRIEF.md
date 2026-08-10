# SPRINT-A-SONNET-BRIEF v1.0.0, written 10 Aug 2026, for one unattended overnight Sonnet session

Engine Sonnet, effort high, auto-accept. Execute all six phases below
in order, unattended. This brief plus the repo is everything you
need; nothing lives in any prior chat.

## FIRST ACTIONS

1. Run `git status`. You must be on `design/kit-polish-3` with a
   clean tree. Never touch main. If the tree is dirty or the branch
   is wrong, STOP and write the handoff (see STOP RULES).
2. Read, in this order: `CLAUDE.md`, `docs/SPRINT-A-PLAN.md` (the
   execution spec for every phase below; where this brief says "per
   plan section N" that section is authoritative detail),
   `docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md` sections 1, 2, 3,
   8, 13, 14, 17, `docs/BUILD-BLUEPRINT.md` sections 2.0, 2.5, 2.14,
   2.15, 2.16, 3.3, 3.4, and `docs/HANDOFF-NEXT-CHAT.md`.
3. Read `components/ui/modal-shell/` (all files),
   `components/kit/image-overlay/`, `components/kit/dropdown/`,
   `app/studio/v2/community/CommunityV2Mockup.jsx`, and
   `app/dev/ui-preview/community-v2-page/CommunityV2PagePreviewClient.jsx`
   before writing any code.

## RULES IN FORCE

- Tokens only. Every color, size, and typography value resolves
  through `var(--token)` per `docs/DESIGN-TOKENS.md` and the
  token-first directive (FRONTEND-SOP section 17). A value with no
  token is a missing token: stop that unit and report it, never
  invent a literal.
- Card law: full-bleed art in BOTH grid and list layouts, overlay-top
  actions only, no bottom action bar anywhere.
- Filter line law: search, every filter, and sort share one sticky
  line of branded dropdowns; search anchors left, the control group
  anchors right; below 700px search takes its own full-width row and
  the control line scrolls horizontally.
- Tag economy: a badge renders only when it informs; Canon is the
  only gold badge; visibility badges only in own-work contexts; never
  a badge restating an active filter selection.
- Selection states: gold mark plus light `--fill` wash, never bold
  borders or heavy outlines.
- Focus law: keyboard focus shows a subtle line only (border
  brightening to `--line-strong` where locally handled, or the
  standing global rule); pointer interaction shows nothing.
- Corners, two tiers: LARGE (`--radius-lg`) for floating and
  full-content-width surfaces, STANDARD (`--radius-md`) for grid
  siblings and controls. PILL (`--radius-full`) for tags and icon
  buttons only; a text button is never a pill.
- Ratings mapping is read from
  `lib/shared/presentation/terminology.js` (`CONTENT_RATING_TIERS`),
  never assumed and never taken from doc prose (the blueprint's
  2.16(h) prose is stale on this; the module is final law per plan
  section 0.1).
- Backend names unchanged. Display text only ever comes through the
  terminology module.
- Held pages are out of scope entirely: Adventures, Studio, Home,
  Lore. Do not touch them, their routes, or their components.
- Subagents are read-only. Every edit happens serially in this main
  session.
- Never run /init. Never run a production build or clear caches
  while the dev server is running.
- No em dashes anywhere, in code or docs. Verify with
  `grep -rn $'\xe2\x80\x94'` on every file you touch before each
  commit.
- Never sed or awk on markup or CSS.
- Dev server law (FRONTEND-SOP section 8): Brian's server may be on
  3001; check first (`lsof -i :3001`), use it if present, NEVER
  restart or kill it. If you must start one, use another port, track
  its PID, and kill only that PID when done.
- Contract law: presentation may change; what a component reports may
  not. If any step appears to need a contract, ViewModel, or
  data-flow change beyond what `docs/SPRINT-A-PLAN.md` already
  specifies, STOP that phase and write it up; never decide it.
- No decision is made for Brian. Anything ambiguous beyond the plan's
  written defaults goes in the report under OPEN FOR BRIAN with the
  work stopped at that point, not guessed past.
- Definition of done per phase: `docs/APP-FUNCTION-MAP.csv` gains or
  updates a row for every control shipped, in the same commit. The
  markdown rollup's generator script is not in this repo: do NOT
  hand-edit `docs/APP-FUNCTION-MAP.md`; log "rollup not regenerated,
  script not in repo" in the report instead (plan section 0.3).

## STOP RULES

- Commit and push at the end of every phase, with a descriptive
  message per logical chunk.
- Never start a phase you cannot finish AND verify inside your
  remaining context.
- If a phase fails verification twice, or your remaining context
  drops below roughly 15 percent: stop immediately, write
  `docs/HANDOFF-NEXT-CHAT.md` with exact per-phase state (each phase
  DONE with commit hash, or STOPPED with what is done, what is not,
  and the exact next action), zero em dashes in it, commit, push,
  end the session.
- If a rule cannot be applied mechanically, or the repo contradicts
  this brief's premise anywhere, stop that unit and report it. Never
  guess.

## VERIFY (run at the end of every phase, before its commit is called done)

Rendered checks only, via Chrome DevTools MCP against the running dev
server (see dev server law):

1. Emulate viewport 390x844, deviceScaleFactor 2, mobile, touch,
   FIRST. Walk every fixture state and every new surface. No
   horizontal overflow, nothing clipped, everything reachable.
2. Then 1440 wide. Same walk.
3. Console: zero NEW errors. Known pre-existing noise: one
   crestfall-seal.svg preload warning. Anything else new fails the
   phase.
4. ESLint on every touched file: zero NEW errors. Known pre-existing:
   three `react-hooks/static-components` errors in
   `StudioSidebar.view.jsx`; they stay, they do not count, do not fix
   them.
5. Production build is SKIPPED overnight, deliberately. Flag
   "production build pending morning check" in the report. Anything
   unverified is reported as unverified, never as done.

## THE SIX PHASES

### Phase 1: modal frame kit package

Per plan section 1 (contract prop by prop, exact anatomy classes,
composition) and section 2 (the carve). Build the full LOOM shape:

- `components/kit/KitModalFrame.jsx`,
  `components/kit/modal-frame/KitModalFrame.view.jsx`,
  `useKitModalFrameViewModel.js`, `KitModalFrame.contract.js` with
  `export const KIT_MODAL_FRAME_VIEW_CONTRACT_VERSION = "1.0.0";` on
  line 1, `KitModalFrame.fixtures.js`, `README.md`.
- Behavior composes the existing ModalShell ViewModel and View
  (`components/ui/modal-shell/`); ModalShell itself and all its
  current callers are untouched (plan section 2.3 lists every one).
- Frame law: backdrop click, Escape, and the circular close control
  all dismiss. Bottom-docked sheet under 700px (LARGE top corners
  only, safe-area padding), centered floating surface at 700px and
  up (LARGE corners all around). `--surface-4` panel, 1px `--line`
  border, `--shadow-modal`, veil `--scrim-strong` plus
  `--blur-panel`, portaled to body. `variant` prop: `"modal"`
  (default, responsive) or `"sheet"` (always docked). Width and
  height stay per-surface via `panelClassName`.
- Fixture route at `app/dev/ui-preview/modal-frame/` (this exact
  address, ruled by the gate manifest), `notFound()` in production,
  rendering all five fixtures from plan 1.4: default, scrolling,
  sheet, noClose, stacked.
- CSV row for the close control. VERIFY. Commit, push.

### Phase 2: asset detail popup

Per plan section 3. Build
`components/kit/asset-detail-popup/` (full LOOM,
`KIT_ASSET_DETAIL_POPUP_VIEW_CONTRACT_VERSION = "1.0.0"` line 1,
preview at `app/dev/ui-preview/kit-asset-detail-popup/`), composed on
KitModalFrame: art-bleed header with over-art title, subtitle, and
badges; body description and stat row; footer with the derived
primary action (Play for character and story, Continue for
adventure), Share (icon plus word), and Save toggle (selection-state
law). Fixtures: character, story, adventure, saved, longestCopy,
noImage.

Then migrate `CommunityV2Mockup.jsx`: delete the
`AssetDetailPlaceholder`, give the fixture rows short `description`
strings, and open the real popup with Save wired to the existing
`savedIds` state (plan 3.5). CSV rows for the popup's controls.
VERIFY (both the package preview and the community mirror at
`/dev/ui-preview/community-v2-page`). Commit, push.

### Phase 3: image overlay conversion

Per plan section 4. Convert `components/kit/image-overlay/` onto the
frame: the shell renders KitModalFrame; the view loses its interim
scrim plate and its own X; contract version moves to `"1.0.0"` with
`onClose` leaving the VIEW props (the shell still accepts it and
forwards it to the frame; package-level props unchanged). Remove
every interim comment and rewrite the README per plan 4.1. Migrate
`CommunityV2Mockup.jsx` off its ModalShell wrapper to direct
`<KitImageOverlay />` usage, and update the `kit-image-overlay`
preview route; add the one additive `noImage` fixture. VERIFY: the
overlay opens from a Community image card and a creator thumbnail
context (package preview), closes on backdrop, Escape, and the close
control, at 390 (sheet) and 1440 (centered). Commit, push.

### Phase 4: dropdown unification

Per plan section 5. Swap `KitDropdown`'s hand-rolled under-700px
sheet for KitModalFrame `variant="sheet"` behind a
presentation-only `matchMedia` flag; the 700px-and-up popover is
byte-for-byte unchanged; every ruled dropdown behavior in plan 5.1
must read identically after the swap (walk that list one item at a
time in verification). Contract stays `"1.0.0"`; README mobile-law
section updated. VERIFY on `/dev/ui-preview/kit-dropdown` and inside
the community mirror's filter bar: at 390 open Type, toggle two
options, open Rating (its rows and tooltips come from the
terminology module), confirm sheet closes by backdrop, Escape, and
close control, confirm the trigger counts; at 1440 confirm the
popover, outside-click close, Escape close, single-select Sort
closing on pick. Commit, push.

### Phase 5: /studio/v2/creators

Per plan section 6, built from the locked kit, fixture-driven, out of
the sidebar. `app/studio/v2/creators/page.jsx` plus
`CreatorsV2Mockup.jsx`; auth-free mirror at
`app/dev/ui-preview/creators-v2-page/` on the exact
CommunityV2PagePreviewClient pattern (StudioShellView, preview
sidebar fixture with collapse state, real StudioTopBar). Composition,
copy, sorts, grid columns, wiring, loading and empty states: plan
6.2 and 6.3, verbatim. Flip Creators to `isBuilt: true` in
`useStudioSidebarViewModel.js` and the sidebar preview fixture (plan
section 8); the real sidebar gains nothing. CSV rows for the page's
controls.

End the phase with the parity echo (plan 6.4): every CSV row for
`/studio/profile`, `/studio/profile/[username]`, and
`/studio/profile/[username]/connections`, each marked Present (file
and line), Deliberately excluded (ruling cited by name), or Flagged
for Brian. A fixture no-op is not Present. Put the echo in the
report, not in a new doc. VERIFY at 390 then 1440, sidebar expanded
and collapsed in the mirror. Commit, push.

### Phase 6: /studio/v2/vault

Per plan section 7, same shapes as Phase 5:
`app/studio/v2/vault/page.jsx` plus `VaultV2Mockup.jsx`, mirror at
`app/dev/ui-preview/vault-v2-page/`. Filter bar with Type and
Visibility groups plus sorts and the view toggle; grid AND list card
layouts (list two-up at 1100 and up); own-work badge rules including
the active-filter suppression demonstration; image kinds open the
overlay, all else opens the asset detail popup; no edit, delete, or
bulk affordances anywhere (CR-007/CR-008 hold). Composition, copy,
fixtures: plan 7.2 and 7.3, verbatim. Flip Vault to `isBuilt: true`
in the preview nav (plan section 8). CSV rows for the page's
controls.

End the phase with the parity echo (plan 7.4): every CSV row for
`/studio/my-creations`, `/studio/my-creations/[id]/edit`, and
`/studio/my-creations/[id]/preview`; edit-tree and preview-tree rows
are expected to land as Deliberately excluded citing blueprint 3.1
row 3 and CR-007/CR-008 by name; hub rows accounted one by one.
VERIFY at 390 then 1440, expanded and collapsed, both layouts, every
fixture mode. Commit, push.

## REPORT (end of session)

Echo this brief's manifest part by part, each part marked DONE or
STOPPED, exactly in the HANDOFF-NEXT-CHAT.md style:

1. Per phase: DONE with commit hash(es), or STOPPED with exact state
   and next action.
2. The two parity echoes (Phases 5 and 6) in full.
3. Every OPEN FOR BRIAN item: restate the plan's eight (plan's OPEN
   FOR BRIAN section) plus anything new the run surfaced. Never
   resolve one.
4. Everything unverified, named as unverified: at minimum
   "production build pending morning check" and "rollup not
   regenerated, script not in repo".
5. Final `git status` output confirming a clean tree and the branch
   pushed.
6. Update `docs/HANDOFF-NEXT-CHAT.md` with the sprint's end state
   (state summary, per-phase echo, open picks), zero em dashes,
   committed and pushed as the final commit.
