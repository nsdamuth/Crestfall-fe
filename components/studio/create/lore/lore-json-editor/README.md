# Lore JSON Editor LOOM Package

**Contract:** `lore_json_editor_view_contract_v1`

## Purpose

Provides a complete JSON round-trip authoring tool without moving Creation
persistence into the modal.

## Boundary

```text
LoreJsonEditorModal.jsx
  → useLoreJsonEditorViewModel.js
  → LoreJsonEditorModal.view.jsx
```

- The Binding Shell composes the ViewModel and portable View.
- The ViewModel owns JSON draft state, copy, format, reset, guide download,
  validation, normalization, apply, and close decisions.
- The portable View owns modal presentation and semantic callbacks.
- `loreJsonEditor.validation.js` validates one complete Lore document before
  replacement.
- `loreJsonAiAuthoringGuide.js` builds the downloadable authoring guide.

## Safety and persistence

The JSON flow may reuse references already present in the open Lore document.
It cannot authorize invented Character, Location, or image identifiers. Apply
replaces only the controlled editor value; the normal Creation save remains the
persistence boundary.

## Package assets

- `LoreJsonEditorModal.contract.js`
- `LoreJsonEditorModal.fixtures.js`
- `loreJsonEditorDiagnostics.mjs`
- `/dev/ui-preview/lore-json-editor`
