# Image Library LOOM package (v2 wrapper)

**Contract:** `ImageLibrary.contract.js` (v1.1.0)

## Purpose

Closes 14 of the 97 CR-007/CR-008 held rows
(`docs/VAULT-EDIT-TREE-CLASSIFICATION.md` Group C, CSV lines 409-421
and 430): featured slots, eligibility filter, sort, the visible/hidden
masonry grids, slot assignment, hide/show/delete, per-image
like/bookmark, and lightbox Share. Build address
`/studio/v2/editor/[id]/image-library`.

Not a rebuild. The already-portable, already-LOOM'd, read-only legacy
package `components/studio/my-creations/image-library/CreationImageLibraryPage`
(contract v1.0.0 of its own) already renders all of the above; this
package composes it fresh rather than editing it, per the brief's
"compose existing packages" guardrail.

## Boundary

```text
../ImageLibrary.jsx (Shell, one level up)
  -> owns Next.js router/searchParams, resolves `origin` the same way
     ../Editor.jsx does
  -> useImageLibraryViewModel.js (resolves only the v2 backHref)
  -> composes the READ-ONLY components/studio/my-creations/image-library/CreationImageLibraryPage
     as the `libraryPanel` ReactNode slot
  -> ImageLibrary.view.jsx
      -> v2 header (creation id, "Back to editor")
      -> libraryPanel

image-library/
  ImageLibrary.view.jsx        Portable Skin
  useImageLibraryViewModel.js  Chassis
  ImageLibrary.contract.js
  ImageLibrary.fixtures.js     this wrapper's own View states
  README.md
```

## Double back control, FIXED 11 Aug 2026 (Sprint H render review, item 4)

`CreationImageLibraryPage`'s own internal "Back to editor" link
routed to the legacy `/studio/my-creations/[id]/edit` address
(`useCreationImageLibraryPageViewModel.js`), duplicating this
wrapper's own origin-aware "Back to editor" control. This pass's
ruling authorized editing that legacy package as the fix: it gained
an additive optional `showBackLink` prop (default `true`, unchanged
for its own `/studio/my-creations/[id]/image-library` caller), and
`../ImageLibrary.jsx` now passes `showBackLink={false}` when
composing it here. Only this wrapper's own "Back to editor" (routing
to `/studio/v2/editor/[id]`) renders on this page now.
`imageStudioHref` is untouched (out of this item's scope).

## Reached from

`../Editor.jsx`'s new `imageLibraryHref` prop (see
`../editor/README.md`), rendered as a "Manage image library" link
beside the editor's media panel.

## Preview

Auth-free, development only:

```text
/dev/ui-preview/editor-image-library-v2-page
```

Switches between this wrapper's two own fixture states (`default`,
`longestContent`); the composed `CreationImageLibraryPage` itself is
exercised at its own preview, `/dev/ui-preview/creation-image-library-page`.
