# Actor Mechanics Profile definition-reference binding

Status: **WIRED on the protected synchronization branch.**

W36 closes the protected Actor Mechanics Profile managed-definition-reference
presentation gap after the creator explicitly unlocked the protected editor
lanes for this branch.

## Managed reusable definition profiles

The live FE Actor Mechanics Profile editor now carries the current Chassis
managed reference controls for:

```text
STATS        -> STATS_POOLS_PROFILE
PROGRESSION  -> PROGRESSION_PROFILE
SKILLS       -> SKILLS_PROFILE
MAGIC        -> ABILITY_SPELL_PROFILE
ABILITIES    -> ABILITY_SPELL_PROFILE
WALLET       -> WALLET_PROFILE
```

All six use the existing owned-Creation picker. The application ViewModel owns
which picker is open, allowed Creation types, selected IDs, Creation-reference
construction, replacement semantics, and validation.

The portable View owns only the visible select/replace controls, selected
profile card, empty state, and semantic callback invocation.

For W36 the three formerly deferred controls are accepted with the current
working Chassis presentation:

```text
Skills Profile control           WIRED_LEGACY_PRESENTATION
Ability & Spell Profile control  WIRED_LEGACY_PRESENTATION
Wallet Profile control           WIRED_LEGACY_PRESENTATION
```

Stats & Pools and Progression remain current working controls.

## State isolation

Selecting a reusable definition never initializes mutable actor state.

- Stats & Pools values remain actor-owned.
- Progression XP and level remain actor-owned.
- Skill ranks and unspent points remain actor-owned.
- Ability/Spell known state, mastery, cooldowns, charges, and resources remain
  actor-owned.
- Wallet balances, revisions, and transaction history remain actor-owned.

## Graph authority

Creation-backed managed references are relationship intents. Crestfall persists
the authoritative relationship in the creation graph and may rehydrate a
transient `CREATION` reference for editor/runtime compatibility. The editor does
not make copied title/version/type metadata authoritative.

Non-Creation references such as `BUILTIN_MODULE` and `REGISTRY` remain available
through the generic reference editor and are not forced into managed profile
modes.

## Boundary

Crestfall remains authority for:

- `definitionReferenceMode`;
- picker state and candidate loading;
- selected-Creation conversion;
- graph relationship persistence;
- validation and persistence;
- runtime actor state.

Crestfall-fe owns the visible editor composition and semantic callbacks.

W36 does **not** expose Actor Mechanics Profiles from Creation Studio. That is
kept separate for W37. Saved-edit convergence under `my-creations/edit/**`
remains the later dedicated protected-edit package.
