# Handoff to next chat

> **SUPERSEDED, 26 Aug 2026.** This stray root-of-docs handoff is
> overtaken by events. Current handoffs live in `docs/handoffs/`; the
> latest is `docs/handoffs/HANDOFF-NICK-2026-08-23.md`. Kept for
> history only.

## Sprint E build, R6 image creator panel (10 Aug 2026, unattended, engine Sonnet)

Ran `docs/SPRINT-E-SONNET-BRIEF.md` against `docs/SPRINT-E-PLAN.md`, all
five phases, in order. Branch `design/kit-polish-3`, tree clean and
matching the brief's premise at session start (verified against commit
`26ca6df`), tree clean and pushed at session end. Brian's dev server on
3001 was used throughout and never touched or restarted; this session
started no server of its own.

1. **DONE, Phase 1.** `KitImageCreatorPanel` package, contract 1.0.0.
   Mode toggle, the six live ingredient slots (Character, Player
   Character, Pose, Clothing Source, Location / Scene, Rendering
   Preset, fixed anatomy mirroring `imageStudioData.js` verbatim),
   inline custom-guidance editor, the single Options expander (five
   dropdowns plus negative prompt, collapsing the live composer's
   duplicate sliders-icon control), the generate block (live
   block-reason grammar), and the video mode block. Six required
   fixture states. Preview `/dev/ui-preview/kit-image-creator-panel`.
   A real defect was caught and fixed during 390 verification: the
   Required badge on the Character slot clipped outside its tile at
   390 (header row lacked `min-w-0`/`truncate`); fixed before commit.
   Commit `433894a`.
2. **DONE, Phase 2.** `KitIngredientPicker` (1.0.0) and
   `KitSaveIngredientPreset` (1.0.0), both on `KitModalFrame`
   variant="modal" (full-screen at 390 per R4). Picker: search
   (caller-filtered, matching the studio-filter-bar convention),
   ingredient card grid, Use Once and New Preset action cards,
   load-error state. Save preset: Preset Name, Description, Prompt /
   Guidance, Tags (no character caps in the live flow, so none
   invented), Save as preset and Use once, saving state disables
   close via `onClose={null}`. Previews
   `/dev/ui-preview/kit-ingredient-picker` and
   `/dev/ui-preview/kit-save-ingredient-preset`. Commit `f205c5e`.
3. **DONE, Phase 3.** Images page integration
   (`app/studio/v2/images/ImagesV2Mockup.jsx`). Desktop 1100px and
   up: sticky right rail (24rem, top offset composed entirely from
   existing tokens via calc: `--topbar-h` + `--control-filter` +
   `--space-3` x2 + `--space-4`, no new token minted), grid drops to
   three columns. Under 1100px: sticky bottom-right "Create image" CTA
   opening the panel as a full-screen modal at 390, centered 700 to
   1099. Full ingredient picker and save-preset flow wired end to
   end and verified live: activating a slot opens the picker,
   choosing an item or Use Once fills or customizes the slot,
   Character/Player Character mutual exclusion confirmed (choosing
   one clears the other), New Preset opens the save-preset modal
   stacked over the panel, Escape dismisses only the top layer.
   `docs/APP-FUNCTION-MAP.csv`: 26 new rows for the panel, picker, and
   save-preset controls on `/studio/v2/images` (destination Create >
   Images), plus the two image-studio slot-label rows corrected
   (Outfit to Clothing Source, Location to Location / Scene). CRLF and
   21-column shape preserved and validated with the csv module.
   `docs/BUILD-BLUEPRINT.md` 2.16 gains ruling (u); 3.1 row 5 notes the
   panel composition. A real defect was caught and fixed during 390
   verification: the panel renders simultaneously in the CSS-hidden
   desktop rail and the mobile modal, and its static field ids
   collided; `KitImageCreatorPanel` now derives a per-instance id
   prefix via `useId()` (internal only, contract unaffected). Commit
   `6cc4f95`.
4. **DONE, Phase 4.** Review-gate deferral 2.2 (N-2 follow-through):
   the five capped account fields (Username, Display Name, Tagline,
   Description, Announcement) now wire `aria-describedby` from the
   field to its counter. `aria-hidden` stays on the counter (removing
   it reintroduced the original N-2 name-pollution bug, caught during
   verification and reverted before commit): per the accname spec, a
   referenced `aria-hidden` element's text still reaches the
   description even though it is excluded from the accessible name.
   Verified with an accessibility-tree read: every capped field's name
   is the bare label, the cap rides as `description`. No other plan-2
   item's ruling had landed (checked `docs/SPRINT-E-PLAN.md`'s git
   history: one commit, no rulings since); 2.2 was the only item in
   scope, per the brief's own fallback. Commit `5d0d774`.
5. **DONE, Phase 5.** Dev server: none of this session's own to stop
   (Brian's 3001 was used throughout, untouched). Production build
   exit 0 at session end, dev server left running throughout (build
   and Brian's persistent dev server coexisted without conflict both
   at session start and session end). This section written and
   committed as the final commit of the session.

### Contract versions this pass

| Contract | From | To |
|---|---|---|
| KitImageCreatorPanel | none | 1.0.0 (new) |
| KitIngredientPicker | none | 1.0.0 (new) |
| KitSaveIngredientPreset | none | 1.0.0 (new) |
| KitStudioPage | 1.0.0 | 1.0.0 (unchanged; the rail composed inside the existing `children` slot, no new prop needed) |
| Everything else | current | same |

### A2 sticky inventory (Brian's ruling, before adding any sticky element)

Checked by reading every v2 page's shell composition
(`app/dev/ui-preview/*-v2-page/*PreviewClient.jsx`) and every shared
chrome piece for `sticky`/`fixed` classes, then confirmed live at
emulated 390 and 1440. Result, identical across all six v2 pages
(account, community, creators, images, stories, vault), before this
sprint: exactly two sticky elements, at every width. `StudioMobileNav`
(the bottom tab bar, `fixed bottom-0`) exists as its own package but no
v2 page mirror wires `mobileNavSlot`, so it is not present on any of
the six pages today; this is a standing gap, not something this sprint
introduced or fixed.

| Element | Before (all six pages) | After (Images only) |
|---|---|---|
| `StudioTopBar` | sticky `top-0`, z-40 | unchanged |
| `KitStudioFilterBar` | sticky `top-[var(--topbar-h)]`, z-10 | unchanged |
| Creator rail (1100px and up) | did not exist | sticky, new, third layer |
| Create CTA (under 1100px) | did not exist | fixed bottom-right, new, third layer |

Measured live (scrolled, not the natural unscrolled position, which
reads differently): `topbar` bottom at 69px exactly matches
`--topbar-h`; filter bar top sits at 69px (zero gap, zero overlap);
filter bar bottom at 131px; rail top at 147px (exactly
`--space-4` = 16px past the filter bar, zero overlap), held constant
through further scroll. The ceiling in view at once on Images is now
the top bar, the filter line, and the rail or the CTA: exactly three,
matching A2's stated ceiling. No fourth sticky layer exists on Images
today (the mobile nav gap above means the filter line never needed to
yield); if `StudioMobileNav` is wired into the Images mirror in a
future pass, the filter-line-yields rule in A2 becomes load-bearing
and must be re-applied then.

### R1 five-edge measurement, Images, with the rail present and absent

At 1440 (rail present, sidebar expanded and collapsed, both
identical): heading, filter line's content row, grid, and load-more
all share left edge 264px (expanded) / 60px (collapsed, sidebar
narrower); the bottom banner's right edge (1389px) matches the rail's
right edge (1389px) exactly, confirming the rail sits inside the
content width, not outside it. At 390 (rail absent, CTA only): heading
and grid share left edge 20px; rail confirmed `display: none`, CTA
confirmed visible and fully inside the 390x844 viewport (top 784,
bottom 828, both under the 844 floor).

### R4 full-screen checks, all three new modal surfaces, at 390

All three measured via `getBoundingClientRect()` against the true
emulated 390x844x2 viewport, mobile and touch enabled, never resize:

- Creator panel modal (mobile CTA path): panel measures exactly
  0,0 to 390,844 (full viewport). Generate button reachable via
  internal scroll, fully inside viewport bounds (top 686, bottom 730).
- Ingredient picker: full-screen at 390 (X close visible top-right,
  action cards reachable), centered at 1440 (max-w-5xl).
- Save-preset modal: full-screen at 390, "Use once" button reachable
  via internal scroll (top 776, bottom 820, inside the 844 floor);
  centered at 1440 (max-w-2xl).

### Parity echo, the 58 live image-creator units (R6 disposition)

Every unit lands in exactly one of: panel, ingredient picker, save
preset, library grid (Images page's existing grid already carries
this function), viewer reconciliation (OPEN item 28, not this
sprint's scope), viewer (already carried by `KitImageOverlay`), or
page head (already carried by the v2 page's own `StudioPageHeaderView`,
not part of the panel). Count: panel 18, ingredient picker 5, save
preset 4, library grid 14, viewer reconciliation 13, viewer already
carried 3, page head already carried 1. Total 58, all accounted.

### Open picks

The standing 21 from Sprint D plus 9 from Sprint E (`docs/SPRINT-E-PLAN.md`
OPEN FOR BRIAN 22 through 30), none resolved this pass. New this pass:
none. Item 26 (creator panel placement) was built per the plan's
RECOMMENDED default (sticky rail at 1100px and up, sticky CTA plus
modal below it) and is not re-decided by this build.

### Everything unverified

- Escape/backdrop layering when the ingredient picker or save-preset
  modal stacks over the FULL-SCREEN mobile creator modal (verified
  only the desktop-rail composition's stacking live; the mobile
  modal-over-modal stack was not separately driven through Escape at
  390 this pass).
- The A2 sticky inventory's "after" column for the other five v2 pages
  (community, creators, stories, vault, account): unchanged from
  "before" since this sprint touched only Images, but not re-rendered
  and re-measured this pass to confirm no regression; inventory above
  is derived from the shared-chrome analysis, not a fresh render of
  each of the five.
- Rollup not regenerated, script not in repo (standing).

Written 10 Aug 2026, at the end of the Sprint E build (engine Sonnet),
branch `design/kit-polish-3`. This section is the current state; the
sections below are prior history on the same branch.

## Review gate and Sprint E planning (10 Aug 2026 evening, engine Fable)

Ran the post-Sprint-D review gate against `docs/SPRINT-D-PLAN.md`
and the law documents, fixed Brian's evening rulings R1 through R5
and R7 directly, mapped the live image creator for R6, and wrote
the Sprint E pair. Branch `design/kit-polish-3`, tree clean and
pushed at session end. Dev server was run on port 3002 (own PID)
and stopped; Brian's 3001 was never touched.

1. **DONE, Phase 0.** Production build exit 0 (the morning check
   flagged by the Sprint D pass is closed). All six v2 routes
   compile.
2. **DONE, R1/R2/R3/R5 (viewer).** Commit `cb95535`. Shelf goes
   darker translucent (the canvas 88 percent chrome recipe, no new
   value); backdrop dismissal restored (the transparent viewer
   panel swallowed veil clicks; panel is now click-transparent with
   per-box pointer-events re-enable, fixed in the frame's viewer
   variant so every host inherits); wide/tall/square/tiny aspect
   fixtures added and the 1px tall-image clip fixed; the figure
   column shrink-wraps at every width so the shelf snaps to the
   image on mobile. All verified live at emulated 390 and 1440.
   The R2 "black gap" did not reproduce on committed code at any
   aspect; the fixtures now lock the behavior.
3. **DONE, R7 (heading law).** Commit `e5e3de5`. Premise finding:
   all six v2 pages already conform at both widths; the drift is on
   LIVE pages passing the description as text children of
   StudioPageHeader, which rendered beside the H1. Kit hardened
   (contract 1.1.0): text-only children render through the
   description branch, so the misuse can never produce the drift
   again; live pages snap to the law with no live-page edits.
4. **DONE, R4 (fixture interactivity) plus review-gate fixes.**
   Commit `9bc4d98`. New `app/studio/v2/FixtureActionNotice.jsx`
   (the honest non-persisting stub); Share, banner CTAs, Continue,
   popup Play and View catalogue, Creators View profile, Account
   Save profile and Sign Out all respond; Vault viewer Love and
   Creators viewer Love/Save toggle real state. A11y: aria-pressed
   on fixture toggles and PC picker cards; KitDropdown 1.1.0
   additive `ariaLabel` (account Content Preference announces its
   purpose); account counters aria-hidden. Also: viewer fixture
   rebuilt from its stale placeholder, stale phase-1 comments and
   READMEs corrected, credits preview gains the eight-row state,
   KitCreditsModal drops its stale 92dvh mobile cap.
5. **DONE, CSV and R6 mapping.** Commit `6f7b3e7`. Stories credits
   rows, image viewer rows, Stories popup rows added (audit finds
   D-4/D-5); every v2 "fixture no-op" row now describes the R4
   notice. R6 inventory: 58 live creator control units, 48 already
   in the ledger, 10 newly mapped and added flagged; analysis in
   `docs/APP-FUNCTION-INVENTORY.md`. CSV validated 956 rows x 21
   columns, CRLF preserved.
6. **DONE, Sprint E pair.** `docs/SPRINT-E-PLAN.md` (the R6
   creator panel spec in full: panel anatomy mirroring the live
   composer, picker and save-preset modals, desktop sticky rail
   plus mobile sticky CTA, the 58-unit disposition table, phases,
   OPEN FOR BRIAN items 22 through 30 new at this gate) and
   `docs/SPRINT-E-SONNET-BRIEF.md` (paste-ready, five phases,
   established shape).

Contract versions this pass: StudioPageHeader 1.0.0 to 1.1.0,
KitDropdown 1.0.0 to 1.1.0 (both additive). Everything else
unchanged.

Deferred to Sprint E rather than fixed: the viewer close control
overlapping tall images at 390 (needs a ruling, OPEN item 24),
account aria-describedby counter wiring, account form semantics,
the live play page `descriptions=` typo (live pages read-only,
OPEN item 30), the two CSV slot-label drifts (fix with the panel
build), and the Stories In-progress facet behavior (OPEN item 16).

OPEN FOR BRIAN: the standing 21 from Sprint D, none resolved, plus
nine new (22 through 30) in `docs/SPRINT-E-PLAN.md`, including the
creator-panel placement three-option gate (item 26, rail
recommended) and the R1 shelf value confirm-at-render (item 22).

Rollup not regenerated, script not in repo (standing). Render
evidence in `docs/review-artifacts/` (viewer at 1440 wide fixture,
viewer at 390 on the Images page).

Written 10 Aug 2026 evening, at the end of the review gate (engine
Fable), branch `design/kit-polish-3`. This section is the current
state; the sections below are prior history on the same branch.

## Sprint D pass (10 Aug 2026, unattended, engine Sonnet)

Ran `docs/SPRINT-D-SONNET-BRIEF.md` against `docs/SPRINT-D-PLAN.md`,
all nine phases, in order, per the brief's own stop rules. Branch
`design/kit-polish-3`, tree clean at session start (matched the
brief's premise, verified against commit `724853c`), tree clean and
pushed at session end. Full per-phase echo, R1/R4/R5/R7 measurements,
the phase 5 sweep record, all three parity echoes, and every OPEN FOR
BRIAN item are in the session's final chat report; commit hashes
below.

1. **DONE.** Phase 1 (W1): SOP section 8 R3 paragraph; KitModalFrame
   1.0.0 to 1.1.0 (R4 mobile full-screen maximize on variant modal,
   R7 structural close header row on variant sheet, empty-shell
   `viewer` variant added); ModalShell 1.0.0 to 1.1.0 (additive
   `veilClassName`, unused this phase); dropdown sheet clearance
   padding removed; BUILD-BLUEPRINT.md 2.5/2.16(p)(q), product model
   3.5 edits; CSV notes. Commit `11a25b8`.
2. **DONE.** Phase 2 (W1): the `viewer` variant filled in (R2/R5);
   KitImageOverlay recomposed onto it, contract stays 1.0.0; a real
   letterbox bug (the hairline stretching past the rendered image on
   mobile) was caught in emulated-390 verification and fixed before
   commit; `--blur-chrome` token-law amendment; BUILD-BLUEPRINT.md
   2.16(r), 2.14 supersession note. Commit `f7cb53c`.
3. **DONE.** Phase 3 (W1): R1 credits collapse; new `KitCreditsModal`
   package (KitCredits 1.0.0 to 1.1.0, additive); popup recomposed
   (contract stays 2.1.0); Escape-layering (credits modal first, then
   popup) verified; fixtures (adventure grows to five credits,
   `manyCredits` eight-row fixture); CSV rows; BUILD-BLUEPRINT.md
   2.16(s). Commit `837befe`.
4. **DONE.** Phase 4 (W1): R6 bottom promo banner mobile aspect (5/3
   to 1/1) and a lighter mobile CTA. Discovered mid-phase that `.cf-btn`
   is unlayered CSS while Tailwind's own utilities live in a
   lower-priority CSS cascade layer, so no combination of Tailwind
   utility classes can override it regardless of class order
   (confirmed empirically); worked around with a new sibling modifier
   class, `cf-btn--banner-cta-compact`, in `app/design-system.css`,
   not an edit to `.cf-btn` itself. BUILD-BLUEPRINT.md 2.3 note,
   2.16(t). Commit `3bf0aff`.
5. **DONE.** Phase 5 (W1 sweep, closes W1): true-390 re-verification
   sweep via two parallel read-only audit subagents (page mirrors;
   package previews) plus direct manual re-verification. Both audit
   agents independently found that this session's Chrome DevTools MCP
   `emulate` command's literal `390x844x2,mobile,touch` string clamps
   `window.innerWidth` (and `position:fixed` sizing) to roughly
   452px in this specific live-browser session, while
   `document.documentElement.clientWidth` and `visualViewport.width`
   correctly report 390; this is an environment artifact of this
   session, not a code defect (ordinary flow content and
   non-transformed `position:fixed` elements are bounded by the CSS
   viewport by specification). One real finding, fixed: the "View all
   credits (N)" control measured 113x20px with zero padding, under
   the 44px touch floor; given a `min-h-[var(--control-md)]` flex row.
   Two findings logged, not fixed (dev-only preview-page scaffolding,
   not the shipped components): a preview page's own long fixture-
   label text not wrapping at 390; a desktop-only stacking collision
   between a preview page's own status banner and its dropdown
   popover. Commit `03843ed`.
6. **DONE.** Phase 6 (W2): the Images page at `/studio/v2/images`,
   mirror, eighteen fixtures, sidebar preview flip, CSV, parity echo.
   Commit `ddc3027`.
7. **DONE.** Phase 7 (W3): the Stories hub at `/studio/v2/stories`,
   mirror, sixteen fixtures (Continue group plus startable shelf),
   sidebar preview flip, CSV, parity echo. Commit `0b6db0d`.
8. **DONE.** Phase 8 (W4): the Account draft at `/studio/v2/account`,
   amended by Brian's ratified A1 (Canon stat dropped from the
   account profile) and informed by the A2 witness search (found on
   the old crestfall-main repo's `UIUX` branch: `design-system/proof/
   account.html` and `creator-profile.html`, design intent only, no
   code imported). All three live-page defects fixed (title
   collision, stat duplication, raw controls). One real finding caught
   and fixed in verification: six of the draft's own form fields were
   missing `name`/`id` attributes. Mirror, CSV, parity echo. Commit
   `c046fe1`.
9. **DONE.** Phase 9 (this entry): handoff update, Sprint B
   supersession re-confirmed (`docs/SPRINT-B-PLAN.md` and
   `docs/SPRINT-B-SONNET-BRIEF.md` both still carry their superseded
   headers, untouched this pass), final report in the session's chat
   transcript.

Contract version table this pass: `KitModalFrame` `1.0.0` to `1.1.0`;
`ModalShell` (components/ui) `1.0.0` to `1.1.0`; `KitCredits` `1.0.0`
to `1.1.0`; `KitImageOverlay`, `KitAssetDetailPopup`, `KitPromoBanner`,
`KitDropdown` unchanged (presentation-only recompositions).

Production build was skipped throughout (dev server law); pending a
morning check. `docs/APP-FUNCTION-MAP.md` rollup was not regenerated
(script not in repo) for any phase's CSV edits.

Every OPEN FOR BRIAN item from `docs/SPRINT-D-PLAN.md` (the standing
ten from Sprint A, the eleven new at the 10 Aug modal-system gate)
still stands; none were resolved this pass. See the session's final
chat report for the full restated list plus anything new this run
surfaced (none beyond what the plan already named).

Written 10 Aug 2026, at the end of the Sprint D unattended pass
(engine Sonnet), branch `design/kit-polish-3`. This section is the
current state; the sections below it are prior history on the same
branch, kept for lineage.

## Sprint A polish pass (10 Aug 2026, overnight, unattended)

Ran `docs/SPRINT-A-POLISH-SONNET-BRIEF.md` against
`docs/SPRINT-A-POLISH-PLAN.md`, all seven phases, in order, per the
brief's own stop rules. Branch `design/kit-polish-3`, tree clean at
session start, matched the brief's premise. Full per-phase echo, R1
measurements, R8/R10/R11 records, and open items are in the session
report; commit hashes below.

1. **DONE.** `studio-page` kit package (R1/R2/R6), filter-bar padding
   mirror, three page migrations off `PAGE_COLUMN`, BUILD-BLUEPRINT
   2.16 law entries (l)(m)(n). Commit `07eb4fa`.
2. **DONE.** Asset detail popup recomposition, contract `2.0.0`
   (R3/R8/R9): carousel ported from the old preview modal, four-
   action footer, description clamp, stats-placement pick logged.
   Commit `5471deb`.
3. **DONE.** Image overlay hairline frame, action shelf, zoom/pan
   (R4), contract stays `1.0.0`. Commit `7ba5842`.
4. **DONE.** Creator card labels (R5), sidebar section-label scopes
   (R7, law entry (o)), Vault Remix filter (R10). Commit `44e8b84`.
5. **DONE.** `credits` kit package (R11), popup contract `2.1.0`,
   page fixture credits, CSV rows, parity-echo cross-check recorded.
   Commit `ae3da68`.
6. **DONE**, with one item logged as not applied. Image sizing hints
   and CreatorsV2Mockup re-render churn fix; the eager/fetchpriority
   above-fold sub-item was not applied (a genuine conflict between
   "kit package APIs untouched" and needing a new per-card position
   prop, logged rather than guessed past). Commit `88b3d87`.
7. This entry (handoff update, final report in the session's chat
   transcript).

Contract version table this pass: `KitStudioPage` none to `1.0.0`;
`KitAssetDetailPopup` `1.0.0` to `2.0.0` to `2.1.0`; `KitCredits` none
to `1.0.0`; `KitImageOverlay`, `KitCreatorCard`, `KitStudioFilterBar`,
`KitPromoBanner` unchanged.

Production build was skipped throughout (dev server law); pending a
morning check. `docs/APP-FUNCTION-MAP.md` rollup was not regenerated
(script not in repo) for any phase's CSV edits.

Written 10 Aug 2026, updated at the end of the Sprint A overnight
pass (unattended, engine Sonnet), branch `design/kit-polish-3`. This
section is the current state; the kit polish 3 sections below it are
prior history on the same branch, kept for lineage.

## Sprint A pass (10 Aug 2026, overnight, unattended)

Ran `docs/SPRINT-A-SONNET-BRIEF.md` against `docs/SPRINT-A-PLAN.md`,
all six phases, in order, per the brief's own stop rules. Repo state
verified at session start: branch `design/kit-polish-3`, tree clean,
matched the brief's premise. Report below echoes the brief's manifest
part by part, per its REPORT section.

### Per-phase echo

1. **DONE.** Modal frame kit package (`components/kit/modal-frame/`,
   `components/kit/KitModalFrame.jsx`), preview at
   `/dev/ui-preview/modal-frame`, all five fixtures. CSV row for the
   close control. Commit `6fbeaf0`.
2. **DONE.** Asset detail popup kit package
   (`components/kit/asset-detail-popup/`,
   `components/kit/KitAssetDetailPopup.jsx`), preview at
   `/dev/ui-preview/kit-asset-detail-popup`, all six fixtures.
   `CommunityV2Mockup.jsx` migrated off the `AssetDetailPlaceholder`
   stub onto the real popup, Save wired to the existing `savedIds`
   state. CSV rows for the popup's four controls. Commit `5ecf753`.
3. **DONE.** Image overlay converted onto the frame, contract
   `0.1.0-interim` to `1.0.0`. `CommunityV2Mockup.jsx` migrated off its
   `ModalShell` wrapper to direct `<KitImageOverlay />`. Preview route
   updated, one additive `noImage` fixture. Commit `5a521f5`.
4. **DONE.** Dropdown sheet unification: `KitDropdown`'s under-700px
   sheet now renders `KitModalFrame` `variant="sheet"` behind a
   presentation-only `matchMedia` flag; the popover is byte-for-byte
   unchanged. **A real bug was found and fixed during verification**:
   the dropdown's own outside-pointerdown dismissal listener was not
   scoped away from the phone chassis, so it misread every click
   inside the portaled sheet as an outside click and closed the sheet
   on the first multi-select toggle. Fixed by scoping that listener to
   the popover chassis only. Verified the full behavior list in plan
   section 5.1 at both widths. Commit `2d6ba30`.
5. **DONE.** `/studio/v2/creators`, fixture-driven, mirror at
   `/dev/ui-preview/creators-v2-page`. Thirteen fixture creators.
   Flipped to `isBuilt: true` in the sidebar preview nav. Parity echo
   below. Commit `180a404`.
6. **DONE.** `/studio/v2/vault`, fixture-driven, mirror at
   `/dev/ui-preview/vault-v2-page`. Eighteen fixture items, own-work
   badge suppression verified live under an active Visibility filter.
   Flipped to `isBuilt: true` in the sidebar preview nav. Parity echo
   below. Commit `0de291d`.

All six phases verified per the brief's VERIFY section at every
commit: 390x844x2 mobile touch first, then 1440, every fixture state,
zero new console errors (the one pre-existing `crestfall-seal.svg`
preload warning only), zero new ESLint errors (the three pre-existing
`react-hooks/static-components` errors in `StudioSidebar.view.jsx`
untouched, confirmed unchanged), zero em dashes on every touched file.

### Parity echo, Phase 5 (`/studio/v2/creators`)

Every `docs/APP-FUNCTION-MAP.csv` row for `/studio/profile`,
`/studio/profile/[username]`, and
`/studio/profile/[username]/connections` (26 rows). The new page is a
browse hub only; no profile-detail page is built this pass, so almost
everything below the hub level is Flagged, the honest pre-parity
reading.

- **Present (2):** the Follow / Following toggle, twice (once cited
  from the profile hero's engagement row, once from the connections
  list's per-connection row): `app/studio/v2/creators/CreatorsV2Mockup.jsx`,
  `KitCreatorCardView` `onFollow`, toggling local `followingIds`.
- **Flagged (24), no ruling exists either way, none resolved here:**
  `/studio/profile` Edit Soon (disabled stub); the six-tab bar
  (disabled stubs); the featured items grid; `/studio/profile/[username]`
  Back button; the profile hero (banner, avatar, bio, stat tiles);
  Followers count link; Following count link; Like creator button;
  Bookmark creator button; Donate button plus modal; the donation
  amount input, message textarea, and anonymous checkbox; the Share
  button; the Creations/Activity/Badges tab switch; the public
  creation card grid and its own like/bookmark buttons; the activity
  feed; the badges grid; the public-profile load-error banner; the
  connections page's Back to Profile link; its Followers/Following tab
  links; its connection card list; and its View Profile link (a
  fixture no-op is not Present, per the parity echo law).

### Parity echo, Phase 6 (`/studio/v2/vault`)

Every `docs/APP-FUNCTION-MAP.csv` row for `/studio/my-creations`,
`/studio/my-creations/[id]/edit`, and
`/studio/my-creations/[id]/preview`. **Correction to the plan's own
count, logged rather than silently reconciled:** those three named
routes sum to 90 rows, not the 112 the plan cites; the remaining 22
live under a fourth route in the same tree,
`/studio/my-creations/[id]/image-library` (the featured-image
picker inside editing), which the echo below includes so the total
matches 112.

**Hub, `/studio/my-creations` (15 rows), accounted one by one:**

- **Present (7):** Search your creations (search input); Status/type
  tabs (covered by the Type filter dropdown, presentation change only
  per contract law); Creation card grid; Like (heart icon); Bookmark
  icon; Card body / open preview (covered by Expand, opening
  `KitImageOverlay` or `KitAssetDetailPopup`); Load more.
- **Deliberately excluded (1):** Edit (pencil icon), citing
  CR-007/CR-008 (the standalone edit-tree hold) and the card law
  (`docs/BUILD-BLUEPRINT.md` 2.6: overlay actions are exactly three,
  like/save/expand, no fourth).
- **Flagged (7), no ruling exists either way:** Your Tags (tag filter
  pills, no facet built); Grid/Large mobile density toggle (the new
  view toggle switches grid vs. list at every width, not the same
  function as the old mobile-only column-density switch); Create New;
  the load-error banner (no real fetch exists to error); Set as
  default Player Character; Start chat; Generate image (none of these
  three have a ruled home on the card law's three-action overlay or on
  the asset detail popup's footer; whether they move somewhere or drop
  is undecided).

**Edit tree, preview tree, and image-library (97 rows total:
68 + 7 + 22), all Deliberately excluded**, citing the build-order
partial hold (`docs/BUILD-BLUEPRINT.md` 3.1 row 3: "the standalone
edit tree stays out of scope until CR-007/CR-008 is ruled") and
CR-007/CR-008 by name.

Total: 8 Present, 7 Flagged, 97 Deliberately excluded = 112.

### OPEN FOR BRIAN

The plan's original eight (`docs/SPRINT-A-PLAN.md`, OPEN FOR BRIAN
section), none resolved, all built at the documented default:

1. The lighter wash value for artwork under a tag bed (standing,
   carried from the batch-two sweep, unchanged this pass).
2. Asset detail primary-action copy: character and story both read
   "Play" tonight.
3. Love on the asset detail popup: shipped without one (2.15's footer
   names primary, Share, and Save only).
4. Image overlay on the frame's `--surface-4` panel instead of the
   interim scrim-black plate: built per law, confirm at render.
5. Creators grid columns (1/2/3): this plan's default, confirm at
   render.
6. Saved-from-others items in the Vault carry no visibility badge:
   confirm, or rule a "Saved" mark instead.
7. Fixture copy: every new page description and both new
   bottom-banner titles/CTAs (Creators, Vault) are drafted placeholder
   copy, yours to rewrite.
8. Vault list two-up at 1100px and up: applied per the
   permitted-where-whitespace-allows reading Community already ships,
   confirm at render.

New items this run surfaced, none resolved, none guessed past:

9. **Creators "Most hearted" sort has no matching stat.**
   `KitCreatorCard`'s contract carries `stats{followers, plays, works}`
   only, no hearts field. The sort orders by `works` as the closest
   proxy rather than inventing a hearts count. Either add a hearts
   stat to the creator-card contract, or rule the sort should read
   differently.
10. **Vault's "Grid/Large mobile density toggle" has no ruled successor.**
    The old page's mobile-only 2-col/1-col density switch and the new
    page's grid/list view toggle are different functions; the density
    behavior itself has no home on the new page. Confirm whether it is
    dropped or needs its own control.
11. **Three my-creations card actions (Set as default Player
    Character, Start chat, Generate image) have no ruled destination.**
    The card law caps overlay actions at three (like/save/expand) and
    the asset detail popup's footer has no fourth slot either. Whether
    these move into the popup, get a new home, or are dropped is
    undecided.

### Everything unverified, named as unverified

- **Production build pending morning check.** Skipped deliberately
  overnight per the brief; not run this session.
- **Rollup not regenerated, script not in repo.** Every CSV edit this
  pass (Phases 1, 2, 5, 6) logs this per plan section 0.3; no
  `scripts/` directory or `package.json` entry exists to regenerate
  `docs/APP-FUNCTION-MAP.md` from the CSV.
- The real (auth-gated) routes `/studio/v2/creators` and
  `/studio/v2/vault` were confirmed to compile (redirect to `/login`,
  same as `/studio/v2/community`) but were not walked signed-in, since
  no test account was available this session.
- The kit-creator-card package preview's own thumbnail context does
  not actually render `KitImageOverlay` (its `onThumbnailOpen` is a
  local no-op), so Phase 3's "creator thumbnail context" verification
  point was covered by the Community image card and the package
  preview instead; noted so this isn't mistaken for a skipped check.

### Assumptions made and logged, per the brief's own rule

- Creators sort "Most hearted" reads by `works` count (see OPEN FOR
  BRIAN item 9 above).
- The modal frame's `ariaLabel` prop is implemented as a
  visually-hidden `aria-labelledby` target rather than a raw
  `aria-label` attribute, since the composed `ModalShellView` (not
  touched by this package) accepts `ariaLabelledBy` only; the rendered
  accessible name is identical.
- CSV rows for new kit primitives with no live page host yet (the
  modal frame's close control, Phase 1) are logged against the kit
  package path itself rather than a page route, since every existing
  row in the ledger is scoped to a real page route and none of this
  sprint's primitives had one yet at the time they shipped.

### Final git status

Branch `design/kit-polish-3`, tree clean, six commits ahead of the
branch's state at session start, all pushed to `origin`:
`6fbeaf0`, `5ecf753`, `5a521f5`, `2d6ba30`, `180a404`, `0de291d`, plus
this handoff commit.

## State summary (kit polish 3, prior pass)

The kit rebuild (`docs/BUILD-BLUEPRINT.md` chapter 2) is the current
design system: full-bleed cards with a single ruled overlay-action
placement, one branded-dropdown filter line at a single unified
control height (`--control-filter`) that now docks flush beneath the
sticky top bar with search anchored left and every filter, sort, and
the view toggle grouped anchored right, a content rating system ruled
final at three fully live tiers, and card surfaces without art sitting
on the lighter
`--surface-2` elevated token against canvas. `/studio/v2/community`
is the only nine-page-architecture route built so far, fixture-driven
and pre-parity, mirrored auth-free at
`/dev/ui-preview/community-v2-page`, which now composes the real
`StudioShellView` with fixture sidebar props and a real `StudioTopBar`
(harness-only, no account/network calls) so the full sticky-stack,
full-bleed, and sidebar collapse/expand relationships can all be
verified without auth (it now also renders the preview-nav sidebar
fixture, Play/Create/Explore, specifically so the group-header law
below can be checked there). The flag-gated nine-destination sidebar
preview's group headers (Play, Create, Explore) follow the
section-label law: gold uppercase label, one short solid gold rule to
its right, vertically centered, no underline, taper, or icon. Every
modal surface in the kit closes on its close control, Escape, and a
backdrop click. The Community filter's remixable option reads "Remix"
everywhere, not "Remixable only".

## This pass (kit polish 3, 10 Aug 2026)

Full manifest, echoed DONE against the brief:

1. **DONE.** Branched `design/kit-polish-3` off `design/kit-polish-2`.
2. **DONE.** Overlay-action placement ruled final: `overlay-top`
   everywhere. The `scrim-row` variant, its fixture
   (`kitCreationCardScrimRowFixture`), and the `actionPlacement` prop
   are removed from `KitCreationCard` (contract v3.0.0 to v3.1.0);
   the side-by-side placement comparison in the package preview
   collapsed to one card. Ruling recorded in `docs/BUILD-BLUEPRINT.md`
   (2.6 and the 9 Aug rulings log), `docs/MOCKUP-DECISIONS.md`, and
   `docs/CRESTFALL-DESIGN-CONTEXT.md`.
3. **DONE.** Sticky stack fixed: the filter line was pinned at
   `top: 0`, the same offset as `StudioTopBar`'s own `sticky top-0`,
   so the two surfaces overlapped once both were pinned instead of
   stacking. A new token, `--topbar-h`
   (`calc(var(--control-md) + var(--space-3) * 2 + 1px)`, the top
   bar's own measured height), lets `KitStudioFilterBar` dock at
   `top: var(--topbar-h)` instead, closing the gap and clearing the
   overlap. Verified scrolling at 390 and 1440 in the auth-free
   mirror (which now renders `StudioTopBar` above the mockup for
   exactly this check): search stays anchored left, dropdowns/sort/
   view-toggle stay reachable on the right at the aligned control
   height, top bar always wins the stack.
4. **DONE.** Search field focus and clear control, ruled final. The
   kit polish 2 fix was incomplete: its `focus-visible:[box-shadow:
   none]` Tailwind utility on the raw `<input>` lost the cascade to
   the app-wide gold `:focus-visible` rule (both single-class
   specificity, and `design-system.css` imports after `tailwindcss`
   in `app/globals.css`, so the gold rule always won). Fixed with a
   dedicated `.kit-search-input:focus-visible` rule in
   `app/design-system.css` at higher specificity, order-independent.
   Deeper defect found and fixed the same pass: Chromium marks a text
   `<input>` `:focus-visible` on ANY focus, pointer or keyboard
   (verified live in Chrome DevTools), so the wrapper's
   `has-[:focus-visible]` border brightening was firing on mouse
   clicks too, not just keyboard, contradicting "pointer focus shows
   nothing." Replaced with explicit local state
   (`KitStudioFilterBar.view.jsx`'s `SearchField`): a `pointerdown` on
   the wrapper is recorded in a ref before the resulting focus event
   fires, so the handler can tell a pointer-caused focus from a
   keyboard-caused one and only light the `--line-strong` border for
   the latter. Verified both paths live: click leaves the wrapper at
   `border-[var(--line-whisper)]` (or the hover step), Tab leaves it
   at `border-[var(--line-strong)]`, gold never appears either way.
   Clear control: the native `type=search` cancel icon (browser
   blue/gray) is hidden
   (`.kit-search-input::-webkit-search-cancel-button` etc.) and
   replaced with a component-owned `X` icon in `--ink-faint`, the
   same token that colors the placeholder, shown only when the field
   has a value.
5. **DONE.** Loading and empty geometric marks (`icons-v7.svg#i-59`)
   scaled up on the existing spacing ladder: `var(--space-10)` (40px,
   +25% from the prior 32px) for the smaller marks (card no-image
   fallback in both layouts, the Community loading-grid tiles);
   `var(--space-14)` (56px, +40% from the prior 40px) for the larger
   marks (the Community empty state, the image-overlay fallback, the
   promo-banner no-image fallback). Both land inside the manifest's
   ruled 25 to 50 percent range; verified at 390 and 1440 that neither
   size dominates its card.
6. **DONE.** Banner art surveyed and replaced. Every draft asset (71
   files across `canon-character-images/` and
   `alpha-test-creator-images/`) was measured for orientation. Exactly
   one is a genuinely wide, single-subject composition: `Lilith.png`
   at 2560x1441 (1.78:1). The only other landscape file, `sassy.png`
   at 2352x1426, is an eight-panel reference sheet (a mood board with
   overlaid labels), not a scene, and does not compose at any crop, so
   it stays out. `Lilith.png` replaces the portrait-oriented `Serapha
   Veyloria.png` used through kit polish 2, in every `KitPromoBanner`
   fixture (top, card, both bottom sub-variants, the galaxy-top
   fixture) and the live Community bottom banner
   (`CommunityV2Mockup.jsx`). Its subject sits close enough to center
   (measured at roughly 35% down) that it survives every banner crop
   this pass uses, mobile 5/3 through desktop 35/12 and 20/9, without
   cutting into the face; `KitPromoBannerView`'s art now carries an
   explicit `object-[center_35%]` anchor recording that measurement
   rather than relying on a lucky center-crop. Only one asset is used
   across every banner instance because it is the only draft asset
   that qualifies; the team should supply proper wide-format banner
   art (distinct per journey) before this set needs to diversify
   further.
7. **DONE.** Verified in the auth-free mirror
   (`/dev/ui-preview/community-v2-page`, now StudioTopBar-fronted) and
   package previews (`kit-creation-card`, `kit-promo-banner`) at 390
   then 1440: sticky stack docks with no gap and no overlap while
   scrolling, search states (pointer, keyboard, populated, cleared)
   read correctly with no gold anywhere, marks read clearly at both
   sizes, banner art composes with the face in frame at every
   treatment and both widths, zero new console errors (one
   pre-existing, unrelated preload warning for
   `crestfall-seal.svg`), zero new ESLint errors on every touched
   file, `next build` exits 0, mobile comfortable throughout.
8. **DONE.** This handoff. Committed in logical chunks, pushed.

## Follow-up (same pass, same branch, 10 Aug 2026): filter line balance

Manifest, echoed DONE:

1. **DONE.** Stayed on `design/kit-polish-3`.
2. **DONE.** Filter line balance ruled: search anchors left; Type,
   Rating, Sort, and the view toggle group together anchored right
   via `ml-auto` on the whole right group, replacing the prior
   `flex-1` on both sides (which made them compete for space instead
   of leaving one flexible gap between two anchored ends). Inside the
   right group, `--space-2` holds the dropdown/sort cluster; `--space-
   4`, the standing control-group separator elsewhere in the system
   (sidebar dividers, grid gutters), opens a wider gap before the view
   toggle. Same law at every width; below 700px the group stays the
   existing horizontally scrolling control line, search keeps its own
   full-width row above it.
3. **DONE.** Verified in the auth-free mirror at 390 then 1440,
   scrolled and docked: balance reads correctly (measured live: 8px
   between dropdowns, roughly 16 to 21px before the toggle, search
   compact and left with the flexible gap in between), every control
   reachable (Rating dropdown opened and closed cleanly while docked),
   zero new console errors (the same pre-existing preload warning
   only), ESLint clean on the touched file.
4. **DONE.** Ruling recorded in `docs/BUILD-BLUEPRINT.md` section 2.1,
   this handoff updated, committed, pushed.

## Follow-up 2 (same pass, same branch, 10 Aug 2026): sidebar finish, control parity, sticky-bar width, modal dismissal

Manifest, echoed DONE:

1. **DONE.** Stayed on `design/kit-polish-3`.
2. **DONE.** Sidebar finish. The flag-gated preview nav's group
   headers (Play, Create, Explore, `StudioSidebar.view.jsx`'s
   `PreviewGroup`) each carry a short gold rule under the label, the
   same `--grad-rule` mark and `--space-8` width the page-head eyebrow
   rule already uses, turned to sit under the label instead of
   trailing beside it. The gap from the logo lockup to the first
   group opened one ladder step, `--space-6` to `--space-7` (24px to
   28px), so the header no longer crowds Play. **Corrected in
   Follow-up 3 below**: this treatment (rule under the label,
   gradient, ink-faint label color) was wrong against the actual
   section-label law; see Follow-up 3 item 2 for the ruled final
   version (gold label, solid rule beside it).
3. **DONE.** Control height parity. Search, the three dropdowns, and
   the grid/list toggle all already declared the same
   `--control-filter` height, but the toggle's OWN frame (border,
   radius, `--space-1` padding) sat on top of that, making the
   visible toggle 48px tall against 38px for everything else.
   `ViewModeToggleView` now puts the single source of truth for
   height on the frame itself (fixed, border-box, matching Search and
   KitDropdown's own `--control-filter`/coarse-pointer `--control-md`
   exactly); its buttons fill it (`h-full`, `aspect-square`) instead
   of each declaring their own size. Verified live: all five controls
   measure exactly 38px.
4. **DONE.** Sticky bar full width when collapsed. Two separate bugs
   combined: `CommunityV2Mockup`'s own wrapper stacked a second,
   mismatched padding layer on top of `StudioShell`'s section padding
   (the sticky bar's negative margin only ever cancelled one, fixed
   value), and the bar was nested inside a `max-w-[var(--container)]
   mx-auto` column, whose own centering margin cannot be cancelled by
   a fixed-token negative margin at all since its size depends on
   runtime viewport width. Fixed by moving page padding off the
   consuming page's outer wrapper onto each padded section
   individually, and moving the filter bar entirely outside every
   max-w wrapper so it only ever has to escape `StudioShell`'s own
   section padding, matched breakpoint for breakpoint (`sm`/`lg`,
   `StudioShell`'s own keywords). Verified live at 1440, sidebar
   expanded and collapsed, and at 390: the bar's left/right edges
   measure pixel-identical to `StudioTopBar`'s own edges in every
   case (previously off by up to 102px collapsed). The auth-free
   mirror (`CommunityV2PagePreviewClient.jsx`, new this pass) now
   composes the real `StudioShellView` with a togglable fixture
   sidebar specifically so this could be verified without auth.
5. **DONE.** Modal dismissal ruled and enforced. The unified modal
   frame's own law already specified backdrop click, Escape, and the
   close control (`docs/BUILD-BLUEPRINT.md` 2.5's anatomy line), and
   `ModalShell` already implements all three correctly. Two modal
   surfaces predating that frame did not use it: the Community
   mockup's asset detail placeholder and its image overlay wrapper,
   both hand-rolled scrim divs with no backdrop or Escape handling.
   Both now route through `ModalShell` instead of re-implementing the
   law locally. Verified live: a backdrop click closes each one, a
   click inside the panel does not, and Escape and the close control
   still work. Recorded as an enforcement note on 2.5 so future modal
   surfaces build on `ModalShell` (or the picker/sheet variants once
   they ship) rather than hand-rolling a backdrop again.
6. **DONE.** Verified in the auth-free mirror at 390 then 1440,
   sidebar expanded and collapsed, scrolled and docked: zero new
   console errors (the same pre-existing, unrelated preload warning
   only), ESLint clean on every touched file (the same 3 pre-existing
   `react-hooks/static-components` errors in `StudioSidebar.view.jsx`
   are untouched debt, confirmed unchanged by diffing against the
   pre-pass file), `next build` exits 0, mobile comfortable.
7. **DONE.** This handoff updated, committed in logical chunks,
   pushed.

## Follow-up 3 (same pass, same branch, 10 Aug 2026): section-label law correction, Remix rename

Manifest, echoed DONE:

1. **DONE.** Stayed on `design/kit-polish-3`.
2. **DONE.** Sidebar group headers now follow the section-label law
   exactly, correcting Follow-up 2 item 2: gold uppercase label
   (`--gold-ornament`, was `--ink-faint`), one short SOLID gold rule
   to its right (`bg-[var(--gold-ornament)]`, flat color, was
   `--grad-rule`, which fades to transparent and was wrong for this
   law), vertically centered on the label via the row's own flex
   centering (was stacked underneath). No underline, no gradient
   tapering to a point, no icon or mark of any kind. Applied to Play,
   Create, and Explore in the preview nav
   (`StudioSidebar.view.jsx`'s `PreviewGroup`).
3. **DONE.** The filter option label "Remixable only" reads "Remix"
   everywhere it renders: the live Community Type dropdown
   (`CommunityV2Mockup.jsx`), `KitStudioFilterBar.fixtures.js`'s
   default fixture, and `KitFilterChip.fixtures.js`'s two toggle
   fixtures (that package's own standalone Remixable chip is retired
   per its own comment, but its fixture copy still had the old
   label). No other copy referenced it.
4. **DONE.** Verified in the auth-free mirror at 390 then 1440,
   sidebar expanded and collapsed: each group header measured live
   confirms a flat `background-color` (no `background-image`/
   gradient) at `--gold-ornament` on both the label and the rule, the
   rule holds a fixed `--space-8` (32px) width regardless of label
   length, and the Type dropdown's last option reads "Remix" at both
   widths. Zero new console errors (the same pre-existing, unrelated
   preload warning only), ESLint clean on every touched file (the
   same 3 pre-existing `react-hooks/static-components` errors in
   `StudioSidebar.view.jsx`, unchanged).
5. **DONE.** This handoff updated, committed, pushed.

## Contract change this pass

`KitCreationCard.contract.js` moves v3.0.0 to v3.1.0: `actionPlacement`
is removed now that placement is ruled rather than a per-instance
choice. No live consumer existed beyond `CommunityV2Mockup` (which is
pre-parity, fixture-driven) and the package's own fixtures/preview,
all migrated in this same pass.

## New token this pass

`--topbar-h` (`app/theme.css`, documented in `docs/DESIGN-TOKENS.md`
sizing section): a derived layout constant, not a new primitive
value, for the sticky top bar's own rendered height. Legal use is the
`top` offset of a sticky surface docking directly beneath the top bar;
never an element's own height.

## Sprint map

**Kit revision / kit polish / kit polish 2 / kit polish 3 passes (9 to
10 Aug 2026):** the eleven `components/kit/` packages and their
governing rulings (card, filter line, tag economy, mobile, focus,
banner hierarchy, list density, ratings, selection-state, grid/list
toggle, remixable fold) are landed; see
`docs/CRESTFALL-DESIGN-CONTEXT.md` for the full list (not yet
regenerated to reflect this pass, next session's task if it drifts).

**Nine-page build order** (`docs/BUILD-BLUEPRINT.md` section 3.1),
Community built first because it builds the whole browse kit once,
Creators and Vault built this pass (Sprint A, see the section above):

1. Community, built, pre-parity (`/studio/v2/community`)
2. Creators, built, pre-parity (`/studio/v2/creators`), 2 of 26 parity
   rows Present, 24 Flagged for Brian (no profile-detail page exists)
3. Vault, built, pre-parity (`/studio/v2/vault`), 8 of 112 parity rows
   Present, 7 Flagged for Brian, 97 Deliberately excluded under the
   CR-007/CR-008 partial hold on the standalone edit tree
4. Stories, not started (no lock)
5. Images, not started (no lock)
6. Studio, not started (waits on Nick's CR-026 quick-create pass)
7. Adventures, not started (waits on Nick's CR-025 rename)
8. Home, not started (ruled composition exists, section 4.1)
9. Lore, not started (most net-new contract surface, needs Nick's
   CR-015 first)

## One open pick awaiting Brian

Lives in fixtures today for a rendered choice, never decided by an
agent: the lighter wash value for artwork under a tag bed, carried
from the batch-two sweep. The creation-card overlay-action placement
pick from prior handoffs is now ruled (see item 2 above); it is no
longer open.

## Open CRs for Nick

Full detail in `docs/CONTRACT-REQUESTS.md`. Unchanged this pass,
later-pass, non-blocking unless noted:

- **CR-027**, content rating labels are ruled final; the required
  audit (re-tag existing MATURE and EXPLICIT content against the new
  ladder before live, non-fixture data reaches users under these
  labels) is still open and is Nick's to run.
- **CR-024/CR-025**, Room Template to Story and Storyline to Adventure
  backend renames (display layer already reads the new names; CR-025
  blocks the Adventures page conversion until it lands).
- **CR-026**, Nick's review pass over the Character QUICK/ADVANCED
  field allocation before the Studio page builds.
- **CR-023**, Community vs Adventures structural model, feed/link
  data-model questions still open under an already-ruled copy split.
- **CR-013**, duplicate drawer nav tree retirement (`StudioMobileNav`
  and `StudioSidebar` still render separate copies; a one-element
  merge is agreed in shape, not landed).
- **CR-015**, lore pipeline confirmation, blocks the Lore page (last
  in the build order).
- Standing lower-priority queue: CR-001, CR-002, CR-003, CR-005,
  CR-009, CR-011, CR-012, CR-014, CR-016 through CR-022. None block
  current work; each is logged with its own verify-with-Nick note in
  `docs/CONTRACT-REQUESTS.md`.
- CR-007 and CR-008 (one edit surface or two; what the standalone
  editor exposes that the seven-stop creator does not) are Brian's,
  not Nick's, and remain open, folded into the Vault build-order item
  above.

## Opener line for the new chat

```
Continuing Crestfall-fe on design/kit-polish-3. Read docs/HANDOFF-NEXT-CHAT.md first (Sprint A section at the top is the current state: modal frame, asset detail popup, image overlay conversion, dropdown unification, Creators, and Vault all landed overnight). Eleven OPEN FOR BRIAN picks are waiting on render review, three of them new from this run. Production build is unverified, pending this morning's check. What's next?
```
