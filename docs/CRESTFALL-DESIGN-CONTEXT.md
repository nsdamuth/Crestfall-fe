# Crestfall design context

Regenerated 11 Aug 2026 (branch `design/h-docs-close`, cut from
`origin/design/sprint-h-final` at c2c6d1d). Supersedes the 10 Aug 2026
Sprint F version. Not law itself; CLAUDE.md names the four law
documents (`docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md`,
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`, the active sprint plan). This
file orients a new session fast; when it and a law document disagree,
the law document wins and this file is stale and should be
regenerated.

## What Crestfall is

Crestfall is a storytelling and character-creation platform by
Anthology Interactive. This repository, Crestfall-fe, is its front
end, independent from the Crestfall services API and from the
original Crestfall FE. Ports: this repo 3001, services-api 4000,
original Crestfall FE 3000.

## The product model

Canonical product truth lives in `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`,
reissued 9 Aug 2026, which supersedes the earlier
`docs/CRESTFALL-PRODUCT-MODEL.md` for page architecture. Three
sections, nine pages, one global navigation, sidebar in journey
order:

- **Play:** Home, Stories, Adventures
- **Create:** Studio, Images, Vault
- **Explore:** Community, Creators, Lore

The journey loop: Home to Stories to Adventures to Studio to Images
to Vault to Community to Creators to Lore, back to Home; every page's
bottom promo banner sells the next stop and its CTA routes there.

**All nine pages are now built** on this branch, at their
`/studio/v2/<page>` staging addresses, plus two supporting surfaces
the ruled model always implied but that shipped only this pass: the
Creators profile-detail page and its connections sub-page, and the
advanced editor (the CR-007/CR-008 destination). See "Where the build
stands" below for the full inventory.

## The cutover sequence, standing process, RULED 10 Aug 2026

Unchanged by this pass. This sequence supersedes the per-page cutover
previously described in the migration strategy
(`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 6 and
`docs/BUILD-BLUEPRINT.md` section 3.3 both carry the dated
amendment). The order:

1. All nine new pages build and stay at `/studio/v2/<page>`.
2. Old pages and old addresses are untouched until the new set covers
   100 percent of live features, measured against
   `docs/APP-FUNCTION-MAP.csv`. The per-page parity echo
   (`docs/BUILD-BLUEPRINT.md` section 3.4) is the instrument for that
   measure.
3. Nick reviews and signs off on the completed front end.
4. Nick freezes new code; his outstanding work merges in.
5. The full site stages; final tests run.
6. The new site goes live, fully Loom compatible, so backend and
   frontend proceed independently from there.

No page cuts over individually ahead of this sequence. No new page
enters the live sidebar before the go-live step; the preview-flag
navigation (below) remains the only pre-cutover navigation surface.
Old page code is deleted only in the single full-inventory sweep
after go-live, unchanged from route law 3.3(d).

**The `/studio` address question is an open CUTOVER question, not a
build blocker.** A 9 Aug ruling (`docs/BUILD-BLUEPRINT.md` section
3.1, row 8) makes `/studio` become Play > Home, while Studio is also
one of the nine pages in its own right (Create > Studio). Because
every page builds and stays at `/studio/v2/<page>` until the single
go-live, this collision blocks nothing today. It is to be ruled during
the cutover sequence (when final addresses are assigned at step 6),
not now. Do not interpret or guess past it.

## Rulings from the 11 Aug 2026 session

All ruled by Brian, all already implemented in code on this branch
before this document was regenerated.

- **Card law amendment, closed.** The creation card's third overlay
  icon (previously a fixed Expand) is now contextual: Play ("Start
  Chat") on Story and Adventure cards, Generate on Image cards where a
  real destination exists, Expand as the universal fallback. Like and
  Save unchanged; artwork tap still opens the card. Creation-card
  contract 3.2.0. Full record: `docs/BUILD-BLUEPRINT.md` 2.16(v).
- **Five-bucket type filter, closed (CR-038).** Community and Vault
  share one presentation-layer type grouping: Characters, Worlds,
  Looks, Stories, Adventures, replacing the earlier four-kind-plus-
  Remix set on both pages. Full record: `docs/BUILD-BLUEPRINT.md`
  2.16(y).
- **Adventure display naming, extended platform-wide.** The
  terminology-module display mapping (STORYLINE reads "Adventure")
  now covers the shared builder components too, not only the browse
  page. Backend naming is unaffected; CR-025/CR-039 remain the later,
  non-blocking backend rename pass.
- **Item 36 / CR-028 CLOSED.** The mute control on the Creators
  profile-detail page's engagement row, exact label "Mute content"
  ("Muted" when active). Was the last open item in the rail rulings
  section below; now closed since the profile-detail page it was
  waiting on is built.
- **Editor back control, closed.** The editor's back control returns
  to the page it was opened from, falling back to Vault when no origin
  is known; label is exactly "Back" (rendered "← Back"), never "Back
  to X", a presentation change from the legacy "← My Creations" link
  under the same underlying function. Editor contract 1.2.0.
- **Home cold-start banner, closed.** Eden confrontation art, galaxy
  layer on, headline "Start something worth finishing.", primary CTA
  "Browse stories", ghost CTA "See what others made". Home contract
  2.2.0. The promo-banner package gains an optional quiet secondary
  CTA beside its one primary, `cf-btn--secondary`, contract 1.2.0;
  Home's filled/continue state uses it too ("Continue" primary,
  "Explore recent stories" ghost). Full record:
  `docs/BUILD-BLUEPRINT.md` 2.16(w).
- **Stories: hero continue banner RETIRED, closed.** Compact continue
  rows only (capped three, "Show all in progress (N)" reveals the
  rest), superseding the same-day banner-plus-rows treatment. Home is
  the only page in the nine-page set that carries a continue banner.
  Full record: `docs/BUILD-BLUEPRINT.md` 2.16(x),
  `components/kit/promo-banner/README.md`.
- **Sidebar v2 preview routes all nine pages, closed.** Every
  destination in the preview nav's Play/Create/Explore groups now
  routes to a live `/studio/v2/<page>`; none renders the quiet "Soon"
  state anymore. See "Sidebar v2 preview flag" below.
- **`docs/APP-FUNCTION-MAP.md` rollup deleted.** No generator script
  for it exists anywhere in the repo (confirmed by search); the CSV
  (`docs/APP-FUNCTION-MAP.csv`) is the sole live map going forward.
- **CR-007/CR-008 hold RESOLVED.** Settled via
  `docs/VAULT-EDIT-TREE-CLASSIFICATION.md`: 97 rows classified 72
  COVERED, 15 GAP (all built this pass), 9 DEFERRED, 1 RETIRED. The
  edit tree, most of the preview tree, and the image-library are now
  reachable from Vault via the new `/studio/v2/editor/[id]` route and
  its `/studio/v2/editor/[id]/image-library` child. The 9 DEFERRED rows
  sit under the separate, standing OPEN item 28 (viewer
  reconciliation); the 1 RETIRED row is superseded by the tab-based
  navigation model.

Also shipped this session, each covered by its own contract: the
Creators profile-detail page (`/studio/v2/creators/[handle]`, contract
1.2.0), the Creators connections page
(`/studio/v2/creators/[handle]/connections`, contract 1.0.0), and the
editor's image-library page (`/studio/v2/editor/[id]/image-library`,
contract 1.0.0).

## Rulings from the 10 Aug 2026 strategy chat

- **Home page, ruled.** A guidepost that routes, not a dashboard and
  not an editorial front page. Order, top to bottom: medium top
  banner using the promo-banner top treatment with the galaxy layer
  on; a Continue strip that renders nothing when nothing is in
  progress; a block of eight destination tiles covering every other
  section; four curated rails (top rated, recently added, from the
  community, creators to follow); medium bottom banner routing to
  Stories. "View all" sits at each rail's head beside the label, not
  at the far end of the scroll. One sort control, on the top rail
  only. Home consumes KitRail four times.
- **Rails, ruled and now BUILT.** The horizontally scrolling rail is
  the `rail` kit package (KitRail, contract 1.0.0), shipped in Sprint
  F. It holds existing cards; no card-level work was needed. Its full
  law is `docs/BUILD-BLUEPRINT.md` section 2.18.
- **Lore, ruled.** Ships as an index page on the same composition the
  built v2 pages share. The existing reading routes stay untouched.
  LORE HEADER, RULING CHANGED (10 Aug 2026 defect ruling, wave
  H-defects, commit `0a46d3b`): supersedes the earlier 9 Aug 2026
  ruling that Lore kept centered editorial labels as the one page in
  the nine-page set that did. Lore's eyebrow/title/description now
  compose `StudioPageHeaderView`, left aligned, the standard gold-
  eyebrow-with-trailing-rule treatment, matching the other eight
  pages. The two grid section labels (Community Lore, Your Lore)
  adopt the same eyebrow recipe, left aligned. `KitStudioPageView`'s
  `headerAlign` prop, added for the superseded centered ruling, is now
  unused by any page; left in place per the ruling rather than
  removed.
- **Studio, ruled composition, now BUILT.** Quick-create modals for
  phone and the advanced full editor for desktop (Brief S1, the
  ladder layout with Character quick create). CR-026 (Nick's
  promotion pass over the QUICK/ADVANCED allocation) remains a later
  pass, not a build gate.
- **Adventures, ruled approach, now BUILT and extended.** Proceeds
  using display-name mapping only, through the terminology module
  (`lib/shared/presentation/terminology.js`, which maps STORYLINE to
  "Adventure"); the 11 Aug 2026 session extends this mapping to the
  shared builder components. Nick's backend naming stays as built;
  CR-025/CR-039 stay later, non-blocking renames.
- **Nick engagement, standing.** The front end changes display names
  only; Nick's backend naming stays as built. No contract request is
  escalated to him during the build. He is updated once the front end
  is fully built and reviewed, and every contract request is
  level-set with him in one pass at that review (cutover sequence
  step 3). Nothing in status reporting is described as blocked on
  Nick during the build.

## Typography and design language

Two type families carry the whole system. Body and UI copy is set in
Inter (the sans token). Titles, page heads, and display moments are
set in Cormorant Garamond (the display token), reserved for that
role.

Gold is expressed through several tokens by role (ornament, bright,
action), not one flat value. Three status colors exist for state
only: success (warm sage), warning (burnt amber), danger (brick red).
Never for decoration, charts, or hover effects; every use ships with
a word beside it. No fourth "info" color.

Every value is a token defined once and reused. `docs/DESIGN-TOKENS.md`
is the canonical source for what each token is, its role, and its
legal-on/never-on scope; `docs/RESTYLE-RULES.md` is history only,
cited never followed. `docs/DESIGN-TOKENS.md` also carries a primitive
ladder layer (gold/neutral/status ladders, elevation and blur levels,
a five-state set) minted 9 Aug 2026 under existing role tokens; no
component consumes the ladder yet, that is later work.

Corners, two tiers: LARGE for every full-content-width surface and
every floating surface (modals, pickers, sheets, drawers, popovers,
hero, bottom promo banner, empty states); STANDARD for grid siblings,
in-flow cards, and controls. PILL is reserved for tags and icon
buttons only; every clickable button, everywhere, is a soft-cornered
rectangle, never a pill.

Destructive actions never get a different size or shape from an
ordinary button. An in-page delete trigger is quiet (danger-red word
next to a plain icon, no fill); filled danger-red appears only inside
the confirming button of an "are you sure" step.

## The kit revision rulings, amending chapter 2 of `docs/BUILD-BLUEPRINT.md`

- **Card law.** Full-bleed art in BOTH grid and list layouts; list is
  a wide full-bleed art row, left-anchored legibility fade, no bottom
  action bar anywhere. Face actions are exactly three small overlay
  icons: like, save, and a contextual third action. **AMENDED 11 Aug
  2026 (Creation-card contract 3.2.0):** the third icon resolves per
  card, Play ("Start Chat") on Story/Adventure-kind cards where wired,
  Generate on Image-kind cards where wired, Expand as the universal
  fallback, superseding the earlier fixed-Expand reading. Share,
  download, and delete live inside the open destination. Overlay-action
  placement is RULED (kit polish 3 pass): `overlay-top` everywhere,
  `scrim-row` retired. Art anchors to the top of the frame in both
  layouts. No-art fallback and any kit card surface without art sits
  on the lighter elevated surface token (`--surface-2`) against the
  canvas; the creator-card avatar chip sits on `--surface-3` to keep a
  visible step above the card body.
- **Filter line law.** Search, sort, and every filter share one
  sticky line, docking flush beneath the sticky top bar via
  `--topbar-h`. Filters and multi-selects are branded dropdowns
  opening below their trigger, live selection counts on multi-select,
  gold selected value on single-select. Loose tag rows are retired
  from filter surfaces. Remixable folds in as an option row inside
  the Type dropdown, reading "Remix" everywhere (not "Remixable
  only"). Balance: search anchors left; Type/Rating/Sort/view-toggle
  group anchored right as one unit. **AMENDED 11 Aug 2026 (CR-038):**
  Community and Vault's Type dropdown shares one five-bucket option
  set: Characters, Worlds, Looks, Stories, Adventures.
- **Tag economy.** A card badge appears only when it informs: Canon
  always; visibility badges only in own-work contexts; never a badge
  restating an active filter selection. Ratings never render as a
  card badge, only as a filter dropdown.
- **Mobile law at 390.** Every component fully functional and
  comfortable at 390. Search takes its own full-width row inside the
  sticky filter block. Dropdown panels dock to the bottom edge as
  sheets under 700px (with a structural close-header row, R7, so the
  close control never overlaps content), popovers below the trigger
  at 700px and up. Popup modals (asset detail, credits, image
  creator, ingredient picker, save-preset) maximize full screen
  vertically and horizontally under 700px with internal thumb
  scrolling (R4); sheets keep the bottom dock.
- **Focus law.** Keyboard focus (`:focus-visible`) keeps one subtle
  indicator: a slight border brightening (`--line-strong`), never a
  gold box. Pointer interaction shows no focus ring at all. Note:
  `docs/DESIGN-TOKENS.md` "Motion and focus" still names the global
  gold `--focus-ring` as the only focus treatment; the kit focus law
  supersedes it on kit surfaces, and the tokens-doc alignment edit is
  a carried Sprint G item, not yet made.
- **Banner hierarchy law.** One primary CTA per banner; description
  de-emphasized (`--art-ink-dim`, measure-capped). The `top` treatment
  carries an opt-in galaxy layer (`showGalaxy`). The `bottom`
  treatment's mobile aspect is `1/1` (taller, more artwork visible)
  with a lighter, still-44px-floor CTA; desktop unchanged. **AMENDED
  11 Aug 2026 (promo-banner contract 1.2.0):** an optional quiet
  secondary action, `cf-btn--secondary` (border only, no fill), may
  sit beside the one primary CTA; never a second primary. First
  consumer: Home's top banner, both its cold-start and filled/continue
  states.
- **Compact continue row, RULED 11 Aug 2026, new pattern.**
  `KitContinueRow`, a package sibling to `promo-banner`, not part of
  its contract: small art thumbnail left, title, "Last played" line,
  Continue button right, list-density height. Stories is its only
  consumer: up to three most-recent in-progress items render as rows,
  capped, with "Show all in progress (N)" revealing the rest; Stories
  carries no continue banner at all. Home is the only page keeping a
  continue banner and does not consume this pattern.
- **List density.** Two-up list rows permitted at desktop widths where
  whitespace allows; Community renders its list two-up at 1100px and
  up.
- **Ratings presentation.** Ruled final per CR-027 (kit polish 2
  pass) and implemented in `lib/shared/presentation/terminology.js`
  (`CONTENT_RATING_TIERS`): SFW displays as Everyone, MATURE as Teen,
  EXPLICIT as Adult, one to one, no disabled row. Film anchors ride
  the row tooltip, never a visible description line or a card badge.
  A required content audit (CR-027) gates live, non-fixture data
  under these labels; fixture-driven previews are unaffected. (The
  prose of `docs/BUILD-BLUEPRINT.md` 2.16(h) predates the final
  CR-027 ruling and defers to it by its own reference; CR-027 and the
  terminology module are the current truth.)
- **Selection-state law.** Selected and active states read as a gold
  icon or text plus a light gold wash (`--fill`); no bold borders, no
  heavy outlines.
- **Grid/list toggle.** Icons only, all five filter-line controls
  (search, three dropdowns, toggle) measure the same
  `--control-filter` height; selected state follows the
  selection-state law.
- **Image viewer law (R2/R5, kit polish 3), RULED.** The viewer is its
  own surface, never a panel with an image inside it: gold hairline
  snapped to the image's own rendered edges (never around empty
  space), no `--surface-4` panel chrome at all. Surround is the sticky
  nav chrome-frost treatment
  (`color-mix(in srgb, var(--canvas) 88%, transparent)` plus
  `--blur-chrome`), a named legal use of `--blur-chrome` on a floating
  surface. Action shelf (Love, Save, Share) sits directly beneath the
  hairline, width-synced to the image. No creator handle on the
  viewer. Zoom by wheel/double-click/pinch, pan by drag while zoomed,
  reset on close. On mobile the image takes the maximum available
  space; the shelf floor is its own min-content width for very narrow
  images (OPEN item).
- **Credits collapse law (R1), RULED.** The asset detail popup shows
  only the first credit plus a "View all credits" control that opens
  a secondary modal (`KitCreditsModal`) in the same space, scrollable,
  with a back path returning to the popup beneath. Popup space budget
  goes to art and description, not the credit list.
- **Mobile verification method (R3), RULED, now SOP law.** All mobile
  verification uses the Chrome DevTools MCP `emulate` command at
  390x844, deviceScaleFactor 2, mobile true, touch enabled. The
  `resize` command is banned for mobile checks (clamps near 500px,
  produces false passes); see `docs/FRONTEND-SOP.md` section 8.

## The rail rulings, now law in `docs/BUILD-BLUEPRINT.md` section 2.18

Sprint F's OPEN items 31 through 35 are RULED and CLOSED
(`docs/SPRINT-F-PLAN.md`); the built defaults stand:

- **Head layout (item 31, variant A).** Label, short gold rule, then
  View all, reading left to right. Above 700px the head is one row
  with the control seat and arrow pair pushed right; below 700px it
  wraps to two rows (label and rule on row one; View all and the
  control seat grouped and right-aligned on row two), the label
  wrapping rather than truncating.
- **Edge alignment (item 32).** Peek depth stays 0.4 of a card at
  every tier. The scrollport and its trailing fade terminate at the
  page content edges at every width including 390; no mobile
  full-bleed, no negative-margin bleed.
- **Arrow seat (item 33, variant D).** Native scroll everywhere; gold
  arrow pair rides the right end of the head row from 700px up,
  disabled at each end. No dot indicators, no page counter.
- **Fade (item 34, variant G).** Right-edge overlay,
  `linear-gradient(90deg, transparent, var(--canvas))`, about
  `--space-10` wide, hidden at rest-at-end. Package-local recipe, not
  a token.
- **Creator rail fit (item 35).** Cells stretch; creator cards in one
  rail equalize height.
- **Empty-rail law.** A rail with nothing in it renders nothing at
  all, head included.

**Item 36 (mute control placement on the creator profile, CR-028)
CLOSED 11 Aug 2026.** The Creators profile-detail page is built
(`/studio/v2/creators/[handle]`, contract 1.2.0) and its engagement
row carries the control, exact label "Mute content" ("Muted" when
active).

## Sidebar v2 preview flag

`NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`, read by
`lib/shared/flags/sidebarV2Preview.js`, documented in full in
`docs/FRONTEND-SOP.md` section 18. On by default for dev and staging,
off in production. Gates a preview-only nine-destination journey-order
nav on the live `StudioSidebar`, grouped Play/Create/Explore.
**Updated 11 Aug 2026: all nine destinations now route to a live
`/studio/v2/<page>`** (`useStudioSidebarViewModel.js`, every entry
`isBuilt: true`), superseding the earlier partial set where four of
nine rendered quiet with a "Soon" mark; today's existing sidebar links
collapse into a collapsible Legacy group beneath. The Account v2 draft
is NOT part of this flag or the nine-page model; it is a staging draft
outside the journey loop with no sidebar entry at all. This preview
surface is distinct from the real cutover: under the 10 Aug 2026
cutover sequence above, no page enters the live sidebar until the
whole new site goes live at step 6.

## The LOOM file shape

Most converted UI packages follow one shape, responsibilities kept
deliberately separate:

- **Binding Shell** (e.g. `StudioSidebar.jsx`): owns Crestfall-specific
  integration: Next.js navigation, application state, host adapters,
  route behavior, ViewModel wiring.
- **ViewModel** (e.g. `useStudioSidebarViewModel.js`): normalizes
  input and prepares props for the View, owns presentation-only local
  state.
- **Portable View** (e.g. `StudioSidebar.view.jsx`): presentation
  only. No database access, no Supabase product data, no services-api
  calls, no persistence, no router behavior, no business rules.
  Receives data and callbacks through props.
- **Contract**: documents the expected shape of props and behavior,
  versioned on line 1.
- **Fixtures**: local, deterministic states for previews and isolated
  testing, without depending on live APIs.

Full detail and the ten-point new-module checklist: `docs/FRONTEND-SOP.md`
section 1.

## Kit inventory

The `components/kit/` packages, the shared vocabulary every new v2
page composes from (`docs/BUILD-BLUEPRINT.md` chapter 2):

| Package | Ships | Contract | Notes |
|---|---|---|---|
| `studio-page` | one-width page shell, header/filter/children/banner slots | 1.0.0 | R1 one-width law |
| `studio-filter-bar` | search, filter dropdowns, sort, view-mode slot on one sticky line | 2.0.0 | filter line law |
| `dropdown` | branded popover/sheet, multi and single select | 1.1.0 | additive `ariaLabel`; sheet variant carries the R7 close-header row; carries the five-bucket Type option set (CR-038) where consumed by Community/Vault |
| `promo-banner` | three treatments: bottom, card, top | 1.2.0 | `top` carries the opt-in galaxy layer; `bottom` carries the R6 mobile proportions; v1.2.0 (11 Aug 2026) adds the optional quiet secondary CTA. `KitContinueRow` ships as a sibling file in this package, Stories-only, not part of this contract |
| `load-more` | batch-then-append pagination, no infinite scroll | 1.0.0 | |
| `creation-card` | full-bleed grid and list card | 3.2.0 | card law; `actionPlacement` retired, `overlay-top` only; v3.2.0 (11 Aug 2026) adds the contextual third overlay action (Play/Generate/Expand) |
| `creator-card` | avatar, stats, recent-work thumbnails, follow | 1.0.0 | card-without-art surface ruling |
| `filter-chip` | chip rows inside dropdown panels | 1.0.0 | loose filter chips retired from top-level surfaces |
| `badge` | rest-only labels (Canon, visibility) | 1.0.0 | tag economy governs when it renders |
| `modal-frame` | unified modal shell, variants modal / sheet / viewer | 1.1.0 | R4 mobile maximize, R7 sheet header, R2/R5 viewer variant |
| `asset-detail-popup` | expand destination for creation cards | 2.1.0 | credits presentation collapses per R1 |
| `image-overlay` | the image viewer, composed on the modal-frame viewer variant | 1.0.0 | rebuilt per R2/R5, presentation-only recomposition |
| `credits` | credit list plus the R1 modal composition (`KitCreditsModal`) | 1.1.0 | |
| `image-creator-panel` | image generator panel: mode toggle, six ingredient slots, options, generate/video blocks | 1.0.0 | Sprint E; fixture-only, no fetch |
| `ingredient-picker` | search plus ingredient card grid, Use Once / New Preset | 1.0.0 | Sprint E |
| `save-ingredient-preset` | preset name/description/prompt/tags save flow | 1.0.0 | Sprint E |
| `rail` | horizontally scrolling card rail: head (label, gold rule, View all, control seat, arrow pair), snap scrollport, trailing fade | 1.0.0 | Sprint F; section 2.18 law; items 31 to 35 closed; empty rail renders nothing |
| `destination-tile` | compact art tile, section label, one short supporting line, routes outward on tap | 1.0.0 | Sprint G planning gate; OPEN item 37 ruled option A; no live-page consumer yet, built ahead of the Home page itself |

Not yet built as kit packages: global search, form field (ad hoc
`cf-field` recipes still cover this), picker-modal/menu-popover beyond
the ingredient picker, alert-strip. Item 37's `destination-tile`
package shipped ahead of Home itself; item 38 (the Continue strip's
filled-state treatment) is closed by the promo-banner v1.2.0 ghost-CTA
addition above, Home's own consumer.

## Where the build stands

Built under `/studio/v2/<page>`, all fixture-driven, pre-parity, out
of the sidebar until the go-live step of the cutover sequence, each
with an auth-free mirror at `/dev/ui-preview/<page>-v2-page` for
verification without signing in. **All nine pages of the ruled model
are now built**, plus two supporting pages the model always implied
and the advanced editor:

1. **Home** (`/studio/v2/home`, contract 2.2.0): the guidepost
   composition (top banner, Continue rows, eight destination tiles,
   four KitRail rails, bottom banner), consuming KitRail four times.
   Cold-start and filled/continue banner states both ship, each with
   its own primary and ghost CTA (11 Aug 2026).
2. **Stories** (`/studio/v2/stories`): hub only; compact continue rows
   (capped three, "Show all" reveals the rest) lead, then the
   startable shelf; no hero continue banner (retired 11 Aug 2026).
   Chat room `[id]` surface excluded by standing sweep-scope ruling.
3. **Adventures** (`/studio/v2/adventures`): browse hub plus the
   rehosted Storyline builder modal, all 27 original fields intact.
   Display naming extended to the shared builder components 11 Aug
   2026.
4. **Studio** (`/studio/v2/studio`, contract 1.0.0, Brief S1): the
   create-hub ladder layout with Character quick create.
5. **Images** (`/studio/v2/images`): the library grid plus the
   Sprint E creator panel: sticky right rail at 1100px and up, sticky
   "Create image" CTA opening a full-screen modal under 1100px. Full
   ingredient-picker and save-preset flow wired end to end against
   fixtures.
6. **Vault** (`/studio/v2/vault`): hub, now with its edit tree,
   preview tree, and image-library all reachable through the new
   editor route (CR-007/CR-008 resolved 11 Aug 2026, see the rulings
   section above).
7. **Community** (`/studio/v2/community`): built first, established
   the whole browse kit.
8. **Creators** (`/studio/v2/creators`): browse hub, plus the
   profile-detail page (`/studio/v2/creators/[handle]`, contract
   1.2.0) and its connections sub-page
   (`/studio/v2/creators/[handle]/connections`, contract 1.0.0), both
   shipped 11 Aug 2026, closing the item 36 mute-control ruling and
   the parity echo's largest previously-open block.
9. **Lore** (`/studio/v2/lore`): index page on the shared v2
   composition; left-aligned editorial labels per the 10 Aug 2026 LORE
   HEADER ruling.

Supporting surfaces, not their own destination in the nine-page model:

- **The advanced editor** (`/studio/v2/editor/[id]`, contract 1.2.0):
  the CR-007/CR-008 destination, composing the unmodified legacy edit
  tree; origin-aware back control (label exactly "Back", Vault
  fallback). Its own image-library page
  (`/studio/v2/editor/[id]/image-library`, contract 1.0.0) composes
  the unmodified legacy `CreationImageLibraryPage` package.
- **Account** (`/studio/v2/account`): a fixture-driven restyle draft
  of the live account page, fixing three read live defects (title
  collision, stat duplication, raw controls). Explicitly OUTSIDE the
  nine-page model: no sidebar entry, no banner, no filter bar, not
  part of the journey loop.

The `rail` kit package (KitRail) shipped in Sprint F with its own
preview route (`/dev/ui-preview/kit-rail`), render pass, and defect
fix pass; its function-map rows landed with the Home build.

Every kit package above has its own `/dev/ui-preview/<package>` route,
fixture-driven, unavailable in production.

Open picks awaiting Brian's render review: Sprint D items 1 through
21 and Sprint E items 22 through 30 stand in those plans' own OPEN FOR
BRIAN sections; Sprint F items 31 through 35 are ruled and closed;
item 36 (mute placement) is now closed (see above); OPEN item 42 (the
Home creations-filter seat) stays open. Read the plans directly for
the live lists.

## Named future workstreams

Not scheduled inside the nine-page build; recorded here so they are
not lost between sessions.

- **Marketing site with a CMS.** A public-facing marketing site,
  content-managed, separate from the Studio product surfaces this
  document otherwise tracks.
- **Admin dashboard.** An internal administrative surface, no build
  detail settled yet.
- **Sidebar rebuild.** Fixed positioning and an account-area cleanup,
  distinct from the preview-flag journey-order nav above; the
  preview-flag work stages the destinations, the rebuild itself is a
  separate, later structural pass on the sidebar shell.
- **The Fable review gate.** Covers the creation-type quick/advanced
  allocation (the CR-026 lineage this document already tracks under
  Studio) and high-volume creator behavior, using G Stack read-only
  tools for that review.
- **Recommendation and sorting logic**, on Nick's agenda: the backend
  ranking behind the sort controls this document records as fixture-
  driven across every browse page (Home's rail sort, Community's and
  Vault's Sort dropdowns, and kin).
- **Private-content nudity policy decision**, on Nick's agenda: a
  content-standards ruling in the same family as CR-027's rating-tier
  work, not yet decided.

## The quality floor

A View is presentation-only and stays that way: no direct product-data
access, no bypassing the frontend API and services-api boundaries, no
business logic pulled into page components.

Changes are the smallest edit that satisfies the task. Existing props
and behavior are preserved unless the task requires a contract
change; when the prop surface changes, the contract updates with it;
when a new visible state is needed, a fixture is added for it.

Every change is checked by the agent on a rendered page, not assumed
from a file read, at 390 width then 1440 width (the R3 emulate
method, never `resize`). A production build should finish with exit
code 0.

## Process lives separately

How work gets done, branch and commit rules, what may be edited,
verification, escalation, model lanes, and the session rule are
`docs/PROJECT-INSTRUCTIONS.md` and `CLAUDE.md`'s job, not this
document's. This file and `docs/DESIGN-TOKENS.md` cover the product
and the design language; the other two cover craft and process.
