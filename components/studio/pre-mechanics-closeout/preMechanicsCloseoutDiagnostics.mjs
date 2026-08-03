import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { UNREGISTERED_DIAGNOSTIC_EXCLUSIONS } from "../loom-guardrails/loomGuardrailExclusions.mjs";
import {
  ACTIVE_MECHANICS_CALLERS,
  DEFERRED_MECHANICS_DIAGNOSTICS,
  MECHANICS_ASSESSMENT_STATUS,
  MECHANICS_ASSESSMENT_VERSION,
  MECHANICS_DOMAIN_MAP,
  PRIMARY_MECHANICS_FILES,
  PROPOSED_MECHANICS_PATCH_ORDER,
} from "./mechanicsAssessmentManifest.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");

function absolute(relativePath) {
  return path.join(repoRoot, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function countLines(relativePath) {
  return read(relativePath).split(/\r?\n/).length;
}

function walk(relativeDir) {
  const root = absolute(relativeDir);
  if (!fs.existsSync(root)) return [];

  const results = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) results.push(...walk(relativePath));
    else results.push(relativePath.replaceAll(path.sep, "/"));
  }
  return results;
}

function importingFiles(symbol) {
  return walk("components").filter((relativePath) => {
    if (!/\.(?:js|jsx|mjs)$/.test(relativePath)) return false;
    if (relativePath.endsWith("Diagnostics.mjs")) return false;
    const source = read(relativePath);
    return source.includes(`import ${symbol} from`) || source.includes(`<${symbol}`);
  });
}

test("pre-Mechanics closeout commands and assessment version are discoverable", () => {
  const packageJson = JSON.parse(read("package.json"));
  const cumulative =
    packageJson.scripts?.["diagnostics:loom:cumulative-validation"] || "";
  const closeout =
    packageJson.scripts?.["diagnostics:loom:pre-mechanics-closeout"] || "";

  assert.equal(
    MECHANICS_ASSESSMENT_VERSION,
    "crestfall.loom.mechanics-assessment.v15"
  );
  assert.equal(
    MECHANICS_ASSESSMENT_STATUS,
    "MECHANICS_DECOMPOSITION_CLOSED_READY_FOR_REPOSITORY_EXTRACTION"
  );
  assert.match(cumulative, /runLoomCumulativeDiagnostics\.mjs/);
  assert.match(closeout, /preMechanicsCloseoutDiagnostics\.mjs/);
  assert.match(closeout, /runLoomCumulativeDiagnostics\.mjs/);
});

test("primary Mechanics files remain classified during domain decomposition", () => {
  for (const file of PRIMARY_MECHANICS_FILES) {
    assert.equal(fs.existsSync(absolute(file.path)), true, file.path);
    const lineCount = countLines(file.path);
    assert.ok(
      lineCount >= file.expectedMinimumLines,
      `${file.path} unexpectedly changed below the assessed boundary`
    );
    if (Number.isFinite(file.expectedMaximumLines)) {
      assert.ok(
        lineCount <= file.expectedMaximumLines,
        `${file.path} did not reduce to the expected extracted boundary`
      );
    }
    assert.ok(file.classification.length > 10);
    assert.ok(file.decision.length > 40);
  }

  const mainEditor = read(PRIMARY_MECHANICS_FILES[0].path);
  assert.match(mainEditor, /export default function MechanicsModuleFieldsSection/);
  assert.match(mainEditor, /function replaceMechanicsData\(nextData\)/);
  assert.match(mainEditor, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
  assert.match(mainEditor, /MechanicsModuleAssembly/);
  assert.doesNotMatch(mainEditor, /useState|useEffect|window\.|document\./);
  assert.doesNotMatch(mainEditor, /MechanicsTrackersSection/);
  assert.doesNotMatch(mainEditor, /MechanicsCommandIdentitySection/);
  assert.doesNotMatch(mainEditor, /MechanicsDocumentOrchestrationControls/);

  const assemblyShell = read(PRIMARY_MECHANICS_FILES[1].path);
  assert.match(assemblyShell, /useMechanicsModuleAssemblyViewModel/);
  assert.match(assemblyShell, /MechanicsModuleAssemblyView/);
  assert.match(assemblyShell, /MechanicsTrackersSection/);
  assert.match(assemblyShell, /MechanicsCommandIdentitySection/);
  assert.match(assemblyShell, /MechanicsCommandInvocationSection/);
  assert.match(assemblyShell, /MechanicsCommandArgumentsSection/);
  assert.match(assemblyShell, /MechanicsCommandTriggersSection/);
  assert.match(assemblyShell, /MechanicsCommandOutcomes/);
  assert.match(assemblyShell, /MechanicsCommandRequirements/);
  assert.match(assemblyShell, /MechanicsCommandEffects/);
  assert.match(assemblyShell, /MechanicsCommandEffectCard/);
  assert.match(assemblyShell, /MechanicsCommandDomainActions/);
  assert.match(assemblyShell, /MechanicsCommandResolution/);
  assert.match(assemblyShell, /MechanicsDefaults/);
  assert.match(assemblyShell, /MechanicsStatusBlocks/);
  assert.match(assemblyShell, /MechanicsGuards/);
  assert.doesNotMatch(assemblyShell, /MechanicsPresetApplicationModal/);
  assert.doesNotMatch(assemblyShell, /MechanicsJsonEditorModal/);
  assert.doesNotMatch(assemblyShell, /const GUARD_ENFORCEMENTS/);
  assert.doesNotMatch(assemblyShell, /const STATUS_BLOCK_PLACEMENTS/);
  assert.doesNotMatch(assemblyShell, /const MECHANICS_DEFAULT_BUCKETS/);
  assert.doesNotMatch(assemblyShell, /function ResolutionModifierList/);
  assert.doesNotMatch(assemblyShell, /function normalizeEffectForType/);
  assert.doesNotMatch(assemblyShell, /COMMAND_DOMAIN_ACTION_TYPES/);
  assert.doesNotMatch(assemblyShell, /LOCATION_TRAVEL_OPERATIONS/);
  assert.doesNotMatch(assemblyShell, /COMMAND_REQUIREMENT_TYPES/);

  const progressionShell = read(PRIMARY_MECHANICS_FILES[3].path);
  assert.match(progressionShell, /useMechanicsProgressionProfileViewModel/);
  assert.match(progressionShell, /MechanicsProgressionProfileFieldsView/);
});

test("active Mechanics callers match the frozen caller inventory", () => {
  const fieldsCallers = importingFiles("MechanicsModuleFieldsSection").filter(
    (relativePath) => !relativePath.endsWith("MechanicsModuleFieldsSection.jsx")
  );
  assert.deepEqual(
    fieldsCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.mechanicsModuleFields].sort()
  );

  const assemblyCallers = importingFiles("MechanicsModuleAssembly").filter(
    (relativePath) => !relativePath.endsWith("MechanicsModuleAssembly.jsx")
  );
  assert.deepEqual(
    assemblyCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.moduleAssembly].sort()
  );

  const trackerCallers = importingFiles("MechanicsTrackersSection").filter(
    (relativePath) => !relativePath.endsWith("MechanicsTrackersSection.jsx")
  );
  assert.deepEqual(
    trackerCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.trackersSection].sort()
  );

  const commandCoreCallers = importingFiles("MechanicsCommandIdentitySection").filter(
    (relativePath) => !relativePath.endsWith("MechanicsCommandCore.jsx")
  );
  assert.deepEqual(
    commandCoreCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.commandCore].sort()
  );

  const commandOutcomeCallers = importingFiles("MechanicsCommandOutcomes").filter(
    (relativePath) => !relativePath.endsWith("MechanicsCommandOutcomes.jsx")
  );
  assert.deepEqual(
    commandOutcomeCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.commandOutcomes].sort()
  );

  const commandRequirementCallers = importingFiles("MechanicsCommandRequirements").filter(
    (relativePath) => !relativePath.endsWith("MechanicsCommandRequirements.jsx")
  );
  assert.deepEqual(
    commandRequirementCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.commandRequirements].sort()
  );

  const commandEffectCallers = importingFiles("MechanicsCommandEffects").filter(
    (relativePath) => !relativePath.endsWith("MechanicsCommandEffects.jsx")
  );
  assert.deepEqual(
    commandEffectCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.commandEffects].sort()
  );

  const commandDomainActionCallers = importingFiles(
    "MechanicsCommandDomainActions"
  ).filter(
    (relativePath) =>
      !relativePath.endsWith("MechanicsCommandDomainActions.jsx")
  );
  assert.deepEqual(
    commandDomainActionCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.commandDomainActions].sort()
  );

  const commandResolutionCallers = importingFiles(
    "MechanicsCommandResolution"
  ).filter(
    (relativePath) =>
      !relativePath.endsWith("MechanicsCommandResolution.jsx")
  );
  assert.deepEqual(
    commandResolutionCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.commandResolution].sort()
  );

  const defaultsCallers = importingFiles("MechanicsDefaults").filter(
    (relativePath) => !relativePath.endsWith("MechanicsDefaults.jsx")
  );
  assert.deepEqual(
    defaultsCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.defaultsSection].sort()
  );

  const statusBlockCallers = importingFiles("MechanicsStatusBlocks").filter(
    (relativePath) => !relativePath.endsWith("MechanicsStatusBlocks.jsx")
  );
  assert.deepEqual(
    statusBlockCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.statusBlocksSection].sort()
  );

  const guardCallers = importingFiles("MechanicsGuards").filter(
    (relativePath) => !relativePath.endsWith("MechanicsGuards.jsx")
  );
  assert.deepEqual(
    guardCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.guardsSection].sort()
  );

  const orchestrationCallers = importingFiles(
    "MechanicsDocumentOrchestrationControls"
  ).filter(
    (relativePath) =>
      !relativePath.endsWith("MechanicsDocumentOrchestration.jsx")
  );
  assert.deepEqual(
    orchestrationCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.documentOrchestration].sort()
  );

  const progressionCallers = importingFiles(
    "MechanicsProgressionProfileFields"
  ).filter(
    (relativePath) =>
      !relativePath.endsWith("MechanicsProgressionProfileFields.jsx")
  );
  assert.deepEqual(
    progressionCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.progressionProfile].sort()
  );

  const runtimeCallers = importingFiles("RuntimeMechanicsModulesSection").filter(
    (relativePath) => !relativePath.endsWith("RuntimeMechanicsModulesSection.jsx")
  );
  assert.deepEqual(
    runtimeCallers.sort(),
    [...ACTIVE_MECHANICS_CALLERS.runtimeAttachments].sort()
  );
});

test("the legacy Trackers modal remains unreferenced and quarantined", () => {
  const callers = importingFiles("TrackersModuleConfigModal").filter(
    (relativePath) => !relativePath.endsWith("TrackersModuleConfigModal.jsx")
  );
  assert.deepEqual(callers, ACTIVE_MECHANICS_CALLERS.trackersModal);

  const assessment = PRIMARY_MECHANICS_FILES.find((item) =>
    item.path.endsWith("TrackersModuleConfigModal.jsx")
  );
  assert.equal(
    assessment?.classification,
    "QUARANTINED_UNREFERENCED_LEGACY_OR_FUTURE"
  );
  assert.match(assessment?.decision || "", /Do not delete or convert by assumption/);
});

test("create and edit workflows preserve atomic whole-data replacement", () => {
  const createViewModel = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/useMechanicsModuleBuilderViewModel.js"
  );
  const editComposition = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
  );
  const fields = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx"
  );

  assert.match(createViewModel, /function replaceMechanicsData\(nextData\)/);
  assert.match(createViewModel, /data:\s*normalizeMechanicsDocument\(nextData\)/);
  assert.match(createViewModel, /replaceData:\s*replaceMechanicsData/);
  assert.match(editComposition, /replaceData=\{\(nextData\)\s*=>\s*updateField\("data", nextData\)/s);
  assert.match(fields, /const canReplaceData = typeof replaceData === "function"/);
  assert.match(fields, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
  assert.match(fields, /onReplaceMechanicsData=\{replaceMechanicsData\}/);
  assert.doesNotMatch(fields, /onApply=\{\(nextData/);
});

test("compatibility, preset freeze, and saved-asset migration evidence remains present", () => {
  const required = [
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mechanicsCompatibilityBaselineManifest.js",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mechanicsPresetFreezeManifest.js",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mechanicsPresetExtensionFreezeManifest.js",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc8LegacyMechanicsFixtures.js",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc8RegressionBaseline.mjs",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-saved-asset-migration/mechanicsSavedAssetMigration.js",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-saved-asset-migration/mc8SavedAssetMigrationDiagnostics.mjs",
  ];

  for (const relativePath of required) {
    assert.equal(fs.existsSync(absolute(relativePath)), true, relativePath);
  }
});

test("the Mechanics domain map and proposed extraction sequence are domain-sized", () => {
  assert.ok(MECHANICS_DOMAIN_MAP.length >= 18);
  assert.equal(new Set(MECHANICS_DOMAIN_MAP).size, MECHANICS_DOMAIN_MAP.length);
  assert.equal(PROPOSED_MECHANICS_PATCH_ORDER.length, 9);
  assert.deepEqual(
    PROPOSED_MECHANICS_PATCH_ORDER.map((item) => item.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
  );
  assert.match(PROPOSED_MECHANICS_PATCH_ORDER[0].name, /Compatibility Freeze/);
  assert.match(PROPOSED_MECHANICS_PATCH_ORDER.at(-1).name, /Parent Assembly/);
});

test("deferred Mechanics cross-service diagnostics remain explicit and unregistered", () => {
  const packageJson = JSON.parse(read("package.json"));
  const commands = Object.values(packageJson.scripts || {}).join("\n");
  const exclusions = new Map(
    UNREGISTERED_DIAGNOSTIC_EXCLUSIONS.map((item) => [item.path, item])
  );

  assert.equal(DEFERRED_MECHANICS_DIAGNOSTICS.length, 3);
  for (const relativePath of DEFERRED_MECHANICS_DIAGNOSTICS) {
    assert.equal(fs.existsSync(absolute(relativePath)), true, relativePath);
    assert.equal(commands.includes(relativePath), false, relativePath);
    assert.match(exclusions.get(relativePath)?.category || "", /mechanics-cross-service/);
  }
});

test("pre-Mechanics closeout package contains diagnostics and documentation only", () => {
  const files = fs
    .readdirSync(absolute("components/studio/pre-mechanics-closeout"))
    .sort();

  assert.deepEqual(files, [
    "MECHANICS_ABSTRACTION_ASSESSMENT.md",
    "MECHANICS_REPOSITORY_EXTRACTION_CLOSEOUT.md",
    "README.md",
    "mechanicsAssessmentManifest.mjs",
    "mechanicsRepositoryExtractionDiagnostics.mjs",
    "mechanicsRepositoryExtractionManifest.mjs",
    "preMechanicsCloseoutDiagnostics.mjs",
    "runLoomCumulativeDiagnostics.mjs",
  ]);
});
