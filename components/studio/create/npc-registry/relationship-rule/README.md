# Relationship Modal Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates NPC relationship-rule presentation from Crestfall
registry editor behavior.

```text
RelationshipModal.jsx
        ↓
useRelationshipModalViewModel.js
        ↓ semantic View contract
RelationshipModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<RelationshipModal
  draft={relationshipDraft}
  entries={registry.entries}
  onClose={closeRelationshipModal}
  onChange={updateRelationshipDraftField}
  onSave={saveRelationshipDraft}
/>
```

The current live consumers remain:

- `components/studio/create/npc-registry/NpcRegistryBuilder.jsx`
- `components/studio/my-creations/edit/sections/npc-registries/NpcRegistryFieldsSection.jsx`

## Ownership Boundary

The View owns:

- modal and field markup
- source and target identity rendering
- direction and strength choice rendering
- labels, spacing, and responsive presentation
- safe semantic callback invocation

The ViewModel owns:

- translating NPC entries into display-ready identity options
- translating semantic direction and strength choices to existing registry values
- mapping semantic edits to the current relationship draft fields
- preserving the existing save and close behavior

The View does not receive NPC registry draft field names or persistence rules.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/relationship-rule
```

The route renders the actual portable View from direct contract fixtures. It
does not load or save an NPC Registry.

## Live Regression Checklist

1. Create or edit an NPC Registry with at least two person entries.
2. Open Relationships and add a relationship.
3. Select the From NPC and To NPC.
4. Enter the relationship type.
5. Choose the direction and strength.
6. Enter the relationship rule and save it.
7. Save the registry, refresh, and confirm the relationship persists.
8. Edit the relationship and verify every value reloads correctly.
