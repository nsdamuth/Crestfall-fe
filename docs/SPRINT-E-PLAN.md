# SPRINT-E-PLAN v1.0.0, written 10 Aug 2026, branch design/kit-polish-3, planning gate only

Execution spec for the Sprint E gate: the R6 image creator panel on
the Images page (planned this gate, built next sprint), plus the
review-gate deferrals and remaining polish. Written by the Fable
review gate of 10 Aug 2026 (evening) after: the Sprint D review gate
(all four workstreams judged against docs/SPRINT-D-PLAN.md and the
law documents), the R6 inventory pass over the live image creator,
and the direct fixes this session landed (R1, R2, R3, R4, R5, R7 of
the 10 Aug evening rulings; commit hashes in section 0.2). Repo
state verified this session: branch design/kit-polish-3, production
build exit 0, all fixes committed and pushed.

Brian's evening rulings R1 through R7 are RATIFIED, not open;
nothing in them is re-decided here. R1 through R5 and R7 were small
enough to fix directly and are DONE (section 0.2). R6 is planned
here in full and builds in Sprint E. Where this plan and a law
document disagree, the law document wins and the conflict is
escalated, never resolved locally.

## 0. Standing facts established at this gate

### 0.1 Phase 0, the build check

`next build` exit 0, run 10 Aug 2026 evening with the dev server
stopped, before any edit. All six v2 routes compile. The morning
check flagged in docs/HANDOFF-NEXT-CHAT.md is CLOSED.

### 0.2 The evening rulings, all fixed this session

- **R1 viewer shelf** DONE, commit `cb95535`. The action shelf bed
  moved from `--surface-1` to the sticky-chrome recipe's exact
  composition, `bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]`:
  darker, slightly translucent, reusing existing tokens and the
  already-sanctioned 88 percent mix. No new value minted.
- **R2 viewer centering** DONE, commit `cb95535`. Measured at both
  widths on wide (2560x1441), tall (400x1600), square (800x800), and
  tiny (120x90) sources: the hairline hugs the rendered image within
  its own 1px border at every aspect ratio. One real defect found
  and fixed: tall images clipped 1px top and bottom at 390 because
  the height cap ignored the hairline frame's own border. Fixture
  states for all four aspects now ship in the image-overlay package
  and its preview. Note honestly: the black gap itself did not
  reproduce on the committed code at any tested ratio; the likely
  witness was a pre-fix build (the Sprint D pass records catching a
  letterbox bug mid-phase-2). The aspect fixtures now lock the
  behavior so a regression is visible immediately.
- **R3 viewer dismissal** DONE, commit `cb95535`. Root cause: the
  viewer variant's transparent full-viewport panel swallowed every
  veil click, so ModalShell's target===currentTarget backdrop guard
  could never fire. Fixed in the frame's viewer variant
  (pointer-events-none panel; each interactive box re-enables its
  own pointer events), so every viewer host inherits. Verified
  live: backdrop click, close control, and Escape all dismiss; a
  click on the image does not.
- **R4 fixture interactivity** DONE, commit `9bc4d98`. New shared
  staging scaffolding `app/studio/v2/FixtureActionNotice.jsx`: a
  non-persisting honest notice every not-yet-wired control opens.
  Wired across all five v2 pages: Share on every viewer and popup,
  all five banner CTAs, Stories Continue cards and popup Play and
  View catalogue, Vault popup actions, Creators View profile,
  Account Save profile and Sign Out (both previously had no onClick
  at all). Vault viewer Love and Creators viewer Love/Save now
  toggle real local state. Like/save toggles render immediately
  everywhere (they already did on Images, Stories cards, Community).
- **R5 viewer mobile** DONE, commit `cb95535`. The figure column
  shrink-wraps at every width, so the shelf snaps to the image's own
  width on mobile too; image takes full width minus the 2x
  `--space-2` gutters (measured 372px at 390); verified via the R3
  emulate method. Floor: the shelf cannot go narrower than its three
  controls (about 228px), so images narrower than that center above
  a min-content shelf (OPEN FOR BRIAN item 23).
- **R7 heading standardization** DONE, commit `e5e3de5`, with a
  premise finding reported honestly: all six v2 pages, measured at
  390 and 1440, ALREADY conform to the heading law (eyebrow, title,
  description left aligned at the content edge, 1px full-width
  separator). The drift lives on the LIVE pages (account, games,
  my-creations, community and more), which pass the page description
  as bare text children of StudioPageHeader; the view rendered
  children BESIDE the H1. Fixed in the kit so it cannot recur:
  StudioPageHeaderView 1.0.0 to 1.1.0, text-only children now render
  through the description branch. The live pages' headings snap to
  the law by construction without editing any live page.
- **Review-gate fixes beyond the rulings**, commits `9bc4d98` and
  `6f7b3e7`: aria-pressed on every fixture-mode toggle group and the
  PC picker cards; KitDropdown 1.1.0 additive `ariaLabel` (the
  account's Content Preference dropdown now announces its purpose);
  account field counters aria-hidden (names no longer read
  "Username 10 / 30"); the modal-frame viewer fixture rebuilt from
  its stale "empty shell" placeholder; stale phase-1 comments and
  READMEs corrected; dropdown README's missing R7 note added; the
  eight-credit fixture added to the credits preview selector;
  KitCreditsModal's stale pre-R4 92dvh cap removed on mobile; CSV
  corrections per section 0.4.

### 0.3 The R6 inventory result (the mapping R6 ordered)

Every user-facing field and function of the live image creator
(`/studio/image-studio`, entry `ImageStudioWorkbench`) was
enumerated and mapped against docs/APP-FUNCTION-MAP.csv. Counted at
the CSV's own grouping granularity: **58 control units. 48 were
already in the inventory; 10 were missing and were added** in commit
`6f7b3e7`, each flagged "Newly mapped 10 Aug 2026 (R6 creator-panel
inventory pass)". Full analysis in docs/APP-FUNCTION-INVENTORY.md
(new section, same commit), including two label drifts noted and
left unchanged (the slot row says Outfit where the live label is
Clothing Source, and Location where the live label is
Location / Scene). The panel spec in section 1 accounts for every
unit, present or newly flagged.

### 0.4 CSV state

956 rows, 21 columns, validated. Added this gate: the Stories
credits rows (audit find D-4), the image viewer and Stories popup
control rows (D-5), and the 10 newly-mapped image-studio rows (R6).
Every v2 row that described a "fixture no-op" now describes the R4
fixture-action notice it opens. Rollup not regenerated, script not
in repo (standing).

### 0.5 Live creator data dependencies (for the eventual live wiring, not this sprint)

The live flow calls: POST/GET `/api/studio/image-generation/jobs`
(generate, history, pagination), GET
`/api/studio/image-generation/outputs/{id}` (pending resolution),
GET `/api/creations?type=` (ingredient options), POST
`/api/creations` (save custom preset; only POSE, OUTFIT, LOCATION,
IMAGE_PRESET are savable), `/api/media/reactions`, DELETE
`/api/media/images/[id]`, GET `/api/media/images/[id]/details`,
POST `/api/media/reports`. Generation costs 5 coins
(IMAGE_GENERATION_COIN_COST) and requires at least one renderable
source; character and player character are mutually exclusive.
Sprint E is fixture-only and calls none of these; the list is here
so the panel's shapes mirror reality.

## 1. W1: the image creator panel (R6, the build)

Intent, ratified: browsing images and opening the creator are both
effortless at any scroll depth, via a sticky create CTA; a side
panel treatment is acceptable if it is sticky and follows the
scroll. The panel carries the complete functionality of the existing
image creation flow, fixture-driven, honest about what is not yet
wired (HIDE/STUB law; the R4 fixture-action notice is the sanctioned
stub shape).

### 1.1 New package: components/kit/image-creator-panel/

Full LOOM shape: `KitImageCreatorPanel.view.jsx`,
`useKitImageCreatorPanelViewModel.js`,
`KitImageCreatorPanel.contract.js` (1.0.0, version on line 1),
`KitImageCreatorPanel.fixtures.js`, `README.md`, shell
`components/kit/KitImageCreatorPanel.jsx`, preview
`app/dev/ui-preview/kit-image-creator-panel/`. Tokens only; every
control on kit or `cf-*` recipes; no fetch anywhere.

Anatomy, top to bottom, mirroring the live composer's function at
the current design system's grammar:

1. **Mode row**: Image / Video segmented toggle (aria-pressed,
   selection-state law). Video mode swaps section 4 for the video
   options block.
2. **Ingredient slots**, the six live slots with the LIVE labels
   (Character, Player Character, Pose, Clothing Source,
   Location / Scene, Rendering Preset; the CSV's older Outfit and
   Location wording is the drift named in 0.3): each a
   `--surface-2` tile with label, current pick or empty state, and
   a clear control when filled. Tapping a slot opens the ingredient
   picker modal (1.2). Character and Player Character are mutually
   exclusive; picking one clears the other, matching the live rule.
   A slot in one-time custom mode renders the custom guidance
   editor inline: textarea, Back to presets, Save as preset
   (opens 1.3), Clear.
3. **Prompt block**: prompt textarea (cf-field), then the Options
   expander (one control, not two; the live page's duplicate
   sliders-icon-plus-row pair collapses to a single labeled
   expander, a presentation change the contract permits): Render
   Style, Camera / Framing, Wardrobe Theme, Aspect Ratio, Output
   Count as KitDropdown single-selects (each with `ariaLabel`, the
   1.1.0 prop), and the negative prompt textarea.
4. **Generate block**: coin balance line and per-generation cost
   from fixtures, the availability help line (the live
   block-reason grammar: no renderable source, insufficient coins),
   and the Generate control (cf-btn primary, full width). In
   fixture mode Generate opens the R4 fixture-action notice; the
   real job pipeline is live wiring at cutover (0.5). Disabled
   states render honestly from fixture state (insufficient-coins
   fixture, empty-slots fixture).
5. **Video mode block** (replaces 3 and 4 in Video mode): Duration,
   Video Aspect, Motion Style dropdowns, Video Direction textarea,
   and the live flow's honest "Generate video soon" disabled stub,
   carried as a stub.

Explicitly NOT in the panel, with dispositions against the 58-unit
inventory: the media history grid, its filter pills, selection
mode, bulk delete, and load more (units 41 through 54) are the
LIBRARY, whose function the Images page grid already carries or
will carry at live wiring; their rows stay accounted to the Images
page parity echo, not duplicated into the panel. The media lightbox
units (55 through 72: thumbnails, like, bookmark, share, download,
details, report, delete, variant, the soon stubs) map onto the R2
viewer at live wiring; the viewer today carries Love, Save, Share,
Close only, and the reconciliation of the remaining lightbox
actions is OPEN FOR BRIAN item 28, never invented into the viewer
unruled. Every one of the 58 units therefore lands in exactly one
of: panel (1 through 40), library grid (41 through 54), viewer
reconciliation (55 through 72), each stated in the parity echo.

### 1.2 The ingredient picker modal

`KitModalFrame` variant modal (full-screen at 390 per R4), search
input (kit-search-input recipe, client-side filter), fixture
ingredient card grid per slot type, Use Once card (enters custom
mode), New Preset card (opens 1.3 empty), close per frame law. Load
error state as a fixture.

### 1.3 The save preset modal

`KitModalFrame` variant modal: Preset Name (required), Description,
Prompt / Guidance, Tags (cf-field recipes, counters where the live
flow caps), Save as preset and Use once actions, close disabled
while a fixture "saving" state runs. Saving in fixture mode opens
the R4 notice (persistence is live wiring; only POSE, OUTFIT,
LOCATION, IMAGE_PRESET are savable live, mirrored in fixtures).

### 1.4 Images page integration

- **Desktop, 1100px and up**: the panel renders as a sticky right
  rail beside the library grid, inside the page column: sticky at
  `top` calc of `--topbar-h` plus the filter line height plus one
  `--space-4`, own `overflow-y-auto` within the viewport remainder,
  width `24rem` (a default, OPEN FOR BRIAN item 26), the grid
  taking the remaining width (grid columns drop one step while the
  rail is present). The rail follows the scroll by construction;
  browsing and creating are both reachable at any depth.
- **Under 1100px (including 390)**: no rail. A sticky create CTA
  (cf-btn primary, "Create image" fixture copy) docks bottom-right
  above the mobile nav (`--space-4` inset, z above content, safe
  area respected), visible at every scroll depth, opening the panel
  as a KitModalFrame modal (full-screen at 390 per R4, centered at
  700 to 1099).
- The filter line, heading, load-more, and banner keep the R1
  five-edge law; the rail sits inside the content width, not
  outside it. If the five-edge measurement and the rail prove
  incompatible at 1100 to 1279 widths, the rail min-width gives way
  first (drop to the CTA treatment up to 1280); record the
  breakpoint chosen.
- Fixture states: default, empty slots, insufficient coins, custom
  ingredient open, video mode, longest content; the page's own
  Default, Empty, Loading modes compose with the panel present.
- CSV: a row per panel control on `/studio/v2/images`, destination
  "Create > Images", in the same commit as the build. Parity echo
  per 1.1's disposition table: all 58 live units accounted panel /
  library / viewer-reconciliation, plus the 10 newly-mapped rows
  echoed.

### 1.5 Law edits (same commit as the panel lands)

- docs/BUILD-BLUEPRINT.md 2.16 gains **(u) Creator panel law (R6)**:
  the Images page carries its creator as a sticky surface; browsing
  and creating are both effortless at any scroll depth; the panel
  carries the complete function of the live composer; generation
  and persistence stay honest stubs until live wiring.
- docs/BUILD-BLUEPRINT.md 3.1 row 5 note: Images gains the creator
  panel at this sprint; the library-plus-creator composition is the
  page's ruled layout.

### 1.6 Contract authorization table for Sprint E

| Contract | From | To | Why |
|---|---|---|---|
| KitImageCreatorPanel | none | 1.0.0 | new package |
| KitStudioPage | 1.0.0 | 1.1.0 ONLY IF a rail slot needs a new prop; try composition inside `children` first; STOP if unsure |
| everything else | current | same | consumed, not changed |

Any other contract, ViewModel, or data-flow change: STOP and write
up, never decide.

## 2. W2: review-gate deferrals (small fixes queued, not started)

1. **Viewer close control over tall images at 390** (audit N-5):
   the absolutely positioned X can sit on the artwork's top right
   with no scrim behind it. Needs a ruled treatment (offset beside
   the image, or a quiet bed behind the X). One-file fix once
   ruled; OPEN FOR BRIAN item 24.
2. **Account counters, proper wiring** (N-2 follow-through): the
   counters are aria-hidden now; the richer fix is aria-describedby
   from each field to its counter so assistive tech still gets the
   cap. Small, mechanical, no ruling needed.
3. **Account draft form semantics** (N-3): fields and Save sit in
   sections with no form element or submit path. Fine for a
   fixture draft; wrap in a form with onSubmit at live wiring.
4. **Live /studio/play page passes `descriptions=`** (typo, prop is
   ignored, its description never renders). One-word live-page fix;
   live pages are read-only under the strangler, so it waits for
   authorization; OPEN FOR BRIAN item 30.
5. **CSV slot-label drifts** (0.3): update the two image-studio
   rows to the live labels, or leave until the panel builds; the
   panel build commit is the natural moment.
6. **Stories "In progress" status facet** yields an empty shelf by
   construction (Continue items are excluded from the shelf pool).
   Standing OPEN item 16's adjunct; one ruling collapses it.
7. **Live-page StudioPageHeader call sites** still pass text
   children (now rendered correctly by the kit); migrating them to
   the `description` prop is optional mechanical cleanup, zero
   visual change after the R7 hardening.

## 3. Phase order for the Sprint E build

| Phase | Delivers | Depends on |
|---|---|---|
| 1 | KitImageCreatorPanel package: view, VM, contract 1.0.0, fixtures, README, preview route; panel anatomy 1.1 items 1 to 5 | nothing |
| 2 | Ingredient picker and save-preset modals (1.2, 1.3), wired from the panel; fixtures for both | 1 |
| 3 | Images page integration (1.4): desktop rail, mobile sticky CTA plus modal, CSV rows, parity echo, law edits (1.5) | 1, 2 |
| 4 | Review-gate deferrals that need no ruling (2.2, 2.5; plus 2.1 and others IF their rulings have landed) | nothing |
| 5 | Verification sweep (R3 emulate method, every fixture state, both widths, both sidebar states), handoff update, final report | 1 to 4 |

One phase, one or more logical commits, committed and pushed at
phase end. Every phase re-runs the SOP section 3 checklist for the
packages it touched. Production build at session start and end
(dev server law observed).

## 4. Fixture states required, complete list

- image-creator-panel: default, emptySlots, insufficientCoins,
  customIngredient, videoMode, longestContent.
- ingredient picker: per-slot default, empty results, load error.
- save preset: default, saving, longest content.
- Images page: existing eighteen images and three modes, now
  composed with the panel present (desktop) and the CTA (mobile).

## OPEN FOR BRIAN

Items 1 through 21 are the standing Sprint D set
(docs/SPRINT-D-PLAN.md OPEN FOR BRIAN), all still open, none
resolved this gate. New at this gate:

22. **R1 shelf recipe value** (built this session): the shelf bed
    is the canvas 88 percent mix, the exact sticky-chrome recipe.
    Confirm at render. Alternatives if too dark: the same mix on
    `--surface-1`, or opaque `--surface-1` with lowered opacity.
23. **Viewer shelf minimum width**: for images narrower than about
    228px (the three controls at touch size), the shelf keeps its
    min-content width and the image centers above it. Confirm, or
    rule a different tiny-image treatment.
24. **Viewer close control over tall mobile images** (2.1): rule
    the treatment; nothing built yet.
25. **All fixture-notice copy** (the R4 stubs: share, banner CTAs,
    continue, play, save profile, sign out) is placeholder, yours
    to rewrite; one file per page plus the shared component.
26. **Creator panel placement** (1.4), three options:
    (a) RECOMMENDED, built as the plan default: sticky right rail
    at 1100px and up, sticky create CTA opening a full-screen
    modal below 1100. Why: both ratified intents (sticky CTA, side
    panel that follows the scroll) land in their natural widths;
    the library stays browsable beside the creator on desktop.
    Cost: the grid drops one column at desktop; one breakpoint of
    layout work.
    (b) NOT recommended: create CTA plus modal at every width, no
    rail. Why not: on wide screens the modal hides the library
    while composing, losing the browse-and-create-together intent.
    Cost saved: no rail layout work.
    (c) NOT recommended: left rail (creator before library). Why
    not: the journey reads library first; the creator is the
    page's second verb, and a left rail pushes the grid off its
    left content edge, fighting the R1 five-edge law.
    Cost: same as (a) plus edge-law rework.
27. **Generate in fixture mode** (1.1 item 4): built default is the
    R4 fixture-action notice. Alternative: a fake pending card in
    the grid is NOT offered; it would fake application state
    (SOP section 2).
28. **Viewer vs media lightbox reconciliation** (1.1): the live
    lightbox carries download, details, report, delete, generate
    variant, and three soon stubs the R2 viewer does not. Rule
    which of these join the viewer at Images-page live wiring, or
    stay lightbox-only until its own conversion.
29. **Live-page header call-site cleanup** (2.7): optional, zero
    visual change; authorize or drop.
30. **/studio/play `descriptions=` typo** (2.4): authorize the
    one-word live-page fix or hold it for the page's own
    conversion.

## Verification law for this sprint

Per FRONTEND-SOP section 8 including the R3 mobile method: emulate
390x844, deviceScaleFactor 2, mobile true, touch enabled, FIRST,
then 1440; the resize command is banned for mobile checks. Every
fixture state, on the auth-free mirrors and package previews; page
phases walk the mirror sidebar expanded AND collapsed. R1 five-edge
measurement within 1px on the Images page in both rail and CTA
treatments. R4: every modal surface (panel modal, picker, save
preset) measures full viewport at 390. Sticky checks: the rail
tracks scroll with no gap or overlap against the filter line; the
CTA stays visible at every scroll depth at 390. Zero NEW console
errors (crestfall-seal.svg preload warning is known), zero NEW
ESLint errors (the three StudioSidebar.view.jsx
react-hooks/static-components errors are known standing debt), zero
em dashes in any touched file. Production build exit 0 at session
start and end (dev server stopped first per the dev server law).
Anything unverified is reported as unverified, never as done.
