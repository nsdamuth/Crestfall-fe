import assert from "node:assert/strict";

import {
  MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS,
  MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
  buildMechanicsReferenceRuntimeScenario,
  getMechanicsReferenceRuntimeImplementation,
  listMechanicsReferenceRuntimeImplementations,
} from "./mechanicsReferenceRuntimeImplementations.js";
import {
  buildMechanicsModuleStarterPreset,
  listMechanicsModuleStarterPresets,
} from "./mechanicsModuleStarterPresets.js";
import {
  getMechanicsPresetCatalogManifest,
  listMechanicsPresetCatalog,
} from "./mechanicsPresetCatalog.js";
import {
  resolveActiveEngineModules,
  executeEngineModuleOperation,
} from "../../../../../../../services/engine-middleware/src/modules/engineModuleResolver.js";
import {
  resolveMechanicsCommandResolution,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandResolutionService.js";
import {
  selectMechanicsCommandOutcomeEffects,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandOutcomeService.js";
import {
  buildMechanicsCommandCompositionExecution,
  buildMechanicsCommandCompositionPlan,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandCompositionService.js";
import {
  bindMechanicsCommandEffectsToResolvedTargets,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandEffectTargetBindingService.js";
import {
  applyMechanicsCommandsForTurn,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsApplicatorService.js";
import {
  resolveMechanicsCommandDomainPatchLane,
  validateMechanicsCommandDomainComposition,
} from "../../../../../../../services/api/src/services/chat/mechanics/mechanicsCommandDomainCompositionService.js";

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function queueRandom(values = []) {
  const queue = [...values];
  return (minimum, maximum) => {
    const raw = queue.length ? Number(queue.shift()) : Number(minimum) || 1;
    const min = Number.isFinite(Number(minimum)) ? Number(minimum) : 1;
    const max = Number.isFinite(Number(maximum)) ? Number(maximum) : min + 20;
    return Math.max(min, Math.min(max - 1, raw));
  };
}

function stubDomainValidation({ command }) {
  const configured = normalizeObject(command?.domainAction);
  const actionType = String(configured.type || "NONE").toUpperCase();
  const lane = resolveMechanicsCommandDomainPatchLane(actionType);

  if (configured.enabled !== true || actionType === "NONE") {
    return {
      status: "NOT_CONFIGURED",
      passed: true,
      ready: false,
      configured,
      actionType: null,
      runtimeActionType: null,
      applyOnOutcomes: [],
      preparedAction: null,
      errors: [],
    };
  }

  return {
    status: lane ? "READY" : "REJECTED",
    passed: Boolean(lane),
    ready: Boolean(lane),
    configured,
    actionType,
    runtimeActionType: actionType,
    applyOnOutcomes: configured.applyOnOutcomes || [],
    preparedAction: lane ? { actionType, lane } : null,
    errors: lane
      ? []
      : [{ code: "REFERENCE_RUNTIME_LANE_UNKNOWN", message: actionType }],
  };
}

function makeAction({ scenario, command, resolution, outcome, execution, plan, binding }) {
  return {
    id: `${scenario.implementationId}:action`,
    actionType: "MECHANICS_EFFECTS",
    moduleKey: "core.trackers.v1",
    operation: "apply_mechanics_effects",
    parameters: {
      reason: `${scenario.label} reference runtime execution.`,
      source: "ENGINE_DETERMINISTIC_COMMAND",
      deterministic: true,
      matchedRuleId: command.id,
      matchedRuleReason: "mc7_reference_runtime_implementation",
      matchedTrigger: scenario.userInput,
      commandId: command.id,
      commandInvocation: scenario.invocation,
      requirementEvaluation: {
        version: "mechanics_command_requirements_v1",
        status: "PASSED",
        passed: true,
        requirementCount: command.requirements?.length || 0,
        passedCount: command.requirements?.length || 0,
        failedCount: 0,
        blockedHardLockCount: 0,
        results: [],
        errors: [],
      },
      effectBindingEvaluation: binding,
      resolutionResult: resolution,
      outcomeSelection: outcome,
      effects: execution.effects,
      attemptEffects: execution.attemptEffects,
      outcomeEffects: execution.outcomeEffects,
      composition: command.composition,
      compositionMechanicsSteps: execution.steps,
      compositionPlan: plan,
      idempotencyKey: `${scenario.implementationId}:turn_1`,
      sourceScopeKey: "STORY_ROOM:mc7_reference_room",
      sourceOwnerType: "STORY_ROOM",
      sourceOwnerId: scenario.room.id,
      sourceOwnerTitle: scenario.room.title,
      mechanicsScopeMode: "STORY_ROOM",
    },
  };
}

function readRootMechanicsValue(application, bucket, id) {
  return application?.statePatch?.mechanics?.[bucket]?.byId?.[id]?.value;
}

function readScopedMechanicsValue(application, scopeKey, bucket, id) {
  return application?.statePatch?.mechanics?.scopes?.byKey?.[scopeKey]?.[bucket]?.byId?.[id]?.value;
}

function mergeStatePatch(state, patch) {
  const current = normalizeObject(state?.state);
  const currentMechanics = normalizeObject(current.mechanics);
  const patchMechanics = normalizeObject(patch?.mechanics);

  return {
    state: {
      ...current,
      ...patch,
      mechanics: {
        ...currentMechanics,
        ...patchMechanics,
        meters: {
          byId: {
            ...normalizeObject(currentMechanics.meters?.byId),
            ...normalizeObject(patchMechanics.meters?.byId),
          },
        },
        flags: {
          byId: {
            ...normalizeObject(currentMechanics.flags?.byId),
            ...normalizeObject(patchMechanics.flags?.byId),
          },
        },
        counters: {
          byId: {
            ...normalizeObject(currentMechanics.counters?.byId),
            ...normalizeObject(patchMechanics.counters?.byId),
          },
        },
        stages: {
          byId: {
            ...normalizeObject(currentMechanics.stages?.byId),
            ...normalizeObject(patchMechanics.stages?.byId),
          },
        },
        scopes: {
          byKey: {
            ...normalizeObject(currentMechanics.scopes?.byKey),
            ...normalizeObject(patchMechanics.scopes?.byKey),
          },
        },
      },
    },
  };
}

function executeScenario(id) {
  const scenario = buildMechanicsReferenceRuntimeScenario(id);
  assert.ok(scenario, `Missing reference runtime scenario ${id}.`);

  const engineResolution = resolveActiveEngineModules({
    room: scenario.room,
    moduleBindings: [scenario.binding],
  });
  const operationPlan = engineResolution.operationPlan.find(
    (entry) => entry.moduleId === "core.trackers.v1"
  );
  assert.ok(operationPlan, "Trackers operation plan was not created.");

  const engineOperation = executeEngineModuleOperation({
    moduleId: operationPlan.moduleId,
    operation: operationPlan.operation,
    input: {
      room: scenario.room,
      state: scenario.state,
      ...operationPlan,
    },
  });

  const binding = bindMechanicsCommandEffectsToResolvedTargets({
    command: scenario.command,
    invocation: scenario.invocation,
  });
  assert.equal(binding.passed, true, JSON.stringify(binding.errors));
  const command = binding.command;
  const resolution = resolveMechanicsCommandResolution({
    command,
    room: scenario.room,
    turnCount: 1,
    randomIntProvider: queueRandom(scenario.rollSequence),
  });
  const outcome = selectMechanicsCommandOutcomeEffects({
    command,
    resolutionResult: resolution,
  });
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
  const domainEvaluation = validateMechanicsCommandDomainComposition({
    command,
    invocation: scenario.invocation,
    roomRuntimeContext: scenario.roomRuntimeContext,
    validateDomainAction: stubDomainValidation,
  });
  const action = makeAction({
    scenario,
    command,
    resolution,
    outcome,
    execution,
    plan,
    binding,
  });
  const application = applyMechanicsCommandsForTurn({
    room: scenario.room,
    state: scenario.state,
    turnActionRouter: { actions: [action] },
    engineModuleOperations: { operations: [engineOperation] },
    turnCount: 1,
    roomRuntimeContext: scenario.roomRuntimeContext,
    participants: scenario.participants,
  });

  return {
    scenario,
    engineResolution,
    operationPlan,
    engineOperation,
    binding,
    command,
    resolution,
    outcome,
    execution,
    plan,
    domainEvaluation,
    action,
    application,
  };
}

const executionCache = new Map();
function executionFor(id) {
  if (!executionCache.has(id)) {
    executionCache.set(id, executeScenario(id));
  }
  return executionCache.get(id);
}

test("Reference runtime implementation contract starts at v1", () => {
  assert.equal(
    MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
    "mechanics_reference_runtime_implementation_v1"
  );
});

test("Five reference runtime implementation ids are frozen", () => {
  assert.equal(MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS.length, 5);
  assert.equal(new Set(MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS).size, 5);
});

test("Every complete module starter has one runtime implementation", () => {
  const starters = listMechanicsModuleStarterPresets();
  const implementations = listMechanicsReferenceRuntimeImplementations();
  assert.equal(implementations.length, starters.length);
  assert.deepEqual(
    implementations.map((entry) => entry.moduleStarterId).sort(),
    starters.map((entry) => entry.id).sort()
  );
});

test("Runtime implementation ids resolve by id starter id and preset id", () => {
  const entry = getMechanicsReferenceRuntimeImplementation("RESOURCE_LOOP");
  assert.equal(entry.id, "runtime.resource_loop.v1");
  assert.equal(
    getMechanicsReferenceRuntimeImplementation(entry.modulePresetId).id,
    entry.id
  );
});

test("Unknown runtime implementation ids return null", () => {
  assert.equal(getMechanicsReferenceRuntimeImplementation("missing"), null);
  assert.equal(buildMechanicsReferenceRuntimeScenario("missing"), null);
});

test("Catalog manifest advertises MC7E runtime implementations", () => {
  const manifest = getMechanicsPresetCatalogManifest();
  assert.equal(
    manifest.referenceRuntimeImplementationVersion,
    MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION
  );
  assert.equal(manifest.referenceRuntimeImplementationCount, 5);
});

test("Module starter catalog entries retain runtime implementation metadata", () => {
  const modules = listMechanicsPresetCatalog({ category: "MODULE_STARTER" });
  assert.equal(modules.length, 5);
  modules.forEach((preset) => {
    assert.equal(
      preset.implementation.runtimeStatus,
      "REFERENCE_IMPLEMENTATION_READY"
    );
    assert.match(preset.implementation.runtimeImplementationId, /^runtime\./);
    assert.equal(
      preset.implementation.runtimeImplementationVersion,
      MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION
    );
  });
});

test("Runtime scenario builders return isolated clones", () => {
  const first = buildMechanicsReferenceRuntimeScenario("RESOURCE_LOOP");
  first.moduleData.tags.push("mutated");
  const second = buildMechanicsReferenceRuntimeScenario("RESOURCE_LOOP");
  assert.equal(second.moduleData.tags.includes("mutated"), false);
});

for (const id of MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS) {
  test(`${id} builds its declared module and command`, () => {
    const { scenario } = executionFor(id);
    assert.equal(scenario.moduleData.moduleDefinitionId, "core.trackers.v1");
    assert.equal(scenario.command.id.length > 0, true);
    assert.ok(buildMechanicsModuleStarterPreset(scenario.moduleStarterId));
  });

  test(`${id} resolves exactly one explicit Trackers binding`, () => {
    const { engineResolution } = executionFor(id);
    const trackerModules = engineResolution.modules.filter(
      (module) => module.moduleId === "core.trackers.v1"
    );

    assert.equal(trackerModules.length, 1);
    assert.equal(trackerModules[0].reason, "explicit_binding");
    assert.equal(
      trackerModules[0].bindingId,
      `${id}:binding`
    );
  });

  test(`${id} completes the engine tracker-context operation`, () => {
    const { engineOperation } = executionFor(id);
    assert.equal(engineOperation.status, "completed");
    assert.equal(
      engineOperation.result.trackersContract.commandResolutionVersion,
      "mechanics_command_resolution_v6"
    );
    assert.equal(
      engineOperation.result.trackersContract.commandCompositionVersion,
      "mechanics_command_composition_v1"
    );
  });

  test(`${id} resolves the expected authoritative outcome`, () => {
    const { scenario, resolution, outcome } = executionFor(id);
    assert.equal(resolution.outcome, scenario.expectedOutcome);
    assert.equal(outcome.outcome, scenario.expectedOutcome);
    assert.match(outcome.status, /^SELECTED/);
  });

  test(`${id} produces an ordered composition plan`, () => {
    const { plan } = executionFor(id);
    assert.equal(plan.status, "PLANNED");
    assert.equal(plan.executionUnit, "SINGLE_STRUCTURED_COMMAND");
    assert.equal(plan.crossLaneAtomicity, "NOT_TRANSACTIONAL");
    assert.equal(plan.steps.every((step, index) => step.order === index), true);
  });

  test(`${id} applies every declared expected Mechanics value`, () => {
    const { scenario, application } = executionFor(id);
    assert.equal(application.status, "applied");
    assert.equal(application.rejectedCount, 0);

    for (const [mechanicsId, expected] of Object.entries(
      scenario.expectedMechanics.meters || {}
    )) {
      assert.equal(
        readRootMechanicsValue(application, "meters", mechanicsId),
        expected
      );
    }
    for (const [mechanicsId, expected] of Object.entries(
      scenario.expectedMechanics.flags || {}
    )) {
      const actual =
        readRootMechanicsValue(application, "flags", mechanicsId) ??
        scenario.state.state.mechanics.flags.byId[mechanicsId]?.value;
      assert.equal(actual, expected);
    }
    for (const [mechanicsId, expected] of Object.entries(
      scenario.expectedMechanics.counters || {}
    )) {
      assert.equal(
        readRootMechanicsValue(application, "counters", mechanicsId),
        expected
      );
    }
    for (const [mechanicsId, expected] of Object.entries(
      scenario.expectedMechanics.stages || {}
    )) {
      const actual =
        readRootMechanicsValue(application, "stages", mechanicsId) ??
        scenario.state.state.mechanics.stages.byId[mechanicsId]?.value;
      assert.equal(actual, expected);
    }
  });
}

test("Social Probe resolves and applies target-scoped probe progress", () => {
  const { scenario, binding, application } = executionFor(
    "runtime.social_probe.v1"
  );
  assert.equal(binding.resolvedArgumentBindingCount >= 1, true);
  assert.equal(
    readScopedMechanicsValue(
      application,
      "PARTICIPANT:participant_kessa",
      "counters",
      "probe_hits"
    ),
    scenario.expectedMechanics.scopes["PARTICIPANT:participant_kessa"].counters
      .probe_hits
  );
});

test("Item Handoff exposes a ready ITEM_RUNTIME composition lane", () => {
  const { domainEvaluation } = executionFor("runtime.item_handoff.v1");
  assert.equal(domainEvaluation.status, "READY");
  assert.deepEqual(
    domainEvaluation.steps.map((step) => step.lane),
    ["ITEM_RUNTIME"]
  );
});

test("Travel Navigation exposes one final LOCATION_RUNTIME composition lane", () => {
  const { domainEvaluation, plan } = executionFor(
    "runtime.travel_navigation.v1"
  );
  assert.equal(domainEvaluation.status, "READY");
  assert.deepEqual(
    domainEvaluation.steps.map((step) => step.lane),
    ["LOCATION_RUNTIME"]
  );
  assert.equal(plan.steps.at(-1).lane, "DOMAIN");
  assert.equal(plan.steps.at(-1).domainActionType, "LOCATION_TRANSITION");
});

test("Quest Progress retains pending-state completion conditions and dependencies", () => {
  const { scenario, plan } = executionFor("runtime.quest_progress.v1");
  const completion = scenario.command.composition.mechanicsSteps.find(
    (step) => step.id === "complete_quest"
  );
  assert.ok(completion);
  assert.deepEqual(completion.dependsOnStepIds, ["advance_quest_progress"]);
  assert.equal(completion.conditions[0].bucket, "COUNTER");
  assert.equal(completion.conditions[0].operator, "GTE");
  assert.equal(plan.steps.some((step) => step.id === "complete_quest"), true);
});

test("Resource Loop engine context evaluates the resource guard as passed", () => {
  const { engineOperation } = executionFor("runtime.resource_loop.v1");
  assert.equal(engineOperation.result.guardResults.length, 1);
  assert.equal(engineOperation.result.guardResults[0].status, "PASS");
});

test("Reference runtime application preserves same-turn replay protection", () => {
  const first = executionFor("runtime.resource_loop.v1");
  const stateAfterFirst = mergeStatePatch(
    first.scenario.state,
    first.application.statePatch
  );
  const replay = applyMechanicsCommandsForTurn({
    room: first.scenario.room,
    state: stateAfterFirst,
    turnActionRouter: { actions: [first.action] },
    engineModuleOperations: { operations: [first.engineOperation] },
    turnCount: 1,
  });
  assert.equal(replay.acceptedCount, 0);
  assert.equal(replay.rejectedCount, 1);
  assert.match(replay.rejected[0].reason, /duplicate_idempotency_key/i);
});

test("Reference runtime scenarios do not alter source module presets", () => {
  const scenario = buildMechanicsReferenceRuntimeScenario("QUEST_PROGRESS");
  scenario.command.label = "Changed";
  const moduleData = buildMechanicsModuleStarterPreset("QUEST_PROGRESS");
  assert.equal(moduleData.instanceData.commands[0].label, "Advance Quest Progress");
});

test("MC5 and MC6 contracts remain frozen in every reference runtime", () => {
  for (const id of MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS) {
    const { scenario } = executionFor(id);
    assert.equal(
      scenario.command.resolution.version,
      "mechanics_command_resolution_v6"
    );
    assert.equal(
      scenario.command.composition.version,
      "mechanics_command_composition_v1"
    );
  }
});

console.log("Crestfall mc7_reference_runtime_implementation_diagnostics_v1");
console.log(`Node ${process.version}\n`);

let passed = 0;
let failed = 0;
const startedAt = Date.now();

for (let index = 0; index < tests.length; index += 1) {
  const current = tests[index];
  const testStartedAt = Date.now();

  try {
    await current.fn();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - testStartedAt} ms)`
    );
  } catch (error) {
    failed += 1;
    console.error(
      `FAIL ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - testStartedAt} ms)`
    );
    console.error(error?.stack || error);
  }
}

console.log(`\nSummary: ${passed} passed, ${failed} failed, ${tests.length} total`);
console.log(`Elapsed: ${Date.now() - startedAt} ms`);

if (failed > 0) {
  process.exitCode = 1;
}
