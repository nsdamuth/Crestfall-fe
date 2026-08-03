import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_COMMAND_STARTER_IDS,
  MECHANICS_COMMAND_STARTER_VERSION,
  buildMechanicsCommandStarterPreset,
  getMechanicsCommandStarterPresetDefinition,
  listMechanicsCommandStarterPresets,
  summarizeMechanicsCommandStarterPreset,
} from "./mechanicsCommandStarterPresets.js";
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

function makeModule(command) {
  return {
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    priority: 65,
    tags: ["mc7b", "command-starter"],
    contractVersion: "trackers_instance_data.v0_2",
    instanceData: {
      contractVersion: "trackers_instance_data.v0_2",
      trackers: [],
      commands: [command],
      guards: [],
      statusBlocks: [],
      defaults: {
        flags: [],
        counters: [],
        stages: [],
      },
    },
  };
}

function assertCommandComplies(command) {
  const result = validateMechanicsModuleData(makeModule(command));
  assert.equal(
    result.valid,
    true,
    result.errors.map((issue) => `${issue.path}: ${issue.message}`).join("\n")
  );
}

function command(id) {
  const value = buildMechanicsCommandStarterPreset(id);
  assert.ok(value, `Missing command starter ${id}`);
  return value;
}

function domainActions(value) {
  return (value?.composition?.domainSteps || [])
    .map((step) => step?.action)
    .filter((action) => action?.enabled !== false && action?.type !== "NONE");
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test("Command starter contract starts at v1", () => {
  assert.equal(
    MECHANICS_COMMAND_STARTER_VERSION,
    "mechanics_command_starter_presets_v1"
  );
});

test("MC7B publishes five starter identities", () => {
  assert.deepEqual(MECHANICS_COMMAND_STARTER_IDS, [
    "RESOURCE_CHECK",
    "SOCIAL_PROBE",
    "GIVE_ITEM",
    "APPLY_CONDITION",
    "TRAVEL_CONNECTED",
  ]);
});

test("Starter definitions are stable and unique", () => {
  const definitions = listMechanicsCommandStarterPresets();
  assert.equal(definitions.length, 5);
  assert.equal(new Set(definitions.map((entry) => entry.id)).size, 5);
  assert.equal(new Set(definitions.map((entry) => entry.presetId)).size, 5);
});

test("Starter definition lookup accepts reference and preset IDs", () => {
  assert.equal(
    getMechanicsCommandStarterPresetDefinition("social_probe")?.presetId,
    "command.social_probe.v1"
  );
  assert.equal(
    getMechanicsCommandStarterPresetDefinition("COMMAND.SOCIAL_PROBE.V1")?.id,
    "SOCIAL_PROBE"
  );
});

test("Unknown starter definition returns null", () => {
  assert.equal(getMechanicsCommandStarterPresetDefinition("missing"), null);
});

test("Unknown starter build returns null", () => {
  assert.equal(buildMechanicsCommandStarterPreset("missing"), null);
});

test("Starter definition callers cannot mutate catalog truth", () => {
  const first = listMechanicsCommandStarterPresets();
  first[0].tags.push("mutated");
  const second = listMechanicsCommandStarterPresets();
  assert.equal(second[0].tags.includes("mutated"), false);
});

test("Starter command callers receive isolated copies", () => {
  const first = command("RESOURCE_CHECK");
  first.label = "Mutated";
  const second = command("RESOURCE_CHECK");
  assert.notEqual(second.label, "Mutated");
});

test("Every starter uses command contract v1", () => {
  MECHANICS_COMMAND_STARTER_IDS.forEach((id) => {
    assert.equal(
      command(id).commandContractVersion,
      "mechanics_command_contract_v1"
    );
  });
});

test("Every starter has a complete invocation", () => {
  MECHANICS_COMMAND_STARTER_IDS.forEach((id) => {
    const invocation = command(id).invocation;
    assert.equal(invocation.version, "mechanics_command_invocation_v1");
    assert.equal(invocation.enabled, true);
    assert.deepEqual(invocation.prefixes, ["/"]);
    assert.ok(invocation.command);
  });
});

test("Starter command IDs and invocations are unique", () => {
  const commands = MECHANICS_COMMAND_STARTER_IDS.map(command);
  assert.equal(new Set(commands.map((entry) => entry.id)).size, commands.length);
  assert.equal(
    new Set(commands.map((entry) => entry.invocation.command)).size,
    commands.length
  );
});

test("Every starter includes full command subsystems", () => {
  MECHANICS_COMMAND_STARTER_IDS.forEach((id) => {
    const value = command(id);
    assert.ok(value.resolution);
    assert.ok(value.outcomes);
    assert.ok(value.composition);
    assert.ok(value.domainAction);
    assert.ok(value.presentation);
    assert.ok(Array.isArray(value.requirements));
    assert.ok(Array.isArray(value.attemptEffects));
    assert.ok(Array.isArray(value.effects));
  });
});

test("Every starter passes complete Mechanics Module compliance", () => {
  MECHANICS_COMMAND_STARTER_IDS.forEach((id) => {
    assertCommandComplies(command(id));
  });
});

test("Every command starter preset payload passes compliance", () => {
  listMechanicsPresetCatalog({ category: "COMMAND_STARTER" }).forEach((preset) => {
    const built = buildMechanicsPresetPayload(preset.id);
    assert.equal(built.ok, true, built.error?.message);
    assertCommandComplies(built.payload.value);
  });
});

test("Combined catalog now contains twenty presets", () => {
  assert.equal(getMechanicsPresetCatalogManifest().presetCount, 20);
});

test("Combined catalog contains five command starters", () => {
  const summary = summarizeMechanicsPresetCatalog();
  assert.equal(summary.byCategory.COMMAND_STARTER, 5);
});

test("Command scope filter returns the five starters", () => {
  const presets = listMechanicsPresetCatalog({ scope: "COMMAND" });
  assert.equal(presets.length, 5);
  assert.ok(presets.every((preset) => preset.category === "COMMAND_STARTER"));
});

test("Manifest advertises the command starter contract", () => {
  assert.equal(
    getMechanicsPresetCatalogManifest().commandStarterVersion,
    MECHANICS_COMMAND_STARTER_VERSION
  );
});

test("Command starter catalog IDs use the command namespace", () => {
  listMechanicsPresetCatalog({ category: "COMMAND_STARTER" }).forEach((preset) => {
    assert.match(preset.id, /^command\.[a-z0-9._:-]+\.v1$/);
  });
});

test("Command starter definitions are READY from MC7B", () => {
  listMechanicsPresetCatalog({ category: "COMMAND_STARTER" }).forEach((preset) => {
    assert.equal(preset.implementation.status, "READY");
    assert.equal(preset.implementation.phase, "MC7B");
    assert.equal(preset.implementation.builder, "buildMechanicsCommandStarterPreset");
  });
});

test("Command starters declare replace-command boundaries", () => {
  listMechanicsPresetCatalog({ category: "COMMAND_STARTER" }).forEach((preset) => {
    assert.equal(preset.application.defaultMode, "REPLACE_COMMAND");
    assert.deepEqual(preset.application.allowedModes, ["REPLACE_COMMAND", "MERGE_COMMAND"]);
    assert.deepEqual(preset.application.replacementPaths, ["command"]);
  });
});

test("Command replacement preserves unrelated module content", () => {
  const preset = getMechanicsPresetDefinition("command.resource_check.v1");
  assert.ok(preset.application.preservedPaths.includes("module.instanceData.trackers"));
  assert.ok(preset.application.preservedPaths.includes("module.instanceData.commands[other]"));
  assert.ok(preset.application.preservedPaths.includes("module.instanceData.defaults"));
});

test("Command starters do not require pre-existing command arguments", () => {
  listMechanicsPresetCatalog({ category: "COMMAND_STARTER" }).forEach((preset) => {
    assert.deepEqual(preset.applicability.requiredArgumentTypes, []);
    assert.equal(preset.availability.available, true);
  });
});

test("Command starter payloads use REPLACE_COMMAND", () => {
  const built = buildMechanicsPresetPayload("command.social_probe.v1");
  assert.equal(built.ok, true);
  assert.equal(built.payload.scope, "COMMAND");
  assert.equal(built.payload.applyMode, "REPLACE_COMMAND");
  assert.deepEqual(built.payload.replacementPaths, ["command"]);
});

test("Command starter payloads contain complete command values", () => {
  const built = buildMechanicsPresetPayload("command.give_item.v1");
  assert.equal(built.payload.value.invocation.command, "give");
  assert.equal(built.payload.value.resolution.mode, "NO_ROLL_DETERMINISTIC");
  assert.equal(built.payload.value.composition.domainSteps.length, 1);
});

test("Built command payloads are isolated copies", () => {
  const first = buildMechanicsPresetPayload("command.give_item.v1");
  first.payload.value.invocation.command = "mutated";
  const second = buildMechanicsPresetPayload("command.give_item.v1");
  assert.equal(second.payload.value.invocation.command, "give");
});

test("Catalog search finds the resource starter", () => {
  const presets = listMechanicsPresetCatalog({ query: "resource check" });
  assert.equal(presets.length, 1);
  assert.equal(presets[0].id, "command.resource_check.v1");
});

test("Catalog search finds domain workflow starters", () => {
  const presets = listMechanicsPresetCatalog({ query: "connected Location" });
  assert.ok(presets.some((preset) => preset.id === "command.travel_connected.v1"));
});

test("All five command starters are available without target context", () => {
  const summary = summarizeMechanicsPresetCatalog({ category: "COMMAND_STARTER" });
  assert.equal(summary.available, 5);
  assert.equal(summary.unavailable, 0);
});

test("Resource Check requires an authoritative resource meter", () => {
  const value = command("RESOURCE_CHECK");
  assert.deepEqual(value.requirements[0], {
    id: "resource_available",
    type: "METER",
    targetId: "resource",
    argumentName: "",
    operator: "GTE",
    value: 5,
    message: "Resource must be at least 5.",
    enabled: true,
  });
});

test("Resource Check spends its cost before resolution", () => {
  const effect = command("RESOURCE_CHECK").attemptEffects[0];
  assert.equal(effect.type, "METER_DELTA");
  assert.equal(effect.targetId, "resource");
  assert.equal(effect.delta, -5);
});

test("Resource Check routes failure separately from success", () => {
  const outcomes = command("RESOURCE_CHECK").outcomes;
  assert.equal(outcomes.SUCCESS.effectMode, "INHERIT");
  assert.equal(outcomes.FAILURE.effectMode, "REPLACE");
  assert.equal(outcomes.FAILURE.effects[0].targetId, "resource_failures");
});

test("Social Probe uses a present Character argument", () => {
  const args = command("SOCIAL_PROBE").invocation.arguments;
  assert.deepEqual(args.map((entry) => entry.type), ["CHARACTER_PRESENT"]);
  assert.equal(args[0].name, "target");
});

test("Social Probe retains opposed resolution v6", () => {
  const resolution = command("SOCIAL_PROBE").resolution;
  assert.equal(resolution.version, MECHANICS_COMMAND_RESOLUTION_VERSION);
  assert.equal(resolution.mode, "OPPOSED_DIE");
});

test("Social Probe success writes target-scoped state", () => {
  const effect = command("SOCIAL_PROBE").effects[0];
  assert.equal(effect.targetId, "probe_hits");
  assert.equal(effect.targetBinding.mode, "ARGUMENT");
  assert.equal(effect.targetBinding.argumentName, "target");
});

test("Social Probe composes attempt and success counters", () => {
  const steps = command("SOCIAL_PROBE").composition.mechanicsSteps;
  assert.deepEqual(steps.map((step) => step.id), ["record_attempt", "record_success"]);
  assert.deepEqual(steps[1].applyOnOutcomes, ["CRITICAL_SUCCESS", "SUCCESS"]);
});

test("Give Item supplies held Item and present Character arguments", () => {
  const args = command("GIVE_ITEM").invocation.arguments;
  assert.deepEqual(args.map((entry) => entry.type), [
    "ITEM_HELD",
    "CHARACTER_PRESENT",
  ]);
});

test("Give Item uses one isolated Item domain action", () => {
  const actions = domainActions(command("GIVE_ITEM"));
  assert.equal(actions.length, 1);
  assert.equal(actions[0].type, "ITEM_GIVE");
  assert.equal(actions[0].itemArgumentName, "item");
  assert.equal(actions[0].targetArgumentName, "target");
});

test("Give Item uses deterministic automatic resolution", () => {
  assert.equal(command("GIVE_ITEM").resolution.mode, "NO_ROLL_DETERMINISTIC");
});

test("Apply Condition supplies target and remaining-text arguments", () => {
  const args = command("APPLY_CONDITION").invocation.arguments;
  assert.deepEqual(args.map((entry) => entry.type), ["CHARACTER_PRESENT", "TEXT"]);
  assert.equal(args[1].consumeRemaining, true);
});

test("Apply Condition spends focus as an attempt cost", () => {
  const value = command("APPLY_CONDITION");
  assert.equal(value.requirements[1].targetId, "focus");
  assert.equal(value.attemptEffects[0].targetId, "focus");
  assert.equal(value.attemptEffects[0].delta, -1);
});

test("Apply Condition uses one participant condition domain action", () => {
  const actions = domainActions(command("APPLY_CONDITION"));
  assert.equal(actions.length, 1);
  assert.equal(actions[0].type, "PARTICIPANT_CONDITION_APPLY");
  assert.equal(actions[0].targetArgumentName, "target");
  assert.equal(actions[0].conditionArgumentName, "condition");
});

test("Travel starter supplies a connected Location argument", () => {
  const args = command("TRAVEL_CONNECTED").invocation.arguments;
  assert.deepEqual(args.map((entry) => entry.type), ["LOCATION_CONNECTED"]);
  assert.equal(args[0].name, "destination");
});

test("Travel starter keeps Location as the final domain action", () => {
  const actions = domainActions(command("TRAVEL_CONNECTED"));
  assert.equal(actions.length, 1);
  assert.equal(actions.at(-1).type, "LOCATION_TRANSITION");
  assert.equal(actions.at(-1).destinationArgumentName, "destination");
});

test("No starter duplicates a runtime patch lane", () => {
  const laneByType = {
    ITEM_GIVE: "ITEM_RUNTIME",
    PARTICIPANT_CONDITION_APPLY: "SENSORY_RUNTIME",
    LOCATION_TRANSITION: "LOCATION_RUNTIME",
  };
  MECHANICS_COMMAND_STARTER_IDS.forEach((id) => {
    const lanes = domainActions(command(id))
      .map((action) => laneByType[action.type])
      .filter(Boolean);
    assert.equal(new Set(lanes).size, lanes.length);
  });
});

test("No starter places work after a Location action", () => {
  MECHANICS_COMMAND_STARTER_IDS.forEach((id) => {
    const actions = domainActions(command(id));
    const locationIndex = actions.findIndex((action) =>
      ["LOCATION_TRANSITION", "LOCATION_TRAVEL_OPERATION"].includes(action.type)
    );
    assert.ok(locationIndex < 0 || locationIndex === actions.length - 1);
  });
});

test("Legacy single domain actions remain disabled in every starter", () => {
  MECHANICS_COMMAND_STARTER_IDS.forEach((id) => {
    const legacy = command(id).domainAction;
    assert.equal(legacy.enabled, false);
    assert.equal(legacy.type, "NONE");
  });
});

test("Starter summaries are display-ready", () => {
  const summary = summarizeMechanicsCommandStarterPreset(command("SOCIAL_PROBE"));
  assert.equal(summary.commandLabel, "/probe");
  assert.equal(summary.argumentCount, 1);
  assert.equal(summary.resolutionMode, "OPPOSED_DIE");
});

test("MC7A block references remain present and unchanged in count", () => {
  assert.equal(listMechanicsPresetCatalog({ category: "RESOLUTION" }).length, 6);
  assert.equal(listMechanicsPresetCatalog({ category: "COMPOSITION" }).length, 4);
});

test("MC5 and MC6 contracts remain frozen", () => {
  const manifest = getMechanicsPresetCatalogManifest();
  assert.equal(manifest.resolutionVersion, "mechanics_command_resolution_v6");
  assert.equal(manifest.compositionVersion, "mechanics_command_composition_v1");
});

test("MC7B adds no UI API persistence or runtime execution coupling", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "mechanicsCommandStarterPresets.js"),
    "utf8"
  );
  assert.equal(/\bfetch\s*\(/.test(source), false);
  assert.equal(source.includes("useState"), false);
  assert.equal(source.includes("supabase"), false);
  assert.equal(source.includes("PostGraphile"), false);
  assert.equal(source.includes("services-api"), false);
});

test("Command starter catalog source is plain serializable configuration", () => {
  const serialized = JSON.stringify(
    listMechanicsPresetCatalog({ category: "COMMAND_STARTER" })
  );
  assert.ok(serialized.includes("command.social_probe.v1"));
  assert.equal(serialized.includes("function"), false);
});

console.log("Crestfall mc7_command_starter_preset_diagnostics_v1");
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
