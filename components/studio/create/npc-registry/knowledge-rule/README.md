# Knowledge Rule Modal Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates NPC knowledge-rule presentation from Crestfall registry
editor behavior.

```text
KnowledgeRuleModal.jsx
        ↓
useKnowledgeRuleModalViewModel.js
        ↓ semantic View contract
KnowledgeRuleModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<KnowledgeRuleModal
  draft={knowledgeDraft}
  entries={registry.entries}
  onClose={closeKnowledgeModal}
  onChange={updateKnowledgeDraftField}
  onToggleEntry={toggleKnowledgeEntry}
  onSave={saveKnowledgeDraft}
/>
```

The current live consumers remain:

- `components/studio/create/npc-registry/NpcRegistryBuilder.jsx`
- `components/studio/my-creations/edit/sections/npc-registries/NpcRegistryFieldsSection.jsx`

## Ownership Boundary

The View owns:

- modal and field markup
- knowledge-level and identity-option rendering
- selected visual states
- labels, spacing, and responsive presentation
- safe semantic callback invocation

The ViewModel owns:

- translating NPC entries into display-ready identity options
- mapping semantic changes to the existing knowledge draft fields
- routing Known By and Suspected By toggles to the existing callback
- preserving the existing save and close behavior

The View does not receive NPC registry draft field names or persistence rules.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/knowledge-rule
```

The route renders the actual portable View from direct contract fixtures. It
does not load or save an NPC Registry.

## Live Regression Checklist

1. Create or edit an NPC Registry with at least two person entries.
2. Open Knowledge Rules and add a rule.
3. Enter the subject and choose a default knowledge level.
4. Toggle identities under Known By and Suspected By.
5. Enter false-belief and knowledge-rule notes.
6. Save the rule and confirm it appears in the registry.
7. Save the registry, refresh, and confirm the rule persists.
8. Edit the rule and verify every value reloads correctly.
