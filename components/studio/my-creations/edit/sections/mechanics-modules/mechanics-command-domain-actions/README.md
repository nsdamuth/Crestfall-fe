# Mechanics Command Domain Actions — M5C

This package owns the authoring boundary for `command.domainAction`.

It preserves the existing Crestfall domain-adapter contract for:

- Item custody and placement actions;
- Item use, consumption, damage, and repair;
- Participant condition application and removal;
- Ability/Spell known/unlocked actor-state mutation through `mechanics_command_domain_action_v2`;
- Ability/Spell pre-commit use authorization through `mechanics_command_domain_action_v3`;
- Connected-location transitions;
- Active-journey operations;
- Outcome gating through `applyOnOutcomes`;
- Current and legacy field aliases;
- Unknown forward-compatible action metadata.

The package does not execute domain actions. Runtime validation and mutation remain owned by services-api and the relevant authoritative domain services.

## LOOM boundary

- `MechanicsCommandDomainActions.jsx` is the Binding Shell.
- `MechanicsCommandDomainActions.view.jsx` is the portable View.
- `useMechanicsCommandDomainActionsViewModel.js` is the Chassis.
- `mechanicsCommandDomainActionsNormalization.js` owns compatibility and projection.
- `mechanicsCommandDomainActionsOperations.js` owns immutable semantic mutations.

The parent Mechanics editor still owns the complete command and root Mechanics document replacement boundary.

## Ability/Spell knowledge extension

`mechanics_command_domain_action_v1` remains the compatibility contract for the original Item, Location, and participant-condition action set. The additive `mechanics_command_domain_action_v2` contract adds `ABILITY_SPELL_KNOWLEDGE_SET`.

That action requires a `PLAYER_CHARACTER` or `CHARACTER_PRESENT` actor argument plus a `TEXT` Ability/Spell argument. It may set known state (`KEEP`, `KNOWN`, `UNKNOWN`) and unlock state (`KEEP`, `UNLOCKED`, `LOCKED`), with at least one state changing. Runtime authority remains in services-api; the action does not cast/use the definition, spend resources, start cooldowns, consume charges, change mastery, or execute operation references.


## Ability/Spell use-transaction extension

`mechanics_command_domain_action_v3` is an additive extension that introduces `ABILITY_SPELL_USE_REQUEST`. It requires a `PLAYER_CHARACTER` actor argument plus a `TEXT` Ability/Spell argument; an optional `CHARACTER_PRESENT` target argument may be supplied for target-aware authorization.

The action re-runs the authoritative Ability/Spell authorization envelope and can return an `EXECUTION_AUTHORIZED` pre-commit transaction. V0 deliberately does not commit execution, spend resource pools, consume charges, start cooldowns, execute operation references, or produce a domain state patch. The services-api execution transaction service remains authoritative; the creator-authored command only invokes that typed boundary.
