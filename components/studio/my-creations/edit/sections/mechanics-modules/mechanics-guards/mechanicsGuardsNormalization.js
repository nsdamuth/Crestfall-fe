import {
  MECHANICS_GUARD_COMPOSER_VISIBILITIES,
  MECHANICS_GUARD_CONDITION_TYPES,
  MECHANICS_GUARD_ENFORCEMENTS,
  MECHANICS_GUARD_MODES,
  MECHANICS_GUARD_OPERATORS,
  MECHANICS_GUARD_PUBLIC_VISIBILITIES,
} from "./MechanicsGuards.contract.js";

export function asMechanicsGuardObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function normalizeMechanicsGuardString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeMechanicsGuardBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = normalizeMechanicsGuardString(value).toLowerCase();
  if (["true", "yes", "1", "on"].includes(normalized)) return true;
  if (["false", "no", "0", "off"].includes(normalized)) return false;
  return fallback;
}

export function normalizeMechanicsGuardLooseValue(value, fallback = "") {
  if (value === true || value === false) return value;
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  if (!text) return fallback;
  if (text.toLowerCase() === "true") return true;
  if (text.toLowerCase() === "false") return false;
  const number = Number(text);
  return Number.isFinite(number) ? number : text;
}

export function slugifyMechanicsGuardId(value, fallback = "guard") {
  const slug = normalizeMechanicsGuardString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || fallback;
}

function normalizeConditionType(value) {
  const requested = normalizeMechanicsGuardString(value).toUpperCase();
  const aliases = {
    COUNT: "COUNTER",
    TRACKER: "METER",
    BOOLEAN: "FLAG",
    BOOL: "FLAG",
    PHASE: "STAGE",
  };
  const normalized = aliases[requested] || requested;
  return MECHANICS_GUARD_CONDITION_TYPES.includes(normalized)
    ? normalized
    : "COUNTER";
}

function normalizeOperator(value) {
  const requested = normalizeMechanicsGuardString(value).toLowerCase();
  const aliases = {
    "<": "lt",
    "<=": "lte",
    ">": "gt",
    ">=": "gte",
    "=": "eq",
    "==": "eq",
    "===": "eq",
    "!=": "neq",
    "!==": "neq",
  };
  const normalized = aliases[requested] || requested;
  return MECHANICS_GUARD_OPERATORS.includes(normalized) ? normalized : "lt";
}

function normalizeEnforcement(value) {
  const requested = normalizeMechanicsGuardString(value).toUpperCase();
  const aliases = {
    HARD: "HARD_LOCK",
    BLOCK: "HARD_LOCK",
    SOFT: "SOFT_LOCK",
    WARN: "SOFT_LOCK",
    GUIDE: "GUIDANCE",
  };
  const normalized = aliases[requested] || requested;
  return MECHANICS_GUARD_ENFORCEMENTS.includes(normalized)
    ? normalized
    : "HARD_LOCK";
}

function normalizeMode(value) {
  const requested = normalizeMechanicsGuardString(value).toUpperCase();
  const aliases = { AND: "ALL", OR: "ANY" };
  const normalized = aliases[requested] || requested;
  return MECHANICS_GUARD_MODES.includes(normalized) ? normalized : "ALL";
}

function normalizeComposerVisibility(value) {
  const requested = normalizeMechanicsGuardString(value).toUpperCase();
  const aliases = {
    SUMMARY: "SUMMARY_ONLY",
    PRIVATE: "HIDDEN",
    NONE: "HIDDEN",
  };
  const normalized = aliases[requested] || requested;
  return MECHANICS_GUARD_COMPOSER_VISIBILITIES.includes(normalized)
    ? normalized
    : "SUMMARY_ONLY";
}

function normalizePublicVisibility(value) {
  const requested = normalizeMechanicsGuardString(value).toUpperCase();
  const aliases = {
    SUMMARY: "SUMMARY_ONLY",
    FULL: "PUBLIC",
    NONE: "HIDDEN",
    PRIVATE: "HIDDEN",
  };
  const normalized = aliases[requested] || requested;
  return MECHANICS_GUARD_PUBLIC_VISIBILITIES.includes(normalized)
    ? normalized
    : "HIDDEN";
}

export function normalizeMechanicsGuardCondition(condition, fallbackIndex = 0) {
  const source = asMechanicsGuardObject(condition);
  const sourceId =
    source.id ??
    source.key ??
    source.targetId ??
    source.target_id ??
    source.mechanicsId ??
    source.mechanics_id ??
    source.trackerId ??
    source.tracker_id;

  return {
    ...source,
    conditionType: normalizeConditionType(
      source.conditionType ?? source.condition_type ?? source.type
    ),
    id:
      normalizeMechanicsGuardString(sourceId) ||
      `condition_${fallbackIndex + 1}`,
    field:
      normalizeMechanicsGuardString(
        source.field ?? source.property ?? source.path
      ) || "value",
    operator: normalizeOperator(
      source.operator ?? source.op ?? source.comparison
    ),
    value: normalizeMechanicsGuardLooseValue(
      source.value ??
        source.expectedValue ??
        source.expected_value ??
        source.threshold,
      0
    ),
  };
}

function normalizeGuardOutcome(sourceValue, { includeGuidance = false } = {}) {
  const source = asMechanicsGuardObject(sourceValue);
  return {
    ...source,
    summary: normalizeMechanicsGuardString(
      source.summary ?? source.message ?? source.reason ?? source.description
    ),
    ...(includeGuidance
      ? {
          composerGuidance: normalizeMechanicsGuardString(
            source.composerGuidance ??
              source.composer_guidance ??
              source.guidance
          ),
        }
      : {}),
  };
}

export function normalizeMechanicsGuard(guard, fallbackIndex = 0) {
  const source = asMechanicsGuardObject(guard);
  const fallbackId = `guard_${fallbackIndex + 1}`;
  const sourceId = source.id ?? source.key ?? source.guardId ?? source.guard_id;
  const conditionsSource =
    source.conditions ?? source.rules ?? source.clauses ?? [];

  return {
    ...source,
    id: normalizeMechanicsGuardString(sourceId) || fallbackId,
    label:
      normalizeMechanicsGuardString(
        source.label ?? source.title ?? source.name
      ) ||
      normalizeMechanicsGuardString(sourceId) ||
      `Guard ${fallbackIndex + 1}`,
    enforcement: normalizeEnforcement(
      source.enforcement ??
        source.policy ??
        source.enforcementPolicy ??
        source.enforcement_policy
    ),
    mode: normalizeMode(
      source.mode ?? source.conditionMode ?? source.condition_mode
    ),
    conditions: (Array.isArray(conditionsSource) ? conditionsSource : []).map(
      normalizeMechanicsGuardCondition
    ),
    onFail: normalizeGuardOutcome(
      source.onFail ?? source.on_fail ?? source.failure ?? source.fail,
      { includeGuidance: true }
    ),
    onPass: normalizeGuardOutcome(
      source.onPass ?? source.on_pass ?? source.success ?? source.pass
    ),
    composerVisibility: normalizeComposerVisibility(
      source.composerVisibility ??
        source.composer_visibility ??
        source.composerAudience ??
        source.composer_audience
    ),
    publicVisibility: normalizePublicVisibility(
      source.publicVisibility ??
        source.public_visibility ??
        source.publicAudience ??
        source.public_audience
    ),
  };
}

export function normalizeMechanicsGuards(value) {
  const source = Array.isArray(value)
    ? value
    : Array.isArray(value?.guards)
      ? value.guards
      : Array.isArray(value?.rules)
        ? value.rules
        : [];
  return source.map((guard, index) => normalizeMechanicsGuard(guard, index));
}

export function summarizeMechanicsGuard(guard, fallbackIndex = 0) {
  const normalized = normalizeMechanicsGuard(guard, fallbackIndex);
  const conditionCount = normalized.conditions.length;
  return [
    normalized.enforcement,
    normalized.mode,
    `${conditionCount} ${conditionCount === 1 ? "condition" : "conditions"}`,
  ].join(" · ");
}
