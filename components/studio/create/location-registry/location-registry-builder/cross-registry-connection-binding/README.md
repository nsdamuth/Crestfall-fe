# Location Registry Cross-Registry Connection binding

Status: **VISUALLY WIRED; PROTECTED EDIT-ID BRIDGE PENDING**.

W11 closes the unprotected FE presentation portion of cross-Registry Location
connections on top of the W9 Chassis/application foundation.

## Live visual behavior

The `Connection Rule` modal now exposes:

```text
From Registry
To Registry
From Location
To Location
```

Each Registry selector supports:

```text
blank -> This Registry
UUID  -> linked Location Registry
```

The matching Location selector switches between local Location entries and the
Chassis-supplied Location options from the selected external Registry.

## Qualified connection labels

Connection cards now render the application-projected display names:

```text
Test Workshop → Aethelgard City Registry · Brass Gate
```

and mark boundary edges:

```text
Cross-Registry Boundary: yes
```

instead of forcing the creator to infer topology from UUIDs.

## Saved-Registry gate

When the application layer reports that cross-Registry authoring is unavailable,
the Registry selectors are disabled and the modal shows:

```text
Save this Location Registry before authoring cross-Registry connections.
```

Local connections remain authorable.

## Degraded endpoint recovery

If a stored endpoint identity remains present but its current linked Registry or
Location entry cannot be hydrated, the modal keeps the stable identity visible
and explicitly says that the stored reference is preserved.

This presentation is now:

```text
WIRED
```

## Permanent boundary

`Crestfall` remains authoritative for:

- Registry candidate loading
- linked Registry hydration
- endpoint Registry mutation
- endpoint Location mutation
- `registryCreationId + locationEntryId + locationCreationId` resolution
- save enforcement
- connection persistence

The corresponding application files under `Crestfall-fe` are deployment mirrors.

`Crestfall-fe` owns:

- Registry / Location selector composition
- qualified endpoint labels
- save-first notice
- degraded endpoint presentation

## Remaining protected dependency

Saved-registry cross-Registry authoring still requires the current Location
Registry Creation ID to reach the Builder from:

```text
components/studio/my-creations/edit/**
```

That protected lane remains untouched.

Therefore:

```text
cross-Registry visual wiring: WIRED
protected edit currentCreationId bridge: PENDING
```
