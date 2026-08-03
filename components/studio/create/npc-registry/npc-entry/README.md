# NPC Entry Modal Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.1.0`

## Purpose

This feature separates NPC person-entry presentation from Crestfall registry
builder and editor behavior.

```text
NpcEntryModal.jsx
        ↓
useNpcEntryModalViewModel.js
        ↓ semantic View contract
NpcEntryModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<NpcEntryModal
  draft={entryDraft}
  characterOptions={characterOptions}
  linkedCreationIds={linkedCreationIds}
  onClose={closeEntryModal}
  onChange={updateEntryDraftField}
  onSetKind={setEntryKind}
  onApplyCharacter={applyCharacterToEntryDraft}
  onSave={saveEntryDraft}
/>
```

The current live consumers remain:

- `components/studio/create/npc-registry/NpcRegistryBuilder.jsx`
- `components/studio/my-creations/edit/sections/npc-registries/NpcRegistryFieldsSection.jsx`

## Ownership Boundary

The View owns:

- modal and field markup
- semantic entry-mode controls
- display-ready character-card rendering
- selected and unavailable visual states
- labels, spacing, search presentation, and responsive layout
- safe semantic callback invocation

The ViewModel owns:

- translating `AD_HOC` and `CREATION_REF` into semantic View mode IDs
- translating semantic mode choices back to the existing registry values
- converting character options into display-ready cards
- preserving selected and already-linked character behavior
- translating a selected card ID back to the original character object
- mapping semantic edits to the current entry draft fields
- preserving the existing save and close behavior

The View does not receive NPC registry draft field names, `creationId`,
`creationType`, or persistence rules.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/npc-entry
```

The route renders the actual portable View from direct contract fixtures. It
does not load, change, or save an NPC Registry.

## Live Regression Checklist

1. Create or edit an NPC Registry.
2. Add a new person entry.
3. Save a Lightweight NPC with a name and registry notes.
4. Reopen the entry and verify both values load correctly.
5. Add another person entry and choose Link Existing Character.
6. Search for and select a character or player character.
7. Confirm characters already linked elsewhere are unavailable.
8. Save the entry, then save and refresh the registry.
9. Confirm the linked creation, name, and notes persist.

## NPC Registry Entry Actor Mechanics Profile attachment

Lightweight (`AD_HOC`) entries may now attach one reusable Actor Mechanics
Profile whose owner type is `NPC_REGISTRY_ENTRY`. The public Binding Shell
injects the existing Actor Mechanics Profile attachment feature into the
portable View through `actorMechanicsProfileAttachmentContent`.

Linked Character entries do not save a second nested profile. They use the
Actor Mechanics Profile attached to the linked Character creation.

This patch persists and validates the relationship only. Sparse NPC runtime
hydration and actor-state initialization remain separate.
