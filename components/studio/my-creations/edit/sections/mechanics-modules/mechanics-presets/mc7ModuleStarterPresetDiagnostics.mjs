import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_MODULE_STARTER_IDS,
  MECHANICS_MODULE_STARTER_VERSION,
  buildMechanicsModuleStarterPreset,
  getMechanicsModuleStarterPresetDefinition,
  listMechanicsModuleStarterPresets,
  summarizeMechanicsModuleStarterPreset,
} from "./mechanicsModuleStarterPresets.js";
import {
  buildMechanicsPresetPayload,
  getMechanicsPresetCatalogManifest,
  getMechanicsPresetDefinition,
  listMechanicsPresetCatalog,
  summarizeMechanicsPresetCatalog,
} from "./mechanicsPresetCatalog.js";
import {
  MECHANICS_COMMAND_RESOLUTION_VERSION,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_COMMAND_COMPOSITION_VERSION,
} from "../mechanicsCommandCompositionBuilder.js";
import {
  validateMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function modulePreset(id) {
  const value = buildMechanicsModuleStarterPreset(id);
  assert.ok(value, `Missing module starter ${id}`);
  return value;
}

function assertComplies(value) {
  const result = validateMechanicsModuleData(value);
  assert.equal(
    result.valid,
    true,
    result.errors.map((issue) => `${issue.path}: ${issue.message}`).join("\n")
  );
}

function defaults(value) {
  return value.instanceData.defaults;
}

function command(value, index = 0) {
  return value.instanceData.commands[index];
}

function guard(value, index = 0) {
  return value.instanceData.guards[index];
}

function statusBlock(value, index = 0) {
  return value.instanceData.statusBlocks[index];
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test("Module starter contract starts at v1", () => {
  assert.equal(
    MECHANICS_MODULE_STARTER_VERSION,
    "mechanics_module_starter_presets_v1"
  );
});

test("MC7C publishes five module starter identities", () => {
  assert.deepEqual(MECHANICS_MODULE_STARTER_IDS, [
    "RESOURCE_LOOP",
    "SOCIAL_PROBE",
    "ITEM_HANDOFF",
    "TRAVEL_NAVIGATION",
    "QUEST_PROGRESS",
  ]);
});

test("Module starter definitions are stable and unique", () => {
  const definitions = listMechanicsModuleStarterPresets();
  assert.equal(definitions.length, 5);
  assert.equal(new Set(definitions.map((entry) => entry.id)).size, 5);
  assert.equal(new Set(definitions.map((entry) => entry.presetId)).size, 5);
});

test("Module definition lookup accepts reference and preset IDs", () => {
  assert.equal(
    getMechanicsModuleStarterPresetDefinition("resource_loop")?.presetId,
    "module.resource_loop.v1"
  );
  assert.equal(
    getMechanicsModuleStarterPresetDefinition("MODULE.QUEST_PROGRESS.V1")?.id,
    "QUEST_PROGRESS"
  );
});

test("Unknown module definition returns null", () => {
  assert.equal(getMechanicsModuleStarterPresetDefinition("missing"), null);
});

test("Unknown module build returns null", () => {
  assert.equal(buildMechanicsModuleStarterPreset("missing"), null);
});

test("Definition callers cannot mutate module catalog truth", () => {
  const first = listMechanicsModuleStarterPresets();
  first[0].tags.push("mutated");
  const second = listMechanicsModuleStarterPresets();
  assert.equal(second[0].tags.includes("mutated"), false);
});

test("Module builders return isolated copies", () => {
  const first = modulePreset("RESOURCE_LOOP");
  first.instanceData.trackers[0].label = "Mutated";
  const second = modulePreset("RESOURCE_LOOP");
  assert.notEqual(second.instanceData.trackers[0].label, "Mutated");
});

test("Every module uses core trackers identity", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    const value = modulePreset(id);
    assert.equal(value.moduleDefinitionId, "core.trackers.v1");
    assert.equal(value.moduleId, "core.trackers.v1");
  });
});

test("Every module retains instance data v0.2", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    const value = modulePreset(id);
    assert.equal(value.contractVersion, "trackers_instance_data.v0_2");
    assert.equal(
      value.instanceData.contractVersion,
      "trackers_instance_data.v0_2"
    );
  });
});

test("Every module supplies all authored collections", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    const instanceData = modulePreset(id).instanceData;
    assert.ok(Array.isArray(instanceData.trackers));
    assert.ok(Array.isArray(instanceData.commands));
    assert.ok(Array.isArray(instanceData.guards));
    assert.ok(Array.isArray(instanceData.statusBlocks));
    assert.ok(Array.isArray(instanceData.defaults.flags));
    assert.ok(Array.isArray(instanceData.defaults.counters));
    assert.ok(Array.isArray(instanceData.defaults.stages));
  });
});

test("Every module contains at least one runnable command", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    assert.ok(modulePreset(id).instanceData.commands.length >= 1);
  });
});

test("Every module contains a guard", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    assert.ok(modulePreset(id).instanceData.guards.length >= 1);
  });
});

test("Every module contains a status block", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    assert.ok(modulePreset(id).instanceData.statusBlocks.length >= 1);
  });
});

test("Every module contains defaults", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    const summary = summarizeMechanicsModuleStarterPreset(modulePreset(id));
    assert.ok(summary.defaultCount >= 3);
  });
});

test("Every module passes complete JSON editor compliance", () => {
  MECHANICS_MODULE_STARTER_IDS.forEach((id) => {
    assertComplies(modulePreset(id));
  });
});

test("Every module catalog payload passes compliance", () => {
  listMechanicsPresetCatalog({ category: "MODULE_STARTER" }).forEach((preset) => {
    const built = buildMechanicsPresetPayload(preset.id);
    assert.equal(built.ok, true, built.error?.message);
    assertComplies(built.payload.value);
  });
});

test("Combined catalog now contains twenty presets", () => {
  assert.equal(getMechanicsPresetCatalogManifest().presetCount, 20);
});

test("Combined catalog contains five module starters", () => {
  assert.equal(summarizeMechanicsPresetCatalog().byCategory.MODULE_STARTER, 5);
});

test("Module scope filter returns five module starters", () => {
  const presets = listMechanicsPresetCatalog({ scope: "MODULE" });
  assert.equal(presets.length, 5);
  assert.ok(presets.every((preset) => preset.category === "MODULE_STARTER"));
});

test("Manifest advertises the module starter contract", () => {
  assert.equal(
    getMechanicsPresetCatalogManifest().moduleStarterVersion,
    MECHANICS_MODULE_STARTER_VERSION
  );
});

test("Module starter catalog IDs use the module namespace", () => {
  listMechanicsPresetCatalog({ category: "MODULE_STARTER" }).forEach((preset) => {
    assert.match(preset.id, /^module\.[a-z0-9._:-]+\.v1$/);
  });
});

test("Module starter definitions are READY from MC7C", () => {
  listMechanicsPresetCatalog({ category: "MODULE_STARTER" }).forEach((preset) => {
    assert.equal(preset.implementation.status, "READY");
    assert.equal(preset.implementation.phase, "MC7C");
    assert.equal(
      preset.implementation.builder,
      "buildMechanicsModuleStarterPreset"
    );
  });
});

test("Module starters declare replace-module boundaries", () => {
  listMechanicsPresetCatalog({ category: "MODULE_STARTER" }).forEach((preset) => {
    assert.equal(preset.application.defaultMode, "REPLACE_MODULE");
    assert.deepEqual(preset.application.allowedModes, ["REPLACE_MODULE", "MERGE_MODULE"]);
    assert.deepEqual(preset.application.replacementPaths, ["module"]);
  });
});

test("Module replacement preserves creation-level identity", () => {
  const preset = getMechanicsPresetDefinition("module.resource_loop.v1");
  assert.ok(preset.application.preservedPaths.includes("creation.id"));
  assert.ok(preset.application.preservedPaths.includes("creation.ownerId"));
  assert.ok(preset.application.preservedPaths.includes("creation.title"));
  assert.ok(preset.application.preservedPaths.includes("creation.featuredMedia"));
});

test("Module starters require no pre-existing command arguments", () => {
  listMechanicsPresetCatalog({ category: "MODULE_STARTER" }).forEach((preset) => {
    assert.deepEqual(preset.applicability.requiredArgumentTypes, []);
    assert.equal(preset.availability.available, true);
  });
});

test("Module payloads use REPLACE_MODULE", () => {
  const built = buildMechanicsPresetPayload("module.social_probe.v1");
  assert.equal(built.ok, true);
  assert.equal(built.payload.scope, "MODULE");
  assert.equal(built.payload.applyMode, "REPLACE_MODULE");
  assert.deepEqual(built.payload.replacementPaths, ["module"]);
});

test("Built module payloads are isolated copies", () => {
  const first = buildMechanicsPresetPayload("module.item_handoff.v1");
  first.payload.value.instanceData.commands[0].invocation.command = "mutated";
  const second = buildMechanicsPresetPayload("module.item_handoff.v1");
  assert.equal(second.payload.value.instanceData.commands[0].invocation.command, "give");
});

test("Catalog search finds the quest module", () => {
  const presets = listMechanicsPresetCatalog({ query: "staged progression" });
  assert.equal(presets.length, 1);
  assert.equal(presets[0].id, "module.quest_progress.v1");
});

test("All five module starters are available without command context", () => {
  const summary = summarizeMechanicsPresetCatalog({ category: "MODULE_STARTER" });
  assert.equal(summary.available, 5);
  assert.equal(summary.unavailable, 0);
});

test("Resource Loop supplies the authoritative resource tracker", () => {
  const value = modulePreset("RESOURCE_LOOP");
  assert.equal(value.instanceData.trackers[0].id, "resource");
  assert.equal(value.instanceData.trackers[0].initial, 40);
  assert.equal(value.instanceData.trackers[0].phases.length, 4);
});

test("Resource Loop embeds the MC7B resource command", () => {
  const value = modulePreset("RESOURCE_LOOP");
  assert.equal(command(value).invocation.command, "focus");
  assert.equal(command(value).resolution.version, MECHANICS_COMMAND_RESOLUTION_VERSION);
  assert.equal(command(value).requirements[0].targetId, "resource");
});

test("Resource Loop hard-locks below its action cost", () => {
  const value = modulePreset("RESOURCE_LOOP");
  assert.equal(guard(value).enforcement, "HARD_LOCK");
  assert.equal(guard(value).conditions[0].id, "resource");
  assert.equal(guard(value).conditions[0].operator, "gte");
  assert.equal(guard(value).conditions[0].value, 5);
});

test("Resource Loop exposes deterministic status lines", () => {
  const lines = statusBlock(modulePreset("RESOURCE_LOOP")).lines;
  assert.ok(lines.some((line) => line.includes("trackers.resource.value")));
  assert.ok(lines.some((line) => line.includes("resource_successes")));
});

test("Social Probe supplies the authoritative trust tracker", () => {
  const value = modulePreset("SOCIAL_PROBE");
  assert.equal(value.instanceData.trackers[0].id, "trust");
  assert.equal(value.instanceData.trackers[0].initial, 40);
});

test("Social Probe embeds opposed resolution v6", () => {
  const value = modulePreset("SOCIAL_PROBE");
  assert.equal(command(value).invocation.command, "probe");
  assert.equal(command(value).resolution.mode, "OPPOSED_DIE");
  assert.equal(command(value).resolution.version, MECHANICS_COMMAND_RESOLUTION_VERSION);
});

test("Social Probe preserves target-scoped success state", () => {
  const effect = command(modulePreset("SOCIAL_PROBE")).effects[0];
  assert.equal(effect.targetId, "probe_hits");
  assert.equal(effect.targetBinding.mode, "ARGUMENT");
  assert.equal(effect.targetBinding.argumentName, "target");
});

test("Social Probe defaults support attempt and failure counters", () => {
  const ids = defaults(modulePreset("SOCIAL_PROBE")).counters.map((entry) => entry.id);
  assert.ok(ids.includes("attempt_count"));
  assert.ok(ids.includes("success_count"));
  assert.ok(ids.includes("failed_probes"));
});

test("Item Handoff embeds the authoritative give command", () => {
  const value = modulePreset("ITEM_HANDOFF");
  assert.equal(command(value).invocation.command, "give");
  assert.equal(command(value).composition.domainSteps[0].action.type, "ITEM_GIVE");
});

test("Item Handoff declares the Item runtime lane", () => {
  const definition = getMechanicsModuleStarterPresetDefinition("ITEM_HANDOFF");
  assert.deepEqual(definition.domainLanes, ["ITEM_RUNTIME"]);
});

test("Item Handoff defaults and guard expose an enablement switch", () => {
  const value = modulePreset("ITEM_HANDOFF");
  assert.equal(defaults(value).flags[0].id, "handoff_enabled");
  assert.equal(defaults(value).flags[0].initial, true);
  assert.equal(guard(value).conditions[0].id, "handoff_enabled");
});

test("Travel Navigation embeds the authoritative Location command", () => {
  const value = modulePreset("TRAVEL_NAVIGATION");
  assert.equal(command(value).invocation.command, "go");
  assert.equal(
    command(value).composition.domainSteps.at(-1).action.type,
    "LOCATION_TRANSITION"
  );
});

test("Travel Navigation retains the Location action last", () => {
  const steps = command(modulePreset("TRAVEL_NAVIGATION")).composition.domainSteps;
  assert.equal(steps.length, 1);
  assert.equal(steps.at(-1).action.type, "LOCATION_TRANSITION");
});

test("Travel Navigation declares the Location runtime lane", () => {
  const definition = getMechanicsModuleStarterPresetDefinition("TRAVEL_NAVIGATION");
  assert.deepEqual(definition.domainLanes, ["LOCATION_RUNTIME"]);
});

test("Quest Progress uses composition v1", () => {
  const composition = command(modulePreset("QUEST_PROGRESS")).composition;
  assert.equal(composition.version, MECHANICS_COMMAND_COMPOSITION_VERSION);
});

test("Quest Progress orders attempt advance and completion steps", () => {
  const steps = command(modulePreset("QUEST_PROGRESS")).composition.mechanicsSteps;
  assert.deepEqual(steps.map((step) => step.id), [
    "record_quest_attempt",
    "advance_quest_progress",
    "complete_quest",
  ]);
});

test("Quest completion depends on the prior progress step", () => {
  const steps = command(modulePreset("QUEST_PROGRESS")).composition.mechanicsSteps;
  assert.deepEqual(steps[2].dependsOnStepIds, ["advance_quest_progress"]);
});

test("Quest completion reads pending command-source counter state", () => {
  const condition = command(modulePreset("QUEST_PROGRESS"))
    .composition.mechanicsSteps[2].conditions[0];
  assert.equal(condition.bucket, "COUNTER");
  assert.equal(condition.mechanicsId, "quest_progress");
  assert.equal(condition.scopeMode, "COMMAND_SOURCE");
  assert.equal(condition.operator, "GTE");
  assert.equal(condition.value, 3);
});

test("Quest completion writes stage and active flag effects", () => {
  const effects = command(modulePreset("QUEST_PROGRESS"))
    .composition.mechanicsSteps[2].effects;
  assert.deepEqual(effects.map((effect) => effect.type), ["STAGE_SET", "FLAG_CLEAR"]);
  assert.equal(effects[0].targetId, "quest_stage");
  assert.equal(effects[1].targetId, "quest_active");
});

test("Quest Progress status exposes progress stage and momentum", () => {
  const lines = statusBlock(modulePreset("QUEST_PROGRESS")).lines;
  assert.ok(lines[0].includes("stages.quest_stage.value"));
  assert.ok(lines[0].includes("counters.quest_progress.value"));
  assert.ok(lines[0].includes("trackers.quest_momentum.value"));
});

test("Module starter source has no API or persistence coupling", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "mechanicsModuleStarterPresets.js"),
    "utf8"
  );
  assert.equal(/\bfetch\s*\(/.test(source), false);
  assert.equal(source.includes("supabase"), false);
  assert.equal(source.includes("PostGraphile"), false);
  assert.equal(source.includes("useState"), false);
});

console.log("Crestfall mc7_module_starter_preset_diagnostics_v1");
console.log(`Node ${process.version}\n`);

let passed = 0;
let failed = 0;
const started = Date.now();

for (let index = 0; index < tests.length; index += 1) {
  const { name, fn } = tests[index];
  const testStarted = Date.now();

  try {
    await fn();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${name} (${Date.now() - testStarted} ms)`
    );
  } catch (error) {
    failed += 1;
    console.log(
      `FAIL ${String(index + 1).padStart(2, "0")} ${name} (${Date.now() - testStarted} ms)`
    );
    console.error(error?.stack || error);
  }
}

console.log(`\nSummary: ${passed} passed, ${failed} failed, ${tests.length} total`);
console.log(`Elapsed: ${Date.now() - started} ms`);

if (failed > 0) process.exitCode = 1;
