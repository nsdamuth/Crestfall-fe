# Kit Art Placeholder LOOM Package

**Contract:** `KitArtPlaceholder.contract.js` (v1.0.0)

## Purpose

The shared empty-art-slot mark: a geometric gold line-art camellia,
centered on the elevated surface token (`--surface-2`). RULED
11 Aug 2026 (Sprint H render review, item 5): any empty art slot in
scope (creator profile showcase, quick-create previews, reference
slots, card/tile art fallbacks) renders this mark, never a blank box.
Nothing may look unfinished. New package, contract authorized none to
1.0.0 at this gate.

## Boundary

```text
KitArtPlaceholder.jsx
  -> useKitArtPlaceholderViewModel.js
  -> KitArtPlaceholder.view.jsx
```

- The ViewModel defends `size` to one of `sm` / `md` / `lg`, defaulting
  `md`.
- The View is presentation only: the mark and its `--surface-2`
  ground, nothing else. It renders no tap target, no caption, no
  layout beyond centering itself in whatever frame the caller supplies.
- The caller owns the slot's aspect ratio, corner radius, and border;
  this package fills the slot's interior only.

## Mark

Six overlapping petal ellipses radiating from a center ring, stroke
only (`--gold-ornament`), never filled except the smallest center
dot. Geometric, not photographic, matching the "line-art" ruling.

## New tokens

None. Uses `--surface-2`, `--gold-ornament`, `--space-6/10/12`, all
already locked.

## Package assets

- `KitArtPlaceholder.contract.js`
- `KitArtPlaceholder.fixtures.js` (`sm` / `md` / `lg`)
- `useKitArtPlaceholderViewModel.js`
- `/dev/ui-preview/kit-art-placeholder`

## Consumers

- Creator profile showcase empty slots
  (`app/studio/v2/creators/creator-profile/`)
- Quick-create preview pre-generation slot
  (`components/studio/create/character/character-preview/`)
- Card/tile art fallbacks
  (`components/kit/creation-card/`, `components/kit/destination-tile/`)
