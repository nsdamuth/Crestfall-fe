# Actor Mechanics Profile Builder

This feature is the persistence-aware LOOM shell for creating an
`ACTOR_MECHANICS_PROFILE` creation.

```text
ActorMechanicsProfileBuilderShell
├── useActorMechanicsProfileBuilderViewModel
├── ActorMechanicsProfileBuilderView
├── ActorMechanicsProfileEditorView
└── RegistryLinkedCreationPickerModal
```

The parent ViewModel owns creation identity, save state, client calls, and
post-create navigation. The child editor ViewModel owns normalization, editor
behavior, and managed Stats & Pools / Progression picker intent. The portable Views own presentation
only. The Shell renders the existing creation picker outside the Views.

The builder stores the normalized contract at:

```text
creation.data.actor_mechanics_profile
```

Managed definition bindings save only reusable creation references:

- `STATS` → one owned `STATS_POOLS_PROFILE`;
- `PROGRESSION` → one owned `PROGRESSION_PROFILE`.

services-api resolves each referenced creation, verifies ownership, type, and
contract validity, and canonicalizes the reference before persistence.

This feature does not attach the Actor Mechanics Profile to an actor, create
actor-owned Stats & Pools or Progression state, evaluate actor experience, award
XP, execute level or tier guards, or activate runtime mechanics.
