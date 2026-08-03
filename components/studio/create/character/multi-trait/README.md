# Multi-Trait Modal Loom Feature

## Purpose

Separates the reusable multi-select trait UI from Crestfall form-field and
selection behavior. The current live use is the character `Proportions` field,
but the View contract remains presentation-focused.

## Files

- `../MultiTraitModal.jsx` — Binding Shell and preserved public import path.
- `MultiTraitModal.view.jsx` — Portable, API-free View.
- `useMultiTraitModalViewModel.js` — Crestfall form mapping and selection rules.
- `MultiTraitModal.contract.js` — Versioned View prop/callback boundary.
- `MultiTraitModal.fixtures.js` — Isolated visual states.

## Behavior ownership

The ViewModel owns:

- reading and writing the configured Crestfall form field;
- normalization of existing string or array values;
- exclusive-option behavior;
- none/clear behavior;
- custom-value addition;
- translation from semantic option IDs to stored values.

The View owns layout, selection styling, custom-entry presentation, and safe
invocation of semantic callbacks.

## Preview

Development-only route:

`/dev/ui-preview/multi-trait-modal`

The preview uses fixtures only and never reads or writes Crestfall data.
