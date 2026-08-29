# Editor Artwork Hero LOOM package (editor-header)

**Contract:** `EditorHeader.contract.js`, 3.0.0

## Purpose

The advanced editor's artwork hero
(`docs/plans/ED1B-EDITOR-PAGE-SPEC.md` section 3.2, ED1C): the
primary featured art large (the ACTIVE slot; fluid across phone/tablet
widths so the artwork rail uses the available hero space, then 300px
at desktop and 320px on wider desktop layouts), the other featured slots as a thumb rail
beside it (tap to make a slot the displayed primary), the type
eyebrow (from `lib/shared/presentation/terminology.js`, the type
identity surface), title, visibility chip (composes `KitBadge`), an
`actions` meta-row seat, and the artwork actions: Replace image
(opens the featured image picker, which composes KitModalFrame),
Generate more (routes to the Images generation surface), and Image
library. Mounted by `app/studio/v2/editor/editor/Editor.view.jsx`
as the `hero` slot at the top of the page, so switching creations
immediately shows what is being worked on.

The creation switcher, the unsaved-changes confirm, and the save
state left this package at 3.0.0: they live in the page's ToC rail
and mobile bottom bar (Editor contract 4.0.0). This package knows
nothing about save state or navigation.

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

Fixture-fed, owns no data. The editor's `Editor.jsx` composes it
with slot data derived from the creation's `featuredMedia`, the
active-slot state the read-only shell ViewModel already tracks, and
hrefs it owns (origin-preserving image-library route, the Images
page).

## Preview

```text
/dev/ui-preview/editor-header
```
