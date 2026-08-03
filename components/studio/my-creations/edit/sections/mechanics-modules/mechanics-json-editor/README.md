# Mechanics JSON Editor Loom Feature

**Status:** In-repository Loom feature

**Contract version:** `mechanics_json_editor_view_contract_v1`

## Purpose

This feature gives Mechanics Module authors a canonical JSON round-trip tool
without moving persistence or creation-edit ownership into the modal.

```text
MechanicsModuleFieldsSection.jsx
        ↓ opens
MechanicsJsonEditorModal.jsx
        ↓
useMechanicsJsonEditorViewModel.js
        ↓ semantic View contract
MechanicsJsonEditorModal.view.jsx
```

## Layer responsibilities

### Binding Shell

`MechanicsJsonEditorModal.jsx` is the explicit Shell. It binds the ViewModel to
the portable View and contains no application logic.

### ViewModel

`useMechanicsJsonEditorViewModel.js` owns:

- JSON draft state
- format/reset/copy actions
- validation and normalization orchestration
- apply/close decisions
- display-ready errors, warnings, and status values

### View

`MechanicsJsonEditorModal.view.jsx` owns:

- ModalShell composition
- editor, toolbar, validation, warning, and status presentation
- responsive layout and accessibility
- safe invocation of semantic callbacks

The View does not import creation clients, API routes, Supabase, PostGraphile,
services-api, or creation persistence helpers.

### Validation

`mechanicsJsonEditor.validation.js` validates the complete authored
`creation.data` shape relevant to a Mechanics Module. It checks known contracts
including resolution v6 and MC6 composition, preserves unknown metadata fields,
and applies no changes unless the entire object validates.

## Persistence boundary

Validate & Apply replaces the open editor's `form.data` through the existing
creation edit ViewModel state. The modal does not save the creation. The
existing page Save action remains the only persistence action.

## Preview

Development-only preview:

```text
/dev/ui-preview/mechanics-json-editor
```

The route returns `notFound()` in production.
