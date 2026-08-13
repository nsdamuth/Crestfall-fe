# Editor Header LOOM package

**Contract:** `EditorHeader.contract.js`, 1.0.0

## Purpose

The advanced editor's identity header (`docs/plans/FABLE-GATE-2-STUDIO.md`
wave ED1, ruling N1 option A): asset art thumb, display-name title,
type eyebrow (from `lib/shared/presentation/terminology.js`), a
visibility status chip (composes `KitBadge`), and the switcher
trigger that opens the creation picker (`components/studio/creation-picker/`,
wave SW1). Mounted by `app/studio/v2/editor/editor/Editor.view.jsx`
above the section navigation, replacing the identity block that used
to live inline in that file.

## Boundary

```text
EditorHeader.jsx                                Public Shell
  ↓
editor-header/
  useEditorHeaderViewModel.js                   Thin pass-through
  EditorHeader.view.jsx                          Portable View, composes KitBadge
  EditorHeader.contract.js
  EditorHeader.fixtures.js
```

Fixture-fed, owns no data, matching kit-batch practice for a
presentation-only piece (`components/kit/KitPickerModal.jsx` is the
same shape). The advanced editor's own `Editor.jsx` composes it with
values it already has (creation type, title, visibility, art) plus
the `CreationPicker` it opens as a ReactNode when the switcher fires.

## Unsaved-changes confirm on switch

When `hasUnsavedChanges` is true, activating the switcher trigger
arms a local "You have unsaved changes. Switch creations anyway?"
step (Keep editing / Discard and switch) before `onOpenSwitcher`
fires; when false, the trigger fires `onOpenSwitcher` immediately.
UI-only state, no extra props.

## Preview

```text
/dev/ui-preview/editor-header
```
