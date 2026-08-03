import {
  COMMAND_RESOLUTION_REFERENCE_CONFIGURATIONS,
  MECHANICS_COMMAND_RESOLUTION_VERSION,
  buildMechanicsCommandResolutionReferenceConfiguration,
  formatMechanicsCommandResolutionBuilderSummary,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_COMMAND_COMPOSITION_VERSION,
  buildMechanicsCommandCompositionReference,
  listMechanicsCommandCompositionReferences,
  normalizeMechanicsCommandCompositionArgumentOptions,
  summarizeMechanicsCommandCompositionBuilder,
} from "../mechanicsCommandCompositionBuilder.js";
import {
  MECHANICS_PRESET_CATALOG_VERSION,
  MECHANICS_PRESET_DEFINITION_VERSION,
  MECHANICS_PRESET_PAYLOAD_VERSION,
  normalizeMechanicsPresetDefinition,
  normalizeMechanicsPresetId,
} from "./MechanicsPresetCatalog.contract.js";
import {
  MECHANICS_COMMAND_STARTER_VERSION,
  buildMechanicsCommandStarterPreset,
  listMechanicsCommandStarterPresets,
  summarizeMechanicsCommandStarterPreset,
} from "./mechanicsCommandStarterPresets.js";
import {
  MECHANICS_MODULE_STARTER_VERSION,
  buildMechanicsModuleStarterPreset,
  listMechanicsModuleStarterPresets,
  summarizeMechanicsModuleStarterPreset,
} from "./mechanicsModuleStarterPresets.js";
import {
  MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
  getMechanicsReferenceRuntimeImplementationForModuleStarter,
  listMechanicsReferenceRuntimeImplementations,
} from "./mechanicsReferenceRuntimeImplementations.js";

const MECHANICS_MODULE_CREATION_TYPE = "MECHANICS_MODULE";
const TRACKERS_MODULE_ID = "core.trackers.v1";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function normalizeList(value = []) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function deepClone(value) {
  return value === undefined
    ? undefined
    : JSON.parse(JSON.stringify(value));
}

const PRESERVED_COMMAND_PATHS = Object.freeze([
  "command.id",
  "command.label",
  "command.invocation",
  "command.requirements",
  "command.attemptEffects",
  "command.resolution",
  "command.composition",
  "command.effects",
  "command.outcomes",
  "command.domainAction",
  "command.presentation",
  "command.triggers",
]);

const PRESERVED_MODULE_PATHS_FOR_COMMAND_REPLACEMENT = Object.freeze([
  "module.moduleDefinitionId",
  "module.moduleId",
  "module.priority",
  "module.tags",
  "module.instanceData.trackers",
  "module.instanceData.guards",
  "module.instanceData.statusBlocks",
  "module.instanceData.defaults",
  "module.instanceData.commands[other]",
]);

const PRESERVED_CREATION_PATHS_FOR_MODULE_REPLACEMENT = Object.freeze([
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
]);

const RESOLUTION_METADATA = Object.freeze({
  AUTOMATIC_SUCCESS: {
    id: "resolution.automatic_success.v1",
    tags: ["automatic", "deterministic", "no-roll"],
  },
  STANDARD_D20: {
    id: "resolution.standard_d20.v1",
    tags: ["threshold", "d20", "standard"],
  },
  ADVANTAGE_D20: {
    id: "resolution.advantage_d20.v1",
    tags: ["threshold", "d20", "advantage"],
  },
  DISADVANTAGE_D20: {
    id: "resolution.disadvantage_d20.v1",
    tags: ["threshold", "d20", "disadvantage"],
  },
  OPPOSED_D20: {
    id: "resolution.opposed_d20.v1",
    tags: ["opposed", "d20", "contest"],
  },
  DEGREE_D20: {
    id: "resolution.degree_d20.v1",
    tags: ["threshold", "d20", "degree-of-success"],
  },
});

const COMPOSITION_METADATA = Object.freeze({
  SEQUENTIAL_ATTEMPT_SUCCESS: {
    id: "composition.sequential_attempt_success.v1",
    tags: ["attempt", "outcome", "counter"],
    requiredArgumentTypes: [],
  },
  CONDITIONAL_MILESTONE: {
    id: "composition.conditional_milestone.v1",
    tags: ["condition", "dependency", "milestone"],
    requiredArgumentTypes: [],
  },
  ITEM_AND_CONDITION: {
    id: "composition.item_and_condition.v1",
    tags: ["item", "participant", "condition", "domain"],
    requiredArgumentTypes: ["ITEM_HELD", "CHARACTER_PRESENT", "TEXT"],
  },
  ITEM_CONDITION_LOCATION: {
    id: "composition.item_condition_location.v1",
    tags: ["item", "participant", "location", "domain"],
    requiredArgumentTypes: [
      "ITEM_HELD",
      "CHARACTER_PRESENT",
      "TEXT",
      "LOCATION_CONNECTED",
    ],
  },
});

function makeApplication(replacementPath) {
  return {
    defaultMode: "REPLACE_BLOCK",
    allowedModes: ["REPLACE_BLOCK"],
    replacementPaths: [replacementPath],
    preservedPaths: PRESERVED_COMMAND_PATHS.filter(
      (path) => path !== replacementPath
    ),
  };
}

function makeBaseDefinition({
  id,
  label,
  description,
  scope,
  category,
  tags,
  sourceType,
  referenceId,
  replacementPath,
  requiredArgumentTypes = [],
  previewSummary,
  builder,
}) {
  return normalizeMechanicsPresetDefinition({
    version: MECHANICS_PRESET_DEFINITION_VERSION,
    id,
    revision: 1,
    label,
    description,
    scope,
    category,
    tags,
    source: {
      type: sourceType,
      referenceId,
    },
    application: makeApplication(replacementPath),
    applicability: {
      creationTypes: [MECHANICS_MODULE_CREATION_TYPE],
      moduleDefinitionIds: [TRACKERS_MODULE_ID],
      requiredArgumentTypes,
      notes:
        requiredArgumentTypes.length > 0
          ? "Required typed command arguments must exist before the preset can be built."
          : "No typed command arguments are required.",
    },
    preview: {
      eyebrow: category === "RESOLUTION" ? "Resolution Reference" : "Composition Reference",
      summary: previewSummary || description,
      badges: [scope.replaceAll("_", " "), "Replace Block"],
    },
    implementation: {
      status: "READY",
      phase: "MC7A",
      builder,
    },
  });
}

function buildResolutionDefinitions() {
  return COMMAND_RESOLUTION_REFERENCE_CONFIGURATIONS.map((reference) => {
    const metadata = RESOLUTION_METADATA[reference.id];
    const resolution =
      buildMechanicsCommandResolutionReferenceConfiguration(reference.id);

    if (!metadata || !resolution) return null;

    return makeBaseDefinition({
      id: metadata.id,
      label: reference.label,
      description: reference.description,
      scope: "COMMAND_RESOLUTION",
      category: "RESOLUTION",
      tags: metadata.tags,
      sourceType: "MC5_RESOLUTION_REFERENCE",
      referenceId: reference.id,
      replacementPath: "command.resolution",
      previewSummary: formatMechanicsCommandResolutionBuilderSummary(resolution),
      builder: "buildMechanicsCommandResolutionReferenceConfiguration",
    });
  }).filter(Boolean);
}

const ALL_COMPOSITION_ARGUMENT_OPTIONS = Object.freeze([
  { name: "actor", label: "Actor", type: "SELF" },
  { name: "target", label: "Target", type: "CHARACTER_PRESENT" },
  { name: "item", label: "Item", type: "ITEM_HELD" },
  { name: "visible_item", label: "Visible Item", type: "ITEM_VISIBLE" },
  { name: "condition", label: "Condition", type: "TEXT" },
  { name: "destination", label: "Destination", type: "LOCATION_CONNECTED" },
  { name: "amount", label: "Amount", type: "NUMBER" },
]);

function buildCompositionDefinitions() {
  const references = listMechanicsCommandCompositionReferences(
    ALL_COMPOSITION_ARGUMENT_OPTIONS
  );

  return references.map((reference) => {
    const metadata = COMPOSITION_METADATA[reference.id];
    const composition = buildMechanicsCommandCompositionReference(
      reference.id,
      ALL_COMPOSITION_ARGUMENT_OPTIONS
    );

    if (!metadata || !composition) return null;

    const summary = summarizeMechanicsCommandCompositionBuilder(composition);

    return makeBaseDefinition({
      id: metadata.id,
      label: reference.label,
      description: reference.description,
      scope: "COMMAND_COMPOSITION",
      category: "COMPOSITION",
      tags: metadata.tags,
      sourceType: "MC6_COMPOSITION_REFERENCE",
      referenceId: reference.id,
      replacementPath: "command.composition",
      requiredArgumentTypes: metadata.requiredArgumentTypes,
      previewSummary:
        `${summary.enabledMechanicsStepCount} Mechanics step${summary.enabledMechanicsStepCount === 1 ? "" : "s"}` +
        ` · ${summary.enabledDomainStepCount} domain action${summary.enabledDomainStepCount === 1 ? "" : "s"}`,
      builder: "buildMechanicsCommandCompositionReference",
    });
  }).filter(Boolean);
}

function buildCommandStarterDefinitions() {
  return listMechanicsCommandStarterPresets().map((starter) => {
    const command = buildMechanicsCommandStarterPreset(starter.id);
    if (!command) return null;

    const summary = summarizeMechanicsCommandStarterPreset(command);
    const argumentBadge = summary.argumentCount === 0
      ? "No Arguments"
      : `${summary.argumentCount} Typed Argument${summary.argumentCount === 1 ? "" : "s"}`;
    const domainBadge = summary.domainStepCount === 0
      ? "Mechanics Only"
      : `${summary.domainStepCount} Domain Action${summary.domainStepCount === 1 ? "" : "s"}`;

    return normalizeMechanicsPresetDefinition({
      version: MECHANICS_PRESET_DEFINITION_VERSION,
      id: starter.presetId,
      revision: 1,
      label: starter.label,
      description: starter.description,
      scope: "COMMAND",
      category: "COMMAND_STARTER",
      tags: starter.tags,
      source: {
        type: "MC7_COMMAND_STARTER",
        referenceId: starter.id,
      },
      application: {
        defaultMode: "REPLACE_COMMAND",
        allowedModes: ["REPLACE_COMMAND", "MERGE_COMMAND"],
        replacementPaths: ["command"],
        preservedPaths: PRESERVED_MODULE_PATHS_FOR_COMMAND_REPLACEMENT,
      },
      applicability: {
        creationTypes: [MECHANICS_MODULE_CREATION_TYPE],
        moduleDefinitionIds: [TRACKERS_MODULE_ID],
        requiredArgumentTypes: [],
        notes:
          "This preset supplies its own typed invocation arguments and replaces one selected command as a complete unit.",
      },
      preview: {
        eyebrow: "Command Starter",
        summary:
          `${summary.commandLabel} · ${summary.resolutionMode.replaceAll("_", " ")}`,
        badges: [argumentBadge, domainBadge, "Replace Command"],
      },
      implementation: {
        status: "READY",
        phase: "MC7B",
        builder: "buildMechanicsCommandStarterPreset",
      },
    });
  }).filter(Boolean);
}

function buildModuleStarterDefinitions() {
  return listMechanicsModuleStarterPresets().map((starter) => {
    const moduleData = buildMechanicsModuleStarterPreset(starter.id);
    if (!moduleData) return null;

    const runtimeImplementation =
      getMechanicsReferenceRuntimeImplementationForModuleStarter(starter.id);
    const summary = summarizeMechanicsModuleStarterPreset(moduleData);
    const domainBadge = starter.domainLanes.length
      ? starter.domainLanes.map((lane) => lane.replaceAll("_", " ")).join(" + ")
      : "Mechanics Only";

    return normalizeMechanicsPresetDefinition({
      version: MECHANICS_PRESET_DEFINITION_VERSION,
      id: starter.presetId,
      revision: 1,
      label: starter.label,
      description: starter.description,
      scope: "MODULE",
      category: "MODULE_STARTER",
      tags: starter.tags,
      source: {
        type: "MC7_MODULE_STARTER",
        referenceId: starter.id,
      },
      application: {
        defaultMode: "REPLACE_MODULE",
        allowedModes: ["REPLACE_MODULE", "MERGE_MODULE"],
        replacementPaths: ["module"],
        preservedPaths: PRESERVED_CREATION_PATHS_FOR_MODULE_REPLACEMENT,
      },
      applicability: {
        creationTypes: [MECHANICS_MODULE_CREATION_TYPE],
        moduleDefinitionIds: [TRACKERS_MODULE_ID],
        requiredArgumentTypes: [],
        notes:
          "This preset supplies a complete authored Mechanics Module data object and replaces the current module data as one validated unit.",
      },
      preview: {
        eyebrow: "Module Starter",
        summary:
          `${summary.commandCount} command${summary.commandCount === 1 ? "" : "s"}` +
          ` · ${summary.trackerCount} tracker${summary.trackerCount === 1 ? "" : "s"}` +
          ` · ${summary.guardCount} guard${summary.guardCount === 1 ? "" : "s"}`,
        badges: [domainBadge, `${summary.defaultCount} Defaults`, "Replace Module"],
      },
      implementation: {
        status: "READY",
        phase: "MC7C",
        builder: "buildMechanicsModuleStarterPreset",
        runtimeStatus: runtimeImplementation
          ? "REFERENCE_IMPLEMENTATION_READY"
          : "NOT_CONFIGURED",
        runtimePhase: runtimeImplementation ? "MC7E" : null,
        runtimeImplementationId: runtimeImplementation?.id || null,
        runtimeImplementationVersion: runtimeImplementation
          ? MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION
          : null,
      },
    });
  }).filter(Boolean);
}

const BASE_DEFINITIONS = Object.freeze([
  ...buildResolutionDefinitions(),
  ...buildCompositionDefinitions(),
  ...buildCommandStarterDefinitions(),
  ...buildModuleStarterDefinitions(),
]);

function normalizeArgumentOptions(value = []) {
  return normalizeMechanicsCommandCompositionArgumentOptions(value);
}

function getAvailability(definition, argumentOptions = []) {
  const availableArgumentTypes = new Set(
    normalizeArgumentOptions(argumentOptions).map((argument) => argument.type)
  );
  const missingArgumentTypes = definition.applicability.requiredArgumentTypes
    .filter((type) => !availableArgumentTypes.has(type));
  const available = missingArgumentTypes.length === 0;

  return {
    status: available ? "AVAILABLE" : "UNAVAILABLE",
    available,
    missingArgumentTypes,
    reason: available
      ? ""
      : `Requires ${missingArgumentTypes.join(", ")} command arguments.`,
  };
}

function withAvailability(definition, argumentOptions = []) {
  return {
    ...deepClone(definition),
    availability: getAvailability(definition, argumentOptions),
  };
}

function matchesQuery(definition, query) {
  const requested = normalizeString(query).toLowerCase();
  if (!requested) return true;

  const searchable = [
    definition.id,
    definition.label,
    definition.description,
    definition.scope,
    definition.category,
    ...definition.tags,
    definition.source.referenceId,
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(requested);
}

export function getMechanicsPresetCatalogManifest() {
  return {
    version: MECHANICS_PRESET_CATALOG_VERSION,
    definitionVersion: MECHANICS_PRESET_DEFINITION_VERSION,
    payloadVersion: MECHANICS_PRESET_PAYLOAD_VERSION,
    resolutionVersion: MECHANICS_COMMAND_RESOLUTION_VERSION,
    compositionVersion: MECHANICS_COMMAND_COMPOSITION_VERSION,
    commandStarterVersion: MECHANICS_COMMAND_STARTER_VERSION,
    moduleStarterVersion: MECHANICS_MODULE_STARTER_VERSION,
    referenceRuntimeImplementationVersion:
      MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
    referenceRuntimeImplementationCount:
      listMechanicsReferenceRuntimeImplementations().length,
    presetCount: BASE_DEFINITIONS.length,
    presets: BASE_DEFINITIONS.map((definition) => deepClone(definition)),
  };
}

export function listMechanicsPresetCatalog(options = {}) {
  const source =
    options && typeof options === "object" && !Array.isArray(options)
      ? options
      : {};
  const scopes = new Set(normalizeList(source.scopes || source.scope).map(normalizeUpper));
  const categories = new Set(
    normalizeList(source.categories || source.category).map(normalizeUpper)
  );
  const includeUnavailable = source.includeUnavailable !== false;
  const argumentOptions = normalizeArgumentOptions(source.argumentOptions);

  return BASE_DEFINITIONS
    .map((definition) => withAvailability(definition, argumentOptions))
    .filter((definition) => !scopes.size || scopes.has(definition.scope))
    .filter((definition) => !categories.size || categories.has(definition.category))
    .filter((definition) => matchesQuery(definition, source.query))
    .filter((definition) => includeUnavailable || definition.availability.available);
}

export function getMechanicsPresetDefinition(id, options = {}) {
  const requested = normalizeMechanicsPresetId(id);

  return listMechanicsPresetCatalog({
    ...options,
    includeUnavailable: true,
  }).find((definition) => definition.id === requested) || null;
}

function buildDefinitionValue(definition, argumentOptions = []) {
  if (definition.source.type === "MC5_RESOLUTION_REFERENCE") {
    return buildMechanicsCommandResolutionReferenceConfiguration(
      definition.source.referenceId
    );
  }

  if (definition.source.type === "MC6_COMPOSITION_REFERENCE") {
    return buildMechanicsCommandCompositionReference(
      definition.source.referenceId,
      argumentOptions
    );
  }

  if (definition.source.type === "MC7_COMMAND_STARTER") {
    return buildMechanicsCommandStarterPreset(
      definition.source.referenceId
    );
  }

  if (definition.source.type === "MC7_MODULE_STARTER") {
    return buildMechanicsModuleStarterPreset(
      definition.source.referenceId
    );
  }

  return null;
}

export function buildMechanicsPresetPayload(id, options = {}) {
  const argumentOptions = normalizeArgumentOptions(options.argumentOptions);
  const definition = getMechanicsPresetDefinition(id, { argumentOptions });

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

  if (!definition.availability.available) {
    return {
      ok: false,
      error: {
        code: "MECHANICS_PRESET_NOT_APPLICABLE",
        message: definition.availability.reason,
        missingArgumentTypes: [
          ...definition.availability.missingArgumentTypes,
        ],
      },
      definition,
      payload: null,
    };
  }

  const value = buildDefinitionValue(definition, argumentOptions);

  if (!value) {
    return {
      ok: false,
      error: {
        code: "MECHANICS_PRESET_BUILD_FAILED",
        message: `Mechanics preset "${definition.id}" could not be built.`,
      },
      definition,
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
      presetId: definition.id,
      presetRevision: definition.revision,
      scope: definition.scope,
      category: definition.category,
      applyMode: definition.application.defaultMode,
      replacementPaths: [...definition.application.replacementPaths],
      preservedPaths: [...definition.application.preservedPaths],
      source: deepClone(definition.source),
      value: deepClone(value),
    },
  };
}

export function summarizeMechanicsPresetCatalog(options = {}) {
  const presets = listMechanicsPresetCatalog(options);

  return {
    version: MECHANICS_PRESET_CATALOG_VERSION,
    total: presets.length,
    available: presets.filter((preset) => preset.availability.available).length,
    unavailable: presets.filter((preset) => !preset.availability.available).length,
    byScope: Object.fromEntries(
      [...new Set(presets.map((preset) => preset.scope))]
        .map((scope) => [
          scope,
          presets.filter((preset) => preset.scope === scope).length,
        ])
    ),
    byCategory: Object.fromEntries(
      [...new Set(presets.map((preset) => preset.category))]
        .map((category) => [
          category,
          presets.filter((preset) => preset.category === category).length,
        ])
    ),
  };
}

export function formatMechanicsPresetDefinitionSummary(definition = {}) {
  const preset = normalizeMechanicsPresetDefinition(definition);

  return [
    preset.label || preset.id,
    preset.scope.replaceAll("_", " "),
    preset.application.defaultMode.replaceAll("_", " "),
  ]
    .filter(Boolean)
    .join(" · ");
}
