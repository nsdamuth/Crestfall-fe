# Crestfall MC8B — Saved Mechanics Asset Migration and Legacy-Shape Normalization

**Status:** IMPLEMENTED AND DIAGNOSTICALLY VALIDATED  
**Phase:** MC8B  
**Migration contract:** `mechanics_saved_asset_migration_v1`

## Purpose

MC8B implements a deterministic compatibility layer for authored Mechanics Module
JSON that was saved before later Advanced Mechanics contracts were introduced.
It does not migrate room/session state and does not write to Crestfall storage.

## Safety boundary

- Analysis is dry-run by default.
- The input object is never mutated.
- Applying a result requires explicit confirmation and returns only an in-memory
  replacement clone.
- The ordinary creation Save action remains the only product persistence boundary.
- **No database migration, PostGraphile change, services-api write path, or direct
  Supabase access is introduced.**
- Invalid canonical output rejects atomically and returns no replacement data.
- Re-running safe normalization is idempotent.

## Safe normalizations

MC8B may normalize these structural compatibility gaps without inventing authored
content:

- missing `moduleId` mirrors the canonical module definition identity;
- top-level and instance-data contract versions normalize to
  `trackers_instance_data.v0_2`;
- absent optional `trackers`, `commands`, `guards`, and `statusBlocks` collections
  normalize to empty arrays;
- absent default `flags`, `counters`, and `stages` collections normalize to empty
  arrays;
- commands missing MC6 composition receive an empty
  `mechanics_command_composition_v1` block;
- historical resolution shapes canonicalize through the existing frozen
  resolution builder and validator;
- unknown top-level and instance metadata remains preserved.

## Explicit-action cases

MC8B deliberately refuses silent semantic expansion:

1. A trigger-only legacy command does not automatically gain a new structured
   command surface. A simple one-token trigger may be synthesized only when the
   caller explicitly enables `allowInvocationSynthesis` and confirms application.
   Multi-word legacy triggers remain intact instead of being guessed.
2. A Character Advancement snapshot created before MC7X.2 does not silently gain
   `/progress`. The existing `module.character_advancement_readout.v1` preset must
   still be applied explicitly with `MERGE_MODULE`.
3. Catalog manifests and preset lookup records are inventory metadata, not saved
   Mechanics Module assets, and return `NOT_APPLICABLE`.

## Developer API

```js
analyzeMechanicsSavedAssetMigration(value, options)
applyMechanicsSavedAssetMigration({ value, confirmed, allowInvocationSynthesis })
analyzeMechanicsSavedCommandMigration(command, options)
analyzeMechanicsSavedResolutionMigration(resolution)
```

The analysis result includes status, changed paths, bounded notices, required
explicit actions, validator evidence, and a canonical replacement clone when safe.

## File dry-run utility

The CLI never overwrites its input file.

```bash
node components/studio/my-creations/edit/sections/mechanics-modules/\
mechanics-saved-asset-migration/mc8SavedAssetMigrationCli.mjs \
  --input mechanics.json
```

To write a separately named normalized copy:

```bash
node components/studio/my-creations/edit/sections/mechanics-modules/\
mechanics-saved-asset-migration/mc8SavedAssetMigrationCli.mjs \
  --input mechanics.json \
  --apply --confirm \
  --output mechanics.normalized.json
```

## Diagnostics

```bash
npm run diagnostics:mc8b
```

This first executes the complete MC8A baseline, then validates migration dry-run,
idempotency, legacy fixtures, explicit-action gates, atomic rejection, metadata
preservation, and the architecture boundary.

## Handoff to MC8C

MC8C may connect this compatibility analysis to runtime-state hydration and
persistence compatibility. It must not convert the MC8B in-memory authoring utility
into a direct database write path or silently add optional snapshot features.
