# Lore Document Renderer LOOM Package

**Contract:** `lore_document_renderer_contract_v3`

## Purpose

Renders normalized Lore documents as sourcebook-style reader pages for owner
preview, public immutable revisions, and compact builder preview.

## Boundary

```text
LoreDocumentRenderer.jsx
  → useLoreDocumentRendererViewModel.js
  → LoreDocumentRenderer.view.jsx
```

- The Binding Shell injects Next.js Link and the application clipboard/share
  control.
- The ViewModel normalizes the Lore document.
- The portable View owns sourcebook presentation, contents links, deep-link
  placement, reference links, and injected share-control placement.

The View does not fetch, publish, mutate, or access the clipboard directly.

## Package assets

- `LoreDocumentRenderer.contract.js`
- `LoreDocumentRenderer.fixtures.js`
- `loreDocumentRendererDiagnostics.mjs`
- `/dev/ui-preview/lore-document-renderer`


## Parchment presentation

Lore reader sheets use the ten static assets at `public/images/parchments/1.png`
through `10.png`. `loreParchmentPresentation.js` selects a stable pseudo-random
cover and chapter sequence from the Lore creation ID (or another stable caller
seed). The same publication therefore keeps the same visual identity across
reloads while different publications and chapters naturally vary.

The selection layer is presentation-only: it does not persist a parchment
choice, call an API, or change Lore document data. A future author-selected
override can be added without changing the document renderer's data authority.
