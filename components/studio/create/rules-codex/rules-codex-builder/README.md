# Rules Codex Builder LOOM Feature

## Boundary

```text
RulesCodexBuilderShell
→ useRulesCodexBuilderViewModel
→ RulesCodexBuilderView
→ RulesCodexEditorView
```

The View owns presentation only. The ViewModel owns draft state, validation,
creation-client orchestration, and post-create navigation. The client module
owns the FE API request.

The child editor follows nested LOOM composition: the parent ViewModel invokes
the child ViewModel, while the parent View renders the child portable View.
The parent View never imports the child Binding Shell.

## Persistence shape

```text
creation.type = RULES_CODEX
creation.data.rules_codex = rules_codex_contract_v0
```

The service validates and normalizes the Codex again before persistence.
