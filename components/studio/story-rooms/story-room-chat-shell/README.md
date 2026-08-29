# Story Room Chat Shell LOOM Package

## Boundary

`components/studio/story-rooms/StoryRoomChatShell.jsx` is the Crestfall Binding Shell. It owns only application integrations:

- Next.js router navigation after room deletion
- browser confirmation through `window.confirm`
- the existing `useStoryRoomChat(roomId)` transport/runtime hook
- injection of application-owned Story Room child components

`useStoryRoomChatShellViewModel.js` is the Chassis. It owns:

- composer draft, input mode, responder, and mention state
- desktop panel and mobile drawer state
- responder availability reconciliation
- local `/help`, `/commands`, and `/format` resolution
- room deletion through the existing Story Room client
- send projection into the transport hook
- restoration of unsent draft and mentions when transport returns no result

`StoryRoomChatShell.view.jsx` is the portable Skin. It owns:

- responsive three-column Story Room layout
- collapsed panel reveal controls
- Story header and status pills
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
- desktop Cast and Chronicle State panels
- mobile Room & Cast and Chronicle State drawers
- Runtime Mechanics Panel placement in both State surfaces
- existing permanent-delete confirmation wording
- existing `/studio/story-rooms` navigation after successful deletion

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
