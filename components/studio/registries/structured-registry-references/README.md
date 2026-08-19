# Structured Registry Reference Precision semantics

Status: semantic presentation/reference contract and realistic fixtures only.

This package migrates the current structured-registry entry reference behavior
into the FE lane without moving graph resolution or persistence authority out of
Crestfall.

## Structured Registry types

The current structured-registry family covered here is:

```text
ORGANIZATION_REGISTRY
FACTION_REGISTRY
EVENT_REGISTRY
QUEST_REGISTRY
```

## Precise reference identity

A precise link into one of these registries is identified by:

```text
registryCreationId + registryEntryId
```

The presentation/reference key is:

```text
<registryCreationId>::<registryEntryId>
```

For ordinary Creation references the second half is empty:

```text
<creationId>::
```

This means two entries inside the same Registry remain distinct selectable
references.

## Current compatibility states

### Precise registry entry

```text
REGISTRY_ENTRY_RESOLVED
```

The linked entry resolves to the entry's own name/summary while retaining the
parent Registry title.

### Legacy whole-registry reference

```text
LEGACY_REGISTRY_REFERENCE
```

Older links that point only at the Registry Creation remain visible, but the UI
must identify them as imprecise and encourage choosing a specific entry.

### Missing registry entry

```text
REGISTRY_ENTRY_NOT_FOUND
```

A saved precise reference whose entry was removed degrades to a recoverable
presentation state rather than crashing the editor.

### Unavailable Creation

```text
UNAVAILABLE
```

A missing/unavailable parent Creation also degrades safely.

### Ordinary Creation

```text
CREATION_RESOLVED
```

Non-structured Creation references continue to resolve at Creation level.

## Direct self-reference guard

A structured Registry entry may not link directly to itself.

This is a precise check:

```text
same registryCreationId
AND same registryEntryId
```

A sibling entry inside the same Registry remains valid.

That distinction is required so creator-authored graph relationships can connect
entries within one Registry without creating a direct self-loop.

## Permanent boundary

Crestfall remains authoritative for:

- authoritative Registry Graph resolution
- deep retrieval
- runtime graph traversal
- persistence
- current Creation loading
- picker/application ViewModel orchestration
- server validation

Crestfall-fe owns display-ready reference identity/status semantics and emits
selection/removal intent only.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
