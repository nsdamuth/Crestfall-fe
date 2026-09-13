# Story Room Composer Loom Feature

## Public Shell

```text
components/studio/story-rooms/StoryRoomComposer.jsx
```

The Shell preserves the existing controlled API used by the Story Room chat
shell: input mode, next speaker, draft text, participant mentions, location
mentions, command options, sending state, and disabled state.

## Portable View

```text
components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx
```

One composer bar at every width (fe/chat-studio item 2, 12 Sep 2026;
send row and Auto reshaped by brief 2 item 1, 13 Sep 2026):

- row one, left to right: a 44px circle per cast member (avatar, narrator
  glyph, or initial), then the input mode chip (Dialogue, Action, OOC,
  Direct on the shared KitDropdown menu, the first mode resting) and the
  scene image seat at the right end;
- row two: the growing message field (placeholder "Send a message"), the
  Auto circle (sparkle glyph, secondary circle on `--step-above`), and the
  circular gold send button with the arrow glyph at the row's right edge.

The active speaker circle carries the gold selected ring. Tapping a cast
circle reports that speaker through `onChangeNextSpeaker`; with a draft the
message goes to that speaker, with an empty field the turn is yielded to
that speaker. The Auto circle (`onAuto`) runs the existing continuation
call with the AUTO speaker (`PLAYER_YIELD_TO_AUTO`) and never depends on
the draft; it also makes Auto the resting speaker. The send circle posts
the draft only and is disabled while the field is empty.

The scene image seat is visible and disabled with the name "Scene image,
not available yet" until the Chassis serves the operation (CR-070). There
is no microphone, no Random speaker, no tools drawer, and no Next Speaker
or Input Mode label.

The View owns textarea auto-sizing, Enter to send and Shift+Enter for a new
line (IME composition is never submitted), and the command, mention, and
location menu presentation. It does not receive raw Story Room participant
records and does not send messages, load room state, call APIs, or persist
participant mentions.

## ViewModel

```text
components/studio/story-rooms/story-room-composer/useStoryRoomComposerViewModel.js
```

The ViewModel owns:

- speaker and mention-option normalization (Auto, narrator, participant);
- the one placeholder;
- participant-mention reconciliation;
- active mention, command, and location query parsing and filtering;
- highlighted suggestion selection;
- mapping semantic View callbacks to the existing controlled setters;
- send, Auto, and textarea disabled-state decisions;
- the send and Auto circles' accessible names and the scene image seat
  state.

## Live Caller

```text
components/studio/story-rooms/StoryRoomChatShell.jsx
```

The caller continues to own message submission, room state, draft
restoration after failure, and participant options.

## Local Composer Commands

```text
components/studio/story-rooms/story-room-composer/storyRoomCommandRegistry.js
```

The local command registry defines `/help` (with `/?` as an alias),
`/commands`, and `/format`, plus the server commands `/inventory`, `/save`,
`/like`, and `/mark`. Each entry carries `name`, `aliases`, `description`,
`usage`, and one `example` (fe/chat-studio item 5); creator Mechanics
commands merge from the catalog with a null example. `/format` opens the
Story text formatting guide locally. `StoryRoomChatShell` resolves the
local commands before the existing turn submission path, opens a local
help panel, and does not write the command into the transcript or send it
to the AI provider.

## Responder circles

- Character and narrator responder choices render as 44px circles with
  initial fallbacks.
- Tapping a circle with composer text sends that text directly to the
  selected responder.
- Tapping a circle with an empty composer submits a structured
  `PLAYER_YIELD_TO_CHARACTER` action.
- Yield actions are persisted as turn metadata, hidden from the visible
  transcript, and instruct the AI that the player took no action or
  movement.

## Command autocomplete

- Typing `/` at the start of an empty composer opens the shared command
  registry as a tappable list on the composer menu recipe: each row shows
  the usage, the description, and one example; the footer reads "Commands
  are hidden from the story."
- Suggestions filter by command name and aliases while the command token
  is typed.
- Arrow Up/Down changes the highlighted command.
- Tab completes the highlighted command without submitting it.
- Enter completes a partial command; Enter executes an exact `/help`, `/?`,
  `/commands`, or `/format` command through the existing local-command path.
- Escape dismisses the command menu.
- Mouse selection completes the command and keeps focus in the composer.
- Only commands present in `storyRoomCommandRegistry.js` are displayed.

## Location Registry autocomplete

- Typing `#` opens locations from the hydrated Location Registry context.
- Results filter by canonical name and aliases.
- The active location is prioritized first, followed by adjacent
  locations, siblings under the same parent, and broader registry matches.
- Arrow Up/Down changes the highlighted location; Enter or Tab inserts it;
  Escape closes the menu.
- Selected locations are inserted as readable `#Location Name` text and
  retained as structured metadata containing registry, entry, runtime, and
  linked Location creation identifiers.
- Location references do not automatically move the party; they only
  remove name ambiguity for middleware and future commands.
- Duplicate names remain distinguishable through registry title and
  location scale in the suggestion menu.
