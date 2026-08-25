# Media Tile Quick Actions

## Purpose

Provides the shared hover/focus controls used by media cards to Like,
Bookmark, and Expand an image while keeping media identity, persistence,
optimistic updates, and lightbox routing outside the portable Skin.

Token cleanup, 22 Aug 2026 (ED1F propagation plan group G3): the button
recipe's raw literal colors (`white/10`, `black/60`, `pink-400`) are
replaced with the ratified token set, the same active/quiet recipe
`KitImageOverlay` and `MediaLightbox` use for their own icon rows.
Presentation-only; no prop change, contract stays `1.0.0`.

## Feature structure

```text
MediaTileQuickActions.jsx
media-tile-quick-actions/
  MediaTileQuickActions.view.jsx
  useMediaTileQuickActionsViewModel.js
  MediaTileQuickActions.contract.js
  MediaTileQuickActions.fixtures.js
  mediaTileQuickActionsDiagnostics.mjs
  README.md
```

`MediaTileQuickActions.jsx` remains the existing Binding Shell and public
application import path.

## Public application props

```text
liked
bookmarked
onToggleLike()
onToggleBookmark()
onExpand()
```

The ViewModel normalizes these application props into display-ready labels,
active states, and semantic View callbacks.

## Portable Skin ownership

The View owns:

- Like, Bookmark, and Expand button presentation
- active and inactive icon styling
- hover and focus visibility
- accessible labels and titles
- prevention of parent-card navigation when an action is selected

The View does not:

- call media reaction APIs
- know media or creation identifiers
- manage optimistic updates or rollback
- open a lightbox or route to another page
- interpret image-library, history, or Creation payloads

## Shared consumers

The unchanged public shell remains consumed by:

- Creation Profile media tiles
- Image Studio media history
- Creation Image Library cards

## Isolated preview

```text
/dev/ui-preview/media-tile-quick-actions
```

The route is unavailable in production and does not call an API or persist a
reaction.

Mechanics Module field decomposition remains deferred until the final
cumulative LOOM reassessment.
