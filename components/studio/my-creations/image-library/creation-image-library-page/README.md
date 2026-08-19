# Creation Image Library Page LOOM boundary

`CreationImageLibraryPage.jsx` is the thin Crestfall Binding Shell. It injects
Next.js `Link`, `MediaTileQuickActions`, and `MediaLightbox` into the portable
Skin.

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

## W19 Library Pass owner wiring

The Image Library now composes the exact Chassis owner Library Pass ViewModel
through the accepted owner binding.

Creators can see current pricing/tier/reward/public-preview metrics and pause or
resume new Library Pass sales when Chassis eligibility rules allow it.

Refresh reloads both image-library state and owner Library Pass state.

The portable View remains FE-owned and the contract is now `1.1.0`.

The separate image-reassignment functionality present in current Chassis remains
outside W19 so its coin mutation/reassignment semantics can be reconciled
through the accepted reassignment binding independently.

## W20 Image Reassignment

Creation-owned images are marked reassignment-eligible only when the current
Creation and image ownership identities agree and the image has an authoritative
output ID.

The Image Library passes reassignment through the shared Media Lightbox. After a
successful move it reconciles the returned server Coin balance into the Studio
Account, closes the current preview, refreshes both image-library and Library
Pass owner state, and presents a success message.

W19 Library Pass owner composition and `showBackLink` behavior remain intact.

The Image Library portable View contract is now `1.2.0`.
