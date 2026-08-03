import {
  RULES_CODEX_ACTIVATION_MODES,
  RULES_CODEX_ACTIVATION_SIGNAL_FIELDS,
  RULES_CODEX_AUTHORITY,
  RULES_CODEX_CONTRACT_VERSION,
  RULES_CODEX_EDITOR_LIMITS,
  RULES_CODEX_MATCH_MODES,
} from "../rules-codex-editor/RulesCodexEditor.contract.js";
import {
  normalizeRulesCodexEditorValue,
  validateRulesCodexEditorValue,
} from "../rules-codex-editor/useRulesCodexEditorViewModel.js";

export const RULES_CODEX_JSON_EDITOR_VALIDATION_VERSION =
  "rules_codex_json_editor_validation_v1";

const ALLOWED_TOP_LEVEL_FIELDS = new Set([
  "contractVersion",
  "summary",
  "enabled",
  "selectionPolicy",
  "sections",
  "metadata",
]);

const ALLOWED_SELECTION_POLICY_FIELDS = new Set([
  "maxSelectedSections",
  "maxContextCharacters",
]);

const ALLOWED_SECTION_FIELDS = new Set([
  "id",
  "title",
  "body",
  "authority",
  "enabled",
  "priority",
  "order",
  "activation",
  "metadata",
]);

const ALLOWED_ACTIVATION_FIELDS = new Set([
  "mode",
  "matchMode",
  ...RULES_CODEX_ACTIVATION_SIGNAL_FIELDS.map((field) => field.key),
]);

const FORBIDDEN_AUTHORITY_FIELDS = new Set([
  "systemprompt",
  "developerprompt",
  "hiddenprompt",
  "providerinstruction",
  "providerinstructions",
  "promptoverride",
  "safetyoverride",
  "guardoverride",
  "guardenforcement",
  "deterministicoverride",
  "registryoverride",
  "registrymutation",
  "playertakeover",
  "playercontrol",
  "mutationallowed",
  "statemutationallowed",
  "statepatch",
  "mutation",
  "mutations",
  "effects",
  "attempteffects",
  "outcomeeffects",
  "domainaction",
  "commandresult",
  "executecode",
  "script",
]);

const FORBIDDEN_RUNTIME_FIELDS = new Set([
  "actorstate",
  "runtimestate",
  "mechanicsstate",
  "statspoolsstate",
  "progressionstate",
  "skillstate",
  "magicstate",
  "abilitystate",
  "walletstate",
  "inventorystate",
  "currentxp",
  "currentlevel",
  "currenttier",
  "unspentpoints",
  "statvalues",
  "poolvalues",
  "activemodifiers",
  "activeconditions",
  "walletbalances",
  "inventoryitems",
  "cooldowns",
  "unlocks",
  "currentvalue",
  "basevalue",
  "statevalues",
  "staterevision",
  "mutationrevision",
  "mutationlog",
  "eventlog",
  "lastmutationat",
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

function warnUnknownFields(value, allowed, path, code, warnings) {
  if (!isObject(value)) return;
  Object.keys(value).forEach((key) => {
    if (allowed.has(key)) return;
    warnings.push(
      issue(
        code,
        path === "$" ? key : `${path}.${key}`,
        `Unsupported field "${key}" will not be retained when Crestfall normalizes the Rules Codex.`,
        "WARNING"
      )
    );
  });
}

function collectForbiddenFields(value, path = "$", errors = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      collectForbiddenFields(entry, `${path}[${index}]`, errors)
    );
    return errors;
  }
  if (!isObject(value)) return errors;

  Object.entries(value).forEach(([key, entry]) => {
    const nextPath = path === "$" ? key : `${path}.${key}`;
    const normalizedKey = normalizeKey(key);

    if (FORBIDDEN_RUNTIME_FIELDS.has(normalizedKey)) {
      errors.push(
        issue(
          "RULES_CODEX_JSON_RUNTIME_FIELD_FORBIDDEN",
          nextPath,
          "Rules Codices store reusable interpretation guidance only. Mutable actor values, mechanics state, progression state, balances, inventory, cooldowns, unlocks, and state revisions cannot be authored here."
        )
      );
      return;
    }

    if (FORBIDDEN_AUTHORITY_FIELDS.has(normalizedKey)) {
      errors.push(
        issue(
          "RULES_CODEX_JSON_AUTHORITY_FIELD_FORBIDDEN",
          nextPath,
          "Rules Codices cannot author system or developer prompts, provider-control instructions, safety or guard overrides, state mutations, effects, domain actions, scripts, or deterministic authority."
        )
      );
      return;
    }

    collectForbiddenFields(entry, nextPath, errors);
  });

  return errors;
}

function validateEnum(value, allowed, path, label, errors) {
  const normalized = String(value || "").trim().toUpperCase();
  if (!allowed.includes(normalized)) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_ENUM_UNSUPPORTED",
        path,
        `${label} must be one of: ${allowed.join(", ")}.`
      )
    );
  }
}

function validateInteger(value, path, label, minimum, maximum, errors) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_INTEGER_OUT_OF_RANGE",
        path,
        `${label} must be an integer from ${minimum} through ${maximum}.`
      )
    );
  }
}

function validateStringArray(value, path, errors) {
  if (!Array.isArray(value)) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_ARRAY_REQUIRED",
        path,
        "Activation signal values must be a JSON array of strings."
      )
    );
    return;
  }

  if (value.length > RULES_CODEX_EDITOR_LIMITS.maxActivationValuesPerField) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_ACTIVATION_LIMIT_EXCEEDED",
        path,
        `No activation signal field may contain more than ${RULES_CODEX_EDITOR_LIMITS.maxActivationValuesPerField} values.`
      )
    );
  }

  value.forEach((entry, index) => {
    if (typeof entry !== "string") {
      errors.push(
        issue(
          "RULES_CODEX_JSON_STRING_REQUIRED",
          `${path}[${index}]`,
          "Activation signal values must be strings."
        )
      );
    }
  });
}

function validateRawShape(value) {
  const errors = [];
  const warnings = [];

  if (!isObject(value)) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_OBJECT_REQUIRED",
        "$",
        "Expected one complete Rules Codex JSON object."
      )
    );
    return { errors, warnings };
  }

  warnUnknownFields(
    value,
    ALLOWED_TOP_LEVEL_FIELDS,
    "$",
    "RULES_CODEX_JSON_UNKNOWN_TOP_LEVEL_FIELD",
    warnings
  );

  const contractVersion = String(value.contractVersion || "").trim();
  if (!contractVersion) {
    warnings.push(
      issue(
        "RULES_CODEX_JSON_CONTRACT_VERSION_MISSING",
        "contractVersion",
        `Missing contractVersion. Crestfall will normalize it to ${RULES_CODEX_CONTRACT_VERSION}.`,
        "WARNING"
      )
    );
  } else if (contractVersion !== RULES_CODEX_CONTRACT_VERSION) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${RULES_CODEX_CONTRACT_VERSION}; received ${contractVersion}.`
      )
    );
  }

  if (typeof value.summary !== "string") {
    errors.push(
      issue(
        "RULES_CODEX_JSON_SUMMARY_STRING_REQUIRED",
        "summary",
        "summary must be a JSON string."
      )
    );
  } else if (value.summary.length > RULES_CODEX_EDITOR_LIMITS.maxSummaryLength) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_SUMMARY_TOO_LONG",
        "summary",
        `summary cannot exceed ${RULES_CODEX_EDITOR_LIMITS.maxSummaryLength} characters.`
      )
    );
  }

  if (typeof value.enabled !== "boolean") {
    errors.push(
      issue(
        "RULES_CODEX_JSON_ENABLED_BOOLEAN_REQUIRED",
        "enabled",
        "enabled must be true or false."
      )
    );
  }

  if (!isObject(value.metadata)) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_METADATA_OBJECT_REQUIRED",
        "metadata",
        "metadata must be a JSON object."
      )
    );
  }

  if (!isObject(value.selectionPolicy)) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_SELECTION_POLICY_REQUIRED",
        "selectionPolicy",
        "selectionPolicy must be a JSON object."
      )
    );
  } else {
    warnUnknownFields(
      value.selectionPolicy,
      ALLOWED_SELECTION_POLICY_FIELDS,
      "selectionPolicy",
      "RULES_CODEX_JSON_UNKNOWN_SELECTION_POLICY_FIELD",
      warnings
    );
    validateInteger(
      value.selectionPolicy.maxSelectedSections,
      "selectionPolicy.maxSelectedSections",
      "Maximum selected sections",
      1,
      RULES_CODEX_EDITOR_LIMITS.maxSelectedSections,
      errors
    );
    validateInteger(
      value.selectionPolicy.maxContextCharacters,
      "selectionPolicy.maxContextCharacters",
      "Maximum context characters",
      1000,
      RULES_CODEX_EDITOR_LIMITS.maxContextCharacters,
      errors
    );
  }

  if (!Array.isArray(value.sections)) {
    errors.push(
      issue(
        "RULES_CODEX_JSON_SECTIONS_ARRAY_REQUIRED",
        "sections",
        "sections must be a JSON array."
      )
    );
  } else {
    if (!value.sections.length) {
      errors.push(
        issue(
          "RULES_CODEX_JSON_SECTIONS_REQUIRED",
          "sections",
          "At least one Rules Codex section is required."
        )
      );
    }
    if (value.sections.length > RULES_CODEX_EDITOR_LIMITS.maxSections) {
      errors.push(
        issue(
          "RULES_CODEX_JSON_SECTION_LIMIT_EXCEEDED",
          "sections",
          `A Rules Codex may contain at most ${RULES_CODEX_EDITOR_LIMITS.maxSections} sections.`
        )
      );
    }

    value.sections.forEach((section, index) => {
      const path = `sections[${index}]`;
      if (!isObject(section)) {
        errors.push(
          issue(
            "RULES_CODEX_JSON_SECTION_OBJECT_REQUIRED",
            path,
            "Each Rules Codex section must be a JSON object."
          )
        );
        return;
      }

      warnUnknownFields(
        section,
        ALLOWED_SECTION_FIELDS,
        path,
        "RULES_CODEX_JSON_UNKNOWN_SECTION_FIELD",
        warnings
      );

      if (section.authority !== RULES_CODEX_AUTHORITY) {
        errors.push(
          issue(
            "RULES_CODEX_JSON_AUTHORITY_INVALID",
            `${path}.authority`,
            `Every Rules Codex section must keep authority exactly ${RULES_CODEX_AUTHORITY}.`
          )
        );
      }
      if (typeof section.id !== "string") {
        errors.push(
          issue(
            "RULES_CODEX_JSON_SECTION_ID_STRING_REQUIRED",
            `${path}.id`,
            "Section id must be a JSON string."
          )
        );
      }
      if (typeof section.title !== "string") {
        errors.push(
          issue(
            "RULES_CODEX_JSON_SECTION_TITLE_STRING_REQUIRED",
            `${path}.title`,
            "Section title must be a JSON string."
          )
        );
      }
      if (typeof section.body !== "string") {
        errors.push(
          issue(
            "RULES_CODEX_JSON_SECTION_BODY_STRING_REQUIRED",
            `${path}.body`,
            "Section body must be a JSON string."
          )
        );
      }
      if (typeof section.enabled !== "boolean") {
        errors.push(
          issue(
            "RULES_CODEX_JSON_SECTION_ENABLED_BOOLEAN_REQUIRED",
            `${path}.enabled`,
            "Section enabled must be true or false."
          )
        );
      }
      if (!isObject(section.metadata)) {
        errors.push(
          issue(
            "RULES_CODEX_JSON_SECTION_METADATA_OBJECT_REQUIRED",
            `${path}.metadata`,
            "Section metadata must be a JSON object."
          )
        );
      }
      validateInteger(
        section.priority,
        `${path}.priority`,
        "Section priority",
        0,
        100,
        errors
      );
      validateInteger(
        section.order,
        `${path}.order`,
        "Section order",
        0,
        100000,
        errors
      );

      if (!isObject(section.activation)) {
        errors.push(
          issue(
            "RULES_CODEX_JSON_ACTIVATION_REQUIRED",
            `${path}.activation`,
            "Section activation must be a JSON object."
          )
        );
      } else {
        warnUnknownFields(
          section.activation,
          ALLOWED_ACTIVATION_FIELDS,
          `${path}.activation`,
          "RULES_CODEX_JSON_UNKNOWN_ACTIVATION_FIELD",
          warnings
        );
        validateEnum(
          section.activation.mode,
          RULES_CODEX_ACTIVATION_MODES,
          `${path}.activation.mode`,
          "Activation mode",
          errors
        );
        validateEnum(
          section.activation.matchMode,
          RULES_CODEX_MATCH_MODES,
          `${path}.activation.matchMode`,
          "Activation match mode",
          errors
        );
        RULES_CODEX_ACTIVATION_SIGNAL_FIELDS.forEach((field) =>
          validateStringArray(
            section.activation[field.key],
            `${path}.activation.${field.key}`,
            errors
          )
        );
      }
    });
  }

  collectForbiddenFields(value, "$", errors);
  return { errors, warnings };
}

export function formatRulesCodexJsonData(value = {}) {
  return JSON.stringify(normalizeRulesCodexEditorValue(value), null, 2);
}

export function formatRulesCodexJsonText(jsonText = "") {
  try {
    const parsed = JSON.parse(String(jsonText || ""));
    return { valid: true, text: JSON.stringify(parsed, null, 2), error: null };
  } catch (error) {
    return {
      valid: false,
      text: String(jsonText || ""),
      error: issue(
        "RULES_CODEX_JSON_SYNTAX_INVALID",
        "$",
        error?.message || "The JSON syntax is invalid."
      ),
    };
  }
}

export function validateRulesCodexJsonText(jsonText = "") {
  let parsed;
  try {
    parsed = JSON.parse(String(jsonText || ""));
  } catch (error) {
    const syntaxError = issue(
      "RULES_CODEX_JSON_SYNTAX_INVALID",
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

  const rawValidation = validateRawShape(parsed);
  const normalized = isObject(parsed)
    ? normalizeRulesCodexEditorValue(parsed)
    : null;
  const contractIssues = normalized
    ? validateRulesCodexEditorValue(normalized)
    : [];
  const errors = dedupeIssues([
    ...rawValidation.errors,
    ...contractIssues.filter((entry) => entry.severity !== "WARNING"),
  ]);
  const warnings = dedupeIssues([
    ...rawValidation.warnings,
    ...contractIssues.filter((entry) => entry.severity === "WARNING"),
  ]);

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
