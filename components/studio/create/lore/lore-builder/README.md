# Lore Builder LOOM Package

**Contract:** `LoreBuilder.contract.js`

## Purpose

Creates a private or unlisted Lore draft while keeping navigation, persistence,
and application-owned child controls in the Binding Shell.

## Boundary

```text
LoreBuilderShell.jsx
  → useLoreBuilderViewModel.js
  → LoreBuilder.view.jsx
```

- The Binding Shell owns Next.js navigation and injects the JSON editor,
  share control, and Link component used by nested portable Views.
- The ViewModel owns draft identity, structural validation, save orchestration,
  and post-create routing.
- The portable View owns the create layout, mode switch, identity controls, and
  placement of injected child Views.

## Package assets

- `LoreBuilder.contract.js`
- `LoreBuilder.fixtures.js`
- `loreBuilderDiagnostics.mjs`
- `/dev/ui-preview/lore-builder`

The preview is fixture-only and is unavailable in production.
