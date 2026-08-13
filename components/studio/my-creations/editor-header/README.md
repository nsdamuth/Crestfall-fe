# Editor Header LOOM package

**Contract:** `EditorHeader.contract.js`, 2.0.0

## Purpose

The advanced editor's identity header
(`docs/plans/ED1B-EDITOR-PAGE-SPEC.md` section 3.2, wave ED1B):
featured artwork (3:4 frame, 132px from sm, compact 72px at phone
widths), type eyebrow (from `lib/shared/presentation/terminology.js`,
the type identity surface), display-name title, a visibility chip
(composes `KitBadge`), an `actions` meta-row seat, the creation
switcher beside the artwork (`components/studio/creation-picker/`,
wave SW1), and the mobile Sections trigger for the O11 sheet.
Mounted by `app/studio/v2/editor/editor/Editor.view.jsx` at the top
of the single-surface editor page. The header paints no card of its
own: it sits on the canvas and the page composition owns the
closing rule.

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
