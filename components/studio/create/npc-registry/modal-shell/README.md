# NPC Registry Modal Shell

## Purpose

`ModalShell` is the shared portable modal frame used by the NPC Registry entry
and rule modals.

The public import path remains:

```text
components/studio/create/npc-registry/ModalShell.jsx
```

That file re-exports the portable View so existing modal Views do not change.

## Current consumers

```text
components/studio/create/npc-registry/alias-rule/AliasRuleModal.view.jsx
components/studio/create/npc-registry/knowledge-rule/KnowledgeRuleModal.view.jsx
components/studio/create/npc-registry/relationship-rule/RelationshipModal.view.jsx
components/studio/create/npc-registry/npc-entry/NpcEntryModal.view.jsx
```

This component is separate from:

```text
components/ui/ModalShell.jsx
```

Do not merge or substitute the two without an explicit architecture decision.

## Ownership boundary

The View owns:

- the fixed modal overlay;
- the constrained modal container;
- the `NPC Registry` eyebrow;
- modal-title presentation;
- the close icon and accessible label;
- the independently scrollable content region;
- responsive sizing and safe close-callback invocation.

The View does not own:

- whether a modal is open;
- form state or draft values;
- validation;
- save or cancel orchestration;
- registry mutations;
- API calls, services, PostGraphile, or persistence.

No ViewModel is required because the component receives a complete visual
contract and owns only presentation behavior.

## Contract

```text
NPC_REGISTRY_MODAL_SHELL_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/npc-registry-modal-shell
```

The preview renders contract-shaped fixture content and local close/reopen
behavior only. It must return `notFound()` in production.

## Live regression targets

```text
Alias Rule modal
Knowledge Rule modal
Relationship Rule modal
NPC Entry modal
```

Overlay placement, modal sizing, title presentation, close behavior, body
scrolling, and all child form behavior must remain unchanged.
