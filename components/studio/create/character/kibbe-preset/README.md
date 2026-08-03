# Kibbe Preset Modal LOOM Package

**Contract:** `KibbePresetModal.contract.js`

## Purpose

Provides an optional creator shortcut for applying a Kibbe-inspired adult body
identity while preserving explicit body fields as the authoritative data.

## Boundary

```text
KibbePresetModal.jsx
  → useKibbePresetModalViewModel.js
  → KibbePresetModal.view.jsx
```

- The ViewModel owns pending selection, preset projection, and the three
  semantic commit modes: identity only, fill empty fields, and replace traits.
- The portable View owns modal presentation.
- The parent Character creator remains the persistence owner.

## Package assets

- `KibbePresetModal.contract.js`
- `KibbePresetModal.fixtures.js`
- `kibbePresetModalDiagnostics.mjs`
- `/dev/ui-preview/kibbe-preset`

The preview is fixture-only and does not save Character data.
