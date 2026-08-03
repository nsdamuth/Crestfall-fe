# Lore Asset LOOM Boundary

## Binding shells

- `LoreBuilderShell.jsx` binds the create-page builder.
- `LoreEditor.jsx` binds the controlled editor used by the existing creation edit shell.
- `LoreDocumentRenderer.jsx` binds the reusable public/preview renderer.
- `lore-json-editor/LoreJsonEditorModal.jsx` binds the complete JSON round-trip modal.

## ViewModels / chassis

- `lore-builder/useLoreBuilderViewModel.js` owns draft identity, validation, save orchestration, and routing.
- `lore-editor/useLoreEditorViewModel.js` owns the structured document, compact owned/liked Character and Location autocomplete sources, chapter/section/block mutations, sourcebook layout-block mutations, and eligible owned-Character image-library selection.
- `lore-document-renderer/useLoreDocumentRendererViewModel.js` normalizes document data for rendering.
- `lore-json-editor/useLoreJsonEditorViewModel.js` owns JSON draft, copy, format, reset, AI-guide download, validation, and atomic apply behavior.

## Portable Views / skins

- `lore-builder/LoreBuilder.view.jsx`
- `lore-editor/LoreEditor.view.jsx`
- `lore-document-renderer/LoreDocumentRenderer.view.jsx`

The builder View renders the child portable Views directly. It does not import
child binding shells.

## Current boundary

The Lore document contract is `lore_document_contract_v4`:

```text
Lore Asset
└── Chapters
    └── Sections
        └── Sourcebook blocks
            └── Optional two-column child blocks
```

Sections are stable, addressable units with their own metadata, Character tags,
and Location tags. Each Asset, chapter, or section scope accepts up to five
Characters and five Locations through compact autocomplete controls that switch
between owned creations and public creations the creator has liked. Existing v0
chapter-level blocks are normalized
into a stable legacy section and are persisted using the current contract on the
next save.

The current sourcebook block set includes body text, headings, Character images,
two-column layouts, structured reference stat blocks, quotes, inline quotes, pull
quotes, archive excerpts, story excerpts, sidebar lists, callouts, and dividers.
The section editor exposes these through a compact searchable block library grouped
by Writing, Media & Layout, Quotations, and Archive & Reference so the growing block
set does not expand into a large row of individual controls.
Two-column layouts provide two responsive columns, each with independently
ordered body text, Character image, inline quote, and divider blocks. Reference
stat blocks preserve ordered label/value rows. These blocks control authored
presentation only; they do not grant character knowledge or assign future
runtime classifications.


The visual editor also exposes a complete Lore JSON Editor. Its downloadable
Markdown guide includes the current document JSON, supported block contracts,
limits, and instructions for an AI to return one complete replacement object.
Validate & Apply changes only the open visual editor state; the normal page Save
action remains the persistence boundary. Character, Location, and image
identifiers cannot be invented through the JSON flow: new references must first
be selected through the visual editor.

The current feature supports authoring, editing, owner preview, immutable security-validation
snapshots, and explicit publication of a passed revision. Character images remain limited to tagged Characters owned by
the Lore creator until cross-owner image reuse permissions are implemented. Images
are selected by library-entry reference, canonicalized during save, and revalidated
recursively during public preview, including images inside two-column layouts, so
hidden, unapproved, flagged, mismatched, or over-rating images do not render.

It does not implement runtime knowledge submission, Memory Palace writes,
engine bindings, character-use submission, or cross-owner Character/image permissions.


## Validated public releases

A Lore Asset may publish only an immutable validation snapshot whose validation status is `PASSED`. Publishing creates a numbered public release without changing the editable creation draft. Later draft saves remain private until a newer validation snapshot passes and is explicitly published. Public release does not enable character use.
