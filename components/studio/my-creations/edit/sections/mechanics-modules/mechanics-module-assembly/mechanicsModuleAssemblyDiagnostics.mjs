import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  addMechanicsAssemblyCommand,
  buildMechanicsModuleAssemblyProjection,
  getMechanicsCommandFoldSummary,
  normalizeMechanicsAssemblyCommand,
  patchMechanicsAssemblyCommand,
  removeMechanicsAssemblyCommand,
} from "./mechanicsModuleAssemblyOperations.js";
import { MECHANICS_MODULE_ASSEMBLY_FIXTURES } from "./mechanicsModuleAssembly.fixtures.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function lineCount(relativePath) {
  return read(relativePath).split(/\r?\n/).length;
}

test("M9 projection preserves all assembled domains and unknown metadata", () => {
  const projection = buildMechanicsModuleAssemblyProjection(
    MECHANICS_MODULE_ASSEMBLY_FIXTURES[0].mechanicsData
  );
  assert.equal(projection.trackers.length, 1);
  assert.equal(projection.commands.length, 1);
  assert.equal(projection.defaultEntryCount, 1);
  assert.equal(projection.statusBlocks.length, 1);
  assert.equal(projection.guards.length, 1);
  assert.deepEqual(projection.data.futureRootMetadata, { retained: true });
  assert.deepEqual(projection.instanceData.futureInstanceMetadata, { retained: true });
});

test("M9 command normalization preserves unknown command metadata", () => {
  const command = normalizeMechanicsAssemblyCommand({
    id: "probe",
    invocation: { command: "probe", prefixes: ["/"], arguments: [] },
    futureCommandMetadata: { retained: true },
  });
  assert.deepEqual(command.futureCommandMetadata, { retained: true });
  assert.equal(command.commandContractVersion, "mechanics_command_contract_v1");
});

test("M9 command add, patch, and remove operations remain immutable", () => {
  const source = MECHANICS_MODULE_ASSEMBLY_FIXTURES[0].mechanicsData.instanceData.commands;
  const added = addMechanicsAssemblyCommand(source);
  const patched = patchMechanicsAssemblyCommand(added, 1, { label: "Patched" });
  const removed = removeMechanicsAssemblyCommand(patched, 0);
  assert.equal(source.length, 1);
  assert.equal(added.length, 2);
  assert.equal(patched[1].label, "Patched");
  assert.equal(removed.length, 1);
  assert.equal(removed[0].label, "Patched");
});

test("M9 command fold summary composes extracted domain evidence", () => {
  const summary = getMechanicsCommandFoldSummary(
    MECHANICS_MODULE_ASSEMBLY_FIXTURES[0].mechanicsData.instanceData.commands[0],
    0
  );
  assert.match(summary, /\/observe/);
  assert.match(summary, /argument/);
  assert.match(summary, /requirement/);
});

test("M9 portable View accepts injected domain slots and owns no app data boundary", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.view.jsx"
  );
  assert.match(view, /trackersContent/);
  assert.match(view, /commandsContent/);
  assert.match(view, /defaultsContent/);
  assert.match(view, /statusBlocksContent/);
  assert.match(view, /guardsContent/);
  assert.match(view, /documentControls/);
  assert.doesNotMatch(view, /replaceData|updateDataField|normalizeMechanicsDocument/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
});

test("M9 Binding Shell composes every extracted Mechanics domain", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  for (const marker of [
    "MechanicsTrackersSection",
    "MechanicsCommandIdentitySection",
    "MechanicsCommandInvocationSection",
    "MechanicsCommandArgumentsSection",
    "MechanicsCommandTriggersSection",
    "MechanicsCommandRequirements",
    "MechanicsCommandDomainActions",
    "MechanicsCommandEffects",
    "MechanicsCommandResolution",
    "MechanicsCommandOutcomes",
    "MechanicsCompositionBuilder",
    "MechanicsDefaults",
    "MechanicsStatusBlocks",
    "MechanicsGuards",
  ]) {
    assert.match(shell, new RegExp(marker));
  }
});

test("M9 ViewModel owns local folds and immutable visual edit orchestration", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js"
  );
  assert.match(viewModel, /useMechanicsDocumentOrchestrationViewModel/);
  assert.match(viewModel, /replaceMechanicsRootFields/);
  assert.match(viewModel, /replaceMechanicsInstanceData/);
  assert.match(viewModel, /crestfall:mechanics-runtime-navigate/);
  assert.match(viewModel, /crestfall:mechanics-runtime-fold-all/);
  assert.match(viewModel, /crestfall:mechanics-runtime-active/);
  assert.doesNotMatch(viewModel, /replaceData\(/);
});

test("M9 parent is a thin persistence Binding Shell", () => {
  const parentPath =
    "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx";
  const parent = read(parentPath);
  assert.ok(lineCount(parentPath) >= 25 && lineCount(parentPath) <= 55);
  assert.match(parent, /MechanicsModuleAssembly/);
  assert.match(parent, /function replaceMechanicsData\(nextData\)/);
  assert.match(parent, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
  assert.doesNotMatch(parent, /useState|useEffect|window\.|document\./);
  assert.doesNotMatch(parent, /MechanicsTrackersSection|MechanicsCommandIdentitySection/);
});

test("create and edit callers still use the same parent shell and atomic callback", () => {
  const create = read(
    "components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx"
  );
  const createVm = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/useMechanicsModuleBuilderViewModel.js"
  );
  const edit = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
  );
  assert.match(create, /MechanicsModuleFieldsSection/);
  assert.match(createVm, /replaceData:\s*replaceMechanicsData/);
  assert.match(edit, /replaceData=\{\(nextData\)\s*=>\s*updateField\("data", nextData\)/s);
});

test("M9 package contains contract, View, ViewModel, operations, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsModuleAssembly.contract.js",
    "MechanicsModuleAssembly.jsx",
    "MechanicsModuleAssembly.view.jsx",
    "useMechanicsModuleAssemblyViewModel.js",
    "mechanicsModuleAssemblyOperations.js",
    "mechanicsModuleAssembly.fixtures.js",
    "mechanicsModuleAssemblyDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-module-assembly/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m9"] || "",
    /mechanicsModuleAssemblyDiagnostics\.mjs/
  );
});

test("M9 assessment records completed parent assembly and portability proof", () => {
  const manifest = read(
    "components/studio/pre-mechanics-closeout/mechanicsAssessmentManifest.mjs"
  );
  const assessment = read(
    "components/studio/pre-mechanics-closeout/MECHANICS_ABSTRACTION_ASSESSMENT.md"
  );
  assert.match(manifest, /crestfall\.loom\.mechanics-assessment\.v15/);
  assert.match(manifest, /MECHANICS_DECOMPOSITION_CLOSED_READY_FOR_REPOSITORY_EXTRACTION/);
  assert.match(assessment, /M9 complete/);
  assert.match(assessment, /Mechanics decomposition is complete/);
});

test("M9 does not alter auth, API, runtime evaluation, or persistence services", () => {
  const packageSource = [
    read(
      "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
    ),
    read(
      "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js"
    ),
    read(
      "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/mechanicsModuleAssemblyOperations.js"
    ),
  ].join("\n");
  assert.doesNotMatch(packageSource, /supabase|PostGraphile|\/api\/|auth\/callback/);
  assert.doesNotMatch(packageSource, /services\/api|engine-middleware/);
});

test("M9 complete fixture remains canonical through the shared document core", () => {
  const projection = buildMechanicsModuleAssemblyProjection(
    MECHANICS_MODULE_ASSEMBLY_FIXTURES[0].mechanicsData
  );
  assert.equal(projection.data.moduleDefinitionId, "core.trackers.v1");
  assert.equal(projection.instanceData.contractVersion, "trackers_instance_data.v0_2");
  assert.equal(projection.data.priority, 89);
  assert.deepEqual(projection.data.tags, ["preview", "m9-assembly"]);
});

test("M9 empty fixture remains an editable complete Mechanics document", () => {
  const projection = buildMechanicsModuleAssemblyProjection(
    MECHANICS_MODULE_ASSEMBLY_FIXTURES[1].mechanicsData
  );
  assert.equal(projection.trackers.length, 0);
  assert.equal(projection.commands.length, 0);
  assert.equal(projection.statusBlocks.length, 0);
  assert.equal(projection.guards.length, 0);
  assert.equal(projection.defaultEntryCount, 0);
});
