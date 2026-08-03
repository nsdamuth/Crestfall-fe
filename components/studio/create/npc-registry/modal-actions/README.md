# NPC Registry Modal Actions

## Purpose

`ModalActions` is the shared portable Cancel/Save action row used by the NPC
Registry entry and rule modals.

The public import path remains:

```text
components/studio/create/npc-registry/ModalActions.jsx
```

That file re-exports the portable View so existing modal Views do not change.

## Current consumers

```text
components/studio/create/npc-registry/alias-rule/AliasRuleModal.view.jsx
components/studio/create/npc-registry/knowledge-rule/KnowledgeRuleModal.view.jsx
components/studio/create/npc-registry/relationship-rule/RelationshipModal.view.jsx
components/studio/create/npc-registry/npc-entry/NpcEntryModal.view.jsx
```

The locally declared `ModalActions` helper inside
`components/studio/create/location-registry/LocationRegistryBuilder.jsx` is a
separate implementation. Do not merge or replace it as part of this feature.

## Ownership boundary

The View owns:

- right-aligned action-row layout;
- Cancel-button presentation;
- primary-action presentation;
- supplied primary-action label;
- safe Cancel and Save callback invocation.

The View does not own:

- modal disclosure state;
- draft values or form state;
- validation;
- save eligibility or busy state;
- registry mutations;
- API calls, services, PostGraphile, or persistence.

No ViewModel is required because the component receives a complete visual
contract and owns only presentation behavior.

## Contract

```text
NPC_REGISTRY_MODAL_ACTIONS_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/npc-registry-modal-actions
```

The preview renders contract-shaped fixture states and local Cancel/Save
feedback only. It must return `notFound()` in production.

## Live regression targets

```text
Alias Rule modal
Knowledge Rule modal
Relationship Rule modal
NPC Entry modal
```

Cancel behavior, supplied Save labels, modal validation, and all registry
mutations must remain unchanged.
