# Character Voice Module Catalog Expansion binding

Status: **WIRED**.

This package originally captured the Crestfall Character Voice Module catalog
expansion from 16 to 41 modules without modifying the then-live FE catalog.

W5 closes that gap.

The live FE-owned:

```text
components/studio/create/character/constants/voiceModules.js
```

now contains the complete current 41-option catalog.

The original 25-item expansion list remains in this package as historical
acceptance evidence. It is no longer a live missing set; every one of those
25 IDs is already present in `voiceModuleOptions`.

Current wiring state:

```text
live catalog:             41
historical expansion:     25
pending additions:         0
expanded effective total: 41
categories:                8
```

The existing `1.0.0` picker View and its presentation ViewModel required no
wiring change. The ViewModel already imports `voiceModuleOptions`, groups the
catalog by category, resolves selected labels, and forwards selected IDs through
the existing `onChange` callback.

The existing priority rule remains unchanged:

```text
Character voice still has priority; modules are expression overlays, not
replacements.
```

Unknown legacy/custom selected IDs are still preserved rather than silently
dropped.

Authority remains:

`Crestfall-fe`
- voice-module catalog presentation
- category grouping
- selected-label presentation
- picker visual composition

parent / Chassis authoring state
- selected module IDs

`Crestfall`
- persistence
- runtime voice interpretation
- Character voice priority semantics

Protected scopes remain untouched:

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
