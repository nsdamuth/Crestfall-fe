# Home LOOM package

**Contract:** `Home.contract.js` (v1.0.0)

## Purpose

Home, ruled 10 Aug 2026 (`docs/CRESTFALL-DESIGN-CONTEXT.md`): a
guidepost that routes, not a dashboard and not an editorial front
page. Full ruling and Sprint G build gate: `docs/SPRINT-G-PLAN.md`
section 1. Build address `/studio/v2/home` (route law, cutover
sequence). Fixture-driven only, pre-parity: no fetch, no
services-api, no product data.

## Boundary

```text
Home.jsx (Shell, ../Home.jsx)
  -> owns Next.js router (useRouter), passes onNavigate
  -> useHomeViewModel.js
      -> reads homeContent.mock.js (CR-029 stand-in feed)
      -> owns like/save/follow toggles, sort selection, the R4 notice
  -> Home.view.jsx
      -> KitStudioPageView (bannerSlot = bottom banner, children = rest)
      -> KitPromoBannerView x3 (top, card, bottom treatments)
      -> KitDestinationTileView x8
      -> KitRailView x4 (creation-card / creator-card children,
         KitDropdownView seated in the top rail's head control slot only)
      -> FixtureActionNotice (shared staging scaffold, honest stub)
```

The View is presentation only: every `onX` callback is supplied by
the ViewModel, which itself never imports `next/navigation` (the
Shell owns that boundary, per `docs/CRESTFALL-DESIGN-CONTEXT.md`'s
LOOM shape).

## Composition order, ruled and exhaustive

Medium top banner (promo-banner `top` treatment, galaxy layer on) ->
Continue strip (renders nothing when nothing is in progress) -> eight
destination tiles, one per other section, in journey order -> four
`KitRail` instances (top rated, recently added, from the community,
creators to follow), the top rail alone seating the sort dropdown ->
medium bottom banner (`bottom` treatment) routing to Stories. No
filter line, no local search; the sort control is Home's one control
beyond navigation.

## Destination tiles, routing

Five of the eight route to their live `/studio/v2/<page>` address
(Stories, Images, Vault, Community, Creators). Three route nowhere
yet (Studio, Adventures, Lore are not built): tapping those opens the
R4 fixture-action notice instead of navigating, an honest stub rather
than a dead link or a fabricated page.

## Empty-state laws

- **Continue strip.** Empty renders nothing at all (no wrapper, no
  placeholder), matching the rail precedent.
- **Rails.** Empty-rail law (`docs/BUILD-BLUEPRINT.md` 2.18): a rail
  with nothing in it renders nothing at all, head included. `KitRail`
  enforces this itself; the ViewModel only ever passes an empty
  `items` array, never renders a placeholder card.

## CR-029, open

`homeContent.mock.js` stands in for CR-029 (Home feed data: the four
rails and the Continue strip), filed at the Sprint G planning gate,
open with Nick, non-blocking. Content reuses the existing
creation-card, creator-card, and destination-tile kit fixtures rather
than inventing new draft art or copy, per the ruled precedent that
KitRail "holds existing cards; no card-level work is needed."

## Package assets

- `Home.contract.js`
- `Home.fixtures.js` (full page, empty Continue, empty rails)
- `useHomeViewModel.js`
- `homeContent.mock.js`
- `/dev/ui-preview/home-v2-page`
