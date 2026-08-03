# Story Room Composer Loom Feature

## Public Shell

```text
components/studio/story-rooms/StoryRoomComposer.jsx
```

The Shell preserves the existing controlled API used by the Story Room chat
shell, including input mode, next speaker, draft text, participant mentions,
mobile drawer actions, sending state, and disabled state.

## Portable View

```text
components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx
```

The View owns desktop and mobile composition, responsive presentation,
presentation-local mobile-tools disclosure, textarea auto-sizing, mention-menu
presentation, and disabled future-tool placeholders.

It does not receive raw Story Room participant records and does not send
messages, load room state, call APIs, or persist participant mentions.

## ViewModel

```text
components/studio/story-rooms/story-room-composer/useStoryRoomComposerViewModel.js
```

The ViewModel owns:

- speaker and mention-option normalization;
- input-mode placeholder selection;
- participant-mention reconciliation;
- active mention-query parsing and filtering;
- highlighted mention selection;
- mapping semantic View callbacks to the existing controlled setters;
- send and textarea disabled-state decisions.

The portable textarea now uses Enter to invoke the existing send action and
Shift+Enter to preserve multiline composition. IME composition events are not
submitted.

## Live Caller

```text
components/studio/story-rooms/StoryRoomChatShell.jsx
```

The caller remains unchanged and continues to own message submission, room
state, draft restoration after failure, participant options, and mobile drawer
selection.

## Preview

```text
/dev/ui-preview/story-room-composer
```

The preview renders direct View-contract fixtures and local interactions only.
It does not load a Story Room, send a turn, open a real room panel, or save
participant mentions.


## Local Composer Commands

```text
components/studio/story-rooms/story-room-composer/storyRoomCommandRegistry.js
```

The first local command registry defines `/help` (with `/?` as an alias) and
`/commands`. `StoryRoomChatShell` resolves these commands before the existing
turn submission path, opens a local help panel, and does not write the command
into the transcript or send it to the AI provider.

## Phase 2 responder portraits

- Character and narrator responder choices render as portrait buttons with initial fallbacks.
- Clicking a portrait with composer text sends that text directly to the selected responder.
- Clicking a portrait with an empty composer submits a structured `PLAYER_YIELD_TO_CHARACTER` action.
- Yield actions are persisted as turn metadata, hidden from the visible transcript, and instruct the AI that the player took no action or movement.


## Phase 3 command autocomplete

- Typing `/` at the start of an empty composer opens the shared command registry.
- Suggestions filter by command name and aliases while the command token is typed.
- Arrow Up/Down changes the highlighted command.
- Tab completes the highlighted command without submitting it.
- Enter completes a partial command; Enter executes an exact `/help`, `/?`, or `/commands` command through the existing local-command path.
- Escape dismisses the command menu.
- Mouse selection completes the command and keeps focus in the composer.
- Only commands present in `storyRoomCommandRegistry.js` are displayed.


## Phase 4 Location Registry autocomplete

- Typing `#` opens locations from the hydrated Location Registry context.
- Results filter by canonical name and aliases.
- The active location is prioritized first, followed by adjacent locations, siblings under the same parent, and broader registry matches.
- Arrow Up/Down changes the highlighted location; Enter or Tab inserts it; Escape closes the menu.
- Selected locations are inserted as readable `#Location Name` text and retained as structured metadata containing registry, entry, runtime, and linked Location creation identifiers.
- Location references do not automatically move the party; they only remove name ambiguity for middleware and future commands.
- Duplicate names remain distinguishable through registry title and location scale in the suggestion menu.
