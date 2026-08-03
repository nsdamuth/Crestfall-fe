# LOOM Diagnostic Hardening

This package documents and verifies the frontend diagnostic closeout completed before the Mechanics abstraction assessment.

## Runtime scope

This hardening does not change a production View, ViewModel, client, API route, service, storage field, or Mechanics implementation. It only:

- updates the Media History Grid integration assertion to the validated Image Studio Workbench injection boundary;
- exposes clean standalone diagnostics through `package.json`;
- documents diagnostics that remain intentionally outside the frontend-only closeout.

## Newly registered standalone diagnostics

- Creation Studio
- Progression JSON Editor
- Mechanics JSON Editor
- MC7 Preset Library Layout
- MC7 Builder Live Validation
- MC7 Command Starter Preset
- MC7 Module Starter Preset
- MC7 Preset Application
- MC7 Reference Preset Catalog

Registering a Mechanics-related diagnostic does not begin Mechanics abstraction. These commands inspect the current frozen implementation only.

## Intentionally deferred diagnostics

The following files are not added to the frontend-only aggregate by this patch:

- `lorePatchDiagnostics.mjs` requires the current `services/api` Lore routes and services.
- `mechanicsCompositionBuilderDiagnostics.mjs` and `mc7ReferenceRuntimeImplementationDiagnostics.mjs` require `services/engine-middleware`.
- `mc7xCharacterAdvancementDiagnostics.mjs` requires `services/api` Mechanics runtime files.
- Actor Mechanics Profile, Rules Codex, and Stats Pools JSON diagnostics import React-backed ViewModels and must be run in the installed full repository during their domain validation.

These are classified as unavailable cross-service or installed-dependency diagnostics, not silently treated as passing frontend diagnostics.

## Commands

```bash
npm run diagnostics:loom:media-history-grid
npm run diagnostics:loom:diagnostic-hardening
```
