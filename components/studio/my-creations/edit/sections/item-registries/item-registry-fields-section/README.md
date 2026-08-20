# Item Registry Fields Section LOOM boundary

## Portable LOOM boundary

```text
ItemRegistryFieldsSection.jsx                 Binding Shell
        ↓
useItemRegistryFieldsSectionViewModel.js      ViewModel / Chassis
        ↓
ItemRegistryFieldsSection.view.jsx            Portable View / Skin
```

The public `ItemRegistryFieldsSection.jsx` import remains unchanged for
Creation Edit.

## Application-owned behavior

The ViewModel normalizes `creation.data` through the existing Item Registry
utilities and owns entry selection, entry creation/deletion, field updates,
prompt-guidance merging, select-option mapping, and payload preview text.

The Binding Shell owns `ItemStartingAssignmentEditor` because that editor can
open linked-Creation pickers and interpret starting-holder references. The
portable View receives one rendered assignment slot per entry.

## Stored fields

The section continues to write only through the existing parent callbacks:

- top-level `title` and `description`;
- `creation.data.scope`;
- `creation.data.entries`;
- `creation.data.prompt_guidance`.

## Preview

Development-only preview:

```text
/dev/ui-preview/item-registry-fields-section
```

## W45 saved-edit advanced mechanics convergence

The saved Item Registry editor now exposes the same reusable advanced mechanics
references already available during create-time authoring:

- Equipment Modifier References (Stats & Pools modifier definition references)
- Item Operation Requirement Sets (shared Mechanics requirement language)
- Item Operation Effect References (registered typed operations)

`normalizeItemEntry()` preserves and canonicalizes all three arrays so edits are
not discarded by the shared Item Registry normalization path. Runtime
eligibility, mutation, modifier definitions, and Actor Mechanics bindings remain
outside this View and remain authoritative in their existing Crestfall layers.
