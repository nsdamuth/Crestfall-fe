# Story Room Chat Shell LOOM Package

## Boundary

`components/studio/story-rooms/StoryRoomChatShell.jsx` is the Crestfall Binding Shell. It owns only application integrations:

- Next.js router navigation after room deletion
- browser confirmation through `window.confirm`
- the existing `useStoryRoomChat(roomId)` transport/runtime hook
- injection of application-owned Story Room child components, the story list rail, and `next/link` for the mobile bar's back link
- the studio chrome context (`StudioChromeProvider`): one left panel at a time, so the story list rail opening collapses the primary nav and the nav expanding closes the rail

`useStoryRoomChatShellViewModel.js` is the Chassis. It owns:

- composer draft, input mode, responder, and mention state
- rail state (`railsState`, defaults: story list closed, details open; mutually exclusive below xl) and mobile drawer state
- the viewport reads (md and xl) the View used to make itself
- responder availability reconciliation
- local `/help`, `/commands`, and `/format` resolution
- room deletion through the existing Story Room client
- send projection into the transport hook
- restoration of unsent draft and mentions when transport returns no result

`StoryRoomChatShell.view.jsx` is the portable Skin. It owns:

- the three flush columns at md and up (geometry in `app/design-system.css`, `.cf-story-room-grid[data-rails]`, fe/chat-studio item 1)
- one bare 44px edge toggle per rail, open or closed
- the 44px mobile bar below md (back chevron, primary character circle, title, story details button); there is no desktop header block
- Help and Commands overlays
- desktop and mobile placement of injected child components

## Transport/runtime hook remains separate

`components/studio/story-rooms/hooks/useStoryRoomChat.js` remains the Story Room transport and runtime owner. This package does not move or duplicate its responsibilities:

- Story Room and Registry NPC fetches
- snapshot normalization
- room, cast, speaker, location, and message projection
- optimistic player messages
- ordered Engine response-message reconciliation
- Registry NPC load/unload lifecycle
- Player Character replacement
- room reload after runtime Mechanics binding changes

The portable View never imports that hook or any Story Room client.

## Preserved behavior

The conversion preserves:

- `AUTO`, explicit participant, and `RANDOM` next-speaker choices
- Character-only `@` mention candidates
- Location Registry `#` mention options
- all four input modes supplied to the existing Composer
- local `/help`, `/?`, `/commands`, and `/format` behavior before network send
- draft and mention clearing before send
- draft and mention restoration when a non-yield send fails
- `PLAYER_YIELD_TO_CHARACTER` empty-body behavior
- the desktop Chronicle State panel in the right rail; the left rail is the story list (ruling D4), the cast reaches the desktop again with the right rail rebuild (item 6)
- mobile Cast and Chronicle State drawers
- Runtime Mechanics Panel placement in both State surfaces
- existing permanent-delete confirmation wording
- canonical `/studio/v2/stories` navigation after successful deletion

## Preview

Development-only preview:

```text
/dev/ui-preview/story-room-chat-shell
```

The preview renders the portable View with local fixtures and injected preview components. It does not:

- fetch a Story Room
- send a message
- call engine middleware
- load or unload Registry NPCs
- set a Player Character
- save or remove Runtime Mechanics bindings
- delete a Story Room
- navigate the production router

Production returns `notFound()` for the preview route.

## Mechanics deferral

This package mounts the already-converted Runtime Mechanics attachment panel, but it does not abstract the deferred Mechanics Module editor, tracker modal, progression profile, commands, presets, migration, compatibility, or runtime-module authoring domains.
