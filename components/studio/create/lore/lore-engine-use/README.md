# Lore Engine Use LOOM Package

**Runtime/UI contract:** `lore_engine_use_contract_v2`
**Portable authoring JSON:** `lore_engine_use_authoring_v1`

## Purpose

Configures a voluntary Engine Use submission for the active immutable public Lore
revision. It records authored scope, Character knowledge relationships, optional
knowledge exclusions/time/context, and Location relevance without modifying the
editable Lore document or public release.

## Boundary

```text
LoreEngineUse.jsx
  → useLoreEngineUseViewModel.js
  → LoreEngineUse.view.jsx

LoreEngineUse.jsx
  → LoreEngineUseJsonEditorModal.jsx
    → useLoreEngineUseJsonEditorViewModel.js
    → LoreEngineUseJsonEditorModal.view.jsx
```

The ViewModel owns API state, authoring configuration, validation, submission,
cancellation, withdrawal, and polling. The portable Views contain no direct
Next.js, database, or provider calls.

## Engine Use JSON

`lore_engine_use_authoring_v1` is a portable authoring packet for the unsent
Engine Use form. It contains:

- submission scope (`ENTIRE_ASSET` or selected section ids),
- Character bindings and knowledge modes,
- Character Asset/Chapter/Section knowledge scope,
- explicit chapter/section/block exclusions,
- optional Story-time availability windows,
- optional Scenario and Room Template allowlists,
- optional tagged Location relevance.

`publicReleaseId` is intentionally omitted. The existing submit path resolves
the currently active immutable public release and remains the only action that
persists an Engine Use submission.

Validate & Apply is atomic and form-only. It never publishes Lore, submits,
indexes, verifies, activates, cancels, or withdraws Engine Use.

Legacy abbreviated authoring objects without `contractVersion` are accepted
with a normalization notice and exported thereafter as
`lore_engine_use_authoring_v1`.
