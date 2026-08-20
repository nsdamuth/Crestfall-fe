# Actor Mechanics Profile Attachment Graph presentation

Status: LIVE — W50 graph-authoritative application binding + FE presentation contract.

This package reconciles the FE lane with Crestfall's current
Character / Player Character Actor Mechanics Profile relationship model.

It deliberately does **not** replace the existing attachment View or copy the
Chassis application ViewModel.

## Current authoritative persistence model

For Character and Player Character assets, the saved relationship is now:

```text
actor_mechanics_profile_attachment_graph_v0
```

Unsaved editor intent is represented by:

```text
actor_mechanics_profile_attachment_draft_v0
```

The saved relationship is graph-authoritative.

The actor does not own a copied snapshot of the Profile's identity,
description, ownership policy, or enabled domains. Crestfall resolves those
from the linked Actor Mechanics Profile creation.

Mutable mechanics state is also not stored in the attachment relationship.

## Draft presentation states

The presentation binding supports three distinct authorities:

```text
CREATION_GRAPH
UNSAVED_PICKER_SELECTION
UNSAVED_DRAFT
```

and explicit draft states:

```text
NONE
PENDING_LINK
PENDING_REMOVAL
```

This lets the FE show:

- a saved graph relationship;
- a newly picked Profile not saved yet;
- a draft whose linked Profile has not yet been resolved for display;
- a pending removal.

The Chassis application ViewModel remains responsible for deciding which state
wins and for supplying the display-ready attachment.

## Compatibility boundary

Current Crestfall compatibility rules are:

1. the selected creation must contain a saved Actor Mechanics Profile;
2. Profile owner type must match actor type;
3. an unbound template is attachable;
4. a `BOUND_ACTOR` Profile is attachable only to the actor it is already bound
   to;
5. a bound Profile without a usable owner reference is invalid.

This package presents compatibility copy/errors supplied by Chassis.

It does **not** reimplement those checks.

## Picker copy

Current picker copy remains:

```text
Attach Actor Mechanics Profile

Choose an owned Actor Mechanics Profile compatible with <actor>.
Unbound templates and profiles already bound to this actor are accepted.
```

Allowed Creation type:

```text
ACTOR_MECHANICS_PROFILE
```

## Relationship-local notes

Attachment notes remain relationship-local editor state.

The FE can display/edit those notes through the existing callback contract, but
the Chassis ViewModel owns draft persistence.

## Beyond Scale

The existing warning remains presentation semantics:

```text
Beyond Scale profiles only permit ordinary opposed resolution through an
explicit working mode.
```

## Lightweight NPC Registry Entries

The graph relationship described here applies to Character and Player Character
creation assets.

Lightweight NPC Registry Entries use their separate embedded-entry mechanics
contract. This package explicitly does not collapse those two persistence
models.

## Permanent boundary

Crestfall owns:

- creation graph authority
- attachment graph loading
- graph projection
- unsaved draft overlay rules
- draft persistence
- Profile creation resolution
- owner compatibility enforcement
- actor identity enforcement
- eventual save/replace transaction
- mutable mechanics state

Crestfall-fe owns:

- presentation of resolved attachment state
- picker copy
- attachment card formatting
- warning/error presentation
- semantic callbacks

## Existing FE package

This patch is additive. It does not overwrite:

```text
ActorMechanicsProfileAttachmentSection.view.jsx
useActorMechanicsProfileAttachmentSectionViewModel.js
ActorMechanicsProfileAttachmentSection.contract.js
```

The later FE integration can retire its older application ownership after the
new Chassis Binding Shell is wired.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
