# Mechanics Document Core — M1

## Purpose

This package is the shared, pure compatibility layer for the complete Mechanics
Module `creation.data` document. It was introduced after the M0 compatibility
freeze and before any tracker, command, progression, effect, resolution, status,
or guard UI extraction.

## Ownership

The package owns:

- canonical root and `instanceData` defaults;
- current Mechanics identity constants;
- root and instance-data normalization;
- recovery of documented snake_case aliases;
- finite priority coercion and tag normalization;
- unknown-field preservation at the root, `operationTriggers`, `instanceData`,
  and `defaults` levels;
- immutable domain replacement helpers;
- read-only selectors used by authoring surfaces and diagnostics.

The package does not own:

- tracker, command, effect, requirement, resolution, progression, status, or
  guard internal normalization;
- React form state for those domains;
- API calls, persistence, routing, presets, JSON validation, or engine runtime;
- saved-asset migration policy.

## Compatibility rule

Known canonical fields are normalized while unknown metadata is retained.
Legacy aliases are read to populate canonical fields and are not deleted by
normalization. This permits forward-compatible metadata and legacy evidence to
survive complete-document replacement.

## Integrated parents

- Mechanics Module create ViewModel
- Mechanics Module definition editor
- JSON and preset whole-document replacement through the definition editor

Both create and edit continue to replace the complete Mechanics `data` object
atomically. M1 removes the former create allowlist loss by sending the complete
normalized document.

## Development preview

`/dev/ui-preview/mechanics-document-core`

The preview is unavailable in production and performs no persistence.
