# NPC Registry Linked Character Authority binding

Status: **WIRED**.

W7 closes the linked-Character NPC Registry authority seam.

A linked `CREATION_REF` persists stable Character identity plus Registry-local
notes only. Current Character display data is hydrated for editor presentation
and is not duplicated into Registry persistence.

The live FE deployment mirrors now use the authoritative Chassis:

```text
serializeNpcRegistryEntry
serializeNpcRegistryEntries
hydrateNpcRegistryEntries
```

The FE Builder presents current Character description/subtitle and current
type/status/visibility/content rating while keeping intentionally authored
Registry notes visually separate.

If old Registry notes exactly duplicate the hydrated Character description,
canonical serialization removes that accidental copy.

When a linked Character cannot resolve, the stable Creation ID remains
preserved and the Builder presents an explicit unavailable recovery state.

For linked Characters, mechanics continue to follow the Character Creation.
For `AD_HOC` NPCs, the Registry remains authority for authored name, notes, and
the optional Actor Mechanics Profile attachment.

`Crestfall` remains authority for serializer/hydrator semantics, Character
candidate loading, application draft mutation, payload construction, and
persistence. Matching utility/ViewModel files under `Crestfall-fe` are
deployment mirrors for the independently deployed Skin app.

The FE Builder visual language remains FE-owned; W7 does not replace it with the
differently styled source View.
