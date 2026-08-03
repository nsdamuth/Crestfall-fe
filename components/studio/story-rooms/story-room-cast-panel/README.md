# StoryRoomCastPanel Loom Boundary

## Public Shell

```text
components/studio/story-rooms/StoryRoomCastPanel.jsx
```

The Shell preserves the current Story Room public API. It binds the panel
ViewModel to the portable View and conditionally mounts the existing
`DefaultPlayerCharacterPickerModal` Binding Shell only while the picker is
open. This preserves the original behavior of loading Player Characters only
when the picker is opened.

## Portable View

```text
components/studio/story-rooms/story-room-cast-panel/
  StoryRoomCastPanel.view.jsx
```

The View owns only room-media, cast-card, action, error, and navigation
presentation. It directly composes the already-portable
`StoryRoomNpcParticipantManager.view.jsx`.

## ViewModel

The ViewModel owns:

- raw Story Room and cast-record normalization;
- responder-selection labels and availability;
- player-character picker disclosure and selection orchestration;
- delete, close, and responder callback mapping;
- composition of the NPC participant-manager ViewModel;
- display fallbacks and action busy/error state.

It does not own Story Room API calls, room deletion, participant lifecycle
requests, transcript state, or message sending.

## Preview

```text
/dev/ui-preview/story-room-cast-panel
```

The preview renders direct View-contract fixtures. Its actions update local
feedback only and never load a Story Room, query Player Characters, load or
unload an NPC, delete a Story, or persist responder state.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
