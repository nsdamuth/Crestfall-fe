# Rules Codex JSON Editor LOOM Feature

**Status:** In-repository LOOM integration

**View contract:** `rules_codex_json_editor_view_contract_v1`

**Validation contract:** `rules_codex_json_editor_validation_v1`

## Purpose

This feature provides a complete-object JSON authoring companion for the visual
Rules Codex editor. It is intended for creator-controlled bulk editing and
AI-assisted authoring without turning Codex prose into an unrestricted prompt
or execution surface.

## Chassis and Skin boundary

```text
RulesCodexEditorView
→ RulesCodexJsonEditorModal
→ useRulesCodexJsonEditorViewModel
→ rulesCodexJsonEditor.validation
→ existing Rules Codex normalizer and validator
```

The modal View owns presentation only. It does not call APIs, know persistence
columns, load attachments, select runtime sections, invoke a provider, or save a
Creation.

## Apply behavior

`Validate & Apply` parses and validates one complete replacement object. Valid
content replaces only the controlled Rules Codex editor value. Invalid JSON
never partially updates the builder.

The normal create/edit page Save action remains the only persistence action.

## Locked authority boundary

Every section remains `INTERPRETATION_ONLY`. The JSON editor rejects mutable
state, effects, domain actions, scripts, system/developer prompts, provider
instructions, safety or guard overrides, and deterministic authority.

## AI guide

The downloadable Markdown guide contains:

- the current normalized Rules Codex JSON;
- contract and selection limits;
- section and activation shapes;
- authority and safety restrictions;
- instructions to return one complete JSON object only.

## Development preview

```text
/dev/ui-preview/rules-codex-json-editor
```

The preview is blocked in production with `notFound()`.
