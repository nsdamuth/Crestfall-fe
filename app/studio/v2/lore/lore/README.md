# Lore LOOM package

**Contract:** `Lore.contract.js` (v1.0.0)

## Purpose

Lore (`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 4.9): the platform's
public editorial face, built on the existing lore infrastructure
restyled to the new UX. Journey: read the world, write into it, and
let the best of it become part of play. Full ruling and Sprint H
build gate: `docs/SPRINT-H-PLAN.md` section 5.7 (wave H3), carrying
`docs/SPRINT-G-PLAN.md` section 4's ruled page plan unchanged. Build
address `/studio/v2/lore` (route law, cutover sequence).
Fixture-driven only, pre-parity: no fetch, no services-api, no
product data. Existing lore reading routes (the public archive)
stand untouched, per the standing ruling; nothing outside this
package's file set was edited.

## Boundary

```text
Lore.jsx (Shell, ../Lore.jsx)
  -> owns Next.js router (useRouter), passes onNavigate
  -> useLoreViewModel.js
      -> reads loreContent.mock.js (stand-in feed: community archive
         plus one creator's own drafts)
      -> owns like/save toggles, search, the three filter groups
         (approval state, world or faction, recency), the community
         grid's load-more paging, the R4 notice
  -> Lore.view.jsx
      -> KitStudioPageView (headerAlign="center", filterBarSlot =
         filter bar, bannerSlot = bottom banner, children = rest)
      -> KitPromoBannerView x2 (top, bottom treatments)
      -> KitStudioFilterBarView (search plus the three ruled facets;
         no separate sort)
      -> two centered section labels (Community Lore, Your Lore)
      -> KitCreationCardView xN per section
      -> KitLoadMoreView (community section only)
      -> FixtureActionNotice (shared staging scaffold, honest stub)
```

The View is presentation only: every `onX` callback is supplied by
the ViewModel, which itself never imports `next/navigation` (the
Shell owns that boundary, per `docs/CRESTFALL-DESIGN-CONTEXT.md`'s
LOOM shape).

## Composition order, ruled and exhaustive

Top banner (promo-banner `top` treatment) with the write-lore CTA ->
the sticky filter bar (search plus approval state, world or faction,
and recency, the three ruled facets, `docs/CRESTFALL-PRODUCT-MODEL-
UXUI.md` 3.1; no separate sort) -> centered editorial section labels,
the one page in the set that centers them -> the Community Lore
grid (the public archive, load-more paginated) -> Your Lore (one
creator's own drafts, every approval state, shown in full, no
paging) -> bottom banner (`bottom` treatment) routing to Home, the
loop's closing banner.

## Item 39, RULED 10 Aug 2026

The write-new-lore action is the top banner CTA, reading "Write
lore." Its real destination (`docs/SPRINT-G-PLAN.md` section 4: a
creation modal composed on `modal-frame` with `KitFormField` fields
and `KitAlertStrip` approval notices) needs both kit packages; wave
H2a (form-field) and wave H2c (alert-strip) have not landed at the
time this wave ran (checked: neither `components/kit/form-field/`
nor `components/kit/alert-strip/` exists in this tree). Per the R4
HIDE/STUB law (`docs/FRONTEND-SOP.md` section 5), the CTA opens the
honest stub notice instead: press acknowledged, destination stated,
nothing opened. STOPPED, not built: the creation modal itself.
Re-run this unit once H2a and H2c land to wire the real modal.

## The centered-label seat

`KitStudioPageView` gained an additive `headerAlign` prop (v1.0.0 to
v1.1.0, `components/kit/studio-page/`) for exactly this page: "left"
(default, every other consumer unchanged) or "center". Lore composes
its own centered heading content (eyebrow, title, description) as
page-local `headerSlot` children rather than reusing
`StudioPageHeaderView` (a different package, `components/studio/
studio-page-header/`, out of this wave's file set and hardcoded
left-aligned internally). The two grid section labels (Community
Lore, Your Lore) are page-local centered `<p>` elements, not a kit
seat; nothing else in the kit was touched for them.

## KitCreationCard's assetKind, a non-blocking note

Lore's cards pass `assetKind: "lore"`, a value not yet in
`KitCreationCard.contract.js`'s documented enum
(`"image"|"character"|"story"|"adventure"`). The View's open-handler
resolver only special-cases `assetKind === "image"`
(`resolveOpenHandler`, `KitCreationCard.view.jsx`); every other value,
including `"lore"`, routes to `onOpenAssetDetail`, so this behaves
correctly with zero edits to `components/kit/creation-card/` (out of
this wave's file set). Flagged for H6 as a documentation-only
contract note, not a required contract change.

## Data

`loreContent.mock.js`: a stand-in feed, same precedent as Home's
`homeContent.mock.js` (CR-029) and Adventures'
`adventuresContent.mock.js` (CR-023). Seven Community items (mixed
approval state, one Canon, some no-art) and three Mine items (every
approval state represented: pending, approved, canon). No CR filed
this wave; CR-015 (pipeline confirmation) stays open with Nick,
non-blocking, per `docs/SPRINT-G-PLAN.md` section 4.
