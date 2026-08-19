# Location Registry People & Presence ↔ Dual Authority binding

Status: additive FE presentation binding only.

This package captures the current Location Registry **People & Presence**
authoring model without replacing the current FE Location Registry Builder.

It deliberately does **not** edit:

```text
LocationRegistryBuilder.view.jsx
useLocationRegistryBuilderViewModel.js
LocationRegistryBuilder.contract.js
```

## Two valid presence-authoring paths

A Location presence rule may point to either:

```text
1. a full Character Creation
2. a stable NPC Registry entry
```

Those are intentionally different authority paths.

## Direct Character

A directly selected full Character uses:

```text
person.kind = CREATION_REF
person.creationId = <Character UUID>
person.creationType = CHARACTER
```

Current creator copy:

```text
Select a full Character directly. The Location Registry stores the Character
UUID and the authored presence rule.
```

Picker copy:

```text
Character
Search Character creations...
No Character creations were found.
12 per page
```

## NPC Registry entry

A Registry-selected person uses:

```text
person.kind = NPC_REGISTRY_ENTRY
person.registryCreationId
person.registryEntryId
```

Current creator copy:

```text
Select a stable NPC Registry entry. Lightweight / ad-hoc NPCs stay
registry-owned and do not need to become Character creations.
```

Picker copy:

```text
NPC Registry
Search NPC Registry entries...
No NPC Registry entries were found.
12 per page
```

## Important complement to the participant-manager rule

The Story Room authoritative Character participant manager excludes:

```text
AD_HOC
```

because a lightweight NPC must not masquerade as a full Character participant.

**Location Registry presence is intentionally different.**

Here, an `AD_HOC` NPC Registry entry is valid because the presence rule is
linking the **stable NPC Registry identity**, not claiming that it is a Character
Creation.

So this package explicitly preserves:

```text
lightweightAdHocNpcRegistryEntriesSelectable = true
```

This is not a contradiction; the two surfaces answer different questions.

## NPC Registry entry kinds

The picker may contain:

```text
CREATION_REF
AD_HOC
```

### CREATION_REF entry

Displayed as:

```text
<NPC Registry> · Linked Character
```

and may carry the linked Character Creation ID/type.

### AD_HOC entry

Displayed as:

```text
<NPC Registry> · Lightweight NPC
```

and remains Registry-owned.

It does not need to be promoted to a Character Creation.

## Player Character exclusion

The current Chassis candidate normalizer excludes NPC Registry entries whose
linked `creationType` is:

```text
PLAYER_CHARACTER
```

That filtering remains Chassis authority.

The FE binding only consumes the already-authorized candidate list.

## Selected Person card

The current source shows a `Selected Person` card.

For direct Character selection:

```text
Character
```

For Registry entry selection:

```text
<NPC Registry> · Lightweight NPC
```

or:

```text
<NPC Registry> · Linked Character Entry
```

Status, visibility, and content rating remain display metadata supplied by
Chassis.

## Degraded persisted references

Persisted product data must remain visible even when a reference can no longer
resolve.

### Direct Character unavailable

```text
Linked Character unavailable
UNAVAILABLE
```

The Character UUID remains preserved.

### NPC Registry entry unavailable

```text
NPC Registry entry unavailable
UNAVAILABLE
```

The Registry Creation ID + Registry Entry ID remain preserved.

### Legacy Registry reference

```text
LEGACY_NPC_REGISTRY_ENTRY
LEGACY_UNRESOLVED
Legacy NPC Registry reference unavailable
```

The old identity is preserved so the creator can repair it deliberately instead
of losing data.

## Duplicate-person guard

The Chassis uses authoritative person identity to prevent the same person from
being bound twice to the same Location.

The FE does not recreate that identity algorithm.

Instead, Chassis supplies:

```text
disabledCharacterIds
disabledNpcEntryIds
```

and the FE presents them as disabled picker options.

## Candidate and hydration boundary

Crestfall owns:

- Character candidate loading
- NPC Registry loading
- NPC Registry entry flattening
- Player Character exclusion
- media hydration
- persisted presence hydration
- legacy reference interpretation
- duplicate identity calculation
- applying a selected Character
- applying a selected NPC Registry entry
- save/delete
- persistence

Crestfall-fe owns:

- dual-picker visual composition
- Selected Person card
- resolved/degraded reference presentation
- disabled-option treatment
- semantic selection callbacks

## Current FE visual status

The portable Location Registry Builder currently has no ruled dual-picker
surface for these semantics.

This package marks:

```text
dualCharacterAndNpcRegistryPicker:
  PENDING_FE_VISUAL_EXTENSION

selectedPersonCard:
  PENDING_FE_VISUAL_EXTENSION
```

Degraded recovery treatment becomes pending only when an unavailable/legacy
reference is actually present.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
