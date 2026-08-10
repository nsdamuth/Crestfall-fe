# SPRINT-D-SONNET-BRIEF v1.0.0, written 10 Aug 2026, for one unattended Sonnet session

Engine Sonnet, effort high, auto-accept. Execute the nine phases
below in order, unattended. The phases group into four workstreams:
W1 modal system (phases 1 to 5), W2 Images page (phase 6), W3
Stories hub (phase 7), W4 Account draft (phase 8), then the handoff
(phase 9). Each workstream is committed, pushed, and verified before
the next begins. You have explicit permission to STOP CLEANLY at any
workstream boundary (after phase 5, 6, 7, or 8) when your remaining
context thins; a clean stop with a correct handoff is a success, not
a failure. This brief plus the repo is everything you need; nothing
lives in any prior chat.

## FIRST ACTIONS

1. Run `git status`. You must be on `design/kit-polish-3` with a
   clean tree. Never touch main. If the tree is dirty or the branch
   is wrong, STOP and write the handoff (see STOP RULES).
2. Read, in this order: `CLAUDE.md`, `docs/SPRINT-D-PLAN.md` (the
   execution spec for every phase below; where this brief says "per
   plan section N" that section is authoritative detail),
   `docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md` sections 1, 2, 3,
   8, 9, 13, 14, 17, `docs/BUILD-BLUEPRINT.md` sections 2.0, 2.3,
   2.5, 2.6, 2.16, 3.1, 3.3, 3.4, and `docs/HANDOFF-NEXT-CHAT.md`
   (top section).
3. Read before writing any code:
   `components/kit/modal-frame/` (all files) and
   `components/ui/modal-shell/` (all files),
   `components/kit/image-overlay/` (all files),
   `components/kit/asset-detail-popup/` (all files),
   `components/kit/credits/` (all files),
   `components/kit/dropdown/KitDropdown.view.jsx`,
   `components/kit/promo-banner/KitPromoBanner.view.jsx`,
   `components/kit/studio-page/` (all files),
   `components/studio/studio-top-bar/StudioTopBar.view.jsx` (the
   sticky nav treatment the viewer veil reuses),
   `app/studio/v2/vault/VaultV2Mockup.jsx` (the page pattern W2, W3,
   W4 copy),
   `app/dev/ui-preview/vault-v2-page/` (the mirror pattern), and
   for phase 8 only, READ ONLY, never edit:
   `app/studio/account/page.js`,
   `components/studio/account/` (all packages),
   `components/studio/profile/profile-media-manager/`,
   `components/ui/CrestfallSelect.jsx`,
   `lib/shared/profile/constants` and
   `lib/shared/presentation/terminology.js`.
4. Do NOT read the old crestfall-main repo. The Phase Zero witness
   is already digested into plan section 0.1; the design intent is
   fully restated there and in plan 1.2. No code is imported from
   it.

## RULES IN FORCE

- Tokens only. Every color, size, and typography value resolves
  through `var(--token)` per `docs/DESIGN-TOKENS.md` and
  FRONTEND-SOP section 17. A value with no token is a missing
  token: stop that unit and report it, never invent a literal. This
  sprint mints NO new token. The ONE token-law edit authorized is
  the `--blur-chrome` legal-use amendment in plan 1.2, executed in
  phase 2, under Brian's ratified R2.
- Mobile verification method (R3, write it into law in phase 1,
  obey it from the first check): all mobile verification uses the
  Chrome DevTools MCP EMULATE command with viewport 390x844,
  deviceScaleFactor 2, mobile true, touch enabled. The resize
  command is BANNED for mobile checks; it clamps near 500px and has
  produced false passes. Any mobile result obtained through resize
  is void.
- Mobile modal law (R4): popup modals maximize the screen at phone
  width, vertically and horizontally, thumb scrolling inside. Never
  bottom-anchored, never small floating cards. Sheets stay bottom
  sheets with the R7 close header row.
- Content width law (R1 of Sprint A): one content width per page;
  heading, filter line, grid, load-more, and banner share edges,
  flush to the shell padding, no max-width cap, no second padding
  layer.
- Card law: full-bleed art in both layouts, overlay-top actions
  only (exactly three: like, save, expand), no bottom action bar.
- Filter line law: search anchors left, controls anchor right, one
  sticky line; below 700px search takes its own row and the control
  line scrolls horizontally.
- Tag economy: a badge renders only when it informs; Canon is the
  only gold badge; visibility badges only in own-work contexts;
  never a badge restating an active filter.
- Selection states: gold mark plus light `--fill` wash, never bold
  borders. Focus law: keyboard focus shows a subtle border
  brightening only; pointer focus shows nothing.
- Corners, two tiers: LARGE (`--radius-lg`) floating and
  full-content-width, STANDARD (`--radius-md`) grid siblings and
  controls, PILL (`--radius-full`) tags and icon buttons only.
- Ratings read from `lib/shared/presentation/terminology.js`
  (`CONTENT_RATING_TIERS`), never assumed. Backend names unchanged;
  display text only through the terminology module.
- Held pages out of scope entirely: Adventures, Studio, Home, Lore.
  The LIVE account page and its components
  (`app/studio/account/`, `components/studio/account/`,
  `components/studio/profile/`) are READ ONLY reference for phase
  8; never edit them. Never edit anything under
  `components/studio/creations/` or `lib/shared/creations/`.
- Subagents are read-only (audit and verification passes only).
  Every file edit, commit, and push happens serially in this main
  session.
- Never run /init. Never run a production build or clear caches
  while the dev server is running; skip the production build and
  flag it in the report.
- No em dashes anywhere, in code or docs. Verify with
  `grep -rn $'\xe2\x80\x94'` on every file you touch before each
  commit.
- Never sed or awk on markup or CSS.
- Dev server law (FRONTEND-SOP section 8): Brian's server may be on
  3001; check first (`lsof -i :3001`), use it if present, NEVER
  restart or kill it. If you must start one, use another port,
  track its PID, and kill only that PID when done. No broad
  process-name kills.
- Contract law: presentation may change; what a component reports
  may not. The ONLY contract changes authorized are the plan
  section 7 table: KitModalFrame 1.0.0 to 1.1.0 (additive viewer
  variant), KitCredits 1.0.0 to 1.1.0 (additive KitCreditsModal),
  and ModalShell one minor step ONLY if the veil passthrough in
  plan 1.2 proves necessary. KitImageOverlay, KitAssetDetailPopup,
  KitPromoBanner, KitDropdown, and everything else stay at their
  current versions. If any step appears to need any other contract,
  ViewModel, or data-flow change, STOP that phase and write it up;
  never decide it.
- No decision is made for Brian. Anything ambiguous beyond the
  plan's written defaults goes in the report under OPEN FOR BRIAN
  with the work stopped at that point, not guessed past. The plan's
  OPEN FOR BRIAN list already names 21 items with their built
  defaults; build the defaults, never resolve the items.
- Definition of done per phase: `docs/APP-FUNCTION-MAP.csv` gains
  or updates a row for every control shipped, in the same commit.
  Do NOT hand-edit `docs/APP-FUNCTION-MAP.md`; log "rollup not
  regenerated, script not in repo" in the report.

## STOP RULES

- Commit and push at the end of every phase, with a descriptive
  message per logical chunk.
- Never start a phase you cannot finish AND verify inside your
  remaining context. Workstream boundaries (after phases 5, 6, 7,
  8) are the sanctioned clean stop points; prefer stopping there.
- If a phase fails verification twice, or your remaining context
  drops below roughly 15 percent: stop immediately, write
  `docs/HANDOFF-NEXT-CHAT.md` with exact per-phase state (each
  phase DONE with commit hash, or STOPPED with what is done, what
  is not, and the exact next action), zero em dashes in it, commit,
  push, end the session.
- If a rule cannot be applied mechanically, or the repo contradicts
  this brief's premise anywhere (for example
  `components/kit/studio-page/` missing, or a contract version not
  matching plan section 0.12), stop that unit and report it. Never
  guess.

## VERIFY (run at the end of every phase, before its commit is called done)

Rendered checks only, via Chrome DevTools MCP against the running
dev server (see dev server law), on the auth-free mirror routes and
package previews:

1. EMULATE viewport 390x844, deviceScaleFactor 2, mobile true,
   touch enabled, FIRST. Never resize for mobile (R3). Walk every
   fixture state and every new surface. No horizontal overflow,
   nothing clipped, everything reachable, touch targets 44px or
   larger.
2. Then 1440 wide. Same walk. For page phases, walk with the mirror
   sidebar expanded AND collapsed.
3. Targeted measurements via evaluate_script, per plan's
   verification law:
   - R1 five-edge measurement on every page phase (filter line
     inner row, heading block, grid container, load-more, banner)
     matching within 1px at both widths, both sidebar states.
   - R4: at 390 every popup modal panel measures full viewport
     height and width (within the safe-area inset).
   - R7: at 390 the sheet close control's bounding box intersects
     no option row's box.
   - R2: the hairline's bounding box matches the rendered image box
     within 1px on both axes, checked on a wide, a tall, and a
     square image.
   - R5: at 390 the viewer image box width is viewport width minus
     the 2x `--space-2` breathing room.
4. Console: zero NEW errors. Known pre-existing noise: one
   crestfall-seal.svg preload warning. Anything else new fails the
   phase.
5. ESLint on every touched file: zero NEW errors. Known
   pre-existing: three `react-hooks/static-components` errors in
   `StudioSidebar.view.jsx`; they stay, they do not count, do not
   fix them.
6. Zero em dashes in every touched file.
7. Production build is SKIPPED, deliberately. Flag "production
   build pending morning check" in the report. Anything unverified
   is reported as unverified, never as done.

## THE NINE PHASES

### Phase 1 (W1): frame mobile law, sheet header, R3 into law

Per plan sections 1.1 and 1.5. Edit `docs/FRONTEND-SOP.md` section
8: add the R3 mobile verification paragraph (plan 1.5 has the exact
text). Bump KitModalFrame to `"1.1.0"`: add the (for now empty
shell of the) `viewer` variant value to the contract and VM maps,
change variant modal's under-700px classes to the R4 full-screen
maximize (`items-stretch p-0` container; `h-[100dvh] max-h-[100dvh]
w-full rounded-none border-0 pb-[env(safe-area-inset-bottom)]`
panel; internal scroll unchanged; 700px and up untouched), and give
variant sheet the frame-owned close header row (full-width band,
`min-h-[calc(var(--control-md)+var(--space-3)*2)]`, close control
static inside it, `border-b border-[var(--line-whisper)]`). Fix
ModalShellView's hardcoded veil `p-4` only as far as plan 1.1
sanctions (padding moves into the frame's variant alignment
classes). Remove KitDropdown's sheet label-row clearance padding
(now dead). Update fixtures (viewer entry placeholder, sheet header
walk). Law edits: blueprint 2.5 wording, 2.16 entries (p) and (q),
product model 3.5 sentence, per plan 1.1. CSV: notes update on the
frame close-control row. VERIFY: at emulated 390 the asset detail
popup and the image overlay (still the old composition this phase)
measure full-screen; the dropdown filter and sort sheets show the
header band with zero close/option intersection; at 1440 everything
is pixel-unchanged. Commit, push.

### Phase 2 (W1): the image viewer rebuild (R2, R5)

Per plan section 1.2. Fill in the frame's `viewer` variant: sticky
nav veil treatment
(`bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]` plus
`backdrop-blur-[var(--blur-chrome)]`), NO panel chrome (no
background, border, shadow, radius, no light brown anywhere),
transparent full-viewport column, standard close control top right.
If the veil class cannot reach ModalShellView, add the additive
`veilClassName` passthrough and bump ModalShell's contract one
minor step; that is the only sanctioned fallback. Recompose
KitImageOverlay onto `variant="viewer"`: shrink-wrapped centered
column; image at natural aspect, hairline `1px solid
var(--gold-ornament)` `rounded-[var(--radius-md)]` snapped to the
image's own edges (never around empty space, no letterbox bed);
action shelf directly beneath at the image's width (same recipe as
today: `--surface-1` bed, `--line` border, `--radius-md`,
`p-[var(--space-3)]`, Love/Save/Share unchanged); desktop caps
`max-w-[min(88vw,76rem)]` `max-h-[78dvh]`; mobile per R5 the
maximum available space (full width minus 2x `--space-2`, full
remaining height); visible title line REMOVED, `title` prop becomes
the accessible name only; zoom/pan carried over unchanged (wheel,
double-click, pinch, drag, 4x ceiling, clamp, reset by unmount);
no-image fallback per plan 1.2. Contract stays `"1.0.0"`; rewrite
the README. Token-law amendment: `--blur-chrome` row in
docs/DESIGN-TOKENS.md per plan 1.2. Law edits: blueprint 2.16 (r),
2.14 supersession note. VERIFY per plan's R2/R5 measurements on
wide, tall, and square images, from the package preview plus a
Community card, a Vault card, and a Creators thumbnail; zoom in and
out, pan bounds, veil click, Escape, close control; 390 emulated
first, then 1440. Commit, push.

### Phase 3 (W1): the credits collapse (R1)

Per plan section 1.3. Build `KitCreditsModal` in the credits
package (shell `components/kit/KitCreditsModal.jsx`, view in
`components/kit/credits/`, contract note bumping KitCredits to
`"1.1.0"`, props credits/LinkComponent/onClose, frame variant modal
`max-w-xl`, back control plus gold Credits label, scrollable full
KitCreditsView list). Recompose the popup's credit rendering:
collapsed single-credit block (first credit only, "View all credits
(N)" quiet control when more than one, nothing when empty), opening
the credits modal stacked above the popup; suppress the popup
frame's Escape and backdrop dismissal while the stacked modal is
open, per plan 1.3, using only the frame's existing props; if that
proves impossible without a new prop, STOP and write it up. Popup
contract stays `"2.1.0"`. Fixtures: `adventure` popup fixture grows
to five credits; credits package gains `manyCredits` (eight).
Preview routes updated. Law edit: blueprint 2.16 (s). CSV: View all
credits control, credits modal back control, notes update. VERIFY:
collapsed row and count at both widths; modal opens stacked,
scrolls, handles are links; back returns to the popup beneath with
its scroll intact; Escape closes ONLY the credits modal first, a
second Escape closes the popup; at 390 both surfaces are
full-screen (R4). Commit, push.

### Phase 4 (W1): mobile banner proportions (R6)

Per plan section 1.4. KitPromoBanner `bottom` treatment: mobile
aspect `aspect-[1/1]` (desktop `min-[700px]:aspect-[35/12]`
untouched); CTA under 700px gains `px-[var(--space-4)]` and
`text-[length:var(--text-ui)]` via responsive utilities on the
banner's own button, height stays `--control-md` (touch floor law;
do not edit `.cf-btn` itself). `top` and `card` treatments
untouched. Contract stays `"1.1.0"`. Law edits: blueprint 2.3 note,
2.16 (t). VERIFY at emulated 390 on the package preview and all
three page mirrors: banner taller, more art visible, button
visually lighter but 44px tall; at 1440 pixel-identical to before
the phase. Commit, push.

### Phase 5 (W1): true-390 re-verification sweep

Per plan section 1.6. With phases 1 to 4 landed, walk the ENTIRE
Sprint A polish surface at emulated 390x844x2 mobile touch, then
1440: the three page mirrors (every fixture state, sidebar both
states) and the package previews for studio-page,
asset-detail-popup, image-overlay, credits, dropdown, promo-banner,
creator-card, studio-filter-bar, modal-frame. Read-only subagents
may fan out to render and report; every fix lands serially in this
session. Fix only what is presentation-only within existing
contracts; log everything else. Record every finding and its
disposition (fixed with commit, logged open, or none found) in the
report. This closes W1: commit, push. CLEAN STOP PERMITTED here.

### Phase 6 (W2): the Images page

Per plan section 2 (the absorbed Sprint B spec plus its inheritance
updates). Build `app/studio/v2/images/page.jsx` plus
`ImagesV2Mockup.jsx` and the `images-v2-page` mirror, composed in
KitStudioPageView: header (eyebrow "Create", title "Images"),
filter bar (Linked asset and Style multi-selects, sorts Newest/
Most hearted/Most saved, view toggle), eighteen fixture images,
badge-free image cards opening the NEW viewer, load more (PAGE_SIZE
12), empty and loading states, bottom banner selling the Vault (R6
proportions). Flip Images `isBuilt: true` in the sidebar preview
nav fixtures. CSV rows for every control, destination "Create >
Images". Parity echo in the report: all 70 rows (recount them:
`/studio/image-studio` and `/studio/my-creations/[id]/image-library`),
each Present / Deliberately excluded with ruling / Flagged;
composer rows land Flagged; note the Vault echo's borrow of the 22
rows. VERIFY per the standard walk plus the R1 measurement.
Commit, push. CLEAN STOP PERMITTED here.

### Phase 7 (W3): the Stories hub

Per plan section 3. Build `app/studio/v2/stories/page.jsx` plus
`StoriesV2Mockup.jsx` and the `stories-v2-page` mirror, composed in
KitStudioPageView: header (eyebrow "Play", title "Stories",
description via the prop), filter bar (Type, Status, Visibility,
Rating multi-selects, sorts Latest activity and Title A to Z, view
toggle), the Continue group leading (promo-banner `card` treatment
per plan 3.2, at most three plus a show-all control, excluded from
the shelf, filters skip it, search reaches it), the startable shelf
(section label per the section-label law, creation cards with
own-work visibility badges, popup with collapsed credits, load
more), bottom banner selling Adventures. Sixteen fixtures per plan
3.3. Flip Stories `isBuilt: true` in the preview nav fixtures. CSV
rows, destination "Play > Stories". Parity echo in the report per
plan 3.4: the `/studio/story-rooms` rows one by one, all
`/studio/story-rooms/[id]` rows Deliberately excluded citing the
chat-room sweep-scope ruling (blueprint 3.1 row 4), the
`/studio/games` rows Flagged as unassigned overlap; recount all
counts from the CSV at run time. VERIFY per the standard walk plus
R1 measurement; confirm the popup from a shelf card shows the
collapsed credits and maximizes at 390. Commit, push. CLEAN STOP
PERMITTED here.

### Phase 8 (W4): the Account draft

Per plan section 4. READ the live account page and its components
first (FIRST ACTIONS item 3 list); never edit them. Build
`app/studio/v2/account/page.jsx` plus `AccountV2Mockup.jsx` and the
`account-v2-page` mirror, fixture-driven, no fetches: header with
the description through the `description` prop (defect a fixed),
ONE five-tile stats section (defect b fixed: metrics once, no
zero-stat grid in Coins), every control on kit and `cf-*` recipes
with tokens only (defect c fixed: cf-field inputs and textareas
with counters, cf-btn everywhere, KitDropdown single-select for
content preference with the age-gate intercept, KitModalFrame for
the age gate, buy-coins notice, and default PC picker, kit search
recipe in the picker, styled Sign Out no-op). Sections and
fixtures per plan 4.3 (default, empty, longestContent). Settings
rows route to the LIVE `/studio/account/*` subpages. No sidebar
entry anywhere. CSV rows for every control the draft ships,
destination "Account (outside nine-page model, staging draft)".
Parity echo in the report per plan 4.4: every `/studio/account*`
CSV row (recount at run time) Present / Deliberately excluded /
Flagged; fixture no-ops are not Present; name any live control
missing from the CSV. VERIFY per the standard walk (no filter bar,
so the R1 measurement covers heading, content sections, and page
edges); walk all three modals at emulated 390 (full-screen per R4)
and 1440. Commit, push. CLEAN STOP PERMITTED here.

### Phase 9: handoff and report

Update `docs/HANDOFF-NEXT-CHAT.md` with this pass's state at the
top (per-phase echo, contract version table, open picks), zero em
dashes, committed and pushed as the final commit. Confirm
docs/SPRINT-B-PLAN.md and docs/SPRINT-B-SONNET-BRIEF.md still carry
their superseded headers (they were marked at the planning gate; do
not delete them). Then produce the REPORT below.

## REPORT (end of session)

Echo this brief's manifest part by part, each part marked DONE or
STOPPED, in the established HANDOFF-NEXT-CHAT.md style:

1. Per phase: DONE with commit hash(es), or STOPPED with exact
   state and next action.
2. The verification measurements as measured: R1 five-edge numbers
   per page, the R4 full-screen check, the R7 intersection check,
   the R2 hairline-to-image numbers on all three aspects, the R5
   mobile width number.
3. The phase 5 sweep: every finding and its disposition, or "none
   found".
4. The three parity echoes (Images 70 rows, Stories with its
   excluded and flagged sets, Account), each row accounted, counts
   recounted from the CSV at run time.
5. Every OPEN FOR BRIAN item: restate the plan's 21 plus anything
   new the run surfaced. Never resolve one.
6. Everything unverified, named as unverified: at minimum
   "production build pending morning check" and "rollup not
   regenerated, script not in repo".
7. Final `git status` output confirming a clean tree and the branch
   pushed.
