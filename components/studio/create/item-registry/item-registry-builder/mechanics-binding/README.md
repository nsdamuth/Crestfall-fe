# Item Registry Builder ↔ Mechanics Authoring binding

Status: additive FE presentation binding only.

This package connects the already accepted Item Operation Authoring and
Equipment Modifier Reference semantics to the existing FE-owned Item Registry
Builder contract.

It deliberately does **not** replace or edit:

```text
ItemRegistryBuilder.view.jsx
useItemRegistryBuilderViewModel.js
ItemRegistryBuilder.contract.js
```

## Existing FE authority

The portable Item Registry Builder remains FE presentation authority:

```text
item-registry-builder.view.v1
```

The current FE snapshot does not yet expose the newer source editors for Item
operation requirements, typed effects, or equipped modifier references.

This binding is the migration seam for those controls.

## Accepted semantic packages

The binding directly consumes the already accepted FE semantic contracts:

```text
item_operation_authoring.presentation.v1
item_equipment_modifier_reference.presentation.v1
```

That means it does not invent a second Item operation language or modifier
reference shape.

## Equipment Effects

Per Item entry, the binding exposes:

```text
Equipment Effects
```

with the current maximum:

```text
16 references
```

Each reference remains only a pointer to an existing Stats & Pools modifier
definition.

The Item Registry does not own the modifier definition and the FE does not apply
or remove runtime modifiers.

## Operation Requirements

Per Item entry, the binding exposes:

```text
Operation Requirements
```

with the current maximum:

```text
16 requirement sets
```

Requirement objects use the accepted typed Mechanics requirement language.

The presentation copy explicitly states that runtime authorization remains
authoritative.

## Operation Effects

Per Item entry, the binding exposes:

```text
Operation Effects
```

with the current maximum:

```text
32 typed effect references
```

The accepted typed operation catalog currently exposes nine authoring shapes
across Stats/Pools, Progression, Skills, Wallet, and Ability/Spell.

Authoring an effect reference does not grant execution authority.

## Source callback seam

The newer Chassis Builder already uses these semantic callback names:

```text
onAddEquipmentModifierReference
onUpdateEquipmentModifierReference
onRemoveEquipmentModifierReference
onAddOperationRequirementSet
onUpdateOperationRequirementSet
onRemoveOperationRequirementSet
onAddOperationEffectReference
onUpdateOperationEffectReference
onRemoveOperationEffectReference
```

This binding carries that callback shape without copying Chassis mutation logic.

## Active entry state

All three mechanics-authoring sections are disabled when no active Item entry is
selected.

At the configured limits, their Add actions become unavailable.

The FE binding does not create placeholder definitions itself. Add/update/remove
behavior remains Chassis application ViewModel authority.

## Permanent boundary

Crestfall owns:

- Item Registry normalization
- creation of empty authoring rows
- add/update/remove operations
- active-entry application state
- payload construction
- draft/save persistence
- Item action authorization
- requirement evaluation
- typed operation registration/execution
- Stats & Pools modifier resolution
- actor state mutation

Crestfall-fe owns:

- Equipment Effects visual composition
- Operation Requirements visual composition
- Operation Effects visual composition
- limits/counts/empty states
- semantic callbacks into Chassis

## Why the newer source editors are not copied

The current Crestfall source View imports application-era editors directly:

```text
ItemEquipmentModifierReferencesEditor
ItemOperationRequirementSetsEditor
ItemOperationEffectReferencesEditor
```

Hard-copying the source View would overwrite the FE-owned Builder and preserve
presentation/application coupling.

This binding lets the FE lane rebuild those controls in its current design
vocabulary while the Chassis Binding Shell owns the application ViewModel.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
