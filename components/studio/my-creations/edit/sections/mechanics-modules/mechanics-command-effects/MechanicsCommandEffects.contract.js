export const MECHANICS_COMMAND_EFFECTS_CONTRACT = Object.freeze({
  id: "crestfall.loom.mechanics-command-effects.v1",
  effectContractVersion: "mechanics_effect_authoring_v1",
  targetBindingVersion: "mechanics_effect_target_binding_v1",
});

export const MECHANICS_COMMAND_EFFECT_TYPES = Object.freeze([
  "METER_DELTA",
  "FLAG_SET",
  "FLAG_CLEAR",
  "COUNTER_INCREMENT",
  "COUNTER_SET",
  "STAGE_SET",
  "PROGRESSION_RECONCILE",
]);

export const MECHANICS_EFFECT_TARGET_BINDING_MODES = Object.freeze([
  "FIXED",
  "ARGUMENT",
]);

export const MECHANICS_COMMAND_EFFECT_LIST_VARIANTS = Object.freeze({
  ATTEMPT: Object.freeze({
    key: "ATTEMPT",
    title: "Attempt / Cost Effects",
    description:
      "These effects apply after requirements and HARD_LOCK checks pass, regardless of success, failure, critical success, or fumble. Pair resource costs with a matching requirement so the full cost can be paid before the roll.",
    addLabel: "Add Attempt Effect",
    emptyMessage:
      "No attempt effects. The command will proceed directly from requirements to resolution.",
    defaultType: "METER_DELTA",
    idPrefix: "attempt_effect",
  }),
  BASE: Object.freeze({
    key: "BASE",
    title: "Base Success Effects",
    description: "",
    addLabel: "Add Effect",
    emptyMessage:
      "No Base Success Effects yet. SUCCESS and CRITICAL_SUCCESS branches using INHERIT will resolve without changing runtime state.",
    defaultType: "FLAG_SET",
    idPrefix: "effect",
  }),
});
