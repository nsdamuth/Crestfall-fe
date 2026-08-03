# MC7A — Reference Preset Contract and Catalog

**Status:** Foundation batch

**Catalog version:** `mechanics_preset_catalog_v1`

**Definition version:** `mechanics_preset_definition_v1`

**Payload version:** `mechanics_preset_payload_v1`

## Purpose

MC7A establishes the stable authoring contract used by later MC7 command and
module presets. It does not add a new runtime execution layer and does not yet
add preset-selection UI.

The first catalog entries wrap the already validated MC5 resolution references
and MC6 composition references:

- 6 command-resolution references
- 4 command-composition references

## Boundaries

Each entry declares:

- stable namespaced preset ID and revision
- semantic scope and category
- source reference identity
- applicability and required typed arguments
- default and allowed apply modes
- exact replacement paths
- paths that must remain preserved
- preview label, summary, badges, and tags
- implementation status and originating MC phase

Current MC7A references use only `REPLACE_BLOCK`:

- resolution references replace `command.resolution`
- composition references replace `command.composition`

No command, module, unrelated field, database record, or runtime state is
silently replaced.

## Compatibility

Catalog payloads preserve:

- `mechanics_command_resolution_v6`
- `mechanics_command_composition_v1`
- `core.trackers.v1`
- `trackers_instance_data.v0_2`

Every catalog payload is inserted into a complete Mechanics Module fixture and
validated through the existing Mechanics JSON compliance validator.

## Deferred to later MC7 batches

- MC7B command-level starter payloads
- MC7C complete module payloads
- MC7D apply/merge/replace orchestration
- MC7E runnable reference implementations
- MC7F LOOM catalog UI and live authoring integration
- MC7G regression and production freeze
