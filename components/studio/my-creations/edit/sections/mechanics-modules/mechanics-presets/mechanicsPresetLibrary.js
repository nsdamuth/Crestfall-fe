import {
  MECHANICS_PRESET_CATALOG_VERSION,
  MECHANICS_PRESET_DEFINITION_VERSION,
  MECHANICS_PRESET_PAYLOAD_VERSION,
  normalizeMechanicsPresetId,
} from "./MechanicsPresetCatalog.contract.js";
import {
  buildMechanicsPresetPayload as buildCoreMechanicsPresetPayload,
  getMechanicsPresetCatalogManifest as getCoreMechanicsPresetCatalogManifest,
  getMechanicsPresetDefinition as getCoreMechanicsPresetDefinition,
  listMechanicsPresetCatalog as listCoreMechanicsPresetCatalog,
} from "./mechanicsPresetCatalog.js";
import {
  MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID,
  MECHANICS_CHARACTER_ADVANCEMENT_PRESET_VERSION,
  MECHANICS_CHARACTER_ADVANCEMENT_REFERENCE_ID,
  MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
  MECHANICS_CHARACTER_ADVANCEMENT_READOUT_REFERENCE_ID,
  MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS,
  buildMechanicsCharacterAdvancementPreset,
  buildMechanicsCharacterAdvancementReadoutPreset,
  listMechanicsCharacterAdvancementPresets,
} from "./mechanicsCharacterAdvancementPreset.js";

export const MECHANICS_PRESET_LIBRARY_VERSION =
  "mechanics_preset_library_v1";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function deepClone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function buildAdvancementDefinition(reference, options = {}) {
  const readoutOnly = options.readoutOnly === true;

  return {
    version: MECHANICS_PRESET_DEFINITION_VERSION,
    id: reference.presetId,
    revision: readoutOnly ? 1 : 2,
    label: reference.label,
    description: reference.description,
    scope: "MODULE",
    category: "PROGRESSION",
    tags: [...reference.tags],
    source: {
      type: readoutOnly
        ? "MC7X2_PROGRESSION_READOUT_ADDON"
        : "MC7X2_GENERATED_PROGRESSION",
      referenceId: reference.id,
    },
    application: {
      defaultMode: readoutOnly ? "MERGE_MODULE" : "REPLACE_MODULE",
      allowedModes: readoutOnly
        ? ["MERGE_MODULE"]
        : ["REPLACE_MODULE", "MERGE_MODULE"],
      replacementPaths: ["module"],
      preservedPaths: [
        "creation.id",
        "creation.ownerId",
        "creation.type",
        "creation.title",
        "creation.slug",
        "creation.description",
        "creation.visibility",
        "creation.status",
        "creation.contentRating",
        "creation.canonStatus",
        "creation.featuredMedia",
        "creation.createdAt",
        "creation.updatedAt",
      ],
    },
    applicability: {
      creationTypes: ["MECHANICS_MODULE"],
      moduleDefinitionIds: ["core.trackers.v1"],
      requiredArgumentTypes: [],
      notes: readoutOnly
        ? "Merge this add-on into an existing Character Advancement module to add /progress without replacing its authored curve."
        : "Bind the module to each Player Character with BINDING_OWNER scope for independent multiplayer advancement state.",
    },
    preview: {
      eyebrow: readoutOnly ? "Progression Add-on" : "Progression Starter",
      summary: readoutOnly
        ? "1 read-only command · merge-safe state readout"
        : "4 commands · generated curve · adjustable ranks and derived counters",
      badges: readoutOnly
        ? ["Progression", "Read-only", "Merge Add-on"]
        : ["Progression", "Generated Curve", "Mergeable Module"],
    },
    implementation: {
      status: "READY",
      phase: "MC7X.2",
      builder: readoutOnly
        ? "buildMechanicsCharacterAdvancementReadoutPreset"
        : "buildMechanicsCharacterAdvancementPreset",
      runtimeStatus: "REFERENCE_AUTHORING_READY",
      runtimePhase: "MC7X.2",
      runtimeImplementationId: null,
      runtimeImplementationVersion: null,
      liveValidation: {
        status: "MANUAL_REFERENCE_READY",
        testCommand: readoutOnly ? "/progress" : "/award_xp 300",
        expectedOutcome: "SUCCESS",
        expectedPatchLanes: readoutOnly ? [] : ["MECHANICS_STATE"],
        authorizationNote: reference.authorizationNote,
      },
    },
    availability: {
      status: "AVAILABLE",
      available: true,
      missingArgumentTypes: [],
      reason: "",
    },
  };
}

const ADVANCEMENT_REFERENCES = listMechanicsCharacterAdvancementPresets();
const EXTENSION_DEFINITIONS = Object.freeze([
  buildAdvancementDefinition(
    ADVANCEMENT_REFERENCES.find(
      (reference) =>
        reference.id === MECHANICS_CHARACTER_ADVANCEMENT_REFERENCE_ID
    )
  ),
  buildAdvancementDefinition(
    ADVANCEMENT_REFERENCES.find(
      (reference) =>
        reference.id === MECHANICS_CHARACTER_ADVANCEMENT_READOUT_REFERENCE_ID
    ),
    { readoutOnly: true }
  ),
]);

function matchesExtension(definition, options = {}) {
  const scopes = new Set(
    normalizeList(options.scopes || options.scope).map(normalizeUpper)
  );
  const categories = new Set(
    normalizeList(options.categories || options.category).map(normalizeUpper)
  );
  const query = normalizeString(options.query).toLowerCase();

  if (scopes.size && !scopes.has(definition.scope)) return false;
  if (categories.size && !categories.has(definition.category)) return false;
  if (options.includeUnavailable === false && !definition.availability.available) {
    return false;
  }

  if (query) {
    const searchable = [
      definition.id,
      definition.label,
      definition.description,
      definition.scope,
      definition.category,
      ...definition.tags,
      definition.source.referenceId,
    ].join(" ").toLowerCase();

    if (!searchable.includes(query)) return false;
  }

  return true;
}

export function getMechanicsPresetLibraryManifest() {
  const core = getCoreMechanicsPresetCatalogManifest();

  return {
    version: MECHANICS_PRESET_LIBRARY_VERSION,
    catalogVersion: core.version,
    corePresetCount: core.presetCount,
    extensionPresetCount: EXTENSION_DEFINITIONS.length,
    presetCount: core.presetCount + EXTENSION_DEFINITIONS.length,
    extensionVersions: [MECHANICS_CHARACTER_ADVANCEMENT_PRESET_VERSION],
    presets: [
      ...core.presets.map(deepClone),
      ...EXTENSION_DEFINITIONS.map(deepClone),
    ],
  };
}

export function listMechanicsPresetCatalog(options = {}) {
  return [
    ...listCoreMechanicsPresetCatalog(options),
    ...EXTENSION_DEFINITIONS
      .filter((definition) => matchesExtension(definition, options))
      .map(deepClone),
  ];
}

export function getMechanicsPresetDefinition(id, options = {}) {
  const requested = normalizeMechanicsPresetId(id);
  const extension = EXTENSION_DEFINITIONS.find(
    (definition) =>
      definition.id === requested ||
      (definition.id === MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID &&
        MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS.includes(requested))
  );

  return extension
    ? matchesExtension(extension, { ...options, includeUnavailable: true })
      ? deepClone(extension)
      : null
    : getCoreMechanicsPresetDefinition(requested, options);
}

export function buildMechanicsPresetPayload(id, options = {}) {
  const requested = normalizeMechanicsPresetId(id);

  const advancementRequested =
    requested === MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID ||
    MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS.includes(requested);
  const readoutRequested =
    requested === MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID;

  if (!advancementRequested && !readoutRequested) {
    return buildCoreMechanicsPresetPayload(requested, options);
  }

  const definition = getMechanicsPresetDefinition(requested, options);
  if (!definition) {
    return {
      ok: false,
      error: {
        code: "MECHANICS_PRESET_NOT_FOUND",
        message: `Unknown Mechanics preset "${normalizeString(id) || "(missing)"}".`,
      },
      definition: null,
      payload: null,
    };
  }

  return {
    ok: true,
    error: null,
    definition,
    payload: {
      version: MECHANICS_PRESET_PAYLOAD_VERSION,
      catalogVersion: MECHANICS_PRESET_CATALOG_VERSION,
      definitionVersion: MECHANICS_PRESET_DEFINITION_VERSION,
      libraryVersion: MECHANICS_PRESET_LIBRARY_VERSION,
      presetId: definition.id,
      presetRevision: definition.revision,
      scope: definition.scope,
      category: definition.category,
      applyMode: definition.application.defaultMode,
      replacementPaths: [...definition.application.replacementPaths],
      preservedPaths: [...definition.application.preservedPaths],
      source: deepClone(definition.source),
      value: readoutRequested
        ? buildMechanicsCharacterAdvancementReadoutPreset()
        : buildMechanicsCharacterAdvancementPreset(),
    },
  };
}
