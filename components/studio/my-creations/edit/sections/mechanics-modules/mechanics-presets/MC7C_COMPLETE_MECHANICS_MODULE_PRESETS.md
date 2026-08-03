# MC7C — Complete Mechanics Module Presets

**Status:** Built and diagnostic-validated

**Module starter contract:** `mechanics_module_starter_presets_v1`

## Purpose

MC7C adds complete authored Mechanics Module configurations to the MC7 preset catalog. Unlike MC7A block references and MC7B command starters, these presets provide the entire `creation.data` module object as one compliance-validated unit.

MC7C defines data and catalog boundaries only. Live apply, replace, merge, confirmation, and rollback behavior remains MC7D.

## Included module starters

- `module.resource_loop.v1`
- `module.social_probe.v1`
- `module.item_handoff.v1`
- `module.travel_navigation.v1`
- `module.quest_progress.v1`

Each module supplies the canonical `core.trackers.v1` identity, `trackers_instance_data.v0_2`, commands, guards, status blocks, defaults, and any required trackers.

## Application boundary

```text
scope: MODULE
category: MODULE_STARTER
applyMode: REPLACE_MODULE
replacementPaths:
  - module
```

The replacement boundary preserves the surrounding creation record, including identity, ownership, title, publication state, rating, media, and timestamps. It replaces only the authored Mechanics Module data object.

No merge behavior is activated in MC7C.

## Reference implementations

### Resource Loop

A resource meter with phases, a five-point attempt cost, threshold resolution, success/failure counters, a minimum-resource hard lock, and deterministic status output.

### Social Probe Module

A trust meter with phases, an opposed Character-targeted command, target-scoped success state, attempt/success/failure counters, a trust hard lock, and deterministic status output.

### Item Handoff

A typed held-Item to present-Character transfer using the authoritative Item domain lane, an enablement flag and hard lock, counters, stage defaults, and private status output.

### Travel Navigation

A typed Location transition using the authoritative Location domain lane, a travel-enable flag and hard lock, command counters, stage defaults, and private status output. The Location action remains final.

### Quest Progress

A staged progression example using ordered attempt/outcome steps, pending-state counter conditions, prior-step dependencies, stage mutation, flag clearing, a soft-lock guard, defaults, and deterministic status output.

## Compliance

Every module is validated by `mechanicsJsonEditor.validation.js` as a complete Mechanics Module data object. The catalog payloads retain:

- `mechanics_command_resolution_v6`
- `mechanics_command_composition_v1`
- `core.trackers.v1`
- `trackers_instance_data.v0_2`

## Deliberate exclusions

MC7C does not add:

- live preset selectors or modals
- automatic mutation of the open builder
- merge semantics
- conflict resolution
- save or persistence behavior
- database, PostGraphile, services-api, or engine execution changes

Those concerns remain assigned to MC7D and MC7F.
