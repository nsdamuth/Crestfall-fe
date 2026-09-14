# Creation Image Library Page LOOM boundary

`CreationImageLibraryPage.jsx` is the thin Crestfall Binding Shell. It injects
Next.js `Link`, `MediaTileQuickActions`, and the image viewer adapter
`CreationImageLibraryImageViewer` (the Kit image viewer over the lightbox
ViewModel since 13 Sep 2026, fe/updates follow-up 1 FIX 2; the legacy
lightbox component is no longer imported here) into the portable Skin.

`useCreationImageLibraryPageViewModel.js` is the Chassis. It composes the
existing Creation image-library data hook, normalizes legacy image-output and
dimension aliases, loads reactions, persists Like/Bookmark changes, confirms
and deletes image outputs, projects featured-slot state, and orchestrates
visible/hidden library actions.

`CreationImageLibraryPage.view.jsx` is the Portable Skin. It renders featured
slots, filters, visible and hidden image cards, moderation status, pagination,
and semantic action controls without importing Crestfall clients or Next.js
navigation.

Protected preview: `/dev/ui-preview/creation-image-library-page`.

Focused diagnostics:

```bash
npm run diagnostics:loom:creation-image-library-page
```

Mechanics Module field decomposition remains deferred until the final
cumulative reassessment.
