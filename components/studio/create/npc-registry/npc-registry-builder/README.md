# NPC Registry Builder LOOM boundary

## Structure

```text
NpcRegistryBuilder.jsx                         Binding Shell
npc-registry-builder/
  NpcRegistryBuilder.view.jsx                  Portable View / Skin
  useNpcRegistryBuilderViewModel.js            ViewModel / Chassis
  NpcRegistryBuilder.contract.js               Semantic UI contract
  NpcRegistryBuilder.fixtures.js               API-free visual states
```

## Portable View ownership

The View owns the registry wizard layout, tab presentation, summary panel,
entry/relationship/knowledge/alias cards, empty states, and save feedback. It
receives semantic registry data and callbacks only.

It does not load Character creations, construct `NPC_REGISTRY` persistence
payloads, call the creation API, navigate, or import Crestfall modal Shells.

## Application ownership

In the independently deployed `Crestfall-fe` app,
`useNpcRegistryBuilderViewModel.js` and the serializer/hydrator behavior in
`npcRegistryUtils.js` are deployment mirrors of authoritative `Crestfall`
application behavior.

The application ViewModel owns:

- starter-registry normalization;
- canonical linked-Character entry serialization;
- Character and Player Character option loading;
- linked-Character display hydration;
- entry, relationship, knowledge, and alias draft state;
- reference cleanup when an entry is deleted;
- creation-payload construction;
- save orchestration and redirect behavior.

The Binding Shell keeps the existing NPC entry, relationship, knowledge, and
alias modal features application-owned and injects their rendered content into
the portable View.

## Persistence path

```text
Portable View
→ ViewModel
→ registryClient
→ creationClient
→ frontend API proxy
→ services-api
→ PostGraphile
→ public.creations
```

The saved data shape and existing `NPC_REGISTRY_BUILDER` metadata remain
unchanged.

## W7 linked-Character authority wiring

A linked Character entry persists stable identity + Registry-local notes and
hydrates from the current Character Creation for editor display.

A lightweight `AD_HOC` NPC remains Registry-owned and may keep its own Actor
Mechanics Profile attachment.

The portable FE View renders hydrated Character detail and an explicit
unavailable-reference recovery state using the existing FE styling rather than
copying the Chassis source View.
