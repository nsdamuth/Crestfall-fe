import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_PRESET_APPLICATION_CONFLICT_POLICY,
  MECHANICS_PRESET_APPLICATION_VERSION,
  applyMechanicsPresetToModuleData,
  listMechanicsPresetCommandTargets,
  previewMechanicsPresetApplication,
} from "./mechanicsPresetApplicationService.js";
import {
  getMechanicsPresetDefinition,
  listMechanicsPresetCatalog,
} from "./mechanicsPresetCatalog.js";
import {
  buildMechanicsModuleStarterPreset,
} from "./mechanicsModuleStarterPresets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const moduleRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(moduleRoot, "../../../../../..");

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function requiredModule(id) {
  const value = buildMechanicsModuleStarterPreset(id);
  assert.ok(value, `missing module starter ${id}`);
  return value;
}

function makeEmptyModule() {
  return {
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    priority: 65,
    tags: ["existing"],
    contractVersion: "trackers_instance_data.v0_2",
    instanceData: {
      contractVersion: "trackers_instance_data.v0_2",
      trackers: [],
      commands: [],
      guards: [],
      statusBlocks: [],
      defaults: { flags: [], counters: [], stages: [] },
    },
  };
}

check("Application contract starts at v1", () => {
  assert.equal(MECHANICS_PRESET_APPLICATION_VERSION, "mechanics_preset_application_v1");
});

check("Conflict policy rejects atomically", () => {
  assert.equal(MECHANICS_PRESET_APPLICATION_CONFLICT_POLICY, "REJECT_ATOMICALLY");
});

check("Catalog exposes command merge mode", () => {
  const preset = getMechanicsPresetDefinition("command.social_probe.v1");
  assert.deepEqual(preset.application.allowedModes, ["REPLACE_COMMAND", "MERGE_COMMAND"]);
});

check("Catalog exposes module merge mode", () => {
  const preset = getMechanicsPresetDefinition("module.social_probe.v1");
  assert.deepEqual(preset.application.allowedModes, ["REPLACE_MODULE", "MERGE_MODULE"]);
});

check("Block presets remain replace-only", () => {
  const preset = getMechanicsPresetDefinition("resolution.standard_d20.v1");
  assert.deepEqual(preset.application.allowedModes, ["REPLACE_BLOCK"]);
});

check("Command targets expose invocation and arguments", () => {
  const targets = listMechanicsPresetCommandTargets(requiredModule("SOCIAL_PROBE"));
  assert.equal(targets.length, 1);
  assert.equal(targets[0].invocationLabel, "/probe");
  assert.equal(targets[0].argumentOptions[0].type, "CHARACTER_PRESENT");
});

check("Resolution replacement changes only selected resolution", () => {
  const moduleData = requiredModule("SOCIAL_PROBE");
  const before = clone(moduleData.instanceData.commands[0]);
  const result = applyMechanicsPresetToModuleData({
    moduleData,
    presetId: "resolution.automatic_success.v1",
    commandIndex: 0,
  });
  assert.equal(result.ok, true);
  const after = result.data.instanceData.commands[0];
  assert.equal(after.resolution.mode, "NO_ROLL_DETERMINISTIC");
  assert.deepEqual(after.composition, before.composition);
  assert.deepEqual(after.invocation, before.invocation);
});

check("Composition replacement changes only selected composition", () => {
  const moduleData = requiredModule("SOCIAL_PROBE");
  const before = clone(moduleData.instanceData.commands[0]);
  const result = applyMechanicsPresetToModuleData({
    moduleData,
    presetId: "composition.sequential_attempt_success.v1",
    commandIndex: 0,
  });
  assert.equal(result.ok, true);
  const after = result.data.instanceData.commands[0];
  assert.equal(after.composition.mechanicsSteps.length, 2);
  assert.deepEqual(after.resolution, before.resolution);
  assert.deepEqual(after.invocation, before.invocation);
});

check("Command target is required for block preset", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: requiredModule("SOCIAL_PROBE"),
    presetId: "resolution.standard_d20.v1",
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_COMMAND_TARGET_REQUIRED");
});

check("Argument-dependent composition rejects incompatible target", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: requiredModule("RESOURCE_LOOP"),
    presetId: "composition.item_and_condition.v1",
    commandIndex: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_NOT_APPLICABLE");
});

check("Argument-dependent composition applies to compatible target", () => {
  const moduleData = makeEmptyModule();
  moduleData.instanceData.commands.push({
    id: "handoff",
    label: "Handoff",
    commandContractVersion: "mechanics_command_contract_v1",
    invocation: {
      version: "mechanics_command_invocation_v1",
      enabled: true,
      command: "handoff",
      prefixes: ["/"],
      aliases: [],
      arguments: [
        { name: "item", label: "Item", type: "ITEM_HELD", required: true },
        { name: "target", label: "Target", type: "CHARACTER_PRESENT", required: true },
        { name: "condition", label: "Condition", type: "TEXT", required: true, consumeRemaining: true },
      ],
      caseSensitive: false,
    },
    requirements: [],
    attemptEffects: [],
    resolution: { mode: "NO_ROLL_DETERMINISTIC" },
    outcomes: {},
    domainAction: { enabled: false, type: "NONE" },
    presentation: { mode: "MECHANICS_ACTION", continueNarrative: true, advanceTime: true, resultVisibility: "FULL" },
    triggers: [],
    effects: [],
  });
  const result = applyMechanicsPresetToModuleData({
    moduleData,
    presetId: "composition.item_and_condition.v1",
    commandIndex: 0,
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.instanceData.commands[0].composition.domainSteps.length, 2);
});

check("Replace command installs complete starter", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: requiredModule("RESOURCE_LOOP"),
    presetId: "command.give_item.v1",
    applyMode: "REPLACE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(result.ok, true);
  const command = result.data.instanceData.commands[0];
  assert.equal(command.id, "give_item");
  assert.equal(command.invocation.command, "give");
  assert.equal(command.composition.domainSteps[0].action.type, "ITEM_GIVE");
});

check("Replace command rejects duplicate command id", () => {
  const moduleData = requiredModule("RESOURCE_LOOP");
  moduleData.instanceData.commands.push({
    ...clone(moduleData.instanceData.commands[0]),
    id: "give_item",
    invocation: { ...clone(moduleData.instanceData.commands[0].invocation), command: "other" },
  });
  const snapshot = JSON.stringify(moduleData);
  const result = applyMechanicsPresetToModuleData({
    moduleData,
    presetId: "command.give_item.v1",
    applyMode: "REPLACE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_COMMAND_ID_CONFLICT");
  assert.equal(JSON.stringify(moduleData), snapshot);
});

check("Replace command rejects duplicate invocation", () => {
  const moduleData = requiredModule("RESOURCE_LOOP");
  moduleData.instanceData.commands.push({
    ...clone(moduleData.instanceData.commands[0]),
    id: "other",
    invocation: { ...clone(moduleData.instanceData.commands[0].invocation), command: "give" },
  });
  const result = applyMechanicsPresetToModuleData({
    moduleData,
    presetId: "command.give_item.v1",
    applyMode: "REPLACE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_COMMAND_INVOCATION_CONFLICT");
});

check("Merge command preserves selected identity", () => {
  const moduleData = requiredModule("RESOURCE_LOOP");
  const current = moduleData.instanceData.commands[0];
  current.id = "custom_focus";
  current.label = "Custom Focus";
  current.invocation.command = "my_focus";
  current.invocation.aliases = ["old_alias"];
  current.presentation.resultVisibility = "OUTCOME_ONLY";
  const result = applyMechanicsPresetToModuleData({
    moduleData,
    presetId: "command.social_probe.v1",
    applyMode: "MERGE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(result.ok, true);
  const merged = result.data.instanceData.commands[0];
  assert.equal(merged.id, "custom_focus");
  assert.equal(merged.label, "Custom Focus");
  assert.equal(merged.invocation.command, "my_focus");
  assert.ok(merged.invocation.aliases.includes("old_alias"));
  assert.ok(merged.invocation.aliases.includes("read"));
  assert.equal(merged.invocation.arguments[0].type, "CHARACTER_PRESENT");
  assert.equal(merged.resolution.mode, "OPPOSED_DIE");
  assert.equal(merged.presentation.resultVisibility, "OUTCOME_ONLY");
});

check("Merge command rejects new alias collision", () => {
  const moduleData = requiredModule("RESOURCE_LOOP");
  moduleData.instanceData.commands.push({
    ...clone(moduleData.instanceData.commands[0]),
    id: "inspect_command",
    invocation: { ...clone(moduleData.instanceData.commands[0].invocation), command: "read", aliases: [] },
  });
  const result = applyMechanicsPresetToModuleData({
    moduleData,
    presetId: "command.social_probe.v1",
    applyMode: "MERGE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_COMMAND_INVOCATION_CONFLICT");
});

check("Replace module replaces authored data", () => {
  const current = requiredModule("RESOURCE_LOOP");
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.quest_progress.v1",
    applyMode: "REPLACE_MODULE",
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.instanceData.commands[0].id, "quest_progress");
  assert.equal(result.data.instanceData.trackers[0].id, "quest_momentum");
  assert.equal(result.data.tags.includes("quest"), true);
});

check("Merge module appends nonconflicting authored data", () => {
  const current = makeEmptyModule();
  current.tags = ["existing"];
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.social_probe.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.instanceData.commands.length, 1);
  assert.equal(result.data.instanceData.trackers.length, 1);
  assert.ok(result.data.tags.includes("existing"));
  assert.ok(result.data.tags.includes("social"));
});

check("Merge module preserves current priority", () => {
  const current = makeEmptyModule();
  current.priority = 91;
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.social_probe.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.priority, 91);
});

check("Merge module rejects tracker conflict", () => {
  const current = requiredModule("SOCIAL_PROBE");
  const snapshot = JSON.stringify(current);
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.social_probe.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_MODULE_ID_CONFLICT");
  assert.equal(JSON.stringify(current), snapshot);
});

check("Merge module rejects default conflict", () => {
  const current = makeEmptyModule();
  current.instanceData.defaults.counters.push({ id: "attempt_count", label: "Attempts", initial: 0 });
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.resource_loop.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "MECHANICS_PRESET_MODULE_DEFAULT_CONFLICT"), true);
});

check("Merge module rejects invocation conflict", () => {
  const current = makeEmptyModule();
  current.instanceData.commands.push(clone(requiredModule("RESOURCE_LOOP").instanceData.commands[0]));
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.resource_loop.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "MECHANICS_PRESET_MODULE_INVOCATION_CONFLICT"), true);
});

check("Merge module rejects incompatible module definition", () => {
  const current = makeEmptyModule();
  current.moduleDefinitionId = "other.module.v1";
  current.moduleId = "other.module.v1";
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.social_probe.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "MECHANICS_PRESET_MODULE_DEFINITION_CONFLICT"), true);
});

check("Disallowed mode rejects before mutation", () => {
  const current = requiredModule("SOCIAL_PROBE");
  const snapshot = JSON.stringify(current);
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "resolution.standard_d20.v1",
    applyMode: "MERGE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_APPLY_MODE_NOT_ALLOWED");
  assert.equal(JSON.stringify(current), snapshot);
});

check("Unknown preset rejects", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: makeEmptyModule(),
    presetId: "missing.preset.v1",
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "MECHANICS_PRESET_NOT_FOUND");
});

check("Invalid current module rejects final compliance", () => {
  const current = requiredModule("SOCIAL_PROBE");
  current.instanceData.commands.push(clone(current.instanceData.commands[0]));
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "resolution.standard_d20.v1",
    commandIndex: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "MECHANICS_PRESET_COMPLIANCE_REJECTED"), true);
});

check("Application returns canonical contracts", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: makeEmptyModule(),
    presetId: "module.quest_progress.v1",
    applyMode: "REPLACE_MODULE",
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.contractVersion, "trackers_instance_data.v0_2");
  assert.equal(result.data.instanceData.contractVersion, "trackers_instance_data.v0_2");
  assert.equal(result.data.instanceData.commands[0].resolution.version, "mechanics_command_resolution_v6");
  assert.equal(result.data.instanceData.commands[0].composition.version, "mechanics_command_composition_v1");
});

check("Application audit retains boundary evidence", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: requiredModule("SOCIAL_PROBE"),
    presetId: "resolution.standard_d20.v1",
    commandIndex: 0,
  });
  assert.equal(result.ok, true);
  assert.equal(result.audit.presetId, "resolution.standard_d20.v1");
  assert.equal(result.audit.applyMode, "REPLACE_BLOCK");
  assert.deepEqual(result.audit.changedPaths, ["command.resolution"]);
  assert.equal(result.audit.commandIndex, 0);
});

check("Preview reports destructive command replacement", () => {
  const preview = previewMechanicsPresetApplication({
    moduleData: requiredModule("RESOURCE_LOOP"),
    presetId: "command.social_probe.v1",
    applyMode: "REPLACE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(preview.valid, true);
  assert.equal(preview.destructive, true);
});

check("Preview reports non-destructive module merge", () => {
  const preview = previewMechanicsPresetApplication({
    moduleData: makeEmptyModule(),
    presetId: "module.social_probe.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(preview.valid, true);
  assert.equal(preview.destructive, false);
  assert.equal(preview.currentCounts.commandCount, 0);
  assert.equal(preview.nextCounts.commandCount, 1);
});

check("Preview exposes atomic merge conflicts", () => {
  const preview = previewMechanicsPresetApplication({
    moduleData: requiredModule("SOCIAL_PROBE"),
    presetId: "module.social_probe.v1",
    applyMode: "MERGE_MODULE",
  });
  assert.equal(preview.valid, false);
  assert.ok(preview.errors.length > 0);
  assert.equal(preview.nextCounts, null);
});

check("Command starter application warns about undeclared state", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: requiredModule("TRAVEL_NAVIGATION"),
    presetId: "command.resource_check.v1",
    applyMode: "REPLACE_COMMAND",
    commandIndex: 0,
  });
  assert.equal(result.ok, true);
  assert.equal(result.warnings.some((warning) => warning.code === "MECHANICS_PRESET_UNDECLARED_STATE_REFERENCE"), true);
});

check("Catalog remains filterable after merge activation", () => {
  const modules = listMechanicsPresetCatalog({ scopes: ["MODULE"] });
  assert.equal(modules.length, 5);
  assert.equal(modules.every((entry) => entry.application.allowedModes.includes("MERGE_MODULE")), true);
});

check("Application service does not mutate original data", () => {
  const current = requiredModule("RESOURCE_LOOP");
  const snapshot = JSON.stringify(current);
  const result = applyMechanicsPresetToModuleData({
    moduleData: current,
    presetId: "module.quest_progress.v1",
    applyMode: "REPLACE_MODULE",
  });
  assert.equal(result.ok, true);
  assert.equal(JSON.stringify(current), snapshot);
});

check("Mechanics editor imports preset orchestration LOOM shell", () => {
  const assemblyShell = fs.readFileSync(
    path.join(
      moduleRoot,
      "mechanics-module-assembly/MechanicsModuleAssembly.jsx"
    ),
    "utf8"
  );
  const view = fs.readFileSync(
    path.join(
      moduleRoot,
      "mechanics-document-orchestration/MechanicsDocumentOrchestration.view.jsx"
    ),
    "utf8"
  );
  assert.match(assemblyShell, /MechanicsDocumentOrchestrationControls/);
  assert.match(assemblyShell, /MechanicsDocumentOrchestrationSurfaces/);
  assert.match(view, /Preset Library/);
});

check("Mechanics editor applies presets through the guarded atomic replacement helper", () => {
  const text = fs.readFileSync(path.join(moduleRoot, "MechanicsModuleFieldsSection.jsx"), "utf8");
  const orchestration = fs.readFileSync(
    path.join(
      moduleRoot,
      "mechanics-document-orchestration/useMechanicsDocumentOrchestrationViewModel.js"
    ),
    "utf8"
  );
  assert.match(text, /function replaceMechanicsData\(nextData\)/);
  assert.match(text, /onReplaceMechanicsData=\{replaceMechanicsData\}/);
  const shell = fs.readFileSync(
    path.join(
      moduleRoot,
      "mechanics-document-orchestration/MechanicsDocumentOrchestration.jsx"
    ),
    "utf8"
  );
  assert.match(orchestration, /function applyPreset\(nextData/);
  assert.match(orchestration, /applyMechanicsDocumentReplacement/);
  assert.match(shell, /presetLibraryOpen && canReplaceData/);
});

check("Preset Shell remains minimal", () => {
  const text = fs.readFileSync(path.join(moduleRoot, "mechanics-preset-application/MechanicsPresetApplicationModal.jsx"), "utf8");
  assert.match(text, /useMechanicsPresetApplicationViewModel/);
  assert.match(text, /<MechanicsPresetApplicationModalView \{\.\.\.viewProps\} \/>/);
  assert.doesNotMatch(text, /fetch\(|supabase|PostGraphile/i);
});

check("Preset View remains API-free", () => {
  const text = fs.readFileSync(path.join(moduleRoot, "mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx"), "utf8");
  assert.doesNotMatch(text, /fetch\(|\/lib\/client|supabase|PostGraphile|services-api/i);
  assert.match(text, /PresetLibraryModalFrame/);
  assert.match(text, /role="dialog"/);
  assert.match(text, /Apply Preset/);
});

check("Preset ViewModel owns application orchestration", () => {
  const text = fs.readFileSync(path.join(moduleRoot, "mechanics-preset-application/useMechanicsPresetApplicationViewModel.js"), "utf8");
  assert.match(text, /applyMechanicsPresetToModuleData/);
  assert.match(text, /previewMechanicsPresetApplication/);
  assert.doesNotMatch(text, /className=|<div|<section/);
});

check("Preset contract is versioned", () => {
  const text = fs.readFileSync(path.join(moduleRoot, "mechanics-preset-application/MechanicsPresetApplicationModal.contract.js"), "utf8");
  assert.match(text, /1\.1\.0/);
  assert.match(text, /onApplyPreset/);
});

check("Preset fixtures cover selected conflict and empty states", () => {
  const text = fs.readFileSync(path.join(moduleRoot, "mechanics-preset-application/mechanicsPresetApplication.fixtures.js"), "utf8");
  assert.match(text, /SelectedFixture/);
  assert.match(text, /ConflictFixture/);
  assert.match(text, /EmptyFixture/);
});

check("Development preview is production gated", () => {
  const page = fs.readFileSync(path.join(repoRoot, "app/dev/ui-preview/mechanics-preset-application/page.jsx"), "utf8");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

check("No production API or database files are part of MC7D UI", () => {
  const report = fs.readFileSync(path.join(__dirname, "MC7D_SAFE_PRESET_APPLICATION.md"), "utf8");
  assert.match(report, /No services-api, database, PostGraphile, or engine-middleware production files are changed/);
});

check("MC6 resolution remains frozen at v6", () => {
  const result = applyMechanicsPresetToModuleData({
    moduleData: requiredModule("SOCIAL_PROBE"),
    presetId: "resolution.standard_d20.v1",
    commandIndex: 0,
  });
  assert.equal(result.data.instanceData.commands[0].resolution.version, "mechanics_command_resolution_v6");
});

console.log("Crestfall mc7_preset_application_diagnostics_v1");
console.log(`Node ${process.version}\n`);

let passed = 0;
for (let index = 0; index < checks.length; index += 1) {
  const current = checks[index];
  const started = Date.now();
  try {
    await current.fn();
    passed += 1;
    console.log(`PASS ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - started} ms)`);
  } catch (error) {
    console.error(`FAIL ${String(index + 1).padStart(2, "0")} ${current.name}`);
    console.error(error?.stack || error);
  }
}

const failed = checks.length - passed;
console.log(`\nSummary: ${passed} passed, ${failed} failed, ${checks.length} total`);
if (failed) process.exitCode = 1;
