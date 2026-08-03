# Lore Document Renderer LOOM Package

**Contract:** `lore_document_renderer_contract_v2`

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
