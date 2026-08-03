# Room Template Picker Modal

## Purpose

Allows the Story/room-template builder to choose characters, a scenario, a
narrator, or a location without coupling the modal presentation to raw
Crestfall creation objects or room-template form behavior.

## Feature structure

```text
RoomTemplatePickerModal.jsx
room-template-picker/
  RoomTemplatePickerModal.view.jsx
  useRoomTemplatePickerViewModel.js
  RoomTemplatePickerModal.contract.js
  RoomTemplatePickerModal.fixtures.js
  README.md
```

The existing `components/studio/room-templates/RoomTemplatePickerModal.jsx`
path remains the Binding Shell.

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
recommendedIds
onClose()
onToggleCharacter(item)
onSelectScenario(item)
onSelectNarrator(item)
onSelectLocation(item)
```

The Shell and ViewModel preserve this application-facing contract. The
portable View receives display-ready reference cards and emits an item ID.

## View ownership

The View owns:

- modal structure, headings, icon treatment, and responsive layout
- search and empty-state presentation through `CreationPickerPanel`
- selected and recommended card treatment
- safe invocation of close and choose callbacks

`CreationPickerPanel` manages only presentation-local search state and does not
load or save application data.

## ViewModel ownership

The ViewModel:

- maps the active picker mode to labels, descriptions, icons, and empty text
- selects the correct raw option collection
- converts raw options into display-ready cards
- derives selected and recommended IDs
- translates a semantic item-ID selection back to the original raw object
- invokes the existing mode-specific application callback unchanged

## Isolated preview

```text
/dev/ui-preview/room-template-picker
```

The route is unavailable in production. It does not load creations, alter a
Story package, apply scenario recommendations, or persist application data.

## Compatibility note

This feature covers the existing
`components/studio/room-templates/RoomTemplatePickerModal.jsx` implementation.
The separate legacy picker at
`components/studio/create/room-template/RoomTemplatePickerModal.jsx` is not
moved or changed by this conversion.
