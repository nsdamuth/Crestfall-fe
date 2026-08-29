import {
  STATS_POOLS_CAPABILITY_MODE_OPTIONS,
  STATS_POOLS_CONDITION_DEFINITION_VERSION,
  STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS,
  STATS_POOLS_DURATION_POLICY_OPTIONS,
  STATS_POOLS_FORMULA_OPERAND_TYPE_OPTIONS,
  STATS_POOLS_FORMULA_OPERATION_OPTIONS,
  STATS_POOLS_FORMULA_REFERENCE_FIELD_OPTIONS,
  STATS_POOLS_FORMULA_REFERENCE_TYPE_OPTIONS,
  STATS_POOLS_FORMULA_ROUNDING_OPTIONS,
  STATS_POOLS_FORMULA_VERSION,
  STATS_POOLS_MODIFIER_DEFINITION_VERSION,
  STATS_POOLS_MODIFIER_OPERATION_OPTIONS,
  STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS,
  STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS,
  STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS,
  STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS,
  STATS_POOLS_POOL_DEFINITION_VERSION,
  STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS,
  STATS_POOLS_PROFILE_CONTRACT_VERSION,
  STATS_POOLS_PROFILE_MODE_OPTIONS,
  STATS_POOLS_SCALE_MODE_OPTIONS,
  STATS_POOLS_STACK_POLICY_OPTIONS,
  STATS_POOLS_STAT_DEFINITION_VERSION,
  STATS_POOLS_VALUE_TYPE_OPTIONS,
} from "../stats-pools-editor/StatsPoolsEditor.contract.js";
import {
  normalizeStatsPoolsEditorValue,
  validateStatsPoolsEditorValue,
} from "../stats-pools-editor/useStatsPoolsEditorViewModel.js";

export const STATS_POOLS_JSON_EDITOR_VALIDATION_VERSION =
  "stats_pools_json_editor_validation_v1";

const ALLOWED_TOP_LEVEL_FIELDS = new Set([
  "contractVersion",
  "title",
  "description",
  "enabled",
  "profileMode",
  "capabilityPolicy",
  "statDefinitions",
  "poolDefinitions",
  "modifierDefinitions",
  "conditionDefinitions",
  "metadata",
]);

const FORBIDDEN_RUNTIME_FIELDS = new Set([
  "profileid",
  "bindingid",
  "owner",
  "ownerid",
  "ownertype",
  "ownertitle",
  "namespacestrategy",
  "statenamespace",
  "statemode",
  "revision",
  "staterevision",
  "statvalues",
  "poolvalues",
  "activemodifiers",
  "activeconditions",
  "basevalue",
  "currentvalue",
  "instanceid",
  "modifierdefinitionid",
  "conditiondefinitionid",
  "sourcetype",
  "sourceid",
  "stacks",
  "remainingturns",
  "expiresatworldminute",
  "actorstate",
  "statspoolsstate",
]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeKey(value) {
  return String(value || "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function optionValues(options = []) {
  return options.map((entry) => entry.value);
}

function issue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

function dedupeIssues(values = []) {
  const seen = new Set();
  return values.filter((entry) => {
    const key = `${entry?.code || ""}:${entry?.path || ""}:${entry?.message || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectForbiddenRuntimeFields(value, path = "$", issues = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      collectForbiddenRuntimeFields(entry, `${path}[${index}]`, issues)
    );
    return issues;
  }

  if (!isObject(value)) return issues;

  Object.entries(value).forEach(([key, entry]) => {
    const nextPath = path === "$" ? key : `${path}.${key}`;
    if (FORBIDDEN_RUNTIME_FIELDS.has(normalizeKey(key))) {
      issues.push(
        issue(
          "STATS_POOLS_JSON_RUNTIME_FIELD_FORBIDDEN",
          nextPath,
          "Stats & Pools Profile assets store reusable definitions only. Actor-owned values, active effects, ownership, binding namespaces, and state revisions cannot be authored here."
        )
      );
      return;
    }
    collectForbiddenRuntimeFields(entry, nextPath, issues);
  });

  return issues;
}

function validateEnum(value, options, path, label, errors) {
  if (!optionValues(options).includes(String(value || "").toUpperCase())) {
    errors.push(
      issue(
        "STATS_POOLS_JSON_ENUM_UNSUPPORTED",
        path,
        `${label} must be one of: ${optionValues(options).join(", ")}.`
      )
    );
  }
}

function validateVersion(value, expected, path, label, errors) {
  if (value !== undefined && value !== expected) {
    errors.push(
      issue(
        "STATS_POOLS_JSON_DEFINITION_VERSION_UNSUPPORTED",
        path,
        `${label} must use ${expected}.`
      )
    );
  }
}

function validateFormula(formula, path, errors) {
  if (!isObject(formula)) {
    errors.push(
      issue("STATS_POOLS_JSON_FORMULA_OBJECT_REQUIRED", path, "Formula must be a JSON object.")
    );
    return;
  }

  validateVersion(
    formula.formulaVersion,
    STATS_POOLS_FORMULA_VERSION,
    `${path}.formulaVersion`,
    "Formula",
    errors
  );
  validateEnum(
    formula.rounding,
    STATS_POOLS_FORMULA_ROUNDING_OPTIONS,
    `${path}.rounding`,
    "Formula rounding",
    errors
  );

  if (!isObject(formula.root)) {
    errors.push(
      issue(
        "STATS_POOLS_JSON_FORMULA_ROOT_REQUIRED",
        `${path}.root`,
        "Formula root must be an operation object."
      )
    );
    return;
  }

  if (formula.root.nodeType !== undefined && formula.root.nodeType !== "OPERATION") {
    errors.push(
      issue(
        "STATS_POOLS_JSON_FORMULA_ROOT_TYPE_INVALID",
        `${path}.root.nodeType`,
        "The visual Stats & Pools editor requires an OPERATION formula root."
      )
    );
  }
  validateEnum(
    formula.root.operation,
    STATS_POOLS_FORMULA_OPERATION_OPTIONS,
    `${path}.root.operation`,
    "Formula operation",
    errors
  );
  if (!Array.isArray(formula.root.operands)) {
    errors.push(
      issue(
        "STATS_POOLS_JSON_FORMULA_OPERANDS_ARRAY_REQUIRED",
        `${path}.root.operands`,
        "Formula operands must be a JSON array."
      )
    );
    return;
  }

  formula.root.operands.forEach((operand, index) => {
    const operandPath = `${path}.root.operands[${index}]`;
    if (!isObject(operand)) {
      errors.push(
        issue(
          "STATS_POOLS_JSON_FORMULA_OPERAND_OBJECT_REQUIRED",
          operandPath,
          "Each formula operand must be a JSON object."
        )
      );
      return;
    }
    validateEnum(
      operand.nodeType,
      STATS_POOLS_FORMULA_OPERAND_TYPE_OPTIONS,
      `${operandPath}.nodeType`,
      "Formula operand type",
      errors
    );
    if (String(operand.nodeType || "").toUpperCase() === "REFERENCE") {
      validateEnum(
        operand.referenceType,
        STATS_POOLS_FORMULA_REFERENCE_TYPE_OPTIONS,
        `${operandPath}.referenceType`,
        "Formula reference type",
        errors
      );
      validateEnum(
        operand.field,
        STATS_POOLS_FORMULA_REFERENCE_FIELD_OPTIONS,
        `${operandPath}.field`,
        "Formula reference field",
        errors
      );
    } else if (!Number.isFinite(Number(operand.value))) {
      errors.push(
        issue(
          "STATS_POOLS_JSON_FORMULA_CONSTANT_INVALID",
          `${operandPath}.value`,
          "Constant operands require a finite numeric value."
        )
      );
    }
  });
}

function validateRawStatsPoolsShape(value) {
  const errors = [];
  const warnings = [];

  if (!isObject(value)) {
    errors.push(
      issue(
        "STATS_POOLS_JSON_OBJECT_REQUIRED",
        "$",
        "Expected one complete Stats & Pools Profile JSON object."
      )
    );
    return { errors, warnings };
  }

  Object.keys(value).forEach((key) => {
    if (!ALLOWED_TOP_LEVEL_FIELDS.has(key)) {
      warnings.push(
        issue(
          "STATS_POOLS_JSON_UNKNOWN_TOP_LEVEL_FIELD",
          key,
          `Unsupported top-level field "${key}" will not be retained when Crestfall normalizes the profile.`,
          "WARNING"
        )
      );
    }
  });

  if (!String(value.contractVersion || "").trim()) {
    warnings.push(
      issue(
        "STATS_POOLS_JSON_CONTRACT_VERSION_MISSING",
        "contractVersion",
        `Missing contractVersion. Crestfall will normalize it to ${STATS_POOLS_PROFILE_CONTRACT_VERSION}.`,
        "WARNING"
      )
    );
  } else if (value.contractVersion !== STATS_POOLS_PROFILE_CONTRACT_VERSION) {
    errors.push(
      issue(
        "STATS_POOLS_JSON_CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${STATS_POOLS_PROFILE_CONTRACT_VERSION}; received ${String(value.contractVersion)}.`
      )
    );
  }

  validateEnum(value.profileMode, STATS_POOLS_PROFILE_MODE_OPTIONS, "profileMode", "Profile mode", errors);

  if (!isObject(value.capabilityPolicy)) {
    errors.push(
      issue(
        "STATS_POOLS_JSON_CAPABILITY_POLICY_REQUIRED",
        "capabilityPolicy",
        "capabilityPolicy must be a JSON object."
      )
    );
  } else {
    validateEnum(value.capabilityPolicy.mode, STATS_POOLS_CAPABILITY_MODE_OPTIONS, "capabilityPolicy.mode", "Capability mode", errors);
    validateEnum(
      value.capabilityPolicy.numericResolutionPolicy,
      STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS,
      "capabilityPolicy.numericResolutionPolicy",
      "Numeric resolution policy",
      errors
    );
  }

  for (const field of [
    "statDefinitions",
    "poolDefinitions",
    "modifierDefinitions",
    "conditionDefinitions",
  ]) {
    if (!Array.isArray(value[field])) {
      errors.push(
        issue(
          "STATS_POOLS_JSON_DEFINITION_ARRAY_REQUIRED",
          field,
          `${field} must be a JSON array.`
        )
      );
    }
  }

  if (Array.isArray(value.statDefinitions)) {
    value.statDefinitions.forEach((definition, index) => {
      const path = `statDefinitions[${index}]`;
      if (!isObject(definition)) return;
      validateVersion(definition.definitionVersion, STATS_POOLS_STAT_DEFINITION_VERSION, `${path}.definitionVersion`, "Stat definition", errors);
      validateEnum(definition.valueType, STATS_POOLS_VALUE_TYPE_OPTIONS, `${path}.valueType`, "Stat value type", errors);
      if (!isObject(definition.scale)) {
        errors.push(issue("STATS_POOLS_JSON_STAT_SCALE_REQUIRED", `${path}.scale`, "Stat scale must be a JSON object."));
      } else {
        validateEnum(definition.scale.mode, STATS_POOLS_SCALE_MODE_OPTIONS, `${path}.scale.mode`, "Stat scale mode", errors);
      }
      if (definition.playerReadout !== undefined) {
        if (!isObject(definition.playerReadout)) {
          errors.push(issue("STATS_POOLS_JSON_PLAYER_READOUT_OBJECT_REQUIRED", `${path}.playerReadout`, "Stat playerReadout must be a JSON object."));
        } else {
          validateEnum(definition.playerReadout.visibility, STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS, `${path}.playerReadout.visibility`, "Player readout visibility", errors);
        }
      }
      if (!isObject(definition.derived)) {
        errors.push(issue("STATS_POOLS_JSON_STAT_DERIVED_REQUIRED", `${path}.derived`, "Stat derived settings must be a JSON object."));
      } else if (definition.derived.enabled === true) {
        validateFormula(definition.derived.formula, `${path}.derived.formula`, errors);
      }
    });
  }

  if (Array.isArray(value.poolDefinitions)) {
    value.poolDefinitions.forEach((definition, index) => {
      const path = `poolDefinitions[${index}]`;
      if (!isObject(definition)) return;
      validateVersion(definition.definitionVersion, STATS_POOLS_POOL_DEFINITION_VERSION, `${path}.definitionVersion`, "Pool definition", errors);
      validateEnum(definition.valueType, STATS_POOLS_VALUE_TYPE_OPTIONS, `${path}.valueType`, "Pool value type", errors);
      if (definition.playerReadout !== undefined) {
        if (!isObject(definition.playerReadout)) {
          errors.push(issue("STATS_POOLS_JSON_PLAYER_READOUT_OBJECT_REQUIRED", `${path}.playerReadout`, "Pool playerReadout must be a JSON object."));
        } else {
          validateEnum(definition.playerReadout.visibility, STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS, `${path}.playerReadout.visibility`, "Player readout visibility", errors);
        }
      }
      if (!isObject(definition.maximum)) {
        errors.push(issue("STATS_POOLS_JSON_POOL_MAXIMUM_REQUIRED", `${path}.maximum`, "Pool maximum must be a JSON object."));
      } else {
        validateEnum(definition.maximum.mode, STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS, `${path}.maximum.mode`, "Pool maximum mode", errors);
        if (String(definition.maximum.mode || "").toUpperCase() === "DERIVED") {
          validateFormula(definition.maximum.formula, `${path}.maximum.formula`, errors);
        }
      }
      if (!isObject(definition.defaultCurrent)) {
        errors.push(issue("STATS_POOLS_JSON_POOL_DEFAULT_REQUIRED", `${path}.defaultCurrent`, "Pool defaultCurrent must be a JSON object."));
      } else {
        validateEnum(definition.defaultCurrent.mode, STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS, `${path}.defaultCurrent.mode`, "Pool default-current mode", errors);
      }
    });
  }

  if (Array.isArray(value.modifierDefinitions)) {
    value.modifierDefinitions.forEach((definition, index) => {
      const path = `modifierDefinitions[${index}]`;
      if (!isObject(definition)) return;
      validateVersion(definition.definitionVersion, STATS_POOLS_MODIFIER_DEFINITION_VERSION, `${path}.definitionVersion`, "Modifier definition", errors);
      if (!isObject(definition.target)) {
        errors.push(issue("STATS_POOLS_JSON_MODIFIER_TARGET_REQUIRED", `${path}.target`, "Modifier target must be a JSON object."));
      } else {
        validateEnum(definition.target.targetType, STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS, `${path}.target.targetType`, "Modifier target type", errors);
      }
      validateEnum(definition.operation, STATS_POOLS_MODIFIER_OPERATION_OPTIONS, `${path}.operation`, "Modifier operation", errors);
      validateEnum(definition.stackPolicy, STATS_POOLS_STACK_POLICY_OPTIONS, `${path}.stackPolicy`, "Modifier stack policy", errors);
      validateEnum(definition.durationPolicy, STATS_POOLS_DURATION_POLICY_OPTIONS, `${path}.durationPolicy`, "Modifier duration policy", errors);
    });
  }

  if (Array.isArray(value.conditionDefinitions)) {
    value.conditionDefinitions.forEach((definition, index) => {
      const path = `conditionDefinitions[${index}]`;
      if (!isObject(definition)) return;
      validateVersion(definition.definitionVersion, STATS_POOLS_CONDITION_DEFINITION_VERSION, `${path}.definitionVersion`, "Condition definition", errors);
      validateEnum(definition.stackPolicy, STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS, `${path}.stackPolicy`, "Condition stack policy", errors);
      if (!Array.isArray(definition.modifierDefinitionIds) && typeof definition.modifierDefinitionIds !== "string") {
        errors.push(issue("STATS_POOLS_JSON_CONDITION_MODIFIERS_INVALID", `${path}.modifierDefinitionIds`, "modifierDefinitionIds must be an array of IDs or a comma-separated string."));
      }
    });
  }

  collectForbiddenRuntimeFields(value, "$", errors);
  return { errors, warnings };
}

export function formatStatsPoolsJsonData(value = {}) {
  return JSON.stringify(normalizeStatsPoolsEditorValue(value), null, 2);
}

export function formatStatsPoolsJsonText(jsonText = "") {
  try {
    const parsed = JSON.parse(String(jsonText || ""));
    return { valid: true, text: JSON.stringify(parsed, null, 2), error: null };
  } catch (error) {
    return {
      valid: false,
      text: String(jsonText || ""),
      error: issue(
        "STATS_POOLS_JSON_SYNTAX_INVALID",
        "$",
        error?.message || "The JSON syntax is invalid."
      ),
    };
  }
}

export function validateStatsPoolsJsonText(jsonText = "") {
  let parsed;
  try {
    parsed = JSON.parse(String(jsonText || ""));
  } catch (error) {
    const syntaxError = issue(
      "STATS_POOLS_JSON_SYNTAX_INVALID",
      "$",
      error?.message || "The JSON syntax is invalid."
    );
    return {
      valid: false,
      data: null,
      errors: [syntaxError],
      warnings: [],
      formattedText: String(jsonText || ""),
    };
  }

  const rawValidation = validateRawStatsPoolsShape(parsed);
  const contractValidation = isObject(parsed)
    ? validateStatsPoolsEditorValue(parsed)
    : { valid: false, normalized: null, errors: [], warnings: [] };
  const errors = dedupeIssues([
    ...rawValidation.errors,
    ...(contractValidation.errors || []),
  ]);
  const warnings = dedupeIssues([
    ...rawValidation.warnings,
    ...(contractValidation.warnings || []),
  ]);
  const normalized = contractValidation.normalized || null;

  return {
    valid: errors.length === 0 && Boolean(normalized),
    data: errors.length === 0 ? normalized : null,
    errors,
    warnings,
    formattedText: normalized
      ? JSON.stringify(normalized, null, 2)
      : JSON.stringify(parsed, null, 2),
  };
}
