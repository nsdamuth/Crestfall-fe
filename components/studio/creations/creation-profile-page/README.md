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
- Creation header, attribution, statistics, tags, four-line description clamp with Show more
- Chat-capable Creation Story Room start
- Generate, Share, and public Media Lightbox actions
- Load-error, no-creation, no-media, and missing-preview fallbacks

Preview: `/dev/ui-preview/creation-profile-page`

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.

## Unlock confirmation, RULED 12 Sep 2026 (eight-fix package FIX 6)

The "Unlock full library for <cost> coins" CTA no longer charges on
tap. It opens a confirmation built on the coins info dialog recipe
(`UtilityModal` in the studio economy widget, on `KitModalFrame`):
title "Unlock full library?", one line naming the protected image count
and future eligible additions from the same served Library Pass state
the panel reads, the cost from that same state, and the current balance
from the studio account context. Buttons: secondary "Cancel", primary
gold "Unlock for <cost> coins". The charge call runs only from the
primary's handler. A balance below the cost disables the primary and
shows the existing Buy Coins path. Single column, 44px buttons, inside
the viewport at 390.

Library Pass tiles, RULED 12 Sep 2026 (FIX 7): tapping any locked tile
opens that same dialog; the whole tile is the tap target, and unlocked
tiles behave as before.

Description clamp, RULED 12 Sep 2026 (FIX 8): the description shows at
most four rendered lines at rest with a gold "Show more" link that
expands it in place; expanded, the link reads "Show less". The clamp is
by line count (a ResizeObserver in the view model measures the
paragraph against four line heights), never by character count, so a
description of four lines or fewer shows no link. The 420-character
preview limit is retired.

## Conditional Credits tab, 24 Aug 2026

The public creation catalogue now restores attribution as a first-class
conditional tab. Resolved `creation.credits` adds `Credits` to the media
tab row; zero resolved credits add no tab. When Credits is active,
media-only search, media tiles, and pagination are hidden and the
shared Kit credits renderer shows the full attribution list.

## Per-asset ordering, 24 Aug 2026

An individual Creation catalogue no longer exposes a Sort dropdown. Media
keeps the authoritative/source order supplied to the page; Search and the
media tabs remain available. Sorting belongs on discovery/catalog surfaces,
not inside one Creation's compact media catalogue.
