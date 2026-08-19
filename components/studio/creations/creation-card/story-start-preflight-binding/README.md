# Creation Card ↔ Story Start Preflight binding

Status: additive FE interaction-seam binding only.

This package closes the third Story-start surface after the Creation Profile and
Creation Preview bindings: the catalogue **Creation Card**.

The current Card already has:

```text
Start Story
Open Preview
```

so no new visual slot is required.

## Current Chassis behavior

For most chat-capable Creations, the card may start directly.

For a **saved ROOM_TEMPLATE**, current Crestfall first hydrates the Creation
Preview graph so it can inspect the current authored opening-location contract.

That preflight is application behavior and remains Chassis-owned.

## Card actions

The binding projects:

```text
START_DIRECTLY
HYDRATE_STORY_PREVIEW
OPEN_PREVIEW_FOR_LOCATION_SELECTION
START_HYDRATED_STORY
BLOCK_BUSY
NOT_CHAT_CAPABLE
```

### Non-Room Template

```text
START_DIRECTLY
```

### Unsaved Room Template

Current source compatibility remains:

```text
START_DIRECTLY
```

because there is no stable Creation ID to hydrate.

### Saved Room Template before preflight

```text
HYDRATE_STORY_PREVIEW
```

The existing Start Story button may use its current busy treatment while
Chassis loads the preview graph.

### Player-select Room Template

After Chassis supplies:

```text
selectionRequired = true
```

the card action becomes:

```text
OPEN_PREVIEW_FOR_LOCATION_SELECTION
```

It does **not** create a room.

The existing Preview modal then owns the already-accepted starting-Location
picker flow.

### Fixed Room Template

After preflight:

```text
selectionRequired = false
```

the action becomes:

```text
START_HYDRATED_STORY
```

using the hydrated Story Creation.

## Preview hydration failure

Current Crestfall falls back to the card's existing modal Creation data if the
preview fetch fails for the preflight.

The Chassis may therefore supply:

```text
FAILED_FALLBACK_READY
```

The FE gate still honors `selectionRequired` from that fallback interpretation.

No networking or fallback-building logic lives in this package.

## Why there is no pending FE visual extension

The current Creation Card `1.0.0` contract already contains:

```text
showStartChatAction
isStartingChat
onStartChat
onOpenPreview
```

Those are sufficient.

This package therefore records:

```text
existingStartButtonSufficient = true
existingPreviewModalTriggerSufficient = true
newVisualSlotRequired = false
```

## Permanent boundary

Crestfall owns:

- chat-capability policy
- Room Template identification
- preview fetch
- preview graph normalization
- opening-location config interpretation
- application busy/error state
- room creation
- navigation

Crestfall-fe owns:

- the existing Creation Card visual composition
- display of its current busy state
- semantic projection of which existing action path is needed

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
