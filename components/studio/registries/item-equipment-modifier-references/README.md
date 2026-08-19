# Item Equipment Modifier References presentation semantics

Status: semantic authoring contract and realistic fixtures only.

This package brings the current Item Registry equipment-modifier reference shape
into the FE lane without copying the legacy editor UI.

## Current product semantics represented

Each Item entry may author up to 16 optional references with:

- reference ID
- enabled state
- Stats & Pools binding ID
- modifier definition ID
- stack count from 1 to 1000
- metadata

The persisted reference contract remains:

```text
item_equipment_modifier_reference_v0
```

Legacy/alternate property names are normalized for compatibility:

```text
stats_pools_binding_id / bindingId / binding_id
modifier_definition_id / definitionId / definition_id
```

## Permanent boundary

The Item Registry stores **references only**.

Stats & Pools owns modifier definitions.
The equipping actor's Actor Mechanics Profile resolves the referenced binding at
runtime.

Crestfall remains authoritative for:

- modifier definition lookup
- Actor Mechanics Profile binding resolution
- equip/unequip authorization
- applying/removing runtime modifier state
- persistence and mutation

Crestfall-fe owns presentation of the authored references only.

## Visual integration

The legacy `ItemEquipmentModifierReferencesEditor.jsx` is not copied. The FE
lane can re-express this semantic package through its current registry/editor
vocabulary after the relevant visual surface is ruled.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
