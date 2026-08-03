# Room Template Package Picker Modal

## Purpose

Separates the legacy create/edit room-template package picker presentation from
raw Crestfall creation and profile records, room-package state, and
mode-specific callback routing.

## Feature structure

```text
RoomTemplatePickerModal.jsx
room-template-package-picker/
  RoomTemplatePackagePickerModal.view.jsx
  useRoomTemplatePackagePickerViewModel.js
  RoomTemplatePackagePickerModal.contract.js
  RoomTemplatePackagePickerModal.fixtures.js
  README.md
```

The existing
`components/studio/create/room-template/RoomTemplatePickerModal.jsx` path
remains the Binding Shell.

## Public application props

```text
picker
selectedCharacters
selectedScenario
selectedNarrator
selectedLocation
characterOptions
scenarioOptions
narratorOptions
locationOptions
mutualPlayers
invitedPlayers
recommendedIds
onClose()
onToggleCharacter(item)
onTogglePlayer(playerSummary)
onSelectScenario(item)
onSelectNarrator(item)
onSelectLocation(item)
```

The Shell and ViewModel preserve this application-facing contract.

## View ownership

The View owns:

- modal structure and responsive card layout
- presentation-local search state
- selected and recommended card treatment
- empty search/result presentation
- safe close and item-selection callback invocation

## ViewModel ownership

The ViewModel:

- maps picker modes to display configuration
- selects the correct raw option collection
- converts creation and player records into display-ready cards
- derives selected and recommended IDs
- translates an item-ID selection back to the original raw object
- preserves the original mode-specific callback payloads

## Isolated preview

```text
/dev/ui-preview/room-template-package-picker
```

The route is unavailable in production and does not load creations, invite a
player, alter a room package, apply a scenario recommendation, or save data.

## Compatibility note

This conversion covers the legacy picker at
`components/studio/create/room-template/RoomTemplatePickerModal.jsx`, used by
the room-template edit package section. The separate Loom implementation at
`components/studio/room-templates/RoomTemplatePickerModal.jsx` remains
unchanged.
