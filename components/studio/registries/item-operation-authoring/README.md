# Item Operation Authoring presentation semantics

Status: semantic authoring contract and realistic fixtures only.

This package brings the current Item Registry operation-authoring language into
the FE lane without copying the legacy editors or importing the frozen Mechanics
editor family.

## Current product semantics represented

Items may define creator-authored requirements and typed effects for these
action families:

```text
Give
Drop
Take
Equip
Unequip
Store
Place
Use
Consume
Damage
Repair
```

Requirement sets reuse the Actor Mechanics command-requirement language:

```text
mechanics_command_requirements_v1
```

Item-specific grouping is definition-only:

```text
item_operation_requirement_set_v0
```

The current typed effect catalog contains nine registered operation shapes:

```text
STATS_POOLS / MUTATE_POOL
STATS_POOLS / APPLY_CONDITION
STATS_POOLS / REMOVE_CONDITION
STATS_POOLS / APPLY_MODIFIER
STATS_POOLS / REMOVE_MODIFIER
PROGRESSION / MUTATE_EXPERIENCE
SKILLS / ADVANCE_RANK
WALLET / MUTATE_BALANCE
ABILITY_SPELL / SET_KNOWLEDGE
```

Effects may target:

```text
SOURCE_ACTOR
AUTHORIZED_TARGET
```

## Permanent boundary

This FE package describes the authoring shape only.

Crestfall remains authoritative for:

- runtime typed-operation registration
- action authorization
- requirement evaluation
- target authorization
- execution
- mutation
- persistence
- provider/runtime routing

No Item Registry authoring definition grants execution authority by itself.

## Why this package does not import the existing Mechanics requirement editor

The FE review has frozen:

```text
components/studio/my-creations/edit/**
```

until the editor design pass closes.

This semantic package therefore carries the requirement objects as the same
versioned shape without coupling the migration to the frozen editor package.

The FE lane can later bind these semantics to its ruled editor/Kit vocabulary.

## Filled fixture coverage

The fixtures include:

- equipment requirements
- stat-current requirements
- skill-rank requirements
- pool restoration
- Wallet credit
- Skill rank advancement
- Ability/Spell knowledge/unlock
- Condition removal
- source-actor and authorized-target effects

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
