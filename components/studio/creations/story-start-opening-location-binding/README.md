# Creation Start ↔ Story Opening Location binding

Status: additive FE presentation/interaction-seam binding only.

This package connects the already accepted Story Start Opening Location
presentation contract to the two existing Creation surfaces that can start a
Story:

```text
Creation Profile Page
Creation Preview Modal
```

It deliberately does **not** edit their current Views, ViewModels, or contracts.

## Current Chassis behavior

The Chassis already resolves a display-ready opening-location start config.

For a fixed Story:

```text
selectionRequired = false
```

Start Story continues directly through the normal path.

For a player-select Story:

```text
selectionRequired = true
```

the user must choose one of the creator-authored allowed Locations before Story
creation.

## Start intents

The binding exposes six semantic UI outcomes:

```text
START_DIRECTLY
OPEN_LOCATION_PICKER
BLOCK_INVALID_SELECTION
START_WITH_SELECTED_LOCATION
BLOCK_BUSY
NOT_CHAT_CAPABLE
```

### Fixed Story

```text
START_DIRECTLY
openingLocationId = null
```

No picker is needed.

### Player-select, no valid selection

Initial Start Story action becomes:

```text
OPEN_LOCATION_PICKER
```

It does not invoke Story creation.

### Player-select, valid selection

The semantic result becomes:

```text
START_WITH_SELECTED_LOCATION
openingLocationId = <selected allowed ID>
```

The Chassis application ViewModel can then call:

```text
startStoryFromCreation(...)
```

with that ID.

### Confirm without a valid selection

The semantic result is:

```text
BLOCK_INVALID_SELECTION
```

with current UI copy:

```text
Choose one of the allowed starting Locations.
```

This is only the presentation gate.

The Chassis remains authoritative for validating the ID against the authored
allowed set before room creation.

## Accepted picker presentation

This binding delegates picker rendering semantics to:

```text
story_start_opening_location.presentation.v1
```

which already carries:

- allowed Location cards
- selected card
- empty state
- error state
- Cancel
- Start Here
- Starting...
- pending disables
- accessibility state

## Live Creation Profile integration

The public Creation Profile now carries:

```text
openingLocationPicker
```

through:

```text
creation-profile-page.view.v2
```

For `PLAYER_SELECT`, the existing Story action opens the accepted
`StoryStartOpeningLocationPicker` presentation and only starts the Story after an
allowed Location has been selected.

Status:

```text
openingLocationPickerSlot = WIRED
```

## Live Creation Preview integration

The Creation Preview modal carries the same picker through:

```text
creation-preview-modal.view.v1
```

and uses the same selection/validation semantics.

Status:

```text
openingLocationPickerSlot = WIRED
```

## Creation Card preflight

Creation Cards do not duplicate the picker inside the card itself.

The accepted W3 preflight binding routes Player-select starts into the existing
Preview/Profile picker flow before Story creation, so a card cannot bypass the
authored opening-Location gate.

Status:

```text
creationCardStoryStartPreflight = WIRED
```

## Permanent boundary

Crestfall owns:

- raw Story Creation parsing
- opening-location mode
- allowed Location IDs
- stored-reference fallback
- selected Location application state
- authoritative selected-ID validation
- room creation
- opening hard-state commit
- successful navigation

Crestfall-fe owns:

- Start Story gate presentation
- opening-location picker visual composition
- pending/error/selected states
- semantic select/cancel/confirm callbacks

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`

## W22 consolidation

W22 does not add another picker or another Story-start implementation.

It reconciles this parent binding with the already accepted live packages:

```text
W1  Creation Preview opening Location
W2  Creation Profile opening Location
W3  Creation Card Story-start preflight
W21 Room Template opening-Location authoring
```

The binding's stale `PENDING_FE_VISUAL_EXTENSION` markers are now `WIRED`.

This keeps one authored contract from Room Template creation through the public
start gate and authoritative Story-room opening hard-state commit.
