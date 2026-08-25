# Home LOOM package

**Contract:** `Home.contract.js` (v2.0.0)

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
      -> KitPromoBannerView x2 (top, bottom treatments)
      -> KitDestinationTileView x8
      -> KitRailView x4 (creation-card / creator-card children,
         KitDropdownView seated in the top rail's head control slot only)
      -> FixtureActionNotice (shared staging scaffold, honest stub)
```

The View is presentation only: every `onX` callback is supplied by
the ViewModel, which itself never imports `next/navigation` (the
Shell owns that boundary, per `docs/CRESTFALL-DESIGN-CONTEXT.md`'s
LOOM shape).

## Composition order, ruled and exhaustive (seven surfaces)

RULED 10 Aug 2026 (Home fix wave, `docs/SPRINT-H-PLAN.md` 1a): one
top banner (promo-banner `top` treatment, galaxy layer always on),
the continue surface -> eight destination tiles, one per other
section, in journey order -> four `KitRail` instances (top rated,
recently added, from the community, creators to follow), the top
rail alone seating the sort dropdown -> medium bottom banner
(`bottom` treatment) routing to Stories. No filter line, no local
search; the sort control is Home's one control beyond navigation.

The separate card-treatment Continue strip is REMOVED. The one top
banner is now the continue surface: with an item in progress
(`continueItem` set) the banner shows eyebrow "Continue", the item's
title, a "Last played" supporting line, CTA "Continue" wired to the
item's resume callback, and the item's own art (falling back to the
hero art when the item has none). With nothing in progress the
banner falls back to the general hero (the existing
eyebrow/title/CTA content on the Eden artwork). This logic lives in
`Home.view.jsx`, which chooses between the two supplied prop sets;
`KitPromoBannerView` itself is unchanged and unaware of Home's
continue state.

## Destination tiles, routing

Five of the eight route to their live `/studio/v2/<page>` address
(Stories, Images, Vault, Community, Creators). Three route nowhere
yet (Studio, Adventures, Lore are not built): tapping those opens the
R4 fixture-action notice instead of navigating, an honest stub rather
than a dead link or a fabricated page.

## Empty-state laws

- **Continue.** Empty (`continueItem` null) is not a missing surface;
  the one top banner falls back to the general hero content and art,
  never a placeholder.
- **Rails.** Empty-rail law (`docs/BUILD-BLUEPRINT.md` 2.18): a rail
  with nothing in it renders nothing at all, head included. `KitRail`
  enforces this itself; the ViewModel only ever passes an empty
  `items` array, never renders a placeholder card.

## Banner art, RULED 10 Aug 2026 (Home fix wave, `docs/SPRINT-H-PLAN.md` 1b/1c)

Both banners' stand-in art moved off shared creator-tile crops onto
art located in the crestfall-main sibling checkout's hero mockup
(`Crestfall/out/draft-site/proof/studio-home.html`), copied per the
sample-art mechanism (`docs/FRONTEND-SOP.md` section 7): resized to
1280px wide, compressed, placed in
`public/tmp-mockup-images/canon-character-images/`, filenames added
to the `.gitignore` allowlist.

- Top banner (general-hero fallback): `lilith-lux-eden-confrontation.png`,
  the Eden confrontation art (source: `lilith-lux-eden-confrontation.png`,
  `crestfall-design-system/assets/`).
- Bottom banner: `athelgard-ampitheater-profile.png`, the Aethelgard
  amphitheater art, landscape orientation (source filename kept for
  traceability).

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
