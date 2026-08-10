# Kit Creation Card LOOM Package

**Contract:** `KitCreationCard.contract.js`

## Purpose

The shared creation card ratified in `docs/BUILD-BLUEPRINT.md`
section 2.6, grid (art-bleed) and list (row) layouts, built against
`docs/RESTYLE-RULES.md` Cards and the CSV witnesses for image actions
(image-studio, image-library, story-rooms). Image actions are scoped
strictly to what exists in the inventory today: clicking the image and
using the Expand quick action both open the same destination, so both
call `onOpen`; Share is always icon plus the word "Share", never
icon-only, per the ruled Share controls law.

## Boundary

```text
KitCreationCard.jsx
  -> useKitCreationCardViewModel.js
  -> KitCreationCard.view.jsx
      -> KitBadge.view.jsx (tag row)
```

- The ViewModel validates `layout` and every badge variant against
  the constrained sets, coerces stat values to a number or `null`,
  and defends every callback.
- The portable View owns grid vs list composition, the stat-row icon
  order (plays, hearts, saves, followers, per Ruling 4), and the
  destructive-action law for Delete.
- The caller owns the real creation record, media reactions, and
  navigation; it reports every action through the semantic callbacks
  only.

## Deferred, flagged

Delete follows the destructive law (quiet ghost, `--status-danger`
word; a confirm step, filled red, before anything happens) but the
confirm step here is an inline two-click disclosure
(presentation-only local state, per the LOOM view hard rules) rather
than the unified modal frame the law calls for. The `modal-frame` kit
piece (section 2.5) is not part of kit batch 1; this card's confirm
step is a placeholder until that package ships and the card is
converted to use it. Flagged, not silently resolved.

## States

Card surface: rest, hover (grid lifts and glows; list borders to the
shared hover-line state token), focus-within, pressed (state-token
flash), disabled (state-token opacity, `pointer-events-none`). Every
quick action button (Like, Bookmark, Expand, Share, Download, Delete)
carries its own five states.

## Package assets

- `KitCreationCard.contract.js`
- `KitCreationCard.fixtures.js`
- `useKitCreationCardViewModel.js`
- `/dev/ui-preview/kit-creation-card`

The preview is fixture-only; every action only updates local preview
state or logs to the action log, never a real reaction, save, or
delete.
