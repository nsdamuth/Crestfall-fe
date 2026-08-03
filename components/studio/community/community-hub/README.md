# Community Hub LOOM package

## Boundary

`CommunityHub.jsx` is the Binding Shell. It injects Crestfall's responsive
filter panel, select, tag filter, creation card, creator card, and creator list
row components.

`useCommunityHubViewModel.js` is the Chassis. It owns mode, filters, search,
sorting, pagination, mobile presentation, community-data normalization, and
creation/profile engagement orchestration.

`CommunityHub.view.jsx` is the Portable Skin. It renders display-ready public
creation and creator state through injected application adapters.

## Preserved behavior

- Creations and Creators modes.
- Creation type, curation, tag, rating, rendering, and search filters.
- Recommended, newest, updated, liked, and used sorting.
- Creator featured, active, and canon-contributor filters.
- Creator grid/list switching.
- Twelve-item initial pagination and twelve-item increments.
- Four eager Creation Card images.
- Likes, bookmarks, and follows through existing engagement hooks.
- Existing public-creation and public-creator empty states.

## Preview

Development-only route:

`/dev/ui-preview/community-hub`

Mechanics Module field decomposition remains deferred until the final
cumulative reassessment.
