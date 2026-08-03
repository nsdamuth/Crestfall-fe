# Crestfall Mechanics Abstraction Assessment

**Assessment contract:** `crestfall.loom.mechanics-assessment.v15`
**Status:** `MECHANICS_DECOMPOSITION_CLOSED_READY_FOR_REPOSITORY_EXTRACTION`
**Validated LOOM feature count:** 179
**Mechanics abstraction implemented through this assessment:** M0–M9 complete decomposition

## Executive decision

The main Mechanics editor is not a single portable feature. It is an application orchestrator containing multiple stored-data domains, compatibility rules, preset operations, and whole-document replacement paths. It must not be wrapped or moved wholesale.

The correct path is domain extraction with saved-asset fixture parity at every step. The existing create and edit workflows remain the two authoritative parent assemblies.


## Implementation progress

- **M0 complete:** compatibility fixtures, replacement boundaries, preset freezes, and cross-service gates are frozen.
- **M1 complete:** the shared Mechanics Document Core now owns canonical defaults, legacy alias recovery, malformed-input recovery, selectors, immutable domain replacement helpers, and unknown-field preservation for both create and edit.
- **M2 complete:** the active `instanceData.trackers` editor is extracted into a LOOM package.
- **M3 complete:** the shared effect-level progression profile editor is extracted and injected into the portable composition View from its Binding Shell.
- **M4A complete:** command identity, invocation, typed arguments, presentation flags, and triggers are extracted into the `mechanics-command-core` LOOM package.
- **M4B complete:** command outcome branch modes, summaries, ordering, alias compatibility, and branch effect orchestration are extracted into the `mechanics-command-outcomes` LOOM package while effect-field authoring remains injected from the parent.
- **M5A complete:** ordinary, target, and Progression command requirements are extracted into the `mechanics-command-requirements` LOOM package with `ADVISORY` / `HARD_LOCK` enforcement and legacy alias preservation.
- **M5B complete:** attempt, base, and outcome effect authoring, fixed/argument value binding, and fixed/resolved target binding are extracted into `mechanics-command-effects`; M3 remains the progression-profile authority.
- **M5C complete:** Item, participant-condition, connected-location, active-journey, and outcome-gated domain actions are extracted into `mechanics-command-domain-actions`.
- **M6 complete:** Resolution mode, dice, fixed modifiers, authoritative modifier sources, opposed checks, tie policy, natural outcomes, reference configurations, and degree-of-success bands are extracted into `mechanics-command-resolution`.
- **M7A complete:** `instanceData.defaults` flags, counters, stages, legacy aliases, and unknown metadata preservation are extracted into `mechanics-defaults`.
- **M7B complete:** `instanceData.statusBlocks` identity, placement, visibility, required state, rendered-line ordering, legacy aliases, and unknown metadata preservation are extracted into `mechanics-status-blocks`.
- **M7C complete:** `instanceData.guards` identity, enforcement, condition modes, conditions, summaries, visibility, legacy aliases, and unknown metadata preservation are extracted into `mechanics-guards`.
- **M8 complete:** preset-library and complete-JSON interaction state, transient validation guidance, and semantic whole-document application are extracted into `mechanics-document-orchestration`; the parent retains normalized atomic `replaceData`.
- **M9 complete:** `MechanicsModuleFieldsSection.jsx` is reduced to the create/edit persistence Binding Shell; `mechanics-module-assembly` owns the portable Runtime Fields assembly, local navigation/folds, root-field projection, and composition of every extracted domain.
- **Mechanics decomposition is complete:** no further domain extraction is planned under this assessment. The quarantined Trackers modal remains outside the active caller graph pending explicit product classification.

## Primary source map

| Source | Current classification | Decision |
|---|---|---|
| `MechanicsModuleFieldsSection.jsx` | Thin create/edit persistence Binding Shell, approximately 30 lines after M9 | Preserve normalized atomic complete-document replacement and mount the assembly package |
| `mechanics-module-assembly/MechanicsModuleAssembly.jsx` | Mechanics domain assembly Binding Shell | Compose extracted domain shells and inject them into the portable View without owning persistence |
| `mechanics-module-assembly/MechanicsModuleAssembly.view.jsx` | Portable Runtime Fields assembly View | Keep route, API, auth, and persistence ownership outside the View |
| `TrackersModuleConfigModal.jsx` | Unreferenced legacy/future surface, more than 1,800 lines | Quarantine pending product intent and data-contract review |
| `MechanicsProgressionProfileFields.jsx` | Thin shared progression Binding Shell | Preserve both active callers while the portable View, ViewModel, operations, fixtures, diagnostics, and preview own the extracted domain package |
| `RuntimeMechanicsModulesSection.jsx` | Runtime owner-binding surface | Keep separate from Mechanics Module definition abstraction |

## Active caller map

### Mechanics Module definition editor

- Create: `MechanicsModuleBuilderShell.jsx`
- Edit: `CreationEditSectionContent.jsx`

Both workflows provide atomic replacement of the complete Mechanics `data` object. M9 preserves that operation in the thin `MechanicsModuleFieldsSection.jsx` parent while the assembled editor is injected beneath it.

### Command outcome branches

- `mechanics-module-assembly/MechanicsModuleAssembly.jsx` mounts the extracted `MechanicsCommandOutcomes` Binding Shell.
- Outcome branches inject the extracted `MechanicsCommandEffectCard`; branch modes and effect authoring remain separately owned.

### Progression profile

- `mechanics-module-assembly/MechanicsModuleAssembly.jsx`
- `MechanicsCompositionBuilder.jsx` injects the shared progression Binding Shell into `MechanicsCompositionBuilder.view.jsx`

### Command core

- `mechanics-module-assembly/MechanicsModuleAssembly.jsx` mounts the extracted identity, invocation, argument, presentation, and trigger sections.
- Requirements, outcome branches, effects, and Domain Actions are extracted. Resolution and composition remain in the parent for later bounded extraction.


### Command effects

- `mechanics-module-assembly/MechanicsModuleAssembly.jsx` mounts extracted attempt and base effect lists.
- `MechanicsCommandOutcomes` receives the extracted effect card for branch-specific effects.
- M5B preserves fixed and argument-bound value sources, fixed and resolved-argument target scopes, and unknown effect/binding metadata.
- `PROGRESSION_RECONCILE` continues to inject the M3 progression profile Binding Shell.

### Command domain actions

- `mechanics-module-assembly/MechanicsModuleAssembly.jsx` mounts the extracted `MechanicsCommandDomainActions` Binding Shell.
- M5C preserves Item custody, participant-condition mutation, connected-location transition, active-journey operation, outcome gating, and legacy aliases.
- Runtime execution remains in authoritative Crestfall domain services; the frontend package owns authoring only.


### Command resolution

- `mechanics-module-assembly/MechanicsModuleAssembly.jsx` mounts the extracted `MechanicsCommandResolution` Binding Shell.
- M6 preserves automatic, threshold, and opposed checks; actor and opposition modifiers; authoritative target and Mechanics evidence; tie policy; natural outcomes; and degree-of-success bands.
- Runtime rolling and evidence resolution remain authoritative in services-api; the frontend package owns authoring only.

### Runtime-context domains

- `mechanics-module-assembly/MechanicsModuleAssembly.jsx` mounts the extracted `MechanicsDefaults`, `MechanicsStatusBlocks`, and `MechanicsGuards` Binding Shells.
- M7A preserves flags, counters, stages, bucket aliases, and unknown defaults metadata.
- M7B preserves deterministic status-block placement, visibility, rendered-line ordering, aliases, and unknown block metadata.
- M7C preserves guard enforcement, condition modes, conditions, pass/fail summaries, composer guidance, visibility, aliases, and unknown guard metadata.
- Runtime default hydration, status rendering, guard evaluation, and composer enforcement remain outside these frontend authoring packages.


### Preset, JSON, and final parent assembly

- `MechanicsModuleFieldsSection.jsx` retains `replaceMechanicsData(nextData)` and performs exactly one normalized complete-document `replaceData` call.
- `mechanics-module-assembly` projects the complete document, owns local section navigation/folds, and composes Trackers, Commands, Defaults, Status Blocks, Guards, and M8 orchestration as injected portable View slots.
- `mechanics-document-orchestration` owns modal open/close state, preset validation guidance, and semantic routing from preset/JSON apply events to that parent callback.
- Existing preset application, preset validation, and JSON editor packages remain independently responsible for catalog preview, destructive confirmation, validation, formatting, copy/download behavior, and compatibility canonicalization.
- Ordinary visual edits clear transient preset guidance without changing saved Mechanics data.

### Runtime attachment

- `CreationEditSectionContent.jsx`
- `LocationRuntimeModulesSection.jsx`

Runtime attachment defines which reusable Mechanics Module an owner uses. It is not the definition editor and should not be absorbed into its portable package.

### Trackers modal

No active import or JSX caller exists in the assessed frontend. Absence of a caller is not permission to remove it. The first Mechanics session must classify it as active-future, legacy-compatible, or removable with explicit user approval.

## Domain map

1. Saved-data compatibility and alias normalization
2. Module identity, contract version, priority, triggers, and tags
3. Tracker definitions
4. Tracker phases and mutation hints
5. Progression profiles and observability
6. Command identity, prefix, arguments, and invocation
7. Command requirements and progression enforcement
8. Command outcome branches and presentation
9. Command effects and effect values
10. Effect target binding
11. Domain actions, including location travel
12. Resolution modifiers and modifier sources
13. Mechanics defaults for flags, counters, and stages
14. Status blocks
15. Guards and guard conditions
16. Preset catalog, library, validation, and safe application
17. Whole-document JSON authoring and atomic replacement
18. Legacy fixtures, freeze manifests, and saved-asset migration
19. Runtime module attachment as a separate owner-binding domain

## Required compatibility evidence

The repository already contains assets that must be treated as release contracts rather than incidental implementation:

- compatibility baseline manifest;
- preset freeze and extension-freeze manifests;
- legacy Mechanics fixtures;
- MC8 regression baseline;
- saved-asset migration utility and diagnostics;
- safe preset application and validation diagnostics.

Every extraction must prove that representative old and current assets normalize and save without silent field loss.

## Proposed patch order

1. **Compatibility Freeze and Cross-Service Baseline**
   Run the deferred runtime/composition/advancement audits, inventory representative saved assets, and freeze create/edit round trips.

2. **Shared Normalization and Compatibility**
   Extract only pure normalizers, aliases, identifiers, and default-value rules.

3. **Trackers and Progression**
   Extract tracker definitions, phases, mutation hints, and progression profiles.

4. **Command Core**
   Extract command identity, invocation, arguments, presentation, and outcome shape.

5. **Requirements, Effects, Targets, and Domain Actions**
   Extract requirement enforcement, effect editors, target binding, and travel/domain actions.

6. **Resolution and Outcomes**
   Extract modifier sources, resolution controls, and outcome resolution.

7. **Defaults, Status Blocks, and Guards**
   Extract the remaining runtime-context domains.

8. **Preset and JSON Orchestration**
   Keep safe application, validation, and atomic whole-data replacement at the parent orchestration boundary.

9. **Parent Assembly and Portability Proof**
   Reduce the original parent to a thin assembly shell only after all domain packages pass create/edit compatibility tests.

## Deferred cross-service checks

The following diagnostics remain intentionally outside the frontend-only registered suite because they require `services/api` and/or `services/engine-middleware`:

- Reference runtime implementations
- Character advancement runtime
- Mechanics composition runtime

These are the first validation inputs for the Mechanics session, not optional cleanup.

## Non-negotiable constraints

- No wholesale wrapper around the 8,000-line parent.
- No unrequested storage-key renaming.
- No loss of legacy aliases or saved-asset migration.
- No replacement of atomic `replaceData` with piecemeal updates.
- No mixing Runtime Mechanics attachment with definition authoring.
- No deletion or conversion of the unreferenced Trackers modal without explicit classification.
- One domain-sized unified patch at a time, with exact browser tests.

## Handoff state

The compatibility baseline and first four domain steps are now active. Continue one bounded Mechanics package at a time, with cumulative validation and browser confirmation after every patch.


## M2 tracker extraction status

The active `instanceData.trackers` editor is extracted into the `mechanics-trackers` LOOM package. The location-owned `TrackersModuleConfigModal.jsx` remains unreferenced and is classified as `QUARANTINED_UNREFERENCED_LEGACY_OR_FUTURE`; it was not deleted or folded into the active editor.


## Decomposition progress

- M0 froze compatibility and cross-service expectations.
- M1 established shared document normalization and unknown-field preservation.
- M2 extracted `instanceData.trackers`.
- M3 extracted the shared effect-level progression profile editor and removed its Binding Shell import from the portable composition View.

## M4A command-core extraction status

Command identity, canonical invocation, prefixes, aliases, typed arguments, presentation flags, and trigger phrases are extracted into `mechanics-command-core`. Unknown command, invocation, presentation, and argument metadata remains preserved. Requirements, effects, resolution, outcomes, domain actions, and composition remain untouched.


## M5A command requirements extraction status

- `command.requirements` normalization and visual authoring are owned by `mechanics-command-requirements`.
- Ordinary flag, counter, meter, and stage checks retain their existing operators and values.
- `TARGET_PRESENT` and `TARGET_HELD` retain resolved argument binding.
- All five Progression requirement types retain `ADVISORY` and `HARD_LOCK` enforcement semantics.
- Runtime evaluation remains service-owned and is not changed by M5A.

## Final repository-extraction closeout

M9 browser validation and the complete registered LOOM suite confirm the Mechanics decomposition is complete. The assessment is now closed under `crestfall.loom.mechanics-assessment.v15` with status `MECHANICS_DECOMPOSITION_CLOSED_READY_FOR_REPOSITORY_EXTRACTION`.

The repository-extraction handoff is frozen in:

- `MECHANICS_REPOSITORY_EXTRACTION_CLOSEOUT.md`;
- `mechanicsRepositoryExtractionManifest.mjs`;
- `mechanicsRepositoryExtractionDiagnostics.mjs`.

The external package consumer contract is limited to the assembled Mechanics authoring surface and shared complete-document normalization. Crestfall retains Creation binding, normalized atomic replacement, create/edit page persistence, and Save behavior.

The frozen portable runtime graph contains 107 reachable source files. Its only ordinary runtime package dependencies are React and `lucide-react`. One host UI seam remains explicit: the Mechanics JSON Editor View imports Crestfall's generic `ModalShell`. That seam must be resolved during physical extraction without introducing application, auth, routing, API, service, or persistence ownership into the portable package.

### Final stop boundary

Commit the complete M0–M9 decomposition and this closeout together. Do not begin physical repository extraction in the same change set. The next session begins from that clean commit and performs only the move, package export wiring, host import replacement, and two-repository validation unless a separate feature patch is explicitly approved.
