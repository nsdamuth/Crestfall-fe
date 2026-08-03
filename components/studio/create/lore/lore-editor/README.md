# Lore Editor LOOM Package

**Contract:** `lore_document_contract_v4`

## Purpose

Provides controlled structured authoring for Lore chapters, sections, blocks,
references, image selections, and JSON round-trip editing.

## Boundary

```text
LoreEditor.jsx
  → useLoreEditorViewModel.js
  → LoreEditor.view.jsx
```

- The Binding Shell injects the application-owned Lore JSON Editor modal.
- The ViewModel owns normalization, legacy compatibility, reference loading,
  mutations, validation, image-library selection, and semantic callbacks.
- The portable View owns authoring presentation and local presentation-only
  controls such as block-picker visibility.

The View never saves a Creation and no longer imports a Binding Shell.

## Package assets

- `LoreEditor.contract.js`
- `LoreEditor.fixtures.js`
- `loreEditorDiagnostics.mjs`
- `/dev/ui-preview/lore-editor`

The preview renders fixtures and does not fetch references or image libraries.
