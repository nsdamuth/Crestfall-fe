import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const VERSION = "mc6f1_mechanics_composition_builder_diagnostics_v1";
const ROOT = process.cwd();
const FEATURE_ROOT = path.join(
  ROOT,
  "components/studio/my-creations/edit/sections/mechanics-modules"
);
const HELPER_PATH = path.join(
  FEATURE_ROOT,
  "mechanicsCommandCompositionBuilder.js"
);
const SHELL_PATH = path.join(
  FEATURE_ROOT,
  "mechanics-composition-builder/MechanicsCompositionBuilder.jsx"
);
const VIEW_PATH = path.join(
  FEATURE_ROOT,
  "mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx"
);
const VIEWMODEL_PATH = path.join(
  FEATURE_ROOT,
  "mechanics-composition-builder/useMechanicsCompositionBuilderViewModel.js"
);
const CONTRACT_PATH = path.join(
  FEATURE_ROOT,
  "mechanics-composition-builder/MechanicsCompositionBuilder.contract.js"
);
const FIXTURES_PATH = path.join(
  FEATURE_ROOT,
  "mechanics-composition-builder/mechanicsCompositionBuilder.fixtures.js"
);
const README_PATH = path.join(
  FEATURE_ROOT,
  "mechanics-composition-builder/README.md"
);
const UI_PATH = path.join(FEATURE_ROOT, "MechanicsModuleFieldsSection.jsx");
const PREVIEW_PAGE_PATH = path.join(
  ROOT,
  "app/dev/ui-preview/mechanics-composition-builder/page.jsx"
);
const ENGINE_PATH = path.join(
  ROOT,
  "services/engine-middleware/src/modules/engineModuleResolver.js"
);

const helperSource = fs.readFileSync(HELPER_PATH, "utf8");
const helper = await import(pathToFileURL(HELPER_PATH).href);
const shellSource = fs.readFileSync(SHELL_PATH, "utf8");
const viewSource = fs.readFileSync(VIEW_PATH, "utf8");
const viewModelSource = fs.readFileSync(VIEWMODEL_PATH, "utf8");
const contractSource = fs.readFileSync(CONTRACT_PATH, "utf8");
const fixturesSource = fs.readFileSync(FIXTURES_PATH, "utf8");
const uiSource = fs.readFileSync(UI_PATH, "utf8");
const previewSource = fs.readFileSync(PREVIEW_PAGE_PATH, "utf8");
const engineModule = await import(pathToFileURL(ENGINE_PATH).href);

const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

function has(source, text) {
  return source.includes(text);
}

function argumentsFor(...types) {
  return types.map((type, index) => ({
    name: `${type.toLowerCase()}_${index + 1}`,
    label: `${type} ${index + 1}`,
    type,
  }));
}

test("Composition builder contract starts at v1", () => {
  assert.equal(
    helper.MECHANICS_COMMAND_COMPOSITION_BUILDER_VERSION,
    "mechanics_command_composition_builder_v1"
  );
  assert.equal(
    helper.MECHANICS_COMMAND_COMPOSITION_VERSION,
    "mechanics_command_composition_v1"
  );
});

test("Builder exposes MC6 phases and outcomes", () => {
  assert.deepEqual(helper.MECHANICS_COMMAND_COMPOSITION_PHASES, ["ATTEMPT", "OUTCOME"]);
  assert.deepEqual(helper.MECHANICS_COMMAND_COMPOSITION_OUTCOMES, [
    "CRITICAL_SUCCESS",
    "SUCCESS",
    "FAILURE",
    "FUMBLE",
  ]);
});

test("Builder exposes continuation policies", () => {
  assert.deepEqual(helper.MECHANICS_COMMAND_COMPOSITION_FAILURE_POLICIES, [
    "CONTINUE",
    "STOP",
    "SKIP_DEPENDENTS",
  ]);
});

test("Builder exposes condition contract", () => {
  assert.deepEqual(helper.MECHANICS_COMMAND_COMPOSITION_CONDITION_MODES, ["ALL", "ANY"]);
  assert.equal(helper.MECHANICS_COMMAND_COMPOSITION_CONDITION_SCOPE_MODES.includes("TARGET_ARGUMENT"), true);
  assert.equal(helper.MECHANICS_COMMAND_COMPOSITION_CONDITION_OPERATORS.includes("NOT_IN"), true);
});

test("Builder retains backend step limits", () => {
  assert.equal(helper.MECHANICS_COMMAND_COMPOSITION_MAX_MECHANICS_STEPS, 24);
  assert.equal(helper.MECHANICS_COMMAND_COMPOSITION_MAX_DOMAIN_STEPS, 3);
});

test("Mechanics step aliases normalize", () => {
  const value = helper.normalizeMechanicsCommandCompositionBuilder({
    mechanics_steps: [
      {
        key: "cost",
        timing: "attempt",
        onFailure: "halt",
        effects: [{ type: "METER_DELTA", targetId: "focus", amount: -2 }],
      },
    ],
  });
  assert.equal(value.mechanicsSteps[0].id, "cost");
  assert.equal(value.mechanicsSteps[0].phase, "ATTEMPT");
  assert.equal(value.mechanicsSteps[0].failurePolicy, "STOP");
});

test("Outcome filters remain only on outcome steps", () => {
  const value = helper.normalizeMechanicsCommandCompositionStep({
    phase: "ATTEMPT",
    applyOnOutcomes: ["SUCCESS"],
  });
  assert.deepEqual(value.applyOnOutcomes, []);
});

test("Conditions normalize authoritative scopes", () => {
  const value = helper.normalizeMechanicsCommandCompositionCondition({
    bucket: "COUNTER",
    mechanicsId: "hits",
    scopeMode: "TARGET_ARGUMENT",
    argumentName: "target",
    operator: "GTE",
    value: 2,
  });
  assert.equal(value.scopeMode, "TARGET_ARGUMENT");
  assert.equal(value.argumentName, "target");
  assert.equal(value.operator, "GTE");
});

test("Effects retain argument binding", () => {
  const value = helper.normalizeMechanicsCommandCompositionEffect({
    id: "target_hit",
    type: "COUNTER_INCREMENT",
    targetId: "hits",
    targetBinding: { mode: "ARGUMENT", argumentName: "target" },
    amount: 1,
  });
  assert.equal(value.targetBinding.mode, "ARGUMENT");
  assert.equal(value.targetBinding.argumentName, "target");
});

test("Domain step aliases normalize", () => {
  const value = helper.normalizeMechanicsCommandCompositionBuilder({
    domain_actions: [
      {
        key: "give",
        onFailure: "stop_composition",
        domainAction: {
          type: "ITEM_GIVE",
          itemArgumentName: "item",
          targetArgumentName: "target",
        },
      },
    ],
  });
  assert.equal(value.domainSteps[0].id, "give");
  assert.equal(value.domainSteps[0].failurePolicy, "STOP");
  assert.equal(value.domainSteps[0].action.type, "ITEM_GIVE");
});

test("Duplicate step ids normalize deterministically", () => {
  const value = helper.normalizeMechanicsCommandCompositionBuilder({
    mechanicsSteps: [{ id: "step" }, { id: "step" }],
    domainSteps: [{ id: "domain" }, { id: "domain" }],
  });
  assert.deepEqual(value.mechanicsSteps.map((step) => step.id), ["step", "step_2"]);
  assert.deepEqual(value.domainSteps.map((step) => step.id), ["domain", "domain_2"]);
});

test("Sequential reference authors attempt and outcome steps", () => {
  const value = helper.buildMechanicsCommandCompositionReference("SEQUENTIAL_ATTEMPT_SUCCESS");
  assert.equal(value.mechanicsSteps.length, 2);
  assert.equal(value.mechanicsSteps[0].phase, "ATTEMPT");
  assert.equal(value.mechanicsSteps[1].phase, "OUTCOME");
});

test("Conditional reference authors dependency and pending-state condition", () => {
  const value = helper.buildMechanicsCommandCompositionReference("CONDITIONAL_MILESTONE");
  assert.deepEqual(value.mechanicsSteps[1].dependsOnStepIds, ["advance_chain"]);
  assert.equal(value.mechanicsSteps[1].conditions[0].mechanicsId, "chain");
  assert.equal(value.mechanicsSteps[1].conditions[0].operator, "GTE");
});

test("Item and condition reference requires typed arguments", () => {
  const unavailable = helper.buildMechanicsCommandCompositionReference(
    "ITEM_AND_CONDITION",
    argumentsFor("ITEM_HELD", "CHARACTER_PRESENT")
  );
  const available = helper.buildMechanicsCommandCompositionReference(
    "ITEM_AND_CONDITION",
    argumentsFor("ITEM_HELD", "CHARACTER_PRESENT", "TEXT")
  );
  assert.equal(unavailable, null);
  assert.equal(available.domainSteps.length, 2);
});

test("Three-lane reference keeps Location final", () => {
  const value = helper.buildMechanicsCommandCompositionReference(
    "ITEM_CONDITION_LOCATION",
    argumentsFor("ITEM_HELD", "CHARACTER_PRESENT", "TEXT", "LOCATION_CONNECTED")
  );
  assert.equal(value.domainSteps.length, 3);
  assert.equal(value.domainSteps[2].action.type, "LOCATION_TRANSITION");
});

test("Domain lane mapping remains isolated", () => {
  assert.equal(helper.getMechanicsCommandCompositionDomainLane("ITEM_USE"), "ITEM_RUNTIME");
  assert.equal(helper.getMechanicsCommandCompositionDomainLane("PARTICIPANT_CONDITION_APPLY"), "SENSORY_RUNTIME");
  assert.equal(helper.getMechanicsCommandCompositionDomainLane("LOCATION_TRANSITION"), "LOCATION_RUNTIME");
});

test("Composition summary reports steps effects conditions and lanes", () => {
  const value = helper.summarizeMechanicsCommandCompositionBuilder({
    mechanicsSteps: [
      {
        id: "step",
        phase: "OUTCOME",
        conditions: [{ mechanicsId: "ready" }],
        effects: [{ type: "FLAG_SET", targetId: "done" }],
      },
    ],
    domainSteps: [
      { action: { type: "ITEM_USE", enabled: true } },
    ],
  });
  assert.equal(value.conditionCount, 1);
  assert.equal(value.effectCount, 1);
  assert.deepEqual(value.domainLanes, ["ITEM_RUNTIME"]);
});

test("LOOM shell connects ViewModel and View only", () => {
  assert.equal(has(shellSource, "useMechanicsCompositionBuilderViewModel"), true);
  assert.equal(has(shellSource, "MechanicsCompositionBuilderView"), true);
  assert.equal(has(shellSource, "fetch("), false);
});

test("Portable View contains no application data access", () => {
  assert.equal(has(viewSource, "fetch("), false);
  assert.equal(has(viewSource, "Supabase"), false);
  assert.equal(has(viewSource, "PostGraphile"), false);
  assert.equal(has(viewSource, "/lib/client"), false);
  assert.equal(has(viewSource, "updateDataField"), false);
});

test("ViewModel owns normalization and mutations", () => {
  assert.equal(has(viewModelSource, "normalizeMechanicsCommandCompositionBuilder"), true);
  assert.equal(has(viewModelSource, "function patchMechanicsStep"), true);
  assert.equal(has(viewModelSource, "function patchDomainStep"), true);
  assert.equal(has(viewModelSource, "onChange?."), true);
});

test("Versioned contract lists semantic callbacks", () => {
  assert.equal(has(contractSource, '"1.0.0"'), true);
  assert.equal(has(contractSource, '"onAddMechanicsStep"'), true);
  assert.equal(has(contractSource, '"onToggleDomainDependency"'), true);
});

test("Fixtures are View-contract shaped", () => {
  assert.equal(has(fixturesSource, "mechanicsCompositionConfiguredFixture"), true);
  assert.equal(has(fixturesSource, "mechanicsSteps:"), true);
  assert.equal(has(fixturesSource, "domainSteps:"), true);
  assert.equal(has(fixturesSource, "onPatchMechanicsStep"), true);
});

test("Preview route is production gated", () => {
  assert.equal(has(previewSource, 'process.env.NODE_ENV === "production"'), true);
  assert.equal(has(previewSource, "notFound()"), true);
});

test("README documents non-transactional authority boundary", () => {
  const source = fs.readFileSync(README_PATH, "utf8");
  assert.equal(has(source, "NOT_TRANSACTIONAL"), true);
  assert.equal(has(source, "services-api remains authoritative"), true);
});

test("Mechanics UI imports the LOOM composition Shell", () => {
  assert.equal(has(uiSource, 'MechanicsCompositionBuilder from "./mechanics-composition-builder/MechanicsCompositionBuilder"'), true);
  assert.equal(has(uiSource, "<MechanicsCompositionBuilder"), true);
});

test("Command normalizer retains composition", () => {
  assert.equal(has(uiSource, "composition: normalizeMechanicsCommandCompositionBuilder("), true);
  assert.equal(has(uiSource, "replaceComposition"), true);
});

test("Command fold summary includes composition counts", () => {
  assert.equal(has(uiSource, "enabledMechanicsStepCount"), true);
  assert.equal(has(uiSource, '"composition step"'), true);
  assert.equal(has(uiSource, '"domain step"'), true);
});

test("Engine contract advertises MC6 composition versions", () => {
  const result = engineModule.executeEngineModuleOperation({
    moduleId: "core.trackers.v1",
    operation: "get_tracker_context",
    input: {},
  });
  const contract = result.result.trackersContract;
  assert.equal(contract.commandCompositionVersion, "mechanics_command_composition_v1");
  assert.equal(contract.commandDomainCompositionVersion, "mechanics_command_domain_composition_v1");
});

test("Engine contract advertises continuation and condition values", () => {
  const result = engineModule.executeEngineModuleOperation({
    moduleId: "core.trackers.v1",
    operation: "get_tracker_context",
    input: {},
  });
  const contract = result.result.trackersContract;
  assert.deepEqual(contract.commandCompositionFailurePolicies, ["CONTINUE", "STOP", "SKIP_DEPENDENTS"]);
  assert.equal(contract.commandCompositionConditionScopeModes.includes("TARGET_ARGUMENT"), true);
});

test("Engine contract advertises limits and patch lanes", () => {
  const result = engineModule.executeEngineModuleOperation({
    moduleId: "core.trackers.v1",
    operation: "get_tracker_context",
    input: {},
  });
  const contract = result.result.trackersContract;
  assert.equal(contract.commandCompositionLimits.domainSteps, 3);
  assert.deepEqual(contract.commandCompositionPatchLanes, [
    "ITEM_RUNTIME",
    "SENSORY_RUNTIME",
    "LOCATION_RUNTIME",
  ]);
  assert.equal(contract.commandCompositionCrossLaneAtomicity, "NOT_TRANSACTIONAL");
});

test("Engine operation preserves authored composition fields", () => {
  const command = {
    id: "compose",
    composition: {
      version: "mechanics_command_composition_v1",
      mechanicsSteps: [{ id: "step", phase: "OUTCOME", effects: [] }],
      domainSteps: [{ id: "domain", action: { type: "ITEM_USE" } }],
    },
  };
  const resolved = engineModule.resolveActiveEngineModules({
    moduleBindings: [
      {
        moduleId: "core.trackers.v1",
        enabled: true,
        data: { commands: [command] },
      },
    ],
  });
  const resolvedCommand = resolved.operationPlan.find(
    (entry) => entry.moduleId === "core.trackers.v1"
  ).instanceData.commands[0];
  assert.deepEqual(resolvedCommand.composition, command.composition);
});

test("MC5 resolution builder remains at v6", () => {
  const source = fs.readFileSync(
    path.join(FEATURE_ROOT, "mechanicsCommandResolutionBuilder.js"),
    "utf8"
  );
  assert.equal(has(source, '"mechanics_command_resolution_v6"'), true);
});

test("MC6F.1 changes no services-api production files", () => {
  assert.equal(has(viewSource, "services/api"), false);
  assert.equal(has(viewModelSource, "services/api"), false);
});

const startedAt = Date.now();
let passed = 0;
let failed = 0;

console.log(`Crestfall ${VERSION}`);
console.log(`Node ${process.version}`);
console.log("");

for (let index = 0; index < tests.length; index += 1) {
  const entry = tests[index];
  const testStartedAt = Date.now();

  try {
    await entry.run();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${entry.name} (${Date.now() - testStartedAt} ms)`
    );
  } catch (error) {
    failed += 1;
    console.log(
      `FAIL ${String(index + 1).padStart(2, "0")} ${entry.name} (${Date.now() - testStartedAt} ms)`
    );
    console.error(error);
  }
}

console.log("");
console.log(`Summary: ${passed} passed, ${failed} failed, ${tests.length} total`);
console.log(`Elapsed: ${Date.now() - startedAt} ms`);

if (failed) process.exit(1);
