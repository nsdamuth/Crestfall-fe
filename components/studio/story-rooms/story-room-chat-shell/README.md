# Story Room Chat Shell LOOM Package

## Boundary

`components/studio/story-rooms/StoryRoomChatShell.jsx` is the Crestfall Binding Shell. It owns only application integrations:

- Next.js router navigation after room deletion
- browser confirmation through `window.confirm`
- the existing `useStoryRoomChat(roomId)` transport/runtime hook
- injection of application-owned Story Room child components (the composer, the transcript, the status host, the story list rail, the details rail), and `next/link` for the mobile bar's back link
- the studio chrome context (`StudioChromeProvider`): one left panel at a time, so the story list rail opening collapses the primary nav and the nav expanding closes the rail

`useStoryRoomChatShellViewModel.js` is the Chassis. It owns:

- composer draft, input mode, responder, and mention state
- rail state (`railsState`, defaults: story list closed, details open; mutually exclusive below xl) and the sheet state below md (`mobilePanel`: stories, details, or null; reset on a room change so the story list sheet never stays open over the next story)
- the chat color (creator default from the primary Character's palette, page-state override until CR-066)
- the viewport reads (md and xl) the View used to make itself
- responder availability reconciliation
- local `/help`, `/commands`, and `/format` resolution
- room deletion through the existing Story Room client
- send projection into the transport hook
- restoration of unsent draft and mentions when transport returns no result

`StoryRoomChatShell.view.jsx` is the portable Skin. It owns:

- the three flush columns at md and up (geometry in `app/design-system.css`, `.cf-story-room-grid[data-rails]`, fe/chat-studio item 1)
- the full-width composer row beneath both rails (brief 3 item 1): the rails end at the row's top edge, the shell paints the row's canvas surface and top hairline edge to edge, and the composer's content sits in the transcript's grid column so the field and its buttons keep the transcript's width
- one bare 44px edge toggle per rail, open or closed (brief 2 item 5: the primary sidebar's collapse glyph and bare-icon recipe, the story list toggle on the right edge of its panel, the details toggle on the left edge; a closed rail carries no surface, border, or column color)
- the 44px mobile bar below md (back chevron, primary character circle, title; brief 2 item 11 retired the media button and moved the story list and settings buttons to the composer's rows); there is no desktop header block
- the two sheets below md: the story list as a left sheet (`KitModalFrame variant="drawer"`, opened from the composer's story list button) and the details rail as the bottom sheet (`variant="sheet"`, opened from the composer's settings button), plus the delete confirm on `StoryChatDialog`
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

- `AUTO` and explicit participant next-speaker choices (the Random choice retired with the composer bar, fe/chat-studio item 2)
- Character-only `@` mention candidates
- Location Registry `#` mention options
- all four input modes supplied to the existing Composer
- local `/help`, `/?`, `/commands`, and `/format` behavior before network send
- draft and mention clearing before send
- draft and mention restoration when a non-yield send fails
- `PLAYER_YIELD_TO_CHARACTER` empty-body behavior
- the details rail on the right (gallery, title, chips, Export and Share, and the Cast, Narrator, World state, Mechanics, Preferences drill-ins), the story list on the left (ruling D4)
- the right sheet below md in place of the retired mobile drawers
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
