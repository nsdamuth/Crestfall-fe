import {
  PROGRESSION_CURVE_DEFINITION_VERSION,
  PROGRESSION_CURVE_MODES,
  PROGRESSION_CURVE_TYPES,
  PROGRESSION_MAXIMUM_EXPERIENCE_POLICIES,
  PROGRESSION_PROFILE_CONTRACT_VERSION,
  PROGRESSION_REQUIREMENT_MODES,
  PROGRESSION_ROUNDING_POLICIES,
  PROGRESSION_TIER_DEFINITION_VERSION,
  normalizeProgressionProfileEditorValue,
  validateProgressionProfileEditorValue,
} from "../progression-profile-editor/ProgressionProfileEditor.contract.js";

export const PROGRESSION_JSON_EDITOR_VALIDATION_VERSION =
  "progression_json_editor_validation_v1";

const ALLOWED_TOP_LEVEL_FIELDS = new Set([
  "contractVersion",
  "title",
  "description",
  "enabled",
  "curve",
  "tierDefinitions",
  "tags",
  "metadata",
]);

const FORBIDDEN_RUNTIME_FIELDS = new Set([
  "currentexperience",
  "currentxp",
  "currentlevel",
  "unspentpoints",
  "staterevision",
  "actorstate",
  "progressionstate",
  "namespace",
  "ownerid",
  "ownertype",
  "bindingid",
]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeKey(value) {
  return String(value || "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
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
    const normalizedKey = normalizeKey(key);

    if (FORBIDDEN_RUNTIME_FIELDS.has(normalizedKey)) {
      issues.push(
        issue(
          "PROGRESSION_JSON_RUNTIME_FIELD_FORBIDDEN",
          nextPath,
          "Progression Profile assets store reusable definitions only. Actor-owned XP, level, points, namespaces, ownership, bindings, and state revisions cannot be authored here."
        )
      );
      return;
    }

    collectForbiddenRuntimeFields(entry, nextPath, issues);
  });

  return issues;
}

function validateRawProgressionShape(value) {
  const errors = [];
  const warnings = [];

  if (!isObject(value)) {
    errors.push(
      issue(
        "PROGRESSION_JSON_OBJECT_REQUIRED",
        "$",
        "Expected one complete Progression Profile JSON object."
      )
    );
    return { errors, warnings };
  }

  Object.keys(value).forEach((key) => {
    if (!ALLOWED_TOP_LEVEL_FIELDS.has(key)) {
      warnings.push(
        issue(
          "PROGRESSION_JSON_UNKNOWN_TOP_LEVEL_FIELD",
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
        "PROGRESSION_JSON_CONTRACT_VERSION_MISSING",
        "contractVersion",
        `Missing contractVersion. Crestfall will normalize it to ${PROGRESSION_PROFILE_CONTRACT_VERSION}.`,
        "WARNING"
      )
    );
  } else if (value.contractVersion !== PROGRESSION_PROFILE_CONTRACT_VERSION) {
    errors.push(
      issue(
        "PROGRESSION_JSON_CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${PROGRESSION_PROFILE_CONTRACT_VERSION}; received ${String(value.contractVersion)}.`
      )
    );
  }

  if (!isObject(value.curve)) {
    errors.push(
      issue(
        "PROGRESSION_JSON_CURVE_REQUIRED",
        "curve",
        "Progression Profile JSON requires one curve object."
      )
    );
  } else {
    const curve = value.curve;
    const generation = curve.generation;

    if (
      curve.definitionVersion !== undefined &&
      curve.definitionVersion !== PROGRESSION_CURVE_DEFINITION_VERSION
    ) {
      errors.push(
        issue(
          "PROGRESSION_JSON_CURVE_VERSION_UNSUPPORTED",
          "curve.definitionVersion",
          `Expected ${PROGRESSION_CURVE_DEFINITION_VERSION}.`
        )
      );
    }

    if (!PROGRESSION_CURVE_MODES.includes(String(curve.mode || "").toUpperCase())) {
      errors.push(
        issue(
          "PROGRESSION_JSON_CURVE_MODE_UNSUPPORTED",
          "curve.mode",
          `Supported curve modes are: ${PROGRESSION_CURVE_MODES.join(", ")}.`
        )
      );
    }

    if (curve.capPolicy !== undefined && curve.capPolicy !== "CLAMP_TO_MAXIMUM") {
      errors.push(
        issue(
          "PROGRESSION_JSON_CAP_POLICY_UNSUPPORTED",
          "curve.capPolicy",
          "Progression Profiles currently require CLAMP_TO_MAXIMUM."
        )
      );
    }

    if (
      curve.maximumExperiencePolicy !== undefined &&
      !PROGRESSION_MAXIMUM_EXPERIENCE_POLICIES.includes(
        String(curve.maximumExperiencePolicy || "").toUpperCase()
      )
    ) {
      errors.push(
        issue(
          "PROGRESSION_JSON_MAXIMUM_EXPERIENCE_POLICY_UNSUPPORTED",
          "curve.maximumExperiencePolicy",
          `Supported maximum-experience policies are: ${PROGRESSION_MAXIMUM_EXPERIENCE_POLICIES.join(", ")}.`
        )
      );
    }

    if (!Number.isFinite(Number(curve.minimumLevel))) {
      errors.push(
        issue(
          "PROGRESSION_JSON_MINIMUM_LEVEL_INVALID",
          "curve.minimumLevel",
          "minimumLevel must be a finite number."
        )
      );
    }
    if (!Number.isFinite(Number(curve.maximumLevel))) {
      errors.push(
        issue(
          "PROGRESSION_JSON_MAXIMUM_LEVEL_INVALID",
          "curve.maximumLevel",
          "maximumLevel must be a finite number."
        )
      );
    }
    if (
      Number.isFinite(Number(curve.minimumLevel)) &&
      Number.isFinite(Number(curve.maximumLevel)) &&
      Number(curve.maximumLevel) < Number(curve.minimumLevel)
    ) {
      errors.push(
        issue(
          "PROGRESSION_JSON_LEVEL_RANGE_INVALID",
          "curve.maximumLevel",
          "maximumLevel must be at least minimumLevel."
        )
      );
    }

    if (!isObject(generation)) {
      errors.push(
        issue(
          "PROGRESSION_JSON_GENERATION_REQUIRED",
          "curve.generation",
          "curve.generation must be a JSON object."
        )
      );
    } else {
      if (
        !PROGRESSION_CURVE_TYPES.includes(
          String(generation.curveType || "").toUpperCase()
        )
      ) {
        errors.push(
          issue(
            "PROGRESSION_JSON_CURVE_TYPE_UNSUPPORTED",
            "curve.generation.curveType",
            `Supported curve types are: ${PROGRESSION_CURVE_TYPES.join(", ")}.`
          )
        );
      }
      if (
        !PROGRESSION_REQUIREMENT_MODES.includes(
          String(generation.requirementMode || "").toUpperCase()
        )
      ) {
        errors.push(
          issue(
            "PROGRESSION_JSON_REQUIREMENT_MODE_UNSUPPORTED",
            "curve.generation.requirementMode",
            `Supported requirement modes are: ${PROGRESSION_REQUIREMENT_MODES.join(", ")}.`
          )
        );
      }
      if (
        !PROGRESSION_ROUNDING_POLICIES.includes(
          String(generation.rounding || "").toUpperCase()
        )
      ) {
        errors.push(
          issue(
            "PROGRESSION_JSON_ROUNDING_UNSUPPORTED",
            "curve.generation.rounding",
            `Supported rounding policies are: ${PROGRESSION_ROUNDING_POLICIES.join(", ")}.`
          )
        );
      }
    }

    if (curve.thresholds !== undefined && !Array.isArray(curve.thresholds)) {
      errors.push(
        issue(
          "PROGRESSION_JSON_THRESHOLDS_ARRAY_REQUIRED",
          "curve.thresholds",
          "curve.thresholds must be a JSON array."
        )
      );
    }
    if (curve.overrides !== undefined && !Array.isArray(curve.overrides)) {
      errors.push(
        issue(
          "PROGRESSION_JSON_OVERRIDES_ARRAY_REQUIRED",
          "curve.overrides",
          "curve.overrides must be a JSON array."
        )
      );
    }

    const mode = String(curve.mode || "").toUpperCase();
    if (
      mode !== "EXPLICIT_TABLE" &&
      Array.isArray(curve.thresholds) &&
      curve.thresholds.length
    ) {
      warnings.push(
        issue(
          "PROGRESSION_JSON_INACTIVE_THRESHOLDS_REMOVED",
          "curve.thresholds",
          "Stored threshold rows are inactive outside EXPLICIT_TABLE and will be removed during normalization.",
          "WARNING"
        )
      );
    }
    if (
      mode !== "GENERATED_CURVE_WITH_OVERRIDES" &&
      Array.isArray(curve.overrides) &&
      curve.overrides.length
    ) {
      warnings.push(
        issue(
          "PROGRESSION_JSON_INACTIVE_OVERRIDES_REMOVED",
          "curve.overrides",
          "Overrides are active only in GENERATED_CURVE_WITH_OVERRIDES and will otherwise be removed during normalization.",
          "WARNING"
        )
      );
    }
  }

  if (
    value.tierDefinitions !== undefined &&
    !Array.isArray(value.tierDefinitions)
  ) {
    errors.push(
      issue(
        "PROGRESSION_JSON_TIERS_ARRAY_REQUIRED",
        "tierDefinitions",
        "tierDefinitions must be a JSON array."
      )
    );
  }

  if (Array.isArray(value.tierDefinitions)) {
    value.tierDefinitions.forEach((tier, index) => {
      if (!isObject(tier)) return;
      if (
        tier.definitionVersion !== undefined &&
        tier.definitionVersion !== PROGRESSION_TIER_DEFINITION_VERSION
      ) {
        errors.push(
          issue(
            "PROGRESSION_JSON_TIER_VERSION_UNSUPPORTED",
            `tierDefinitions[${index}].definitionVersion`,
            `Expected ${PROGRESSION_TIER_DEFINITION_VERSION}.`
          )
        );
      }
    });
  }

  if (
    value.tags !== undefined &&
    !Array.isArray(value.tags) &&
    typeof value.tags !== "string"
  ) {
    errors.push(
      issue(
        "PROGRESSION_JSON_TAGS_INVALID",
        "tags",
        "tags must be a JSON array of strings or a comma-separated string."
      )
    );
  }

  collectForbiddenRuntimeFields(value, "$", errors);

  return { errors, warnings };
}

export function formatProgressionJsonData(value = {}) {
  return JSON.stringify(normalizeProgressionProfileEditorValue(value), null, 2);
}

export function formatProgressionJsonText(jsonText = "") {
  try {
    const parsed = JSON.parse(String(jsonText || ""));
    return {
      valid: true,
      text: JSON.stringify(parsed, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      text: String(jsonText || ""),
      error: issue(
        "PROGRESSION_JSON_SYNTAX_INVALID",
        "$",
        error?.message || "The JSON syntax is invalid."
      ),
    };
  }
}

export function validateProgressionJsonText(jsonText = "") {
  let parsed;

  try {
    parsed = JSON.parse(String(jsonText || ""));
  } catch (error) {
    const syntaxError = issue(
      "PROGRESSION_JSON_SYNTAX_INVALID",
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

  const rawValidation = validateRawProgressionShape(parsed);
  const contractValidation = isObject(parsed)
    ? validateProgressionProfileEditorValue(parsed)
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
