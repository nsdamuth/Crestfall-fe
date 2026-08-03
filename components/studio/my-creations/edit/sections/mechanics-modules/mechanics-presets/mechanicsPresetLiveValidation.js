import {
  buildMechanicsPresetPayload,
  getMechanicsPresetDefinition,
} from "./mechanicsPresetLibrary.js";
import {
  getMechanicsReferenceRuntimeImplementation,
} from "./mechanicsReferenceRuntimeImplementations.js";

export const MECHANICS_PRESET_LIVE_VALIDATION_VERSION =
  "mechanics_preset_live_validation_v1";

const SAMPLE_ARGUMENTS_BY_TYPE = Object.freeze({
  CHARACTER_PRESENT: "kessa",
  CHARACTER_KNOWN: "kessa",
  CHARACTER_BOUND: "kessa",
  ITEM_HELD: "compass",
  ITEM_VISIBLE: "compass",
  ITEM_KNOWN: "compass",
  LOCATION_CURRENT: "current location",
  LOCATION_KNOWN: "silver market",
  LOCATION_CONNECTED: "silver market",
  NUMBER: "1",
  ENUM: "option",
  TEXT: "blinded",
});

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function humanize(value) {
  return normalizeString(value).replaceAll("_", " ");
}

function quoteWhenNeeded(value) {
  const text = normalizeString(value);
  if (!text) return "";
  return /\s/.test(text) ? `"${text}"` : text;
}

function sampleArgumentValue(argument = {}) {
  const type = normalizeString(argument.type).toUpperCase();
  if (["SELF", "PLAYER_CHARACTER"].includes(type)) return "";

  if (type === "ENUM") {
    return normalizeString(asArray(argument.options)[0]) || "option";
  }

  return SAMPLE_ARGUMENTS_BY_TYPE[type] || normalizeString(argument.name) || "value";
}

function buildInvocationExample(command = {}) {
  const invocation = asObject(command.invocation);
  const commandName = normalizeString(invocation.command);
  if (!commandName) return "";

  const prefix = normalizeString(asArray(invocation.prefixes)[0]) || "/";
  const argumentsText = asArray(invocation.arguments)
    .map((argument) => {
      const value = sampleArgumentValue(argument);
      if (!value) return "";
      return quoteWhenNeeded(value);
    })
    .filter(Boolean)
    .join(" ");

  return `${prefix}${commandName}${argumentsText ? ` ${argumentsText}` : ""}`;
}

function getCommandTarget(moduleData = {}, options = {}) {
  const commands = asArray(asObject(moduleData.instanceData).commands);
  const requested = normalizeString(options.commandId);
  const requestedIndex = Number(options.commandIndex);

  if (Number.isInteger(requestedIndex) && requestedIndex >= 0) {
    return commands[requestedIndex] || null;
  }

  return requested
    ? commands.find((command) => normalizeString(command?.id) === requested) || null
    : commands[0] || null;
}

function mapDomainActionToLane(actionType) {
  const type = normalizeString(actionType).toUpperCase();
  if (type.startsWith("ITEM_")) return "ITEM_RUNTIME";
  if (type.startsWith("LOCATION_")) return "LOCATION_RUNTIME";
  if (type.startsWith("PARTICIPANT_CONDITION_")) return "SENSORY_RUNTIME";
  return "";
}

function makeBaseGuide(definition) {
  return {
    version: MECHANICS_PRESET_LIVE_VALIDATION_VERSION,
    presetId: definition.id,
    presetLabel: definition.label,
    presetScope: definition.scope,
    presetCategory: definition.category,
    status: "READY",
    statusLabel: "Live Validation Ready",
    sourcePhase: definition.implementation?.phase || "MC7",
    runtimeImplementationId: "",
    runtimeImplementationVersion: "",
    testCommand: "",
    expectedOutcome: "",
    expectedDomainLanes: [],
    checks: [],
    steps: [],
    notes: [],
  };
}

function makeModuleGuide(definition) {
  const runtimeId = normalizeString(
    definition.implementation?.runtimeImplementationId
  );
  const runtime = runtimeId
    ? getMechanicsReferenceRuntimeImplementation(runtimeId)
    : null;

  if (!runtime) {
    const reference = asObject(definition.implementation?.liveValidation);
    const testCommand = normalizeString(reference.testCommand);
    const expectedOutcome = normalizeString(reference.expectedOutcome);
    const expectedDomainLanes = asArray(reference.expectedPatchLanes);
    const authorizationNote = normalizeString(reference.authorizationNote);

    return {
      ...makeBaseGuide(definition),
      status: normalizeString(reference.status) || "MANUAL_ONLY",
      statusLabel: reference.status
        ? "Reference Smoke Test Ready"
        : "Manual Validation",
      testCommand,
      expectedOutcome,
      expectedDomainLanes,
      checks: testCommand
        ? [
            `The command resolves as ${humanize(expectedOutcome) || "the configured outcome"}.`,
            "The parsed NUMBER argument becomes the authoritative experience-point delta before resolution.",
            "Level and proficiency steps reconcile against pending state and persist after refresh.",
          ]
        : [],
      steps: [
        "Apply the preset and save the Mechanics Module.",
        "Attach the module to a fresh Player Character test binding.",
        testCommand
          ? `Run ${testCommand}.`
          : "Run its primary command and verify the expected Mechanics changes.",
        "Verify XP, level, proficiency bonus, and level-up count after refresh.",
      ],
      notes: [
        authorizationNote ||
          "No deterministic MC7E reference runtime is registered for this module preset.",
      ],
    };
  }

  const expectedDomainLanes = asArray(runtime.expectedDomainLanes);
  return {
    ...makeBaseGuide(definition),
    status: "REFERENCE_RUNTIME_READY",
    statusLabel: "Reference Runtime Ready",
    sourcePhase: "MC7E",
    runtimeImplementationId: runtime.id,
    runtimeImplementationVersion: runtime.version,
    testCommand: runtime.userInput,
    expectedOutcome: runtime.expectedOutcome,
    expectedDomainLanes,
    checks: [
      `Command resolves as ${humanize(runtime.expectedOutcome) || "the configured outcome"}.`,
      expectedDomainLanes.length
        ? `Domain lanes remain isolated to ${expectedDomainLanes.map(humanize).join(" + ")}.`
        : "No cross-domain runtime lane is required.",
      "Mechanics values persist after refresh without replaying the same turn.",
    ],
    steps: [
      "Apply the preset, then use the normal page Save action.",
      "Attach the saved Mechanics Module to a fresh test chat instance.",
      `Run ${runtime.userInput}.`,
      "Compare the command result and runtime state with the expected checks below.",
    ],
    notes: [runtime.description],
  };
}

function makeCommandGuide(definition, options = {}) {
  const built = buildMechanicsPresetPayload(definition.id);
  const presetCommand = built.ok ? asObject(built.payload?.value) : {};
  const appliedCommand = getCommandTarget(options.moduleData, options);
  const command = appliedCommand || presetCommand;
  const resolutionMode = normalizeString(command.resolution?.mode).toUpperCase();
  const expectedOutcome =
    resolutionMode === "NO_ROLL_DETERMINISTIC" ? "SUCCESS" : "SERVER_ROLL";
  const domainSteps = asArray(command.composition?.domainSteps);
  const legacyDomainAction = asObject(command.domainAction);
  const domainTypes = [
    ...domainSteps.map((step) => normalizeString(step?.action?.type)),
    legacyDomainAction.enabled !== false
      ? normalizeString(legacyDomainAction.type)
      : "",
  ].filter((type) => type && type !== "NONE");
  const domainLanes = [
    ...new Set(domainTypes.map(mapDomainActionToLane).filter(Boolean)),
  ];

  return {
    ...makeBaseGuide(definition),
    status: "COMMAND_SMOKE_READY",
    statusLabel: "Command Smoke Test Ready",
    testCommand: buildInvocationExample(command),
    expectedOutcome,
    expectedDomainLanes: domainLanes,
    checks: [
      expectedOutcome === "SUCCESS"
        ? "The command resolves deterministically as Success."
        : "The command rolls on services-api and reports an authoritative outcome.",
      domainTypes.length
        ? `The configured domain action${domainTypes.length === 1 ? "" : "s"} run only on authorized outcomes.`
        : "Configured Mechanics effects follow the command outcome routing.",
      "Save and refresh preserve the complete command definition.",
    ],
    steps: [
      "Apply the command preset to the intended command.",
      "Save the Mechanics Module and refresh the editor.",
      `Run ${buildInvocationExample(command) || "the command"} in a fresh test chat.`,
      "Verify the result, state mutations, and any configured domain action.",
    ],
    notes: [
      "Sample Character, Item, condition, and Location names assume equivalent test-room targets are available.",
    ],
  };
}

function makeBlockGuide(definition, options = {}) {
  const command = getCommandTarget(options.moduleData, options);
  const testCommand = buildInvocationExample(command || {});

  return {
    ...makeBaseGuide(definition),
    status: "TARGET_COMMAND_SMOKE_READY",
    statusLabel: "Target Command Smoke Test",
    testCommand,
    expectedOutcome:
      definition.scope === "COMMAND_RESOLUTION" ? "CONFIGURED_RESOLUTION" : "CONFIGURED_ROUTING",
    checks: [
      definition.scope === "COMMAND_RESOLUTION"
        ? "The target command displays the selected authoritative resolution behavior."
        : "The target command executes the selected ordered composition and routing behavior.",
      "Unrelated command fields remain unchanged after apply and refresh.",
      "The JSON Editor and visual builder show the same canonical block.",
    ],
    steps: [
      "Apply the preset to the selected command.",
      "Save the Mechanics Module and refresh the editor.",
      testCommand
        ? `Run ${testCommand} in a fresh test chat.`
        : "Run the selected command in a fresh test chat.",
      "Verify the changed block and confirm unrelated command configuration was preserved.",
    ],
    notes: [],
  };
}

export function buildMechanicsPresetLiveValidationGuide(options = {}) {
  const definition = getMechanicsPresetDefinition(options.presetId, {
    argumentOptions: options.argumentOptions,
  });
  if (!definition) return null;

  if (definition.scope === "MODULE") {
    return makeModuleGuide(definition);
  }

  if (definition.scope === "COMMAND") {
    return makeCommandGuide(definition, options);
  }

  if (["COMMAND_RESOLUTION", "COMMAND_COMPOSITION"].includes(definition.scope)) {
    return makeBlockGuide(definition, options);
  }

  return {
    ...makeBaseGuide(definition),
    status: "MANUAL_ONLY",
    statusLabel: "Manual Validation",
    steps: [
      "Apply the preset and save the Mechanics Module.",
      "Refresh the editor and verify the expected configuration remains present.",
    ],
  };
}

export function summarizeMechanicsPresetLiveValidationGuide(guide = {}) {
  return {
    version: normalizeString(guide.version),
    presetId: normalizeString(guide.presetId),
    status: normalizeString(guide.status),
    testCommand: normalizeString(guide.testCommand),
    expectedOutcome: normalizeString(guide.expectedOutcome),
    expectedDomainLaneCount: asArray(guide.expectedDomainLanes).length,
    checkCount: asArray(guide.checks).length,
    stepCount: asArray(guide.steps).length,
  };
}
