# LOOM Navigation Portability Hardening

This hardening pass removes the remaining direct `next/link` imports from 16 portable Views (`.view.jsx` files) without changing their destinations or presentation.

## Boundary

Each affected portable View accepts:

```text
LinkComponent
```

The portable default is the native `"a"` element so fixtures, extracted UI
packages, and development previews can render without Next.js. The Crestfall
Binding Shell imports `next/link` and injects it as `LinkComponent` for
production client-side navigation.

Three composition paths also forward the injected primitive to a directly
embedded portable child:

```text
AccountStubPageView -> StudioBackLinkView
LoreBuilderView -> LoreDocumentRendererView
OfficialCharactersGridView -> StudioCharacterCardView
```

## Invariants

- Routes and href values are unchanged.
- Existing click handlers, targets, rel values, classes, and card content are unchanged.
- No ViewModel, API, persistence, database, or storage contract changes.
- No feature count is added; this closes a portability gap in already-counted features.

## Diagnostic

```bash
npm run diagnostics:loom:navigation-portability
```

## Development preview

```text
/dev/ui-preview/navigation-portability
```

The audit preview is development-only, uses a local injected link component,
and performs no product-data reads or writes.
