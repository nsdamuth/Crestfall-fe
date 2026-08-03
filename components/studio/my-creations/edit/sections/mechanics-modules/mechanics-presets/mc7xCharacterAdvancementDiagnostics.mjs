import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS,
  MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID,
  MECHANICS_CHARACTER_ADVANCEMENT_PRESET_VERSION,
  MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
  buildCharacterAdvancementProgressionProfile,
  buildCharacterProgressionStateReadout,
  buildMechanicsCharacterAdvancementPreset,
  buildMechanicsCharacterAdvancementReadoutPreset,
} from "./mechanicsCharacterAdvancementPreset.js";
import {
  buildMechanicsPresetPayload,
  getMechanicsPresetDefinition,
  getMechanicsPresetLibraryManifest,
  listMechanicsPresetCatalog,
} from "./mechanicsPresetLibrary.js";
import {
  getMechanicsPresetCatalogManifest,
} from "./mechanicsPresetCatalog.js";
import {
  MECHANICS_PRESET_APPLICATION_MAX_BYTES,
  applyMechanicsPresetToModuleData,
  getMechanicsModuleSerializedSize,
} from "./mechanicsPresetApplicationService.js";
import {
  buildMechanicsPresetLiveValidationGuide,
} from "./mechanicsPresetLiveValidation.js";
import {
  MECHANICS_COMMAND_COMPOSITION_EFFECT_TYPES,
} from "../mechanicsCommandCompositionBuilder.js";
import {
  MECHANICS_PROGRESSION_CURVE_TYPES,
  MECHANICS_PROGRESSION_MODES,
  MECHANICS_PROGRESSION_PROFILE_VERSION,
  generateMechanicsProgressionTable,
  normalizeMechanicsProgressionProfileBuilder,
  resolveMechanicsProgressionDerivedValue,
  resolveMechanicsProgressionRank,
} from "../mechanicsProgressionProfileBuilder.js";
import {
  validateMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";
import {
  bindMechanicsCommandEffectsToResolvedTargets,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandEffectTargetBindingService.js";
import {
  selectMechanicsCommandOutcomeEffects,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandOutcomeService.js";
import {
  buildMechanicsCommandCompositionExecution,
  buildMechanicsCommandCompositionPlan,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandCompositionService.js";
import {
  applyMechanicsCommandsForTurn,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsApplicatorService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mechanicsRoot = path.resolve(__dirname, "..");
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function read(relativePath) { return fs.readFileSync(path.resolve(mechanicsRoot, relativePath), "utf8"); }
function entry(id, value) { return { id, value, previousValue: value, lastDelta: 0 }; }

const EMPTY_MODULE = Object.freeze({
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  priority: 65,
  tags: [],
  contractVersion: "trackers_instance_data.v0_2",
  instanceData: {
    contractVersion: "trackers_instance_data.v0_2",
    trackers: [], commands: [], guards: [], statusBlocks: [],
    defaults: { flags: [], counters: [], stages: [] },
  },
});

function makeInvocation(command, amount) {
  const argumentsList = command.invocation.arguments.map((argument) => ({
    ...argument,
    value: amount,
    status: "RESOLVED",
  }));
  return {
    version: "mechanics_command_invocation_v1",
    status: "MATCHED",
    commandId: command.id,
    commandLabel: command.label,
    canonicalCommand: command.invocation.command,
    commandToken: `/${command.invocation.command}`,
    argumentValues: { amount },
    arguments: argumentsList,
    targetResolution: {
      status: "RESOLVED",
      arguments: argumentsList.map((argument) => ({ ...argument, target: null })),
      argumentValues: { amount },
      targetsByArgument: {},
      errors: [],
    },
  };
}

function runAdvancement({
  amount,
  experiencePoints = 0,
  characterLevel = 1,
  proficiencyBonus = 2,
  levelUps = 0,
  turnCount = 1,
  profilePatch = null,
} = {}) {
  const moduleData = buildMechanicsCharacterAdvancementPreset();
  const rawCommand = moduleData.instanceData.commands[0];
  if (profilePatch) {
    const effect = rawCommand.composition.mechanicsSteps[1].effects[0];
    effect.progressionProfile = normalizeMechanicsProgressionProfileBuilder({
      ...effect.progressionProfile,
      ...profilePatch,
    });
    effect.targetId = effect.progressionProfile.rankValueId;
  }
  const invocation = makeInvocation(rawCommand, amount);
  const binding = bindMechanicsCommandEffectsToResolvedTargets({
    command: rawCommand,
    invocation,
  });
  assert.equal(binding.passed, true, JSON.stringify(binding.errors));
  const command = binding.command;
  const resolution = {
    version: "mechanics_command_resolution_v6",
    status: "RESOLVED",
    mode: "NO_ROLL_DETERMINISTIC",
    outcome: "SUCCESS",
    effectsAllowed: true,
    rollRequired: false,
  };
  const outcome = selectMechanicsCommandOutcomeEffects({ command, resolutionResult: resolution });
  const execution = buildMechanicsCommandCompositionExecution({
    command,
    selectedEffects: outcome.selectedEffects,
    outcome: outcome.outcome,
  });
  const plan = buildMechanicsCommandCompositionPlan({
    command,
    resolutionResult: resolution,
    outcomeSelection: outcome,
  });
  const state = {
    state: {
      mechanics: {
        version: "mechanics_state_v0",
        meters: { byId: {} },
        flags: { byId: { advancement_enabled: entry("advancement_enabled", true) } },
        counters: {
          byId: {
            experience_points: entry("experience_points", experiencePoints),
            character_level: entry("character_level", characterLevel),
            proficiency_bonus: entry("proficiency_bonus", proficiencyBonus),
            level_ups: entry("level_ups", levelUps),
          },
        },
        stages: { byId: {} },
        scopes: { byKey: {} },
      },
      mechanicsApplicator: { appliedCommandKeys: [], recentApplications: [] },
    },
  };
  const action = {
    id: `character-advancement-turn-${turnCount}`,
    actionType: "MECHANICS_EFFECTS",
    moduleKey: "core.trackers.v1",
    operation: "apply_mechanics_effects",
    parameters: {
      reason: "MC7X.1 generated progression diagnostic.",
      source: "ENGINE_DETERMINISTIC_COMMAND",
      deterministic: true,
      matchedRuleId: command.id,
      matchedTrigger: `/award_xp ${amount}`,
      commandId: command.id,
      commandInvocation: invocation,
      requirementEvaluation: { status: "PASSED", passed: true, errors: [] },
      effectBindingEvaluation: binding,
      resolutionResult: resolution,
      outcomeSelection: outcome,
      effects: execution.effects,
      attemptEffects: execution.attemptEffects,
      outcomeEffects: execution.outcomeEffects,
      composition: command.composition,
      compositionMechanicsSteps: execution.steps,
      compositionPlan: plan,
      idempotencyKey: `character-advancement:${turnCount}`,
      sourceScopeKey: "STORY_ROOM:advancement_test",
      sourceOwnerType: "STORY_ROOM",
      sourceOwnerId: "advancement_test",
      sourceOwnerTitle: "Advancement Test",
      mechanicsScopeMode: "STORY_ROOM",
    },
  };
  const application = applyMechanicsCommandsForTurn({
    room: { id: "advancement_test", title: "Advancement Test" },
    state,
    turnActionRouter: { actions: [action] },
    engineModuleOperations: { operations: [] },
    turnCount,
    participants: [],
  });
  const counters = application.statePatch?.mechanics?.counters?.byId || {};
  return { moduleData, command, binding, plan, application, counters };
}

const profile = buildCharacterAdvancementProgressionProfile();
const table = generateMechanicsProgressionTable(profile);

test("Character advancement preset advances to v4", () => {
  assert.equal(MECHANICS_CHARACTER_ADVANCEMENT_PRESET_VERSION, "mechanics_character_advancement_preset_v4");
});
test("Generated progression profile contract starts at v1", () => {
  assert.equal(MECHANICS_PROGRESSION_PROFILE_VERSION, "mechanics_progression_profile_v1");
});
test("Character advancement uses the generated-curve preset id", () => {
  assert.equal(MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID, "module.character_advancement_curve.v1");
});
test("Legacy advancement preset id remains an accepted alias", () => {
  assert.equal(MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS.includes("module.character_advancement_5e.v1"), true);
  assert.equal(getMechanicsPresetDefinition("module.character_advancement_5e.v1")?.id, MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID);
});
test("Manual Mechanics effects remain available beside progression reconcile", () => {
  for (const type of ["COUNTER_INCREMENT", "COUNTER_SET", "STAGE_SET", "PROGRESSION_RECONCILE"]) {
    assert.equal(MECHANICS_COMMAND_COMPOSITION_EFFECT_TYPES.includes(type), true);
  }
});
test("Generated modes retain curve and explicit-table flexibility", () => {
  assert.deepEqual(MECHANICS_PROGRESSION_MODES, ["GENERATED_CURVE", "GENERATED_CURVE_WITH_OVERRIDES", "EXPLICIT_TABLE"]);
});
test("Curve methods include linear geometric power and hybrid", () => {
  assert.deepEqual(MECHANICS_PROGRESSION_CURVE_TYPES, ["LINEAR", "GEOMETRIC", "POWER", "HYBRID"]);
});
test("Default profile spans ranks one through twenty", () => {
  assert.equal(profile.startingRank, 1);
  assert.equal(profile.endingRank, 20);
});
test("Generated table contains one row per rank", () => {
  assert.equal(table.length, 20);
  assert.deepEqual(table.map((row) => row.rank), Array.from({ length: 20 }, (_, index) => index + 1));
});
test("Generated thresholds remain strictly increasing", () => {
  for (let index = 1; index < table.length; index += 1) {
    assert.equal(table[index].totalRequirement > table[index - 1].totalRequirement, true);
  }
});
test("Hybrid sample starts at 300 XP", () => {
  assert.equal(table[1].requirement, 300);
  assert.equal(table[1].totalRequirement, 300);
});
test("Hybrid sample reaches level five at 4200 XP", () => {
  assert.equal(table.find((row) => row.rank === 5)?.totalRequirement, 4200);
});
test("Hybrid sample maximum threshold stays within safe integer range", () => {
  assert.equal(table.at(-1).totalRequirement, 361400);
  assert.equal(Number.isSafeInteger(table.at(-1).totalRequirement), true);
});
test("Linear curve can be generated independently", () => {
  const rows = generateMechanicsProgressionTable({ ...profile, endingRank: 5, curve: { ...profile.curve, type: "LINEAR", startingRequirement: 100, linearIncrease: 50, minimumIncrease: 1, roundTo: 1 } });
  assert.deepEqual(rows.map((row) => row.requirement), [0, 100, 150, 200, 250]);
});
test("Geometric curve can be generated independently", () => {
  const rows = generateMechanicsProgressionTable({ ...profile, endingRank: 4, curve: { ...profile.curve, type: "GEOMETRIC", startingRequirement: 100, multiplier: 2, minimumIncrease: 1, roundTo: 1 } });
  assert.deepEqual(rows.map((row) => row.requirement), [0, 100, 200, 400]);
});
test("Power curve can be generated independently", () => {
  const rows = generateMechanicsProgressionTable({ ...profile, endingRank: 4, curve: { ...profile.curve, type: "POWER", startingRequirement: 100, exponent: 2, minimumIncrease: 1, roundTo: 1 } });
  assert.deepEqual(rows.map((row) => row.requirement), [0, 100, 400, 900]);
});
test("Generated overrides replace selected transition costs", () => {
  const rows = generateMechanicsProgressionTable({ ...profile, endingRank: 4, mode: "GENERATED_CURVE_WITH_OVERRIDES", curve: { ...profile.curve, type: "LINEAR", startingRequirement: 100, linearIncrease: 50, minimumIncrease: 1, roundTo: 1 }, overrides: [{ rank: 3, requirement: 500 }] });
  assert.equal(rows.find((row) => row.rank === 3).requirement, 500);
});
test("Explicit table mode remains supported", () => {
  const rows = generateMechanicsProgressionTable({ ...profile, endingRank: 4, mode: "EXPLICIT_TABLE", curve: { ...profile.curve, minimumIncrease: 1, roundTo: 1 }, thresholds: [{ rank: 2, totalRequirement: 100 }, { rank: 3, totalRequirement: 350 }, { rank: 4, totalRequirement: 900 }] });
  assert.deepEqual(rows.map((row) => row.totalRequirement), [0, 100, 350, 900]);
});
test("Rank resolution chooses the highest eligible generated rank", () => {
  assert.equal(resolveMechanicsProgressionRank(profile, 4199).rank, 4);
  assert.equal(resolveMechanicsProgressionRank(profile, 4200).rank, 5);
});
test("Proficiency derived rule follows four-rank intervals", () => {
  const rule = profile.derivedValues[0];
  assert.deepEqual([1,4,5,8,9,12,13,16,17,20].map((rank) => resolveMechanicsProgressionDerivedValue(rule, rank, 1)), [2,2,3,3,4,4,5,5,6,6]);
});
test("Complete compact advancement module passes JSON compliance", () => {
  const result = validateMechanicsModuleData(buildMechanicsCharacterAdvancementPreset());
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});
test("Compact preset has four commands and two award steps", () => {
  const moduleData = buildMechanicsCharacterAdvancementPreset();
  assert.equal(moduleData.instanceData.commands.length, 4);
  assert.equal(moduleData.instanceData.commands[0].composition.mechanicsSteps.length, 2);
});
test("Compact preset is substantially smaller than the verbose v1 payload", () => {
  assert.equal(getMechanicsModuleSerializedSize(buildMechanicsCharacterAdvancementPreset()) < 16000, true);
});
test("Award command binds the NUMBER argument to XP", () => {
  const effect = buildMechanicsCharacterAdvancementPreset().instanceData.commands[0].composition.mechanicsSteps[0].effects[0];
  assert.equal(effect.valueBinding.mode, "ARGUMENT");
  assert.equal(effect.valueBinding.argumentName, "amount");
});
test("Award command uses one progression reconcile effect", () => {
  const effect = buildMechanicsCharacterAdvancementPreset().instanceData.commands[0].composition.mechanicsSteps[1].effects[0];
  assert.equal(effect.type, "PROGRESSION_RECONCILE");
  assert.equal(effect.progressionProfile.curve.type, "HYBRID");
});
test("Award command includes a final progression state readout", () => {
  const command = buildMechanicsCharacterAdvancementPreset().instanceData.commands[0];
  assert.equal(command.presentation.stateReadout.enabled, true);
  assert.deepEqual(
    command.presentation.stateReadout.fields.map((field) => field.targetId),
    ["character_level", "experience_points", "proficiency_bonus", "level_ups", "advancement_enabled"]
  );
});
test("Progress command is a zero-effect query with a state readout", () => {
  const command = buildMechanicsCharacterAdvancementPreset().instanceData.commands.find(
    (entry) => entry.invocation.command === "progress"
  );
  assert.equal(command.presentation.mode, "QUERY");
  assert.equal(command.effects.length, 0);
  assert.equal(command.composition.mechanicsSteps.length, 0);
  assert.equal(command.presentation.stateReadout.enabled, true);
});
test("Readout add-on contains only the zero-effect progress query", () => {
  const moduleData = buildMechanicsCharacterAdvancementReadoutPreset();
  assert.equal(moduleData.instanceData.commands.length, 1);
  assert.equal(moduleData.instanceData.commands[0].invocation.command, "progress");
  assert.equal(moduleData.instanceData.defaults.flags.length, 0);
  assert.equal(moduleData.instanceData.defaults.counters.length, 0);
});
test("Readout add-on passes JSON compliance", () => {
  const result = validateMechanicsModuleData(
    buildMechanicsCharacterAdvancementReadoutPreset()
  );
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("Progression readout uses signed proficiency and boolean enabled formatting", () => {
  const readout = buildCharacterProgressionStateReadout();
  assert.equal(readout.fields.find((field) => field.targetId === "proficiency_bonus").format, "SIGNED_NUMBER");
  assert.equal(readout.fields.find((field) => field.targetId === "advancement_enabled").format, "BOOLEAN");
});
test("Advancement can be enabled without a self-blocking HARD_LOCK", () => {
  const moduleData = buildMechanicsCharacterAdvancementPreset();
  assert.equal(moduleData.instanceData.guards.length, 0);
  assert.equal(moduleData.instanceData.commands.some((command) => command.invocation.command === "advancement_on"), true);
});
test("Advancement can be disabled with a state-setting command", () => {
  const moduleData = buildMechanicsCharacterAdvancementPreset();
  const command = moduleData.instanceData.commands.find((entry) => entry.invocation.command === "advancement_off");
  assert.equal(command.effects[0].type, "FLAG_CLEAR");
  assert.equal(command.presentation.mode, "STATE_SETTING");
});
test("Core MC7 catalog remains frozen at twenty presets", () => {
  assert.equal(getMechanicsPresetCatalogManifest().presetCount, 20);
});
test("Extension preset library exposes twenty-two presets", () => {
  assert.equal(getMechanicsPresetLibraryManifest().presetCount, 22);
  assert.equal(listMechanicsPresetCatalog().length, 22);
});
test("Progression category returns the curve preset and readout add-on", () => {
  const presets = listMechanicsPresetCatalog({ category: "PROGRESSION" });
  assert.equal(presets.length, 2);
  assert.deepEqual(
    presets.map((entry) => entry.id),
    [
      MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID,
      MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
    ]
  );
});
test("Legacy id builds the compact payload", () => {
  const built = buildMechanicsPresetPayload("module.character_advancement_5e.v1");
  assert.equal(built.ok, true);
  assert.equal(built.payload.value.instanceData.commands[0].composition.mechanicsSteps.length, 2);
});
test("REPLACE_MODULE application passes compliance", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: clone(EMPTY_MODULE), presetId: MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID, applyMode: "REPLACE_MODULE" });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});
test("MERGE_MODULE appends compact advancement to an existing command", () => {
  const existing = clone(EMPTY_MODULE);
  existing.instanceData.commands.push({ id: "existing_command", label: "Existing Command", invocation: { command: "existing", prefixes: ["/"], aliases: [], arguments: [] }, requirements: [], attemptEffects: [], effects: [], resolution: { mode: "NO_ROLL_DETERMINISTIC" }, outcomes: {}, composition: { mechanicsSteps: [], domainSteps: [] }, domainAction: { enabled: false, type: "NONE", applyOnOutcomes: [] }, presentation: { mode: "MECHANICS_ACTION", continueNarrative: true, advanceTime: false, resultVisibility: "FULL" }, triggers: [] });
  const result = applyMechanicsPresetToModuleData({ moduleData: existing, presetId: MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID, applyMode: "MERGE_MODULE" });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.deepEqual(result.data.instanceData.commands.map((command) => command.id), ["existing_command", "award_experience", "show_character_progression", "enable_character_advancement", "disable_character_advancement"]);
});
test("Readout add-on merges into an existing v2 advancement module", () => {
  const existing = buildMechanicsCharacterAdvancementPreset();
  existing.instanceData.commands = existing.instanceData.commands.filter(
    (command) => command.invocation.command !== "progress"
  );
  const result = applyMechanicsPresetToModuleData({
    moduleData: existing,
    presetId: MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
    applyMode: "MERGE_MODULE",
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.deepEqual(
    result.data.instanceData.commands.map((command) => command.invocation.command),
    ["award_xp", "advancement_on", "advancement_off", "progress"]
  );
});
test("Readout add-on defaults to MERGE_MODULE", () => {
  const definition = getMechanicsPresetDefinition(
    MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID
  );
  const built = buildMechanicsPresetPayload(
    MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID
  );
  assert.equal(definition.application.defaultMode, "MERGE_MODULE");
  assert.deepEqual(definition.application.allowedModes, ["MERGE_MODULE"]);
  assert.equal(built.payload.value.instanceData.commands.length, 1);
});

test("Preset application exposes serialized-size audit evidence", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: clone(EMPTY_MODULE), presetId: MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID, applyMode: "REPLACE_MODULE" });
  assert.equal(result.audit.serializedBytes > 0, true);
  assert.equal(result.audit.maximumSerializedBytes, MECHANICS_PRESET_APPLICATION_MAX_BYTES);
});
test("Oversized merged modules reject before builder replacement", () => {
  const oversized = clone(EMPTY_MODULE);
  oversized.padding = "x".repeat(MECHANICS_PRESET_APPLICATION_MAX_BYTES);
  const result = applyMechanicsPresetToModuleData({ moduleData: oversized, presetId: MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID, applyMode: "MERGE_MODULE" });
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((issue) => issue.code === "MECHANICS_PRESET_SERIALIZED_SIZE_EXCEEDED"), true);
});
test("Live validation guide uses the first generated threshold", () => {
  const guide = buildMechanicsPresetLiveValidationGuide({ presetId: MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID });
  assert.equal(guide.testCommand, "/award_xp 300");
  assert.equal(guide.expectedOutcome, "SUCCESS");
});
test("Readout add-on live validation guide uses /progress", () => {
  const guide = buildMechanicsPresetLiveValidationGuide({
    presetId: MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
  });
  assert.equal(guide.testCommand, "/progress");
  assert.equal(guide.expectedOutcome, "SUCCESS");
  assert.deepEqual(guide.expectedDomainLanes, []);
});

test("4200 XP advances a new character to level five", () => {
  const result = runAdvancement({ amount: 4200 });
  assert.equal(result.application.status, "applied");
  assert.equal(result.counters.experience_points.value, 4200);
  assert.equal(result.counters.character_level.value, 5);
  assert.equal(result.counters.proficiency_bonus.value, 3);
  assert.equal(result.counters.level_ups.value, 4);
});
test("4200 XP exposes XP level proficiency and level-up deltas", () => {
  const result = runAdvancement({ amount: 4200 });
  const applied = result.application.accepted[0].appliedEffects;
  assert.deepEqual(
    applied.map((effect) => effect.targetId),
    ["experience_points", "character_level", "proficiency_bonus", "level_ups"]
  );
  assert.deepEqual(
    applied.map((effect) => effect.nextValue),
    [4200, 5, 3, 4]
  );
});
test("Maximum threshold advances a new character to level twenty", () => {
  const result = runAdvancement({ amount: table.at(-1).totalRequirement });
  assert.equal(result.counters.character_level.value, 20);
  assert.equal(result.counters.proficiency_bonus.value, 6);
  assert.equal(result.counters.level_ups.value, 19);
});
test("Crossing one generated threshold records one new rank", () => {
  const result = runAdvancement({ amount: 100, experiencePoints: 4100, characterLevel: 4, proficiencyBonus: 2, levelUps: 3 });
  assert.equal(result.counters.experience_points.value, 4200);
  assert.equal(result.counters.character_level.value, 5);
  assert.equal(result.counters.proficiency_bonus.value, 3);
  assert.equal(result.counters.level_ups.value, 4);
});
test("Reconciliation does not repeatedly count an already-earned rank", () => {
  const result = runAdvancement({ amount: 100, experiencePoints: 4200, characterLevel: 5, proficiencyBonus: 3, levelUps: 4 });
  assert.equal(result.counters.experience_points.value, 4300);
  assert.equal(result.counters.character_level, undefined);
  assert.equal(result.counters.proficiency_bonus, undefined);
  assert.equal(result.counters.level_ups, undefined);
});
test("Rank decreases remain disabled by default", () => {
  const result = runAdvancement({ amount: 1, experiencePoints: 0, characterLevel: 10, proficiencyBonus: 4, levelUps: 9 });
  assert.equal(result.counters.experience_points.value, 1);
  assert.equal(result.counters.character_level, undefined);
  assert.equal(result.counters.proficiency_bonus, undefined);
  assert.equal(result.counters.level_ups, undefined);
});
test("JSON validator rejects an unsupported progression mode", () => {
  const moduleData = buildMechanicsCharacterAdvancementPreset();
  moduleData.instanceData.commands[0].composition.mechanicsSteps[1].effects[0].progressionProfile.mode = "MAGIC";
  const result = validateMechanicsModuleData(moduleData);
  assert.equal(result.valid, false);
  assert.equal(result.errors.some((issue) => issue.path.endsWith("progressionProfile.mode")), true);
});
test("JSON validator rejects explicit-table mode without rows", () => {
  const moduleData = buildMechanicsCharacterAdvancementPreset();
  moduleData.instanceData.commands[0].composition.mechanicsSteps[1].effects[0].progressionProfile.mode = "EXPLICIT_TABLE";
  const result = validateMechanicsModuleData(moduleData);
  assert.equal(result.valid, false);
  assert.equal(result.errors.some((issue) => issue.path.endsWith("progressionProfile.thresholds")), true);
});
test("Visual builders expose adjustable progression curve controls", () => {
  const main = read("MechanicsModuleFieldsSection.jsx");
  const composition = read("mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx");
  const profileShell = read("mechanics-progression-profile/MechanicsProgressionProfileFields.jsx");
  const profileView = read("mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx");
  assert.match(main, /PROGRESSION_RECONCILE/);
  assert.match(composition, /ProgressionProfileFieldsComponent/);
  assert.match(profileShell, /useMechanicsProgressionProfileViewModel/);
  assert.match(profileView, /Starting Requirement/);
  assert.match(profileView, /Curve Method/);
  assert.match(profileView, /Generated Threshold Preview/);
});
test("Progression UI remains API-free", () => {
  const source = [
    read("mechanics-progression-profile/MechanicsProgressionProfileFields.jsx"),
    read("mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx"),
    read("mechanics-progression-profile/useMechanicsProgressionProfileViewModel.js"),
  ].join("\n");
  assert.doesNotMatch(source, /\bfetch\s*\(|supabase|PostGraphile|services-api/i);
});
test("Core MC7 freeze manifest remains unchanged", () => {
  const source = read("mechanics-presets/mechanicsPresetFreezeManifest.js");
  assert.match(source, /mechanics_preset_freeze_manifest_v1/);
  assert.doesNotMatch(source, /character_advancement_curve/);
});

console.log("Crestfall mc7x_character_advancement_diagnostics_v4");
console.log(`Node ${process.version}`);
console.log("");
let passed = 0;
let failed = 0;
const started = Date.now();
for (let index = 0; index < tests.length; index += 1) {
  const current = tests[index];
  const testStarted = Date.now();
  try {
    await current.fn();
    passed += 1;
    console.log(`PASS ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - testStarted} ms)`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - testStarted} ms)`);
    console.log(error?.stack || error);
  }
}
console.log("");
console.log(`Summary: ${passed} passed, ${failed} failed, ${tests.length} total`);
console.log(`Elapsed: ${Date.now() - started} ms`);
if (failed) process.exitCode = 1;
