import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  applyMechanicsDocumentReplacement,
  buildMechanicsDocumentOrchestrationCapability,
  normalizeMechanicsPresetValidationGuide,
} from "./mechanicsDocumentOrchestrationOperations.js";
import { MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES } from "./mechanicsDocumentOrchestration.fixtures.js";
import { canonicalizeMechanicsModuleData } from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function absolute(relativePath) {
  return path.join(repoRoot, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

test("M8 capability enables both complete-document authoring controls together", () => {
  const enabled = buildMechanicsDocumentOrchestrationCapability(true);
  assert.equal(enabled.canReplaceData, true);
  assert.match(enabled.presetButtonTitle, /preset library/i);
  assert.match(enabled.jsonButtonTitle, /complete Mechanics Module JSON editor/i);
});

test("M8 disables preset and JSON controls when atomic replacement is unavailable", () => {
  const disabled = buildMechanicsDocumentOrchestrationCapability(false);
  assert.equal(disabled.canReplaceData, false);
  assert.match(disabled.presetButtonTitle, /Atomic Mechanics data replacement is unavailable/);
  assert.match(disabled.jsonButtonTitle, /Atomic Mechanics data replacement is unavailable/);
});

test("M8 replacement calls the parent boundary exactly once with the complete object", () => {
  const source = MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES[0].mechanicsData;
  const calls = [];
  const result = applyMechanicsDocumentReplacement({
    nextData: source,
    onReplaceMechanicsData(nextData) {
      calls.push(nextData);
      return true;
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.reason, "APPLIED");
  assert.equal(calls.length, 1);
  assert.equal(calls[0], source);
});

test("M8 rejects missing or parent-rejected replacement without a fallback mutation", () => {
  assert.deepEqual(applyMechanicsDocumentReplacement({ nextData: {} }), {
    ok: false,
    reason: "ATOMIC_REPLACEMENT_UNAVAILABLE",
  });

  let calls = 0;
  const rejected = applyMechanicsDocumentReplacement({
    nextData: {},
    onReplaceMechanicsData() {
      calls += 1;
      return false;
    },
  });
  assert.equal(calls, 1);
  assert.deepEqual(rejected, {
    ok: false,
    reason: "REPLACEMENT_REJECTED",
  });
});

test("M8 preserves valid live-validation guide metadata and rejects invalid shapes", () => {
  const guide = {
    presetId: "reference.social_probe.module.v1",
    futureGuideMetadata: { retained: true },
  };
  assert.equal(normalizeMechanicsPresetValidationGuide(guide), guide);
  assert.equal(normalizeMechanicsPresetValidationGuide([]), null);
  assert.equal(normalizeMechanicsPresetValidationGuide("guide"), null);
});

test("complete JSON canonicalization preserves unknown root and instance metadata", () => {
  const canonical = canonicalizeMechanicsModuleData(
    MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES[0].mechanicsData
  );
  assert.deepEqual(canonical.futureRootMetadata, { retained: true });
  assert.deepEqual(canonical.instanceData.futureInstanceMetadata, {
    retained: true,
  });
  assert.equal(canonical.moduleDefinitionId, "core.trackers.v1");
  assert.equal(canonical.instanceData.contractVersion, "trackers_instance_data.v0_2");
});

test("portable M8 View owns only Preset Library and JSON Editor presentation", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/MechanicsDocumentOrchestration.view.jsx"
  );
  assert.match(view, /Preset Library/);
  assert.match(view, /JSON Editor/);
  assert.doesNotMatch(view, /replaceData/);
  assert.doesNotMatch(view, /updateDataField/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
});

test("M8 Binding Shell composes existing preset, validation, and JSON packages", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/MechanicsDocumentOrchestration.jsx"
  );
  assert.match(shell, /MechanicsPresetApplicationModal/);
  assert.match(shell, /MechanicsPresetValidationPanel/);
  assert.match(shell, /MechanicsJsonEditorModal/);
  assert.match(shell, /presetLibraryOpen && canReplaceData/);
  assert.match(shell, /jsonEditorOpen && canReplaceData/);
});

test("M8 ViewModel routes preset and JSON application through one semantic callback", () => {
  const source = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/useMechanicsDocumentOrchestrationViewModel.js"
  );
  assert.match(source, /applyMechanicsDocumentReplacement/);
  assert.match(source, /function applyPreset/);
  assert.match(source, /function applyJson/);
  assert.match(source, /setPresetValidationGuide\(/);
  assert.match(source, /setPresetValidationGuide\(null\)/);
  assert.doesNotMatch(source, /updateDataField/);
});

test("main Mechanics parent retains normalization and atomic replacement ownership", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx"
  );
  const assemblyShell = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  assert.match(parent, /function replaceMechanicsData\(nextData\)/);
  assert.match(parent, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
  assert.match(parent, /onReplaceMechanicsData=\{replaceMechanicsData\}/);
  assert.match(assemblyShell, /MechanicsDocumentOrchestrationControls/);
  assert.match(assemblyShell, /<MechanicsDocumentOrchestrationControls/);
  assert.match(assemblyShell, /<MechanicsDocumentOrchestrationSurfaces/);
  assert.doesNotMatch(parent, /MechanicsPresetApplicationModal/);
  assert.doesNotMatch(parent, /MechanicsJsonEditorModal/);
  assert.doesNotMatch(parent, /const \[jsonEditorOpen/);
  assert.doesNotMatch(parent, /const \[presetLibraryOpen/);
});

test("ordinary visual edits clear transient preset validation guidance", () => {
  const assemblyViewModel = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js"
  );
  const matches = assemblyViewModel.match(/documentOrchestration\.dismissPresetValidationGuide\(\)/g) || [];
  assert.equal(matches.length, 2);
  assert.match(assemblyViewModel, /function patchData\(updates\)/);
  assert.match(assemblyViewModel, /function updateInstanceData\(updates = \{\}\)/);
});

test("create and edit callers still provide complete-data replacement", () => {
  const create = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/useMechanicsModuleBuilderViewModel.js"
  );
  const edit = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
  );
  assert.match(create, /replaceData:\s*replaceMechanicsData/);
  assert.match(create, /data:\s*normalizeMechanicsDocument\(nextData\)/);
  assert.match(edit, /replaceData=\{\(nextData\)\s*=>\s*updateField\("data", nextData\)/s);
});

test("existing preset and JSON safety behavior remains delegated to focused packages", () => {
  const presetVm = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/useMechanicsPresetApplicationViewModel.js"
  );
  const jsonVm = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/useMechanicsJsonEditorViewModel.js"
  );
  assert.match(presetVm, /confirmationRequired/);
  assert.match(presetVm, /applyMechanicsPresetToModuleData/);
  assert.match(presetVm, /onApply\?\.\(result\.data, result\.audit, appliedLiveValidation\)/);
  assert.match(jsonVm, /validateMechanicsJsonText/);
  assert.match(jsonVm, /formatMechanicsJsonText/);
  assert.match(jsonVm, /buildMechanicsJsonAiAuthoringGuide/);
  assert.match(jsonVm, /onApply\?\.\(result\.data\)/);
});

test("M8 package includes contract, View, ViewModel, operations, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsDocumentOrchestration.contract.js",
    "MechanicsDocumentOrchestration.jsx",
    "MechanicsDocumentOrchestration.view.jsx",
    "useMechanicsDocumentOrchestrationViewModel.js",
    "mechanicsDocumentOrchestrationOperations.js",
    "mechanicsDocumentOrchestration.fixtures.js",
    "mechanicsDocumentOrchestrationDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-document-orchestration/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m8"] || "",
    /mechanicsDocumentOrchestrationDiagnostics\.mjs/
  );
});
