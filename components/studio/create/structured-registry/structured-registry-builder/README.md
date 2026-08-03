# Structured Registry Builder LOOM feature

## Purpose

Provides one shared builder surface for:

- `ORGANIZATION_REGISTRY`
- `FACTION_REGISTRY`
- `EVENT_REGISTRY`
- `QUEST_REGISTRY`

The conversion preserves the existing create and Creation Edit behavior while separating the portable interface from Crestfall application orchestration.

## LOOM boundary

```text
StructuredRegistryBuilder.jsx                     Binding Shell
        ↓
useStructuredRegistryBuilderViewModel.js           ViewModel / Chassis
        ↓
StructuredRegistryBuilder.view.jsx                 Portable View / Skin
```

The Binding Shell owns the application-only linked-creation picker modal. The portable View receives semantic registry data and callbacks and has no creation API, router, persistence, or catalogue dependency.

## Preserved behavior

- registry-specific labels, categories, and relationship groups;
- create and edit modes;
- controlled Creation Edit tabs and `hideTabs` behavior;
- title, description, scope, entries, aliases, public/hidden notes, and visual identity;
- relationship notes and linked Character, Location, Organization, Faction, Event, and Quest creations;
- rules, access, knowledge, consequences, and prompt guidance;
- structured payload review;
- existing creation payload, save feedback, and redirect to Creation Edit.

## Preview

```text
http://localhost:3000/dev/ui-preview/structured-registry-builder
```

The preview is development-only and uses fixture data without an API or linked-creation catalogue.
