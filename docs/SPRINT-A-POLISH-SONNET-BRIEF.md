# SPRINT-A-POLISH-SONNET-BRIEF v1.0.0, written 10 Aug 2026, for one unattended overnight Sonnet session

Engine Sonnet, effort high, auto-accept. Execute all seven phases
below in order, unattended. This brief plus the repo is everything
you need; nothing lives in any prior chat.

## FIRST ACTIONS

1. Run `git status`. You must be on `design/kit-polish-3` with a
   clean tree. Never touch main. If the tree is dirty or the branch
   is wrong, STOP and write the handoff (see STOP RULES).
2. Read, in this order: `CLAUDE.md`, `docs/SPRINT-A-POLISH-PLAN.md`
   (the execution spec for every phase below; where this brief says
   "per plan section N" that section is authoritative detail),
   `docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md` sections 1, 2, 3,
   8, 13, 14, 17, `docs/BUILD-BLUEPRINT.md` sections 2.0, 2.3, 2.5,
   2.6, 2.15, 2.16, and `docs/HANDOFF-NEXT-CHAT.md` (Sprint A section
   at top).
3. Read before writing any code:
   `components/studio/studio-shell/StudioShell.view.jsx`,
   `components/kit/studio-filter-bar/KitStudioFilterBar.view.jsx`,
   `components/kit/asset-detail-popup/` (all files),
   `components/kit/image-overlay/` (all files),
   `components/kit/creator-card/KitCreatorCard.view.jsx`,
   `components/studio/studio-sidebar/StudioSidebar.view.jsx`,
   `app/studio/v2/community/CommunityV2Mockup.jsx`,
   `app/studio/v2/creators/CreatorsV2Mockup.jsx`,
   `app/studio/v2/vault/VaultV2Mockup.jsx`,
   `components/studio/creations/creation-preview-modal/CreationPreviewModal.view.jsx`
   and `useCreationPreviewModalViewModel.js` (the old-design carousel
   you are porting; READ ONLY, never edit),
   `components/studio/creations/creation-credits/` (the old-design
   credits panel; READ ONLY, never edit), and
   `lib/shared/creations/creationAttribution.js` (READ ONLY).

## RULES IN FORCE

- Tokens only. Every color, size, and typography value resolves
  through `var(--token)` per `docs/DESIGN-TOKENS.md` and the
  token-first directive (FRONTEND-SOP section 17). A value with no
  token is a missing token: stop that unit and report it, never
  invent a literal. This sprint mints NO new token; if you believe
  one is needed, that is a stop, not a mint.
- Card law: full-bleed art in BOTH grid and list layouts, overlay-top
  actions only, no bottom action bar anywhere.
- Filter line law: search, every filter, and sort share one sticky
  line of branded dropdowns; search anchors left, the control group
  anchors right; below 700px search takes its own full-width row and
  the control line scrolls horizontally.
- Content width law (R1, new this pass): one content width per page.
  Heading block, sticky filter line, card grid and list, load-more,
  and bottom promo banner share the same left and right edges, flush
  to the shell's section padding. No max-width cap, no second padding
  layer, no element in a narrower column than the filter line. Both
  layouts, every width.
- Banner law (R2): the bottom banner keeps its fixed per-treatment
  proportions and scales with the content width, never narrower or
  shorter than the content above it.
- Tag economy: a badge renders only when it informs; Canon is the
  only gold badge; visibility badges only in own-work contexts; never
  a badge restating an active filter selection.
- Selection states: gold mark plus light `--fill` wash, never bold
  borders or heavy outlines.
- Focus law: keyboard focus shows a subtle line only (border
  brightening); pointer interaction shows nothing.
- Corners, two tiers: LARGE (`--radius-lg`) for floating and
  full-content-width surfaces, STANDARD (`--radius-md`) for grid
  siblings and controls. PILL (`--radius-full`) for tags and icon
  buttons only; a text button is never a pill.
- Ratings are read from `lib/shared/presentation/terminology.js`
  (`CONTENT_RATING_TIERS`), never assumed, never taken from doc
  prose.
- Backend names unchanged. Display text only ever comes through the
  terminology module.
- Held pages are out of scope entirely: Adventures, Studio, Home,
  Lore. Do not touch them, their routes, or their components. The
  old-design components named in FIRST ACTIONS item 3 are read-only
  reference; never edit any file under
  `components/studio/creations/` or `lib/shared/creations/`.
- Subagents are read-only. Every edit happens serially in this main
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
  restart or kill it. If you must start one, use another port, track
  its PID, and kill only that PID when done.
- Contract law: presentation may change; what a component reports may
  not. The ONLY contract changes authorized in this brief are the
  ones the plan's section 9 table lists (KitStudioPage 1.0.0 new,
  KitAssetDetailPopup 1.0.0 to 2.0.0 then 2.1.0, KitCredits 1.0.0
  new). If any step appears to need any other contract, ViewModel,
  or data-flow change, STOP that phase and write it up; never decide
  it.
- No decision is made for Brian. Anything ambiguous beyond the plan's
  written defaults goes in the report under OPEN FOR BRIAN with the
  work stopped at that point, not guessed past. The one sanctioned
  render-time pick is the R8 stats placement (plan 2.5): render both
  readings, ship the cleaner one, LOG the pick and the reason.
- Definition of done per phase: `docs/APP-FUNCTION-MAP.csv` gains or
  updates a row for every control shipped, in the same commit. Do
  NOT hand-edit `docs/APP-FUNCTION-MAP.md`; log "rollup not
  regenerated, script not in repo" in the report.

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
server (see dev server law), on the auth-free mirror routes
(`/dev/ui-preview/community-v2-page`, `creators-v2-page`,
`vault-v2-page`, and the package previews):

1. Emulate viewport 390x844, deviceScaleFactor 2, mobile, touch,
   FIRST. Walk every fixture state and every new surface. No
   horizontal overflow, nothing clipped, everything reachable.
2. Then 1440 wide. Same walk. For page phases, walk with the mirror
   sidebar expanded AND collapsed.
3. R1 measurement (Phases 1 and 6, and any phase touching a page):
   via evaluate_script, read getBoundingClientRect left and right for
   the filter line's inner control row, the heading block, the card
   grid container, the load-more control, and the bottom banner.
   All five must match (within 1px) at 390 and at 1440, expanded and
   collapsed. Report the measured numbers.
4. R3 and R5: confirm the popup's four footer actions hold ONE row
   with no wrap or truncation at 390, and the creator card's Follow /
   Following / Profile labels hold one line at 390, 700 two-up, and
   1100 three-up.
5. Console: zero NEW errors. Known pre-existing noise: one
   crestfall-seal.svg preload warning. Anything else new fails the
   phase.
6. ESLint on every touched file: zero NEW errors. Known
   pre-existing: three `react-hooks/static-components` errors in
   `StudioSidebar.view.jsx`; they stay, they do not count, do not
   fix them.
7. Production build is SKIPPED, deliberately. Flag "production build
   pending morning check" in the report. Anything unverified is
   reported as unverified, never as done.

## THE SEVEN PHASES

### Phase 1: content width law (R1, R2, R6)

Per plan section 1. Build the `studio-page` kit package (full LOOM,
`KIT_STUDIO_PAGE_VIEW_CONTRACT_VERSION = "1.0.0"` line 1, slots
harnessSlot / headerSlot / filterBarSlot / bannerSlot / children,
zero horizontal classes, preview at
`app/dev/ui-preview/kit-studio-page/`, fixtures default / noBanner /
longestContent). Change KitStudioFilterBar's inner padding to mirror
StudioShell's section padding token for token and keyword for
keyword: `px-[var(--space-5)] sm:px-[var(--space-8)]
lg:px-[var(--space-10)]` (contract stays 1.0.0). Migrate
CommunityV2Mockup, CreatorsV2Mockup, and VaultV2Mockup off their
local PAGE_COLUMN onto KitStudioPageView; delete the constant; no
wiring changes. Confirm nothing constrains the banner (R2) and the
heading separator spans the content width (R6; StudioPageHeaderView
itself needs no restyle). Append law entries (l), (m), (n) to
docs/BUILD-BLUEPRINT.md 2.16 per plan 1.6. CSV: no new controls
expected; update notes columns where a row cites PAGE_COLUMN
geometry. VERIFY including the R1 edge measurement on all three
pages. Commit, push.

### Phase 2: asset detail popup recomposition (R3, R8, R9)

Per plan section 2. Contract to `"2.0.0"`: `media: {id, src}[]`
replaces `imageSrc`; add `isLiked`, `onLike`, `onViewCatalogue`;
primary label derivation becomes "Play" for all three kinds (R9).
Recompose the view: carousel frame at top (aspect 5/3, max 4 items
plus the synthetic catalogue slide, wrap-through arrows, N+1 dots,
active dot a gold lozenge, chrome per plan 2.4); title, subtitle, and
badges move into the body (badges on the canvas surface); the
catalogue slide renders the first media item under a flat
`--scrim-strong` veil with a centered `--surface-4` card, eyebrow
"Want to see more?", the one fixture line, and the "View catalogue"
primary CTA firing `onViewCatalogue`; empty media renders the
no-image fallback with NO carousel chrome and NO catalogue slide.
Description clamps at three lines with a See more / See less control
per plan 2.5 (render threshold 160 characters, no measurement
effects). Footer per plan 2.3: exactly four actions, Like / Save /
Share / Play, `grid grid-cols-4`, every action icon plus word,
whitespace-nowrap, one row at 390, Play primary, toggles on the
selection-state law. Stats placement: render BOTH plan-2.5 readings
against longestCopy, ship the cleaner, log the pick. Rewrite the
fixtures per plan 2.6 and migrate CommunityV2Mockup and
VaultV2Mockup per plan 2.7 (one-item media arrays, two multi-media
rows each, Like wired to likedIds). CSV rows: popup Like, carousel
previous/next, dot indicators, catalogue CTA, See more toggle.
VERIFY (package preview plus both page mirrors; walk every slide,
the wrap, the clamp, all four actions). Commit, push.

### Phase 3: image overlay treatment (R4)

Per plan section 3. Shell panelClassName becomes
`w-full max-w-[76rem]` (drop the 700px w-fit). View recomposes: one
figure block spanning the full inner width, thin gold hairline
(`1px solid var(--gold-ornament)`, `--radius-md`, overflow hidden)
around the image viewport (`object-contain`, `--canvas` bed,
max-h 65vh under 700px, 70vh above) AND the action shelf directly
beneath it inside the same frame: `bg-[var(--surface-1)]`,
`border-t border-[var(--line)]`, `p-[var(--space-3)]`, centered
Love / Save / Share actions unchanged in behavior. Title moves below
the figure in `--ink`. Zoom and pan per plan 3.2: pinch on touch,
drag-pan when zoomed, wheel plus double-click on fine pointers,
ceiling 4x, translate clamped, `touch-action: none` only while
zoomed, no product-state effects, reset by unmount. No-image
fallback keeps the shelf, zoom disabled. Contract stays `"1.0.0"`;
rewrite the README. Fixtures carry over unchanged. VERIFY on the
package preview and from a Community image card, a Vault image card,
and a Creators thumbnail: hairline, shelf, zoom in/out, pan bounds,
backdrop-drag does not false-close, Escape and close control still
work, at 390 then 1440. Commit, push.

### Phase 4: creator card, sidebar scopes, Remix audit (R5, R7, R10)

Per plan section 4. R5: creator card second action label becomes
"Profile"; both action labels gain whitespace-nowrap; contract stays
1.0.0. R7: in StudioSidebar.view.jsx PreviewGroup, delete the short
gold rule beside the label and add the full-width Legacy-recipe
divider (`border-t border-[var(--line-strong)]`) beneath the label
row, rendered collapsed and expanded; label treatment otherwise
unchanged; append law entry (o) to docs/BUILD-BLUEPRINT.md 2.16 per
plan 4.2 and update the StudioSidebar README; do not touch the three
known ESLint errors. R10: VaultV2Mockup TYPE_OPTIONS gains
`{value: "remix", label: "Remix"}`; add `isRemix: true` to two or
three fixture items (at least one saved-from-others story, one own
adventure); filter predicate treats remix as selecting isRemix
items; counts wire like the others; CSV notes updated. Record the
audit table (plan 4.3) in the report. VERIFY: labels one line per
VERIFY item 4; sidebar headers show divider-not-rule in the mirror
at both widths, collapsed and expanded; Vault Remix row filters
correctly and shows its count. Commit, push.

### Phase 5: attribution (R11)

Per plan section 5. Build the `credits` kit package (full LOOM,
`KIT_CREDITS_VIEW_CONTRACT_VERSION = "1.0.0"` line 1, item shape
`{id, kindLabel, creatorHandle, creatorHref, assetTitle}`,
LinkComponent injected by the shell, anatomy per plan 5.2 on
tokens: `--surface-1` bed, `--line` border, `--radius-md`, gold
"Credits" label with no mark, rows "{kindLabel} from {handle}",
empty renders null, preview at `app/dev/ui-preview/kit-credits/`,
six fixtures). Bump KitAssetDetailPopup to `"2.1.0"` with optional
`credits[]`, rendered between description/stats and the footer.
Give the Community and Vault story and adventure fixture rows
fixture credits (characters, narrator, location kinds, display-name
labels through the terminology module, hrefs to
`/studio/profile/[username]`). CSV: rows for the credits handle
links; log the plan-5.3 cross-check conclusion verbatim in the
report. VERIFY at 390 and 1440: credits render in the popup, handles
are links, empty credits render nothing. Commit, push.

### Phase 6: performance audit, /studio/v2/creators (no visual change)

Per plan section 6. On the auth-free mirror with a warmed dev
server: record a before trace (Chrome DevTools MCP performance
trace, 1440 then 390). Apply ONLY: image sizing hints on the raw img
elements (creator avatars, thumbnails, banner), lazy loading below
the fold, eager plus fetchpriority high on above-fold art, and
re-render churn fixes in CreatorsV2Mockup (memoize the mapped card
rows, stabilize callbacks) per plan 6.2; kit package APIs untouched.
Record an after trace. Screenshots before and after must be
pixel-identical at both widths; any visual difference reverts that
change. Separate and name dev-compile cost vs real cost in the
report with the numbers. Commit, push.

### Phase 7: handoff and report

Update `docs/HANDOFF-NEXT-CHAT.md` with this pass's state at the top
(per-phase echo, contract version table, open picks), zero em
dashes, committed and pushed as the final commit. Then produce the
REPORT below.

## REPORT (end of session)

Echo this brief's manifest part by part, each part marked DONE or
STOPPED, in the established HANDOFF-NEXT-CHAT.md style:

1. Per phase: DONE with commit hash(es), or STOPPED with exact state
   and next action.
2. The R1 edge measurements (the five numbers per page per width per
   sidebar state) as measured.
3. The R8 stats-placement pick and its reason. The R10 audit table.
   The R11 cross-check conclusion (plan 5.3).
4. Every OPEN FOR BRIAN item: restate the plan's ten plus anything
   new the run surfaced. Never resolve one.
5. Everything unverified, named as unverified: at minimum
   "production build pending morning check" and "rollup not
   regenerated, script not in repo".
6. Final `git status` output confirming a clean tree and the branch
   pushed.
