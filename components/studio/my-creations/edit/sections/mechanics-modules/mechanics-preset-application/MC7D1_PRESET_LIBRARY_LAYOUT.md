# MC7D.1 — Preset Library Compact Folder Layout

## Scope

This is a bounded frontend-only LOOM presentation correction for the MC7D Mechanics Preset Library.

It does not alter:

- preset definitions
- preset application semantics
- replacement or merge boundaries
- conflict validation
- JSON compliance validation
- form persistence
- services-api execution
- database or PostGraphile behavior

## UI corrections

The modal now uses a viewport-bounded flex frame:

```text
fixed header
scrollable content region
fixed action footer
```

Desktop library and preset-detail panes scroll independently. Smaller screens retain a single vertical content flow.

The catalog is grouped into four collapsible folders:

```text
Module Starters
Command Starters
Resolution References
Composition References
```

Folders are collapsed initially. A folder opens automatically when:

- it contains the selected preset
- its scope filter is active
- a search query returns matching presets in that folder

Preset rows inside folders use a compact display with the label, type, one-line summary, availability warning, and selected state.

## LOOM boundary

The existing public Shell and ViewModel remain unchanged. Folder expansion is presentation-only state owned by the API-free portable View.

## Files

Modified:

```text
components/studio/my-creations/edit/sections/mechanics-modules/
  mechanics-preset-application/
    MechanicsPresetApplicationModal.view.jsx
```

Created:

```text
components/studio/my-creations/edit/sections/mechanics-modules/
  mechanics-preset-application/
    mc7PresetLibraryLayoutDiagnostics.mjs
    MC7D1_PRESET_LIBRARY_LAYOUT.md
```

## Validation

The MC7D.1 diagnostic checks the compact viewport frame, four-folder grouping, accessible expansion state, automatic folder opening, compact cards, API-free View boundary, and unchanged semantic callbacks.

Existing MC7D, MC7C, MC7B, and MC7A diagnostics are rerun by the installer.
