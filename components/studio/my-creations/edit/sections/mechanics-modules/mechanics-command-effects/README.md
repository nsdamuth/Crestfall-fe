# Mechanics Command Effects

M5B extracts command effect authoring from the large Mechanics Module parent.

The package owns effect identity/type, Mechanics-state target ID, target binding, numeric value binding, fixed values, effect reason, and list orchestration for attempt and base effects. The same extracted effect card is injected into M4B outcome branches.

It intentionally does not own Command requirements, Domain Actions, Resolution, outcome branch modes, Advanced Composition, whole-document replacement, or runtime execution.

Compatibility rules:

- preserve unknown effect, target-binding, and value-binding metadata;
- read current and legacy target/value binding aliases;
- retain `mechanics_effect_target_binding_v1` and `mechanics_effect_value_binding_v1`;
- retain M3 as the authority for `PROGRESSION_RECONCILE` profile authoring;
- keep attempt, base, and outcome effects in their existing command paths;
- mutate only the supplied effect list and return the complete list to the parent.
