# Vault edit-tree classification: the CR-007/CR-008 held rows

Written 11 Aug 2026 on branch design/vault-edit-tree, cut from
origin/design/sprint-h-final at e7fdc39. This file is owned by this
pass alone; it is not one of the reserved shared documents
(docs/APP-FUNCTION-MAP.csv, docs/BUILD-BLUEPRINT.md,
docs/CRESTFALL-DESIGN-CONTEXT.md, docs/PARITY-AUDIT.md,
docs/PARITY-ECHO-FULL.md are untouched by this pass).

## Source and count

`docs/PARITY-ECHO-FULL.md`'s Vault section groups the CR-007/CR-008
partial hold into three CSV line ranges, 97 rows total:

- Lines 717-784 (68 rows): the full edit tree.
- Lines 838-844 (7 rows): the preview tree (Lore preview surface).
- Lines 409-430 (22 rows): the image-library.

68 + 7 + 22 = **97 rows found**, matching the brief's estimate exactly.
Every row below is read from `docs/APP-FUNCTION-MAP.csv` directly
(not from the parity echo's prose), cited by its exact CSV line
number.

## Method

Read in full this session: `app/studio/v2/vault/VaultV2Mockup.jsx`,
`app/studio/v2/vault/page.jsx`, `app/studio/v2/editor/Editor.jsx`,
`app/studio/v2/editor/editor/Editor.view.jsx`,
`Editor.contract.js`, `useEditorViewModel.js`, `Editor.fixtures.js`,
`editorSavedCreations.mock.js`, `README.md`; the legacy read-only
`components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx`
in full (714 lines, every `activeSection ===` branch enumerated);
`components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx`
in full; `components/studio/my-creations/image-library/CreationImageLibraryPage.jsx`,
its `creation-image-library-page/` LOOM set (contract, README, preview
client) in full; `app/studio/my-creations/[id]/preview/page.js` for
the legacy preview page's exact `LoreDocumentRenderer` call.

## Bucket totals

| Bucket | Count |
|---|---|
| COVERED | 72 |
| GAP | 15 |
| DEFERRED | 9 |
| RETIRED | 1 |
| **Total** | **97** |

GAP bucket is 15 rows, under the 25-row cap; nothing is truncated.

## Group A: the edit tree (CSV lines 717-784, 68 rows)

All 68 rows are **COVERED**. `app/studio/v2/editor/Editor.jsx` (the
Binding Shell) composes the exact same, unmodified,
already-production-wired components the legacy
`/studio/my-creations/[id]/edit` page uses
(`CreationEditMediaPanel`, `CreationEditStickyActionBar`,
`CreationFeaturedImagePickerModal`, `CreationEditMechanicsRuntimeQuickNav`,
`CreationEditSectionContent`). `CreationEditSectionContent.jsx` was
read in full this session and every `isCharacterLike &&
activeSection === "..."` branch (identity, appearance, body,
behavior, advanced, mechanicsProfile, runtimeModules,
visualReferences) delegates to the exact legacy section component
the CSV row names (`IdentitySection`, `AppearanceSection`,
`BodySection`, `BehaviorSection`, `AdvancedSection`, confirmed at
`CreationEditSectionContent.jsx:422-443`), plus the universal
`publishing` (line 680) and `danger` (line 701) branches. Pre-existing
stub behavior inside these unmodified legacy components (row 723's
literal `'...'` chat-media text, row 733's disabled Preview Soon, row
736's disabled template-management placeholders, row 740's disabled
Public toggle, rows 756-757's unpopulated slot controls) is inherited
unchanged, not a v2-specific gap: the View never touches these files,
so nothing regressed and nothing was fixed, per the file boundary.

| CSV line | control | bucket | evidence |
|---|---|---|---|
| 717 | Set Default PC | COVERED | `Editor.view.jsx:79-89`, wired via `canSetDefaultPc`/`onSetDefaultPc` from the shell. |
| 718 | ← My Creations | COVERED | `Editor.view.jsx` "Back" control; destination is origin-resolved (`Editor.jsx:30-44`), a presentation change under Contract Law, same back function. |
| 719 | Section tabs | COVERED | `Editor.view.jsx:116-141`, `activeSections.map`, wired to `onSelectSection`. |
| 720 | Featured slot thumbnails | COVERED | `CreationEditMediaPanel`, unmodified, composed at `Editor.jsx:14,68`. |
| 721 | Replace Slot | COVERED | Same component. |
| 722 | Go to Library | COVERED, noted | Same component; its internal route is hardcoded to the legacy `/studio/my-creations/[id]/image-library` (`creation-edit-media-panel/useCreationEditMediaPanelViewModel.js:54`), outside this brief's file boundary to change. Phase two adds a v2-native image-library destination alongside it (see Group C); the panel's own internal link is unchanged, logged here per the "compose around it" guardrail. |
| 723 | Chat Media section | COVERED | Same component, inherited `'...'` stub. |
| 724 | Image Studio Ingredient info card | COVERED | Same component. |
| 725 | Refresh (featured picker) | COVERED | `CreationFeaturedImagePickerModal`, unmodified, composed at `Editor.jsx:16,80-84`. |
| 726 | Close (featured picker) | COVERED | Same component. |
| 727 | Use as [Slot] | COVERED | Same component. |
| 728 | Load More (featured picker) | COVERED | Same component. |
| 729 | Mechanics quick nav jump links | COVERED | `CreationEditMechanicsRuntimeQuickNav`, unmodified, composed at `Editor.jsx:18,69-71`; shown via `showMechanicsQuickNav`. |
| 730 | Collapse/Expand (quick nav) | COVERED | Same component. |
| 731 | Title | COVERED | `CreationEditSectionContent`'s overview branch, unmodified. |
| 732 | Public Description | COVERED | Same. |
| 733 | Preview Soon | COVERED | Same, inherited disabled no-op. |
| 734 | Visibility select | COVERED | `activeSection === "publishing"`, `CreationEditSectionContent.jsx:680`. |
| 735 | Content Rating select | COVERED | Same. |
| 736 | Template-management Soon buttons | COVERED | Same, inherited disabled placeholders. |
| 737 | Submit for Public Review | COVERED | Same. |
| 738 | Submit for Canon Review | COVERED | Same. |
| 739 | Visibility pills | COVERED | `CreationEditStickyActionBar`, unmodified, composed at `Editor.jsx:15,79`. |
| 740 | Public toggle | COVERED | Same, inherited disabled. |
| 741 | Review Actions/lifecycle button | COVERED | Same. |
| 742 | Unlist for Editing | COVERED | Same. |
| 743 | Save Changes | COVERED | Same. |
| 744 | Cancel Review | COVERED | Same. |
| 745 | Canon Locked notice | COVERED | `activeSection === "danger"`, `CreationEditSectionContent.jsx:701`. |
| 746 | Archive Creation | COVERED | Same. |
| 747 | Delete Creation | COVERED | Same. |
| 748-758 | Identity section (11 rows: Name, Title, Species, Custom Species, Default Rendering Style, Age, Gender Presentation, Custom Gender Presentation, Color Palette slot, Role/Archetype slot, Creation Type) | COVERED | `IdentitySection`, `CreationEditSectionContent.jsx:422-424`, unmodified. |
| 759-765 | Appearance section (7 rows: Skin Tone, Eye Color, Hair, Visual Heritage, Select Outfit, Select Wardrobe, Clear) | COVERED | `AppearanceSection`, `CreationEditSectionContent.jsx:426-431`, unmodified. |
| 766 | Custom Body Notes | COVERED | `BodySection`, `CreationEditSectionContent.jsx:433-435`, unmodified. |
| 767-768 | Verbosity, Philosophy | COVERED | `BehaviorSection`, `CreationEditSectionContent.jsx:437-439`, unmodified. |
| 769 | Advanced 7-field textarea group | COVERED | `AdvancedSection`, `CreationEditSectionContent.jsx:441-443`, unmodified. |
| 770-772 | Visual references (Refresh Library, Choose, Clear) | COVERED | `isCharacterLike && activeSection === "visualReferences"`, `CreationEditSectionContent.jsx:225`, unmodified. |
| 773-775 | Actor mechanics profile attachment (Attach/Replace, Remove, Notes) | COVERED | `isCharacterLike && activeSection === "mechanicsProfile"`, `CreationEditSectionContent.jsx:631`, unmodified. |
| 776-781 | Runtime mechanics modules (Attach, Remove, Enabled, Priority, Inheritance Mode, Mechanics Scope) | COVERED | `isCharacterLike && activeSection === "runtimeModules"`, `CreationEditSectionContent.jsx:641`, unmodified. |
| 782-784 | Mechanics module picker modal (tabs, Search, Module result card) | COVERED | Opened from the runtime-modules section above, same unmodified component tree. |

## Group B: the preview tree (CSV lines 838-844, 7 rows)

4 COVERED, 1 RETIRED, 1 GAP, 1 DEFERRED. `CreationEditSectionContent.jsx`
already renders Lore's "Public Preview" section
(`isLore && activeSection === "preview"`, lines 558-591) with
`LoreDocumentRenderer` (the same rehosted component the legacy
standalone `/studio/my-creations/[id]/preview` page uses,
`app/studio/my-creations/[id]/preview/page.js:44-50`), so most of the
document-body content is present for free. `LoreDocumentRenderer.view.jsx`
was read in full to check exactly what its `compact` prop (passed
`true` by the editor's embedded call, line 589) suppresses: only
`showContents` (`!compact && ...`, line 156), the table-of-contents
block. The copy-link buttons (`AnchorShareButton`, lines 112-119,
286-287) and the character/location reference chips (`CharacterLinks`/
`LocationLinks`, lines 120-127, 200-207) are NOT gated by `compact`
and always render.

| CSV line | control | bucket | evidence |
|---|---|---|---|
| 838 | Back to Lore editor | RETIRED | The standalone preview page's own separate route has no v2 equivalent; the v2 Public Preview is a tab inside the editor itself (reached via the section tabs, row 719), so a "back to editor" link has nothing to return from. Same underlying function (return to the edit surface) already satisfied by the tab model; a dedicated link is not carried forward. |
| 839 | Owner-only draft preview badge | GAP | No equivalent badge/label exists on the embedded preview today; buildable as a small addition inside `Editor.jsx`/`Editor.view.jsx` (files this brief owns), not inside the forbidden `CreationEditSectionContent.jsx`. |
| 840 | Lore document renderer | COVERED | `LoreDocumentRenderer`, `CreationEditSectionContent.jsx:579-590`, unmodified. |
| 841 | Contents (table of contents) | DEFERRED | Suppressed by the hardcoded `compact` prop inside the read-only, forbidden-to-edit `CreationEditSectionContent.jsx:589`. A one-line fix, but outside this brief's file boundary (editing that file is forbidden; a duplicate non-compact renderer stacked alongside it was rejected as confusing, redundant UI, not the smallest build). Logged as a composed-around kit gap, not built this pass. |
| 842 | Copy section/chapter link | COVERED | `AnchorShareButton`, always renders regardless of `compact` (`LoreDocumentRenderer.view.jsx:110-119,286-287`). |
| 843 | Character/Location reference chips | COVERED | `CharacterLinks`/`LocationLinks`, always renders regardless of `compact` (`LoreDocumentRenderer.view.jsx:120-127,200-207`). |
| 844 | Development preview/test banner | COVERED | `testBannerText`, passed and rendered, `CreationEditSectionContent.jsx:587-588`. |

## Group C: the image-library (CSV lines 409-430, 22 rows)

14 GAP, 8 DEFERRED. No v2 route exists for image-library management
today (confirmed: `find app/studio/v2/vault app/studio/v2/editor`
returns no `image-library` path). But a fully portable, already-LOOM'd
legacy package exists and is unused by any v2 surface:
`components/studio/my-creations/image-library/CreationImageLibraryPage.jsx`
(Binding Shell) + `creation-image-library-page/` (View, ViewModel,
contract v1.0.0, fixtures, README, preview route at
`/dev/ui-preview/creation-image-library-page`). Its README states
plainly what it renders: "featured slots, filters, visible and hidden
image cards, moderation status, pagination, and semantic action
controls." This maps onto the page-head, featured-slots, filter-row,
visible/hidden-library, and image-card rows below directly; composing
it fresh into a new v2 page (this brief's own file, not a change to
the legacy package) is a real, buildable GAP under the "compose
existing packages" guardrail, not new-surface invention.

The lightbox rows are a different story. `docs/PARITY-ECHO-FULL.md`'s
Images section records a standing, cross-page ruling, OPEN item 28
("viewer reconciliation"), holding back 9 of `MediaLightbox`'s 13
controls identically on both Community and Images: Download, Details,
Report (+ its two subfields), Generate Variant, Delete, thumbnail
rail, and the three Soon stubs. Share is explicitly named as NOT held
(Present on both pages). Since Vault's image-library lightbox is the
same shared `MediaLightbox` component
(`components/studio/media/MediaLightbox`, composed by
`CreationImageLibraryPage.jsx:5,21`), the same standing ruling applies
here; lifting it for Vault alone while Community and Images stay held
would be an undocumented, single-page exception this brief has no
ruling to make. Those rows are DEFERRED to OPEN item 28, not built.

| CSV line | control | bucket | evidence |
|---|---|---|---|
| 409 | Refresh (page head) | GAP | `useCreationImageLibraryPageViewModel`'s `onRefresh`, confirmed wired in the preview client (`CreationImageLibraryPagePreviewClient.jsx:55`). Buildable via a new v2 Binding Shell composing `CreationImageLibraryPage`. |
| 410 | Back to Editor | GAP | `backHref` prop on the portable View (`CreationImageLibraryPage.contract.js:13`); the new v2 page points it at `/studio/v2/editor/[id]`. |
| 411 | Featured slots grid | GAP | `featuredSlotCards` prop, same package. |
| 412 | Eligibility filter | GAP | `eligibilityFilterOptions`/`onSetEligibilityFilter`, same package. |
| 413 | Sort select | GAP | `sortOptions`/`onSetSortMode`, same package. |
| 414 | Character Images masonry grid | GAP | `visibleImages`, same package. |
| 415 | Slot assignment buttons | GAP | `onAssignFeaturedSlot`, same package. |
| 416 | Hide | GAP | `onHideImage`, same package. |
| 417 | Show | GAP | `onShowImage`, same package. |
| 418 | Delete Image (card) | GAP | `onDeleteImage`, same package. |
| 419 | Like (hover quick action) | GAP | `onToggleLike` via `renderQuickActions`/`MediaTileQuickActions`, same package. |
| 420 | Bookmark (hover quick action) | GAP | `onToggleBookmark`, same package. |
| 421 | Expand (opens lightbox) | GAP | `onOpenPreview`/`lightboxProps`, same package; opens `MediaLightbox`, whose Like/Bookmark/Share/Close are Present per the OPEN item 28 disposition below. |
| 422 | Generate Variant (lightbox) | DEFERRED | OPEN item 28 hold, `docs/PARITY-ECHO-FULL.md` Images section, held identically on Community and Images. |
| 423 | Download (lightbox) | DEFERRED | Same. |
| 424 | Details (lightbox) | DEFERRED | Same. |
| 425 | Report (lightbox) | DEFERRED | Same. |
| 426 | Reason select (report dialog) | DEFERRED | Subfield of 425, same hold. |
| 427 | Optional note (report dialog) | DEFERRED | Subfield of 425, same hold. |
| 428 | Remix/Reference/More Soon | DEFERRED | Same hold; these are also inherited permanently-disabled stubs regardless. |
| 429 | Delete Image (lightbox toolbar) | DEFERRED | Named explicitly inside the OPEN item 28 held set in `docs/PARITY-ECHO-FULL.md` ("Remix/Reference/More Soon, Delete"), unlike the card's own Delete (418), which is a distinct control outside the lightbox. |
| 430 | Share (lightbox) | GAP | Explicitly Present (not held) on Community and Images per `docs/PARITY-ECHO-FULL.md`; same `MediaLightbox` Share control, buildable here identically. |

## GAP list summary (15 rows, all built in phase two)

1. Row 839: owner-only draft preview badge on the editor's Lore
   Public Preview section.
2. Rows 409-421, 430 (14 rows): the v2 image-library page, one new
   page composing the existing `CreationImageLibraryPage` legacy
   package, reached from a new "Manage image library" control added
   to the editor's own View (not the forbidden media panel).

## DEFERRED list (9 rows)

- Row 841: Lore preview Contents/TOC, blocked on a one-line change to
  the forbidden `CreationEditSectionContent.jsx` (out of file
  boundary this pass).
- Rows 422-429 except 430 (8 rows): image-library lightbox controls
  held under the standing, cross-page OPEN item 28 ruling (viewer
  reconciliation), identical to Community's and Images' own
  disposition. Not a missing control unique to Vault; lifting it here
  alone would be an unruled exception.

## RETIRED list (1 row)

- Row 838: "Back to Lore editor" link, superseded by the tab-based
  navigation model (the Public Preview is a section inside the
  editor, not a separate page to return from).
