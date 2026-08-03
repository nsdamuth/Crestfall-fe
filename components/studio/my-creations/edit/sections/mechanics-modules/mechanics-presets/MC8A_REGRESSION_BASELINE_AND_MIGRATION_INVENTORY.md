# Crestfall MC8A — Regression Baseline and Migration Inventory

**Status:** BASELINED  
**Phase:** MC8A  
**Compatibility manifest:** `mechanics_compatibility_baseline_manifest_v1`  
**Legacy fixture inventory:** `mechanics_legacy_fixture_inventory_v1`  
**Fixture state:** `INVENTORIED_NOT_MIGRATED`

## Purpose

MC8A establishes the authoritative regression and compatibility baseline for the
Advanced Mechanics Module before saved-asset or runtime-state migration begins.
It adds no new Mechanics capability and performs no data migration.

**No runtime behavior changes, database changes, PostGraphile changes, API
contract changes, preset changes, or automatic saved-asset mutations are made by
this batch.**

## Frozen baseline

- 20 frozen core MC7 presets
- 2 frozen additive MC7X presets
- 22 presets in the live Preset Library
- 5 frozen MC7 reference runtime implementations
- Core freeze manifest remains `mechanics_preset_freeze_manifest_v1`
- Extension freeze remains `mechanics_preset_extension_freeze_manifest_v1`
- Preset Library UI baseline remains MC7X.2.3

## Contract inventory

### MC1 — command and typed invocation

- `mechanics_command_contract_v1`
- `mechanics_command_invocation_v1`
- `mechanics_effect_target_binding_v1`

### MC2 — outcomes

- `mechanics_command_outcomes_v1`

The original resolution capability is represented by the final frozen MC5 v6
resolution contract below.

### MC3 — requirements and target-scoped state

- `mechanics_command_requirements_v1`
- `trackers_instance_data.v0_2`

### MC4 — authoritative domain adapters

- `mechanics_command_domain_action_v1`
- `mechanics_command_domain_adapter_service_v1`

### MC5 — additional resolution

- `mechanics_command_resolution_v6`
- `mechanics_command_resolution_service_v6`
- `mechanics_authoritative_modifier_resolution_v1`

### MC6 — action/effect composition

- `mechanics_command_composition_v1`
- `mechanics_command_composition_plan_v1`
- `mechanics_command_composition_condition_v1`
- `mechanics_command_composition_continuation_v1`
- `mechanics_command_composition_service_v5`
- `mechanics_command_composition_continuation_service_v1`
- `mechanics_command_domain_composition_v1`
- `mechanics_command_persistent_audit_v1`

### MC7 and MC7X — presets and progression

The complete frozen preset and extension contract inventories are recorded in
`mechanicsCompatibilityBaselineManifest.js` and checked against the existing
MC7 freeze manifests on every MC8A diagnostic run.

## Authoritative diagnostic entry points

From the repository root:

```bash
npm run diagnostics:mc8a
```

For preflight without executing child diagnostics:

```bash
node components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc8RegressionBaseline.mjs --preflight-only
```

From `services/api`:

```bash
npm run diagnostics:mc8a
```

The root runner preflights every required path before executing any diagnostic.
Required groups are kept separate as FRONTEND, SERVICES_API, CROSS_TIER, and
FREEZE_GATE.

## Migration inventory established

MC8A records confirmed and synthetic compatibility fixtures for:

- pre-MC1 legacy trigger-only commands;
- pre-MC6 commands without authored composition;
- historical resolution-v1 saved command shapes;
- the frozen twenty-preset core-only library;
- the intermediate twenty-one-preset MC7X library;
- the legacy character-advancement preset alias;
- saved advancement snapshots created before `/progress` observability;
- missing optional Mechanics collections.

These fixtures identify migration inputs and expected treatment only. They do
not execute normalization, persist replacements, or modify user assets.

## Package changes

Two diagnostics-only scripts are added:

- root `diagnostics:mc8a` — complete grouped regression baseline;
- services-api `diagnostics:mc8a` — bounded service contract inspection.

The existing root build/lint scripts and services-api start/dev/MC4G scripts
remain unchanged.

## Architecture boundary

- Frontend and LOOM authoring remain API-free at the View level.
- services-api remains authoritative for command execution and Mechanics state.
- No direct frontend Supabase or PostGraphile access is introduced.
- Normal creation Save remains the only authored Mechanics persistence boundary.
- No migration writes occur in MC8A.

## Handoff to MC8B

MC8B may implement saved Mechanics asset normalization only after it defines:

1. canonical input/output contracts;
2. fixture-by-fixture expected transformations;
3. dry-run and idempotency behavior;
4. atomic rejection and rollback rules;
5. explicit handling for snapshots that must not be silently upgraded.
