# Media History Grid

## Purpose

Provides the generated-media catalogue inside Image Studio while separating
reaction loading, output deletion, bulk-selection rules, and legacy payload
normalization from the portable masonry-grid Skin.

## Feature structure

```text
MediaHistoryGrid.jsx
MediaHistoryGridSkin.jsx
media-history-grid/
  MediaHistoryGrid.view.jsx
  useMediaHistoryGridViewModel.js
  mediaHistoryVisibility.js
  MediaHistoryGrid.contract.js
  MediaHistoryGrid.fixtures.js
  mediaHistoryGridDiagnostics.mjs
  README.md
```

`MediaHistoryGrid.jsx` remains the existing Binding Shell. Through
`MediaHistoryGridSkin.jsx` (split out 6 Sep 2026 so a page can call the
ViewModel itself) it injects `FilterPill`, `MediaTileQuickActions`, and
`MediaLightbox` into the View.

`mediaHistoryVisibility.js` (AF5, 14 Sep 2026) holds the filter model
and the two pure list steps, the Library filter and folder membership,
so the diagnostics run them; the ViewModel re-exports the model helpers
by name and adds the search step.

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
- folder membership (`folderItemIds`, AF5), applied after the Library
  filter and before the search terms
- load-more callback projection

The bulk actions themselves (Add to folder, Download, Delete, Done) are
the one Kit selection bar (`components/kit/selection-bar`, ASSET-FOLDERS
AF4 and AF5, 14 Sep 2026), composed by the page against these handlers
by name; the View's former bulk section and its bulk deletion confirm
are gone (contract 1.5.0). The legacy `/studio/image-studio` page keeps
Select mode and the per-card check with no bulk action until it takes
the same bar.

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
