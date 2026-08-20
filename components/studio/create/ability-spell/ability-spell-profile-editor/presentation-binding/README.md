# Ability & Spell Profile authoring presentation binding

Status: **W33 WIRED — legacy presentation mounted on the integration branch.**

This package is the next step after the accepted Ability & Spell semantic
migration.

The semantic contract is already present in the FE lane:

```text
ability_spell_profile_contract_v0
```

This binding defines the display-ready editor model that a Chassis application
ViewModel may hand to the eventual FE-owned Ability & Spell Profile editor.

It deliberately does **not** copy the current source editor JSX or application
ViewModel.

## Current source application seam

The current Chassis editor ViewModel already produces:

```text
profile
errors
warnings
metrics
```

plus semantic callbacks.

That is the correct permanent boundary.

The FE package consumes those normalized values directly.

It does not call:

```text
normalizeAbilitySpellProfileEditorValue()
validateAbilitySpellProfileEditorValue()
```

and it does not own `commit()` or any local persistence/application logic.

## Current editor sections carried forward

### Profile

```text
Definition Profile
Ability & Spell Profile
Profile title
Tags
Description
Profile enabled
```

The current explanatory copy is preserved:

```text
Shared definitions for Spells, Abilities, Techniques, Special Attacks, and
Passives. Known state, mastery progress, cooldown remaining, charges, and
resource balances remain actor-owned runtime state.
```

### Validation

The binding supports:

```text
VALID
WARNING
ERROR
```

using Chassis-supplied errors/warnings.

The current valid message remains:

```text
Ability & Spell Profile definitions are valid.
```

### Definitions

The binding carries:

- ID
- title
- type
- aliases
- school
- category
- tags
- mechanical description
- narrative description
- enabled state

and the current metrics:

- total definitions
- enabled definitions
- spells
- abilities
- techniques
- passives

The maximum remains:

```text
128 definitions
```

### Prerequisites

The presentation carries:

- minimum level
- required tiers
- required skills
- required unlock count

Current v0 UI limitation remains explicit:

```text
Unlock references can be authored through the JSON editor in v0.
```

The binding represents that as:

```text
JSON_EDITOR_ONLY_IN_CURRENT_V0_UI
```

### Target Model

The presentation carries:

- mode
- range class
- minimum targets
- maximum targets
- requires line of sight

### Restrictions

The presentation carries:

- required tags
- forbidden tags
- notes

### Costs

The current boundary copy is preserved:

```text
Definition-time references only. Resource mutation is not implemented by this
profile.
```

Cost authoring remains definition data, not runtime mutation.

### Mechanical Operation References

The current boundary copy is preserved:

```text
Legacy v0 references remain declarative. Executable v1 references can be
authored through JSON and run only after the trusted Ability/Spell use boundary.
```

The binding distinguishes executable v1 references for display, but FE does not
execute them.

### Policies

The binding carries:

- Cooldown mode / amount / unit
- Charge mode / maximum / reset
- Mastery mode / maximum

## JSON Editor & AI Guide

The current source offers:

```text
JSON Editor & AI Guide
```

W33 mirrors that working surface into FE under the explicit protected-branch
unlock. The current styling is accepted temporarily and can be normalized later.

This binding now records:

```text
WIRED_LEGACY_PRESENTATION
```

Crestfall continues to own JSON validation/application semantics.

## Main editor visual status

The current integration branch is explicitly unlocked to carry the existing working
presentation while protected functional absorption completes. W33 therefore mounts
the current editor in FE and records:

```text
profileEditor: WIRED_LEGACY_PRESENTATION
```

A later visual pass may normalize styling without reopening semantic or runtime
ownership.

## Permanent boundary

Crestfall owns:

- profile normalization
- validation
- all editor mutation helpers
- application ViewModel state
- JSON validation/application
- creation payload
- save/persistence
- runtime Ability/Spell actor state
- runtime authorization/execution

Crestfall-fe owns:

- editor visual composition
- field/section layout
- validation presentation
- definition-card presentation
- future JSON editor visual treatment
- semantic callbacks back into Chassis

## W33 branch scope

The protected editor-family hold is explicitly unlocked for the current integration
branch. W33 touches only the Ability & Spell create/editor family. It still leaves
these other lanes unchanged:

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
