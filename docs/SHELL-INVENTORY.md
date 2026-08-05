# Shell inventory

Route-level layout, page shell, background/canvas layer, and page chrome
pieces, gathered from docs/COMPONENT-CENSUS.csv layout chrome entries,
docs/REDESIGN-ORDER.md, and the app route tree. Reference only. Retargeted
in step 4 of the phase 2 skin brief.

## 1. Root layout

**app/layout.js** - html/body shell, font variable wiring, no visual chrome
of its own. Affects all 65 routes. Count: 1.

## 2. Chronicles/lore public shell (SiteShell family)

**components/SiteShell.jsx** - background image layer (fixed cover image,
30% opacity) plus a strong scrim div, centered content column, embeds
ScrollControls. Used by 13 pages: /characters, /characters/[...slug],
/chronicle, /factions, /factions/[...slug], /intro, /locations,
/locations/[...slug], /lore, /lore/[...slug], /stories, /terms,
/terms/[slug]. Count: 13 pages, 1 shell component.

**components/PageShell.jsx** - flat background (no image layer, no scrim),
same header/content/return-home structure as SiteShell. 0 pages currently
wired per census (dormant chrome variant). Count: 0 pages, 1 shell
component.

**components/ScrollControls.jsx** - fixed-position scroll-to-top/bottom page
chrome, embedded inside SiteShell. Same 13-page reach as SiteShell.

**components/SiteFooter.jsx** - chronicles-side footer chrome (nav links to
lore/characters/locations/factions/stories/chronicle plus legal). Wired
reach not isolated in census from SiteHeader/SiteShell composition; treated
as page chrome for the public site shell family.

**components/SiteHeader.jsx** - top bar chrome for the public site shell
family, paired with SiteFooter.

## 3. Studio shell (StudioShell family)

**app/studio/layout.js** - auth gate (redirects to /login if unauthenticated)
wrapping StudioShell. Affects all 54 studio routes listed in census
(component_package: components/studio/StudioShell.jsx row). Count: 54
pages, 1 layout file.

**components/studio/StudioShell.jsx** - main studio canvas: flat black
background (`bg-black`), flex shell with StudioSidebar rail, content
section with page padding (`px-5 pb-24 pt-20 sm:px-8 lg:px-10 lg:py-8`),
embeds StudioMobileNav and StudioTopBar. Count: 54 pages.

**components/studio/StudioTopBar.jsx** - top bar chrome (view/viewmodel
split, account link slot). Same 54-page reach as StudioShell.

**components/studio/studio-sidebar (StudioSidebar)** - desktop sidebar
navigation chrome with embedded economy widget, collapsed/expanded layout.
Same 54-page reach.

**components/studio/studio-mobile-nav (StudioMobileNav)** - mobile nav
drawer chrome. Same 54-page reach.

**components/studio/studio-economy-widget** - coin balance chrome embedded
in the sidebar, not a standalone page shell but part of the persistent
studio chrome. Same 54-page reach.

**components/studio/studio-account-provider** - not visual chrome, context
provider wrapping StudioShell; noted for completeness since it wraps the
canvas.

## 4. Home route

**app/page.js** - top-level "/" route. No dedicated shell component found
in components/*.jsx census; uses PublicHomeFooter per census reach (0 pages
listed, dormant or inlined). Flagged for confirmation during retarget
step, not assumed.

## 5. Floating/overlay chrome (defined here, adopted by Phase 3)

**components/ui/ModalShell.jsx** - reusable modal container, backdrop,
escape-key handling. 11 pages reach per census. This run defines the modal
treatment as a reusable design-system definition; ModalShell itself and its
callers are Phase 3 scope, not retargeted here.

**Dropdown treatment** - no single dropdown shell component found in
census; treatment to be defined as a reusable design-system pattern in step
3, adopted by individual controls in Phase 3.

## 6. Out of scope this run

Sidebar (studio-sidebar), search/filter/sort bar (FilterableIndex and
related), card components, the three banner treatments, and the modal
frame component (ModalShell internals) are Phase 3 per the brief. Listed
above only where they intersect the canvas/shell layer being retargeted.

## Summary counts

- Root layout: 1 file, all 65 routes
- SiteShell family (chronicles/public): 13 pages, 5 chrome pieces
  (SiteShell, PageShell, ScrollControls, SiteFooter, SiteHeader)
- StudioShell family: 54 pages, 6 chrome pieces (StudioShell, StudioTopBar,
  StudioSidebar, StudioMobileNav, studio-economy-widget,
  studio-account-provider)
- Home route: 1 page, shell unconfirmed, flagged
- Floating/overlay definitions: ModalShell (reference only, Phase 3 adopts),
  dropdown treatment (new definition, Phase 3 adopts)
