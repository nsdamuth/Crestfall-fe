# Actor Mechanics Profile Attachment Section

LOOM-separated Character and Player Character edit surface for attaching one
owned Actor Mechanics Profile.

## Structure

```text
ActorMechanicsProfileAttachmentSection.jsx
→ useActorMechanicsProfileAttachmentSectionViewModel.js
→ ActorMechanicsProfileAttachmentSection.view.jsx
```

- The Shell composes the portable View and the existing linked-creation picker.
- The ViewModel reads and writes the actor creation's attachment fields, checks
  profile-owner compatibility, snapshots profile metadata, and orchestrates the picker.
- The portable View owns presentation only and has no API, creation-storage,
  PostGraphile, Supabase, or runtime-mechanics knowledge.

## Storage

```js
{
  actorMechanicsProfileAttachmentContractVersion:
    "actor_mechanics_profile_attachment_v0",
  actorMechanicsProfileId: "<profile creation id>",
  actorMechanicsProfileLink: {
    id: "...",
    creationId: "...",
    title: "...",
    type: "ACTOR_MECHANICS_PROFILE",
    description: "...",
    imageUrl: "...",
    notes: "...",
    profileContractVersion: "actor_mechanics_profile_contract_v0",
    presetId: "FULL_PLAYER_CHARACTER",
    ownerBindingMode: "UNBOUND_TEMPLATE",
    ownerType: "PLAYER_CHARACTER",
    ownerId: "",
    ownerTitle: "",
    enabledDomains: ["STATS", "PROGRESSION"]
  }
}
```

Only one profile may be attached to a Character or Player Character in v0.

## Compatibility

- Profile owner type must match the target actor type.
- An `UNBOUND_TEMPLATE` may be attached to a compatible actor.
- A `BOUND_ACTOR` profile may only be attached to its declared actor.
- This patch saves the relationship only; runtime hydration and activation are separate.
