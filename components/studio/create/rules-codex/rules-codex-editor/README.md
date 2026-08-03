# Rules Codex Editor LOOM Feature

**Status:** LOOM foundation only; no live creation persistence or runtime injection

**Rules Codex data contract:** `rules_codex_contract_v0`

**View contract:** `1.0.0`

## Purpose

This feature provides the first creator-facing authoring surface for Rules Codex
identity, selection budgets, sections, and activation metadata. It is a
controlled component that can later be bound to create/edit persistence without
moving product-data behavior into the portable View.

## Structure

```text
components/studio/create/rules-codex/
  RulesCodexEditor.jsx
  rules-codex-editor/
    RulesCodexEditor.view.jsx
    useRulesCodexEditorViewModel.js
    RulesCodexEditor.contract.js
    RulesCodexEditor.fixtures.js
    README.md
```

## Public binding interface

```jsx
<RulesCodexEditor value={rulesCodexDraft} onChange={setRulesCodexDraft} />
```

The controlled `value` follows the engine contract shape:

```js
{
  contractVersion: "rules_codex_contract_v0",
  summary: "...",
  enabled: true,
  selectionPolicy: {
    maxSelectedSections: 8,
    maxContextCharacters: 12000,
  },
  sections: [],
  metadata: {},
}
```

This patch does not establish where that object is stored. Creation type,
persistence, attachment, and runtime hydration remain future patches.

## ViewModel ownership

The ViewModel owns:

- normalization into `rules_codex_contract_v0`;
- section ordering and controlled updates;
- section and combined character limits;
- activation-value parsing and normalization;
- fixed `INTERPRETATION_ONLY` authority;
- validation issues and display-ready issue grouping;
- section expansion state;
- semantic callbacks emitted to the View;
- preservation of unknown top-level and section metadata.

## Portable View ownership

The View owns:

- Rules Codex layout and styling;
- summary and selection-budget presentation;
- section disclosure presentation;
- activation-field inputs;
- validation presentation;
- counters, empty, disabled, and near-limit states;
- safe invocation of semantic callbacks.

The View does not know:

- creation IDs, types, statuses, or JSONB columns;
- API routes or client modules;
- Supabase or PostGraphile;
- Story, Scenario, Location, Organization, or actor attachments;
- runtime selection results;
- context injection or provider prompts;
- save, publish, review, or canon workflows.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/rules-codex-editor
```

The route renders the portable View from contract-shaped fixtures and returns
`notFound()` in production. Preview actions are local and do not authenticate,
load creations, save data, attach a Codex, or change runtime behavior.

## Activation authoring

`ALWAYS` and `EXPLICIT_ONLY` sections do not require contextual signal fields.
`CONTEXTUAL` sections may define comma-separated values for:

- domains;
- command IDs;
- tracker IDs;
- guard IDs;
- registry references;
- tags;
- actor types;
- attachment scope types.

The editor normalizes those signals to uppercase identifiers. Actual routing and
selection remain engine-middleware responsibilities.

## Next integration boundary

The next patch must audit the actual creation type system and create/edit
persistence chain before attaching this Shell to a live page:

```text
View
→ ViewModel / client
→ FE API proxy
→ services-api
→ PostGraphile
→ database
```

Do not let the View own persistence or attach the Codex directly to runtime
systems.


## JSON authoring companion

The editor exposes a LOOM JSON modal through:

```text
RulesCodexEditorView
→ RulesCodexJsonEditorModal
→ useRulesCodexJsonEditorViewModel
→ rulesCodexJsonEditor.validation
```

`Validate & Apply` replaces only the controlled editor value. The normal
create/edit page Save action remains authoritative for persistence. Every
section remains `INTERPRETATION_ONLY`; mutable state, effects, scripts, hidden
prompts, provider-control instructions, and safety or guard overrides are
rejected.

Development preview:

```text
/dev/ui-preview/rules-codex-json-editor
```
