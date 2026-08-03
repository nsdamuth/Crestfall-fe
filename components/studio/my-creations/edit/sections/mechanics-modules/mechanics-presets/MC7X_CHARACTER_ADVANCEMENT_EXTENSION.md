# MC7X — Character Advancement Extension

**Status:** Additive post-MC7 extension  
**Core MC7 freeze:** Unchanged  
**Extension preset:** `module.character_advancement_5e.v1`  
**Value-binding contract:** `mechanics_effect_value_binding_v1`

## Purpose

MC7X adds the missing general-purpose capability needed for commands such as:

```text
/award_xp 6500
```

A parsed `NUMBER` command argument can now supply the numeric value used by a supported Mechanics effect. The extension uses that capability to provide a complete starter module for experience points, levels 1–20, and proficiency bonuses.

## Numeric effect-value binding

Supported effects:

```text
METER_DELTA
COUNTER_INCREMENT
COUNTER_SET
```

Supported modes:

```text
FIXED
ARGUMENT
```

Argument-bound values support:

```text
(raw × multiplier) ÷ divisor + offset
→ optional rounding
→ optional minimum/maximum clamp
```

Rounding policies:

```text
NONE
ROUND
FLOOR
CEIL
TRUNCATE
```

Missing evidence policies:

```text
REJECT
IGNORE
```

Bindings are resolved and validated before the authoritative roll or any Mechanics mutation.

## Character Advancement starter

The Preset Library gains one additive progression preset:

```text
Character Advancement (Levels 1–20)
```

The core frozen MC7 catalog remains at twenty presets. The live extension library contains twenty-one presets.

The module defines:

```text
experience_points      counter, initial 0
character_level        counter, initial 1
proficiency_bonus      counter, initial 2
level_ups              counter, initial 0
advancement_enabled    flag, initial true
```

It includes:

```text
/award_xp <NUMBER amount>
/grant_xp <NUMBER amount>
/add_xp <NUMBER amount>
```

The award step applies the parsed amount to `experience_points`. Nineteen ordered outcome steps reconcile every crossed threshold during the same command, including large awards that advance through multiple levels.

## Frozen level table

| Level | XP | Proficiency |
|---:|---:|---:|
| 1 | 0 | +2 |
| 2 | 300 | +2 |
| 3 | 900 | +2 |
| 4 | 2,700 | +2 |
| 5 | 6,500 | +3 |
| 6 | 14,000 | +3 |
| 7 | 23,000 | +3 |
| 8 | 34,000 | +3 |
| 9 | 48,000 | +4 |
| 10 | 64,000 | +4 |
| 11 | 85,000 | +4 |
| 12 | 100,000 | +4 |
| 13 | 120,000 | +5 |
| 14 | 140,000 | +5 |
| 15 | 165,000 | +5 |
| 16 | 195,000 | +5 |
| 17 | 225,000 | +6 |
| 18 | 265,000 | +6 |
| 19 | 305,000 | +6 |
| 20 | 355,000 | +6 |

## Multiplayer scope

For independent per-player advancement, bind one module instance to each Player Character using:

```text
mechanicsScopeMode: BINDING_OWNER
```

The preset stores progression in the module binding's Mechanics state. It does not store one shared room-wide player level table.

## Authorization boundary

The included `/award_xp` command is a reference authoring and smoke-test mechanism. A production game should not allow unrestricted players to grant themselves experience.

Production XP awards should originate from an authorized path such as:

```text
GM-authorized command
quest or event completion
scenario or beat completion
combat/reward service
server-authoritative engine operation
```

The Mechanics module remains responsible for deterministic XP accumulation and level/proficiency reconciliation after an authorized award enters the command pipeline.

## UI integration

Both existing LOOM authoring surfaces now expose numeric value binding:

```text
Runtime Fields command/effect editor
Advanced Composition builder
```

The JSON Editor validates and canonicalizes the same contract. Unknown or invalid numeric argument references reject atomically.

## Runtime validation

The extension diagnostics prove:

```text
6500 XP from level 1  → level 5, proficiency +3, four level-ups
355000 XP from level 1 → level 20, proficiency +6, nineteen level-ups
6400 XP at level 4 + 100 XP → level 5, proficiency +3, one new level-up
```

The core MC7 freeze manifest and twenty-preset core catalog remain unchanged.
