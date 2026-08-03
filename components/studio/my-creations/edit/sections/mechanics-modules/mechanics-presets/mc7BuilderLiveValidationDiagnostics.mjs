import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_PRESET_LIVE_VALIDATION_VERSION,
  buildMechanicsPresetLiveValidationGuide,
  summarizeMechanicsPresetLiveValidationGuide,
} from "./mechanicsPresetLiveValidation.js";
import {
  listMechanicsReferenceRuntimeImplementations,
} from "./mechanicsReferenceRuntimeImplementations.js";
import {
  listMechanicsModuleStarterPresets,
} from "./mechanicsModuleStarterPresets.js";
import {
  listMechanicsCommandStarterPresets,
} from "./mechanicsCommandStarterPresets.js";
import {
  MECHANICS_PRESET_APPLICATION_MODAL_VIEW_CONTRACT_VERSION,
} from "../mechanics-preset-application/MechanicsPresetApplicationModal.contract.js";
import {
  MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT,
  MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT_VERSION,
} from "../mechanics-preset-validation/MechanicsPresetValidationPanel.contract.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mechanicsRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(__dirname, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.resolve(mechanicsRoot, relativePath), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

const moduleStarters = listMechanicsModuleStarterPresets();
const commandStarters = listMechanicsCommandStarterPresets();
const runtimeImplementations = listMechanicsReferenceRuntimeImplementations();

const moduleGuides = moduleStarters.map((starter) =>
  buildMechanicsPresetLiveValidationGuide({ presetId: starter.presetId })
);
const commandGuides = commandStarters.map((starter) =>
  buildMechanicsPresetLiveValidationGuide({ presetId: starter.presetId })
);

const targetModule = {
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  instanceData: {
    commands: [
      {
        id: "probe",
        invocation: {
          command: "probe",
          prefixes: ["/"],
          arguments: [
            { name: "target", type: "CHARACTER_PRESENT" },
          ],
        },
      },
    ],
  },
};

const resolutionGuide = buildMechanicsPresetLiveValidationGuide({
  presetId: "resolution.standard_d20.v1",
  moduleData: targetModule,
  commandId: "probe",
});
const compositionGuide = buildMechanicsPresetLiveValidationGuide({
  presetId: "composition.sequential_attempt_success.v1",
  moduleData: targetModule,
  commandId: "probe",
});

test("Live validation contract starts at v1", () => {
  assert.equal(
    MECHANICS_PRESET_LIVE_VALIDATION_VERSION,
    "mechanics_preset_live_validation_v1"
  );
});

test("Five module starter guides are available", () => {
  assert.equal(moduleGuides.length, 5);
  assert.ok(moduleGuides.every(Boolean));
});

test("Every module starter guide uses its registered MC7E runtime", () => {
  const runtimeIds = new Set(runtimeImplementations.map((entry) => entry.id));
  assert.ok(
    moduleGuides.every((guide) => runtimeIds.has(guide.runtimeImplementationId))
  );
});

test("Every module starter guide is reference-runtime ready", () => {
  assert.ok(
    moduleGuides.every((guide) => guide.status === "REFERENCE_RUNTIME_READY")
  );
});

test("Every module starter guide exposes a representative test command", () => {
  assert.ok(moduleGuides.every((guide) => guide.testCommand.startsWith("/")));
});

test("Every module starter guide exposes an expected outcome", () => {
  assert.ok(moduleGuides.every((guide) => guide.expectedOutcome));
});

test("Every module starter guide provides bounded validation steps", () => {
  assert.ok(moduleGuides.every((guide) => guide.steps.length >= 4));
});

test("Every module starter guide provides expected checks", () => {
  assert.ok(moduleGuides.every((guide) => guide.checks.length >= 3));
});

test("Item Handoff exposes ITEM_RUNTIME validation evidence", () => {
  const guide = moduleGuides.find((entry) => entry.presetId === "module.item_handoff.v1");
  assert.deepEqual(guide.expectedDomainLanes, ["ITEM_RUNTIME"]);
});

test("Travel Navigation exposes LOCATION_RUNTIME validation evidence", () => {
  const guide = moduleGuides.find((entry) => entry.presetId === "module.travel_navigation.v1");
  assert.deepEqual(guide.expectedDomainLanes, ["LOCATION_RUNTIME"]);
});

test("Social Probe exposes the live-tested probe command", () => {
  const guide = moduleGuides.find((entry) => entry.presetId === "module.social_probe.v1");
  assert.equal(guide.testCommand, "/probe kessa");
  assert.equal(guide.expectedOutcome, "SUCCESS");
});

test("Five command starter smoke guides are available", () => {
  assert.equal(commandGuides.length, 5);
  assert.ok(commandGuides.every(Boolean));
});

test("Every command starter guide exposes a sample command", () => {
  assert.ok(commandGuides.every((guide) => guide.testCommand.startsWith("/")));
});

test("Give command starter uses sample Item and Character targets", () => {
  const guide = commandGuides.find((entry) => entry.presetId === "command.give_item.v1");
  assert.equal(guide.testCommand, "/give compass kessa");
});

test("Condition command starter consumes the sample condition text", () => {
  const guide = commandGuides.find((entry) => entry.presetId === "command.apply_condition.v1");
  assert.equal(guide.testCommand, "/afflict kessa blinded");
});

test("Travel command starter quotes a multiword Location", () => {
  const guide = commandGuides.find((entry) => entry.presetId === "command.travel_connected.v1");
  assert.equal(guide.testCommand, '/go "silver market"');
});

test("Deterministic command starters advertise Success", () => {
  const guide = commandGuides.find((entry) => entry.presetId === "command.give_item.v1");
  assert.equal(guide.expectedOutcome, "SUCCESS");
});

test("Rolling command starters advertise server roll validation", () => {
  const guide = commandGuides.find((entry) => entry.presetId === "command.social_probe.v1");
  assert.equal(guide.expectedOutcome, "SERVER_ROLL");
});

test("Resolution block guide uses the selected command invocation", () => {
  assert.equal(resolutionGuide.testCommand, "/probe kessa");
  assert.equal(resolutionGuide.status, "TARGET_COMMAND_SMOKE_READY");
});

test("Composition block guide uses the selected command invocation", () => {
  assert.equal(compositionGuide.testCommand, "/probe kessa");
  assert.equal(compositionGuide.expectedOutcome, "CONFIGURED_ROUTING");
});

test("Unknown preset ids return no guide", () => {
  assert.equal(
    buildMechanicsPresetLiveValidationGuide({ presetId: "unknown.preset.v1" }),
    null
  );
});

test("Guide summary retains the bounded audit shape", () => {
  const summary = summarizeMechanicsPresetLiveValidationGuide(moduleGuides[0]);
  assert.equal(summary.version, MECHANICS_PRESET_LIVE_VALIDATION_VERSION);
  assert.ok(summary.stepCount >= 4);
  assert.ok(summary.checkCount >= 3);
});

test("Preset application modal contract advances to v1.1", () => {
  assert.equal(MECHANICS_PRESET_APPLICATION_MODAL_VIEW_CONTRACT_VERSION, "1.1.0");
});

test("Validation panel contract starts at v1", () => {
  assert.equal(MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT_VERSION, "1.0.0");
});

test("Validation panel contract exposes semantic values and callbacks", () => {
  assert.ok(MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT.values.includes("testCommand"));
  assert.deepEqual(
    MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT.callbacks,
    ["onCopyTestCommand", "onDismiss"]
  );
});

test("Preset modal View displays compact live-validation evidence", () => {
  const view = read("mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx");
  assert.match(view, /selectedPreset\.liveValidation/);
  assert.match(view, /Reference Test Command/);
  assert.match(view, /validationLabel/);
});

test("Preset modal View remains API and persistence free", () => {
  const view = read("mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx");
  assert.doesNotMatch(view, /\bfetch\s*\(/);
  assert.doesNotMatch(view, /supabase|PostGraphile|updateDataField|replaceData/);
});

test("Preset modal ViewModel creates guides before and after apply", () => {
  const viewModel = read("mechanics-preset-application/useMechanicsPresetApplicationViewModel.js");
  assert.match(viewModel, /buildMechanicsPresetLiveValidationGuide/);
  assert.match(viewModel, /onApply\?\.\(result\.data, result\.audit, appliedLiveValidation\)/);
});

test("Preset modal ViewModel remains JSX free", () => {
  const viewModel = read("mechanics-preset-application/useMechanicsPresetApplicationViewModel.js");
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Mechanics orchestration stages the post-apply guide transiently", () => {
  const assemblyShell = read(
    "mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  const orchestration = read(
    "mechanics-document-orchestration/useMechanicsDocumentOrchestrationViewModel.js"
  );
  const shell = read(
    "mechanics-document-orchestration/MechanicsDocumentOrchestration.jsx"
  );
  assert.match(assemblyShell, /MechanicsDocumentOrchestrationSurfaces/);
  assert.match(orchestration, /presetValidationGuide/);
  assert.match(orchestration, /setPresetValidationGuide\(/);
  assert.match(shell, /MechanicsPresetValidationPanel/);
});

test("Mechanics builder still uses the normal atomic replaceData callback", () => {
  const builder = read("MechanicsModuleFieldsSection.jsx");
  assert.match(builder, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
  assert.doesNotMatch(builder, /handleSave\s*\(/);
});

test("Validation panel Shell remains an explicit LOOM binding", () => {
  const shell = read("mechanics-preset-validation/MechanicsPresetValidationPanel.jsx");
  assert.match(shell, /useMechanicsPresetValidationPanelViewModel/);
  assert.match(shell, /<MechanicsPresetValidationPanelView \{\.\.\.viewProps\}/);
});

test("Validation panel View remains API and persistence free", () => {
  const view = read("mechanics-preset-validation/MechanicsPresetValidationPanel.view.jsx");
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|updateDataField|replaceData/);
});

test("Validation panel ViewModel owns clipboard interaction", () => {
  const viewModel = read("mechanics-preset-validation/useMechanicsPresetValidationPanelViewModel.js");
  assert.match(viewModel, /navigator\.clipboard\.writeText/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Validation panel fixtures match the semantic View contract", () => {
  const fixtures = read("mechanics-preset-validation/mechanicsPresetValidationPanel.fixtures.js");
  assert.match(fixtures, /mechanicsPresetValidationReferenceFixture/);
  assert.match(fixtures, /mechanicsPresetValidationDomainFixture/);
  assert.match(fixtures, /onCopyTestCommand/);
});

test("Validation preview route is development-only", () => {
  const page = readRepo("app/dev/ui-preview/mechanics-preset-validation/page.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Validation preview renders contract-shaped panel fixtures", () => {
  const preview = readRepo(
    "app/dev/ui-preview/mechanics-preset-validation/MechanicsPresetValidationPreviewClient.jsx"
  );
  assert.match(preview, /MechanicsPresetValidationPanelView/);
  assert.match(preview, /mechanicsPresetValidationReferenceFixture/);
});

test("Live validation helper does not perform runtime mutation or API calls", () => {
  const helper = read("mechanics-presets/mechanicsPresetLiveValidation.js");
  assert.doesNotMatch(helper, /\bfetch\s*\(|supabase|PostGraphile|applyMechanicsCommand/);
});

test("MC7E runtime implementation count remains frozen at five", () => {
  assert.equal(runtimeImplementations.length, 5);
});

test("MC5 and MC6 contract markers remain frozen", () => {
  const catalog = read("mechanics-presets/mechanicsPresetCatalog.js");
  const resolution = read("mechanicsCommandResolutionBuilder.js");
  const composition = read("mechanicsCommandCompositionBuilder.js");
  assert.match(resolution, /mechanics_command_resolution_v6/);
  assert.match(composition, /mechanics_command_composition_v1/);
  assert.match(catalog, /MECHANICS_COMMAND_RESOLUTION_VERSION/);
});

console.log("Crestfall mc7_builder_live_validation_diagnostics_v1");
console.log(`Node ${process.version}`);
console.log("");

let passed = 0;
let failed = 0;
const start = Date.now();

for (let index = 0; index < tests.length; index += 1) {
  const entry = tests[index];
  const testStart = Date.now();
  try {
    await entry.fn();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${entry.name} (${Date.now() - testStart} ms)`
    );
  } catch (error) {
    failed += 1;
    console.log(
      `FAIL ${String(index + 1).padStart(2, "0")} ${entry.name} (${Date.now() - testStart} ms)`
    );
    console.log(error?.stack || error);
  }
}

console.log("");
console.log(`Summary: ${passed} passed, ${failed} failed, ${tests.length} total`);
console.log(`Elapsed: ${Date.now() - start} ms`);

if (failed > 0) process.exitCode = 1;
