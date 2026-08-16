# Editor Save Bar LOOM package

**RETIRED, ED1C (13 Aug 2026,
`docs/plans/ED1B-EDITOR-PAGE-SPEC.md`).** The v2 editor page no
longer composes a save bar: save state, Save, and Discard moved into
the page's ToC rail (desktop) and sticky bottom control bar +
bottom sheet (mobile), rendered by `Editor.view.jsx` itself so save
state is always visible without scrolling. This package has no
consumer on the v2 route; it is recorded here rather than deleted,
the same precedent as `edit/creation-edit-sticky-action-bar`. The
preview route remains as a historical reference.

**Contract:** `EditorSaveBar.contract.js`, 2.0.0 (final)

## Purpose

N2 (ruling, ratified option A, 12 Aug 2026,
`docs/plans/FABLE-GATE-2-STUDIO.md`) as amended by ED1B
(`docs/plans/ED1B-EDITOR-PAGE-SPEC.md` section 3.3): a contextual
save bar docked under the sticky top bar
(`sticky top-[var(--topbar-h)]`), appearing only when something
changed, a save is in flight, or the last save failed. Save,
Discard, and a status word; no visibility, review, or canon
controls. `saveMessage` is plain language supplied by the caller's
ViewModel; a raw client `error.message` never renders here. Replaces the
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

## Visibility rule (contract 2.0.0)

Visible when and only when `hasUnsavedChanges`, or `saveStatus` is
`"saving"`, or `saveStatus` is `"error"`. Hidden at rest AND hidden
after a successful save once the form is clean again: the bar
disappearing is the confirmation, no persistent "Saved" chrome.
States: dirty (status word "Unsaved changes"), saving (spinner +
"Saving...", Save disabled), error (`--status-danger` plain words,
`role="alert"`, Save re-enabled).

## Preview

```text
/dev/ui-preview/editor-save-bar
```
