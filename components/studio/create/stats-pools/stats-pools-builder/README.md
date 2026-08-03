# Stats & Pools Profile Builder

This is the persistence-aware LOOM create surface for `STATS_POOLS_PROFILE`.

```text
StatsPoolsBuilderShell
→ useStatsPoolsBuilderViewModel
→ StatsPoolsBuilderView
→ StatsPoolsEditorView
```

The Shell and ViewModel own creation state, validation, client calls, and redirect behavior. The portable Builder View and nested Stats & Pools Editor View own presentation only.

The feature stores the normalized contract at:

```text
creation.data.stats_pools_profile
```

This builder does not attach the profile to an Actor Mechanics Profile, create actor-owned state, calculate formulas, or mutate runtime values.
