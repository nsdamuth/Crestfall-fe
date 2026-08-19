# Creation Studio ↔ Mechanics Profile Catalog binding

Status: additive FE presentation/information-architecture binding only.

This package captures the current Creation Studio catalog expansion for the
three reusable profile types that were added after Progression:

```text
Skills Profile
Ability & Spell Profile
Wallet Profile
```

It deliberately does **not** edit:

```text
CreationStudio.contract.mjs
CreationStudio.view.jsx
useCreationStudioViewModel.js
data/creationAssets.js
```

## Why the live FE catalog is not edited yet

The FE snapshot does not own the three route-entry pages:

```text
/studio/create/skills-profile
/studio/create/ability-spell-profile
/studio/create/wallet-profile
```

Routing belongs to the Chassis.

Directly adding those hrefs to the Skin's live `data/creationAssets.js` before
the integration shell exposes the Chassis routes could create dead links.

This binding therefore accepts route targets from the Chassis:

```text
routeTargets.skillsProfile
routeTargets.abilitySpellProfile
routeTargets.walletProfile
```

Each route supplies:

```text
available
href
unavailableReason
```

The FE binding never invents the href.

## Guided Build change

The current FE Rules & Mechanics path has five steps:

```text
20 Stats & Pools Profile
21 Progression Profile
22 Mechanics Module
23 Actor Mechanics Profile
24 Rules Codex
```

The current source dependency order is:

```text
20 Stats & Pools Profile
21 Progression Profile
22 Skills Profile
23 Ability & Spell Profile
24 Wallet Profile
25 Mechanics Module
26 Actor Mechanics Profile
27 Rules Codex
```

`Character Template` then becomes step:

```text
28
```

The total Guided Build grows from:

```text
25 -> 28
```

## New guided steps

### 22 · Skills Profile

```text
Define Skills & Proficiencies
```

Why:

```text
Skills Profiles define reusable skills, proficiency ranks, point costs, and
Progression prerequisites.
```

### 23 · Ability & Spell Profile

```text
Define Abilities & Spells
```

Why:

```text
Ability & Spell Profiles define reusable spells, abilities, techniques, special
attacks, passives, prerequisites, costs, targeting, and use policies.
```

### 24 · Wallet Profile

```text
Define Gameplay Currency
```

Why:

```text
Wallet Profiles define reusable currencies, starting balances, and authored
minimum and maximum balance bounds while actor balances remain isolated Story
state.
```

## Full Studio change

The Rules & Mechanics section expands from:

```text
Stats & Pools Profile
Progression Profile
Mechanics Module
Actor Mechanics Profile
Rules Codex
```

to:

```text
Stats & Pools Profile
Progression Profile
Skills Profile
Ability & Spell Profile
Wallet Profile
Mechanics Module
Actor Mechanics Profile
Rules Codex
```

Its description becomes:

```text
Create formal stats, progression, skills, abilities, spells, gameplay wallets,
meters, commands, effects, guards, and verified interpretation guidance.
```

## Asset cards

The binding also carries the current source card copy for all three profile
types.

The cards are enabled only when the Chassis says their route is available.

If a route is not available:

```text
disabled: true
href: ""
```

This prevents the Skin from creating a navigation target it does not own.

## Accepted profile contracts

The catalog binding references the already accepted semantic versions:

```text
skills_profile_contract_v0
ability_spell_profile_contract_v0
wallet_profile_contract_v0
```

This keeps the Creation Studio IA aligned with the actual reusable profile
contracts.

## Permanent boundary

Crestfall owns:

- creator route definitions
- route availability
- route mounting through the integration shell
- owned-Creation count loading
- builder startup
- save/persistence

Crestfall-fe owns:

- Creation Studio information architecture
- guided dependency order
- Full Studio grouping/copy
- asset-card visual composition
- disabled/unavailable route presentation

The existing guided-progress implementation remains unchanged.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
