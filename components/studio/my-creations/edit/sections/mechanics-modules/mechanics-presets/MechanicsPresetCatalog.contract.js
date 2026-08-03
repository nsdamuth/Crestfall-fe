export const MECHANICS_PRESET_CATALOG_VERSION =
  "mechanics_preset_catalog_v1";

export const MECHANICS_PRESET_DEFINITION_VERSION =
  "mechanics_preset_definition_v1";

export const MECHANICS_PRESET_PAYLOAD_VERSION =
  "mechanics_preset_payload_v1";

export const MECHANICS_PRESET_SCOPES = Object.freeze([
  "COMMAND_RESOLUTION",
  "COMMAND_COMPOSITION",
  "COMMAND",
  "MODULE",
]);

export const MECHANICS_PRESET_CATEGORIES = Object.freeze([
  "RESOLUTION",
  "COMPOSITION",
  "COMMAND_STARTER",
  "MODULE_STARTER",
  "DOMAIN_WORKFLOW",
  "PROGRESSION",
]);

export const MECHANICS_PRESET_APPLY_MODES = Object.freeze([
  "REPLACE_BLOCK",
  "REPLACE_COMMAND",
  "MERGE_COMMAND",
  "REPLACE_MODULE",
  "MERGE_MODULE",
]);

export const MECHANICS_PRESET_IMPLEMENTATION_STATUSES = Object.freeze([
  "READY",
  "PLANNED",
  "DEPRECATED",
]);

export const MECHANICS_PRESET_AVAILABILITY_STATUSES = Object.freeze([
  "AVAILABLE",
  "UNAVAILABLE",
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function normalizeStringArray(value = []) {
  return [...new Set(
    (Array.isArray(value) ? value : [])
      .map(normalizeString)
      .filter(Boolean)
  )];
}

export function normalizeMechanicsPresetId(value) {
  return normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function normalizeMechanicsPresetDefinition(value = {}) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  const scope = normalizeUpper(source.scope);
  const category = normalizeUpper(source.category);
  const implementationStatus = normalizeUpper(
    source.implementation?.status || source.implementationStatus
  );
  const application =
    source.application &&
    typeof source.application === "object" &&
    !Array.isArray(source.application)
      ? source.application
      : {};
  const defaultMode = normalizeUpper(application.defaultMode);
  const allowedModes = normalizeStringArray(application.allowedModes)
    .map(normalizeUpper)
    .filter((mode) => MECHANICS_PRESET_APPLY_MODES.includes(mode));
  const applicability =
    source.applicability &&
    typeof source.applicability === "object" &&
    !Array.isArray(source.applicability)
      ? source.applicability
      : {};
  const preview =
    source.preview &&
    typeof source.preview === "object" &&
    !Array.isArray(source.preview)
      ? source.preview
      : {};
  const implementation =
    source.implementation &&
    typeof source.implementation === "object" &&
    !Array.isArray(source.implementation)
      ? source.implementation
      : {};
  const sourceDefinition =
    source.source &&
    typeof source.source === "object" &&
    !Array.isArray(source.source)
      ? source.source
      : {};

  return {
    version:
      normalizeString(source.version) ||
      MECHANICS_PRESET_DEFINITION_VERSION,
    id: normalizeMechanicsPresetId(source.id),
    revision: Math.max(1, Math.trunc(Number(source.revision) || 1)),
    label: normalizeString(source.label),
    description: normalizeString(source.description),
    scope: MECHANICS_PRESET_SCOPES.includes(scope)
      ? scope
      : "COMMAND",
    category: MECHANICS_PRESET_CATEGORIES.includes(category)
      ? category
      : "COMMAND_STARTER",
    tags: normalizeStringArray(source.tags).map((tag) => tag.toLowerCase()),
    source: {
      type: normalizeUpper(sourceDefinition.type),
      referenceId: normalizeUpper(
        sourceDefinition.referenceId || sourceDefinition.reference_id
      ),
    },
    application: {
      defaultMode: MECHANICS_PRESET_APPLY_MODES.includes(defaultMode)
        ? defaultMode
        : "REPLACE_BLOCK",
      allowedModes: allowedModes.length
        ? allowedModes
        : ["REPLACE_BLOCK"],
      replacementPaths: normalizeStringArray(application.replacementPaths),
      preservedPaths: normalizeStringArray(application.preservedPaths),
    },
    applicability: {
      creationTypes: normalizeStringArray(applicability.creationTypes)
        .map(normalizeUpper),
      moduleDefinitionIds: normalizeStringArray(
        applicability.moduleDefinitionIds
      ),
      requiredArgumentTypes: normalizeStringArray(
        applicability.requiredArgumentTypes
      ).map(normalizeUpper),
      notes: normalizeString(applicability.notes),
    },
    preview: {
      eyebrow: normalizeString(preview.eyebrow),
      summary: normalizeString(preview.summary),
      badges: normalizeStringArray(preview.badges),
    },
    implementation: {
      status: MECHANICS_PRESET_IMPLEMENTATION_STATUSES.includes(
        implementationStatus
      )
        ? implementationStatus
        : "READY",
      phase: normalizeString(implementation.phase),
      builder: normalizeString(implementation.builder),
      runtimeStatus: normalizeUpper(
        implementation.runtimeStatus || implementation.runtime_status
      ) || null,
      runtimePhase: normalizeString(
        implementation.runtimePhase || implementation.runtime_phase
      ) || null,
      runtimeImplementationId: normalizeString(
        implementation.runtimeImplementationId ||
          implementation.runtime_implementation_id
      ) || null,
      runtimeImplementationVersion: normalizeString(
        implementation.runtimeImplementationVersion ||
          implementation.runtime_implementation_version
      ) || null,
    },
  };
}
