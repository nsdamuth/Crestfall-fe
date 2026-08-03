import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_PRESET_FREEZE_MANIFEST_VERSION,
  MECHANICS_PRESET_FREEZE_PHASE,
  MECHANICS_PRESET_FREEZE_STATUS,
  MECHANICS_PRESET_FROZEN_CONTRACTS,
  MECHANICS_PRESET_FROZEN_COUNTS,
  MECHANICS_PRESET_FROZEN_APPLY_MODES,
  MECHANICS_PRESET_FROZEN_IDS,
  MECHANICS_PRESET_FROZEN_RUNTIME_IDS,
  getMechanicsPresetFreezeManifest,
} from "./mechanicsPresetFreezeManifest.js";
import {
  MECHANICS_PRESET_CATALOG_VERSION,
  MECHANICS_PRESET_DEFINITION_VERSION,
  MECHANICS_PRESET_PAYLOAD_VERSION,
  MECHANICS_PRESET_APPLY_MODES,
} from "./MechanicsPresetCatalog.contract.js";
import {
  getMechanicsPresetCatalogManifest,
  listMechanicsPresetCatalog,
  getMechanicsPresetDefinition,
  buildMechanicsPresetPayload,
  summarizeMechanicsPresetCatalog,
} from "./mechanicsPresetCatalog.js";
import {
  MECHANICS_COMMAND_STARTER_VERSION,
  MECHANICS_COMMAND_STARTER_IDS,
  listMechanicsCommandStarterPresets,
  buildMechanicsCommandStarterPreset,
} from "./mechanicsCommandStarterPresets.js";
import {
  MECHANICS_MODULE_STARTER_VERSION,
  MECHANICS_MODULE_STARTER_IDS,
  listMechanicsModuleStarterPresets,
  buildMechanicsModuleStarterPreset,
} from "./mechanicsModuleStarterPresets.js";
import {
  MECHANICS_PRESET_APPLICATION_VERSION,
  MECHANICS_PRESET_APPLICATION_CONFLICT_POLICY,
  applyMechanicsPresetToModuleData,
  previewMechanicsPresetApplication,
} from "./mechanicsPresetApplicationService.js";
import {
  MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION,
  MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS,
  listMechanicsReferenceRuntimeImplementations,
  getMechanicsReferenceRuntimeImplementationForModuleStarter,
  buildMechanicsReferenceRuntimeScenario,
} from "./mechanicsReferenceRuntimeImplementations.js";
import {
  MECHANICS_PRESET_LIVE_VALIDATION_VERSION,
  buildMechanicsPresetLiveValidationGuide,
} from "./mechanicsPresetLiveValidation.js";
import {
  validateMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";
import {
  MECHANICS_COMMAND_RESOLUTION_VERSION,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_COMMAND_COMPOSITION_VERSION,
} from "../mechanicsCommandCompositionBuilder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mechanicsRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(__dirname, "../../../../../../..");

function readMechanics(relativePath) {
  return fs.readFileSync(path.join(mechanicsRoot, relativePath), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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

function requiredModule(id) {
  const moduleData = buildMechanicsModuleStarterPreset(id);
  assert.ok(moduleData, `Missing module starter ${id}`);
  return moduleData;
}

function requiredCommand(id) {
  const command = buildMechanicsCommandStarterPreset(id);
  assert.ok(command, `Missing command starter ${id}`);
  return command;
}

function collectCommandTokens(command = {}) {
  const invocation = command.invocation || {};
  return [invocation.command, ...(Array.isArray(invocation.aliases) ? invocation.aliases : [])]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
}

function collectIds(items = []) {
  return items.map((entry) => String(entry?.id || "").trim()).filter(Boolean);
}

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

const catalog = listMechanicsPresetCatalog();
const catalogManifest = getMechanicsPresetCatalogManifest();
const catalogSummary = summarizeMechanicsPresetCatalog();
const commandStarters = listMechanicsCommandStarterPresets();
const moduleStarters = listMechanicsModuleStarterPresets();
const runtimeImplementations = listMechanicsReferenceRuntimeImplementations();

check("Freeze manifest contract starts at v1", () => {
  assert.equal(MECHANICS_PRESET_FREEZE_MANIFEST_VERSION, "mechanics_preset_freeze_manifest_v1");
});
check("Freeze phase and status are MC7G and FROZEN", () => {
  assert.equal(MECHANICS_PRESET_FREEZE_PHASE, "MC7G");
  assert.equal(MECHANICS_PRESET_FREEZE_STATUS, "FROZEN");
});
check("Frozen contract versions match production contracts", () => {
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.catalog, MECHANICS_PRESET_CATALOG_VERSION);
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.definition, MECHANICS_PRESET_DEFINITION_VERSION);
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.payload, MECHANICS_PRESET_PAYLOAD_VERSION);
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.application, MECHANICS_PRESET_APPLICATION_VERSION);
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.liveValidation, MECHANICS_PRESET_LIVE_VALIDATION_VERSION);
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.referenceRuntime, MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION);
});
check("Frozen MC5 and MC6 contract versions remain v6 and v1", () => {
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.resolution, "mechanics_command_resolution_v6");
  assert.equal(MECHANICS_PRESET_FROZEN_CONTRACTS.composition, "mechanics_command_composition_v1");
  assert.equal(MECHANICS_COMMAND_RESOLUTION_VERSION, MECHANICS_PRESET_FROZEN_CONTRACTS.resolution);
  assert.equal(MECHANICS_COMMAND_COMPOSITION_VERSION, MECHANICS_PRESET_FROZEN_CONTRACTS.composition);
});
check("Frozen preset counts total twenty", () => {
  assert.deepEqual(MECHANICS_PRESET_FROZEN_COUNTS, {
    total: 20,
    resolution: 6,
    composition: 4,
    command: 5,
    module: 5,
    referenceRuntime: 5,
  });
});
check("Frozen apply modes match the contract", () => {
  assert.deepEqual([...MECHANICS_PRESET_FROZEN_APPLY_MODES], [...MECHANICS_PRESET_APPLY_MODES]);
});
check("Frozen preset ids are unique", () => {
  assert.equal(new Set(MECHANICS_PRESET_FROZEN_IDS).size, 20);
});
check("Frozen runtime ids are unique", () => {
  assert.equal(new Set(MECHANICS_PRESET_FROZEN_RUNTIME_IDS).size, 5);
});
check("Freeze arrays and objects are immutable", () => {
  assert.equal(Object.isFrozen(MECHANICS_PRESET_FROZEN_IDS), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_FROZEN_RUNTIME_IDS), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_FROZEN_APPLY_MODES), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_FROZEN_CONTRACTS), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_FROZEN_COUNTS), true);
});
check("Freeze manifest returns isolated clones", () => {
  const first = getMechanicsPresetFreezeManifest();
  first.presetIds[0] = "mutated";
  const second = getMechanicsPresetFreezeManifest();
  assert.equal(second.presetIds[0], MECHANICS_PRESET_FROZEN_IDS[0]);
});

check("Catalog contract remains v1", () => {
  assert.equal(catalogManifest.version, "mechanics_preset_catalog_v1");
});
check("Catalog contains exactly twenty presets", () => {
  assert.equal(catalog.length, 20);
  assert.equal(catalogManifest.presetCount, 20);
});
check("Catalog scope counts remain frozen", () => {
  assert.deepEqual(catalogSummary.byScope, {
    COMMAND_RESOLUTION: 6,
    COMMAND_COMPOSITION: 4,
    COMMAND: 5,
    MODULE: 5,
  });
});
check("Catalog category counts remain frozen", () => {
  assert.deepEqual(catalogSummary.byCategory, {
    RESOLUTION: 6,
    COMPOSITION: 4,
    COMMAND_STARTER: 5,
    MODULE_STARTER: 5,
  });
});
check("Catalog ids exactly match the freeze manifest", () => {
  assert.deepEqual(catalog.map((entry) => entry.id), [...MECHANICS_PRESET_FROZEN_IDS]);
});
check("Every preset definition remains revision one", () => {
  assert.ok(catalog.every((entry) => entry.revision === 1));
});
check("Every preset implementation remains READY", () => {
  assert.ok(catalog.every((entry) => entry.implementation.status === "READY"));
});
check("Every preset remains scoped to Mechanics Module creations", () => {
  assert.ok(catalog.every((entry) => entry.applicability.creationTypes.includes("MECHANICS_MODULE")));
});
check("Resolution presets replace only command resolution", () => {
  const entries = catalog.filter((entry) => entry.scope === "COMMAND_RESOLUTION");
  assert.ok(entries.every((entry) => entry.application.defaultMode === "REPLACE_BLOCK"));
  assert.ok(entries.every((entry) => entry.application.replacementPaths.join("|") === "command.resolution"));
});
check("Composition presets replace only command composition", () => {
  const entries = catalog.filter((entry) => entry.scope === "COMMAND_COMPOSITION");
  assert.ok(entries.every((entry) => entry.application.defaultMode === "REPLACE_BLOCK"));
  assert.ok(entries.every((entry) => entry.application.replacementPaths.join("|") === "command.composition"));
});
check("Command presets retain replace and merge modes", () => {
  const entries = catalog.filter((entry) => entry.scope === "COMMAND");
  assert.ok(entries.every((entry) => JSON.stringify(entry.application.allowedModes) === JSON.stringify(["REPLACE_COMMAND", "MERGE_COMMAND"])));
});
check("Module presets retain replace and merge modes", () => {
  const entries = catalog.filter((entry) => entry.scope === "MODULE");
  assert.ok(entries.every((entry) => JSON.stringify(entry.application.allowedModes) === JSON.stringify(["REPLACE_MODULE", "MERGE_MODULE"])));
});
check("Every frozen preset builds a payload", () => {
  const argumentOptions = [
    { name: "item", type: "ITEM_HELD" },
    { name: "target", type: "CHARACTER_PRESENT" },
    { name: "condition", type: "TEXT" },
    { name: "destination", type: "LOCATION_CONNECTED" },
  ];
  for (const id of MECHANICS_PRESET_FROZEN_IDS) {
    const result = buildMechanicsPresetPayload(id, { argumentOptions });
    assert.equal(result.ok, true, id);
    assert.equal(result.definition.id, id);
  }
});
check("Preset payloads are isolated clones", () => {
  const first = buildMechanicsPresetPayload("module.social_probe.v1");
  first.payload.value.tags.push("mutated");
  const second = buildMechanicsPresetPayload("module.social_probe.v1");
  assert.equal(second.payload.value.tags.includes("mutated"), false);
});
check("Unknown preset lookups fail safely", () => {
  assert.equal(getMechanicsPresetDefinition("missing.preset.v1"), null);
  assert.equal(buildMechanicsPresetPayload("missing.preset.v1").ok, false);
});
check("Default catalog availability remains eighteen available and two contextual", () => {
  assert.equal(catalogSummary.available, 18);
  assert.equal(catalogSummary.unavailable, 2);
});

check("Command starter contract and ids remain frozen", () => {
  assert.equal(MECHANICS_COMMAND_STARTER_VERSION, "mechanics_command_starter_presets_v1");
  assert.deepEqual([...MECHANICS_COMMAND_STARTER_IDS], ["RESOURCE_CHECK", "SOCIAL_PROBE", "GIVE_ITEM", "APPLY_CONDITION", "TRAVEL_CONNECTED"]);
});
check("Module starter contract and ids remain frozen", () => {
  assert.equal(MECHANICS_MODULE_STARTER_VERSION, "mechanics_module_starter_presets_v1");
  assert.deepEqual([...MECHANICS_MODULE_STARTER_IDS], ["RESOURCE_LOOP", "SOCIAL_PROBE", "ITEM_HANDOFF", "TRAVEL_NAVIGATION", "QUEST_PROGRESS"]);
});
check("Command starter builders return isolated clones", () => {
  const first = requiredCommand("SOCIAL_PROBE");
  first.label = "mutated";
  assert.notEqual(requiredCommand("SOCIAL_PROBE").label, "mutated");
});
check("Module starter builders return isolated clones", () => {
  const first = requiredModule("SOCIAL_PROBE");
  first.tags.push("mutated");
  assert.equal(requiredModule("SOCIAL_PROBE").tags.includes("mutated"), false);
});
check("Every command starter uses frozen resolution and composition contracts", () => {
  for (const starter of commandStarters) {
    const command = requiredCommand(starter.id);
    assert.equal(command.resolution.version, "mechanics_command_resolution_v6");
    assert.equal(command.composition.version, "mechanics_command_composition_v1");
  }
});
check("Every complete module starter passes JSON compliance", () => {
  for (const starter of moduleStarters) {
    const result = validateMechanicsModuleData(requiredModule(starter.id));
    assert.equal(result.valid, true, `${starter.id}: ${JSON.stringify(result.errors)}`);
  }
});
check("Every module starter retains core tracker identity", () => {
  for (const starter of moduleStarters) {
    const moduleData = requiredModule(starter.id);
    assert.equal(moduleData.moduleDefinitionId, "core.trackers.v1");
    assert.equal(moduleData.moduleId, "core.trackers.v1");
    assert.equal(moduleData.contractVersion, "trackers_instance_data.v0_2");
  }
});
check("Every module starter contains at least one runnable command", () => {
  for (const starter of moduleStarters) {
    const commands = requiredModule(starter.id).instanceData.commands;
    assert.ok(commands.length >= 1);
    assert.ok(commands.every((command) => command.invocation.command));
  }
});
check("Every module starter has unique authored ids per collection", () => {
  for (const starter of moduleStarters) {
    const data = requiredModule(starter.id).instanceData;
    for (const items of [data.trackers, data.commands, data.guards, data.statusBlocks]) {
      const ids = collectIds(items);
      assert.equal(new Set(ids).size, ids.length, starter.id);
    }
  }
});
check("Every module starter has collision-free invocation tokens", () => {
  for (const starter of moduleStarters) {
    const tokens = requiredModule(starter.id).instanceData.commands.flatMap(collectCommandTokens);
    assert.equal(new Set(tokens).size, tokens.length, starter.id);
  }
});
check("Item Handoff remains isolated to ITEM_RUNTIME", () => {
  const command = requiredModule("ITEM_HANDOFF").instanceData.commands[0];
  assert.equal(command.composition.domainSteps.length, 1);
  assert.equal(command.composition.domainSteps[0].action.type, "ITEM_GIVE");
});
check("Travel Navigation keeps Location as the final action", () => {
  const steps = requiredModule("TRAVEL_NAVIGATION").instanceData.commands[0].composition.domainSteps;
  assert.equal(steps.at(-1).action.type, "LOCATION_TRANSITION");
});
check("Social Probe retains target-scoped success state", () => {
  const command = requiredModule("SOCIAL_PROBE").instanceData.commands[0];
  const effects = [
    ...command.effects,
    ...command.outcomes.CRITICAL_SUCCESS.effects,
    ...command.outcomes.SUCCESS.effects,
  ];
  assert.ok(effects.some((effect) => effect.targetBinding.mode === "ARGUMENT" && effect.targetBinding.argumentName === "target"));
});
check("Quest Progress retains pending-state conditions and dependencies", () => {
  const steps = requiredModule("QUEST_PROGRESS").instanceData.commands[0].composition.mechanicsSteps;
  assert.ok(steps.some((step) => Array.isArray(step.dependsOnStepIds) && step.dependsOnStepIds.length));
  assert.ok(steps.some((step) => Array.isArray(step.conditions) && step.conditions.length));
});

check("Application contract and conflict policy remain frozen", () => {
  assert.equal(MECHANICS_PRESET_APPLICATION_VERSION, "mechanics_preset_application_v1");
  assert.equal(MECHANICS_PRESET_APPLICATION_CONFLICT_POLICY, "REJECT_ATOMICALLY");
});
check("Resolution replacement preserves composition", () => {
  const moduleData = requiredModule("SOCIAL_PROBE");
  const before = clone(moduleData.instanceData.commands[0]);
  const result = applyMechanicsPresetToModuleData({ moduleData, presetId: "resolution.automatic_success.v1", commandIndex: 0 });
  assert.equal(result.ok, true);
  assert.deepEqual(result.data.instanceData.commands[0].composition, before.composition);
});
check("Composition replacement preserves resolution", () => {
  const moduleData = requiredModule("SOCIAL_PROBE");
  const before = clone(moduleData.instanceData.commands[0]);
  const result = applyMechanicsPresetToModuleData({ moduleData, presetId: "composition.sequential_attempt_success.v1", commandIndex: 0 });
  assert.equal(result.ok, true);
  assert.deepEqual(result.data.instanceData.commands[0].resolution, before.resolution);
});
check("Replace command installs a complete starter", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: requiredModule("RESOURCE_LOOP"), presetId: "command.give_item.v1", applyMode: "REPLACE_COMMAND", commandIndex: 0 });
  assert.equal(result.ok, true);
  assert.equal(result.data.instanceData.commands[0].composition.domainSteps[0].action.type, "ITEM_GIVE");
});
check("Merge command preserves authored identity", () => {
  const moduleData = requiredModule("RESOURCE_LOOP");
  const command = moduleData.instanceData.commands[0];
  command.id = "custom_focus";
  command.label = "Custom Focus";
  command.invocation.command = "my_focus";
  const result = applyMechanicsPresetToModuleData({ moduleData, presetId: "command.social_probe.v1", applyMode: "MERGE_COMMAND", commandIndex: 0 });
  assert.equal(result.ok, true);
  assert.equal(result.data.instanceData.commands[0].id, "custom_focus");
  assert.equal(result.data.instanceData.commands[0].invocation.command, "my_focus");
});
check("Replace module installs the complete preset", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: requiredModule("RESOURCE_LOOP"), presetId: "module.quest_progress.v1", applyMode: "REPLACE_MODULE" });
  assert.equal(result.ok, true);
  assert.equal(result.data.instanceData.commands[0].id, "quest_progress");
});
check("Merge module appends nonconflicting content", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: makeEmptyModule(), presetId: "module.social_probe.v1", applyMode: "MERGE_MODULE" });
  assert.equal(result.ok, true);
  assert.equal(result.data.instanceData.commands.length, 1);
  assert.ok(result.data.tags.includes("existing"));
});
check("Merge conflicts reject atomically without mutating input", () => {
  const moduleData = requiredModule("SOCIAL_PROBE");
  const snapshot = JSON.stringify(moduleData);
  const result = applyMechanicsPresetToModuleData({ moduleData, presetId: "module.social_probe.v1", applyMode: "MERGE_MODULE" });
  assert.equal(result.ok, false);
  assert.equal(JSON.stringify(moduleData), snapshot);
});
check("Disallowed application modes reject atomically", () => {
  const moduleData = requiredModule("SOCIAL_PROBE");
  const snapshot = JSON.stringify(moduleData);
  const result = applyMechanicsPresetToModuleData({ moduleData, presetId: "resolution.standard_d20.v1", applyMode: "MERGE_COMMAND", commandIndex: 0 });
  assert.equal(result.ok, false);
  assert.equal(JSON.stringify(moduleData), snapshot);
});
check("Successful applications retain canonical contracts", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: makeEmptyModule(), presetId: "module.quest_progress.v1", applyMode: "REPLACE_MODULE" });
  const command = result.data.instanceData.commands[0];
  assert.equal(command.resolution.version, "mechanics_command_resolution_v6");
  assert.equal(command.composition.version, "mechanics_command_composition_v1");
});
check("Replace previews remain explicitly destructive", () => {
  const preview = previewMechanicsPresetApplication({ moduleData: requiredModule("RESOURCE_LOOP"), presetId: "command.social_probe.v1", applyMode: "REPLACE_COMMAND", commandIndex: 0 });
  assert.equal(preview.valid, true);
  assert.equal(preview.destructive, true);
});
check("Merge previews remain explicitly nondestructive", () => {
  const preview = previewMechanicsPresetApplication({ moduleData: makeEmptyModule(), presetId: "module.social_probe.v1", applyMode: "MERGE_MODULE" });
  assert.equal(preview.valid, true);
  assert.equal(preview.destructive, false);
});
check("Application audits retain exact changed paths", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: requiredModule("SOCIAL_PROBE"), presetId: "resolution.standard_d20.v1", commandIndex: 0 });
  assert.deepEqual(result.audit.changedPaths, ["command.resolution"]);
});
check("Undeclared Mechanics references remain warnings not silent mutations", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: requiredModule("TRAVEL_NAVIGATION"), presetId: "command.resource_check.v1", applyMode: "REPLACE_COMMAND", commandIndex: 0 });
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((warning) => warning.code === "MECHANICS_PRESET_UNDECLARED_STATE_REFERENCE"));
});

check("Reference runtime implementation contract and ids remain frozen", () => {
  assert.equal(MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_VERSION, "mechanics_reference_runtime_implementation_v1");
  assert.deepEqual([...MECHANICS_REFERENCE_RUNTIME_IMPLEMENTATION_IDS], [...MECHANICS_PRESET_FROZEN_RUNTIME_IDS]);
});
check("Every module starter maps to one runtime implementation", () => {
  for (const starter of moduleStarters) {
    const runtime = getMechanicsReferenceRuntimeImplementationForModuleStarter(starter.id);
    assert.ok(runtime, starter.id);
  }
});
check("Reference runtime scenarios return isolated clones", () => {
  const first = buildMechanicsReferenceRuntimeScenario("runtime.social_probe.v1");
  first.moduleData.tags.push("mutated");
  const second = buildMechanicsReferenceRuntimeScenario("runtime.social_probe.v1");
  assert.equal(second.moduleData.tags.includes("mutated"), false);
});
check("Every module preset exposes a ready live validation guide", () => {
  for (const starter of moduleStarters) {
    const guide = buildMechanicsPresetLiveValidationGuide({ presetId: starter.presetId });
    assert.equal(guide.status, "REFERENCE_RUNTIME_READY");
    assert.ok(guide.testCommand.startsWith("/"));
  }
});
check("Every command preset exposes a ready smoke guide", () => {
  for (const starter of commandStarters) {
    const guide = buildMechanicsPresetLiveValidationGuide({ presetId: starter.presetId });
    assert.equal(guide.status, "COMMAND_SMOKE_READY");
    assert.ok(guide.testCommand.startsWith("/"));
  }
});
check("Block preset guides use the selected command invocation", () => {
  const moduleData = requiredModule("SOCIAL_PROBE");
  const guide = buildMechanicsPresetLiveValidationGuide({ presetId: "resolution.standard_d20.v1", moduleData, commandIndex: 0 });
  assert.equal(guide.status, "TARGET_COMMAND_SMOKE_READY");
  assert.equal(guide.testCommand, "/probe kessa");
});

check("Mechanics editor hardens missing atomic replacement callbacks", () => {
  const text = readMechanics("MechanicsModuleFieldsSection.jsx");
  assert.match(text, /const canReplaceData = typeof replaceData === "function"/);
  assert.match(text, /disabled=\{!canReplaceData\}/);
  assert.match(text, /presetLibraryOpen && canReplaceData/);
  assert.match(text, /jsonEditorOpen && canReplaceData/);
});
check("Mechanics editor uses one guarded atomic replacement helper", () => {
  const text = readMechanics("MechanicsModuleFieldsSection.jsx");
  assert.match(text, /function replaceMechanicsData\(nextData\)/);
  assert.match(text, /if \(!replaceMechanicsData\(nextData\)\) return/);
  assert.doesNotMatch(text, /Object\.entries\(nextData\)/);
});
check("Manual builder changes clear stale validation guidance", () => {
  const text = readMechanics("MechanicsModuleFieldsSection.jsx");
  assert.match(text, /function patchData\(updates\) \{\s*setPresetValidationGuide\(null\)/s);
  assert.match(text, /function updateInstanceData\(updates = \{\}\) \{\s*setPresetValidationGuide\(null\)/s);
});
check("JSON replacement clears stale validation guidance", () => {
  const text = readMechanics("MechanicsModuleFieldsSection.jsx");
  assert.match(text, /MechanicsJsonEditorModal[\s\S]*setPresetValidationGuide\(null\)/);
});
check("Edit workflow supplies atomic replacement", () => {
  const text = readRepo("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(text, /replaceData=\{\(nextData\)/);
  assert.match(text, /updateField\("data", nextData\)/);
});
check("Create workflow supplies atomic replacement", () => {
  const text = readRepo("components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx");
  assert.match(text, /replaceData=\{\(nextData\) => updateField\("data", nextData\)\}/);
});
check("Preset LOOM View remains API and persistence free", () => {
  const text = readMechanics("mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx");
  assert.doesNotMatch(text, /\bfetch\s*\(|supabase|PostGraphile|services-api|updateDataField|replaceData/i);
});
check("Preset LOOM ViewModel remains JSX free", () => {
  const text = readMechanics("mechanics-preset-application/useMechanicsPresetApplicationViewModel.js");
  assert.doesNotMatch(text, /<\w+/);
  assert.match(text, /applyMechanicsPresetToModuleData/);
});
check("Validation LOOM View remains API and persistence free", () => {
  const text = readMechanics("mechanics-preset-validation/MechanicsPresetValidationPanel.view.jsx");
  assert.doesNotMatch(text, /\bfetch\s*\(|supabase|PostGraphile|services-api|updateDataField|replaceData/i);
});
check("Preset library remains grouped into compact folders", () => {
  const text = readMechanics("mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx");
  assert.match(text, /Module Starters/);
  assert.match(text, /Command Starters/);
  assert.match(text, /Resolution References/);
  assert.match(text, /Composition References/);
});
check("Preset application preview remains production gated", () => {
  const text = readRepo("app/dev/ui-preview/mechanics-preset-application/page.jsx");
  assert.match(text, /process\.env\.NODE_ENV === "production"/);
  assert.match(text, /notFound\(\)/);
});
check("Preset validation preview remains production gated", () => {
  const text = readRepo("app/dev/ui-preview/mechanics-preset-validation/page.jsx");
  assert.match(text, /process\.env\.NODE_ENV === "production"/);
  assert.match(text, /notFound\(\)/);
});
check("MC7 hardening report marks the phase frozen", () => {
  const text = readMechanics("mechanics-presets/MC7_PRODUCTION_HARDENING_REPORT.md");
  assert.match(text, /Status:\*\*?\s*FROZEN/);
  assert.match(text, /MC7G/);
  assert.match(text, /20 presets/);
});
check("MC7 introduces no direct product-data bypass", () => {
  const filesToCheck = [
    "mechanics-presets/mechanicsPresetCatalog.js",
    "mechanics-presets/mechanicsPresetApplicationService.js",
    "mechanics-presets/mechanicsPresetLiveValidation.js",
    "mechanics-presets/mechanicsReferenceRuntimeImplementations.js",
  ];
  for (const relativePath of filesToCheck) {
    const text = readMechanics(relativePath);
    assert.doesNotMatch(text, /createClient\(|from\(["']|supabase|PostGraphile|\bfetch\s*\(/i, relativePath);
  }
});

console.log("Crestfall mc7_production_hardening_audit_v1");
console.log(`Node ${process.version}`);
console.log("");

let passed = 0;
let failed = 0;
const started = Date.now();

for (let index = 0; index < checks.length; index += 1) {
  const current = checks[index];
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
console.log(`Summary: ${passed} passed, ${failed} failed, ${checks.length} total`);
console.log(`Elapsed: ${Date.now() - started} ms`);

if (failed > 0) process.exitCode = 1;
