# Story Room State Panel ↔ World State binding

Status: additive FE presentation binding only.

This package connects the already accepted Story Room World State projection to
the existing FE-owned Story Room State Panel contract.

It deliberately does **not** replace or edit:

```text
StoryRoomStatePanel.view.jsx
useStoryRoomStatePanelViewModel.js
StoryRoomStatePanel.contract.js
components/studio/chat/**
```

## Existing State Panel seam

The current portable State Panel already accepts display-ready sections:

```text
Scenario Phase
World State
Knowledge Boundaries
Memory
```

and display-ready actions.

That means the current World State projection can be integrated without copying
the source Chassis ViewModel.

## Binding behavior

The binding is intentionally narrow.

It updates only:

1. the `Scenario Phase → Objective` row;
2. the entire `World State` section.

Everything else is preserved exactly from the Chassis-supplied base panel.

That includes:

- current phase;
- scenario title;
- Knowledge Boundaries;
- Memory;
- Export/Share actions;
- close behavior;
- future FE sections.

## World State authority

The binding consumes an already projected:

```text
story_room_world_state.presentation.v1
```

It does **not** inspect the raw Story Room snapshot.

That accepted projection already owns display semantics for:

```text
Location
Time
Time Source
Weather
Weather Source
Turn · Day · Time objective
```

and already enforces the product precedence:

```text
room runtime Location
→ authored starting Location
→ attached fallback
→ unspecified
```

with Engine Module vs Room State fallback for time/weather.

## Missing section/row handling

If the base panel lacks `world-state`, the binding inserts the authoritative
projected section once.

If `scenario-phase` lacks `objective`, the binding inserts the authoritative
objective once.

If no valid World State projection is supplied, the base panel passes through
unchanged.

## Permanent boundary

Crestfall owns:

- Story Room snapshot loading
- message loading
- Engine module invocation
- time/weather runtime mutation
- Location Runtime mutation
- participant/NPC mobility mutation
- Story Room application state
- API/client/service behavior

The accepted FE semantic package owns:

- display-ready World State projection

Crestfall-fe State Panel owns:

- State Panel visual composition
- section/card rendering
- eventual richer World State visual treatment

## Protected scopes untouched

- existing `story-room-state-panel/**` files
- `components/studio/chat/**`
- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
