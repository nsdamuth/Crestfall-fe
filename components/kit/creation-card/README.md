# Kit Creation Card LOOM Package

**Contract:** `KitCreationCard.contract.js` (v2.0.0)

## Purpose

The synthesized media card template ratified in
`docs/BUILD-BLUEPRINT.md` section 2.6 (RULED 9 Aug 2026, superseding
the kit-batch-1 draft): one image-first grid template, with variants
only for the list layout and the no-image fallback. Built against
`docs/RESTYLE-RULES.md` Cards and the legacy proof's `.lcard` recipe
(Inspiration appendix), never lifted verbatim.

## Boundary

```text
KitCreationCard.jsx
  -> useKitCreationCardViewModel.js
  -> KitCreationCard.view.jsx
      -> KitBadge.view.jsx (tag row)
```

- The ViewModel validates `layout`, `assetKind`, and every badge
  variant against their constrained sets, coerces stat values to a
  number or `null`, and defends every callback.
- The portable View owns grid (image-first, title/meta/stats over the
  art on a bottom scrim) vs list (row) composition, the stat-row icon
  order (plays, hearts, saves, followers, per Ruling 4), and the
  destructive-action law for Delete.
- The caller owns the real creation record, media reactions, and
  navigation; it reports every action through the semantic callbacks
  only.

## Two ruled click destinations

Image click and the Expand quick action both resolve through the
card's `assetKind`:

- `assetKind: "image"` calls `onOpenImageOverlay` (2.14, `KitImageOverlay`).
- `assetKind: "character" | "story" | "adventure"` calls
  `onOpenAssetDetail` (2.15, specced only, not built this batch).

## Deferred, flagged

Delete follows the destructive law (quiet ghost, `--status-danger`
word; a confirm step, filled red, before anything happens) but the
confirm step here is an inline two-click disclosure
(presentation-only local state, per the LOOM view hard rules) rather
than the unified modal frame the law calls for. The `modal-frame` kit
piece (section 2.5) is still not part of this batch; this card's
confirm step is a placeholder until that package ships.

The asset detail popup destination has no real component yet
(section 2.15); `onOpenAssetDetail` is a plain callback the page wires
to a marked placeholder this batch, never a real popup.

## States

Card surface: rest, hover (grid: 1.04 image scale plus lift and glow;
list: border to the shared hover-line state token), focus-within,
pressed (state-token flash), disabled (state-token opacity,
`pointer-events-none`). Every quick action button (Like, Bookmark,
Expand, Share, Download, Delete) carries its own five states.

## Package assets

- `KitCreationCard.contract.js`
- `KitCreationCard.fixtures.js`
- `useKitCreationCardViewModel.js`
- `/dev/ui-preview/kit-creation-card`

The preview is fixture-only; every action only updates local preview
state or logs to the action log, never a real reaction, save, or
delete.
