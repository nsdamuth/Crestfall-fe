# Creation Picker LOOM package

**Contract:** `CreationPicker.contract.js`

## Purpose

The mini-vault (`docs/plans/FABLE-GATE-2-STUDIO.md` wave SW1): a
picker over ALL of a creator's owned creations, filtered by the five
vault buckets plus a "More" bucket carrying the remaining pro types
(ruling N7, ratified option A, 12 Aug 2026). Consumed by S1 (Full
Studio's picker shortcuts) and ED1 (the editor's asset switcher).

## Boundary

```text
CreationPicker.jsx
  Binding Shell
  └─ ownedCreationsPicker.mock.js (pending CR-050)

creation-picker/
  CreationPicker.view.jsx
    Portable Skin, composes KitPickerModal (grid layout)
  useCreationPickerViewModel.js
    Chassis / orchestration adapter (search, bucket, sort state)
  creationPickerBuckets.js
    Type -> bucket map, all 28 creation types
  ownedCreationsPicker.mock.js
    Named mock, pending CR-050
  CreationPicker.contract.js
  CreationPicker.fixtures.js
```

The View is fixture-fed and owns no data: it composes
`KitPickerModalView` (`components/kit/picker-modal/`) directly in
grid layout for every populated state. Search, bucket filtering, and
sort all report through the same semantic callbacks the kit picker
already defines (`onSearchChange`, `onToggleFilter`, `onToggleItem`,
`onConfirm`, `onClose`); the Chassis is the only file that owns React
state or reads the owned-creations shape.

## Buckets and sort

Six filter chips ride the kit picker's existing `filters` row:
Characters, Worlds, Looks, Stories, Adventures, More (single-active,
selecting the active bucket again clears back to "all"), plus one
trailing sort chip toggling "Sort: Recent" / "Sort: A-Z". Composing
the sort control as a chip means zero changes to the kit package;
`onToggleFilter` already reports an opaque string value and the
Chassis decides what it means.

## Items

Each tile carries the art thumb (`imageSrc`, kit no-image fallback
when absent), the title, the type eyebrow (`subtitle`, from
`lib/shared/presentation/terminology.js`), and a visibility badge
(`badgeLabel`: "Private" / "Unlisted" / "Public", or "Canon" for
canon items, which always wins over the visibility label). Selection
is single-select and confirms on tap, matching the kit picker's own
single-select law.

## True-empty vs no-results

`isEmpty` (the owned-creations list itself is empty) renders a
distinct "Nothing here yet" state with a Create call to action; the
kit picker's own empty state is plain text with no action slot, so
this one case is NOT delegated to `KitPickerModalView` and instead
composes `KitModalFrame` directly. Every other state (searching,
no-results from a search/filter miss, error, longest, filtered per
bucket) renders through `KitPickerModalView` unmodified.

## Package assets

- `CreationPicker.contract.js`
- `CreationPicker.fixtures.js`
- `creationPickerBuckets.js`
- `ownedCreationsPicker.mock.js`
- `useCreationPickerViewModel.js`
- `/dev/ui-preview/creation-picker`

Fixture-first pending CR-050 (the live owned-creations list for
picker surfaces). No query, persistence, or navigation is wired; the
Binding Shell reads `ownedCreationsPicker.mock.js` unconditionally.
