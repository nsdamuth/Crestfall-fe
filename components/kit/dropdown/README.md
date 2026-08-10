# Kit Dropdown LOOM Package

**Contract:** `KitDropdown.contract.js`

## Purpose

The branded dropdown ruled by the filter-line law (9 Aug 2026,
`docs/BUILD-BLUEPRINT.md` 2.16): every filter and multi-select on a
filter surface is a dropdown opening below its trigger, with a live
selection count on the trigger. Panel recipe traces to the legacy
control-bar menu (`docs/MOCKUP-DECISIONS.md`, dropdown panel entry):
`--surface-4`, `1px --line`, `--radius-md`, `--shadow-popover`,
min 13rem, max 19rem scrolling.

## Boundary

```text
KitDropdown.jsx
  -> useKitDropdownViewModel.js
  -> KitDropdown.view.jsx
```

- Open/closed is sanctioned presentation-only local state inside the
  View (outside click and Escape close it; single-select closes on
  pick, multi-select stays open).
- The caller owns selection state and receives `onToggleOption(value)`
  per activation. The View derives the trigger's gold value
  (single-select) or gold count (multi-select); the caller never
  formats trigger text.
- Trigger grammar adopted from the legacy `.cbdrop` chip: category
  label, gold value or count, chevron.

## Mobile law (390)

Under 700px the panel docks to the bottom edge as a sheet, now the
unified modal frame's `KitModalFrame` (`variant="sheet"`,
`docs/BUILD-BLUEPRINT.md` 2.5), converted this pass per
`docs/SPRINT-A-PLAN.md` section 5: `--radius-lg` top corners,
`--shadow-modal`, `--scrim-strong` veil with `--blur-panel`, safe-area
padding, and the frame's own circular close control (the sheet's
former hand-rolled X is deleted). At 700px and up it is the popover
below the trigger, `--shadow-popover`, no veil, byte-for-byte
unchanged by the conversion. Rows bump to `--control-md` at coarse
pointers.

The chassis choice between the two is a presentation-only
`matchMedia("(max-width: 699.98px)")` flag evaluated while the panel
is open, replacing the prior CSS-only `hidden`/`min-[700px]:block`
split. Inherited-by-construction change: the phone sheet now
scroll-locks the body while open (frame law); it previously did not.
The popover still never locks.

## Honest stubs

An option whose backend cannot answer yet ships `isDisabled: true`
and renders the word "Soon" (never a fake filter). The rating fixture
uses this for the Teen tier pending CR-027.

## States

Trigger: rest, hover, focus (global ring), pressed, disabled, plus
the marked treatment (gold border + inset ring) when open or when any
selection exists. Rows: rest, hover, focus, selected (gold text +
leading check; the legacy trailing check yields the trailing slot to
counts), pressed, disabled.

## Package assets

- `KitDropdown.contract.js`
- `KitDropdown.fixtures.js`
- `useKitDropdownViewModel.js`
- `/dev/ui-preview/kit-dropdown`

Fixture-only; no query, persistence, or navigation is wired.
