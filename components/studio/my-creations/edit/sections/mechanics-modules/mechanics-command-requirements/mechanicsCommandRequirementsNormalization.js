import {
  normalizeProgressionTierIdList,
} from "../mechanicsProgressionRequirementAuthoring.js";

import {
  ACTOR_MECHANICS_COMMAND_REQUIREMENT_TYPES,
  COMMAND_PROGRESSION_ENFORCEMENTS,
  COMMAND_REQUIREMENT_OPERATORS,
  COMMAND_REQUIREMENT_TYPES,
  PROGRESSION_COMMAND_REQUIREMENT_TYPES,
  TARGET_COMMAND_REQUIREMENT_TYPES,
} from "./MechanicsCommandRequirements.contract.js";
function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = normalizeString(value).toLowerCase();
  if (["true", "yes", "1", "on"].includes(normalized)) return true;
  if (["false", "no", "0", "off"].includes(normalized)) return false;
  return fallback;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeProgressionRequirementTierIds(value) {
  return normalizeProgressionTierIdList(value);
}

export function slugifyMechanicsRequirementId(value, fallback = "requirement") {
  const slug = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || fallback;
}

export function normalizeMechanicsRequirementReferenceId(
  value,
  fallback = ""
) {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

export function isActorMechanicsCommandRequirementType(value) {
  return ACTOR_MECHANICS_COMMAND_REQUIREMENT_TYPES.includes(
    normalizeString(value).toUpperCase()
  );
}

export function getDefaultActorMechanicsRequirementBindingId(type) {
  const normalized = normalizeString(type).toUpperCase();
  if (normalized === "SKILLS_RANK") return "skills";
  if (normalized.startsWith("STATS_POOLS_")) return "stats";
  return "";
}

export function isTargetCommandRequirementType(value) {
  return TARGET_COMMAND_REQUIREMENT_TYPES.includes(
    normalizeString(value).toUpperCase()
  );
}

export function isProgressionCommandRequirementType(value) {
  return PROGRESSION_COMMAND_REQUIREMENT_TYPES.includes(
    normalizeString(value).toUpperCase()
  );
}

export function getDefaultCommandRequirementOperator(type) {
  if (type === "FLAG") return "EQ";
  if (["COUNTER", "METER"].includes(type)) return "GTE";
  if (type === "STAGE") return "EQ";
  if (type === "PROGRESSION_MINIMUM_LEVEL") return "GTE";
  if (type === "PROGRESSION_MAXIMUM_LEVEL") return "LTE";
  if (["PROGRESSION_REQUIRED_TIER", "PROGRESSION_FORBIDDEN_TIER"].includes(type)) {
    return "EQ";
  }
  if ([
    "STATS_POOLS_STAT_CURRENT",
    "STATS_POOLS_POOL_CURRENT",
    "STATS_POOLS_POOL_MAXIMUM",
    "SKILLS_RANK",
  ].includes(type)) {
    return "GTE";
  }
  if ([
    "STATS_POOLS_CONDITION_ACTIVE",
    "STATS_POOLS_CONDITION_INACTIVE",
    "STATS_POOLS_MODIFIER_ACTIVE",
    "STATS_POOLS_MODIFIER_INACTIVE",
  ].includes(type)) {
    return "EQ";
  }
  return "TRUTHY";
}

export function getDefaultCommandRequirementValue(type) {
  if (type === "FLAG") return true;
  if (["COUNTER", "METER"].includes(type)) return 1;
  if (type === "STAGE") return "";
  if (["PROGRESSION_MINIMUM_LEVEL", "PROGRESSION_MAXIMUM_LEVEL"].includes(type)) {
    return 1;
  }
  if (["PROGRESSION_REQUIRED_TIER", "PROGRESSION_FORBIDDEN_TIER"].includes(type)) {
    return [];
  }
  if ([
    "STATS_POOLS_STAT_CURRENT",
    "STATS_POOLS_POOL_CURRENT",
    "STATS_POOLS_POOL_MAXIMUM",
    "SKILLS_RANK",
  ].includes(type)) {
    return 1;
  }
  if ([
    "STATS_POOLS_CONDITION_ACTIVE",
    "STATS_POOLS_CONDITION_INACTIVE",
    "STATS_POOLS_MODIFIER_ACTIVE",
    "STATS_POOLS_MODIFIER_INACTIVE",
  ].includes(type)) {
    return true;
  }
  return true;
}

export function normalizeProgressionCommandRequirementEnforcement(value) {
  const requested = normalizeString(value).toUpperCase();
  return COMMAND_PROGRESSION_ENFORCEMENTS.includes(requested)
    ? requested
    : "ADVISORY";
}

export function normalizeMechanicsCommandRequirement(requirement, fallbackIndex = 0) {
  const source = asObject(requirement);
  const requestedType = normalizeString(
    source.type || source.requirementType || source.requirement_type
  ).toUpperCase();
  const type = COMMAND_REQUIREMENT_TYPES.includes(requestedType)
    ? requestedType
    : "FLAG";
  const requestedOperator = normalizeString(
    source.operator || source.comparison || source.op
  ).toUpperCase();
  const operator = COMMAND_REQUIREMENT_OPERATORS.includes(requestedOperator)
    ? requestedOperator
    : getDefaultCommandRequirementOperator(type);
  const targetRequirement = isTargetCommandRequirementType(type);
  const progressionRequirement = isProgressionCommandRequirementType(type);
  const actorMechanicsRequirement =
    isActorMechanicsCommandRequirementType(type);
  const rawValue =
    source.value ??
    source.expectedValue ??
    source.expected_value ??
    source.threshold;

  let value =
    rawValue === undefined || rawValue === null || rawValue === ""
      ? getDefaultCommandRequirementValue(type)
      : rawValue;

  if (type === "FLAG" || type === "PROGRESSION_AT_MAXIMUM_LEVEL") {
    value = normalizeBoolean(value, true);
  } else if (
    [
      "COUNTER",
      "METER",
      "PROGRESSION_MINIMUM_LEVEL",
      "PROGRESSION_MAXIMUM_LEVEL",
      "STATS_POOLS_STAT_CURRENT",
      "STATS_POOLS_POOL_CURRENT",
      "STATS_POOLS_POOL_MAXIMUM",
      "SKILLS_RANK",
    ].includes(type)
  ) {
    value = normalizeNumber(value, getDefaultCommandRequirementValue(type));
  } else if (
    ["PROGRESSION_REQUIRED_TIER", "PROGRESSION_FORBIDDEN_TIER"].includes(type)
  ) {
    value = normalizeProgressionRequirementTierIds(value);
  } else if ([
    "STATS_POOLS_CONDITION_ACTIVE",
    "STATS_POOLS_CONDITION_INACTIVE",
    "STATS_POOLS_MODIFIER_ACTIVE",
    "STATS_POOLS_MODIFIER_INACTIVE",
  ].includes(type)) {
    value = normalizeBoolean(value, true);
  } else if (type === "STAGE") {
    value = normalizeString(value);
  }

  return {
    ...source,
    id: slugifyMechanicsRequirementId(
      source.id || source.key,
      `requirement_${fallbackIndex + 1}`
    ),
    type,
    targetId: targetRequirement
      ? ""
      : actorMechanicsRequirement
        ? normalizeMechanicsRequirementReferenceId(
            source.targetId || source.target_id || source.definitionId || source.definition_id
          )
        : slugifyMechanicsRequirementId(
            source.targetId ||
              source.target_id ||
              source.mechanicsId ||
              source.mechanics_id ||
              source.trackerId ||
              source.tracker_id ||
              (progressionRequirement ? "progression" : ""),
            progressionRequirement ? "progression" : ""
          ),
    bindingId: actorMechanicsRequirement
      ? normalizeMechanicsRequirementReferenceId(
          source.bindingId || source.binding_id,
          getDefaultActorMechanicsRequirementBindingId(type)
        )
      : undefined,
    argumentName: targetRequirement
      ? slugifyMechanicsRequirementId(
          source.argumentName ||
            source.argument_name ||
            source.argument ||
            source.targetArgument ||
            source.target_argument,
          "target"
        )
      : "",
    operator,
    value,
    enforcement: progressionRequirement
      ? normalizeProgressionCommandRequirementEnforcement(
          source.enforcement ||
            source.enforcementPolicy ||
            source.enforcement_policy
        )
      : undefined,
    message: normalizeString(
      source.message ||
        source.failureMessage ||
        source.failure_message ||
        source.summary ||
        source.description
    ),
    enabled: normalizeBoolean(source.enabled, true),
  };
}

export function normalizeMechanicsCommandRequirements(value) {
  return asArray(value)
    .map(normalizeMechanicsCommandRequirement)
    .filter((requirement) => requirement.enabled !== false);
}

export function summarizeMechanicsCommandRequirements(value) {
  const requirements = normalizeMechanicsCommandRequirements(value);
  return {
    total: requirements.length,
    progression: requirements.filter((item) =>
      isProgressionCommandRequirementType(item.type)
    ).length,
    hardLocks: requirements.filter((item) => item.enforcement === "HARD_LOCK").length,
    targetRequirements: requirements.filter((item) =>
      isTargetCommandRequirementType(item.type)
    ).length,
  };
}
