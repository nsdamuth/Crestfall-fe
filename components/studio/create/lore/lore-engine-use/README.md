# Lore Engine Use LOOM Package

**Contract:** `lore_engine_use_contract_v1`

## Purpose

Configures a voluntary engine-use submission for the active immutable public
Lore revision. It records authored scope, Character knowledge relationships,
and optional Location relevance without modifying the editable draft or public
release.

## Boundary

```text
LoreEngineUse.jsx
  → useLoreEngineUseViewModel.js
  → LoreEngineUse.view.jsx
```

The ViewModel owns API state, configuration, validation, submission,
cancellation, withdrawal, and future-compatible polling. The portable View
contains no direct Next.js, database, or provider calls.

Patch 14 records the durable foundation only. It does not process content,
activate Character knowledge, or perform runtime retrieval.
