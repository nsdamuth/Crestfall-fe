# View Mode Toggle

## Purpose

`ViewModeToggle` is a shared portable UI primitive for selecting Grid or List
presentation in a collection surface.

The public import path remains:

```text
components/studio/ViewModeToggle.jsx
```

That file re-exports the portable View so existing consumers do not change.

## Current consumers

```text
components/studio/story-rooms/StoryRoomsHub.jsx
components/studio/games/GamesHub.jsx
```

Each consumer renders the toggle in both its desktop controls and mobile filter
drawer.

## Ownership boundary

The View owns:

- Grid and List option presentation;
- active and inactive visual states;
- responsive option labels;
- safe semantic `onChange(nextValue)` intent.

The View does not own:

- the current collection layout;
- persistent view-mode preferences;
- local-storage keys;
- filtering or search;
- routing;
- API calls;
- application persistence.

No ViewModel is required because the component has no application state or
application-data transformation. The controlled `value` and `onChange` pair is
already the complete portable View contract.

## Contract

```text
VIEW_MODE_TOGGLE_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/view-mode-toggle
```

The preview uses contract-shaped fixtures and local Grid/List selection only.
It must return `notFound()` in production.

## Live regression targets

- Story Rooms desktop controls
- Story Rooms mobile filter drawer
- Games desktop controls
- Games mobile filter drawer

The toggle intentionally supports only the existing `grid` and `list` values.
