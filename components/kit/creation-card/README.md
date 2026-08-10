# Kit Creation Card LOOM Package

**Contract:** `KitCreationCard.contract.js` (v3.0.0)

## Purpose

The media card template under the card law of 9 Aug 2026
(`docs/BUILD-BLUEPRINT.md` 2.6 as amended by 2.16(a)): full-bleed art
in BOTH layouts, no bottom action bar anywhere. The legacy proof
never carried a face action bar (`docs/MOCKUP-DECISIONS.md`, card
treatments); this revision removes the one the kit batch invented.

## Boundary

```text
KitCreationCard.jsx
  -> useKitCreationCardViewModel.js
  -> KitCreationCard.view.jsx
      -> KitBadge.view.jsx (badge row, over-art recipe)
```

- The ViewModel validates `layout`, `assetKind`, `actionPlacement`,
  and badge variants against their constrained sets, coerces stats,
  and defends every callback.
- Grid: 3/4 full-bleed art, bottom fade composed from `--canvas`,
  title/meta/stats over the art, badges top-left.
- List: wide full-bleed art row (5/2 at phone, 16/5 at 700px and up),
  left-anchored fade (the card-banner veil direction), text left,
  actions trailing. Two-up at desktop is the consuming grid's call
  (list density law 2.16(g)).
- The caller owns the record, reactions, and navigation.

## Face actions

Exactly three overlay icons: like, save, expand. They reveal on
hover/focus at fine pointers and stay visible at coarse pointers
(mobile law). Share, download, and delete live inside the open
destination: Ruling 6 and the destructive law both require their
words, and worded controls have no home on a full-bleed face.

## Brian's pick: actionPlacement

Both credible grid placements ship side by side in fixtures and the
preview: `overlay-top` (icons top-right over the art) vs `scrim-row`
(icons bottom-right in the scrim band beside the title). Witnesses
for each are recorded in `docs/MOCKUP-DECISIONS.md`.

## Two ruled click destinations

Unchanged: `assetKind: "image"` calls `onOpenImageOverlay` (2.14);
`character | story | adventure` call `onOpenAssetDetail` (2.15,
still a marked placeholder this batch).

## Tag economy

Enforced by the data a caller passes (2.16(c)): Canon always;
visibility badges only in own-work contexts (see the own-work
fixture); never a badge restating an active filter.

## States

Card surface: rest, hover (1.04 image scale plus lift and glow),
focus-within, pressed, disabled. Every overlay action carries its own
five states plus the active toggle treatment.

## Package assets

- `KitCreationCard.contract.js`
- `KitCreationCard.fixtures.js` (draft-asset art from
  `public/tmp-mockup-images/`, gitignored interim fixtures)
- `useKitCreationCardViewModel.js`
- `/dev/ui-preview/kit-creation-card`

Fixture-only; every action updates local preview state, never a real
reaction or save.
