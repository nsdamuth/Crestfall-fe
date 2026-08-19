# Story Character Lifecycle authoring semantics

Status: semantic authoring contract and realistic fixtures only.

This package brings the current Story character-lifecycle authoring model into
the FE lane without copying the legacy Selected Characters panel or Story
runtime presence logic.

## Current authored contract

```text
story_character_lifecycle_v0
```

The current creator-facing field is:

```text
Story lifecycle
```

and has two authored choices.

### Persistent Story Cast

```text
kind: STORY_PINNED
releasePolicy: NEVER
```

Creator-facing description:

```text
Loads at Story start and remains active until another Story/runtime system
changes its presence.
```

This is also the compatibility/default behavior for older character selections
that have no lifecycle metadata.

### Opening Only

```text
kind: OPENING_TEMPORARY
releasePolicy: INITIAL_PHASE_EXIT
```

Creator-facing description:

```text
Loads for the opening and releases automatically when the initial Story phase
exits.
```

Compatibility aliases normalize to `OPENING_TEMPORARY`:

```text
OPENING
OPENING_ONLY
OPENING_TEMPORARY
SETUP_TEMPORARY
```

## Authoring transform

Changing lifecycle rewrites only the `lifecycle` object and preserves unrelated
selection/reference fields. That matters because the selected character object
may carry other Story package reference metadata.

## Permanent boundary

Crestfall remains authoritative for:

- Story start orchestration
- participant/runtime initialization
- phase transition detection
- actual presence release
- runtime participant mutation
- persistence
- API/client calls

Crestfall-fe owns the presentation of the authored lifecycle choice and emits
semantic change intent only.

## Visual integration

The legacy `SelectedCharactersPanel.view.jsx` is not copied. The current V2
Story/editor lane can consume this package when its ruled character-selection
surface is ready.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
