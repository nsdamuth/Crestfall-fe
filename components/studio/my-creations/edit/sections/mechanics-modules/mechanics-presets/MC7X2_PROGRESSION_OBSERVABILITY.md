# MC7X.2 — Progression Observability

## Scope

MC7X.2 adds a generic, read-only Mechanics state-readout contract and applies it to Character Advancement. It does not change the frozen twenty-preset MC7 catalog.

## Runtime behavior

A command may now author `presentation.stateReadout` with up to twenty-four fields from Mechanics meters, flags, counters, or stages. Readouts resolve from the same authoritative root or binding-owner scope as the command. They never create a mutation effect.

When a command also changes state, command-result rendering overlays the accepted Mechanics state patch before formatting the readout. `/award_xp` therefore reports the final XP, level, proficiency, level-up count, and enabled state from the same application.

Readout-only `QUERY` commands are executable without fake effects. They remain command-only transcript records and do not advance time or continue narrative generation.

## Character Advancement

The full generated-curve preset now includes:

- `/award_xp <amount>` with a final progression readout;
- `/progress` with aliases `/level`, `/xp_status`, and `/advancement_status`;
- `/advancement_on`;
- `/advancement_off`.

The extension library also includes **Character Progress Readout Add-on** (`module.character_advancement_readout.v1`). Its default and only application mode is `MERGE_MODULE`. It contains only the read-only `/progress` command, allowing an existing MC7X.1 advancement asset to gain observability without replacing its authored curve or other commands.

Existing saved assets are snapshots and do not update automatically. Apply the readout add-on with `MERGE_MODULE`, save, and reload.

## Expected live result

After an existing room has 4,300 XP:

```text
/progress

Current Progression:
• Level: 5
• Experience Points: 4300
• Proficiency Bonus: +3
• Level-Ups Recorded: 4
• Advancement Enabled: Yes
```

A fresh `/award_xp 4200` should also show the accepted XP and progression deltas, followed by the same final readout.

## Architecture

- Frontend normalization and JSON validation remain API-free.
- services-api owns authoritative state resolution and response formatting.
- No frontend Supabase or PostGraphile access was added.
- No database, PostGraphile, package, or engine-middleware files change.
- Frontend and services-api must be restarted or redeployed.
