# Editor Save Bar LOOM package

**Contract:** `EditorSaveBar.contract.js`, 1.0.0

## Purpose

N2 (ruling, ratified option A, 12 Aug 2026,
`docs/plans/FABLE-GATE-2-STUDIO.md`): a top-docked contextual save
bar sitting directly under the editor header, appearing only when
there is something to say about save state (unsaved changes, or a
save in flight / just finished / errored). Save, Discard, and a
status word; no visibility, review, or canon controls. Replaces the
floating bottom sticky action bar
(`edit/creation-edit-sticky-action-bar`) for the v2 editor page only;
that package is retired for this route and unchanged for the legacy
`/studio/my-creations/[id]/edit` route.

## Boundary

```text
EditorSaveBar.jsx                               Public Shell
  ↓
editor-save-bar/
  useEditorSaveBarViewModel.js                  Thin pass-through
  EditorSaveBar.view.jsx                         Portable View
  EditorSaveBar.contract.js
  EditorSaveBar.fixtures.js
```

Fixture-fed, no data ownership. The v2
editor's own `Editor.jsx` composes it with the save state its
existing `useCreationEditViewModel` chain already tracks
(`hasUnsavedChanges`, `saveStatus`, `saveMessage`, `handleSave`), plus
a remount-driven Discard (see `Editor.jsx`'s own comment: Discard
remounts the editor subtree, which re-hydrates the form from the last
saved snapshot, since no client-side "revert form" capability exists
in the read-only `useCreationEditViewModel` hook this wave does not
touch).

## Visibility rule

Hidden when `!hasUnsavedChanges && saveStatus === "idle"`. Visible
otherwise: dirty (status word "Unsaved changes"), saving (spinner +
"Saving..."), saved (status word, Save/Discard both settle since the
form is clean again), error (`--status-danger` word, `role="alert"`).

## Preview

```text
/dev/ui-preview/editor-save-bar
```
