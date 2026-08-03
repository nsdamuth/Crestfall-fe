# Story Room State Panel Loom Feature

## Public Binding Shell

```text
components/studio/story-rooms/StoryRoomStatePanel.jsx
```

The Shell preserves the existing public props:

```text
room
onClose
```

## Portable View

```text
components/studio/story-rooms/story-room-state-panel/
  StoryRoomStatePanel.view.jsx
```

The View owns the Chronicle State visual hierarchy, state cards, close control,
and the currently disabled export/share actions. It receives display-ready
sections and emits only semantic close intent.

The View does not know the Story Room snapshot shape, engine-module operation
results, room-state fallback fields, chat-shell layout state, mobile drawer
orchestration, transcript state, APIs, export implementation, sharing
implementation, or persistence behavior.

The View currently imports `lucide-react` as a general visual dependency and
uses Crestfall Tailwind/theme tokens supplied by the host application.

## ViewModel

```text
components/studio/story-rooms/story-room-state-panel/
  useStoryRoomStatePanelViewModel.js
```

The ViewModel translates the current Story Room `room` object into semantic,
display-ready cards. It owns engine-source fallback labels, unknown time/weather
fallbacks, the current static knowledge/memory rows, disabled future actions,
and mapping the optional `onClose` callback to `onClosePanel`.

## Contract and Fixtures

```text
components/studio/story-rooms/story-room-state-panel/
  StoryRoomStatePanel.contract.js
  StoryRoomStatePanel.fixtures.js
```

Current View contract version:

```text
STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures are direct View props. They contain no Story Room snapshot, message
history, engine-module payload, room ID, API behavior, or persistence logic.

## Development Preview

```text
/dev/ui-preview/story-room-state-panel
```

The preview is development-only and returns `notFound()` in production. The
close action hides only the preview instance and can be reopened locally. It
does not load a Story, call an API, run an engine module, export a chat, share a
snapshot, or save state.

## Live Validation

Validate the panel through both existing placements in:

```text
components/studio/story-rooms/StoryRoomChatShell.jsx
```

Test the desktop right rail with its close/reopen behavior and the mobile
Chronicle State drawer without an internal close control. Confirm scenario,
objective, location, time/weather values, engine-versus-room source labels, and
the disabled export/share placeholders remain unchanged.
