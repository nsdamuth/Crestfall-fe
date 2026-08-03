# MC7E — Reference Runtime Implementations

**Contract:** `mechanics_reference_runtime_implementation_v1`

MC7E turns the five complete MC7C Mechanics Module starters into executable,
versioned reference runtime scenarios. Each scenario is built from the existing
module preset rather than from a duplicated JSON blob.

## Implementations

| Runtime implementation | Module preset | Representative command |
| --- | --- | --- |
| `runtime.resource_loop.v1` | `module.resource_loop.v1` | `/focus` |
| `runtime.social_probe.v1` | `module.social_probe.v1` | `/probe kessa` |
| `runtime.item_handoff.v1` | `module.item_handoff.v1` | `/give compass kessa` |
| `runtime.travel_navigation.v1` | `module.travel_navigation.v1` | `/go silver market` |
| `runtime.quest_progress.v1` | `module.quest_progress.v1` | `/quest_step` |

## Runtime path exercised

The diagnostic executes each reference through the production contracts used by
Crestfall:

1. Build the complete module preset.
2. Attach it as an explicit `core.trackers.v1` binding.
3. Resolve the binding through engine-middleware.
4. Execute the Trackers context operation.
5. Bind target-scoped Mechanics effects.
6. Resolve MC5 v6 outcome data with deterministic test rolls.
7. Select the outcome effect branch.
8. Build the MC6 ordered composition plan.
9. Apply Mechanics effects through the production applicator.
10. Validate domain composition lanes and ordering.
11. Verify same-turn replay protection.

The Item and Location adapters remain owned by the existing MC4/MC6 domain
services. MC7E verifies that the reference presets produce the correct isolated
`ITEM_RUNTIME` and `LOCATION_RUNTIME` composition lanes; it does not create a
second domain implementation.

## Preset catalog metadata

Complete module starter entries now retain:

- `runtimeStatus`
- `runtimePhase`
- `runtimeImplementationId`
- `runtimeImplementationVersion`

The catalog manifest advertises the runtime implementation contract and count.

## Safety boundaries

- No database or PostGraphile changes.
- No new API route.
- No new runtime mutation path.
- No frontend modal behavior change.
- Reference scenarios are pure cloned fixtures.
- Source preset definitions remain immutable.
- MC5 remains frozen at `mechanics_command_resolution_v6`.
- MC6 remains frozen at `mechanics_command_composition_v1`.
