export const MECHANICS_GUARDS_LOOM_CONTRACT = Object.freeze({
  id: "crestfall.loom.mechanics-guards.v1",
  storagePath: "instanceData.guards",
  enforcements: Object.freeze(["HARD_LOCK", "SOFT_LOCK", "GUIDANCE"]),
  modes: Object.freeze(["ALL", "ANY"]),
  conditionTypes: Object.freeze(["COUNTER", "METER", "FLAG", "STAGE"]),
  operators: Object.freeze(["lt", "lte", "gt", "gte", "eq", "neq"]),
  composerVisibilities: Object.freeze(["SUMMARY_ONLY", "FULL", "HIDDEN"]),
  publicVisibilities: Object.freeze(["HIDDEN", "SUMMARY_ONLY", "PUBLIC"]),
  guardFields: Object.freeze([
    "id",
    "label",
    "enforcement",
    "mode",
    "conditions",
    "onFail",
    "onPass",
    "composerVisibility",
    "publicVisibility",
  ]),
  conditionFields: Object.freeze([
    "conditionType",
    "id",
    "field",
    "operator",
    "value",
  ]),
});

export const MECHANICS_GUARD_ENFORCEMENTS =
  MECHANICS_GUARDS_LOOM_CONTRACT.enforcements;
export const MECHANICS_GUARD_MODES = MECHANICS_GUARDS_LOOM_CONTRACT.modes;
export const MECHANICS_GUARD_CONDITION_TYPES =
  MECHANICS_GUARDS_LOOM_CONTRACT.conditionTypes;
export const MECHANICS_GUARD_OPERATORS =
  MECHANICS_GUARDS_LOOM_CONTRACT.operators;
export const MECHANICS_GUARD_COMPOSER_VISIBILITIES =
  MECHANICS_GUARDS_LOOM_CONTRACT.composerVisibilities;
export const MECHANICS_GUARD_PUBLIC_VISIBILITIES =
  MECHANICS_GUARDS_LOOM_CONTRACT.publicVisibilities;
