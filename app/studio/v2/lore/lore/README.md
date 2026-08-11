# Lore LOOM package

**Contract:** `Lore.contract.js` (v1.1.0)

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
      -> LoreCreateModal (page-local, mounted only while open):
         KitModalFrame -> KitAlertStripView (neutral, review notice)
         -> KitFormFieldView x2 (Title, World or faction) -> a
         page-local textarea (Lore's body; KitFormField's type enum
         has no multi-line variant and the package is not touched by
         this pass) -> Cancel / Submit for review
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
lore." It opens a creation modal composed on `modal-frame` with
`KitFormField` fields (Title, World or faction) and a `KitAlertStrip`
approval notice, per `docs/SPRINT-G-PLAN.md` section 4. Wired during
Sprint H integration (`design/sprint-h-integration`, 10 Aug 2026) now
that wave H2a (form-field) and wave H2c (alert-strip) have landed;
neither kit package is edited by this wiring pass.

The modal itself is fully live: open, fill, close (backdrop, Escape,
close control, or Cancel all reset the fields), and a required-title
validation on Submit. What still stubs, honestly, is the submission
destination: there is no services-api or approval pipeline to submit
to yet (CR-015 stays open with Nick, non-blocking). Submit for review
closes the modal and opens the shared R4 fixture-action notice instead
of persisting anything, per the HIDE/STUB law
(`docs/FRONTEND-SOP.md` section 5).

The body field is a page-local `<textarea>`, not a `KitFormField`:
the package's `type` enum (`"text"|"search"|"email"|"password"|
"number"`) has no multi-line variant, and `components/kit/form-field/`
is out of this wiring pass's file set. Styled to the same field
tokens as `KitFormField`'s own input bed so it reads as one field
family; flagged for a future kit pass if a multi-line field type is
ever warranted more broadly.

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
