# Progression Profile Editor LOOM

Portable editor for `progression_profile_contract_v0` definitions.

```text
ProgressionProfileEditor
→ useProgressionProfileEditorViewModel
→ ProgressionProfileEditorView
```

Supported authoring:

- Generated Curve
- Generated Curve with Overrides
- Explicit Threshold Table
- Linear, Geometric, Power, and Hybrid algorithms
- creator-defined level caps
- XP requirement interpretation and rounding
- compact level overrides
- collapsed-by-default compact deterministic threshold preview
- reusable level tiers

The portable View receives normalized semantic props only. It does not call
APIs, know database columns, create actor state, award experience, execute
guards, or inject provider context.

Development preview:

```text
/dev/ui-preview/progression-profile-editor
```

The preview is blocked in production with `notFound()`.

## JSON authoring companion

The editor exposes a LOOM JSON modal through:

```text
ProgressionProfileEditorView
→ ProgressionJsonEditorModal
→ useProgressionJsonEditorViewModel
→ progressionJsonEditor.validation
```

Validate & Apply replaces only the controlled editor value. The normal
create/edit page Save action remains authoritative for persistence.

Development preview:

```text
/dev/ui-preview/progression-json-editor
```
