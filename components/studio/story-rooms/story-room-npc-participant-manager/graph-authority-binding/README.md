# Story Room NPC Participant Manager ↔ Registry Graph Authority

Status: **WIRED**.

W15 closes the live NPC Participant Manager graph-authority seam.

## Authoritative participant kind

This manager handles only:

```text
CREATION_REF
```

NPC Registry entries whose linked Character can be resolved through the
authoritative creation graph.

Lightweight Registry-owned:

```text
AD_HOC
```

NPCs remain outside this manager. Their lifecycle remains a separate Registry
runtime concern.

## Live sections

The application ViewModel now exposes:

```text
Loaded
Narrative Targets
Available
Previously Loaded
Unavailable References
```

and is an exact deployment mirror of current `Crestfall`.

## Unavailable linked Character

When Chassis reports:

```text
status = UNAVAILABLE
kind = CREATION_REF
```

the FE renders a preserved degraded reference with:

```text
Linked Character unavailable
Unavailable
authoritative creation graph reason
```

It has:

```text
hasAction = false
```

and therefore no load/reload button is rendered.

The stable graph identity remains Chassis-owned.

## View contract

The FE portable View contract advances:

```text
1.0.0 -> 1.2.0
```

to support:

- `hasAction`;
- `actionIconKey = unavailable`.

The FE View keeps its existing visual language. Chassis styling is not copied.

## Mutation authority

Load and unload actions remain opaque UI action IDs in the portable View.

The application ViewModel maps them to the existing Chassis-owned callbacks:

```text
onLoad({ registryId, entryId })
onUnload(participantId)
```

Actual Story Room API calls, graph resolution, participant mutation, and
registry availability remain outside the View and binding contract.
