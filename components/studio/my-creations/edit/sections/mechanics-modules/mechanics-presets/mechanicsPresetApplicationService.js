import {
  MECHANICS_PRESET_APPLY_MODES,
} from "./MechanicsPresetCatalog.contract.js";
import {
  buildMechanicsPresetPayload,
  getMechanicsPresetDefinition,
} from "./mechanicsPresetLibrary.js";
import {
  validateMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

export const MECHANICS_PRESET_APPLICATION_VERSION =
  "mechanics_preset_application_v1";

export const MECHANICS_PRESET_APPLICATION_CONFLICT_POLICY =
  "REJECT_ATOMICALLY";

export const MECHANICS_PRESET_APPLICATION_WARNING_BYTES = 72 * 1024;
export const MECHANICS_PRESET_APPLICATION_MAX_BYTES = 96 * 1024;

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
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

function deepClone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function uniqueStrings(values = []) {
  return [...new Set(asArray(values).map(normalizeString).filter(Boolean))];
}

function makeIssue(path, message, code = "MECHANICS_PRESET_APPLICATION_ERROR") {
  return { path, message, code };
}

export function getMechanicsModuleSerializedSize(value = {}) {
  const json = JSON.stringify(value ?? {});

  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(json).length;
  }

  return encodeURIComponent(json).replace(/%[0-9A-F]{2}|./gi, "x").length;
}

function buildSerializedSizeWarnings(serializedBytes) {
  if (serializedBytes <= MECHANICS_PRESET_APPLICATION_WARNING_BYTES) {
    return [];
  }

  return [
    makeIssue(
      "$",
      `The resulting Mechanics Module is ${serializedBytes.toLocaleString("en-US")} UTF-8 bytes. This is approaching the conservative ${MECHANICS_PRESET_APPLICATION_MAX_BYTES.toLocaleString("en-US")}-byte authoring budget.`,
      "MECHANICS_PRESET_SERIALIZED_SIZE_WARNING"
    ),
  ];
}

function getInstanceData(moduleData = {}) {
  return asObject(asObject(moduleData).instanceData);
}

function getCommands(moduleData = {}) {
  return asArray(getInstanceData(moduleData).commands);
}

function getCommandArgumentOptions(command = {}) {
  return asArray(asObject(asObject(command).invocation).arguments)
    .map((argument) => ({
      name: normalizeString(argument?.name),
      label:
        normalizeString(argument?.label) ||
        normalizeString(argument?.name) ||
        "Argument",
      type: normalizeUpper(argument?.type),
    }))
    .filter((argument) => argument.name && argument.type);
}

export function listMechanicsPresetCommandTargets(moduleData = {}) {
  return getCommands(moduleData).map((command, index) => {
    const invocation = asObject(command?.invocation);
    const commandName = normalizeString(invocation.command);
    const prefix = normalizeString(asArray(invocation.prefixes)[0]) || "/";

    return {
      id: normalizeString(command?.id) || `command_${index + 1}`,
      index,
      label:
        normalizeString(command?.label) ||
        normalizeString(command?.id) ||
        `Command ${index + 1}`,
      invocationLabel: commandName ? `${prefix}${commandName}` : "No invocation",
      argumentOptions: getCommandArgumentOptions(command),
    };
  });
}

function resolveCommandTarget(moduleData, options = {}) {
  const commands = getCommands(moduleData);
  const requestedId = normalizeString(options.commandId);
  const requestedIndex = Number(options.commandIndex);

  let index = Number.isInteger(requestedIndex) ? requestedIndex : -1;
  if (requestedId) {
    index = commands.findIndex(
      (command) => normalizeString(command?.id) === requestedId
    );
  }

  if (index < 0 || index >= commands.length) {
    return {
      ok: false,
      index: -1,
      command: null,
      error: makeIssue(
        "$.instanceData.commands",
        "Select a command before applying a command-level Mechanics preset.",
        "MECHANICS_PRESET_COMMAND_TARGET_REQUIRED"
      ),
    };
  }

  return {
    ok: true,
    index,
    command: commands[index],
    error: null,
  };
}

function commandInvocationTokens(command = {}) {
  const invocation = asObject(command?.invocation);
  const primary = normalizeString(invocation.command).toLowerCase();
  const aliases = uniqueStrings(invocation.aliases).map((value) => value.toLowerCase());
  return [primary, ...aliases].filter(Boolean);
}

function collectModuleMergeConflicts(currentData = {}, presetData = {}) {
  const conflicts = [];
  const currentInstance = getInstanceData(currentData);
  const presetInstance = getInstanceData(presetData);

  const collections = [
    ["trackers", "tracker"],
    ["commands", "command"],
    ["guards", "guard"],
    ["statusBlocks", "status block"],
  ];

  for (const [key, label] of collections) {
    const existing = new Set(
      asArray(currentInstance[key])
        .map((entry) => normalizeString(entry?.id))
        .filter(Boolean)
    );

    asArray(presetInstance[key]).forEach((entry, index) => {
      const id = normalizeString(entry?.id);
      if (id && existing.has(id)) {
        conflicts.push(
          makeIssue(
            `$.instanceData.${key}[${index}].id`,
            `Cannot merge preset ${label} "${id}" because that ID already exists.`,
            "MECHANICS_PRESET_MODULE_ID_CONFLICT"
          )
        );
      }
    });
  }

  for (const bucket of ["flags", "counters", "stages"]) {
    const existing = new Set(
      asArray(currentInstance.defaults?.[bucket])
        .map((entry) => normalizeString(entry?.id))
        .filter(Boolean)
    );

    asArray(presetInstance.defaults?.[bucket]).forEach((entry, index) => {
      const id = normalizeString(entry?.id);
      if (id && existing.has(id)) {
        conflicts.push(
          makeIssue(
            `$.instanceData.defaults.${bucket}[${index}].id`,
            `Cannot merge preset ${bucket.slice(0, -1)} "${id}" because that ID already exists.`,
            "MECHANICS_PRESET_MODULE_DEFAULT_CONFLICT"
          )
        );
      }
    });
  }

  const existingTokens = new Set(
    asArray(currentInstance.commands).flatMap(commandInvocationTokens)
  );
  asArray(presetInstance.commands).forEach((command, commandIndex) => {
    commandInvocationTokens(command).forEach((token) => {
      if (existingTokens.has(token)) {
        conflicts.push(
          makeIssue(
            `$.instanceData.commands[${commandIndex}].invocation`,
            `Cannot merge preset command invocation "${token}" because it is already used by the module.`,
            "MECHANICS_PRESET_MODULE_INVOCATION_CONFLICT"
          )
        );
      }
    });
  });

  const currentModuleId = normalizeString(
    currentData.moduleDefinitionId || currentData.moduleId
  );
  const presetModuleId = normalizeString(
    presetData.moduleDefinitionId || presetData.moduleId
  );
  if (currentModuleId && presetModuleId && currentModuleId !== presetModuleId) {
    conflicts.push(
      makeIssue(
        "$.moduleDefinitionId",
        `Cannot merge module definition "${presetModuleId}" into "${currentModuleId}".`,
        "MECHANICS_PRESET_MODULE_DEFINITION_CONFLICT"
      )
    );
  }

  return conflicts;
}

function mergeCommandIdentity(currentCommand = {}, presetCommand = {}) {
  const current = asObject(currentCommand);
  const preset = asObject(presetCommand);
  const currentInvocation = asObject(current.invocation);
  const presetInvocation = asObject(preset.invocation);

  return {
    ...deepClone(preset),
    id: normalizeString(current.id) || normalizeString(preset.id),
    label: normalizeString(current.label) || normalizeString(preset.label),
    reason: normalizeString(current.reason) || normalizeString(preset.reason),
    invocation: {
      ...deepClone(presetInvocation),
      enabled:
        typeof currentInvocation.enabled === "boolean"
          ? currentInvocation.enabled
          : presetInvocation.enabled,
      command:
        normalizeString(currentInvocation.command) ||
        normalizeString(presetInvocation.command),
      prefixes: uniqueStrings(currentInvocation.prefixes).length
        ? uniqueStrings(currentInvocation.prefixes)
        : uniqueStrings(presetInvocation.prefixes),
      aliases: uniqueStrings([
        ...asArray(currentInvocation.aliases),
        ...asArray(presetInvocation.aliases),
      ]),
      arguments: deepClone(asArray(presetInvocation.arguments)),
      caseSensitive: false,
    },
    presentation: isObject(current.presentation)
      ? deepClone(current.presentation)
      : deepClone(preset.presentation),
    triggers: uniqueStrings([
      ...asArray(current.triggers),
      ...asArray(preset.triggers),
    ]),
  };
}

function mergeModuleData(currentData = {}, presetData = {}) {
  const current = asObject(currentData);
  const preset = asObject(presetData);
  const currentInstance = getInstanceData(current);
  const presetInstance = getInstanceData(preset);
  const currentDefaults = asObject(currentInstance.defaults);
  const presetDefaults = asObject(presetInstance.defaults);
  const moduleDefinitionId = normalizeString(
    current.moduleDefinitionId ||
      current.moduleId ||
      preset.moduleDefinitionId ||
      preset.moduleId
  );

  return {
    ...deepClone(preset),
    ...deepClone(current),
    moduleDefinitionId,
    moduleId: moduleDefinitionId,
    priority: Number.isFinite(Number(current.priority))
      ? Number(current.priority)
      : Number(preset.priority) || 65,
    tags: uniqueStrings([...asArray(current.tags), ...asArray(preset.tags)]),
    contractVersion:
      normalizeString(preset.contractVersion) ||
      normalizeString(current.contractVersion),
    instanceData: {
      ...deepClone(presetInstance),
      ...deepClone(currentInstance),
      contractVersion:
        normalizeString(presetInstance.contractVersion) ||
        normalizeString(currentInstance.contractVersion),
      trackers: [
        ...deepClone(asArray(currentInstance.trackers)),
        ...deepClone(asArray(presetInstance.trackers)),
      ],
      commands: [
        ...deepClone(asArray(currentInstance.commands)),
        ...deepClone(asArray(presetInstance.commands)),
      ],
      guards: [
        ...deepClone(asArray(currentInstance.guards)),
        ...deepClone(asArray(presetInstance.guards)),
      ],
      statusBlocks: [
        ...deepClone(asArray(currentInstance.statusBlocks)),
        ...deepClone(asArray(presetInstance.statusBlocks)),
      ],
      defaults: {
        ...deepClone(presetDefaults),
        ...deepClone(currentDefaults),
        flags: [
          ...deepClone(asArray(currentDefaults.flags)),
          ...deepClone(asArray(presetDefaults.flags)),
        ],
        counters: [
          ...deepClone(asArray(currentDefaults.counters)),
          ...deepClone(asArray(presetDefaults.counters)),
        ],
        stages: [
          ...deepClone(asArray(currentDefaults.stages)),
          ...deepClone(asArray(presetDefaults.stages)),
        ],
      },
    },
  };
}

function buildStateReferenceWarnings(moduleData = {}) {
  const instance = getInstanceData(moduleData);
  const defined = new Set([
    ...asArray(instance.trackers).map((entry) => normalizeString(entry?.id)),
    ...asArray(instance.defaults?.flags).map((entry) => normalizeString(entry?.id)),
    ...asArray(instance.defaults?.counters).map((entry) => normalizeString(entry?.id)),
    ...asArray(instance.defaults?.stages).map((entry) => normalizeString(entry?.id)),
  ].filter(Boolean));
  const references = [];

  function addReference(path, id) {
    const normalized = normalizeString(id);
    if (normalized && !defined.has(normalized)) references.push({ path, id: normalized });
  }

  asArray(instance.commands).forEach((command, commandIndex) => {
    asArray(command?.requirements).forEach((requirement, index) => {
      if (![
        "TARGET_PRESENT",
        "TARGET_HELD",
        "PROGRESSION_MINIMUM_LEVEL",
        "PROGRESSION_MAXIMUM_LEVEL",
        "PROGRESSION_REQUIRED_TIER",
        "PROGRESSION_FORBIDDEN_TIER",
        "PROGRESSION_AT_MAXIMUM_LEVEL",
      ].includes(normalizeUpper(requirement?.type))) {
        addReference(
          `$.instanceData.commands[${commandIndex}].requirements[${index}].targetId`,
          requirement?.targetId
        );
      }
    });

    const effectGroups = [
      ["effects", asArray(command?.effects)],
      ["attemptEffects", asArray(command?.attemptEffects)],
    ];
    for (const outcome of ["CRITICAL_SUCCESS", "SUCCESS", "FAILURE", "FUMBLE"]) {
      effectGroups.push([
        `outcomes.${outcome}.effects`,
        asArray(command?.outcomes?.[outcome]?.effects),
      ]);
    }
    asArray(command?.composition?.mechanicsSteps).forEach((step, stepIndex) => {
      effectGroups.push([
        `composition.mechanicsSteps[${stepIndex}].effects`,
        asArray(step?.effects),
      ]);
      asArray(step?.conditions).forEach((condition, conditionIndex) => {
        addReference(
          `$.instanceData.commands[${commandIndex}].composition.mechanicsSteps[${stepIndex}].conditions[${conditionIndex}].mechanicsId`,
          condition?.mechanicsId
        );
      });
    });

    effectGroups.forEach(([groupPath, effects]) => {
      effects.forEach((effect, effectIndex) => {
        const effectPath =
          `$.instanceData.commands[${commandIndex}].${groupPath}[${effectIndex}]`;
        addReference(`${effectPath}.targetId`, effect?.targetId);

        if (normalizeUpper(effect?.type) === "PROGRESSION_RECONCILE") {
          const profile = asObject(
            effect?.progressionProfile || effect?.progression_profile
          );
          addReference(`${effectPath}.progressionProfile.sourceValueId`, profile.sourceValueId);
          addReference(`${effectPath}.progressionProfile.rankValueId`, profile.rankValueId);
          addReference(
            `${effectPath}.progressionProfile.advancementCounterId`,
            profile.advancementCounterId
          );
          asArray(profile.derivedValues).forEach((rule, ruleIndex) =>
            addReference(
              `${effectPath}.progressionProfile.derivedValues[${ruleIndex}].id`,
              rule?.id
            )
          );
        }
      });
    });
  });

  return references.map((reference) =>
    makeIssue(
      reference.path,
      `Mechanics state "${reference.id}" is referenced but is not declared by a tracker or default entry. The runtime may create some values on first write, but requirements can remain unavailable until the state exists.`,
      "MECHANICS_PRESET_UNDECLARED_STATE_REFERENCE"
    )
  );
}

function applyPayload(moduleData, payload, options) {
  const current = deepClone(asObject(moduleData));
  const mode = normalizeUpper(options.applyMode || payload.applyMode);
  const scope = normalizeUpper(payload.scope);
  const target = ["COMMAND_RESOLUTION", "COMMAND_COMPOSITION", "COMMAND"].includes(scope)
    ? resolveCommandTarget(current, options)
    : null;

  if (target && !target.ok) {
    return { ok: false, errors: [target.error], nextData: null, commandIndex: -1 };
  }

  if (mode === "REPLACE_BLOCK") {
    if (!["COMMAND_RESOLUTION", "COMMAND_COMPOSITION"].includes(scope)) {
      return {
        ok: false,
        errors: [makeIssue("$.applyMode", `REPLACE_BLOCK is not valid for ${scope}.`)],
        nextData: null,
        commandIndex: target?.index ?? -1,
      };
    }
    const commands = getCommands(current).map((command, index) =>
      index === target.index
        ? {
            ...deepClone(command),
            [scope === "COMMAND_RESOLUTION" ? "resolution" : "composition"]:
              deepClone(payload.value),
          }
        : deepClone(command)
    );
    return {
      ok: true,
      errors: [],
      nextData: {
        ...current,
        instanceData: { ...getInstanceData(current), commands },
      },
      commandIndex: target.index,
    };
  }

  if (mode === "REPLACE_COMMAND") {
    if (scope !== "COMMAND") {
      return { ok: false, errors: [makeIssue("$.applyMode", `REPLACE_COMMAND is not valid for ${scope}.`)], nextData: null, commandIndex: target?.index ?? -1 };
    }
    const otherCommands = getCommands(current).filter((_command, index) => index !== target.index);
    const id = normalizeString(payload.value?.id);
    if (id && otherCommands.some((command) => normalizeString(command?.id) === id)) {
      return {
        ok: false,
        errors: [makeIssue("$.instanceData.commands", `Cannot replace the selected command because preset command ID "${id}" is already used by another command.`, "MECHANICS_PRESET_COMMAND_ID_CONFLICT")],
        nextData: null,
        commandIndex: target.index,
      };
    }
    const otherTokens = new Set(otherCommands.flatMap(commandInvocationTokens));
    const collisions = commandInvocationTokens(payload.value).filter((token) => otherTokens.has(token));
    if (collisions.length) {
      return {
        ok: false,
        errors: [makeIssue("$.instanceData.commands", `Cannot replace the selected command because invocation "${collisions[0]}" is already used by another command.`, "MECHANICS_PRESET_COMMAND_INVOCATION_CONFLICT")],
        nextData: null,
        commandIndex: target.index,
      };
    }
    const commands = getCommands(current).map((command, index) =>
      index === target.index ? deepClone(payload.value) : deepClone(command)
    );
    return { ok: true, errors: [], nextData: { ...current, instanceData: { ...getInstanceData(current), commands } }, commandIndex: target.index };
  }

  if (mode === "MERGE_COMMAND") {
    if (scope !== "COMMAND") {
      return { ok: false, errors: [makeIssue("$.applyMode", `MERGE_COMMAND is not valid for ${scope}.`)], nextData: null, commandIndex: target?.index ?? -1 };
    }
    const merged = mergeCommandIdentity(target.command, payload.value);
    const otherCommands = getCommands(current).filter(
      (_command, index) => index !== target.index
    );
    const otherTokens = new Set(otherCommands.flatMap(commandInvocationTokens));
    const collisions = commandInvocationTokens(merged).filter((token) =>
      otherTokens.has(token)
    );
    if (collisions.length) {
      return {
        ok: false,
        errors: [makeIssue(
          "$.instanceData.commands",
          `Cannot merge the preset because invocation "${collisions[0]}" is already used by another command.`,
          "MECHANICS_PRESET_COMMAND_INVOCATION_CONFLICT"
        )],
        nextData: null,
        commandIndex: target.index,
      };
    }
    const commands = getCommands(current).map((command, index) =>
      index === target.index ? merged : deepClone(command)
    );
    return { ok: true, errors: [], nextData: { ...current, instanceData: { ...getInstanceData(current), commands } }, commandIndex: target.index };
  }

  if (mode === "REPLACE_MODULE") {
    if (scope !== "MODULE") {
      return { ok: false, errors: [makeIssue("$.applyMode", `REPLACE_MODULE is not valid for ${scope}.`)], nextData: null, commandIndex: -1 };
    }
    return { ok: true, errors: [], nextData: deepClone(payload.value), commandIndex: -1 };
  }

  if (mode === "MERGE_MODULE") {
    if (scope !== "MODULE") {
      return { ok: false, errors: [makeIssue("$.applyMode", `MERGE_MODULE is not valid for ${scope}.`)], nextData: null, commandIndex: -1 };
    }
    const conflicts = collectModuleMergeConflicts(current, payload.value);
    if (conflicts.length) {
      return { ok: false, errors: conflicts, nextData: null, commandIndex: -1 };
    }
    return { ok: true, errors: [], nextData: mergeModuleData(current, payload.value), commandIndex: -1 };
  }

  return {
    ok: false,
    errors: [makeIssue("$.applyMode", `Unsupported Mechanics preset apply mode "${mode || "(missing)"}".`)],
    nextData: null,
    commandIndex: target?.index ?? -1,
  };
}

function summarizeCounts(moduleData = {}) {
  const instance = getInstanceData(moduleData);
  const defaults = asObject(instance.defaults);
  return {
    trackerCount: asArray(instance.trackers).length,
    commandCount: asArray(instance.commands).length,
    guardCount: asArray(instance.guards).length,
    statusBlockCount: asArray(instance.statusBlocks).length,
    defaultCount:
      asArray(defaults.flags).length +
      asArray(defaults.counters).length +
      asArray(defaults.stages).length,
  };
}

export function previewMechanicsPresetApplication(options = {}) {
  const moduleData = asObject(options.moduleData);
  const target = resolveCommandTarget(moduleData, options);
  const argumentOptions = target.ok ? getCommandArgumentOptions(target.command) : [];
  const definition = getMechanicsPresetDefinition(options.presetId, { argumentOptions });
  const mode = normalizeUpper(options.applyMode || definition?.application?.defaultMode);
  const application = applyMechanicsPresetToModuleData({
    ...options,
    previewOnly: true,
  });

  return {
    version: MECHANICS_PRESET_APPLICATION_VERSION,
    valid: application.ok,
    errors: application.errors,
    warnings: application.warnings,
    definition: application.definition,
    applyMode: mode,
    commandIndex: application.commandIndex,
    destructive: ["REPLACE_COMMAND", "REPLACE_MODULE"].includes(mode),
    currentCounts: summarizeCounts(moduleData),
    nextCounts: application.ok ? summarizeCounts(application.data) : null,
    currentSerializedBytes: getMechanicsModuleSerializedSize(moduleData),
    nextSerializedBytes: application.ok
      ? getMechanicsModuleSerializedSize(application.data)
      : null,
    maximumSerializedBytes: MECHANICS_PRESET_APPLICATION_MAX_BYTES,
    changedPaths: application.audit?.changedPaths || [],
    preservedPaths: application.audit?.preservedPaths || [],
  };
}

export function applyMechanicsPresetToModuleData(options = {}) {
  const moduleData = asObject(options.moduleData);
  const target = resolveCommandTarget(moduleData, options);
  const preliminaryDefinition = getMechanicsPresetDefinition(options.presetId, {
    argumentOptions: target.ok ? getCommandArgumentOptions(target.command) : [],
  });
  const scope = normalizeUpper(preliminaryDefinition?.scope);
  const requiresTarget = ["COMMAND_RESOLUTION", "COMMAND_COMPOSITION", "COMMAND"].includes(scope);

  if (requiresTarget && !target.ok) {
    return {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      ok: false,
      errors: [target.error],
      warnings: [],
      data: null,
      definition: preliminaryDefinition,
      payload: null,
      commandIndex: -1,
      audit: null,
    };
  }

  const argumentOptions = target.ok ? getCommandArgumentOptions(target.command) : [];
  const built = buildMechanicsPresetPayload(options.presetId, { argumentOptions });
  if (!built.ok) {
    return {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      ok: false,
      errors: [
        makeIssue(
          "$.presetId",
          built.error?.message || "The Mechanics preset could not be built.",
          built.error?.code || "MECHANICS_PRESET_BUILD_FAILED"
        ),
      ],
      warnings: [],
      data: null,
      definition: built.definition,
      payload: null,
      commandIndex: target.index,
      audit: null,
    };
  }

  const mode = normalizeUpper(options.applyMode || built.payload.applyMode);
  if (!MECHANICS_PRESET_APPLY_MODES.includes(mode)) {
    return {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      ok: false,
      errors: [makeIssue("$.applyMode", `Unknown Mechanics preset apply mode "${mode}".`)],
      warnings: [],
      data: null,
      definition: built.definition,
      payload: built.payload,
      commandIndex: target.index,
      audit: null,
    };
  }

  if (!built.definition.application.allowedModes.includes(mode)) {
    return {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      ok: false,
      errors: [makeIssue("$.applyMode", `${mode} is not allowed for preset ${built.definition.id}.`, "MECHANICS_PRESET_APPLY_MODE_NOT_ALLOWED")],
      warnings: [],
      data: null,
      definition: built.definition,
      payload: built.payload,
      commandIndex: target.index,
      audit: null,
    };
  }

  const applied = applyPayload(moduleData, built.payload, {
    ...options,
    applyMode: mode,
  });
  if (!applied.ok) {
    return {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      ok: false,
      errors: applied.errors,
      warnings: [],
      data: null,
      definition: built.definition,
      payload: built.payload,
      commandIndex: applied.commandIndex,
      audit: null,
    };
  }

  const validation = validateMechanicsModuleData(applied.nextData);
  if (!validation.valid) {
    return {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      ok: false,
      errors: validation.errors.map((issue) => ({
        ...issue,
        code: "MECHANICS_PRESET_COMPLIANCE_REJECTED",
      })),
      warnings: validation.warnings,
      data: null,
      definition: built.definition,
      payload: built.payload,
      commandIndex: applied.commandIndex,
      audit: null,
    };
  }

  const serializedBytes = getMechanicsModuleSerializedSize(validation.data);
  if (serializedBytes > MECHANICS_PRESET_APPLICATION_MAX_BYTES) {
    return {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      ok: false,
      errors: [
        makeIssue(
          "$",
          `The resulting Mechanics Module is ${serializedBytes.toLocaleString("en-US")} UTF-8 bytes and exceeds the conservative ${MECHANICS_PRESET_APPLICATION_MAX_BYTES.toLocaleString("en-US")}-byte authoring budget. Split the mechanics into separate modules or use compact progression profiles before saving.`,
          "MECHANICS_PRESET_SERIALIZED_SIZE_EXCEEDED"
        ),
      ],
      warnings: validation.warnings,
      data: null,
      definition: built.definition,
      payload: built.payload,
      commandIndex: applied.commandIndex,
      audit: null,
    };
  }

  const referenceWarnings = buildStateReferenceWarnings(validation.data);
  const sizeWarnings = buildSerializedSizeWarnings(serializedBytes);
  return {
    version: MECHANICS_PRESET_APPLICATION_VERSION,
    ok: true,
    errors: [],
    warnings: [...validation.warnings, ...referenceWarnings, ...sizeWarnings],
    data: validation.data,
    definition: built.definition,
    payload: built.payload,
    commandIndex: applied.commandIndex,
    audit: {
      version: MECHANICS_PRESET_APPLICATION_VERSION,
      presetId: built.definition.id,
      presetRevision: built.definition.revision,
      scope: built.definition.scope,
      applyMode: mode,
      conflictPolicy: MECHANICS_PRESET_APPLICATION_CONFLICT_POLICY,
      changedPaths: [...built.definition.application.replacementPaths],
      preservedPaths: [...built.definition.application.preservedPaths],
      commandIndex: applied.commandIndex,
      validationVersion: validation.version,
      warningCount:
        referenceWarnings.length +
        validation.warnings.length +
        sizeWarnings.length,
      serializedBytes,
      maximumSerializedBytes: MECHANICS_PRESET_APPLICATION_MAX_BYTES,
      previewOnly: options.previewOnly === true,
    },
  };
}
