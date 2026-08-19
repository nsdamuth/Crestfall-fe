# Creation Profile Page LOOM package

## Boundary

```text
CreationProfilePage.jsx                         Binding Shell
creation-profile-page/
  CreationProfilePage.view.jsx                  Portable Skin
  useCreationProfilePageViewModel.js            ViewModel / Chassis
  CreationProfilePage.contract.js
  CreationProfilePage.fixtures.js
  creationProfilePageDiagnostics.mjs
```

The public import remains `components/studio/creations/CreationProfilePage.jsx`.

## Ownership

`useCreationProfilePageViewModel.js` is a deployment mirror of the
authoritative Crestfall application ViewModel. Application behavior remains
owned by `Crestfall`; the FE repository keeps this mirror synchronized for the
independently deployed Skin app.

The application ViewModel owns raw Creation/media aliases, description
truncation, media filtering and sorting, 12-item pagination, reaction
loading/mutations, and Story Room orchestration. The Binding Shell owns Next.js links/navigation and existing
application components (`CreationStatusBadges`, `CreationStatsRow`,
`CreationShareButton`, `CrestfallSelect`, `MediaTileQuickActions`, and
`MediaLightbox`). The portable View receives only display-ready models,
semantic callbacks, and rendered slots.

## Preserved behavior
- `LORE` creations continue to delegate to `LorePublicCreationPage`; the standard LOOM catalogue is used for every other creation type.

- Images, Videos, Liked, Bookmarked, and All filters
- Newest, Oldest, Top / All Time, and Liked First sorting
- Search, four eager images, 12-item pagination, and Load More
- Like/bookmark optimistic updates with rollback on persistence failure
- Creation header, attribution, statistics, tags, 420-character description
- Chat-capable Creation Story Room start
- Generate, Share, and public Media Lightbox actions
- Load-error, no-creation, no-media, and missing-preview fallbacks

Preview: `/dev/ui-preview/creation-profile-page`

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.


## Story opening Location wiring

The Profile page reuses W1's FE-owned portable picker:

```text
StoryStartOpeningLocationPicker.view.jsx
```

and the accepted presentation contract:

```text
story_start_opening_location.presentation.v1
```

For a `ROOM_TEMPLATE` authored with `PLAYER_SELECT`, the existing **Chat** action
opens the picker before room creation. A valid creator-authored Location must be
selected before the Chassis start path is invoked.

The Profile does not own a second picker implementation or a second Story-start
authority.

`Crestfall` remains authoritative for opening-location mode and allowed IDs,
Story-start application state, selected-ID validation, room creation, opening
hard-state commit, and navigation. `Crestfall-fe` owns the shared picker visual
composition and Profile presentation.

## W18 Library Pass wiring

The public Creation Profile now consumes the live Library Pass application
ViewModel and enforces the public-preview boundary before media actions or
lightbox composition.

Locked extended media routes to the one-time Library Pass purchase flow.

The Profile contract is now `creation-profile-page.view.v2`; the accepted W2
opening-Location picker remains intact.

The FE View retains its existing visual language rather than adopting the
differently styled Chassis Profile View.
