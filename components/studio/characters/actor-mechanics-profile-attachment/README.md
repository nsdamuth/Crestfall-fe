# Actor Mechanics Profile Attachment Section

LOOM-separated Character and Player Character edit surface for attaching one owned Actor Mechanics Profile.

## Structure

```text
ActorMechanicsProfileAttachmentSection.jsx
→ useActorMechanicsProfileAttachmentSectionViewModel.js
→ ActorMechanicsProfileAttachmentSection.view.jsx
```

- The Shell composes the portable View and the existing linked-creation picker.
- The ViewModel owns selection compatibility, unsaved relationship intent, and normalization of the server-supplied graph projection.
- The portable View owns presentation only and has no API, PostGraphile, Supabase, or runtime-mechanics knowledge.

## Graph authority

For persisted `CHARACTER` and `PLAYER_CHARACTER` creations, the relationship is authoritative in `creation_asset_edges`:

```text
source: Character / Player Character
relation_type: USES_ACTOR_MECHANICS_PROFILE
role: ACTOR_MECHANICS_PROFILE
target: ACTOR_MECHANICS_PROFILE
```

The actor creation does not persist a copied profile snapshot. Title, description/summary, preset, owner policy, contract version, and enabled domains are resolved from the current target creation through services-api → PostGraphile and returned to the editor as a transient `actorMechanicsProfileAttachmentGraph` projection.

While the user has an unsaved picker change, the editor stores only a temporary `actorMechanicsProfileAttachmentDraft` containing the target creation id and relationship notes. services-api validates the selected target, writes/replaces the graph edge, strips the draft before creation persistence, and returns a fresh graph projection.

Legacy `actorMechanicsProfileId` / `actorMechanicsProfileLink` JSON is read only as a migration fallback and is never written by the graph-authoritative path.

## Compatibility

- Profile owner type must match the target actor type.
- An `UNBOUND_TEMPLATE` may be attached to a compatible actor.
- A `BOUND_ACTOR` profile may only be attached to its declared actor.
- Only one profile edge may exist per Character or Player Character.
- Relationship notes belong to edge metadata, not the target profile creation.

`NPC_REGISTRY_ENTRY` remains a separate embedded-registry-entry attachment contract because a lightweight registry entry is not itself a Creation row and therefore cannot be a `creation_asset_edges.source_creation_id`.
