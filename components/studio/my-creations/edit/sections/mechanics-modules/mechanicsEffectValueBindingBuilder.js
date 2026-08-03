export const MECHANICS_EFFECT_VALUE_BINDING_VERSION =
  "mechanics_effect_value_binding_v1";

export const MECHANICS_EFFECT_VALUE_BINDING_MODES = Object.freeze([
  "FIXED",
  "ARGUMENT",
]);

export const MECHANICS_EFFECT_VALUE_BINDING_ROUNDING = Object.freeze([
  "NONE",
  "ROUND",
  "FLOOR",
  "CEIL",
  "TRUNCATE",
]);

export const MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES = Object.freeze([
  "REJECT",
  "IGNORE",
]);

export const MECHANICS_EFFECT_VALUE_BINDING_EFFECT_TYPES = Object.freeze([
  "METER_DELTA",
  "COUNTER_INCREMENT",
  "COUNTER_SET",
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeIdentifier(value, fallback = "") {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

export function supportsMechanicsEffectValueBinding(effectType) {
  return MECHANICS_EFFECT_VALUE_BINDING_EFFECT_TYPES.includes(
    normalizeString(effectType).toUpperCase()
  );
}

export function normalizeMechanicsEffectValueBindingBuilder(
  value = {},
  effectType = ""
) {
  const source = normalizeObject(value);
  const supported = supportsMechanicsEffectValueBinding(effectType);
  const requestedMode = normalizeString(
    source.mode ||
      source.type ||
      source.sourceMode ||
      source.source_mode ||
      (source.argumentName || source.argument_name ? "ARGUMENT" : "FIXED")
  ).toUpperCase();
  const aliases = {
    COMMAND_ARGUMENT: "ARGUMENT",
    NUMBER_ARGUMENT: "ARGUMENT",
    PARSED_ARGUMENT: "ARGUMENT",
    STATIC: "FIXED",
    CONSTANT: "FIXED",
  };
  const mode = supported && MECHANICS_EFFECT_VALUE_BINDING_MODES.includes(
    aliases[requestedMode] || requestedMode
  )
    ? aliases[requestedMode] || requestedMode
    : "FIXED";
  const requestedRounding = normalizeString(
    source.rounding || source.round || "NONE"
  ).toUpperCase();
  const requestedMissingPolicy = normalizeString(
    source.missingPolicy ||
      source.missing_policy ||
      source.onMissing ||
      source.on_missing ||
      "REJECT"
  ).toUpperCase();
  const rawMin = normalizeNullableNumber(
    source.minValue ?? source.min_value ?? source.min
  );
  const rawMax = normalizeNullableNumber(
    source.maxValue ?? source.max_value ?? source.max
  );
  const minValue = rawMin === null || rawMax === null
    ? rawMin
    : Math.min(rawMin, rawMax);
  const maxValue = rawMin === null || rawMax === null
    ? rawMax
    : Math.max(rawMin, rawMax);

  return {
    version:
      normalizeString(source.version) ||
      MECHANICS_EFFECT_VALUE_BINDING_VERSION,
    mode,
    argumentName:
      mode === "ARGUMENT"
        ? normalizeIdentifier(
            source.argumentName ||
              source.argument_name ||
              source.numberArgumentName ||
              source.number_argument_name,
            ""
          )
        : "",
    multiplier: normalizeNumber(source.multiplier, 1),
    divisor: normalizeNumber(source.divisor, 1) || 1,
    offset: normalizeNumber(source.offset, 0),
    rounding: MECHANICS_EFFECT_VALUE_BINDING_ROUNDING.includes(
      requestedRounding
    )
      ? requestedRounding
      : "NONE",
    minValue,
    maxValue,
    missingPolicy:
      MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES.includes(
        requestedMissingPolicy
      )
        ? requestedMissingPolicy
        : "REJECT",
  };
}

export function createMechanicsEffectValueBindingBuilder() {
  return normalizeMechanicsEffectValueBindingBuilder(
    {
      mode: "ARGUMENT",
      argumentName: "",
      multiplier: 1,
      divisor: 1,
      offset: 0,
      rounding: "NONE",
      minValue: null,
      maxValue: null,
      missingPolicy: "REJECT",
    },
    "COUNTER_INCREMENT"
  );
}
