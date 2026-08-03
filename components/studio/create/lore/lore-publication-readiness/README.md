# Lore Publication Readiness LOOM Package

**Contract:** `lore_publication_readiness_contract_v4`

## Purpose

Projects saved-draft readiness, immutable validation state, and explicit public
release state without publishing directly from the portable View.

## Boundary

```text
LorePublicationReadiness.jsx
  → useLorePublicationReadinessViewModel.js
  → LorePublicationReadiness.view.jsx
```

- The Binding Shell injects Next.js Link.
- The ViewModel owns checklist projection, validation polling, submission,
  cancellation, publication, and unsaved-change guards.
- The portable View owns readiness, validation-history, and public-release
  presentation.

Validation freezes the last saved Lore revision. Publishing activates only a
passed immutable snapshot. Later draft edits remain private until another
revision passes and is explicitly published.

## Package assets

- `LorePublicationReadiness.contract.js`
- `LorePublicationReadiness.fixtures.js`
- `lorePublicationReadinessDiagnostics.mjs`
- `/dev/ui-preview/lore-publication-readiness`
