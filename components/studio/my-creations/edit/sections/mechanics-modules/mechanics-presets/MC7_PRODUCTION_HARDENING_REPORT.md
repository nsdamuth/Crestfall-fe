# Crestfall MC7 Production Hardening Report

**Phase:** MC7G — Preset Regression, Production Hardening, and Freeze  
**Status:** FROZEN  
**Freeze manifest:** `mechanics_preset_freeze_manifest_v1`

## Frozen catalog

MC7 closes with **20 presets**:

- 6 Resolution references
- 4 Composition references
- 5 Command starters
- 5 complete Mechanics Module starters

The five complete module starters retain one registered MC7E reference runtime implementation each.

## Frozen contracts

- `mechanics_preset_catalog_v1`
- `mechanics_preset_definition_v1`
- `mechanics_preset_payload_v1`
- `mechanics_preset_application_v1`
- `mechanics_preset_live_validation_v1`
- `mechanics_reference_runtime_implementation_v1`
- `mechanics_command_resolution_v6`
- `mechanics_command_composition_v1`
- `core.trackers.v1`
- `trackers_instance_data.v0_2`

## Frozen application modes

- `REPLACE_BLOCK`
- `REPLACE_COMMAND`
- `MERGE_COMMAND`
- `REPLACE_MODULE`
- `MERGE_MODULE`

Preset application remains clone-first, compliance-validated, and atomic. Conflicting command identities, invocation tokens, module IDs, tracker IDs, guard IDs, status-block IDs, defaults, and incompatible module definitions reject without mutating the open builder state.

## MC7G hardening

MC7G adds a fail-safe replacement boundary to `MechanicsModuleFieldsSection`:

- Preset Library and JSON Editor actions are disabled when an atomic `replaceData` callback is unavailable.
- Modal rendering is gated behind the same capability check.
- One guarded helper owns complete Mechanics data replacement.
- Manual visual edits clear stale preset validation guidance.
- JSON replacement clears guidance generated for an older preset state.
- Create and edit workflows are audited to provide the atomic replacement callback.

This prevents a missing integration prop from producing a browser `TypeError` and prevents transient validation instructions from describing a configuration that has since been manually changed.

## LOOM and architecture boundaries

The preset and validation Views remain API-free and persistence-free. ViewModels own application orchestration, preview state, validation projection, and clipboard behavior. The ordinary create/edit Save paths remain the only persistence boundary.

MC7 adds no direct Supabase, PostGraphile, services-api, database, or runtime-mutation bypass.

## Live validation evidence

The user validated the complete workflow:

1. Create a Mechanics Module from a preset.
2. Save it.
3. Reopen it for editing.
4. Merge a second preset.
5. Save again.
6. Reload and confirm both authored configurations persist.

MC7F.1 corrected the create-flow atomic replacement prop before this validation.

## Freeze rule

Future preset additions or contract changes must intentionally advance the relevant version and update the MC7 freeze manifest and production hardening audit. Silent catalog drift is not permitted.
