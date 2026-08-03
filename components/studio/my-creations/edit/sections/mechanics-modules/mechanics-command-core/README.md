# Mechanics Command Core — M4A

This LOOM package extracts only the command identity and invocation boundary from the Mechanics Module editor.

## Owned data

- command `id`, `label`, and `reason`
- `commandContractVersion`
- `invocation.version`
- canonical command name
- prefixes and creator aliases
- typed invocation arguments
- presentation mode, result visibility, narrative continuation, and time advancement
- trigger phrases

## Explicitly not owned

Requirements, attempt effects, base effects, target binding, domain actions, resolution, outcome branches, progression effects, command composition, presets, and whole-document JSON replacement remain in their existing owners.

## Compatibility

Normalization preserves unknown metadata on command, invocation, presentation, and argument objects. Legacy snake-case aliases remain readable. Implicit `SELF` and `PLAYER_CHARACTER` arguments remain non-positional and cannot consume authored text.

## Storage

The package edits command entries under `instanceData.commands[]`. The parent still replaces the complete Mechanics document atomically.
