export const MECHANICS_COMMAND_EFFECTS_FIXTURES = Object.freeze([
  Object.freeze({
    id: "m5b-round-trip",
    label: "M5B Round Trip",
    invocation: {
      arguments: [
        { name: "target", label: "Target Character", type: "CHARACTER_PRESENT" },
        { name: "amount", label: "Effect Amount", type: "NUMBER" },
      ],
    },
    effects: [
      {
        id: "apply_target_meter",
        type: "METER_DELTA",
        targetId: "tracker_1",
        targetBinding: {
          version: "mechanics_effect_target_binding_v1",
          mode: "ARGUMENT",
          argumentName: "target",
        },
        valueBinding: {
          version: "mechanics_effect_value_binding_v1",
          mode: "ARGUMENT",
          argumentName: "amount",
          multiplier: 1,
          divisor: 1,
          offset: 0,
          rounding: "NONE",
          minValue: -25,
          maxValue: 25,
          missingPolicy: "REJECT",
        },
        delta: 1,
        amount: 1,
        reason: "Apply the supplied amount to the resolved target's tracker.",
      },
      {
        id: "set_effect_test_flag",
        type: "FLAG_SET",
        targetId: "m5b_effect_applied",
        targetBinding: { mode: "FIXED", argumentName: "" },
        value: true,
        reason: "Records that the base success effects were applied.",
      },
    ],
  }),
  Object.freeze({
    id: "attempt-cost",
    label: "Attempt Cost",
    invocation: { arguments: [{ name: "amount", label: "Amount", type: "NUMBER" }] },
    effects: [
      {
        id: "spend_mana",
        type: "COUNTER_INCREMENT",
        targetId: "mana_spent",
        amount: 1,
        valueBinding: {
          mode: "ARGUMENT",
          argumentName: "amount",
          multiplier: 1,
          divisor: 1,
          offset: 0,
          missingPolicy: "REJECT",
        },
      },
    ],
  }),
  Object.freeze({
    id: "progression",
    label: "Progression Reconcile",
    invocation: { arguments: [] },
    effects: [
      {
        id: "reconcile_level",
        type: "PROGRESSION_RECONCILE",
        targetId: "character_level",
        progressionProfile: {
          version: "mechanics_progression_profile_v1",
          id: "default_progression",
          label: "Default Progression",
          rankValueId: "character_level",
        },
      },
    ],
  }),
  Object.freeze({
    id: "legacy-aliases",
    label: "Legacy Aliases",
    invocation: { arguments: [{ name: "target", label: "Target", type: "CHARACTER_PRESENT" }] },
    effects: [
      {
        id: "legacy_effect",
        type: "METER_DELTA",
        target_id: "affection",
        target_binding_mode: "ARGUMENT",
        target_argument_name: "target",
        value_binding_mode: "FIXED",
        amount: 3,
        futureEffectMetadata: { retained: true },
      },
    ],
  }),
  Object.freeze({
    id: "malformed",
    label: "Malformed but Recoverable",
    invocation: { arguments: [] },
    effects: [
      {
        id: "",
        type: "UNKNOWN",
        targetBinding: { mode: "INVALID" },
        valueBinding: { divisor: 0, rounding: "INVALID" },
      },
    ],
  }),
]);
