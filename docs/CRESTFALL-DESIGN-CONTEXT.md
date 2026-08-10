# Crestfall design context

Regenerated 9 Aug 2026 (demo prep pass) from the repo's current ruled
state. Supersedes every earlier version of this file. Not law itself;
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
cited never followed.

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

## The kit revision rulings (9 Aug 2026, kit polish pass), amending chapter 2 of `docs/BUILD-BLUEPRINT.md`

- **Card law.** Full-bleed art in BOTH grid and list layouts; list is
  a wide full-bleed art row, left-anchored legibility fade, no bottom
  action bar anywhere. Face actions are exactly three small overlay
  icons: like, save, expand. Share, download, and delete live inside
  the open destination. Overlay-action placement is RULED 10 Aug
  2026 (kit polish 3 pass): `overlay-top` everywhere, `scrim-row`
  retired. Art anchors to the top of the frame in both layouts. No-art
  fallback and any kit card surface without art sits on the lighter
  elevated surface token (`--surface-2`) against the canvas, ruled 9
  Aug 2026 (demo prep pass): `KitCreationCard`'s no-image fallback
  and `KitCreatorCard`'s card body both moved from `--surface-1` to
  `--surface-2`; the creator-card avatar chip moved to `--surface-3`
  to keep a visible step above the card body.
- **Filter line law.** Search, sort, and every filter share one
  sticky line. Filters and multi-selects are branded dropdowns
  (`dropdown` package, 2.17) opening below their trigger, live
  selection counts on multi-select, gold selected value on
  single-select. Loose tag rows are retired from filter surfaces.
  Remixable folds in as an option row inside the Type dropdown; the
  standalone Remixable dropdown is retired.
- **Tag economy.** A card badge appears only when it informs: Canon
  always; visibility badges only in own-work contexts; never a badge
  restating an active filter selection. Ratings never render as a
  card badge, only as a filter dropdown.
- **Mobile law at 390.** Every component fully functional and
  comfortable at 390. Search takes its own full-width row inside the
  sticky filter block. Dropdown panels dock to the bottom edge as
  sheets under 700px, popovers below the trigger at 700px and up.
- **Focus law**, amended 9 Aug 2026. Keyboard focus
  (`:focus-visible`) keeps one subtle indicator: a slight border
  brightening (`--line-strong`), never a gold box. Pointer
  interaction shows no focus ring at all. Supersedes the prior
  all-pointer gold `--focus-ring` box on the search field and kit
  controls.
- **Banner hierarchy law.** One primary CTA per banner; description
  de-emphasized (`--art-ink-dim`, measure-capped). The `top`
  treatment gains an opt-in galaxy layer (`showGalaxy`).
- **List density.** Two-up list rows permitted at desktop widths
  where whitespace allows; the Community page renders its list
  two-up at 1100px and up.
- **Ratings presentation, mapping CORRECTED 9 Aug 2026 (demo prep
  pass).** SFW displays as Everyone (tooltip "Comparable to a G or PG
  film."). MATURE and EXPLICIT both display as Adult (tooltip
  "Comparable to an R film."); EXPLICIT's mapping is interim, pending
  Nick's ruling on migrating or reclassifying EXPLICIT-tagged content
  under the Adult/R ceiling (`docs/CONTRACT-REQUESTS.md` CR-027).
  Teen renders as a disabled row with no backend value (tooltip
  "Comparable to a PG-13 film."), arriving with CR-027. Film anchors
  ride the row tooltip, never a visible description line or a card
  badge. Mapping lives in
  `lib/shared/presentation/terminology.js` (`CONTENT_RATING_TIERS`).
  The prior mapping (MATURE as Teen, EXPLICIT as Adult) was a
  semantic error and is superseded.
- **Selection-state law.** Selected and active states read as a gold
  icon or text plus a light gold wash (`--fill`); no bold borders, no
  heavy outlines. Applies to dropdown triggers, the grid/list toggle,
  and any control that previously used a bold `--gold-action`
  selected border.
- **Grid/list toggle.** Icons only: no visible "Layout" group title,
  no visible "Grid"/"List" text labels; `label` still reaches
  `aria-label` for accessibility. Selected state follows the
  selection-state law.

## Sidebar v2 preview flag (9 Aug 2026, demo prep pass)

`NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`, read by
`lib/shared/flags/sidebarV2Preview.js`, documented in full in
`docs/FRONTEND-SOP.md` section 18. On by default for dev and staging,
off in production. Gates a preview-only nine-destination journey-order
nav on the live `StudioSidebar`: built destinations (today, only
Community, `/studio/v2/community`) route normally, unbuilt
destinations render quiet and non-interactive with a "Soon" mark,
and today's existing sidebar links collapse into a collapsible
Legacy group beneath. Flag off renders the sidebar exactly as before
the flag existed. This is a preview surface distinct from the real
per-page cutover process in the product model's section 6 migration
strategy; it does not move any page's real sidebar entry.

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
page composes from (`docs/BUILD-BLUEPRINT.md` chapter 2, table at
2.12):

| Package | Ships | Notes |
|---|---|---|
| `studio-filter-bar` | search, filter dropdowns, sort, view-mode slot on one sticky line | filter line law |
| `dropdown` | branded popover/sheet, multi and single select | new this pass; disabled rows read "Soon" |
| `promo-banner` | three treatments only: bottom, card, top | `top` carries the opt-in galaxy layer |
| `load-more` | batch-then-append pagination, no infinite scroll | |
| `creation-card` | full-bleed grid and list card | card law; v3.0.0 contract, share/download/delete moved off the card |
| `creator-card` | avatar, stats, recent-work thumbnails, follow | card-without-art surface ruling (this pass) |
| `filter-chip` | chip rows inside dropdown panels | loose filter chips retired from top-level surfaces |
| `badge` | rest-only labels (Canon, visibility) | tag economy governs when it renders |
| `image-overlay` | expanded image view, interim | converts fully in a later batch |

Not yet built as kit packages: global search, modal frame (carved
from ModalShell), form field, picker-modal/menu-popover, alert-strip,
asset-detail-popup (specced only, not built).

## Where the build stands

`/studio/v2/community` is the only nine-page-architecture route built
today, composed from the kit above (`CommunityV2Mockup.jsx`), fixture-
driven, pre-parity, out of the sidebar per the route law. It mirrors
auth-free at `/dev/ui-preview/community-v2-page` for verification
without signing in. Its parity echo (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md
section 6, item 4) has not yet run.

Every other kit package above has its own `/dev/ui-preview/<package>`
route, fixture-driven, unavailable in production.

One open pick awaits Brian, live in fixtures for a rendered choice:
the lighter wash value for artwork under a tag bed, carried from the
batch-two sweep. The creation-card overlay-action placement is ruled
(see above).

## The quality floor

A View is presentation-only and stays that way: no direct product-data
access, no bypassing the frontend API and services-api boundaries, no
business logic pulled into page components.

Changes are the smallest edit that satisfies the task. Existing props
and behavior are preserved unless the task requires a contract
change; when the prop surface changes, the contract updates with it;
when a new visible state is needed, a fixture is added for it.

Every change is checked by the agent on a rendered page, not assumed
from a file read, at 390 width then 1440 width. A production build
should finish with exit code 0.

## Process lives separately

How work gets done, branch and commit rules, what may be edited,
verification, escalation, model lanes, and the session rule are
`docs/PROJECT-INSTRUCTIONS.md` and `CLAUDE.md`'s job, not this
document's. This file and `docs/DESIGN-TOKENS.md` cover the product
and the design language; the other two cover craft and process.
