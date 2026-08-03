import {
  MECHANICS_COMMAND_RESOLUTION_VERSION,
  normalizeMechanicsCommandResolutionBuilder,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES,
  MECHANICS_EFFECT_VALUE_BINDING_MODES,
  MECHANICS_EFFECT_VALUE_BINDING_ROUNDING,
  normalizeMechanicsEffectValueBindingBuilder,
  supportsMechanicsEffectValueBinding,
} from "../mechanicsEffectValueBindingBuilder.js";
import {
  MECHANICS_PROGRESSION_CURVE_TYPES,
  MECHANICS_PROGRESSION_DERIVED_METHODS,
  MECHANICS_PROGRESSION_MODES,
  MECHANICS_PROGRESSION_PROFILE_VERSION,
  MECHANICS_PROGRESSION_REQUIREMENT_MODES,
  generateMechanicsProgressionTable,
  normalizeMechanicsProgressionProfileBuilder,
} from "../mechanicsProgressionProfileBuilder.js";
import {
  MECHANICS_COMMAND_STATE_READOUT_BUCKETS,
  MECHANICS_COMMAND_STATE_READOUT_FORMATS,
  MECHANICS_COMMAND_STATE_READOUT_MAX_FIELDS,
  normalizeMechanicsCommandStateReadoutBuilder,
} from "../mechanicsCommandStateReadoutBuilder.js";
import {
  normalizeMechanicsDefaults,
} from "../mechanics-defaults/mechanicsDefaultsNormalization.js";
import {
  normalizeMechanicsStatusBlocks,
} from "../mechanics-status-blocks/mechanicsStatusBlocksNormalization.js";
import {
  normalizeMechanicsGuards,
} from "../mechanics-guards/mechanicsGuardsNormalization.js";

export const MECHANICS_JSON_EDITOR_VALIDATION_VERSION =
  "mechanics_json_editor_validation_v1";

export const MECHANICS_MODULE_ID = "core.trackers.v1";
export const MECHANICS_INSTANCE_DATA_VERSION =
  "trackers_instance_data.v0_2";
export const MECHANICS_COMPOSITION_VERSION =
  "mechanics_command_composition_v1";

const RESOLUTION_MODES = new Set([
  "NO_ROLL_DETERMINISTIC",
  "THRESHOLD_DIE",
  "OPPOSED_DIE",
]);

const RESOLUTION_MODE_ALIASES = Object.freeze({
  OPPOSED: "OPPOSED_DIE",
  CONTESTED: "OPPOSED_DIE",
  CONTESTED_DIE: "OPPOSED_DIE",
  VERSUS: "OPPOSED_DIE",
  VERSUS_DIE: "OPPOSED_DIE",
});

const ROLL_MODES = new Set([
  "NORMAL",
  "ADVANTAGE",
  "DISADVANTAGE",
]);

const ROLL_MODE_ALIASES = Object.freeze({
  STANDARD: "NORMAL",
  NONE: "NORMAL",
  KEEP_HIGHEST: "ADVANTAGE",
  HIGHEST: "ADVANTAGE",
  HIGH: "ADVANTAGE",
  KEEP_LOWEST: "DISADVANTAGE",
  LOWEST: "DISADVANTAGE",
  LOW: "DISADVANTAGE",
});

const OUTCOMES = new Set([
  "CRITICAL_SUCCESS",
  "SUCCESS",
  "FAILURE",
  "FUMBLE",
]);

const EFFECT_MODES = new Set([
  "INHERIT",
  "REPLACE",
  "APPEND",
  "NONE",
]);

const ARGUMENT_TYPES = new Set([
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
  "NUMBER",
  "ENUM",
  "TEXT",
]);

const TARGET_ARGUMENT_TYPES = new Set([
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

const REQUIREMENT_TYPES = new Set([
  "FLAG",
  "COUNTER",
  "METER",
  "STAGE",
  "TARGET_PRESENT",
  "TARGET_HELD",
  "PROGRESSION_MINIMUM_LEVEL",
  "PROGRESSION_MAXIMUM_LEVEL",
  "PROGRESSION_REQUIRED_TIER",
  "PROGRESSION_FORBIDDEN_TIER",
  "PROGRESSION_AT_MAXIMUM_LEVEL",
]);

const PROGRESSION_REQUIREMENT_TYPES = new Set([
  "PROGRESSION_MINIMUM_LEVEL",
  "PROGRESSION_MAXIMUM_LEVEL",
  "PROGRESSION_REQUIRED_TIER",
  "PROGRESSION_FORBIDDEN_TIER",
  "PROGRESSION_AT_MAXIMUM_LEVEL",
]);

const REQUIREMENT_OPERATORS = new Set([
  "EQ",
  "NEQ",
  "GT",
  "GTE",
  "LT",
  "LTE",
  "TRUTHY",
  "FALSY",
]);

const EFFECT_TYPES = new Set([
  "METER_DELTA",
  "FLAG_SET",
  "FLAG_CLEAR",
  "COUNTER_INCREMENT",
  "COUNTER_SET",
  "STAGE_SET",
  "PROGRESSION_RECONCILE",
  "SENSORY_CAPABILITY_MODIFIER",
  "SENSORY_SIGNATURE_MODIFIER",
  "SENSORY_ENVIRONMENT_MODIFIER",
  "SENSORY_CONCEALMENT_MODIFIER",
  "SENSORY_CONDITION_APPLY",
  "SENSORY_CONDITION_REMOVE",
]);

const DOMAIN_ACTION_TYPES = new Set([
  "NONE",
  "ITEM_GIVE",
  "ITEM_DROP",
  "ITEM_TAKE",
  "ITEM_EQUIP",
  "ITEM_UNEQUIP",
  "ITEM_STORE",
  "ITEM_PLACE",
  "ITEM_USE",
  "ITEM_CONSUME",
  "ITEM_DAMAGE",
  "ITEM_REPAIR",
  "LOCATION_TRANSITION",
  "LOCATION_TRAVEL_OPERATION",
  "PARTICIPANT_CONDITION_APPLY",
  "PARTICIPANT_CONDITION_REMOVE",
]);

const ITEM_HELD_ACTIONS = new Set([
  "ITEM_GIVE",
  "ITEM_DROP",
  "ITEM_EQUIP",
  "ITEM_UNEQUIP",
  "ITEM_STORE",
  "ITEM_PLACE",
  "ITEM_USE",
  "ITEM_CONSUME",
]);

const ITEM_VISIBLE_ACTIONS = new Set([
  "ITEM_TAKE",
  "ITEM_DAMAGE",
  "ITEM_REPAIR",
]);

const LOCATION_ACTIONS = new Set([
  "LOCATION_TRANSITION",
  "LOCATION_TRAVEL_OPERATION",
]);

const TRAVEL_OPERATIONS = new Set([
  "CONTINUE",
  "STOP",
  "RESUME",
  "APPROACH",
  "ARRIVE",
]);

const COMPOSITION_PHASES = new Set(["ATTEMPT", "OUTCOME"]);
const FAILURE_POLICIES = new Set([
  "CONTINUE",
  "STOP",
  "SKIP_DEPENDENTS",
]);
const CONDITION_MODES = new Set(["ALL", "ANY"]);
const CONDITION_BUCKETS = new Set([
  "METER",
  "FLAG",
  "COUNTER",
  "STAGE",
]);
const CONDITION_SCOPES = new Set([
  "COMMAND_SOURCE",
  "ROOT",
  "EXPLICIT",
  "TARGET_ARGUMENT",
]);
const CONDITION_OPERATORS = new Set([
  "EQ",
  "NEQ",
  "GT",
  "GTE",
  "LT",
  "LTE",
  "TRUTHY",
  "FALSY",
  "IN",
  "NOT_IN",
]);

const DOMAIN_LANE_BY_TYPE = Object.freeze({
  ITEM_GIVE: "ITEM_RUNTIME",
  ITEM_DROP: "ITEM_RUNTIME",
  ITEM_TAKE: "ITEM_RUNTIME",
  ITEM_EQUIP: "ITEM_RUNTIME",
  ITEM_UNEQUIP: "ITEM_RUNTIME",
  ITEM_STORE: "ITEM_RUNTIME",
  ITEM_PLACE: "ITEM_RUNTIME",
  ITEM_USE: "ITEM_RUNTIME",
  ITEM_CONSUME: "ITEM_RUNTIME",
  ITEM_DAMAGE: "ITEM_RUNTIME",
  ITEM_REPAIR: "ITEM_RUNTIME",
  LOCATION_TRANSITION: "LOCATION_RUNTIME",
  LOCATION_TRAVEL_OPERATION: "LOCATION_RUNTIME",
  PARTICIPANT_CONDITION_APPLY: "SENSORY_RUNTIME",
  PARTICIPANT_CONDITION_REMOVE: "SENSORY_RUNTIME",
});

function isObject(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value)
  );
}

function asObject(value) {
  return isObject(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function normalizeIdentifier(value, fallback = "") {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;

  const normalized = normalizeString(value).toLowerCase();

  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;

  return fallback;
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function addIssue(target, path, message) {
  target.push({
    path,
    message,
  });
}

function validatePlainObject(value, path, errors) {
  if (!isObject(value)) {
    addIssue(errors, path, "Expected a JSON object.");
    return false;
  }

  return true;
}

function validateArray(value, path, errors) {
  if (!Array.isArray(value)) {
    addIssue(errors, path, "Expected a JSON array.");
    return false;
  }

  return true;
}

function validateUniqueIds(items, path, errors, label) {
  const seen = new Set();

  asArray(items).forEach((item, index) => {
    const id = normalizeIdentifier(item?.id || item?.key);

    if (!id) {
      addIssue(
        errors,
        `${path}[${index}].id`,
        `${label} must define a non-empty id.`
      );
      return;
    }

    if (seen.has(id)) {
      addIssue(
        errors,
        `${path}[${index}].id`,
        `Duplicate ${label.toLowerCase()} id "${id}".`
      );
      return;
    }

    seen.add(id);
  });

  return seen;
}

function validateOutcomeList(value, path, errors) {
  if (value === undefined || value === null) return;

  if (!validateArray(value, path, errors)) return;

  value.forEach((outcome, index) => {
    if (!OUTCOMES.has(normalizeUpper(outcome))) {
      addIssue(
        errors,
        `${path}[${index}]`,
        `Unsupported outcome "${String(outcome)}".`
      );
    }
  });
}

function validateProgressionProfile(value, path, errors) {
  if (!validatePlainObject(value, path, errors)) return;

  const source = asObject(value);
  const profile = normalizeMechanicsProgressionProfileBuilder(source);
  const rawMode = normalizeUpper(source.mode || source.progressionMode);
  const rawCurveType = normalizeUpper(source.curve?.type || source.curveType);
  const rawRequirementMode = normalizeUpper(
    source.curve?.requirementMode || source.requirementMode
  );
  const rawStartingRank = Number(
    source.startingRank ?? source.starting_rank ?? source.startingLevel
  );
  const rawEndingRank = Number(
    source.endingRank ?? source.ending_rank ?? source.endingLevel
  );
  const rawStartingRequirement = Number(
    source.curve?.startingRequirement ??
      source.curve?.starting_requirement ??
      source.startingRequirement
  );
  const rawMinimumIncrease = Number(
    source.curve?.minimumIncrease ??
      source.curve?.minimum_increase ??
      source.minimumIncrease
  );
  const rawRoundTo = Number(
    source.curve?.roundTo ?? source.curve?.round_to ?? source.roundTo
  );

  if (source.version && source.version !== MECHANICS_PROGRESSION_PROFILE_VERSION) {
    addIssue(
      errors,
      `${path}.version`,
      `Unsupported progression profile version "${source.version}".`
    );
  }

  if (rawMode && !MECHANICS_PROGRESSION_MODES.includes(rawMode)) {
    addIssue(errors, `${path}.mode`, `Unsupported progression mode "${rawMode}".`);
  }

  if (rawCurveType && !MECHANICS_PROGRESSION_CURVE_TYPES.includes(rawCurveType)) {
    addIssue(
      errors,
      `${path}.curve.type`,
      `Unsupported progression curve type "${rawCurveType}".`
    );
  }

  if (
    rawRequirementMode &&
    !MECHANICS_PROGRESSION_REQUIREMENT_MODES.includes(rawRequirementMode)
  ) {
    addIssue(
      errors,
      `${path}.curve.requirementMode`,
      `Unsupported requirement mode "${rawRequirementMode}".`
    );
  }

  if (
    Number.isFinite(rawStartingRank) &&
    Number.isFinite(rawEndingRank) &&
    rawEndingRank <= rawStartingRank
  ) {
    addIssue(errors, `${path}.endingRank`, "Ending rank must be greater than starting rank.");
  }
  if (Number.isFinite(rawStartingRequirement) && rawStartingRequirement <= 0) {
    addIssue(errors, `${path}.curve.startingRequirement`, "Starting requirement must be positive.");
  }
  if (Number.isFinite(rawMinimumIncrease) && rawMinimumIncrease <= 0) {
    addIssue(errors, `${path}.curve.minimumIncrease`, "Minimum increase must be positive.");
  }
  if (Number.isFinite(rawRoundTo) && rawRoundTo <= 0) {
    addIssue(errors, `${path}.curve.roundTo`, "Round-to value must be positive.");
  }

  if (!profile.sourceValueId) {
    addIssue(errors, `${path}.sourceValueId`, "Progression source counter id is required.");
  }
  if (!profile.rankValueId) {
    addIssue(errors, `${path}.rankValueId`, "Progression rank counter id is required.");
  }
  if (profile.mode === "EXPLICIT_TABLE" && !profile.thresholds.length) {
    addIssue(
      errors,
      `${path}.thresholds`,
      "Explicit-table progression requires threshold rows."
    );
  }

  validateUniqueIds(
    profile.derivedValues,
    `${path}.derivedValues`,
    errors,
    "Derived value"
  );
  profile.derivedValues.forEach((rule, index) => {
    const rawRule = asObject(asArray(source.derivedValues || source.derived_values)[index]);
    const rawMethod = normalizeUpper(rawRule.method || rawRule.type);
    if (rawMethod && !MECHANICS_PROGRESSION_DERIVED_METHODS.includes(rawMethod)) {
      addIssue(
        errors,
        `${path}.derivedValues[${index}].method`,
        `Unsupported derived-value method "${rawMethod}".`
      );
    }
    if (rule.method === "RANK_INTERVAL" && rule.increaseEveryRanks < 1) {
      addIssue(
        errors,
        `${path}.derivedValues[${index}].increaseEveryRanks`,
        "Rank interval must be at least 1."
      );
    }
  });

  const table = generateMechanicsProgressionTable(profile);
  if (table.length !== profile.endingRank - profile.startingRank + 1) {
    addIssue(errors, path, "Progression table did not generate the configured rank span.");
  }
  for (let index = 1; index < table.length; index += 1) {
    if (table[index].totalRequirement <= table[index - 1].totalRequirement) {
      addIssue(
        errors,
        `${path}.curve`,
        `Generated threshold for rank ${table[index].rank} is not greater than the previous rank.`
      );
      break;
    }
  }
}

function validateEffect(effect, path, errors, argumentTypes) {
  if (!validatePlainObject(effect, path, errors)) return;

  const type = normalizeUpper(effect.type);

  if (!EFFECT_TYPES.has(type)) {
    addIssue(
      errors,
      `${path}.type`,
      `Unsupported Mechanics effect type "${type || "(missing)"}".`
    );
  }

  const effectId = normalizeIdentifier(effect.id || effect.key);

  if (!effectId) {
    addIssue(errors, `${path}.id`, "Effect id is required.");
  }

  const targetBinding = asObject(
    effect.targetBinding || {
      mode:
        effect.targetBindingMode ||
        effect.target_binding_mode,
      argumentName:
        effect.targetArgumentName ||
        effect.target_argument_name,
    }
  );
  const bindingMode = normalizeUpper(
    targetBinding.mode || targetBinding.type || "FIXED"
  );

  if (!["FIXED", "ARGUMENT"].includes(bindingMode)) {
    addIssue(
      errors,
      `${path}.targetBinding.mode`,
      `Unsupported target-binding mode "${bindingMode}".`
    );
  }

  if (bindingMode === "ARGUMENT") {
    const argumentName = normalizeIdentifier(
      targetBinding.argumentName ||
        targetBinding.argument_name
    );
    const argumentType = argumentTypes.get(argumentName);

    if (!argumentName || !argumentType) {
      addIssue(
        errors,
        `${path}.targetBinding.argumentName`,
        `Effect target binding must reference an existing command argument.`
      );
    } else if (!TARGET_ARGUMENT_TYPES.has(argumentType)) {
      addIssue(
        errors,
        `${path}.targetBinding.argumentName`,
        `Argument "${argumentName}" is ${argumentType}, not a resolvable target argument.`
      );
    }
  }

  if (!type.startsWith("SENSORY_")) {
    const targetId = normalizeIdentifier(
      effect.targetId ||
        effect.target_id ||
        effect.trackerId ||
        effect.tracker_id
    );

    if (!targetId) {
      addIssue(
        errors,
        `${path}.targetId`,
        "Mechanics State ID is required for this effect."
      );
    }
  }

  if (type === "PROGRESSION_RECONCILE") {
    validateProgressionProfile(
      effect.progressionProfile ||
        effect.progression_profile ||
        effect.profile,
      `${path}.progressionProfile`,
      errors
    );
  }

  const rawValueBinding = asObject(
    effect.valueBinding || {
      mode: effect.valueBindingMode || effect.value_binding_mode,
      argumentName: effect.valueArgumentName || effect.value_argument_name,
      multiplier: effect.valueMultiplier,
      divisor: effect.valueDivisor,
      offset: effect.valueOffset,
      rounding: effect.valueRounding,
      minValue: effect.valueMin,
      maxValue: effect.valueMax,
      missingPolicy: effect.valueMissingPolicy,
    }
  );
  const valueBinding = normalizeMechanicsEffectValueBindingBuilder(
    rawValueBinding,
    type
  );
  const rawMode = normalizeUpper(
    rawValueBinding.mode ||
      rawValueBinding.type ||
      (rawValueBinding.argumentName || rawValueBinding.argument_name
        ? "ARGUMENT"
        : "FIXED")
  );

  if (
    Object.keys(rawValueBinding).length &&
    !supportsMechanicsEffectValueBinding(type) &&
    ["ARGUMENT", "COMMAND_ARGUMENT", "NUMBER_ARGUMENT", "PARSED_ARGUMENT"].includes(rawMode)
  ) {
    addIssue(
      errors,
      `${path}.valueBinding`,
      `Effect type ${type || "(missing)"} does not support numeric argument value binding.`
    );
  }

  if (supportsMechanicsEffectValueBinding(type)) {
    if (rawMode && !MECHANICS_EFFECT_VALUE_BINDING_MODES.includes(valueBinding.mode)) {
      addIssue(
        errors,
        `${path}.valueBinding.mode`,
        `Unsupported numeric value-binding mode "${rawMode}".`
      );
    }

    if (valueBinding.mode === "ARGUMENT") {
      const argumentType = argumentTypes.get(valueBinding.argumentName);

      if (!valueBinding.argumentName || !argumentType) {
        addIssue(
          errors,
          `${path}.valueBinding.argumentName`,
          "Numeric value binding must reference an existing NUMBER command argument."
        );
      } else if (argumentType !== "NUMBER") {
        addIssue(
          errors,
          `${path}.valueBinding.argumentName`,
          `Argument "${valueBinding.argumentName}" is ${argumentType}, not NUMBER.`
        );
      }

      if (Number(rawValueBinding.divisor) === 0) {
        addIssue(
          errors,
          `${path}.valueBinding.divisor`,
          "Numeric value-binding divisor cannot be zero."
        );
      }

      if (
        rawValueBinding.rounding &&
        !MECHANICS_EFFECT_VALUE_BINDING_ROUNDING.includes(
          normalizeUpper(rawValueBinding.rounding)
        )
      ) {
        addIssue(
          errors,
          `${path}.valueBinding.rounding`,
          `Unsupported numeric value-binding rounding "${rawValueBinding.rounding}".`
        );
      }

      if (
        rawValueBinding.missingPolicy &&
        !MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES.includes(
          normalizeUpper(rawValueBinding.missingPolicy)
        )
      ) {
        addIssue(
          errors,
          `${path}.valueBinding.missingPolicy`,
          `Unsupported numeric value-binding missing policy "${rawValueBinding.missingPolicy}".`
        );
      }

      const minValue = rawValueBinding.minValue ?? rawValueBinding.min;
      const maxValue = rawValueBinding.maxValue ?? rawValueBinding.max;
      if (
        minValue !== undefined &&
        minValue !== null &&
        minValue !== "" &&
        maxValue !== undefined &&
        maxValue !== null &&
        maxValue !== "" &&
        Number(minValue) > Number(maxValue)
      ) {
        addIssue(
          errors,
          `${path}.valueBinding`,
          "Numeric value-binding minimum cannot exceed its maximum."
        );
      }
    }
  }
}

function validateEffects(value, path, errors, argumentTypes) {
  if (value === undefined || value === null) return;

  if (!validateArray(value, path, errors)) return;

  validateUniqueIds(value, path, errors, "Effect");

  value.forEach((effect, index) =>
    validateEffect(effect, `${path}[${index}]`, errors, argumentTypes)
  );
}

function validateResolutionModifierSources(
  sources,
  path,
  errors,
  argumentTypes
) {
  if (sources === undefined || sources === null) return;

  if (!validateArray(sources, path, errors)) return;

  const sourceTypes = new Set([
    "MECHANICS_VALUE",
    "TARGET_MECHANICS_VALUE",
    "TARGET_PROPERTY",
  ]);

  sources.forEach((source, index) => {
    const sourcePath = `${path}[${index}]`;

    if (!validatePlainObject(source, sourcePath, errors)) return;

    const type = normalizeUpper(
      source.type ||
        source.sourceType ||
        source.source_type
    );

    if (!sourceTypes.has(type)) {
      addIssue(
        errors,
        `${sourcePath}.type`,
        `Unsupported modifier-source type "${type || "(missing)"}".`
      );
    }

    if (type.startsWith("TARGET_")) {
      const argumentName = normalizeIdentifier(
        source.argumentName ||
          source.argument_name ||
          source.targetArgumentName
      );

      if (!argumentTypes.has(argumentName)) {
        addIssue(
          errors,
          `${sourcePath}.argumentName`,
          `Modifier source must reference an existing command target argument.`
        );
      } else if (
        !TARGET_ARGUMENT_TYPES.has(argumentTypes.get(argumentName))
      ) {
        addIssue(
          errors,
          `${sourcePath}.argumentName`,
          `Argument "${argumentName}" is not a resolvable target.`
        );
      }
    }

    if (type.includes("MECHANICS_VALUE")) {
      const mechanicsId = normalizeIdentifier(
        source.mechanicsId ||
          source.mechanics_id ||
          source.targetId
      );

      if (!mechanicsId) {
        addIssue(
          errors,
          `${sourcePath}.mechanicsId`,
          "Mechanics modifier source requires a Mechanics State ID."
        );
      }
    }

    const divisor = Number(source.divisor ?? 1);

    if (!Number.isFinite(divisor) || divisor === 0) {
      addIssue(
        errors,
        `${sourcePath}.divisor`,
        "Modifier-source divisor must be a finite non-zero number."
      );
    }
  });
}

function resolveResolutionMode(value) {
  const requested = normalizeUpper(
    value?.mode ||
      value?.type ||
      value?.resolutionMode
  );

  return RESOLUTION_MODE_ALIASES[requested] || requested;
}

function resolveRollMode(value) {
  const requested = normalizeUpper(value);
  return ROLL_MODE_ALIASES[requested] || requested;
}

function validateDie(die, path, errors) {
  if (!validatePlainObject(die, path, errors)) return;

  const count = Number(die.count ?? die.number);
  const sides = Number(die.sides ?? die.size);

  if (!Number.isInteger(count) || count < 1 || count > 20) {
    addIssue(
      errors,
      `${path}.count`,
      "Die count must be an integer from 1 through 20."
    );
  }

  if (!Number.isInteger(sides) || sides < 2 || sides > 1000) {
    addIssue(
      errors,
      `${path}.sides`,
      "Die sides must be an integer from 2 through 1000."
    );
  }
}

function validateResolution(
  resolution,
  path,
  errors,
  warnings,
  argumentTypes
) {
  if (!validatePlainObject(resolution, path, errors)) return;

  const version = normalizeString(resolution.version);

  if (
    version &&
    version !== MECHANICS_COMMAND_RESOLUTION_VERSION
  ) {
    addIssue(
      errors,
      `${path}.version`,
      `Resolution version must be ${MECHANICS_COMMAND_RESOLUTION_VERSION}.`
    );
  }

  const mode = resolveResolutionMode(resolution);

  if (!RESOLUTION_MODES.has(mode)) {
    addIssue(
      errors,
      `${path}.mode`,
      `Unsupported resolution mode "${mode || "(missing)"}".`
    );
    return;
  }

  const rawMode = normalizeUpper(
    resolution.mode ||
      resolution.type ||
      resolution.resolutionMode
  );

  if (rawMode && rawMode !== mode) {
    addIssue(
      warnings,
      `${path}.mode`,
      `Alias "${rawMode}" will normalize to "${mode}".`
    );
  }

  if (mode === "NO_ROLL_DETERMINISTIC") return;

  validateDie(
    resolution.die ||
      resolution.thresholdDie ||
      resolution.actorDie,
    `${path}.die`,
    errors
  );

  const rollMode = resolveRollMode(
    resolution.rollMode ||
      resolution.advantageMode ||
      resolution.keepMode ||
      "NORMAL"
  );

  if (!ROLL_MODES.has(rollMode)) {
    addIssue(
      errors,
      `${path}.rollMode`,
      `Unsupported roll policy "${rollMode}".`
    );
  }

  if (mode === "THRESHOLD_DIE") {
    const targetNumber = Number(
      resolution.targetNumber ??
        resolution.difficulty ??
        resolution.threshold
    );

    if (!Number.isFinite(targetNumber)) {
      addIssue(
        errors,
        `${path}.targetNumber`,
        "Threshold resolution requires a finite target number."
      );
    }
  }

  validateResolutionModifierSources(
    resolution.modifierSources ||
      resolution.authoritativeModifierSources ||
      resolution.actorModifierSources,
    `${path}.modifierSources`,
    errors,
    argumentTypes
  );

  if (mode === "OPPOSED_DIE") {
    const opposed = asObject(
      resolution.opposed ||
        resolution.opposition ||
        resolution.opponent ||
        resolution.defender
    );

    if (!Object.keys(opposed).length) {
      addIssue(
        errors,
        `${path}.opposed`,
        "Opposed resolution requires an opposition configuration."
      );
    } else {
      validateDie(
        opposed.die ||
          opposed.opposedDie ||
          opposed.defenderDie,
        `${path}.opposed.die`,
        errors
      );

      const opposedRollMode = resolveRollMode(
        opposed.rollMode ||
          opposed.advantageMode ||
          opposed.keepMode ||
          "NORMAL"
      );

      if (!ROLL_MODES.has(opposedRollMode)) {
        addIssue(
          errors,
          `${path}.opposed.rollMode`,
          `Unsupported opposition roll policy "${opposedRollMode}".`
        );
      }

      const tiePolicy = normalizeUpper(
        opposed.tiePolicy ||
          opposed.tieBreaker ||
          "OPPOSITION_WINS"
      );

      if (
        !["OPPOSITION_WINS", "ACTOR_WINS"].includes(
          tiePolicy
        )
      ) {
        addIssue(
          errors,
          `${path}.opposed.tiePolicy`,
          `Unsupported opposed tie policy "${tiePolicy}".`
        );
      }

      validateResolutionModifierSources(
        opposed.modifierSources ||
          opposed.authoritativeModifierSources,
        `${path}.opposed.modifierSources`,
        errors,
        argumentTypes
      );
    }
  }

  const degree = asObject(
    resolution.degreeOfSuccess ||
      resolution.marginBands ||
      resolution.degreesOfSuccess
  );

  if (Object.keys(degree).length) {
    const criticalMargin = Number(
      degree.criticalSuccessMargin ??
        degree.criticalMargin
    );
    const fumbleMargin = Number(
      degree.fumbleMargin ??
        degree.catastrophicFailureMargin
    );

    if (
      normalizeBoolean(degree.enabled, true) &&
      (!Number.isFinite(criticalMargin) ||
        criticalMargin < 1)
    ) {
      addIssue(
        errors,
        `${path}.degreeOfSuccess.criticalSuccessMargin`,
        "Critical-success margin must be a positive finite number."
      );
    }

    if (
      normalizeBoolean(degree.enabled, true) &&
      (!Number.isFinite(fumbleMargin) ||
        fumbleMargin > -1)
    ) {
      addIssue(
        errors,
        `${path}.degreeOfSuccess.fumbleMargin`,
        "Fumble margin must be a negative finite number."
      );
    }
  }
}

function validateArgumentList(
  invocation,
  path,
  errors
) {
  const argumentTypes = new Map();
  const argumentsList = asArray(invocation.arguments);

  validateUniqueIds(
    argumentsList.map((argument) => ({
      id: argument?.name || argument?.id,
    })),
    `${path}.arguments`,
    errors,
    "Argument"
  );

  argumentsList.forEach((argument, index) => {
    const argumentPath = `${path}.arguments[${index}]`;

    if (!validatePlainObject(argument, argumentPath, errors)) return;

    const name = normalizeIdentifier(
      argument.name || argument.id
    );
    const type = normalizeUpper(argument.type);

    if (!ARGUMENT_TYPES.has(type)) {
      addIssue(
        errors,
        `${argumentPath}.type`,
        `Unsupported command argument type "${type || "(missing)"}".`
      );
    }

    if (name) {
      argumentTypes.set(name, type);
    }

    if (
      type === "ENUM" &&
      (!Array.isArray(argument.options) ||
        !argument.options.length)
    ) {
      addIssue(
        errors,
        `${argumentPath}.options`,
        "ENUM arguments require at least one allowed value."
      );
    }

    if (type === "NUMBER") {
      const min =
        argument.min === null ||
        argument.min === undefined ||
        argument.min === ""
          ? null
          : Number(argument.min);
      const max =
        argument.max === null ||
        argument.max === undefined ||
        argument.max === ""
          ? null
          : Number(argument.max);

      if (min !== null && !Number.isFinite(min)) {
        addIssue(
          errors,
          `${argumentPath}.min`,
          "NUMBER argument minimum must be finite or null."
        );
      }

      if (max !== null && !Number.isFinite(max)) {
        addIssue(
          errors,
          `${argumentPath}.max`,
          "NUMBER argument maximum must be finite or null."
        );
      }

      if (
        Number.isFinite(min) &&
        Number.isFinite(max) &&
        min > max
      ) {
        addIssue(
          errors,
          argumentPath,
          "NUMBER argument minimum cannot exceed its maximum."
        );
      }
    }
  });

  return argumentTypes;
}

function requireArgumentType({
  action,
  field,
  expectedTypes,
  path,
  argumentTypes,
  errors,
  optional = false,
}) {
  const argumentName = normalizeIdentifier(
    action[field] ||
      action[
        field.replace(/[A-Z]/g, (letter) =>
          `_${letter.toLowerCase()}`
        )
      ]
  );

  if (!argumentName) {
    if (!optional) {
      addIssue(
        errors,
        `${path}.${field}`,
        `${field} is required for ${normalizeUpper(action.type)}.`
      );
    }
    return;
  }

  const actualType = argumentTypes.get(argumentName);

  if (!actualType) {
    addIssue(
      errors,
      `${path}.${field}`,
      `Unknown command argument "${argumentName}".`
    );
    return;
  }

  if (!expectedTypes.includes(actualType)) {
    addIssue(
      errors,
      `${path}.${field}`,
      `Argument "${argumentName}" must be ${expectedTypes.join(
        " or "
      )}; found ${actualType}.`
    );
  }
}

function validateDomainAction(
  rawAction,
  path,
  errors,
  argumentTypes
) {
  if (!validatePlainObject(rawAction, path, errors)) {
    return {
      type: "NONE",
      lane: "",
      enabled: false,
    };
  }

  const type = normalizeUpper(
    rawAction.type ||
      rawAction.actionType ||
      rawAction.action_type ||
      "NONE"
  );
  const enabled =
    type !== "NONE" &&
    normalizeBoolean(rawAction.enabled, true);

  if (!DOMAIN_ACTION_TYPES.has(type)) {
    addIssue(
      errors,
      `${path}.type`,
      `Unsupported domain action type "${type || "(missing)"}".`
    );
  }

  validateOutcomeList(
    rawAction.applyOnOutcomes ||
      rawAction.apply_on_outcomes ||
      rawAction.outcomes,
    `${path}.applyOnOutcomes`,
    errors
  );

  if (!enabled || type === "NONE") {
    return {
      type,
      lane: "",
      enabled: false,
    };
  }

  if (ITEM_HELD_ACTIONS.has(type)) {
    requireArgumentType({
      action: rawAction,
      field: "itemArgumentName",
      expectedTypes: ["ITEM_HELD"],
      path,
      argumentTypes,
      errors,
    });
  }

  if (ITEM_VISIBLE_ACTIONS.has(type)) {
    requireArgumentType({
      action: rawAction,
      field: "itemArgumentName",
      expectedTypes: ["ITEM_VISIBLE"],
      path,
      argumentTypes,
      errors,
    });
  }

  if (type === "ITEM_GIVE") {
    requireArgumentType({
      action: rawAction,
      field: "targetArgumentName",
      expectedTypes: ["CHARACTER_PRESENT"],
      path,
      argumentTypes,
      errors,
    });
  }

  if (["ITEM_STORE", "ITEM_PLACE"].includes(type)) {
    requireArgumentType({
      action: rawAction,
      field: "placementArgumentName",
      expectedTypes: ["TEXT"],
      path,
      argumentTypes,
      errors,
    });
  }

  if (type === "ITEM_CONSUME") {
    requireArgumentType({
      action: rawAction,
      field: "quantityArgumentName",
      expectedTypes: ["NUMBER"],
      path,
      argumentTypes,
      errors,
      optional: true,
    });
  }

  if (["ITEM_DAMAGE", "ITEM_REPAIR"].includes(type)) {
    requireArgumentType({
      action: rawAction,
      field: "amountArgumentName",
      expectedTypes: ["NUMBER"],
      path,
      argumentTypes,
      errors,
    });
  }

  if (type === "LOCATION_TRANSITION") {
    requireArgumentType({
      action: rawAction,
      field: "destinationArgumentName",
      expectedTypes: ["LOCATION_CONNECTED"],
      path,
      argumentTypes,
      errors,
    });
  }

  if (type === "LOCATION_TRAVEL_OPERATION") {
    const operation = normalizeUpper(
      rawAction.travelOperation ||
        rawAction.travel_operation ||
        rawAction.operation
    );

    if (!TRAVEL_OPERATIONS.has(operation)) {
      addIssue(
        errors,
        `${path}.travelOperation`,
        `Unsupported travel operation "${operation || "(missing)"}".`
      );
    }
  }

  if (
    [
      "PARTICIPANT_CONDITION_APPLY",
      "PARTICIPANT_CONDITION_REMOVE",
    ].includes(type)
  ) {
    requireArgumentType({
      action: rawAction,
      field: "targetArgumentName",
      expectedTypes: ["CHARACTER_PRESENT"],
      path,
      argumentTypes,
      errors,
    });
    requireArgumentType({
      action: rawAction,
      field: "conditionArgumentName",
      expectedTypes: ["TEXT"],
      path,
      argumentTypes,
      errors,
    });
  }

  return {
    type,
    lane: DOMAIN_LANE_BY_TYPE[type] || "",
    enabled,
  };
}

function validateCompositionCondition(
  condition,
  path,
  errors,
  argumentTypes
) {
  if (!validatePlainObject(condition, path, errors)) return;

  const bucket = normalizeUpper(
    condition.bucket ||
      condition.mechanicsBucket ||
      condition.stateType
  );
  const scopeMode = normalizeUpper(
    condition.scopeMode ||
      condition.scope_mode ||
      condition.scope
  );
  const operator = normalizeUpper(
    condition.operator ||
      condition.comparison ||
      condition.op
  );
  const mechanicsId = normalizeIdentifier(
    condition.mechanicsId ||
      condition.mechanics_id ||
      condition.targetId ||
      condition.trackerId
  );

  if (!CONDITION_BUCKETS.has(bucket)) {
    addIssue(
      errors,
      `${path}.bucket`,
      `Unsupported condition bucket "${bucket || "(missing)"}".`
    );
  }

  if (!CONDITION_SCOPES.has(scopeMode)) {
    addIssue(
      errors,
      `${path}.scopeMode`,
      `Unsupported condition scope "${scopeMode || "(missing)"}".`
    );
  }

  if (!CONDITION_OPERATORS.has(operator)) {
    addIssue(
      errors,
      `${path}.operator`,
      `Unsupported condition operator "${operator || "(missing)"}".`
    );
  }

  if (!mechanicsId) {
    addIssue(
      errors,
      `${path}.mechanicsId`,
      "Composition condition requires a Mechanics State ID."
    );
  }

  if (scopeMode === "EXPLICIT") {
    const scopeKey = normalizeString(
      condition.scopeKey ||
        condition.scope_key
    );

    if (!scopeKey) {
      addIssue(
        errors,
        `${path}.scopeKey`,
        "EXPLICIT condition scope requires a scope key."
      );
    }
  }

  if (scopeMode === "TARGET_ARGUMENT") {
    const argumentName = normalizeIdentifier(
      condition.argumentName ||
        condition.argument_name ||
        condition.targetArgumentName
    );

    if (!argumentTypes.has(argumentName)) {
      addIssue(
        errors,
        `${path}.argumentName`,
        "TARGET_ARGUMENT condition must reference an existing command argument."
      );
    } else if (
      !TARGET_ARGUMENT_TYPES.has(argumentTypes.get(argumentName))
    ) {
      addIssue(
        errors,
        `${path}.argumentName`,
        `Argument "${argumentName}" is not a resolvable target.`
      );
    }
  }

  if (
    ["IN", "NOT_IN"].includes(operator) &&
    !Array.isArray(condition.value)
  ) {
    addIssue(
      errors,
      `${path}.value`,
      `${operator} conditions require an array value.`
    );
  }
}

function validateComposition(
  composition,
  path,
  errors,
  warnings,
  argumentTypes,
  legacyAction
) {
  if (composition === undefined || composition === null) {
    return;
  }

  if (!validatePlainObject(composition, path, errors)) return;

  const version = normalizeString(composition.version);

  if (
    version &&
    version !== MECHANICS_COMPOSITION_VERSION
  ) {
    addIssue(
      errors,
      `${path}.version`,
      `Composition version must be ${MECHANICS_COMPOSITION_VERSION}.`
    );
  }

  const mechanicsSteps = asArray(
    composition.mechanicsSteps ||
      composition.mechanics_steps ||
      composition.steps
  );
  const domainSteps = asArray(
    composition.domainSteps ||
      composition.domain_steps ||
      composition.actions
  );

  if (
    (composition.mechanicsSteps !== undefined ||
      composition.mechanics_steps !== undefined ||
      composition.steps !== undefined) &&
    !Array.isArray(
      composition.mechanicsSteps ||
        composition.mechanics_steps ||
        composition.steps
    )
  ) {
    addIssue(
      errors,
      `${path}.mechanicsSteps`,
      "mechanicsSteps must be an array."
    );
  }

  if (
    (composition.domainSteps !== undefined ||
      composition.domain_steps !== undefined ||
      composition.actions !== undefined) &&
    !Array.isArray(
      composition.domainSteps ||
        composition.domain_steps ||
        composition.actions
    )
  ) {
    addIssue(
      errors,
      `${path}.domainSteps`,
      "domainSteps must be an array."
    );
  }

  if (domainSteps.length > 3) {
    addIssue(
      errors,
      `${path}.domainSteps`,
      "At most three authored domain steps are allowed."
    );
  }

  const allStepIds = new Set();
  const completedStepIds = new Set();
  const domainEntries = [];

  mechanicsSteps.forEach((step, index) => {
    const stepPath = `${path}.mechanicsSteps[${index}]`;

    if (!validatePlainObject(step, stepPath, errors)) return;

    const stepId = normalizeIdentifier(
      step.id || step.key,
      `mechanics_step_${index + 1}`
    );

    if (allStepIds.has(stepId)) {
      addIssue(
        errors,
        `${stepPath}.id`,
        `Duplicate composition step id "${stepId}".`
      );
    }

    allStepIds.add(stepId);

    const phase = normalizeUpper(
      step.phase ||
        step.applicationPhase ||
        "OUTCOME"
    );

    if (!COMPOSITION_PHASES.has(phase)) {
      addIssue(
        errors,
        `${stepPath}.phase`,
        `Unsupported Mechanics step phase "${phase}".`
      );
    }

    const failurePolicy = normalizeUpper(
      step.failurePolicy ||
        step.failure_policy ||
        step.onFailure ||
        "CONTINUE"
    );

    if (!FAILURE_POLICIES.has(failurePolicy)) {
      addIssue(
        errors,
        `${stepPath}.failurePolicy`,
        `Unsupported failure policy "${failurePolicy}".`
      );
    }

    const dependencies = asArray(
      step.dependsOnStepIds ||
        step.depends_on_step_ids ||
        step.dependencies
    ).map(normalizeIdentifier);

    dependencies.forEach((dependencyId, dependencyIndex) => {
      if (!dependencyId || !completedStepIds.has(dependencyId)) {
        addIssue(
          errors,
          `${stepPath}.dependsOnStepIds[${dependencyIndex}]`,
          `Dependency "${dependencyId || "(missing)"}" must reference an earlier composition step.`
        );
      }
    });

    const conditionMode = normalizeUpper(
      step.conditionMode ||
        step.condition_mode ||
        "ALL"
    );

    if (!CONDITION_MODES.has(conditionMode)) {
      addIssue(
        errors,
        `${stepPath}.conditionMode`,
        `Unsupported condition mode "${conditionMode}".`
      );
    }

    const conditions = asArray(step.conditions);
    validateUniqueIds(
      conditions,
      `${stepPath}.conditions`,
      errors,
      "Condition"
    );

    conditions.forEach((condition, conditionIndex) =>
      validateCompositionCondition(
        condition,
        `${stepPath}.conditions[${conditionIndex}]`,
        errors,
        argumentTypes
      )
    );

    if (
      phase === "ATTEMPT" &&
      asArray(
        step.applyOnOutcomes ||
          step.apply_on_outcomes
      ).length
    ) {
      addIssue(
        warnings,
        `${stepPath}.applyOnOutcomes`,
        "ATTEMPT steps do not use outcome routing; this field will be removed."
      );
    } else {
      validateOutcomeList(
        step.applyOnOutcomes ||
          step.apply_on_outcomes,
        `${stepPath}.applyOnOutcomes`,
        errors
      );
    }

    validateEffects(
      step.effects,
      `${stepPath}.effects`,
      errors,
      argumentTypes
    );

    completedStepIds.add(stepId);
  });

  domainSteps.forEach((step, index) => {
    const stepPath = `${path}.domainSteps[${index}]`;

    if (!validatePlainObject(step, stepPath, errors)) return;

    const stepId = normalizeIdentifier(
      step.id || step.key,
      `domain_step_${index + 1}`
    );

    if (allStepIds.has(stepId)) {
      addIssue(
        errors,
        `${stepPath}.id`,
        `Duplicate composition step id "${stepId}".`
      );
    }

    allStepIds.add(stepId);

    const failurePolicy = normalizeUpper(
      step.failurePolicy ||
        step.failure_policy ||
        step.onFailure ||
        "CONTINUE"
    );

    if (!FAILURE_POLICIES.has(failurePolicy)) {
      addIssue(
        errors,
        `${stepPath}.failurePolicy`,
        `Unsupported failure policy "${failurePolicy}".`
      );
    }

    const dependencies = asArray(
      step.dependsOnStepIds ||
        step.depends_on_step_ids ||
        step.dependencies
    ).map(normalizeIdentifier);

    dependencies.forEach((dependencyId, dependencyIndex) => {
      if (!dependencyId || !completedStepIds.has(dependencyId)) {
        addIssue(
          errors,
          `${stepPath}.dependsOnStepIds[${dependencyIndex}]`,
          `Dependency "${dependencyId || "(missing)"}" must reference an earlier composition step.`
        );
      }
    });

    const action = validateDomainAction(
      step.action ||
        step.domainAction ||
        step.domain_action,
      `${stepPath}.action`,
      errors,
      argumentTypes
    );

    if (action.enabled) {
      domainEntries.push({
        path: `${stepPath}.action`,
        ...action,
      });
    }

    completedStepIds.add(stepId);
  });

  if (legacyAction?.enabled) {
    domainEntries.push({
      path: `${path.replace(/\.composition$/, "")}.domainAction`,
      ...legacyAction,
    });
  }

  const lanePaths = new Map();

  domainEntries.forEach((entry) => {
    if (!entry.lane) return;

    if (lanePaths.has(entry.lane)) {
      addIssue(
        errors,
        entry.path,
        `Domain composition already uses the ${entry.lane} patch lane at ${lanePaths.get(
          entry.lane
        )}.`
      );
    } else {
      lanePaths.set(entry.lane, entry.path);
    }
  });

  const firstLocationIndex = domainEntries.findIndex(
    (entry) => LOCATION_ACTIONS.has(entry.type)
  );

  if (
    firstLocationIndex >= 0 &&
    firstLocationIndex !== domainEntries.length - 1
  ) {
    addIssue(
      errors,
      domainEntries[firstLocationIndex].path,
      "Location actions must be the final configured domain action."
    );
  }
}

function validateCommandStateReadout(value, path, errors) {
  if (value === undefined || value === null) return;
  if (!validatePlainObject(value, path, errors)) return;

  const fields = asArray(
    value.fields || value.values || value.entries
  );

  if (fields.length > MECHANICS_COMMAND_STATE_READOUT_MAX_FIELDS) {
    addIssue(
      errors,
      `${path}.fields`,
      `State readout supports at most ${MECHANICS_COMMAND_STATE_READOUT_MAX_FIELDS} fields.`
    );
  }

  validateUniqueIds(fields, `${path}.fields`, errors, "State readout field");

  fields.forEach((field, index) => {
    const fieldPath = `${path}.fields[${index}]`;

    if (!validatePlainObject(field, fieldPath, errors)) return;

    const bucket = normalizeUpper(
      field.bucket || field.stateType || field.state_type
    );
    const format = normalizeUpper(
      field.format || field.displayFormat || field.display_format ||
        (bucket === "FLAG" ? "BOOLEAN" : "AUTO")
    );
    const targetId = normalizeIdentifier(
      field.targetId ||
        field.target_id ||
        field.mechanicsId ||
        field.mechanics_id ||
        field.stateId ||
        field.state_id
    );

    if (!MECHANICS_COMMAND_STATE_READOUT_BUCKETS.includes(bucket)) {
      addIssue(
        errors,
        `${fieldPath}.bucket`,
        `Unsupported state readout bucket "${bucket || "(missing)"}".`
      );
    }

    if (!MECHANICS_COMMAND_STATE_READOUT_FORMATS.includes(format)) {
      addIssue(
        errors,
        `${fieldPath}.format`,
        `Unsupported state readout format "${format || "(missing)"}".`
      );
    }

    if (!targetId) {
      addIssue(
        errors,
        `${fieldPath}.targetId`,
        "State readout field requires a Mechanics State ID."
      );
    }
  });
}

function validateCommand(
  command,
  path,
  errors,
  warnings
) {
  if (!validatePlainObject(command, path, errors)) return;

  const invocation = asObject(command.invocation);
  const presentation = asObject(command.presentation);

  validateCommandStateReadout(
    presentation.stateReadout || presentation.state_readout,
    `${path}.presentation.stateReadout`,
    errors
  );

  const argumentTypes = validateArgumentList(
    invocation,
    `${path}.invocation`,
    errors
  );

  validateEffects(
    command.attemptEffects ||
      command.attempt_effects,
    `${path}.attemptEffects`,
    errors,
    argumentTypes
  );

  validateEffects(
    command.effects,
    `${path}.effects`,
    errors,
    argumentTypes
  );

  const requirements = asArray(command.requirements);

  validateUniqueIds(
    requirements,
    `${path}.requirements`,
    errors,
    "Requirement"
  );

  requirements.forEach((requirement, index) => {
    const requirementPath = `${path}.requirements[${index}]`;

    if (!validatePlainObject(requirement, requirementPath, errors)) return;

    const type = normalizeUpper(
      requirement.type ||
        requirement.requirementType
    );
    const operator = normalizeUpper(
      requirement.operator ||
        requirement.comparison ||
        requirement.op
    );

    if (!REQUIREMENT_TYPES.has(type)) {
      addIssue(
        errors,
        `${requirementPath}.type`,
        `Unsupported requirement type "${type || "(missing)"}".`
      );
    }

    if (!REQUIREMENT_OPERATORS.has(operator)) {
      addIssue(
        errors,
        `${requirementPath}.operator`,
        `Unsupported requirement operator "${operator || "(missing)"}".`
      );
    }

    if (
      ["TARGET_PRESENT", "TARGET_HELD"].includes(type)
    ) {
      const argumentName = normalizeIdentifier(
        requirement.argumentName ||
          requirement.argument_name
      );

      if (!argumentTypes.has(argumentName)) {
        addIssue(
          errors,
          `${requirementPath}.argumentName`,
          "Target requirement must reference an existing command argument."
        );
      }
    } else {
      const targetId = normalizeIdentifier(
        requirement.targetId ||
          requirement.target_id ||
          requirement.mechanicsId
      );

      if (!targetId) {
        addIssue(
          errors,
          `${requirementPath}.targetId`,
          PROGRESSION_REQUIREMENT_TYPES.has(type)
            ? "Progression requirement requires an Actor Mechanics Profile progression binding ID."
            : "Mechanics requirement requires a Mechanics State ID."
        );
      }

      if (
        ["PROGRESSION_MINIMUM_LEVEL", "PROGRESSION_MAXIMUM_LEVEL"].includes(type)
      ) {
        const level = Number(
          requirement.value ??
            requirement.expectedValue ??
            requirement.threshold
        );

        if (!Number.isInteger(level) || level < 1) {
          addIssue(
            errors,
            `${requirementPath}.value`,
            "Progression level requirement must use a positive integer level."
          );
        }
      }

      if (
        ["PROGRESSION_REQUIRED_TIER", "PROGRESSION_FORBIDDEN_TIER"].includes(type)
      ) {
        const rawTiers =
          requirement.value ??
          requirement.expectedValue ??
          [];
        const tierIds = Array.isArray(rawTiers)
          ? rawTiers.map(normalizeIdentifier).filter(Boolean)
          : normalizeString(rawTiers)
              .split(",")
              .map(normalizeIdentifier)
              .filter(Boolean);

        if (!tierIds.length) {
          addIssue(
            errors,
            `${requirementPath}.value`,
            "Progression tier requirement must include at least one tier ID."
          );
        }
      }

      if (
        type === "PROGRESSION_AT_MAXIMUM_LEVEL" &&
        typeof requirement.value !== "boolean"
      ) {
        addIssue(
          errors,
          `${requirementPath}.value`,
          "Maximum-level progression requirement must use a boolean value."
        );
      }
    }
  });

  validateResolution(
    command.resolution,
    `${path}.resolution`,
    errors,
    warnings,
    argumentTypes
  );

  const outcomes = asObject(command.outcomes);

  [...OUTCOMES].forEach((outcome) => {
    const branch = outcomes[outcome];

    if (branch === undefined || branch === null) return;

    const branchPath = `${path}.outcomes.${outcome}`;

    if (!validatePlainObject(branch, branchPath, errors)) return;

    const effectMode = normalizeUpper(
      branch.effectMode ||
        branch.effect_mode ||
        branch.mode
    );

    if (!EFFECT_MODES.has(effectMode)) {
      addIssue(
        errors,
        `${branchPath}.effectMode`,
        `Unsupported outcome effect mode "${effectMode || "(missing)"}".`
      );
    }

    validateEffects(
      branch.effects,
      `${branchPath}.effects`,
      errors,
      argumentTypes
    );
  });

  const legacyAction = validateDomainAction(
    command.domainAction ||
      command.domain_action || {
        enabled: false,
        type: "NONE",
      },
    `${path}.domainAction`,
    errors,
    argumentTypes
  );

  validateComposition(
    command.composition ||
      command.commandComposition ||
      command.executionComposition,
    `${path}.composition`,
    errors,
    warnings,
    argumentTypes,
    legacyAction
  );
}

function canonicalizeStringArray(value) {
  return [
    ...new Set(
      asArray(value)
        .map((entry) => normalizeString(entry))
        .filter(Boolean)
    ),
  ];
}

function canonicalizeEffect(effect, index) {
  const source = asObject(effect);
  const type = normalizeUpper(source.type);

  return {
    ...source,
    id: normalizeIdentifier(
      source.id || source.key,
      `effect_${index + 1}`
    ),
    type,
    targetBinding: {
      ...asObject(source.targetBinding),
      mode: normalizeUpper(
        source.targetBinding?.mode ||
          source.targetBindingMode ||
          "FIXED"
      ),
      argumentName:
        normalizeUpper(
          source.targetBinding?.mode ||
            source.targetBindingMode
        ) === "ARGUMENT"
          ? normalizeIdentifier(
              source.targetBinding?.argumentName ||
                source.targetArgumentName
            )
          : "",
    },
    valueBinding: normalizeMechanicsEffectValueBindingBuilder(
      source.valueBinding || {
        mode: source.valueBindingMode || source.value_binding_mode,
        argumentName: source.valueArgumentName || source.value_argument_name,
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
              source.profile ||
              { rankValueId: source.targetId || "character_level" }
          )
        : null,
  };
}

function canonicalizeCondition(condition, index) {
  const source = asObject(condition);

  return {
    ...source,
    id: normalizeIdentifier(
      source.id || source.key,
      `condition_${index + 1}`
    ),
    bucket: normalizeUpper(
      source.bucket ||
        source.mechanicsBucket ||
        source.stateType
    ),
    mechanicsId: normalizeIdentifier(
      source.mechanicsId ||
        source.mechanics_id ||
        source.targetId ||
        source.trackerId
    ),
    scopeMode: normalizeUpper(
      source.scopeMode ||
        source.scope_mode ||
        source.scope ||
        "COMMAND_SOURCE"
    ),
    argumentName:
      normalizeUpper(
        source.scopeMode ||
          source.scope_mode ||
          source.scope
      ) === "TARGET_ARGUMENT"
        ? normalizeIdentifier(
            source.argumentName ||
              source.argument_name ||
              source.targetArgumentName
          )
        : "",
    scopeKey:
      normalizeUpper(
        source.scopeMode ||
          source.scope_mode ||
          source.scope
      ) === "EXPLICIT"
        ? normalizeString(
            source.scopeKey ||
              source.scope_key
          )
        : "",
    field: normalizeString(source.field) || "value",
    operator: normalizeUpper(
      source.operator ||
        source.comparison ||
        source.op
    ),
    enabled: normalizeBoolean(source.enabled, true),
  };
}

function canonicalizeMechanicsStep(step, index) {
  const source = asObject(step);
  const phase = normalizeUpper(
    source.phase ||
      source.applicationPhase ||
      "OUTCOME"
  );

  return {
    ...source,
    id: normalizeIdentifier(
      source.id || source.key,
      `mechanics_step_${index + 1}`
    ),
    label:
      normalizeString(
        source.label ||
          source.title ||
          source.name
      ) || `Mechanics Step ${index + 1}`,
    enabled: normalizeBoolean(source.enabled, true),
    phase,
    failurePolicy: normalizeUpper(
      source.failurePolicy ||
        source.failure_policy ||
        source.onFailure ||
        "CONTINUE"
    ),
    dependsOnStepIds: [
      ...new Set(
        asArray(
          source.dependsOnStepIds ||
            source.depends_on_step_ids ||
            source.dependencies
        )
          .map(normalizeIdentifier)
          .filter(Boolean)
      ),
    ],
    conditionMode: normalizeUpper(
      source.conditionMode ||
        source.condition_mode ||
        "ALL"
    ),
    conditions: asArray(source.conditions).map(
      canonicalizeCondition
    ),
    applyOnOutcomes:
      phase === "OUTCOME"
        ? canonicalizeStringArray(
            source.applyOnOutcomes ||
              source.apply_on_outcomes
          ).map(normalizeUpper)
        : [],
    effects: asArray(source.effects).map(
      canonicalizeEffect
    ),
  };
}

function canonicalizeDomainAction(action = {}) {
  const source = asObject(action);
  const type = normalizeUpper(
    source.type ||
      source.actionType ||
      source.action_type ||
      "NONE"
  );
  const enabled =
    type !== "NONE" &&
    normalizeBoolean(source.enabled, true);

  return {
    ...source,
    version:
      normalizeString(source.version) ||
      "mechanics_command_domain_action_v1",
    enabled,
    type: enabled ? type : "NONE",
    applyOnOutcomes: enabled
      ? canonicalizeStringArray(
          source.applyOnOutcomes ||
            source.apply_on_outcomes ||
            source.outcomes
        ).map(normalizeUpper)
      : [],
  };
}

function canonicalizeDomainStep(step, index) {
  const source = asObject(step);

  return {
    ...source,
    id: normalizeIdentifier(
      source.id || source.key,
      `domain_step_${index + 1}`
    ),
    label:
      normalizeString(
        source.label ||
          source.title ||
          source.name
      ) || `Domain Step ${index + 1}`,
    enabled: normalizeBoolean(source.enabled, true),
    failurePolicy: normalizeUpper(
      source.failurePolicy ||
        source.failure_policy ||
        source.onFailure ||
        "CONTINUE"
    ),
    dependsOnStepIds: [
      ...new Set(
        asArray(
          source.dependsOnStepIds ||
            source.depends_on_step_ids ||
            source.dependencies
        )
          .map(normalizeIdentifier)
          .filter(Boolean)
      ),
    ],
    action: canonicalizeDomainAction(
      source.action ||
        source.domainAction ||
        source.domain_action
    ),
  };
}

function canonicalizeComposition(value = {}) {
  const source = asObject(value);
  const mechanicsSteps = asArray(
    source.mechanicsSteps ||
      source.mechanics_steps ||
      source.steps
  );
  const domainSteps = asArray(
    source.domainSteps ||
      source.domain_steps ||
      source.actions
  );

  return {
    ...source,
    version: MECHANICS_COMPOSITION_VERSION,
    mechanicsSteps: mechanicsSteps.map(
      canonicalizeMechanicsStep
    ),
    domainSteps: domainSteps
      .slice(0, 3)
      .map(canonicalizeDomainStep),
  };
}

function canonicalizeCommand(command, index) {
  const source = asObject(command);
  const invocation = asObject(source.invocation);
  const compositionSource =
    source.composition ||
    source.commandComposition ||
    source.executionComposition;

  return {
    ...source,
    id:
      normalizeIdentifier(
        source.id || source.key
      ) || `command_${index + 1}`,
    label:
      normalizeString(source.label) ||
      normalizeString(source.id) ||
      `Command ${index + 1}`,
    commandContractVersion:
      normalizeString(
        source.commandContractVersion
      ) || "mechanics_command_contract_v1",
    invocation: {
      ...invocation,
      version:
        normalizeString(invocation.version) ||
        "mechanics_command_invocation_v1",
      command: normalizeString(
        invocation.command
      )
        .replace(/^[/#!]+/, "")
        .toLowerCase(),
      prefixes: canonicalizeStringArray(
        invocation.prefixes
      ),
      aliases: canonicalizeStringArray(
        invocation.aliases
      ),
      arguments: asArray(invocation.arguments).map(
        (argument, argumentIndex) => ({
          ...asObject(argument),
          name: normalizeIdentifier(
            argument?.name ||
              argument?.id,
            `argument_${argumentIndex + 1}`
          ),
          type: normalizeUpper(argument?.type),
        })
      ),
    },
    attemptEffects: asArray(
      source.attemptEffects ||
        source.attempt_effects
    ).map(canonicalizeEffect),
    effects: asArray(source.effects).map(
      canonicalizeEffect
    ),
    resolution:
      normalizeMechanicsCommandResolutionBuilder(
        source.resolution
      ),
    domainAction: canonicalizeDomainAction(
      source.domainAction ||
        source.domain_action
    ),
    presentation: {
      ...asObject(source.presentation),
      ...(Object.keys(
        asObject(
          source.presentation?.stateReadout ||
            source.presentation?.state_readout
        )
      ).length
        ? {
            stateReadout:
              normalizeMechanicsCommandStateReadoutBuilder(
                source.presentation?.stateReadout ||
                  source.presentation?.state_readout
              ),
          }
        : {}),
    },
    ...(compositionSource
      ? {
          composition:
            canonicalizeComposition(
              compositionSource
            ),
        }
      : {}),
  };
}

export function canonicalizeMechanicsModuleData(
  value = {}
) {
  const source = asObject(value);
  const instanceData = asObject(
    source.instanceData
  );
  const moduleDefinitionId =
    normalizeString(
      source.moduleDefinitionId ||
        source.moduleId
    ) || MECHANICS_MODULE_ID;

  return {
    ...source,
    moduleDefinitionId,
    moduleId: moduleDefinitionId,
    priority: normalizeNumber(source.priority, 65),
    tags: canonicalizeStringArray(source.tags),
    contractVersion: MECHANICS_INSTANCE_DATA_VERSION,
    instanceData: {
      ...instanceData,
      contractVersion: MECHANICS_INSTANCE_DATA_VERSION,
      trackers: asArray(
        instanceData.trackers
      ).map((tracker) => ({
        ...asObject(tracker),
      })),
      commands: asArray(
        instanceData.commands
      ).map(canonicalizeCommand),
      guards: normalizeMechanicsGuards(
        instanceData.guards ??
          instanceData.guard_rules ??
          instanceData.guardRules
      ),
      statusBlocks: normalizeMechanicsStatusBlocks(
        instanceData.statusBlocks ?? instanceData.status_blocks
      ),
      defaults: normalizeMechanicsDefaults(instanceData.defaults),
    },
  };
}

export function validateMechanicsModuleData(
  value = {}
) {
  const errors = [];
  const warnings = [];

  if (!validatePlainObject(value, "$", errors)) {
    return {
      version:
        MECHANICS_JSON_EDITOR_VALIDATION_VERSION,
      valid: false,
      errors,
      warnings,
      data: null,
    };
  }

  if (
    value.priority !== undefined &&
    !Number.isFinite(Number(value.priority))
  ) {
    addIssue(
      errors,
      "$.priority",
      "Priority must be a finite number."
    );
  }

  if (
    value.tags !== undefined &&
    !Array.isArray(value.tags)
  ) {
    addIssue(
      errors,
      "$.tags",
      "Tags must be an array of strings."
    );
  } else {
    asArray(value.tags).forEach((tag, index) => {
      if (typeof tag !== "string") {
        addIssue(
          errors,
          `$.tags[${index}]`,
          "Each tag must be a string."
        );
      }
    });
  }

  const instanceData = value.instanceData;

  if (
    !validatePlainObject(
      instanceData,
      "$.instanceData",
      errors
    )
  ) {
    return {
      version:
        MECHANICS_JSON_EDITOR_VALIDATION_VERSION,
      valid: false,
      errors,
      warnings,
      data: null,
    };
  }

  const collections = [
    ["trackers", instanceData.trackers],
    ["commands", instanceData.commands],
    ["guards", instanceData.guards],
    ["statusBlocks", instanceData.statusBlocks],
  ];

  collections.forEach(([key, collection]) => {
    if (
      collection !== undefined &&
      !Array.isArray(collection)
    ) {
      addIssue(
        errors,
        `$.instanceData.${key}`,
        `${key} must be an array.`
      );
    }
  });

  const trackers = asArray(
    instanceData.trackers
  );
  validateUniqueIds(
    trackers,
    "$.instanceData.trackers",
    errors,
    "Tracker"
  );

  trackers.forEach((tracker, index) => {
    const trackerPath = `$.instanceData.trackers[${index}]`;

    if (!validatePlainObject(tracker, trackerPath, errors)) return;

    const min = Number(tracker.min);
    const max = Number(tracker.max);
    const initial = Number(tracker.initial);

    if (!Number.isFinite(min)) {
      addIssue(
        errors,
        `${trackerPath}.min`,
        "Tracker minimum must be finite."
      );
    }

    if (!Number.isFinite(max)) {
      addIssue(
        errors,
        `${trackerPath}.max`,
        "Tracker maximum must be finite."
      );
    }

    if (
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      min > max
    ) {
      addIssue(
        errors,
        trackerPath,
        "Tracker minimum cannot exceed its maximum."
      );
    }

    if (
      !Number.isFinite(initial) ||
      (Number.isFinite(min) && initial < min) ||
      (Number.isFinite(max) && initial > max)
    ) {
      addIssue(
        errors,
        `${trackerPath}.initial`,
        "Tracker initial value must be finite and inside its min/max range."
      );
    }

    validateUniqueIds(
      asArray(tracker.phases),
      `${trackerPath}.phases`,
      errors,
      "Phase"
    );
    validateUniqueIds(
      asArray(
        tracker.mutationHints ||
          tracker.mutation_hints
      ),
      `${trackerPath}.mutationHints`,
      errors,
      "Mutation hint"
    );
  });

  const commands = asArray(
    instanceData.commands
  );
  validateUniqueIds(
    commands,
    "$.instanceData.commands",
    errors,
    "Command"
  );

  commands.forEach((command, index) =>
    validateCommand(
      command,
      `$.instanceData.commands[${index}]`,
      errors,
      warnings
    )
  );

  const defaults = asObject(
    instanceData.defaults
  );

  ["flags", "counters", "stages"].forEach(
    (bucket) => {
      const entries = defaults[bucket];

      if (
        entries !== undefined &&
        !Array.isArray(entries)
      ) {
        addIssue(
          errors,
          `$.instanceData.defaults.${bucket}`,
          `${bucket} defaults must be an array.`
        );
        return;
      }

      validateUniqueIds(
        asArray(entries),
        `$.instanceData.defaults.${bucket}`,
        errors,
        `${bucket.slice(0, -1)} default`
      );
    }
  );

  const statusBlocks = asArray(
    instanceData.statusBlocks
  );
  validateUniqueIds(
    statusBlocks,
    "$.instanceData.statusBlocks",
    errors,
    "Status block"
  );

  statusBlocks.forEach((block, index) => {
    const blockPath = `$.instanceData.statusBlocks[${index}]`;

    if (!validatePlainObject(block, blockPath, errors)) return;

    if (
      block.lines !== undefined &&
      !Array.isArray(block.lines)
    ) {
      addIssue(
        errors,
        `${blockPath}.lines`,
        "Status block lines must be an array."
      );
    }
  });

  const guards = asArray(
    instanceData.guards
  );
  validateUniqueIds(
    guards,
    "$.instanceData.guards",
    errors,
    "Guard"
  );

  guards.forEach((guard, guardIndex) => {
    const guardPath = `$.instanceData.guards[${guardIndex}]`;

    if (!validatePlainObject(guard, guardPath, errors)) return;

    const enforcement = normalizeUpper(
      guard.enforcement
    );
    const mode = normalizeUpper(guard.mode);

    if (
      !["HARD_LOCK", "SOFT_LOCK", "GUIDANCE"].includes(
        enforcement
      )
    ) {
      addIssue(
        errors,
        `${guardPath}.enforcement`,
        `Unsupported guard enforcement "${enforcement || "(missing)"}".`
      );
    }

    if (!["ALL", "ANY"].includes(mode)) {
      addIssue(
        errors,
        `${guardPath}.mode`,
        `Unsupported guard mode "${mode || "(missing)"}".`
      );
    }

    validateUniqueIds(
      asArray(guard.conditions).map(
        (condition) => ({
          id:
            condition?.id ||
            condition?.targetId,
        })
      ),
      `${guardPath}.conditions`,
      errors,
      "Guard condition"
    );
  });

  const valid = errors.length === 0;
  const data = valid
    ? canonicalizeMechanicsModuleData(value)
    : null;

  return {
    version:
      MECHANICS_JSON_EDITOR_VALIDATION_VERSION,
    valid,
    errors,
    warnings,
    data,
  };
}

export function validateMechanicsJsonText(
  text = ""
) {
  let parsed;

  try {
    parsed = JSON.parse(String(text || ""));
  } catch (error) {
    return {
      version:
        MECHANICS_JSON_EDITOR_VALIDATION_VERSION,
      valid: false,
      errors: [
        {
          path: "$",
          message:
            error?.message ||
            "The text is not valid JSON.",
        },
      ],
      warnings: [],
      data: null,
      formattedText: String(text || ""),
    };
  }

  const result =
    validateMechanicsModuleData(parsed);

  return {
    ...result,
    formattedText: result.valid
      ? JSON.stringify(result.data, null, 2)
      : JSON.stringify(parsed, null, 2),
  };
}

export function formatMechanicsJsonData(
  data = {}
) {
  return JSON.stringify(
    canonicalizeMechanicsModuleData(data),
    null,
    2
  );
}

export function formatMechanicsJsonText(
  text = ""
) {
  try {
    const parsed = JSON.parse(String(text || ""));

    return {
      valid: true,
      text: JSON.stringify(parsed, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      text: String(text || ""),
      error: {
        path: "$",
        message:
          error?.message ||
          "The text is not valid JSON.",
      },
    };
  }
}
