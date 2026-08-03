# Media History Grid

## Purpose

Provides the generated-media catalogue inside Image Studio while separating
reaction loading, output deletion, bulk-selection rules, and legacy payload
normalization from the portable masonry-grid Skin.

## Feature structure

```text
MediaHistoryGrid.jsx
media-history-grid/
  MediaHistoryGrid.view.jsx
  useMediaHistoryGridViewModel.js
  MediaHistoryGrid.contract.js
  MediaHistoryGrid.fixtures.js
  mediaHistoryGridDiagnostics.mjs
  README.md
```

`MediaHistoryGrid.jsx` remains the existing Binding Shell. It injects
`FilterPill`, `MediaTileQuickActions`, and `MediaLightbox` into the View.

## Chassis ownership

The ViewModel owns:

- image-output ID and stored-dimension aliases
- reaction loading and optimistic Like/Bookmark persistence
- deleted-output suppression
- media type/reaction filtering
- mobile filter and grid state
- preview selection
- single-image deletion confirmation and persistence
- multi-select state and visible Select All behavior
- concurrency-limited bulk deletion and partial-failure recovery
- load-more callback projection

## Portable Skin ownership

The View owns the responsive controls, masonry measurement, pending/error/media
cards, selection presentation, loading/empty/error messages, and injected
application slots. It does not import Crestfall clients, interpret PostGraphile
or image-generation envelopes, or perform destructive actions.

## Shared application controls

- `FilterPill`
- `MediaTileQuickActions`
- `MediaLightbox`

## Isolated preview

```text
/dev/ui-preview/media-history-grid
```

The preview is unavailable in production. Like, Bookmark, and Delete actions
exercise the real Binding Shell, so persistence actions still use the normal
application clients.

Mechanics Module field decomposition remains deferred until the final
cumulative LOOM reassessment.
