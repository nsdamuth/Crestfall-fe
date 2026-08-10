# Kit Load More LOOM Package

**Contract:** `KitLoadMore.contract.js`

## Purpose

The load-more pagination control ratified in
`docs/BUILD-BLUEPRINT.md` section 2.4 and
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 3.4: no infinite
scroll, an initial batch renders then this control appends the next
one, so the page footer and the journey banner stay reachable.

## Boundary

```text
KitLoadMore.jsx
  -> useKitLoadMoreViewModel.js
  -> KitLoadMore.view.jsx
```

- The ViewModel defends every prop and treats a missing `hasMore` as
  true (there is more until told otherwise).
- The portable View consumes the shared `.cf-btn`/`.cf-btn--secondary`
  recipe from `app/design-system.css` directly rather than
  reimplementing it, so it never drifts from the button system.
- The caller owns pagination, cursors, and the fetch itself; it
  reports intent through `onLoadMore` only.

## States

Rest, hover, focus (global rule), pressed
(`--state-pressed-fill` on `:active`), disabled (`.cf-btn:disabled`
opacity, applied automatically while loading). Two content states:
loading (spinner plus the word "Loading", control disabled) and
exhausted (the button is replaced entirely by a quiet ink-dim line,
never shown alongside the button).

## Package assets

- `KitLoadMore.contract.js`
- `KitLoadMore.fixtures.js`
- `useKitLoadMoreViewModel.js`
- `/dev/ui-preview/kit-load-more`

The preview is fixture-only; clicking Show More only cycles local
preview state.
