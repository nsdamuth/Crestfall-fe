# Room Template Summary Loom Feature

## Public Shell

```text
components/studio/room-templates/RoomTemplateSummary.jsx
```

The Shell preserves the existing public API:

```jsx
<RoomTemplateSummary
  selectedCharacters={selectedCharacters}
  selectedScenario={selectedScenario}
  selectedNarrator={selectedNarrator}
  selectedLocation={selectedLocation}
/>
```

## Portable View

```text
components/studio/room-templates/room-template-summary/RoomTemplateSummary.view.jsx
```

The View receives display-ready summary rows only. It does not receive raw
character, Scenario, Narrator, or Location records and does not know picker,
builder, save, API, or persistence behavior.

## ViewModel

```text
components/studio/room-templates/room-template-summary/useRoomTemplateSummaryViewModel.js
```

The ViewModel owns selected-character counting, selected-reference title
normalization, and the existing `None selected`, `Not selected`, and `Optional`
fallbacks.

## Live Caller

```text
components/studio/create/room-template/RoomTemplateBuilderShell.jsx
```

The same-named file under
`components/studio/create/room-template/RoomTemplateSummary.jsx` is a separate,
currently unreferenced component and is not part of this feature.

## Preview

```text
/dev/ui-preview/room-template-summary
```

The preview renders direct View-contract fixtures only. It does not load or
modify a Story draft, open pickers, call an API, or save data.
