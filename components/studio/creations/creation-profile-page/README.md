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

The ViewModel owns raw Creation/media aliases, description truncation, media
filtering with source-order media, 12-item pagination, reaction loading/mutations, and Story
Room creation. The Binding Shell owns Next.js links/navigation and existing
application components (`CreationStatusBadges`, `CreationStatsRow`,
`CreationShareButton`, `MediaTileQuickActions`, and
`MediaLightbox`). The portable View receives only display-ready models,
semantic callbacks, and rendered slots.

## Preserved behavior
- `LORE` creations continue to delegate to `LorePublicCreationPage`; the standard LOOM catalogue is used for every other creation type.

- Images, Videos, Liked, Bookmarked, and All filters
- Search, four eager images, 12-item pagination, and Load More
- Like/bookmark optimistic updates with rollback on persistence failure
- Creation header, attribution, statistics, tags, 420-character description
- Chat-capable Creation Story Room start
- Generate, Share, and public Media Lightbox actions
- Load-error, no-creation, no-media, and missing-preview fallbacks

Preview: `/dev/ui-preview/creation-profile-page`

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.

## Conditional Credits tab — 24 Aug 2026

The public creation catalogue now restores attribution as a first-class
conditional tab. Resolved `creation.credits` adds `Credits` to the media
tab row; zero resolved credits add no tab. When Credits is active,
media-only search, media tiles, and pagination are hidden and the
shared Kit credits renderer shows the full attribution list.

## Per-asset ordering — 24 Aug 2026

An individual Creation catalogue no longer exposes a Sort dropdown. Media
keeps the authoritative/source order supplied to the page; Search and the
media tabs remain available. Sorting belongs on discovery/catalog surfaces,
not inside one Creation's compact media catalogue.
