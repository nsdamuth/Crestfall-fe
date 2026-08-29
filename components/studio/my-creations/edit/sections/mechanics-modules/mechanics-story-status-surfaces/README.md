# Story Status Surfaces — CC7C2

Visual authoring for `instanceData.storyStatusSurfaces`.

The runtime contract remains `story_status_surface_v1`. This package authors only the currently implemented `INLINE` host with `TOP` or `BOTTOM` placement. It deliberately keeps readout source definitions separate from the host so future Drawer/Modal/Popover presentation can reuse the same configured sources.

Supported read-only source domains:

- `MECHANICS` — module-owned METER/FLAG/COUNTER/STAGE state;
- `STATS_POOLS` — authoritative actor Stat/Pool state;
- `PROGRESSION` — authoritative actor level/tier/XP progression state;
- `WALLET` — authoritative actor Wallet balances.

This package does not query APIs, mutate runtime state, define Crownfall fields, or duplicate Stats/Progression/Wallet values into Mechanics trackers.
