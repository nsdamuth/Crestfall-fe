# Progression Profile JSON Editor LOOM Feature

**Status:** In-repository LOOM feature

**Contract version:** `progression_json_editor_view_contract_v1`

## Purpose

This feature gives Progression Profile authors a complete JSON round-trip tool
without moving persistence or creation-edit ownership into the modal.

```text
ProgressionProfileEditor.jsx
    ↓
useProgressionProfileEditorViewModel.js
    ↓ opens
ProgressionJsonEditorModal.jsx
    ↓
useProgressionJsonEditorViewModel.js
    ↓ semantic View contract
ProgressionJsonEditorModal.view.jsx
```

## Layer responsibilities

- `ProgressionJsonEditorModal.jsx` is the binding shell.
- `useProgressionJsonEditorViewModel.js` owns JSON draft state, copy, format,
  reset, guide download, validation, normalization, apply, and close decisions.
- `ProgressionJsonEditorModal.view.jsx` owns modal presentation and invokes only
  semantic callbacks.
- `progressionJsonEditor.validation.js` parses and validates one complete
  Progression Profile before any replacement occurs.
- `progressionJsonAiAuthoringGuide.js` generates a downloadable Markdown guide
  that includes the current normalized profile and contract constraints.

## Authority boundary

The JSON editor authors reusable Progression definitions only. Actor-owned XP,
current level, unspent points, state revision, namespaces, ownership, bindings,
reward history, and mutations remain outside this asset and are rejected by the
modal validator when supplied as authored fields.

## Persistence boundary

Validate & Apply replaces the open editor's controlled Progression Profile
value. The modal never saves the creation. The existing page Save action remains
the only persistence action.

## Development preview

```text
/dev/ui-preview/progression-json-editor
```

The preview is blocked in production with `notFound()`.
