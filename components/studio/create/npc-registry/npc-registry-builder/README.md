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

The ViewModel owns:

- starter-registry normalization;
- Character and Player Character option loading;
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
