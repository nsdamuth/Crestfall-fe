# Actor Mechanics Profile definition-reference binding

Status: additive FE presentation binding only.

This package reconciles the current Actor Mechanics Profile editor with the
newer reusable definition-profile references now supported by Crestfall.

It deliberately does **not** replace or edit:

```text
ActorMechanicsProfileEditor.view.jsx
useActorMechanicsProfileEditorViewModel.js
ActorMechanicsProfileEditor.contract.js
```

## Current FE state

The existing FE editor already has dedicated managed-profile controls for:

```text
STATS       -> Stats & Pools Profile
PROGRESSION -> Progression Profile
```

Those remain:

```text
CURRENT_FE_CONTROL_AVAILABLE
```

## Newer Chassis reference modes

The current Crestfall application ViewModel now also supplies:

```text
SKILLS     -> SKILLS_PROFILE
MAGIC      -> ABILITY_SPELL_PROFILE
ABILITIES  -> ABILITY_SPELL_PROFILE
WALLET     -> WALLET_PROFILE
```

This binding carries those display semantics into FE without copying the source
ViewModel.

The three newer control families are marked:

```text
PENDING_FE_VISUAL_EXTENSION
```

until the FE lane adds them to its ruled Actor Mechanics Profile editor.

## Skills Profile attachment

Current copy is preserved:

```text
Choose one owned Skills Profile. Only reusable proficiency and rank definitions
are saved; actor ranks and unspent points are not copied or initialized.
```

Contract:

```text
skills_profile_contract_v0
```

Creation type:

```text
SKILLS_PROFILE
```

## Ability & Spell Profile attachment

Both `MAGIC` and `ABILITIES` use:

```text
ABILITY_SPELL_PROFILE
ability_spell_profile_contract_v0
```

The display copy differs by domain.

### MAGIC

Emphasizes reusable spell and magic definitions.

### ABILITIES

Emphasizes reusable abilities, techniques, special attacks, passives, and
spells.

Both explicitly preserve the state boundary:

- known state is not copied;
- mastery is not copied;
- cooldowns are not copied;
- charges are not copied;
- resource state is not copied.

## Wallet Profile attachment

Current copy is preserved:

```text
Choose one owned Wallet Profile for reusable gameplay currency definitions.
Live balances, revisions, and transaction history remain owner-scoped and are
not initialized by attachment.
```

Contract:

```text
wallet_profile_contract_v0
```

Creation type:

```text
WALLET_PROFILE
```

## Generic references remain available

Bindings not using a managed profile reference mode retain the current generic
reference editor behavior.

For example:

```text
INVENTORY -> GENERIC
```

may continue to use Creation / Built-in Module / Registry references.

This patch does not force all domains into managed profile types.

## Picker boundary

The current Chassis application ViewModel owns:

- which binding's picker is open;
- candidate loading;
- allowed type enforcement;
- selected Creation IDs;
- Creation -> reference conversion;
- replacement of the managed Creation reference.

This FE binding may display the Chassis-supplied `pickerProps`, but does not
reimplement those behaviors.

## Runtime state isolation

Attaching a reusable definition profile never initializes or copies actor
runtime state.

That boundary is explicitly preserved for:

- Stats/Pools values
- Progression XP/level
- Skill ranks/unspent points
- Ability/Spell known/mastery/cooldown/charges/resources
- Wallet live balances/revisions/transactions

## Existing Actor Mechanics editor contract version

The current FE snapshot remains on its existing portable editor contract
version.

This patch does not bump or overwrite that FE-owned contract. The additive
binding captures the Chassis delta so the FE team can incorporate the new
controls during its visual/editor reconciliation.

## Permanent boundary

Crestfall owns:

- `definitionReferenceMode`
- binding state
- picker open state
- candidate Creation loading
- selected IDs
- Creation reference construction
- reference replacement/mutation
- validation
- persistence
- runtime actor state

Crestfall-fe owns:

- managed profile control presentation
- selected profile card/reference display
- empty states
- future Skills / Ability & Spell / Wallet picker treatment

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
