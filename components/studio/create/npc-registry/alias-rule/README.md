# Alias Rule Modal Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates NPC alias-rule presentation from Crestfall registry
editor behavior.

```text
AliasRuleModal.jsx
        ↓
useAliasRuleModalViewModel.js
        ↓ semantic View contract
AliasRuleModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<AliasRuleModal
  draft={aliasDraft}
  entries={registry.entries}
  onClose={closeAliasModal}
  onChange={updateAliasDraftField}
  onSave={saveAliasDraft}
/>
```

The current live consumers remain:

- `components/studio/create/npc-registry/NpcRegistryBuilder.jsx`
- `components/studio/my-creations/edit/sections/npc-registries/NpcRegistryFieldsSection.jsx`

## Ownership Boundary

The View owns:

- modal and field markup
- option rendering
- labels, spacing, and responsive presentation
- safe semantic callback invocation

The ViewModel owns:

- translating NPC entries into identity options
- mapping semantic changes to `trueEntryId`, `publicIdentity`, and `rule`
- preserving the existing save and close callbacks

The View does not receive NPC registry draft field names or persistence rules.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/alias-rule
```

The route renders the actual portable View from direct contract fixtures. It
does not load or save an NPC Registry.

## Live Regression Checklist

1. Create or edit an NPC Registry with at least one person entry.
2. Open the Aliases section and add an alias rule.
3. Select a true identity.
4. Enter the public identity and runtime rule.
5. Save the alias rule and confirm it appears in the registry.
6. Save the registry, refresh, and confirm the alias persists.
7. Edit the alias and verify all fields load correctly.
