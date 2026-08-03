# Crestfall Option Modal Loom Feature

**Status:** Loom-separated

**View contract:** `1.0.0`

## Purpose

This feature provides the reusable option-picker used for Role Archetype across
character, player-character, character-template, and edit workflows.

## Structure

```text
CrestfallOptionModal.jsx
crestfall-option-modal/
  CrestfallOptionModal.view.jsx
  useCrestfallOptionModalViewModel.js
  CrestfallOptionModal.contract.js
  CrestfallOptionModal.fixtures.js
  README.md
```

## Binding Shell

`CrestfallOptionModal.jsx` preserves the existing import path and public props.
It invokes the ViewModel and passes the resulting contract to the portable View.

## ViewModel ownership

The ViewModel owns:

- open, search, custom-entry, and active-group state;
- source-option grouping and pinned-option behavior;
- search filtering and alphabetical ordering;
- selected-label resolution;
- custom-value trimming and application;
- returning the same selected string through the existing `onChange` callback.

## Portable View ownership

The View owns:

- trigger and modal markup;
- search, group, option, and custom-entry presentation;
- responsive grid layout;
- selected visual state;
- safe semantic callback invocation.

The View does not know which Crestfall field receives the selected value or how
that value is persisted.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/crestfall-option-modal
```

The route renders the portable View from fixtures and is unavailable in
production.

## Live validation

Validate at least one character workflow and one template or edit workflow:

1. Open Role Archetype.
2. Search and select a built-in option.
3. Switch groups and select another option.
4. Choose Custom and apply a custom role.
5. Save and refresh to confirm persistence.
