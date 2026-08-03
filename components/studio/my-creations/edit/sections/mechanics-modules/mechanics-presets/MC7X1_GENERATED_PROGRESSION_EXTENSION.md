# MC7X.1 — Generated Progression Profiles

**Status:** Additive post-MC7 extension

**Primary contract:** `mechanics_progression_profile_v1`

## Purpose

MC7X.1 keeps the ordinary Mechanics authoring system fully capable of hand-built
level, rank, reputation, and mastery systems. Creators may continue using
counters, conditions, outcome routing, and ordered composition steps directly.

The extension adds an optimized progression effect for cases where one authored
step per level would be unnecessarily large:

```text
COUNTER_INCREMENT source value
→ PROGRESSION_RECONCILE
→ generated or explicit threshold table
→ rank counter
→ derived counters
→ advancement-count counter
```

## Progression modes

- `GENERATED_CURVE`
- `GENERATED_CURVE_WITH_OVERRIDES`
- `EXPLICIT_TABLE`

The explicit-table path preserves total manual control. Generated modes keep the
saved module compact regardless of whether the configured range ends at rank 20,
100, or higher.

## Curve methods

- `LINEAR`
- `GEOMETRIC`
- `POWER`
- `HYBRID`

Creators configure:

- starting and ending ranks;
- per-rank-cost or cumulative-threshold interpretation;
- starting requirement;
- linear increase;
- growth multiplier;
- power exponent;
- minimum increase;
- rounding increment and rounding policy;
- optional rank-specific overrides;
- rank-decrease policy;
- maximum-rank source-value behavior.

Generated rows are deterministic and strictly increasing. Unsafe or flattened
curves are rejected by the JSON compliance validator.

## Derived counters

A progression profile may recalculate counters from the resulting rank with:

- `RANK_INTERVAL`
- `LINEAR`
- `EXPLICIT_TABLE`

The sample Character Advancement module derives proficiency from rank with a
four-rank interval and a maximum of +6. The same mechanism may represent talent
points, spell tiers, maximum health, inventory capacity, or other deterministic
rank-derived state.

## Compact Character Advancement preset

Preset id:

```text
module.character_advancement_curve.v1
```

Legacy lookup alias retained:

```text
module.character_advancement_5e.v1
```

The compact preset contains:

- `/award_xp <amount>` with NUMBER-argument value binding;
- `/advancement_on` for enabling existing scopes whose live flag is false;
- `/advancement_off` for explicit disabling;
- one experience-increment step;
- one `PROGRESSION_RECONCILE` step;
- XP, level, proficiency, and advancement-count defaults;
- a deterministic status block.

The default hybrid curve starts at 300 XP, reaches level 5 at 4,200 XP, and
reaches level 20 at 361,400 XP. These values are generated from the profile
settings and are not stored as nineteen authored threshold steps.

## Existing-room state

Defaults initialize missing state and do not overwrite existing room/session
truth. A room that already has `advancement_enabled = false` remains disabled
after a module update. Run `/advancement_on` in that scope, or start a fresh
binding, to enable advancement.

## Merge-size hardening

Preset application now calculates the UTF-8 serialized size of the proposed
module before replacing builder state.

- warning threshold: 72 KiB;
- conservative rejection threshold: 96 KiB.

An oversized merge is rejected atomically with
`MECHANICS_PRESET_SERIALIZED_SIZE_EXCEEDED`. Current builder data remains
unchanged. The compact advancement preset is approximately one quarter of the
verbose nineteen-step predecessor.

## Authority boundary

The included `/award_xp` command is a reference authoring and smoke-test command.
A production game should restrict XP awards through a GM, quest/event completion,
scenario/beat resolution, or another server-authoritative workflow.

No database, PostGraphile, package, or engine-middleware changes are required.
Frontend authoring remains inside the existing Mechanics builder and normal Save
workflow. Runtime mutation remains authoritative in `services-api`.
