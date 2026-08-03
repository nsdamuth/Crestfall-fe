# Story Rooms Hub LOOM package

## Boundary

`StoryRoomsHub.jsx` is the thin application Binding Shell. It owns the Next.js
`Link` binding and the application `ViewModeToggle` binding, then injects both
into the portable View.

`useStoryRoomsHubViewModel.js` is the Chassis. It owns the existing
`fetchStoryRooms` and `deleteStoryRoom` client calls, loading and delete
orchestration, room normalization, relative timestamp formatting, search,
status/visibility filtering, persistent view mode, manage-mode selection, and
the destructive confirmation flow.

`StoryRoomsHub.view.jsx` is the Portable Skin. It receives display-ready room
cards, copy, state flags, semantic callbacks, and injected component adapters.
It does not import Next.js navigation, Story Room clients, persistent-storage
hooks, or raw backend room contracts.

## Preserved behavior

- Loads rooms through the existing Story Room client boundary.
- Preserves the `crestfall.storyRooms.viewMode` local-storage key, desktop grid
  default, and mobile list default.
- Preserves Active, Templates, Private, and Archived filtering.
- Preserves search across room title, subtitle, type, status, visibility,
  content rating, scenario, narrator, location, last message, and cast.
- Preserves grid/list presentation and mobile controls.
- Preserves New Template and Open Latest Room routes.
- Preserves room-card and room-list navigation.
- Preserves manage mode, multi-selection, sequential deletion, delete
  confirmation wording, deletion error display, and post-delete list updates.
- Preserves current room fallbacks, message-count coercion, relative timestamp
  labels, loading, empty, load-error, and delete-error states.

## Preview

Development only:

`/dev/ui-preview/story-rooms-hub`

The preview includes populated, loading, empty, load-error, and delete-error
states plus live search, filters, view switching, mobile controls, selection,
and local deletion simulation.

## Deferred work

Story Room chat/runtime orchestration and Mechanics Module field decomposition
remain separate later targets. This package does not abstract the Mechanics
Module.
