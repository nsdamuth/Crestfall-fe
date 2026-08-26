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
and the live Export Chat / Share Snapshot action entry points. The live player projection is
intentionally concise: **Location, Time, and Weather** only. It receives
display-ready sections and emits only semantic close intent.

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
display-ready player state. Runtime Scenario phase, knowledge-boundary policy,
memory bookkeeping, and engine source labels remain runtime-owned but are not
projected into this player side rail. The live card contains Location, Time, and
Weather with honest `Unknown` fallbacks. The ViewModel owns export/share dialog state while transport remains caller-owned, and maps the optional `onClose` callback to `onClosePanel`.

## Contract and Fixtures

```text
components/studio/story-rooms/story-room-state-panel/
  StoryRoomStatePanel.contract.js
  StoryRoomStatePanel.fixtures.js
```

Current View contract version:

```text
STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION = "1.1.0"
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
Chronicle State drawer without an internal close control. Confirm only Location,
Time, and Weather are shown to players. Scenario phase, knowledge boundaries,
memory, and engine-source labels must not appear in the player rail.
