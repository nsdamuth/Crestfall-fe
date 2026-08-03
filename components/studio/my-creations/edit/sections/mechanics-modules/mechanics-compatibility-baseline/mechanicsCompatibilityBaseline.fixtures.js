import { MECHANICS_CURRENT_IDENTITIES } from "./MechanicsCompatibilityBaseline.contract.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function emptyModule() {
  return {
    builder: MECHANICS_CURRENT_IDENTITIES.builder,
    builder_version: MECHANICS_CURRENT_IDENTITIES.builderVersion,
    moduleDefinitionId: MECHANICS_CURRENT_IDENTITIES.moduleDefinitionId,
    moduleId: MECHANICS_CURRENT_IDENTITIES.moduleId,
    contractVersion: MECHANICS_CURRENT_IDENTITIES.contractVersion,
    priority: MECHANICS_CURRENT_IDENTITIES.defaultPriority,
    operationTriggers: { chatTurnDefault: MECHANICS_CURRENT_IDENTITIES.defaultOperation },
    tags: [],
    instanceData: {
      contractVersion: MECHANICS_CURRENT_IDENTITIES.contractVersion,
      trackers: [],
      commands: [],
      defaults: { flags: [], counters: [], stages: [] },
      statusBlocks: [],
      guards: [],
    },
  };
}

const tracker = emptyModule();
tracker.tags = ["tracker", "baseline"];
tracker.instanceData.trackers = [{
  id: "resolve",
  kind: "meter",
  label: "Resolve",
  min: 0,
  max: 100,
  initial: 40,
  phases: [
    { id: "shaken", label: "Shaken", min: 0, max: 24 },
    { id: "steady", label: "Steady", min: 25, max: 74 },
  ],
  mutationHints: [{ id: "pressure", eventTypes: ["COMBAT"], triggers: ["failed_defense"], delta: -5, reason: "Baseline hint." }],
}];

const command = emptyModule();
command.tags = ["command", "baseline"];
command.instanceData.commands = [{
  id: "test_resolve",
  label: "Test Resolve",
  commandContractVersion: "mechanics_command_contract_v1",
  invocation: {
    version: "mechanics_command_invocation_v1",
    enabled: true,
    command: "resolve",
    prefixes: ["/"],
    aliases: ["will"],
    arguments: [{ id: "difficulty", name: "difficulty", label: "Difficulty", type: "NUMBER", required: false, options: [], min: 1, max: 30 }],
    caseSensitive: false,
  },
  requirements: [{ id: "resolve_available", type: "METER", targetId: "resolve", operator: "GTE", value: 1, enabled: true }],
  attemptEffects: [{ id: "spend_resolve", type: "METER_DELTA", targetId: "resolve", delta: -1, amount: -1 }],
  resolution: {
    version: "mechanics_command_resolution_v6",
    mode: "THRESHOLD_DIE",
    rollMode: "NORMAL",
    die: { count: 1, sides: 20 },
    targetNumber: 11,
    modifiers: [],
    modifierSources: [],
    criticalOnNaturalMax: true,
    fumbleOnNaturalMin: true,
  },
  outcomes: {
    version: "mechanics_command_outcomes_v1",
    SUCCESS: { outcome: "SUCCESS", effectMode: "INHERIT", effects: [], summary: "Success." },
    FAILURE: { outcome: "FAILURE", effectMode: "NONE", effects: [], summary: "Failure." },
  },
  effects: [],
  composition: { version: "mechanics_command_composition_v1", mechanicsSteps: [], domainSteps: [] },
  domainAction: { version: "mechanics_command_domain_action_v1", enabled: false, type: "NONE", applyOnOutcomes: [] },
  presentation: { mode: "MECHANICS_ACTION", continueNarrative: true, advanceTime: true, resultVisibility: "FULL" },
}];

const progression = emptyModule();
progression.tags = ["progression", "baseline"];
progression.instanceData.defaults.counters = [
  { id: "experience_points", label: "Experience Points", initial: 0 },
  { id: "character_level", label: "Character Level", initial: 1 },
];
progression.instanceData.commands = [{
  id: "reconcile_progression",
  effects: [{
    id: "reconcile_character_level",
    type: "PROGRESSION_RECONCILE",
    targetId: "character_level",
    progressionProfile: {
      version: "mechanics_progression_profile_v1",
      id: "character_advancement",
      label: "Character Advancement",
      mode: "GENERATED_CURVE",
      sourceValueId: "experience_points",
      rankValueId: "character_level",
      startingRank: 1,
      endingRank: 20,
      curve: { type: "HYBRID", requirementMode: "PER_RANK_COST", startingRequirement: 300, linearIncrease: 250, multiplier: 1.12, exponent: 1.2, minimumIncrease: 50, roundTo: 50, rounding: "ROUND" },
      overrides: [],
      thresholds: [],
      derivedValues: [],
    },
  }],
}];

const statusGuard = emptyModule();
statusGuard.tags = ["status", "guard", "baseline"];
statusGuard.instanceData.defaults = {
  flags: [{ id: "door_unlocked", label: "Door Unlocked", initial: false }],
  counters: [{ id: "attempt_count", label: "Attempt Count", initial: 0 }],
  stages: [{ id: "quest_stage", label: "Quest Stage", initial: "intro" }],
};
statusGuard.instanceData.statusBlocks = [{ id: "quest_status", slot: "main_footer", label: "Quest Status", template: "Stage: {{quest_stage}}", required: true }];
statusGuard.instanceData.guards = [{
  id: "requires_unlocked_door",
  label: "Requires Unlocked Door",
  enabled: true,
  enforcement: "BLOCK",
  mode: "ALL",
  composerVisibility: "FULL",
  publicVisibility: "SUMMARY",
  priority: 100,
  conditions: [{ id: "door_unlocked", type: "FLAG", field: "door_unlocked", operator: "eq", value: true }],
  onFail: { summary: "The door is locked.", composerGuidance: "Do not advance." },
  onPass: { summary: "The door is unlocked." },
}];

const mixed = emptyModule();
mixed.tags = ["mixed", "baseline", "unknown-field-probe"];
mixed.instanceData = {
  ...clone(tracker.instanceData),
  commands: clone(command.instanceData.commands),
  defaults: clone(statusGuard.instanceData.defaults),
  statusBlocks: clone(statusGuard.instanceData.statusBlocks),
  guards: clone(statusGuard.instanceData.guards),
  futureDomainData: { preservedByEditReplacement: true },
};
mixed.futureRootData = { preservedByEditReplacement: true };

export const MECHANICS_M0_FIXTURE_INVENTORY_VERSION =
  "crestfall.mechanics.m0.fixture-inventory.v1";

export const MECHANICS_M0_FIXTURES = Object.freeze([
  Object.freeze({ id: "current.empty.v1", label: "Current Empty Module", classification: "CURRENT_AUTHORING", domains: ["identity", "empty collections"], moduleData: emptyModule() }),
  Object.freeze({ id: "current.trackers.v1", label: "Tracker Module", classification: "CURRENT_AUTHORING", domains: ["trackers", "phases", "mutation hints"], moduleData: tracker }),
  Object.freeze({ id: "current.commands.v1", label: "Command Module", classification: "CURRENT_AUTHORING", domains: ["commands", "requirements", "effects", "resolution", "outcomes"], moduleData: command }),
  Object.freeze({ id: "current.progression.v1", label: "Progression Module", classification: "CURRENT_AUTHORING", domains: ["progression", "defaults", "effects"], moduleData: progression }),
  Object.freeze({ id: "current.status-guard.v1", label: "Status and Guard Module", classification: "CURRENT_AUTHORING", domains: ["defaults", "status blocks", "guards"], moduleData: statusGuard }),
  Object.freeze({ id: "current.full-mixed.v1", label: "Full Mixed-Domain Module", classification: "CURRENT_AUTHORING_WITH_UNKNOWN_FIELDS", domains: ["all primary frontend domains", "unknown-field probe"], moduleData: mixed }),
  Object.freeze({ id: "legacy.partial-aliases.v1", label: "Legacy Partial Alias Shape", classification: "LEGACY_COMPATIBILITY", domains: ["legacy aliases", "missing optional collections"], moduleData: { moduleDefinitionId: "core.trackers.v1", contract_version: "trackers_instance_data.v0_2", priority: "65", tags: "legacy,partial", instance_data: { trackers: [], commands: [], defaults: { flags: [], counters: [] } } } }),
  Object.freeze({ id: "recoverable.malformed.v1", label: "Malformed but Recoverable Shape", classification: "RECOVERABLE_INPUT", domains: ["null handling", "type coercion", "missing defaults"], moduleData: { builder: "MECHANICS_MODULE_BUILDER", moduleDefinitionId: "core.trackers.v1", moduleId: "", contractVersion: "trackers_instance_data.v0_2", priority: "not-a-number", operationTriggers: null, tags: ["recoverable", "", null], instanceData: { trackers: null, commands: "not-an-array", defaults: null, statusBlocks: null, guards: {} } } }),
  Object.freeze({ id: "preset.resource-loop.v1", label: "Preset-Derived Resource Loop", classification: "PRESET_DERIVED", domains: ["preset replacement", "tracker", "command", "resolution"], preset: { presetId: "module.resource_loop.v1", applyMode: "REPLACE_MODULE", expectedModuleDefinitionId: "core.trackers.v1", expectedTrackerIds: ["resource"], expectedCommandIds: ["resource_check"] }, moduleData: null }),
]);

export const MECHANICS_M0_FIXTURE_HASHES = Object.freeze({
  "current.empty.v1": "da6ed7262ccaf79370199a9ac768b82fe04c0099e3c55800d916a65f062f2d78",
  "current.trackers.v1": "f1d4c7e45e19c830e2816aa0d51951aac114bfbda59628fa27fd82fbdb580d68",
  "current.commands.v1": "87df12b158f4a8a4a1241a6910a8ec9bc9525048b1dc717c2f473a62c9237f18",
  "current.progression.v1": "025635495d1ba6f680b5d56e04b65be7f99e459006f1bdf98774f7b56b82a4ad",
  "current.status-guard.v1": "93ed58119d78ee117420aaed7d59e7e35e7e40a84d7bca8eac953cae3af522e9",
  "current.full-mixed.v1": "401c7ba6d67122b4f53011aa2c2aedd61294d2ba5a5c19aba9611b8256fd1cdf",
  "legacy.partial-aliases.v1": "f876ed3c4672f94f09b8aaad07934ad5cccb031d8e51298a9be311c50a78debf",
  "recoverable.malformed.v1": "4901a8179721b126d437eea2d9485a90a7336003963fdea0117a17b1eb3c5981",
  "preset.resource-loop.v1": "9aab73267e5f377f7087d2ce1566e67a6f5f063a9ac0ef30d8af395125609e44",
});

export function listMechanicsM0Fixtures() {
  return clone(MECHANICS_M0_FIXTURES);
}
