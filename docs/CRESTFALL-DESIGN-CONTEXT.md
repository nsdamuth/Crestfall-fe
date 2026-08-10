# Crestfall design context

Regenerated 10 Aug 2026 (post kit-polish-3 / Sprint E, folding in the
10 Aug strategy-chat rulings) from the repo's current ruled state.
Supersedes every earlier version of this file. Not law itself;
CLAUDE.md names the four law documents (`docs/DESIGN-TOKENS.md`,
`docs/FRONTEND-SOP.md`, `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`, the
active sprint plan). This file orients a new session fast; when it
and a law document disagree, the law document wins and this file is
stale and should be regenerated.

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

Migration strategy (the strangler pattern, section 6): each new page
builds fresh under `/studio/v2/<page>`, stays out of the sidebar
until it clears a parity check against its old-page equivalent
(rendered at 390 and 1440), then cuts over in one commit: move to the
final address, swap the sidebar entry, redirect the old address.
Retirement is per page, never a single cutover. Old page code is
deleted only in one full-inventory sweep after all nine have cut
over.

## Rulings from the 10 Aug 2026 strategy chat

These are orientation notes on decisions made outside this repo's
commit history; they are not yet reflected in the law documents and
carry the same "law document wins on conflict" caveat as the rest of
this file.

- **Home page, ruled.** A guidepost that routes, not a dashboard and
  not an editorial front page. Order, top to bottom: medium top
  banner using the promo-banner top treatment with the galaxy layer
  on; a Continue strip that renders nothing when nothing is in
  progress; a block of eight destination tiles covering every other
  section; four curated rails (top rated, recently added, from the
  community, creators to follow); medium bottom banner routing to
  Stories. "View all" sits at each rail's head beside the label, not
  at the far end of the scroll. One sort control, on the top rail
  only.
- **Rails, ruled.** No horizontally scrolling card row exists in the
  kit today, so this is a new kit package, built once and used four
  times on Home. It holds existing cards; no card-level work is
  needed.
- **Lore, ruled.** Ships as an index page on the same composition the
  five built v2 pages share (Community, Creators, Vault, Images,
  Stories). The existing reading routes stay untouched. Lore keeps
  its centered editorial labels, the one page in the nine-page set
  that does.
- **Nick engagement, standing.** The front end changes display names
  only; Nick's backend naming stays as built. No contract request is
  escalated to him during the Home/Rails/Lore build. He is updated
  once the front end is fully built and reviewed, and every
  contract request is level-set with him in one pass at that review.
  Nothing in status reporting is described as blocked on Nick during
  the build.
- **Open, not ruled: the `/studio` address question.** A 9 Aug ruling
  (`docs/BUILD-BLUEPRINT.md` section 3.1, row 8) makes `/studio`
  become Play > Home. Studio is also one of the nine pages in its own
  right (Create > Studio). This collision is an open address
  question, explicitly not resolved by the 10 Aug chat. Do not
  interpret or guess past it.

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
  icons: like, save, expand. Share, download, and delete live inside
  the open destination. Overlay-action placement is RULED (kit polish
  3 pass): `overlay-top` everywhere, `scrim-row` retired. Art anchors
  to the top of the frame in both layouts. No-art fallback and any kit
  card surface without art sits on the lighter elevated surface token
  (`--surface-2`) against the canvas; the creator-card avatar chip
  sits on `--surface-3` to keep a visible step above the card body.
- **Filter line law.** Search, sort, and every filter share one
  sticky line, docking flush beneath the sticky top bar via
  `--topbar-h`. Filters and multi-selects are branded dropdowns
  opening below their trigger, live selection counts on multi-select,
  gold selected value on single-select. Loose tag rows are retired
  from filter surfaces. Remixable folds in as an option row inside
  the Type dropdown, reading "Remix" everywhere (not "Remixable
  only"). Balance: search anchors left; Type/Rating/Sort/view-toggle
  group anchored right as one unit.
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
  gold box. Pointer interaction shows no focus ring at all.
- **Banner hierarchy law.** One primary CTA per banner; description
  de-emphasized (`--art-ink-dim`, measure-capped). The `top` treatment
  carries an opt-in galaxy layer (`showGalaxy`). The `bottom`
  treatment's mobile aspect is `1/1` (taller, more artwork visible)
  with a lighter, still-44px-floor CTA; desktop unchanged.
- **List density.** Two-up list rows permitted at desktop widths where
  whitespace allows; Community renders its list two-up at 1100px and
  up.
- **Ratings presentation.** SFW displays as Everyone. MATURE and
  EXPLICIT both display as Adult (EXPLICIT's mapping is interim,
  pending CR-027). Teen renders as a disabled row with no backend
  value yet. Film anchors ride the row tooltip, never a visible
  description line or a card badge. Mapping lives in
  `lib/shared/presentation/terminology.js` (`CONTENT_RATING_TIERS`).
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

## Sidebar v2 preview flag

`NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`, read by
`lib/shared/flags/sidebarV2Preview.js`, documented in full in
`docs/FRONTEND-SOP.md` section 18. On by default for dev and staging,
off in production. Gates a preview-only nine-destination journey-order
nav on the live `StudioSidebar`: built destinations route to their
live `/studio/v2/*` page (today: Community, Creators, Vault, Images,
Stories), unbuilt destinations render quiet and non-interactive with a
"Soon" mark, and today's existing sidebar links collapse into a
collapsible Legacy group beneath. Flag off renders the sidebar exactly
as before the flag existed. The Account v2 draft is NOT part of this
flag or the nine-page model; it is a staging draft outside the journey
loop with no sidebar entry at all. This preview surface is distinct
from the real per-page cutover process in the product model's section
6 migration strategy; it does not move any page's real sidebar entry.

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
| `dropdown` | branded popover/sheet, multi and single select | 1.1.0 | additive `ariaLabel`; sheet variant carries the R7 close-header row |
| `promo-banner` | three treatments: bottom, card, top | 1.1.0 | `top` carries the opt-in galaxy layer; `bottom` carries the R6 mobile proportions |
| `load-more` | batch-then-append pagination, no infinite scroll | 1.0.0 | |
| `creation-card` | full-bleed grid and list card | 3.1.0 | card law; `actionPlacement` retired, `overlay-top` only |
| `creator-card` | avatar, stats, recent-work thumbnails, follow | 1.0.0 | card-without-art surface ruling |
| `filter-chip` | chip rows inside dropdown panels | 1.0.0 | loose filter chips retired from top-level surfaces |
| `badge` | rest-only labels (Canon, visibility) | 1.0.0 | tag economy governs when it renders |
| `modal-frame` | unified modal shell, variants modal / sheet / viewer | 1.1.0 | R4 mobile maximize, R7 sheet header, R2/R5 viewer variant |
| `asset-detail-popup` | expand destination for creation cards | 2.1.0 | credits presentation collapses per R1 |
| `image-overlay` | the image viewer, composed on the modal-frame viewer variant | 1.0.0 | rebuilt per R2/R5, presentation-only recomposition |
| `credits` | credit list plus the R1 modal composition (`KitCreditsModal`) | 1.1.0 | |
| `image-creator-panel` | image generator panel: mode toggle, six ingredient slots, options, generate/video blocks | 1.0.0 | new this sprint (Sprint E); fixture-only, no fetch |
| `ingredient-picker` | search plus ingredient card grid, Use Once / New Preset | 1.0.0 | new this sprint |
| `save-ingredient-preset` | preset name/description/prompt/tags save flow | 1.0.0 | new this sprint |

Not yet built as kit packages: global search, form field (ad hoc
`cf-field` recipes still cover this), picker-modal/menu-popover beyond
the ingredient picker, alert-strip, the horizontally scrolling **rail**
package Home's four curated rails need (ruled 10 Aug, not yet built).

## Where the build stands

Built under `/studio/v2/<page>`, all fixture-driven, pre-parity, out
of the sidebar until parity per the route law, each with an auth-free
mirror at `/dev/ui-preview/<page>-v2-page` for verification without
signing in:

1. **Community** (`/studio/v2/community`): built first, established
   the whole browse kit. Parity echo not yet run.
2. **Creators** (`/studio/v2/creators`): hub only, no profile-detail
   page; 2 of 26 legacy parity rows Present, 24 Flagged.
3. **Vault** (`/studio/v2/vault`): hub only, standalone edit tree
   held out under CR-007/CR-008; 8 of 112 parity rows Present, 7
   Flagged, 97 Deliberately excluded.
4. **Images** (`/studio/v2/images`): the library grid plus the
   Sprint E creator panel: sticky right rail at 1100px and up, sticky
   "Create image" CTA opening a full-screen modal under 1100px. Full
   ingredient-picker and save-preset flow wired end to end against
   fixtures.
5. **Stories** (`/studio/v2/stories`): hub only; the Continue group
   (in-progress items) leads, then the startable shelf. Chat room
   `[id]` surface excluded by standing sweep-scope ruling.
6. **Account** (`/studio/v2/account`): a fixture-driven restyle draft
   of the live account page, fixing three read live defects (title
   collision, stat duplication, raw controls). Explicitly OUTSIDE the
   nine-page model: no sidebar entry, no banner, no filter bar, not
   part of the journey loop.

Not started: Adventures (waits on Nick's CR-025 rename), Studio (waits
on Nick's CR-026 quick-create review, and now also carries the open
`/studio` address collision with Home above), Home (composition ruled
10 Aug 2026, see above; not yet built), Lore (ruled 10 Aug 2026 to
ship as an index page on the shared v2 composition with centered
editorial labels; still needs Nick's CR-015 pipeline confirmation and
is otherwise the most net-new contract surface of the nine).

Every kit package above has its own `/dev/ui-preview/<package>` route,
fixture-driven, unavailable in production.

Open picks awaiting Brian's render review live in
`docs/SPRINT-D-PLAN.md` and `docs/SPRINT-E-PLAN.md`'s own OPEN FOR
BRIAN sections (the current count: the Sprint D standing 21 plus
Sprint E's 22 through 30), not restated here since they are numerous
and change per sprint; read those plans directly for the live list.

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
