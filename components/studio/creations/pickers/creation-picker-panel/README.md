# Creation Picker Panel Portable View

## Public Portable Entry Point

```text
components/studio/creations/pickers/CreationPickerPanel.jsx
```

The public file preserves the existing import path and re-exports the portable
View. Its public props remain unchanged:

```text
items
selectedIds
disabledIds
recommendedIds
searchPlaceholder
emptyMessage
actions
gridClassName
onSelect
```

## Why This Shared Surface Has No ViewModel

`CreationPickerPanel` was already API-free and persistence-free. Its only state
is presentation-local search text, which the Loom rules explicitly allow a
portable View to own.

Several validated portable Views import this shared component directly. Adding
a Shell/ViewModel here would make those portable Views indirectly depend on an
application binding layer. The safer normalization is therefore:

```text
public portable re-export
→ portable View with presentation-local search
→ semantic onSelect(item)
```

This is a shared portable primitive, not an application feature chassis.

## Portable View

```text
components/studio/creations/pickers/creation-picker-panel/
  CreationPickerPanel.view.jsx
```

The View owns search text, presentation filtering, the optional visual action
slot, card layout, image/fallback display, selected/recommended/disabled badges,
and the empty state.

It does not know how a selected item is applied, picker ownership, registry
persistence, Image Studio behavior, APIs, permissions, or storage. Callers may
retain additional fields on an item; the View ignores those fields and returns
the chosen item unchanged to the owning workflow.

The View imports `lucide-react` as a general visual dependency and uses
Crestfall Tailwind/theme tokens supplied by the host application.

## Contract and Fixtures

```text
components/studio/creations/pickers/creation-picker-panel/
  CreationPickerPanel.contract.js
  CreationPickerPanel.fixtures.js
```

Current View contract version:

```text
CREATION_PICKER_PANEL_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures are direct View props. They contain synthetic display data and no real
creation IDs, private user data, API behavior, or persistence logic.

## Development Preview

```text
/dev/ui-preview/creation-picker-panel
```

The preview is development-only and returns `notFound()` in production. Search,
selection, and action-slot examples affect only local preview state.

## Live Validation

The shared panel currently has five placements across four files:

```text
components/studio/room-templates/room-template-picker/
  RoomTemplatePickerModal.view.jsx

components/studio/image-studio/ingredient-picker/
  IngredientPickerModal.view.jsx

components/studio/create/npc-registry/npc-entry/
  NpcEntryModal.view.jsx

components/studio/create/location-registry/
  LocationRegistryBuilder.jsx
```

Validate Story package selection, Image Studio ingredient selection, NPC entry
character linking, Location Registry location linking, and Location Registry
NPC-person linking. Confirm search, selected/recommended/disabled states, image
fallbacks, and original-object callbacks remain unchanged.
