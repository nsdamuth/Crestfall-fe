# Creation Edit Shell LOOM package

## Purpose

This package separates the reusable Creation editor frame from Crestfall-owned
Creation loading, persistence, routing, media selection, editor-section
composition, and Mechanics browser-event integration.

## Boundary

```text
CreationEditShell.jsx
  Binding Shell
  ├─ Next.js Link
  ├─ CreationEditMediaPanel
  ├─ CreationFeaturedImagePickerModal
  ├─ CreationEditStickyActionBar
  ├─ CreationEditSectionContent
  └─ CreationEditMechanicsRuntimeQuickNav

creation-edit-shell/
  CreationEditShell.view.jsx
    Portable Skin
  useCreationEditShellViewModel.js
    Chassis / orchestration adapter
  CreationEditSectionContent.jsx
    Crestfall-owned editor composition
  creationEditSectionComponentMap.js
    Registry-as-data section dispatch map (ED1)
  CreationEditMechanicsRuntimeQuickNav.jsx
    Crestfall-owned browser-event integration
  CreationEditShell.contract.js
  CreationEditShell.fixtures.js
  creationEditShellDiagnostics.mjs
```

## ED1 change, 12 Aug 2026 (docs/plans/FABLE-GATE-2-STUDIO.md, ruling
N1 option A, escalation authorized by that plan's GO)

Two files here moved from hand-written control flow to data, with no
behavior change:

- `useCreationEditShellViewModel.js`: `resolveCreationEditSections`
  (a 15-arm nested ternary) now looks up `CREATION_TYPE_SECTIONS`
  (`edit/creationEditConstants.js`), byte-for-byte the same
  resolution, same default fallback. `resolveCreationEditSectionGroups`
  (new) resolves each type's group grammar the same way from
  `CREATION_TYPE_SECTION_GROUPS` (also in `creationEditConstants.js`):
  every type's flat section list regroups into at most five named
  groups, consumed by the v2 editor's group-tab navigation
  (`app/studio/v2/editor/editor/Editor.view.jsx`). The legacy
  `/studio/my-creations/[id]/edit` page (via `CreationEditShell.view.jsx`,
  unchanged) still reads the flat `activeSections` list only; it does
  not consume the new group data.
- `CreationEditSectionContent.jsx`: the 42-guard if-chain is now a
  lookup into `SECTION_COMPONENT_REGISTRY`
  (`creationEditSectionComponentMap.js`), one entry per
  (creationType, sectionId) pair, mechanically transcribed from the
  old chain: same Component, same props, same condition, now data.
  "publishing," "danger," and Lore's "preview" (wrapped in its
  owner-preview link row) stay explicit in `CreationEditSectionContent.jsx`
  itself, since all three are universal or carry one real branch the
  registry doesn't model as a plain type/section pair.

Both changes are read-only-lineage-internal: every existing consumer
(this package's own `CreationEditShell.jsx` AND the v2 editor's
`Editor.jsx`) receives the exact same resolved data it did before.

The existing `useCreationEditViewModel` remains the authority for Creation
hydration, form mutation, save, review, archive, deletion, and featured-media
storage. The shell Chassis composes it and adds only type projection, section
selection, default Player Character mutation, and featured-image picker state.

## Portable Skin responsibilities

`CreationEditShell.view.jsx` renders only:

- the two-column editor frame
- the editor identity header
- section tabs
- the optional Set Default PC action
- injected media, quick-navigation, section-content, sticky-action, and modal
  slots

It does not import Next.js, Creation clients, Supabase, PostGraphile, editor
sections, image-library hooks, or Mechanics Module internals.

## Preserved application behavior

The Binding Shell still injects the same:

- Creation media panel
- Featured Image picker
- Sticky Action Bar
- My Creations route link
- type-specific editor sections
- Lore owner-preview link
- Runtime Mechanics attachment sections
- Mechanics Module fields editor
- Mechanics Runtime quick navigation

All save, review, archive, delete, unlist, featured-media, and default Player
Character clients remain on the same existing paths.

## Candidate assessment

`CharacterTemplateBuilderEditor.jsx` remains the application-owned composition
layer explicitly documented by the existing Character Template Builder LOOM
package. Creating another wrapper would duplicate that boundary.

The active Creation Reference Image Picker is already separated under
`image-library/creation-reference-image-picker`. The older top-level
`CreationReferenceImagePickerModal.jsx` is not imported by production code and
is not counted as another feature.

## Mechanics deferral

This conversion moves the existing Mechanics section mount unchanged. It does
not abstract or decompose:

- `MechanicsModuleFieldsSection.jsx`
- `RuntimeMechanicsModulesSection.jsx`
- `TrackersModuleConfigModal.jsx`
- progression profiles
- command composition or resolution
- preset catalogs or saved-asset migration

Mechanics Module field decomposition remains deferred until the promised final
repository reassessment.

## Preview

Development only:

```text
/dev/ui-preview/creation-edit-shell
```

The preview uses local fixture content and injected placeholders. It does not
load, save, publish, archive, delete, or mutate a real Creation.
