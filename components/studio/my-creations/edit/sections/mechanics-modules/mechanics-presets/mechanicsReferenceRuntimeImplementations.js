import {
  buildMechanicsModuleStarterPreset,
} from "./mechanicsModuleStarterPresets.js";

export const MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION =
  "mechanics_reference_runtime_implementation_v1";

export const MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS = Object.freeze([
  "runtime.resource_loop.v1",
  "runtime.social_probe.v1",
  "runtime.item_handoff.v1",
  "runtime.travel_navigation.v1",
  "runtime.quest_progress.v1",
]);

const ROOM = Object.freeze({
  id: "mc7_reference_room",
  title: "MC7 Reference Room",
});

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function deepClone(value) {
  return value === undefined
    ? undefined
    : JSON.parse(JSON.stringify(value));
}

function mechanicsEntry(id, value, extra = {}) {
  return {
    id,
    value,
    previousValue: value,
    lastDelta: 0,
    ...extra,
  };
}

function buildInitialMechanicsState(moduleData = {}) {
  const instanceData = moduleData?.instanceData || {};
  const defaults = instanceData.defaults || {};
  const meters = Object.fromEntries(
    (Array.isArray(instanceData.trackers) ? instanceData.trackers : []).map(
      (tracker) => [
        tracker.id,
        mechanicsEntry(tracker.id, Number(tracker.initial) || 0, {
          label: tracker.label || tracker.id,
          kind: "METER",
          min: Number.isFinite(Number(tracker.min)) ? Number(tracker.min) : 0,
          max: Number.isFinite(Number(tracker.max)) ? Number(tracker.max) : 100,
        }),
      ]
    )
  );
  const flags = Object.fromEntries(
    (Array.isArray(defaults.flags) ? defaults.flags : []).map((entry) => [
      entry.id,
      mechanicsEntry(entry.id, entry.initial === true),
    ])
  );
  const counters = Object.fromEntries(
    (Array.isArray(defaults.counters) ? defaults.counters : []).map((entry) => [
      entry.id,
      mechanicsEntry(entry.id, Number(entry.initial) || 0),
    ])
  );
  const stages = Object.fromEntries(
    (Array.isArray(defaults.stages) ? defaults.stages : []).map((entry) => [
      entry.id,
      mechanicsEntry(entry.id, String(entry.initial ?? "")),
    ])
  );

  return {
    state: {
      mechanics: {
        version: "mechanics_state_v0",
        meters: { byId: meters },
        flags: { byId: flags },
        counters: { byId: counters },
        stages: { byId: stages },
        scopes: { byKey: {} },
      },
      mechanicsApplicator: {
        appliedCommandKeys: [],
        recentApplications: [],
      },
    },
  };
}

function targetResolution(argumentsList, argumentValues, targetsByArgument) {
  return {
    status: "RESOLVED",
    arguments: argumentsList.map((argument) => ({
      ...argument,
      status: "RESOLVED",
      value: argumentValues[argument.name] ?? null,
      target: targetsByArgument[argument.name] || null,
    })),
    argumentValues,
    targetsByArgument,
    errors: [],
  };
}

function makeInvocation({ command, argumentValues = {}, targetsByArgument = {} }) {
  const argumentsList = Array.isArray(command?.invocation?.arguments)
    ? command.invocation.arguments
    : [];

  return {
    version: "mechanics_command_invocation_v1",
    status: "MATCHED",
    commandId: command.id,
    commandLabel: command.label,
    canonicalCommand: command.invocation?.command || "",
    commandToken: `/${command.invocation?.command || ""}`,
    argumentValues,
    arguments: argumentsList,
    targetResolution: targetResolution(
      argumentsList,
      argumentValues,
      targetsByArgument
    ),
  };
}

const ACTOR = Object.freeze({
  id: "participant_actor",
  participantId: "participant_actor",
  participantType: "PLAYER_CHARACTER",
  creationId: "creation_actor",
  canonicalName: "Reference Hero",
  isPresent: true,
  isActive: true,
});

const KESSA = Object.freeze({
  id: "participant_kessa",
  participantId: "participant_kessa",
  participantType: "CHARACTER",
  creationId: "creation_kessa",
  canonicalName: "Kessa Cindervell",
  isPresent: true,
  isActive: true,
});

const COMPASS = Object.freeze({
  type: "ITEM",
  instanceEntityId: "item_reference_compass",
  runtimeDefinitionId: "reference_compass",
  registryEntryId: "reference_compass",
  canonicalName: "Reference Compass",
  isInitialized: true,
  quantity: 1,
  isHeldByActor: true,
  actor: ACTOR,
  holder: {
    type: "PARTICIPANT",
    participantId: ACTOR.participantId,
    participantType: ACTOR.participantType,
    creationId: ACTOR.creationId,
    canonicalName: ACTOR.canonicalName,
  },
  visibility: { status: "VISIBLE" },
});

const SILVER_MARKET = Object.freeze({
  type: "LOCATION",
  runtimeEntryId: "location_silver_market",
  registryEntryId: "location_silver_market",
  canonicalName: "Silver Market",
  isCurrent: false,
  isConnected: true,
  sourceKind: "CREATION_REF",
  linkedLocationCreationId: "creation_silver_market",
});

const DEFINITIONS = Object.freeze([
  {
    id: "runtime.resource_loop.v1",
    moduleStarterId: "RESOURCE_LOOP",
    modulePresetId: "module.resource_loop.v1",
    label: "Resource Loop Runtime",
    description:
      "Runs the complete Resource Loop module through engine hydration, deterministic threshold resolution, ordered Mechanics application, and status context.",
    commandId: "resource_check",
    userInput: "/focus",
    rollSequence: [14],
    expectedOutcome: "SUCCESS",
    expectedMechanics: {
      meters: { resource: 35 },
      counters: {
        attempt_count: 1,
        resource_successes: 1,
        success_count: 1,
      },
    },
    expectedDomainLanes: [],
    argumentValues: {},
    targetsByArgument: {},
  },
  {
    id: "runtime.social_probe.v1",
    moduleStarterId: "SOCIAL_PROBE",
    modulePresetId: "module.social_probe.v1",
    label: "Social Probe Runtime",
    description:
      "Runs the opposed Social Probe module with target-scoped effect binding and ordered attempt/success state.",
    commandId: "social_probe",
    userInput: "/probe kessa",
    rollSequence: [17, 5],
    expectedOutcome: "SUCCESS",
    expectedMechanics: {
      meters: { trust: 35 },
      counters: {
        attempt_count: 1,
        success_count: 1,
      },
      scopes: {
        "PARTICIPANT:participant_kessa": {
          counters: { probe_hits: 1 },
        },
      },
    },
    expectedDomainLanes: [],
    argumentValues: { target: "kessa" },
    targetsByArgument: { target: KESSA },
  },
  {
    id: "runtime.item_handoff.v1",
    moduleStarterId: "ITEM_HANDOFF",
    modulePresetId: "module.item_handoff.v1",
    label: "Item Handoff Runtime",
    description:
      "Runs the Item Handoff module through deterministic resolution, Mechanics audit state, and the ITEM_RUNTIME composition lane.",
    commandId: "give_item",
    userInput: "/give compass kessa",
    rollSequence: [],
    expectedOutcome: "SUCCESS",
    expectedMechanics: {
      counters: { items_given: 1 },
    },
    expectedDomainLanes: ["ITEM_RUNTIME"],
    argumentValues: { item: "compass", target: "kessa" },
    targetsByArgument: { item: COMPASS, target: KESSA },
  },
  {
    id: "runtime.travel_navigation.v1",
    moduleStarterId: "TRAVEL_NAVIGATION",
    modulePresetId: "module.travel_navigation.v1",
    label: "Travel Navigation Runtime",
    description:
      "Runs the connected-Location navigation module through deterministic resolution, Mechanics audit state, and the final LOCATION_RUNTIME lane.",
    commandId: "travel_connected",
    userInput: "/go silver market",
    rollSequence: [],
    expectedOutcome: "SUCCESS",
    expectedMechanics: {
      counters: { travel_commands: 1 },
    },
    expectedDomainLanes: ["LOCATION_RUNTIME"],
    argumentValues: { destination: "silver market" },
    targetsByArgument: { destination: SILVER_MARKET },
  },
  {
    id: "runtime.quest_progress.v1",
    moduleStarterId: "QUEST_PROGRESS",
    modulePresetId: "module.quest_progress.v1",
    label: "Quest Progress Runtime",
    description:
      "Runs the staged Quest Progress module through deterministic threshold success, pending-state conditions, dependencies, and ordered effects.",
    commandId: "quest_progress",
    userInput: "/quest_step",
    rollSequence: [14],
    expectedOutcome: "SUCCESS",
    expectedMechanics: {
      meters: { quest_momentum: 1 },
      counters: {
        quest_attempts: 1,
        quest_progress: 1,
      },
      stages: { quest_stage: "active" },
      flags: { quest_active: true },
    },
    expectedDomainLanes: [],
    argumentValues: {},
    targetsByArgument: {},
  },
]);

export function listMechanicsReferenceRuntimeImplementations() {
  return DEFINITIONS.map((definition) => ({
    id: definition.id,
    version: MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
    moduleStarterId: definition.moduleStarterId,
    modulePresetId: definition.modulePresetId,
    commandId: definition.commandId,
    label: definition.label,
    description: definition.description,
    userInput: definition.userInput,
    expectedOutcome: definition.expectedOutcome,
    expectedDomainLanes: [...definition.expectedDomainLanes],
  }));
}

export function getMechanicsReferenceRuntimeImplementation(id) {
  const requested = normalizeString(id).toUpperCase();
  const definition = DEFINITIONS.find(
    (entry) =>
      entry.id.toUpperCase() === requested ||
      entry.moduleStarterId === requested ||
      entry.modulePresetId.toUpperCase() === requested
  );

  return definition
    ? deepClone({
        ...definition,
        version: MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
      })
    : null;
}

export function getMechanicsReferenceRuntimeImplementationForModuleStarter(id) {
  return getMechanicsReferenceRuntimeImplementation(id);
}

export function buildMechanicsReferenceRuntimeScenario(id) {
  const definition = getMechanicsReferenceRuntimeImplementation(id);
  if (!definition) return null;

  const moduleData = buildMechanicsModuleStarterPreset(
    definition.moduleStarterId
  );
  const command = moduleData?.instanceData?.commands?.find(
    (entry) => entry.id === definition.commandId
  );

  if (!moduleData || !command) return null;

  const invocation = makeInvocation({
    command,
    argumentValues: definition.argumentValues,
    targetsByArgument: definition.targetsByArgument,
  });
  const binding = {
    moduleId: moduleData.moduleDefinitionId,
    bindingId: `${definition.id}:binding`,
    moduleInstanceId: `${definition.id}:module`,
    enabled: true,
    ownerType: "STORY_ROOM",
    ownerId: ROOM.id,
    ownerTitle: ROOM.title,
    priority: moduleData.priority,
    inheritanceMode: "LOCAL_ONLY",
    instanceData: moduleData.instanceData,
  };

  return deepClone({
    version: MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
    implementationId: definition.id,
    moduleStarterId: definition.moduleStarterId,
    modulePresetId: definition.modulePresetId,
    label: definition.label,
    description: definition.description,
    room: ROOM,
    moduleData,
    command,
    binding,
    state: buildInitialMechanicsState(moduleData),
    invocation,
    userInput: definition.userInput,
    rollSequence: definition.rollSequence,
    expectedOutcome: definition.expectedOutcome,
    expectedMechanics: definition.expectedMechanics,
    expectedDomainLanes: definition.expectedDomainLanes,
    participants: [ACTOR, KESSA],
    actorParticipantId: ACTOR.participantId,
    roomRuntimeContext: {
      playerCharacter: {
        id: ACTOR.creationId,
        creationId: ACTOR.creationId,
        participantId: ACTOR.participantId,
        canonicalName: ACTOR.canonicalName,
      },
      locationRuntime: {
        current: {
          runtimeEntryId: "location_reference_room",
          canonicalName: ROOM.title,
          linkedLocationCreationId: "creation_reference_room",
        },
        travel: null,
      },
      itemRuntime: {
        instancesById: {
          [COMPASS.instanceEntityId]: COMPASS,
        },
      },
    },
  });
}
