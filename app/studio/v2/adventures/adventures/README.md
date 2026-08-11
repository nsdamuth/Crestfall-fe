# Adventures LOOM package

**Contract:** `Adventures.contract.js` (v1.0.0)

## Purpose

Adventures (`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 4.3): discovery of
published Adventures plus the on-ramp to authoring one. Full ruling
and Sprint H build gate: `docs/SPRINT-H-PLAN.md` section 5.6 (wave
H4), carrying `docs/SPRINT-G-PLAN.md` section 3's ruled page plan
unchanged. Build address `/studio/v2/adventures` (route law, cutover
sequence). Fixture-driven only, pre-parity: no fetch, no
services-api, no product data. Smallest surface of the nine pages
(six CSV rows per SPRINT-G-PLAN.md 3.1).

## Boundary

```text
Adventures.jsx (Shell, ../Adventures.jsx)
  -> owns Next.js router (useRouter), passes onNavigate
  -> useAdventuresViewModel.js
      -> reads adventuresContent.mock.js (CR-023 stand-in feed)
      -> owns like/save toggles, search, sort, load-more paging,
         the builder-modal open flag, the R4 notice
  -> Adventures.view.jsx
      -> KitStudioPageView (filterBarSlot = filter bar,
         bannerSlot = bottom banner, children = rest)
      -> KitPromoBannerView x2 (top, bottom treatments)
      -> KitStudioFilterBarView (search + sort only, no type facet:
         the catalog is Adventures-only)
      -> KitCreationCardView xN (the visible catalog page)
      -> KitLoadMoreView
      -> KitModalFrame, mounted only while the builder is open,
         wrapping the existing StorylineBuilderShell unmodified
      -> FixtureActionNotice (shared staging scaffold, honest stub)
```

The View is presentation only: every `onX` callback is supplied by
the ViewModel, which itself never imports `next/navigation` (the
Shell owns that boundary, per `docs/CRESTFALL-DESIGN-CONTEXT.md`'s
LOOM shape).

## Composition order, ruled and exhaustive

Top banner (promo-banner `top` treatment) with the build CTA -> the
sticky filter bar (search plus sort; no type facet, the page is
Adventures-only) -> the creation-card grid, the public Adventure
catalog, load-more paginated -> bottom banner (`bottom` treatment)
routing to Studio. The rehosted builder opens as a `modal-frame`
overlay from the top banner's CTA, independent of page flow order.

## The rehosted Adventure builder

`components/studio/storylines/StorylineBuilderShell.jsx` is consumed
unmodified, wrapped in `KitModalFrameView`. Its contract, ViewModel,
and data flow (including its live `createStorylineDraft` call and its
own `useRouter` navigation on save) are untouched, per the ruled
contract-law risk (`docs/FRONTEND-SOP.md` section 13): the builder's
contracts must not change, and this page never attempts to. Closing
the modal is owned by this page (`onCloseBuilder`); the builder's own
save flow still navigates to `/studio/my-creations/[id]/edit` on
success, unchanged from its standalone address.

## Display naming

Catalog subtitles route through
`lib/shared/presentation/terminology.js`'s
`getCreationTypeDisplayName("STORYLINE")` (`"Adventure"`), consumed
read-only. Backend naming (`STORYLINE`) is never touched.

## Empty-state laws

- **Catalog.** Empty renders a message, not a fabricated placeholder
  card, matching the ruled empty-rail precedent from Home
  (`docs/BUILD-BLUEPRINT.md` 2.18).
- **Load more.** No infinite scroll; an initial batch renders, then
  the control appends the next batch on request
  (`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 3.4).

## CR-023, open

`adventuresContent.mock.js` stands in for CR-023 (the Adventures feed
question, non-blocking for a fixture-driven build per
`docs/SPRINT-G-PLAN.md` section 3). Content reuses the existing
creation-card fixture art and copy conventions rather than inventing
new draft assets, the same precedent `homeContent.mock.js` follows
for CR-029.

## Package assets

- `Adventures.contract.js`
- `Adventures.fixtures.js` (default, empty catalog, longest content)
- `useAdventuresViewModel.js`
- `adventuresContent.mock.js`
- `/dev/ui-preview/adventures-v2-page`
