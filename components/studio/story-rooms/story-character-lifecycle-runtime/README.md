# Story Character Lifecycle runtime presentation

Status: pure FE runtime-presentation contract and realistic fixtures only.

This package is the play-time counterpart to the already accepted Story
Character Lifecycle authoring package.

It does **not** evaluate release conditions or mutate participants.

## Current runtime contract

The authored lifecycle contract remains:

```text
story_character_lifecycle_v0
```

The authoritative release reconciliation contract is:

```text
story_character_lifecycle_release_v0
```

Crestfall/backend owns both lifecycle normalization and release evaluation.

## Runtime lifecycle kinds

The runtime supports:

```text
STORY_PINNED
OPENING_TEMPORARY
TEMPORARY
```

The creator-facing authoring package currently exposes the first two directly.

`TEMPORARY` remains a general runtime capability for Story/runtime systems.

## Release policies

The runtime supports:

```text
NEVER
INITIAL_PHASE_EXIT
STORY_COMPLETED
EXPLICIT_SIGNAL
```

Default policy semantics remain:

```text
STORY_PINNED       -> NEVER
OPENING_TEMPORARY  -> INITIAL_PHASE_EXIT
TEMPORARY          -> EXPLICIT_SIGNAL
```

## Participant metadata projection

The FE receives display-ready lifecycle metadata from Chassis, including:

```text
storyCharacterLifecycleContractVersion
lifecycleKind
lifecycleStatus
loadPolicy
requiredAtStoryBoot
releasePolicy
releasePhaseDefinitionId
releaseSignalKey
lifecycleReleaseVersion
lifecycleReleaseReason
lifecycleReleasedAtTurn
lifecycleReleaseEvidence
```

This package formats that metadata for presentation.

## Opening-only characters

An opening-only Story Character presents as:

```text
Opening Only
Releases after the opening phase
```

while the opening phase remains active.

When the authoritative Chassis evaluation returns:

```text
shouldRelease: true
reason: INITIAL_PHASE_EXIT_APPLIED
```

the FE may present:

```text
Release ready
Opening phase has exited; this character is ready to release.
```

That is a transient display state only.

The Chassis still performs the actual release before normal runtime cast
construction.

## Released state

After authoritative reconciliation, the participant is expected to be:

```text
isActive: false
isDefault: false
lifecycleStatus: RELEASED
```

and may carry:

```text
lifecycleReleaseVersion
lifecycleReleaseReason
lifecycleReleasedAtTurn
lifecycleReleaseEvidence
```

The FE presents that as:

```text
Released
```

without trying to reactivate or rewrite it.

## Persistent cast

Persistent Story Characters present as:

```text
Persistent Story Cast
Remains active until another Story/runtime system changes presence
```

Their lifecycle release policy is:

```text
NEVER
```

They do not release merely because the Story's opening or whole Story has
completed.

## Other runtime release policies

This projection also supports the backend runtime's general policies:

### Story completed

```text
STORY_COMPLETED
```

Presentation:

```text
Releases when the Story completes
```

### Explicit signal

```text
EXPLICIT_SIGNAL
```

Presentation:

```text
Releases on an explicit Story signal
```

The FE never inspects Story transitions or signal collections to determine
whether those conditions are satisfied.

It consumes a Chassis-supplied release evaluation.

## Lightweight NPC Registry lifecycle is separate

Lightweight NPC Registry entries use:

```text
registry_npc_participant_lifecycle_v2
```

and are intentionally excluded from this projection.

A participant must carry the typed Story Character lifecycle contract to appear
in this package.

That keeps Story-authored Character lifecycle separate from Registry-managed NPC
presence.

## Permanent boundary

Crestfall owns:

- Story Character lifecycle normalization
- participant lifecycle metadata creation
- initial Story phase identity
- phase transition state
- Story completion state
- explicit release signals
- release evaluation
- release reconciliation
- participant mutation
- pre-turn participant refresh
- cast construction after reconciliation

Crestfall-fe owns:

- lifecycle labels
- release-policy labels
- active / release-ready / released display state
- release reason/evidence presentation

## Existing Story Room cast package

This patch does not modify:

```text
story-room-cast-panel/**
components/studio/chat/**
```

A later additive binding can merge these lifecycle fields into the existing
portable cast cards after the FE lane decides how much lifecycle detail should
be visible by default.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
