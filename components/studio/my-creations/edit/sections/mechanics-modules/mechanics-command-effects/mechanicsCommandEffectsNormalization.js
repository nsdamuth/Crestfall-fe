import {
  createMechanicsProgressionProfileBuilder,
  normalizeMechanicsProgressionProfileBuilder,
} from "../mechanicsProgressionProfileBuilder.js";
import {
  normalizeMechanicsEffectValueBindingBuilder,
  supportsMechanicsEffectValueBinding,
} from "../mechanicsEffectValueBindingBuilder.js";
import {
  MECHANICS_COMMAND_EFFECT_TYPES,
  MECHANICS_EFFECT_TARGET_BINDING_MODES,
} from "./MechanicsCommandEffects.contract.js";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeMechanicsEffectIdentifier(value, fallback = "") {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

export function normalizeMechanicsEffectTargetBinding(value = {}) {
  const source = asObject(value);
  const requestedMode = normalizeString(
    source.mode ||
      source.type ||
      source.targetBindingMode ||
      source.target_binding_mode ||
      "FIXED"
  ).toUpperCase();
  const mode = MECHANICS_EFFECT_TARGET_BINDING_MODES.includes(requestedMode)
    ? requestedMode
    : "FIXED";

  return {
    ...source,
    version:
      normalizeString(source.version) ||
      "mechanics_effect_target_binding_v1",
    mode,
    argumentName:
      mode === "ARGUMENT"
        ? normalizeMechanicsEffectIdentifier(
            source.argumentName ||
              source.argument_name ||
              source.targetArgumentName ||
              source.target_argument_name,
            ""
          )
        : "",
  };
}

export function normalizeMechanicsEffectValueBinding(value = {}, effectType = "") {
  const source = asObject(value);
  return {
    ...source,
    ...normalizeMechanicsEffectValueBindingBuilder(source, effectType),
  };
}

export function normalizeMechanicsCommandEffect(effect = {}, requestedType = "") {
  const source = asObject(effect);
  const requested = normalizeString(requestedType || source.type).toUpperCase();
  const type = MECHANICS_COMMAND_EFFECT_TYPES.includes(requested)
    ? requested
    : "FLAG_SET";

  const targetId = normalizeString(source.targetId || source.target_id);
  const base = {
    ...source,
    id: normalizeMechanicsEffectIdentifier(source.id, "effect_1"),
    type,
    targetId,
    targetBinding: normalizeMechanicsEffectTargetBinding(
      source.targetBinding ||
        source.target_binding || {
          mode: source.targetBindingMode || source.target_binding_mode,
          argumentName:
            source.targetArgumentName || source.target_argument_name,
        }
    ),
    valueBinding: normalizeMechanicsEffectValueBinding(
      source.valueBinding ||
        source.value_binding || {
          mode: source.valueBindingMode || source.value_binding_mode,
          argumentName:
            source.valueArgumentName || source.value_argument_name,
          multiplier: source.valueMultiplier,
          divisor: source.valueDivisor,
          offset: source.valueOffset,
          rounding: source.valueRounding,
          minValue: source.valueMin,
          maxValue: source.valueMax,
          missingPolicy: source.valueMissingPolicy,
        },
      type
    ),
    progressionProfile:
      type === "PROGRESSION_RECONCILE"
        ? normalizeMechanicsProgressionProfileBuilder(
            source.progressionProfile ||
              source.progression_profile ||
              source.profile || {
                ...createMechanicsProgressionProfileBuilder(),
                rankValueId: targetId || "character_level",
              }
          )
        : null,
    reason: normalizeString(
      source.reason || source.summary || source.description
    ),
  };

  if (type === "METER_DELTA") {
    const delta = normalizeNumber(source.delta ?? source.amount, 1);
    return { ...base, delta, amount: delta };
  }

  if (type === "FLAG_SET") {
    return { ...base, value: source.value === false ? false : true };
  }

  if (type === "FLAG_CLEAR") return base;

  if (type === "COUNTER_INCREMENT") {
    return {
      ...base,
      amount: normalizeNumber(source.amount ?? source.delta, 1),
    };
  }

  if (type === "COUNTER_SET") {
    return { ...base, value: normalizeNumber(source.value, 0) };
  }

  if (type === "PROGRESSION_RECONCILE") {
    const progressionProfile = normalizeMechanicsProgressionProfileBuilder({
      ...base.progressionProfile,
      rankValueId:
        base.progressionProfile?.rankValueId ||
        base.targetId ||
        "character_level",
    });

    return {
      ...base,
      targetId: progressionProfile.rankValueId,
      progressionProfile,
      valueBinding: normalizeMechanicsEffectValueBinding(
        { ...base.valueBinding, mode: "FIXED", argumentName: "" },
        type
      ),
    };
  }

  if (type === "STAGE_SET") {
    return { ...base, value: String(source.value ?? "") };
  }

  return base;
}

export function normalizeMechanicsCommandEffects(value = []) {
  return asArray(value).map((effect) =>
    normalizeMechanicsCommandEffect(effect, effect?.type)
  );
}

export function createMechanicsCommandEffect({
  type = "FLAG_SET",
  id = "effect_1",
} = {}) {
  const requestedType = MECHANICS_COMMAND_EFFECT_TYPES.includes(type)
    ? type
    : "FLAG_SET";
  const seed = {
    id,
    type: requestedType,
    targetId: "",
    targetBinding: { mode: "FIXED", argumentName: "" },
    reason: "",
  };

  if (requestedType === "METER_DELTA") {
    return normalizeMechanicsCommandEffect(
      { ...seed, delta: -1, amount: -1 },
      requestedType
    );
  }

  return normalizeMechanicsCommandEffect(
    { ...seed, value: true },
    requestedType
  );
}

export function supportsCommandEffectValueBinding(effectType) {
  return supportsMechanicsEffectValueBinding(effectType);
}

export function getMechanicsEffectTargetArgumentOptions(invocation = {}) {
  const allowedTypes = new Set([
    "SELF",
    "CHARACTER_PRESENT",
    "CHARACTER_KNOWN",
    "CHARACTER_BOUND",
    "PLAYER_CHARACTER",
    "ITEM_HELD",
    "ITEM_VISIBLE",
    "ITEM_KNOWN",
    "LOCATION_CURRENT",
    "LOCATION_KNOWN",
    "LOCATION_CONNECTED",
  ]);

  return asArray(invocation?.arguments)
    .filter((argument) => allowedTypes.has(normalizeString(argument?.type).toUpperCase()))
    .map((argument) => ({
      name: normalizeMechanicsEffectIdentifier(argument?.name, ""),
      label:
        normalizeString(argument?.label) ||
        normalizeString(argument?.name) ||
        "Target",
      type: normalizeString(argument?.type).toUpperCase(),
    }))
    .filter((argument) => argument.name);
}

export function getMechanicsEffectNumericArgumentOptions(invocation = {}) {
  return asArray(invocation?.arguments)
    .filter(
      (argument) => normalizeString(argument?.type).toUpperCase() === "NUMBER"
    )
    .map((argument) => ({
      name: normalizeMechanicsEffectIdentifier(argument?.name, ""),
      label:
        normalizeString(argument?.label) ||
        normalizeString(argument?.name) ||
        "Number",
      type: "NUMBER",
    }))
    .filter((argument) => argument.name);
}

export function countTargetBoundMechanicsEffects(effects = []) {
  return normalizeMechanicsCommandEffects(effects).filter(
    (effect) => effect.targetBinding.mode === "ARGUMENT"
  ).length;
}
