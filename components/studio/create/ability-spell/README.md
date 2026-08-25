# Ability & Spell Profile Foundation v0

Reusable definition-only authoring for `ABILITY_SPELL_PROFILE` / `ability_spell_profile_contract_v0`.

This package remains definition-only authoring. It supports legacy `ability_spell_operation_reference_v0` references and executable `ability_spell_operation_reference_v1` references, but authoring or loading a profile never performs a mutation by itself. Executable v1 references are consumed only after the trusted runtime Ability/Spell authorization and committed-use boundary. Actor-known state, current mastery, cooldown remaining, charges, provider narrative authority, and global natural-language spell recognition remain outside this profile.

Persistence follows the existing creation path through the client, FE API proxy, services-api creation route, PostGraphile, and the `creations` table.
