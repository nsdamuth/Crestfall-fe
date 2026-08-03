import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_ATOMIC_REPLACEMENT_BOUNDARIES,
  MECHANICS_COMPATIBILITY_BASELINE_CONTRACT_VERSION,
  MECHANICS_COMPATIBILITY_BASELINE_PHASE,
  MECHANICS_COMPATIBILITY_BASELINE_STATUS,
  MECHANICS_CREATE_PAYLOAD_ALLOWLIST,
  MECHANICS_CURRENT_IDENTITIES,
  MECHANICS_INSTANCE_STORAGE_PATHS,
  MECHANICS_ROOT_STORAGE_PATHS,
} from "./MechanicsCompatibilityBaseline.contract.js";
import {
  MECHANICS_M0_FIXTURE_HASHES,
  MECHANICS_M0_FIXTURE_INVENTORY_VERSION,
  listMechanicsM0Fixtures,
} from "./mechanicsCompatibilityBaseline.fixtures.js";
import {
  MECHANICS_M0_DEFERRED_CROSS_TIER_DIAGNOSTICS,
  MECHANICS_M0_EXTERNAL_REPOSITORIES,
  MECHANICS_M0_FRONTEND_DIAGNOSTICS,
  MECHANICS_M0_MANIFEST_VERSION,
  getMechanicsM0BaselineManifest,
} from "./mechanicsCompatibilityBaselineManifest.js";
import {
  MECHANICS_LEGACY_FIXTURE_STATUS,
  listMechanicsLegacyFixtures,
} from "../mechanics-presets/mc8LegacyMechanicsFixtures.js";
import {
  MECHANICS_COMPATIBILITY_FROZEN_COUNTS,
  MECHANICS_COMPATIBILITY_SHARED_IDENTITIES,
} from "../mechanics-presets/mechanicsCompatibilityBaselineManifest.js";
import { MECHANICS_PRESET_FROZEN_COUNTS } from "../mechanics-presets/mechanicsPresetFreezeManifest.js";
import { MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS } from "../mechanics-presets/mechanicsPresetExtensionFreezeManifest.js";
import { applyMechanicsPresetToModuleData } from "../mechanics-presets/mechanicsPresetApplicationService.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}

function runNode(relativePath, args = [], env = process.env) {
  return spawnSync(process.execPath, [path.resolve(repoRoot, relativePath), ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env,
    maxBuffer: 32 * 1024 * 1024,
  });
}

function emptyModule() {
  return {
    builder: MECHANICS_CURRENT_IDENTITIES.builder,
    builder_version: MECHANICS_CURRENT_IDENTITIES.builderVersion,
    moduleDefinitionId: MECHANICS_CURRENT_IDENTITIES.moduleDefinitionId,
    moduleId: MECHANICS_CURRENT_IDENTITIES.moduleId,
    contractVersion: MECHANICS_CURRENT_IDENTITIES.contractVersion,
    priority: MECHANICS_CURRENT_IDENTITIES.defaultPriority,
    operationTriggers: { chatTurnDefault: MECHANICS_CURRENT_IDENTITIES.defaultOperation },
    tags: [],
    instanceData: {
      contractVersion: MECHANICS_CURRENT_IDENTITIES.contractVersion,
      trackers: [], commands: [],
      defaults: { flags: [], counters: [], stages: [] },
      statusBlocks: [], guards: [],
    },
  };
}

test("M0 contract and manifest freeze pre-extraction status", () => {
  assert.equal(MECHANICS_COMPATIBILITY_BASELINE_CONTRACT_VERSION, "crestfall.loom.mechanics-compatibility-baseline.v1");
  assert.equal(MECHANICS_COMPATIBILITY_BASELINE_PHASE, "M0");
  assert.equal(MECHANICS_COMPATIBILITY_BASELINE_STATUS, "FROZEN_BEFORE_DOMAIN_EXTRACTION");
  assert.equal(MECHANICS_M0_MANIFEST_VERSION, "crestfall.mechanics.m0.baseline-manifest.v1");
  const first = getMechanicsM0BaselineManifest();
  first.identities.moduleId = "mutated";
  assert.equal(getMechanicsM0BaselineManifest().identities.moduleId, "core.trackers.v1");
});

test("fixture inventory freezes nine representative document classes", () => {
  assert.equal(MECHANICS_M0_FIXTURE_INVENTORY_VERSION, "crestfall.mechanics.m0.fixture-inventory.v1");
  const fixtures = listMechanicsM0Fixtures();
  assert.equal(fixtures.length, 9);
  assert.equal(new Set(fixtures.map((fixture) => fixture.id)).size, 9);
  const classes = new Set(fixtures.map((fixture) => fixture.classification));
  for (const required of ["CURRENT_AUTHORING", "CURRENT_AUTHORING_WITH_UNKNOWN_FIELDS", "LEGACY_COMPATIBILITY", "RECOVERABLE_INPUT", "PRESET_DERIVED"]) {
    assert.equal(classes.has(required), true, required);
  }
});

test("fixture hashes make compatibility drift explicit", () => {
  const fixtures = listMechanicsM0Fixtures();
  assert.deepEqual(Object.keys(MECHANICS_M0_FIXTURE_HASHES).sort(), fixtures.map((fixture) => fixture.id).sort());
  fixtures.forEach((fixture) => assert.equal(hash(fixture), MECHANICS_M0_FIXTURE_HASHES[fixture.id], fixture.id));
});

test("current root and instance storage paths remain explicit", () => {
  assert.deepEqual(MECHANICS_ROOT_STORAGE_PATHS, ["builder", "builder_version", "moduleDefinitionId", "moduleId", "contractVersion", "priority", "operationTriggers", "tags", "instanceData"]);
  assert.deepEqual(MECHANICS_INSTANCE_STORAGE_PATHS, ["contractVersion", "trackers", "commands", "defaults.flags", "defaults.counters", "defaults.stages", "statusBlocks", "guards"]);
  assert.match(MECHANICS_CREATE_PAYLOAD_ALLOWLIST.behavior, /Unknown create-draft keys are not promised/);
});

test("create and edit parents retain atomic whole-data replacement", () => {
  assert.equal(MECHANICS_ATOMIC_REPLACEMENT_BOUNDARIES.length, 4);
  const createSource = read("components/studio/create/mechanics-module/mechanics-module-builder/useMechanicsModuleBuilderViewModel.js");
  assert.match(createSource, /function replaceMechanicsData\(nextData\)/);
  assert.match(createSource, /data:\s*normalizeMechanicsDocument\(nextData\)/);
  assert.match(createSource, /replaceData:\s*replaceMechanicsData/);
  const editSource = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editSource, /replaceData=\{\(nextData\)\s*=>\s*updateField\("data", nextData\)\s*\}/s);
});

test("JSON and preset application converge on atomic replacement", () => {
  const editor = read("components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx");
  const orchestration = read("components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/useMechanicsDocumentOrchestrationViewModel.js");
  const shell = read("components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/MechanicsDocumentOrchestration.jsx");
  assert.match(editor, /function replaceMechanicsData\(nextData\)/);
  assert.match(editor, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
  assert.match(editor, /onReplaceMechanicsData=\{replaceMechanicsData\}/);
  assert.match(orchestration, /function applyPreset\(nextData/);
  assert.match(orchestration, /function applyJson\(nextData\)/);
  assert.match(orchestration, /applyMechanicsDocumentReplacement/);
  assert.match(shell, /<MechanicsPresetApplicationModal/);
  assert.match(shell, /<MechanicsJsonEditorModal/);
  assert.match(read("components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/useMechanicsJsonEditorViewModel.js"), /onApply\?\.\(result\.data\)/);
  assert.match(read("components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/useMechanicsPresetApplicationViewModel.js"), /onApply\?\.\(result\.data, result\.audit, appliedLiveValidation\)/);
});

test("existing MC8 legacy and preset freezes remain authoritative", () => {
  assert.equal(MECHANICS_LEGACY_FIXTURE_STATUS, "INVENTORIED_NOT_MIGRATED");
  assert.equal(listMechanicsLegacyFixtures().length >= 8, true);
  assert.deepEqual(MECHANICS_PRESET_FROZEN_COUNTS, { total: 20, resolution: 6, composition: 4, command: 5, module: 5, referenceRuntime: 5 });
  assert.deepEqual(MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS, { core: 20, extension: 2, liveLibrary: 22 });
  assert.deepEqual(MECHANICS_COMPATIBILITY_FROZEN_COUNTS, { corePresets: 20, extensionPresets: 2, livePresetLibrary: 22, referenceRuntimeImplementations: 5 });
  assert.equal(MECHANICS_COMPATIBILITY_SHARED_IDENTITIES.instanceData, "trackers_instance_data.v0_2");
});

test("preset-derived resource loop resolves through current safe application", () => {
  const result = applyMechanicsPresetToModuleData({ moduleData: emptyModule(), presetId: "module.resource_loop.v1", applyMode: "REPLACE_MODULE" });
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.data.moduleDefinitionId, "core.trackers.v1");
  assert.deepEqual(result.data.instanceData.trackers.map((item) => item.id), ["resource"]);
  assert.deepEqual(result.data.instanceData.commands.map((item) => item.id), ["resource_check"]);
});

test("safe frontend Mechanics diagnostics pass as executable M0 baseline", () => {
  assert.equal(MECHANICS_M0_FRONTEND_DIAGNOSTICS.length, 3);
  for (const diagnostic of MECHANICS_M0_FRONTEND_DIAGNOSTICS) {
    const result = runNode(diagnostic);
    assert.equal(result.status, 0, `${diagnostic}\n${result.stdout || ""}\n${result.stderr || ""}`);
  }
});

test("cross-service work is gated instead of falsely passed", () => {
  assert.equal(MECHANICS_M0_EXTERNAL_REPOSITORIES.length, 2);
  assert.equal(MECHANICS_M0_DEFERRED_CROSS_TIER_DIAGNOSTICS.length, 3);
  const cleanEnv = { ...process.env, CRESTFALL_SERVICES_API_ROOT: "", CRESTFALL_ENGINE_MIDDLEWARE_ROOT: "" };
  const report = runNode("components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline/mechanicsM0CrossServiceGate.mjs", [], cleanEnv);
  assert.equal(report.status, 0);
  assert.match(report.stdout, /DEFERRED SERVICES_API/);
  assert.match(report.stdout, /DEFERRED ENGINE_MIDDLEWARE/);
  const required = runNode("components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline/mechanicsM0CrossServiceGate.mjs", ["--require"], cleanEnv);
  assert.notEqual(required.status, 0);
});

test("M0 package is complete and preview is production-protected", () => {
  const base = "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline";
  for (const file of ["MechanicsCompatibilityBaseline.jsx", "MechanicsCompatibilityBaseline.view.jsx", "MechanicsCompatibilityBaseline.contract.js", "mechanicsCompatibilityBaseline.fixtures.js", "useMechanicsCompatibilityBaselineViewModel.js", "mechanicsCompatibilityBaselineDiagnostics.mjs", "mechanicsCompatibilityBaselineManifest.js", "mechanicsM0CrossServiceGate.mjs", "README.md"]) {
    assert.equal(fs.existsSync(path.resolve(repoRoot, base, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-compatibility-baseline/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const view = read(`${base}/MechanicsCompatibilityBaseline.view.jsx`);
  assert.doesNotMatch(view, /@\/lib\/(?:client|server|supabase)/);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /fetch\s*\(/);
});
