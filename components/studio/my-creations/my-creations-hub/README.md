# My Creations Hub LOOM package

## Boundary

`MyCreationsHub.jsx` is the Binding Shell. It injects the application-owned
Next.js link, responsive filter panel, tag filter, and `CreationCard` adapters.

`useMyCreationsHubViewModel.js` is the Chassis. It owns raw creation and JSONB
normalization, media projection, date formatting, tab/tag/search filtering,
mobile grid state, pagination, and engagement orchestration.

`MyCreationsHub.view.jsx` is the Portable Skin. It renders display-ready state
and calls semantic callbacks without importing Next.js, client APIs, creation
media helpers, application engagement hooks, or Creation Edit constants.

## Preserved behavior

- Search across title, description, attribution, lifecycle, type, and tags.
- Type/status tabs and top-owned-tag filtering.
- Twelve-card initial pagination with twelve-card increments.
- Four eager card images.
- Compact/large mobile grid toggle.
- Owner Creation Card behavior, likes, bookmarks, preview, chat, and edit.
- Empty and engagement-error states.
- Existing `/studio/create` navigation.

## Preview

Development-only route:

`/dev/ui-preview/my-creations-hub`

Mechanics Module field decomposition remains deferred until the final
cumulative reassessment.
