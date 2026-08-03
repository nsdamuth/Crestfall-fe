# Story Room Mobile Drawer

## Purpose

`StoryRoomMobileDrawer` is the bounded mobile-only overlay used to display the
Story Room cast panel or Chronicle State panel below the `xl` breakpoint.

The public import path remains:

```text
components/studio/story-rooms/StoryRoomMobileDrawer.jsx
```

That file re-exports the portable View so the existing Story Room caller does
not change.

## Current consumer

```text
components/studio/story-rooms/StoryRoomChatShell.jsx
```

The shell currently uses the drawer for:

- Room & Cast;
- Chronicle State.

## Ownership boundary

The View owns:

- the fixed mobile overlay;
- the drawer frame and header;
- title presentation;
- the close button and accessibility label;
- the scrollable child-content region;
- the current `xl:hidden` responsive behavior.

The View does not own:

- which mobile panel is open;
- Story Room cast or Chronicle State data;
- the supplied child panel;
- opening or closing application state;
- Story Room runtime behavior;
- APIs, routing, engine modules, or persistence.

No ViewModel is required because the component receives a complete visual
contract and owns no application truth or data transformation.

## Contract

```text
STORY_ROOM_MOBILE_DRAWER_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/story-room-mobile-drawer
```

The actual View remains hidden at the `xl` breakpoint and above. Resize the
preview below `1280px` to inspect the drawer. Fixture selection and close/reopen
behavior are preview-local only. The route must return `notFound()` in
production.

## Live regression target

```text
Story Room
→ mobile Room & Cast drawer
→ mobile Chronicle State drawer
```

Both drawers must retain their current title, close behavior, content scrolling,
and mobile-only visibility.
