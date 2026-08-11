# Kit Studio Page LOOM Package

**Contract:** `KitStudioPage.contract.js`

## Purpose

The studio-v2 page skeleton, ratified as the content width law
(docs/BUILD-BLUEPRINT.md 2.16(l), R1). One content width per page:
heading block, sticky filter line, card grid and list, load-more, and
bottom promo banner share the same left and right edges, flush to
StudioShell's own section padding, at every width, both layouts.

## The law

One content width per page. The shell's section padding is the only
horizontal margin. A consumer that adds max-width, mx-auto, or
horizontal padding around a slot is out of contract. No max-width
cap, no second padding layer, no element in a narrower column than
the filter line.

## Boundary

```text
KitStudioPage.jsx
  -> useKitStudioPageViewModel.js
  -> KitStudioPage.view.jsx
```

Rendered anatomy: root `flex flex-col gap-[var(--space-6)]
py-[var(--space-6)]`; slots render in order harness, header, filter
bar, a `flex flex-col gap-[var(--space-6)]` content block around
`children`, banner. No horizontal class anywhere in the view.

`filterBarSlot` renders as a direct child of the root with no
wrapper: `KitStudioFilterBarView` carries its own negative margins to
cancel the shell's section padding for its full-bleed background, and
its inner padding mirrors that same padding token for token,
breakpoint keyword for breakpoint keyword
(`px-[var(--space-5)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]`),
so nothing may sit between this slot and the root.

## R2, the banner

With the law above, the bottom promo banner spans the full content
width by construction: it is a block-level slot of the one column. Its
fixed per-treatment proportions (`KitPromoBannerView`) scale
responsively and are never narrower or shorter than the content
above.

## R6, the heading block

`StudioPageHeaderView` left-aligns eyebrow, title, and description
with no centering; inside this column its `border-b` separator spans
the full content width by construction.

## The headerAlign seat (v1.1.0, additive)

Lore (`docs/SPRINT-H-PLAN.md` section 5.7, wave H3) is the one page
in the set that centers its editorial section labels. `headerAlign`
("left" | "center", default "left") wraps `headerSlot` in a
`flex flex-col items-center text-center` column when "center";
default "left" renders exactly what v1.0.0 rendered, so every
existing consumer is unchanged. This does not touch
`StudioPageHeaderView` (a different package, `components/studio/
studio-page-header/`); Lore composes its own centered heading content
as page-local `headerSlot` children instead of reusing that
component's hardcoded left-aligned internals.

## Package assets

- `KitStudioPage.contract.js`
- `KitStudioPage.fixtures.js` (default, noBanner, longestContent)
- `useKitStudioPageViewModel.js`
- `/dev/ui-preview/kit-studio-page`

The `longestContent` fixture proves the sticky filter slot docks
while scrolling past tall content.
