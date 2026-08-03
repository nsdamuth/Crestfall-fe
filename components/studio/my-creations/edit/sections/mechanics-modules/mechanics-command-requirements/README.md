# Mechanics Command Requirements

LOOM package for `command.requirements` authoring.

It owns ordinary state requirements, target-presence requirements, Progression requirement aliases, tier-list normalization, and `ADVISORY` / `HARD_LOCK` enforcement projection. It does not evaluate requirements at runtime and does not own Guards, effects, resolution, domain actions, or command execution.

Storage remains `creation.data.instanceData.commands[].requirements[]`. The parent keeps complete-document replacement and injects updates through `onPatchCommand`.
