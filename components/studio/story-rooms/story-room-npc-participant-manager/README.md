# Story Room NPC Participant Manager LOOM Boundary

## Public component

```text
components/studio/story-rooms/StoryRoomNpcParticipantManager.jsx
```

The existing public component path remains the Binding Shell.

## Portable View

```text
components/studio/story-rooms/story-room-npc-participant-manager/
  StoryRoomNpcParticipantManager.view.jsx
```

The View owns the disclosure layout, section/card rendering, notices, icons,
responsive presentation, accessibility, and safe invocation of semantic actions.
It receives only display-ready sections and opaque action IDs.

## ViewModel

```text
components/studio/story-rooms/story-room-npc-participant-manager/
  useStoryRoomNpcParticipantManagerViewModel.js
```

The ViewModel owns:

- Story Room NPC lifecycle response normalization;
- authoritative `CREATION_REF` filtering;
- loaded, pending, available, inactive, and unavailable grouping;
- action-key construction and busy-state matching;
- source-registry availability guards;
- raw registry, entry, and participant identifier retention;
- mapping opaque View actions back to `onLoad` and `onUnload`;
- presentation-independent open/closed state.

It does not call Story Room APIs. Those remain owned by `useStoryRoomChat` and
are passed through `StoryRoomCastPanel`.

## Contract and fixtures

```text
StoryRoomNpcParticipantManager.contract.js
StoryRoomNpcParticipantManager.fixtures.js
```

Fixtures directly match the portable View contract and contain no live Story
Room data, private user data, APIs, or persistence.

## Isolated preview

```text
/dev/ui-preview/story-room-npc-participant-manager
```

The preview is blocked in production and simulates disclosure and NPC action
feedback in local state only.

## Live caller

```text
components/studio/story-rooms/StoryRoomCastPanel.jsx
```

The caller and its public prop contract remain unchanged.

## W15 Registry graph authority wiring

The live ViewModel is now an exact deployment mirror of current Chassis
graph-authority behavior.

Only linked-Character `CREATION_REF` entries appear in this manager.
Registry-owned `AD_HOC` entries remain outside this participant lifecycle.

The portable View contract is `1.2.0` and supports an `Unavailable References`
section whose cards can explicitly declare `hasAction = false`.

Unavailable linked Characters remain visible with their authoritative failure
reason but do not receive a load/reload button.

The View keeps the existing FE styling; only the semantic icon/no-action support
was added.
