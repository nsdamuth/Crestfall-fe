# NPC Registry Fields Section LOOM Boundary

## Portable LOOM boundary

```text
NpcRegistryFieldsSection.jsx                    Binding Shell
        ↓
useNpcRegistryFieldsSectionViewModel.js         ViewModel / Chassis
        ↓
NpcRegistryFieldsSection.view.jsx               Portable View / Skin
```

The public `NpcRegistryFieldsSection.jsx` import remains unchanged for Creation
Edit. The Shell renders the portable View and keeps the four application-owned
registry modals outside the View package.

## Application authority

`useNpcRegistryFieldsSectionViewModel` composes the existing
`useNpcRegistryEditor` hook. That editor remains responsible for linked
Character loading, registry draft state, reference cleanup, modal actions, and
writes through the supplied `updateDataField` callback.

The ViewModel converts registry records into display-ready cards and semantic
callbacks. It owns interpretation of:

- `creation.data.scope`
- `creation.data.entries`
- `creation.data.relationships`
- `creation.data.knowledge_rules`
- `creation.data.aliases`

## Portable View

The View owns only:

- overview field layout;
- action, disabled, helper, empty, and error presentation;
- display-ready entry, relationship, knowledge, and alias cards;
- semantic callback invocation.

It does not import registry modals, load Creations, inspect the raw Creation
form, or call persistence helpers.

## Preview

Development-only preview:

```text
/dev/ui-preview/npc-registry-fields-section
```

## Sparse NPC mechanics relationship

People-entry cards now show whether a lightweight NPC has an Actor Mechanics
Profile reference. Editing a lightweight entry exposes the same attachment
flow used by the create builder. Linked Character entries continue to use the
profile attached to the Character creation.

The portable fields View receives display-ready card metadata only and does not
read or write Actor Mechanics Profile storage fields.
