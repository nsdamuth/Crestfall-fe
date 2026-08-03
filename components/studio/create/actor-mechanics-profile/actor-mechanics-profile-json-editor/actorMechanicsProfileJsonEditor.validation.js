import {
  ACTOR_MECHANICS_PROFILE_ACTIVATION_MODES,
  ACTOR_MECHANICS_PROFILE_BINDING_MODES,
  ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
  ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
  ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_DOMAINS,
  ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
  ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
  ACTOR_MECHANICS_PROFILE_PRESETS,
  ACTOR_MECHANICS_PROFILE_REFERENCE_TYPES,
  ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
  ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
} from "../actor-mechanics-profile-editor/ActorMechanicsProfileEditor.contract.js";
import {
  normalizeActorMechanicsProfileEditorValue,
  validateActorMechanicsProfileEditorValue,
} from "../actor-mechanics-profile-editor/useActorMechanicsProfileEditorViewModel.js";

export const ACTOR_MECHANICS_PROFILE_JSON_EDITOR_VALIDATION_VERSION =
  "actor_mechanics_profile_json_editor_validation_v1";

const LEGACY_CONTRACT_VERSION = "character_mechanics_loadout_contract_v0";
const LEGACY_BINDING_VERSION = "character_mechanics_loadout_binding_v0";

const ALLOWED_TOP_LEVEL_FIELDS = new Set([
  "contractVersion",
  "presetId",
  "title",
  "summary",
  "enabled",
  "owner",
  "statePolicy",
  "capabilityPolicy",
  "bindings",
  "metadata",
]);

const FORBIDDEN_RUNTIME_FIELDS = new Set([
  "actorstate",
  "runtimestate",
  "statspoolsstate",
  "progressionstate",
  "skillstate",
  "magicstate",
  "abilitystate",
  "walletstate",
  "inventorystate",
  "currentxp",
  "currentlevel",
  "unspentpoints",
  "currenttier",
  "statvalues",
  "poolvalues",
  "activemodifiers",
  "activeconditions",
  "walletbalances",
  "inventoryitems",
  "activecooldowns",
  "cooldowns",
  "unlocks",
  "statevalues",
  "currentvalue",
  "basevalue",
  "currentbalance",
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
          "ACTOR_MECHANICS_PROFILE_JSON_RUNTIME_FIELD_FORBIDDEN",
          nextPath,
          "Actor Mechanics Profiles compose reusable bindings and policies only. Mutable actor values, XP, balances, inventory state, cooldowns, unlocks, and state revisions cannot be authored here."
        )
      );
      return;
    }
    collectForbiddenRuntimeFields(entry, nextPath, issues);
  });
  return issues;
}

function validateEnum(value, allowed, path, label, errors) {
  const normalized = String(value || "").trim().toUpperCase();
  if (!allowed.includes(normalized)) {
    errors.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_ENUM_UNSUPPORTED",
        path,
        `${label} must be one of: ${allowed.join(", ")}.`
      )
    );
  }
}

function validateRawShape(value) {
  const errors = [];
  const warnings = [];

  if (!isObject(value)) {
    errors.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_OBJECT_REQUIRED",
        "$",
        "Expected one complete Actor Mechanics Profile JSON object."
      )
    );
    return { errors, warnings };
  }

  Object.keys(value).forEach((key) => {
    if (!ALLOWED_TOP_LEVEL_FIELDS.has(key)) {
      warnings.push(
        issue(
          "ACTOR_MECHANICS_PROFILE_JSON_UNKNOWN_TOP_LEVEL_FIELD",
          key,
          `Unsupported top-level field "${key}" will not be retained when Crestfall normalizes the profile.`,
          "WARNING"
        )
      );
    }
  });

  const contractVersion = String(value.contractVersion || "").trim();
  if (!contractVersion) {
    warnings.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_CONTRACT_VERSION_MISSING",
        "contractVersion",
        `Missing contractVersion. Crestfall will normalize it to ${ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION}.`,
        "WARNING"
      )
    );
  } else if (
    contractVersion !== ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION &&
    contractVersion !== LEGACY_CONTRACT_VERSION
  ) {
    errors.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION}; received ${contractVersion}.`
      )
    );
  } else if (contractVersion === LEGACY_CONTRACT_VERSION) {
    warnings.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_LEGACY_CONTRACT_NORMALIZED",
        "contractVersion",
        `Legacy contract ${LEGACY_CONTRACT_VERSION} will normalize to ${ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION}.`,
        "WARNING"
      )
    );
  }

  validateEnum(value.presetId, ACTOR_MECHANICS_PROFILE_PRESETS, "presetId", "Preset", errors);

  if (!isObject(value.owner)) {
    errors.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_OWNER_REQUIRED",
        "owner",
        "owner must be a JSON object."
      )
    );
  } else {
    validateEnum(
      value.owner.bindingMode,
      ACTOR_MECHANICS_PROFILE_BINDING_MODES,
      "owner.bindingMode",
      "Owner binding mode",
      errors
    );
    validateEnum(
      value.owner.ownerType,
      ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
      "owner.ownerType",
      "Owner type",
      errors
    );
  }

  if (!isObject(value.statePolicy)) {
    errors.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_STATE_POLICY_REQUIRED",
        "statePolicy",
        "statePolicy must be a JSON object."
      )
    );
  } else {
    if (value.statePolicy.isolation !== ACTOR_MECHANICS_PROFILE_STATE_ISOLATION) {
      errors.push(
        issue(
          "ACTOR_MECHANICS_PROFILE_JSON_STATE_ISOLATION_INVALID",
          "statePolicy.isolation",
          `State isolation is fixed to ${ACTOR_MECHANICS_PROFILE_STATE_ISOLATION}.`
        )
      );
    }
    if (
      value.statePolicy.namespaceStrategy !==
      ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE
    ) {
      errors.push(
        issue(
          "ACTOR_MECHANICS_PROFILE_JSON_STATE_NAMESPACE_INVALID",
          "statePolicy.namespaceStrategy",
          `State namespace strategy is fixed to ${ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE}.`
        )
      );
    }
    if (value.statePolicy.sharedDefinitionsAllowed !== true) {
      errors.push(
        issue(
          "ACTOR_MECHANICS_PROFILE_JSON_SHARED_DEFINITIONS_POLICY_INVALID",
          "statePolicy.sharedDefinitionsAllowed",
          "sharedDefinitionsAllowed must remain true."
        )
      );
    }
    if (value.statePolicy.sharedMutableStateAllowed !== false) {
      errors.push(
        issue(
          "ACTOR_MECHANICS_PROFILE_JSON_SHARED_STATE_FORBIDDEN",
          "statePolicy.sharedMutableStateAllowed",
          "sharedMutableStateAllowed must remain false."
        )
      );
    }
  }

  if (!isObject(value.capabilityPolicy)) {
    errors.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_CAPABILITY_POLICY_REQUIRED",
        "capabilityPolicy",
        "capabilityPolicy must be a JSON object."
      )
    );
  } else {
    validateEnum(
      value.capabilityPolicy.mode,
      ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
      "capabilityPolicy.mode",
      "Capability mode",
      errors
    );
    validateEnum(
      value.capabilityPolicy.opposedResolutionPolicy,
      ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
      "capabilityPolicy.opposedResolutionPolicy",
      "Opposed-resolution policy",
      errors
    );
  }

  if (!Array.isArray(value.bindings)) {
    errors.push(
      issue(
        "ACTOR_MECHANICS_PROFILE_JSON_BINDINGS_ARRAY_REQUIRED",
        "bindings",
        "bindings must be a JSON array."
      )
    );
  } else {
    value.bindings.forEach((binding, index) => {
      const path = `bindings[${index}]`;
      if (!isObject(binding)) {
        errors.push(
          issue(
            "ACTOR_MECHANICS_PROFILE_JSON_BINDING_OBJECT_REQUIRED",
            path,
            "Each binding must be a JSON object."
          )
        );
        return;
      }

      const bindingVersion = String(binding.bindingVersion || "").trim();
      if (
        bindingVersion &&
        bindingVersion !== ACTOR_MECHANICS_PROFILE_BINDING_VERSION &&
        bindingVersion !== LEGACY_BINDING_VERSION
      ) {
        errors.push(
          issue(
            "ACTOR_MECHANICS_PROFILE_JSON_BINDING_VERSION_UNSUPPORTED",
            `${path}.bindingVersion`,
            `Binding version must use ${ACTOR_MECHANICS_PROFILE_BINDING_VERSION}.`
          )
        );
      } else if (bindingVersion === LEGACY_BINDING_VERSION) {
        warnings.push(
          issue(
            "ACTOR_MECHANICS_PROFILE_JSON_LEGACY_BINDING_NORMALIZED",
            `${path}.bindingVersion`,
            `Legacy binding version will normalize to ${ACTOR_MECHANICS_PROFILE_BINDING_VERSION}.`,
            "WARNING"
          )
        );
      }

      validateEnum(binding.domain, ACTOR_MECHANICS_PROFILE_DOMAINS, `${path}.domain`, "Binding domain", errors);
      if (binding.stateIsolation !== ACTOR_MECHANICS_PROFILE_STATE_ISOLATION) {
        errors.push(
          issue(
            "ACTOR_MECHANICS_PROFILE_JSON_BINDING_ISOLATION_INVALID",
            `${path}.stateIsolation`,
            `Every binding must remain ${ACTOR_MECHANICS_PROFILE_STATE_ISOLATION}.`
          )
        );
      }

      if (!isObject(binding.activation)) {
        errors.push(
          issue(
            "ACTOR_MECHANICS_PROFILE_JSON_ACTIVATION_REQUIRED",
            `${path}.activation`,
            "Binding activation must be a JSON object."
          )
        );
      } else {
        validateEnum(
          binding.activation.mode,
          ACTOR_MECHANICS_PROFILE_ACTIVATION_MODES,
          `${path}.activation.mode`,
          "Activation mode",
          errors
        );
        if (!Array.isArray(binding.activation.domains)) {
          errors.push(
            issue(
              "ACTOR_MECHANICS_PROFILE_JSON_ACTIVATION_DOMAINS_ARRAY_REQUIRED",
              `${path}.activation.domains`,
              "Activation domains must be a JSON array."
            )
          );
        }
      }

      if (!Array.isArray(binding.references)) {
        errors.push(
          issue(
            "ACTOR_MECHANICS_PROFILE_JSON_REFERENCES_ARRAY_REQUIRED",
            `${path}.references`,
            "Binding references must be a JSON array."
          )
        );
      } else {
        binding.references.forEach((reference, referenceIndex) => {
          const referencePath = `${path}.references[${referenceIndex}]`;
          if (!isObject(reference)) {
            errors.push(
              issue(
                "ACTOR_MECHANICS_PROFILE_JSON_REFERENCE_OBJECT_REQUIRED",
                referencePath,
                "Each reference must be a JSON object."
              )
            );
            return;
          }
          validateEnum(
            reference.referenceType,
            ACTOR_MECHANICS_PROFILE_REFERENCE_TYPES,
            `${referencePath}.referenceType`,
            "Reference type",
            errors
          );
        });
      }
    });
  }

  collectForbiddenRuntimeFields(value, "$", errors);
  return { errors, warnings };
}

export function formatActorMechanicsProfileJsonData(value = {}, ownerContext = null) {
  return JSON.stringify(
    normalizeActorMechanicsProfileEditorValue(value, ownerContext),
    null,
    2
  );
}

export function formatActorMechanicsProfileJsonText(jsonText = "") {
  try {
    const parsed = JSON.parse(String(jsonText || ""));
    return { valid: true, text: JSON.stringify(parsed, null, 2), error: null };
  } catch (error) {
    return {
      valid: false,
      text: String(jsonText || ""),
      error: issue(
        "ACTOR_MECHANICS_PROFILE_JSON_SYNTAX_INVALID",
        "$",
        error?.message || "The JSON syntax is invalid."
      ),
    };
  }
}

export function validateActorMechanicsProfileJsonText(
  jsonText = "",
  ownerContext = null
) {
  let parsed;
  try {
    parsed = JSON.parse(String(jsonText || ""));
  } catch (error) {
    const syntaxError = issue(
      "ACTOR_MECHANICS_PROFILE_JSON_SYNTAX_INVALID",
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
    ? normalizeActorMechanicsProfileEditorValue(parsed, ownerContext)
    : null;
  const contractValidation = normalized
    ? validateActorMechanicsProfileEditorValue(normalized)
    : { errors: [], warnings: [] };
  const errors = dedupeIssues([
    ...rawValidation.errors,
    ...(contractValidation.errors || []),
  ]);
  const warnings = dedupeIssues([
    ...rawValidation.warnings,
    ...(contractValidation.warnings || []),
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
