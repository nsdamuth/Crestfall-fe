# Stats and Pools Editor — LOOM Feature

## Boundary

```text
StatsPoolsEditor.jsx                    Binding Shell
→ useStatsPoolsEditorViewModel.js       ViewModel / Chassis
→ StatsPoolsEditor.view.jsx             Portable View / Skin
```

The public controlled interface is:

```jsx
<StatsPoolsEditor
  value={statsPoolsProfile}
  onChange={setStatsPoolsProfile}
  disabled={false}
/>
```

## View responsibilities

The portable View owns:

- presentation and responsive layout
- accessible controls
- Stat, Pool, Modifier, and Condition cards
- declarative formula presentation
- validation, empty, disabled, and warning states
- semantic callback invocation

The View does not:

- call APIs, Supabase, PostGraphile, or services
- persist a creation
- calculate or mutate actor state
- execute formulas or Modifiers
- know Actor Mechanics Profile attachment rules
- inject content into a provider prompt

## ViewModel responsibilities

The ViewModel owns:

- controlled profile normalization
- frontend contract validation
- local panel and expansion state
- immutable collection updates
- stable identifier generation
- declarative formula editing
- derived metrics and issue grouping

## Current scope

This v0 editor supports reusable definitions for:

- bounded, unbounded, and Beyond Scale Stats
- fixed and derived Pools
- HP, Stamina, Mana, and custom resources
- simple declarative operation formulas with constant and Stat/Pool operands
- Modifier definitions
- Condition definitions
- Sparse and Full profile modes
- Standard and Beyond Scale capability policies

## Deliberate exclusions

This feature is persistence-free. It does not create a `STATS_POOLS_PROFILE` creation type, attach to an Actor Mechanics Profile, create actor-owned values, execute formulas, or mutate runtime state.

## Development preview

```text
/dev/ui-preview/stats-pools-editor
```

The route returns `notFound()` in production.

## JSON authoring companion

The editor exposes a LOOM JSON modal through:

```text
StatsPoolsEditorView
→ StatsPoolsJsonEditorModal
→ useStatsPoolsJsonEditorViewModel
→ statsPoolsJsonEditor.validation
```

Validate & Apply replaces only the controlled editor value. The normal
create/edit page Save action remains authoritative for persistence. Actor-owned
values and active runtime effects are rejected.

Development preview:

```text
/dev/ui-preview/stats-pools-json-editor
```
