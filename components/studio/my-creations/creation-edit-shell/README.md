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
  CreationEditMechanicsRuntimeQuickNav.jsx
    Crestfall-owned browser-event integration
  CreationEditShell.contract.js
  CreationEditShell.fixtures.js
  creationEditShellDiagnostics.mjs
```

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
