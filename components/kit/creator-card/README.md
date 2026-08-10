# Kit Creator Card LOOM Package

**Contract:** `KitCreatorCard.contract.js`

## Purpose

New kit piece per `docs/BUILD-BLUEPRINT.md` section 2.13 (RULED
9 Aug 2026), synthesized from the legacy proof's rich creator card
(`creators.html` `.crt--rich`, Inspiration appendix): identity, up to
three recent-work thumbnails, and two actions. Structure adopted,
visual style re-expressed in tokens.

## Boundary

```text
KitCreatorCard.jsx
  -> useKitCreatorCardViewModel.js
  -> KitCreatorCard.view.jsx
```

- The ViewModel defends every field, clamps `thumbnails` to the ruled
  maximum of three, and coerces stat values to a number or `null`.
- The portable View owns the avatar, stat row (reusing the same
  plays/followers/works icon language as the media card, Ruling 4),
  the thumbnail strip, and the two action buttons.
- The caller owns the real creator record, the follow API, and
  navigation; it reports intent through `onThumbnailOpen`, `onFollow`,
  and `onViewProfile` only.

## Ruled destinations

Every thumbnail routes to the image overlay (`onThumbnailOpen`,
section 2.14), never the asset detail popup: a creator's recent-work
thumbnail is always a rendered image.

## Shape law correction on adoption

The proof's Follow / View profile pair renders as pills
(`.btn--sm.btn--ghost`). The corners final ruling already reserves
pill shapes for tags and icon buttons; this package renders both as
soft-cornered rectangles (`--radius-md`) from the start, not a later
fix.

## States

Card surface rest/hover/focus-within. Each thumbnail and both buttons
carry their own five states; Follow additionally carries a
following/not-following visual (filled gold vs ghost).

## Package assets

- `KitCreatorCard.contract.js`
- `KitCreatorCard.fixtures.js`
- `useKitCreatorCardViewModel.js`
- `/dev/ui-preview/kit-creator-card`

The preview is fixture-only.
