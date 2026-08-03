# Mechanics Repository Extraction Closeout

**Contract:** `crestfall.loom.mechanics-repository-extraction.v1`
**Status:** `READY_FOR_EXTERNAL_REPOSITORY_EXTRACTION_AFTER_COMMIT`
**Validated feature count:** 179
**Validated Mechanics sequence:** M0–M9 complete
**No runtime behavior changes:** this patch adds documentation, manifests, and diagnostics only.

## Closeout decision

The M0–M9 decomposition is complete. `MechanicsModuleFieldsSection.jsx` is now the thin Crestfall host Binding Shell, while the Mechanics assembly and domain authoring packages form a portable dependency graph beneath it.

This patch does not move source code to another repository. It freezes the exact extraction boundary so the current repository can be committed and safely paused before physical extraction begins.

## Public consumer boundary

Crestfall must continue to own:

- the current Creation `data` binding;
- normalized atomic replacement of the complete Mechanics document;
- create/edit persistence and page Save behavior;
- any Crestfall-specific visual adapter required by the external package.

The external package must expose:

- `MechanicsModuleAssembly`;
- `normalizeMechanicsDocument`.

The host passes:

```text
mechanicsData
updateDataField
canReplaceData
onReplaceMechanicsData
```

No external package component may own auth, routing, product-data APIs, services-api calls, PostGraphile, Supabase, database persistence, or page Save behavior.

## Frozen package inventory

Move these Mechanics package directories together:

```text
mechanics-command-core
mechanics-command-domain-actions
mechanics-command-effects
mechanics-command-outcomes
mechanics-command-requirements
mechanics-command-resolution
mechanics-compatibility-baseline
mechanics-composition-builder
mechanics-core
mechanics-defaults
mechanics-document-orchestration
mechanics-guards
mechanics-json-editor
mechanics-module-assembly
mechanics-preset-application
mechanics-preset-validation
mechanics-presets
mechanics-progression-profile
mechanics-saved-asset-migration
mechanics-status-blocks
mechanics-trackers
```

Move the supporting Mechanics builders and their diagnostics with those directories. Preserve all contracts, fixtures, README files, compatibility manifests, preset freezes, legacy fixtures, and saved-asset migration evidence.

The frozen runtime graph currently contains **107 source files** reachable from the assembly and document-normalization entrypoints.

## External dependencies and host seam

The runtime graph has two ordinary package dependencies:

```text
react
lucide-react
```

One Crestfall UI seam remains explicit:

```text
@/components/ui/ModalShell
```

It is imported only by `mechanics-json-editor/MechanicsJsonEditorModal.view.jsx`. During repository extraction, either move a generic ModalShell primitive into the package or inject an equivalent host adapter. Do not alter that behavior in this closeout patch.

## Explicitly excluded host surfaces

Do not move these into the portable definition-authoring package:

- `RuntimeMechanicsModulesSection.jsx` — runtime owner/module attachment;
- `MechanicsModulePickerModal.jsx` and `mechanics-module-picker/` — Crestfall creation lookup and attachment workflow;
- `TrackersModuleConfigModal.jsx` — quarantined unreferenced legacy/future surface pending explicit classification.

## Required extraction proof

After physical separation, run diagnostics in both repositories and browser-test:

```text
/dev/ui-preview/mechanics-module-assembly
/studio/create/mechanics-module
/studio/my-creations/<mechanics-module-id>/edit
```

Prove:

- complete assembly rendering and folding;
- current and legacy document normalization;
- preset preview/application and destructive confirmation;
- JSON format/reset/copy/download/validate/apply behavior;
- invalid JSON atomic rejection;
- complete-document replacement;
- create/edit parity;
- save and reload persistence;
- unknown metadata preservation;
- no direct auth, route, API, service, Supabase, PostGraphile, or database dependency in the external package.

## Commit boundary

Apply and validate this closeout patch, then commit the complete M0–M9 Mechanics decomposition and closeout together.

After that commit, stop. Do not begin physical extraction in the same change set. The next work session should begin from the clean committed boundary, create the external repository, and move the frozen package graph without feature edits or storage-contract changes.
