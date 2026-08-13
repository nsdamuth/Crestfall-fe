# Editor LOOM package

**Contract:** `Editor.contract.js` (v3.0.0, BREAKING, ED1B,
`docs/plans/ED1B-EDITOR-PAGE-SPEC.md`: the single-surface editor
page, rebuilt after Brian's NO on the ED1 render. See the contract
file's own version note for the full breaking list. Summary: the tab
model is retired; the page is ONE scrolling document: identity
header with featured artwork and the switcher, contextual save bar,
the quick-create fields first and open, then the advanced fields in
named collapsible groups per type. Rulings N1 substance, N2, N5, N6,
N7 and O11 stand; the 13 Aug binding experience description governs
presentation.)

## Purpose

The advanced editor (`docs/STUDIO-SPEC.md` sections 1, 4, 6;
`docs/plans/ED1B-EDITOR-PAGE-SPEC.md`): the one full edit surface
for every saved creation, not Character alone. Build address
`/studio/v2/editor/[id]` (deep-linkable); `/studio/v2/editor` (no
`[id]`) is the index, rendering "Select a creation to edit" with the
SW1 picker call to action
(`app/studio/v2/editor/EditorIndexClient.jsx`). Rehost then seat:
this page carries the standalone editor's full function by consuming
the existing `components/studio/my-creations/**` edit-section
components and ViewModels read-only, inside the ED1B single-surface
shell. Internal ids never render anywhere on the page; every error
renders as plain language (the raw client `error.message` never
reaches a View).

## Boundary

```text
Editor.jsx (Shell, ../Editor.jsx)
  -> outer: owns discardKey (remount-driven Discard AND the
     load-error "Try again" action, see below)
  -> inner (EditorInner): owns Next.js router, the switcher/picker
     open state, the dev-only harness overrides (preview only)
  -> useEditorViewModel.js
      -> resolves [id] fixture-first via editorSavedCreations.mock.js
      -> composes the READ-ONLY useCreationEditShellViewModel
         (components/studio/my-creations/creation-edit-shell/**)
      -> resolves the ED1B page grammar per type
         (resolveEditorPageGroups, creationEditConstants.js: open
         essentials group + collapsible advanced groups, hostsMedia
         flag per ruling N5) and joins it with the type's section
         metadata (labels, icons)
      -> owns group open/close state, the O11 sheet state, and the
         load-vs-save error disambiguation (an error status with no
         wrapped user action behind it is a failed initial load and
         renders the friendly load-error state; every save/action
         error maps to fixed plain copy)
      -> derives header identity (featured art, title, type eyebrow
         and icon via terminology.js/typeMeta, visibility/canon chip)
  -> builds ReactNode maps from the READ-ONLY creation-edit-shell
     lineage: sectionNodes (one CreationEditSectionContent mount per
     section id, activeSection overridden per instance),
     sectionLeads (Mechanics quick nav above "fields"),
     sectionBadges (Lore owner-only draft preview above "preview"),
     plus CreationEditMediaPanel, CreationFeaturedImagePickerModal,
     EditorHeader (2.0.0), EditorSaveBar (2.0.0), and the SW1
     CreationPicker when the switcher opens
  -> Editor.view.jsx
      -> Back link -> header -> hairline rule -> save bar (sticky
         under the top bar, dirty/saving/save-error only)
      -> essentials region: the first group, open, quick-create
         fields first
      -> collapsible advanced groups in order, Publishing last; the
         hostsMedia group hosts the media panel + image-library link
      -> O11 bottom-sheet group/section jump list (Sections trigger
         in the header, below lg)
      -> friendly load-error state, loading skeleton
      -> featured image picker, creation picker (switcher)

editor/
  Editor.view.jsx       Portable Skin
  useEditorViewModel.js Chassis / orchestration adapter
  Editor.contract.js
  Editor.fixtures.js    seven saved-creation fixtures
  editorSavedCreations.mock.js  the named [id] mock resolver
  README.md
```

## Discard and Try again

`useCreationEditViewModel` (the existing hydration authority, not
touched by this wave) exposes no "revert form" capability.
`../Editor.jsx` splits into an outer component holding a
`discardKey` counter and an inner component keyed on it; Discard
increments the counter, remounting the inner component and every
hook inside it, which re-runs hydration from the same
`creationId`/`creation` snapshot. The load-error state's "Try again"
action is the same remount.

## Fixture-first [id] resolution and the ED1 defect

`editorSavedCreations.mock.js` resolves known fixture ids to the
full saved-creation fixtures in `Editor.fixtures.js`; any other id
falls through unmodified to `useCreationEditViewModel`'s existing
`fetchOwnedCreation` live path. ED1B root-cause fix: every fixture
now carries `ownerId` and `updatedAt` so it passes the read-only
hook's `hasUsableCreation` check. Without them (the ED1 defect,
`docs/plans/ED1B-EDITOR-PAGE-SPEC.md` section 1) every fixture was
rejected, the form fell back to the CHARACTER-typed fallback (a
Story rendered as a Character), and the hydrate effect fired a live
query with the fixture id whose failure rendered a raw error. Save,
review, archive, delete, unlist, and default-PC continue through the
same existing client functions regardless of how the initial read
resolved.

## The rehost: what stays read-only

`useCreationEditShellViewModel`, `useCreationEditViewModel`,
`CreationEditSectionContent` (the registry-as-data dispatch),
`CreationEditMediaPanel`, `CreationEditMechanicsRuntimeQuickNav`,
`CreationFeaturedImagePickerModal`, every section package, and the
legacy `/studio/my-creations/[id]/edit` page are consumed unmodified
by ED1B. `creationEditConstants.js` gained the ED1B page grammar as
an additive export (`CREATION_TYPE_EDITOR_PAGE_GROUPS`,
`resolveEditorPageGroups`); the ED1 tab grammar
(`CREATION_TYPE_SECTION_GROUPS`) remains for any legacy reader.
Multi-section rendering mounts `CreationEditSectionContent` once per
section id: it is a pure dispatch on (creationType, activeSection),
so overriding `activeSection` per instance renders every section on
the one scrolling surface. An apparent need to change a read-only
file stops that unit; none arose.

## The Lore rehost

`CreationEditSectionContent` already renders `LoreEditor` for
`isLore` + "document" and `LoreDocumentRenderer` for "preview" (with
`LorePublicationReadiness` on "publishing"), so the full structured
Lore authoring surface rehosts for free. On this page Lore resolves
to the grammar Lore (open: overview, document) / Public Preview /
Artwork & Media / Publishing, and the owner-only draft preview badge
renders above the preview section via `sectionBadges`.

## Named absorption seats

`sectionSeats` maps section id -> ReactNode, all null this pass, no
placeholder UI: `body` (Kibbe body identity, body type, height,
build, proportions), `behavior` (personality, speech and movement,
interests, typology, voice modules), `advanced` (advanced prompting
suite). Each seat renders immediately after that section's rehosted
content.

## Fixture states

Seven full saved-creation fixtures (Character default, Lore, Story,
Location, NPC Registry, empty sections, longest content), each
exercising its own ED1B group grammar and type identity (eyebrow,
group names, fields). Loading, load-error, and dirty are preview
harness overrides on `Editor.jsx` (`previewLoadingOverride`,
`previewLoadErrorOverride`, `previewDirtyOverride`, same precedent
as `originOverride`): the fixture-first resolver is synchronous and
read-only. Dirty forces the save bar visible and arms the header's
switch confirm; the empty index state renders via
`EditorIndexClient` in the preview mirror. The mobile sections sheet
is live-interactive: emulate 390 and tap Sections.

## Preview

Auth-free, development only:

```text
/dev/ui-preview/editor-v2-page
```

Switches among the seven fixture ids, the empty index, origin, and
load-state/dirty harnesses; mounts the same `Editor.jsx` Binding
Shell used at `/studio/v2/editor/[id]`.
