import {
  MECHANICS_COMPOSITION_VERSION,
  MECHANICS_INSTANCE_DATA_VERSION,
  canonicalizeMechanicsModuleData,
  validateMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

export const MECHANICS_SAVED_ASSET_MIGRATION_VERSION =
  "mechanics_saved_asset_migration_v1";

export const MECHANICS_SAVED_ASSET_MIGRATION_STATUSES = Object.freeze([
  "CURRENT",
  "SAFE_NORMALIZATION_AVAILABLE",
  "EXPLICIT_ACTION_REQUIRED",
  "REJECTED",
  "NOT_APPLICABLE",
  "CONFIRMATION_REQUIRED",
  "APPLIED_IN_MEMORY",
]);

export const MECHANICS_SAVED_ASSET_EXPLICIT_ACTIONS = Object.freeze({
  SYNTHESIZE_STRUCTURED_INVOCATION: "SYNTHESIZE_STRUCTURED_INVOCATION",
  MERGE_CHARACTER_PROGRESS_READOUT: "MERGE_CHARACTER_PROGRESS_READOUT",
});

const MAX_CHANGED_PATHS = 256;
const MAX_NOTICES = 64;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asObject(value) {
  return isPlainObject(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeIdentifier(value, fallback = "") {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

function uniqueStrings(values = []) {
  return [...new Set(asArray(values).map(normalizeString).filter(Boolean))];
}

function deepClone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function stableJson(value) {
  return JSON.stringify(value);
}

function parseSimpleTrigger(value) {
  const trigger = normalizeString(value);
  const match = trigger.match(/^([/#!])([a-zA-Z0-9._:-]+)$/);

  return match
    ? {
        trigger,
        prefix: match[1],
        command: match[2].toLowerCase(),
      }
    : null;
}

function normalizePresentation(value = {}) {
  const source = asObject(value);
  const mode = normalizeString(source.mode).toUpperCase() || "MECHANICS_ACTION";

  return {
    ...source,
    mode,
    continueNarrative:
      typeof source.continueNarrative === "boolean"
        ? source.continueNarrative
        : mode === "MECHANICS_ACTION",
    advanceTime:
      typeof source.advanceTime === "boolean"
        ? source.advanceTime
        : mode === "MECHANICS_ACTION",
    resultVisibility:
      normalizeString(source.resultVisibility).toUpperCase() || "FULL",
  };
}

function normalizeComposition(value = {}) {
  const source = asObject(value);

  return {
    ...source,
    version:
      normalizeString(source.version) ||
      MECHANICS_COMPOSITION_VERSION ||
      "mechanics_command_composition_v1",
    mechanicsSteps: asArray(source.mechanicsSteps || source.mechanics_steps),
    domainSteps: asArray(source.domainSteps || source.domain_steps),
  };
}

function normalizeDomainAction(value = {}) {
  const source = asObject(value);

  return {
    ...source,
    version:
      normalizeString(source.version) || "mechanics_command_domain_action_v1",
    enabled: source.enabled === true,
    type: normalizeString(source.type).toUpperCase() || "NONE",
    applyOnOutcomes: asArray(source.applyOnOutcomes || source.apply_on_outcomes),
  };
}

function normalizeOutcomes(value = {}) {
  const source = asObject(value);

  return {
    ...source,
    version:
      normalizeString(source.version) || "mechanics_command_outcomes_v1",
  };
}

function normalizeInvocation({
  value,
  triggers,
  commandIndex,
  allowInvocationSynthesis,
  notices,
  explicitActions,
}) {
  const source = asObject(value);
  let command = normalizeString(source.command)
    .replace(/^[/#!]+/, "")
    .toLowerCase();
  let prefixes = uniqueStrings(source.prefixes);
  let aliases = uniqueStrings(source.aliases)
    .map((alias) => alias.replace(/^[/#!]+/, "").toLowerCase())
    .filter(Boolean);

  const simpleTriggers = asArray(triggers)
    .map(parseSimpleTrigger)
    .filter(Boolean);

  if (!command && simpleTriggers.length) {
    if (allowInvocationSynthesis) {
      command = simpleTriggers[0].command;
      prefixes = uniqueStrings([
        ...prefixes,
        ...simpleTriggers.map((entry) => entry.prefix),
      ]);
      aliases = uniqueStrings([
        ...aliases,
        ...simpleTriggers
          .slice(1)
          .map((entry) => entry.command)
          .filter((candidate) => candidate !== command),
      ]);
      notices.push({
        code: "STRUCTURED_INVOCATION_SYNTHESIZED",
        path: `$.instanceData.commands[${commandIndex}].invocation`,
        message:
          "A structured invocation was synthesized from a simple legacy trigger after explicit authorization.",
      });
    } else {
      explicitActions.push({
        code:
          MECHANICS_SAVED_ASSET_EXPLICIT_ACTIONS.SYNTHESIZE_STRUCTURED_INVOCATION,
        path: `$.instanceData.commands[${commandIndex}].invocation`,
        commandId: null,
        message:
          "A simple legacy trigger can be converted to structured invocation only through an explicit migration option.",
      });
    }
  } else if (!command && asArray(triggers).length) {
    notices.push({
      code: "LEGACY_TRIGGER_RETAINED",
      path: `$.instanceData.commands[${commandIndex}].triggers`,
      message:
        "The legacy trigger remains authoritative because it cannot be converted to a zero-argument structured command without changing semantics.",
    });
  }

  return {
    ...source,
    version:
      normalizeString(source.version) || "mechanics_command_invocation_v1",
    enabled: source.enabled !== false,
    command,
    prefixes: command ? (prefixes.length ? prefixes : ["/"]) : prefixes,
    aliases,
    arguments: asArray(source.arguments),
    caseSensitive: source.caseSensitive === true,
  };
}

function normalizeCommand(command, index, options, notices, explicitActions) {
  const source = asObject(command);
  const triggers = uniqueStrings(source.triggers);
  const invocation = normalizeInvocation({
    value: source.invocation,
    triggers,
    commandIndex: index,
    allowInvocationSynthesis: options.allowInvocationSynthesis === true,
    notices,
    explicitActions,
  });
  const id = normalizeIdentifier(
    source.id || source.key || invocation.command,
    `command_${index + 1}`
  );

  const normalized = {
    ...source,
    id,
    label: normalizeString(source.label) || id,
    commandContractVersion:
      normalizeString(source.commandContractVersion) ||
      "mechanics_command_contract_v1",
    invocation,
    requirements: asArray(source.requirements),
    attemptEffects: asArray(source.attemptEffects || source.attempt_effects),
    effects: asArray(source.effects),
    outcomes: normalizeOutcomes(source.outcomes),
    composition: normalizeComposition(
      source.composition ||
        source.commandComposition ||
        source.command_composition ||
        source.executionComposition
    ),
    domainAction: normalizeDomainAction(
      source.domainAction || source.domain_action
    ),
    presentation: normalizePresentation(source.presentation),
    triggers,
  };

  explicitActions.forEach((action) => {
    if (action.commandId === null && action.path.includes(`commands[${index}]`)) {
      action.commandId = id;
    }
  });

  return normalized;
}

function detectExplicitSnapshotActions(moduleData, explicitActions) {
  const commands = asArray(moduleData?.instanceData?.commands);
  const tokens = commands.flatMap((command) => {
    const invocation = asObject(command?.invocation);
    return [invocation.command, ...asArray(invocation.aliases)]
      .map((value) => normalizeString(value).toLowerCase())
      .filter(Boolean);
  });

  const hasAdvancement =
    tokens.includes("award_xp") &&
    tokens.includes("advancement_on") &&
    tokens.includes("advancement_off");
  const hasProgress =
    tokens.includes("progress") ||
    tokens.includes("level") ||
    tokens.includes("xp_status") ||
    tokens.includes("advancement_status");

  if (hasAdvancement && !hasProgress) {
    explicitActions.push({
      code:
        MECHANICS_SAVED_ASSET_EXPLICIT_ACTIONS.MERGE_CHARACTER_PROGRESS_READOUT,
      path: "$.instanceData.commands",
      commandId: null,
      presetId: "module.character_advancement_readout.v1",
      applyMode: "MERGE_MODULE",
      message:
        "This saved Character Advancement snapshot predates /progress. MC8B does not silently add the readout command; use the explicit readout preset merge.",
    });
  }
}

function normalizeModuleCollections(moduleData, options, notices, explicitActions) {
  const source = asObject(moduleData);
  const instanceData = asObject(source.instanceData);
  const moduleDefinitionId =
    normalizeString(source.moduleDefinitionId || source.moduleId) ||
    "core.trackers.v1";

  const normalized = {
    ...source,
    moduleDefinitionId,
    moduleId: moduleDefinitionId,
    priority: Number.isFinite(Number(source.priority))
      ? Number(source.priority)
      : 65,
    tags: uniqueStrings(source.tags),
    contractVersion:
      MECHANICS_INSTANCE_DATA_VERSION || "trackers_instance_data.v0_2",
    instanceData: {
      ...instanceData,
      contractVersion:
        MECHANICS_INSTANCE_DATA_VERSION || "trackers_instance_data.v0_2",
      trackers: asArray(instanceData.trackers),
      commands: asArray(instanceData.commands).map((command, index) =>
        normalizeCommand(command, index, options, notices, explicitActions)
      ),
      guards: asArray(instanceData.guards),
      statusBlocks: asArray(instanceData.statusBlocks),
      defaults: {
        ...asObject(instanceData.defaults),
        flags: asArray(instanceData.defaults?.flags),
        counters: asArray(instanceData.defaults?.counters),
        stages: asArray(instanceData.defaults?.stages),
      },
    },
  };

  detectExplicitSnapshotActions(normalized, explicitActions);
  return normalized;
}

function collectChangedPaths(left, right, path = "$", output = []) {
  if (output.length >= MAX_CHANGED_PATHS) return output;

  if (Object.is(left, right)) return output;

  const leftArray = Array.isArray(left);
  const rightArray = Array.isArray(right);

  if (leftArray || rightArray) {
    if (!leftArray || !rightArray) {
      output.push(path);
      return output;
    }

    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      collectChangedPaths(left[index], right[index], `${path}[${index}]`, output);
      if (output.length >= MAX_CHANGED_PATHS) break;
    }
    return output;
  }

  const leftObject = isPlainObject(left);
  const rightObject = isPlainObject(right);

  if (leftObject || rightObject) {
    if (!leftObject || !rightObject) {
      output.push(path);
      return output;
    }

    const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
    for (const key of keys) {
      collectChangedPaths(left[key], right[key], `${path}.${key}`, output);
      if (output.length >= MAX_CHANGED_PATHS) break;
    }
    return output;
  }

  output.push(path);
  return output;
}

function buildRejectedResult({ reason, errors = [], notices = [] } = {}) {
  return {
    version: MECHANICS_SAVED_ASSET_MIGRATION_VERSION,
    status: "REJECTED",
    applicable: true,
    dryRun: true,
    changed: false,
    applyAllowed: false,
    data: null,
    changedPaths: [],
    notices: notices.slice(0, MAX_NOTICES),
    explicitActions: [],
    validation: {
      valid: false,
      errors:
        errors.length
          ? deepClone(errors)
          : [{ path: "$", message: reason || "Migration rejected." }],
      warnings: [],
    },
  };
}

export function analyzeMechanicsSavedAssetMigration(value = {}, options = {}) {
  if (!isPlainObject(value) || !isPlainObject(value.instanceData)) {
    return {
      version: MECHANICS_SAVED_ASSET_MIGRATION_VERSION,
      status: "NOT_APPLICABLE",
      applicable: false,
      dryRun: true,
      changed: false,
      applyAllowed: false,
      data: null,
      changedPaths: [],
      notices: [],
      explicitActions: [],
      validation: {
        valid: false,
        errors: [
          {
            path: "$.instanceData",
            message:
              "Saved Mechanics asset migration requires a complete module object with instanceData.",
          },
        ],
        warnings: [],
      },
    };
  }

  const original = deepClone(value);
  const notices = [];
  const explicitActions = [];
  let canonical;

  try {
    canonical = canonicalizeMechanicsModuleData(original);
  } catch (error) {
    return buildRejectedResult({
      reason: error?.message || "Mechanics canonicalization failed.",
    });
  }

  const migrated = normalizeModuleCollections(
    canonical,
    options,
    notices,
    explicitActions
  );
  const validation = validateMechanicsModuleData(migrated);

  if (validation?.valid !== true || !validation?.data) {
    return buildRejectedResult({
      errors: validation?.errors || [],
      notices,
    });
  }

  const data = deepClone(validation.data);
  const changedPaths = collectChangedPaths(original, data);
  const changed = stableJson(original) !== stableJson(data);
  const synthesisRequired = explicitActions.some(
    (action) =>
      action.code ===
      MECHANICS_SAVED_ASSET_EXPLICIT_ACTIONS.SYNTHESIZE_STRUCTURED_INVOCATION
  );
  const status = synthesisRequired
    ? "EXPLICIT_ACTION_REQUIRED"
    : changed
      ? "SAFE_NORMALIZATION_AVAILABLE"
      : "CURRENT";

  return {
    version: MECHANICS_SAVED_ASSET_MIGRATION_VERSION,
    status,
    applicable: true,
    dryRun: true,
    changed,
    applyAllowed: !synthesisRequired,
    data,
    changedPaths,
    changedPathCount: changedPaths.length,
    changedPathsTruncated: changedPaths.length >= MAX_CHANGED_PATHS,
    notices: notices.slice(0, MAX_NOTICES),
    explicitActions: explicitActions.slice(0, MAX_NOTICES),
    validation: {
      version: validation.version || null,
      valid: true,
      errors: [],
      warnings: deepClone(validation.warnings || []),
    },
  };
}

export function applyMechanicsSavedAssetMigration({
  value = {},
  confirmed = false,
  allowInvocationSynthesis = false,
} = {}) {
  const analysis = analyzeMechanicsSavedAssetMigration(value, {
    allowInvocationSynthesis,
  });

  if (!confirmed) {
    return {
      ...analysis,
      status: "CONFIRMATION_REQUIRED",
      dryRun: false,
      applyAllowed: false,
      data: null,
    };
  }

  if (analysis.status === "REJECTED" || analysis.status === "NOT_APPLICABLE") {
    return {
      ...analysis,
      dryRun: false,
      data: null,
    };
  }

  if (
    analysis.status === "EXPLICIT_ACTION_REQUIRED" &&
    allowInvocationSynthesis !== true
  ) {
    return {
      ...analysis,
      dryRun: false,
      applyAllowed: false,
      data: null,
    };
  }

  return {
    ...analysis,
    status: "APPLIED_IN_MEMORY",
    dryRun: false,
    applyAllowed: true,
    data: deepClone(analysis.data),
  };
}

export function analyzeMechanicsSavedCommandMigration(command = {}, options = {}) {
  const wrapper = {
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    priority: 65,
    tags: [],
    contractVersion:
      MECHANICS_INSTANCE_DATA_VERSION || "trackers_instance_data.v0_2",
    instanceData: {
      contractVersion:
        MECHANICS_INSTANCE_DATA_VERSION || "trackers_instance_data.v0_2",
      trackers: [],
      commands: [deepClone(command)],
      guards: [],
      statusBlocks: [],
      defaults: { flags: [], counters: [], stages: [] },
    },
  };
  const analysis = analyzeMechanicsSavedAssetMigration(wrapper, options);

  return {
    ...analysis,
    command: analysis.data?.instanceData?.commands?.[0] || null,
  };
}

export function analyzeMechanicsSavedResolutionMigration(resolution = {}) {
  const analysis = analyzeMechanicsSavedCommandMigration({
    id: "resolution_probe",
    label: "Resolution Probe",
    invocation: {
      version: "mechanics_command_invocation_v1",
      enabled: true,
      command: "resolution_probe",
      prefixes: ["/"],
      aliases: [],
      arguments: [],
      caseSensitive: false,
    },
    requirements: [],
    attemptEffects: [],
    effects: [],
    outcomes: { version: "mechanics_command_outcomes_v1" },
    resolution: deepClone(resolution),
    domainAction: {
      version: "mechanics_command_domain_action_v1",
      enabled: false,
      type: "NONE",
      applyOnOutcomes: [],
    },
    presentation: {
      mode: "MECHANICS_ACTION",
      continueNarrative: true,
      advanceTime: true,
      resultVisibility: "FULL",
    },
    triggers: [],
  });

  return {
    ...analysis,
    resolution: analysis.command?.resolution || null,
  };
}
