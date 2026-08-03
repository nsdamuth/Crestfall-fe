import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_PROGRESSION_PROFILE_PHASE,
  MECHANICS_PROGRESSION_PROFILE_STATUS,
  MECHANICS_PROGRESSION_PROFILE_STORAGE_PATHS,
  MECHANICS_PROGRESSION_PROFILE_VIEW_CONTRACT_VERSION,
} from "./MechanicsProgressionProfileFields.contract.js";
import { listMechanicsProgressionProfileFixtures } from "./MechanicsProgressionProfileFields.fixtures.js";
import {
  addMechanicsProgressionDerivedValue,
  addMechanicsProgressionOverride,
  patchMechanicsProgressionCurve,
  patchMechanicsProgressionDerivedValue,
  patchMechanicsProgressionOverride,
  patchMechanicsProgressionProfile,
  removeMechanicsProgressionDerivedValue,
  removeMechanicsProgressionOverride,
} from "./mechanicsProgressionProfileOperations.js";
import {
  generateMechanicsProgressionTable,
  normalizeMechanicsProgressionProfileBuilder,
  resolveMechanicsProgressionDerivedValue,
} from "../mechanicsProgressionProfileBuilder.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../../../..");
const shellPath = path.join(here, "MechanicsProgressionProfileFields.jsx");
const viewPath = path.join(here, "MechanicsProgressionProfileFields.view.jsx");
const viewModelPath = path.join(here, "useMechanicsProgressionProfileViewModel.js");
const effectsShellPath = path.join(here, "../mechanics-command-effects/MechanicsCommandEffects.jsx");
const compositionShellPath = path.join(
  here,
  "../mechanics-composition-builder/MechanicsCompositionBuilder.jsx"
);
const compositionViewPath = path.join(
  here,
  "../mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx"
);
const previewPagePath = path.join(
  repoRoot,
  "app/dev/ui-preview/mechanics-progression-profile/page.jsx"
);
const compositionPreviewClientPath = path.join(
  repoRoot,
  "app/dev/ui-preview/mechanics-composition-builder/MechanicsCompositionBuilderPreviewClient.jsx"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const assessmentManifestPath = path.join(
  repoRoot,
  "components/studio/pre-mechanics-closeout/mechanicsAssessmentManifest.mjs"
);

const read = (filePath) => fs.readFileSync(filePath, "utf8");

test("M3 contract freezes the shared progression-profile boundary", () => {
  assert.equal(
    MECHANICS_PROGRESSION_PROFILE_VIEW_CONTRACT_VERSION,
    "crestfall.loom.mechanics-progression-profile.v1"
  );
  assert.equal(MECHANICS_PROGRESSION_PROFILE_PHASE, "M3");
  assert.equal(
    MECHANICS_PROGRESSION_PROFILE_STATUS,
    "SHARED_EFFECT_DOMAIN_PACKAGE"
  );
  assert.deepEqual(MECHANICS_PROGRESSION_PROFILE_STORAGE_PATHS, [
    "instanceData.commands[].effects[].progressionProfile",
    "instanceData.commands[].composition.mechanicsSteps[].effects[].progressionProfile",
  ]);
});

test("current, override, explicit, legacy, and recoverable fixtures normalize", () => {
  const fixtures = listMechanicsProgressionProfileFixtures();
  assert.equal(fixtures.length, 5);
  fixtures.forEach((fixture) => {
    assert.equal(typeof fixture.normalized, "object");
    assert.equal(fixture.normalized.version, "mechanics_progression_profile_v1");
  });
  const explicit = fixtures.find((fixture) => fixture.id === "explicit").normalized;
  assert.deepEqual(
    explicit.derivedValues[0].rows[0].futureRowMetadata,
    { retained: true }
  );
  const recoverable = fixtures.find((fixture) => fixture.id === "recoverable").normalized;
  assert.equal(recoverable.id, "bad_progression_id");
  assert.equal(recoverable.mode, "GENERATED_CURVE");
  assert.equal(recoverable.startingRank, 20);
  assert.equal(recoverable.endingRank, 21);
  assert.equal(recoverable.overrides.length, 0);
  assert.equal(recoverable.derivedValues[0].increaseEveryRanks, 1);
});

test("legacy aliases and unknown metadata survive normalization", () => {
  const legacy = listMechanicsProgressionProfileFixtures().find(
    (fixture) => fixture.id === "legacy"
  ).normalized;
  assert.equal(legacy.id, "legacy_advancement");
  assert.equal(legacy.sourceValueId, "legacy_xp");
  assert.equal(legacy.rankValueId, "legacy_level");
  assert.equal(legacy.advancementCounterId, "legacy_level_ups");
  assert.equal(legacy.allowRankDecrease, true);
  assert.equal(legacy.maximumPolicy, "CAP_AT_MAXIMUM_THRESHOLD");
  assert.deepEqual(legacy.futureProfileMetadata, { retained: true });
  assert.deepEqual(legacy.curve.futureCurveMetadata, { retained: true });
  assert.deepEqual(legacy.derivedValues[0].futureDerivedMetadata, {
    retained: true,
  });
});

test("normalization is idempotent and generated thresholds remain monotonic", () => {
  const profile = listMechanicsProgressionProfileFixtures().find(
    (fixture) => fixture.id === "generated"
  ).profile;
  const once = normalizeMechanicsProgressionProfileBuilder(profile);
  const twice = normalizeMechanicsProgressionProfileBuilder(once);
  assert.deepEqual(twice, once);
  const table = generateMechanicsProgressionTable(once);
  assert.ok(table.length > 1);
  table.slice(1).forEach((row, index) => {
    assert.ok(row.totalRequirement > table[index].totalRequirement);
  });
  assert.equal(
    resolveMechanicsProgressionDerivedValue(
      once.derivedValues[0],
      5,
      once.startingRank
    ),
    3
  );
});

test("immutable progression operations preserve unrelated metadata", () => {
  const source = listMechanicsProgressionProfileFixtures().find(
    (fixture) => fixture.id === "overrides"
  ).profile;
  const patched = patchMechanicsProgressionProfile(source, {
    label: "Updated Renown",
  });
  const curved = patchMechanicsProgressionCurve(patched, {
    linearIncrease: 333,
  });
  const withOverride = addMechanicsProgressionOverride(curved);
  const existingOverrideIndex = withOverride.overrides.findIndex(
    (entry) => entry.id === "rank_5_override"
  );
  const generatedOverrideIndex = withOverride.overrides.findIndex(
    (entry) => entry.id !== "rank_5_override"
  );
  const updatedOverride = patchMechanicsProgressionOverride(
    withOverride,
    existingOverrideIndex,
    { requirement: 3000 }
  );
  const withoutOverride = removeMechanicsProgressionOverride(
    updatedOverride,
    generatedOverrideIndex
  );
  const withDerived = addMechanicsProgressionDerivedValue(withoutOverride);
  const updatedDerived = patchMechanicsProgressionDerivedValue(
    withDerived,
    0,
    { label: "Renown Bonus" }
  );
  const withoutDerived = removeMechanicsProgressionDerivedValue(
    updatedDerived,
    updatedDerived.derivedValues.length - 1
  );

  assert.equal(source.label, "Renown Progression");
  assert.equal(withoutDerived.label, "Updated Renown");
  assert.equal(withoutDerived.curve.linearIncrease, 333);
  assert.equal(withoutDerived.overrides[0].requirement, 3000);
  assert.deepEqual(withoutDerived.futureProfileMetadata, { retained: true });
  assert.deepEqual(withoutDerived.curve.futureCurveMetadata, { retained: true });
  assert.deepEqual(withoutDerived.overrides[0].futureOverrideMetadata, {
    retained: true,
  });
});

test("both active Mechanics effect-authoring shells mount the progression Binding Shell", () => {
  const effectsShell = read(effectsShellPath);
  const compositionShell = read(compositionShellPath);
  const compositionView = read(compositionViewPath);

  assert.match(effectsShell, /import MechanicsProgressionProfileFields from/);
  assert.match(
    effectsShell,
    /ProgressionProfileFieldsComponent=\{MechanicsProgressionProfileFields\}/
  );
  assert.match(compositionShell, /import MechanicsProgressionProfileFields from/);
  assert.match(
    compositionShell,
    /ProgressionProfileFieldsComponent=\{MechanicsProgressionProfileFields\}/
  );
  assert.doesNotMatch(
    compositionView,
    /import MechanicsProgressionProfileFields from/
  );
  assert.match(compositionView, /ProgressionProfileFieldsComponent/);
});

test("the portable progression View owns no normalization or application access", () => {
  const source = read(viewPath);
  assert.doesNotMatch(source, /next\/link|next\/navigation/);
  assert.doesNotMatch(source, /@\/lib\/(client|server|supabase)/);
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.doesNotMatch(source, /mechanicsProgressionProfileBuilder/);
  assert.match(source, /Starting Requirement/);
  assert.match(source, /Curve Method/);
  assert.match(source, /Generated Threshold Preview/);
  assert.match(source, /derivedMethodOptions = \[\]/);
  assert.match(source, /roundingOptions = \[\]/);
});

test("the progression Binding Shell composes the ViewModel and portable View", () => {
  const shell = read(shellPath);
  const viewModel = read(viewModelPath);
  assert.match(shell, /useMechanicsProgressionProfileViewModel/);
  assert.match(shell, /MechanicsProgressionProfileFieldsView/);
  assert.match(viewModel, /generateMechanicsProgressionTable/);
  assert.match(viewModel, /resolveMechanicsProgressionDerivedValue/);
  assert.match(viewModel, /patchMechanicsProgressionProfile/);
});

test("the M3 preview is explicitly unavailable in production", () => {
  const source = read(previewPagePath);
  const compositionPreview = read(compositionPreviewClientPath);
  assert.match(source, /process\.env\.NODE_ENV === "production"/);
  assert.match(source, /notFound\(\)/);
  assert.match(compositionPreview, /MechanicsProgressionProfileFields/);
  assert.match(
    compositionPreview,
    /ProgressionProfileFieldsComponent=\{MechanicsProgressionProfileFields\}/
  );
});

test("the M3 diagnostic command is registered", () => {
  const packageJson = JSON.parse(read(packageJsonPath));
  assert.equal(
    packageJson.scripts["diagnostics:loom:mechanics-m3"],
    "node --test components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/mechanicsProgressionProfileDiagnostics.mjs"
  );
});

test("the Mechanics assessment continues to record the M3 extracted boundary", () => {
  const source = read(assessmentManifestPath);
  assert.match(source, /crestfall\.loom\.mechanics-assessment\.v15/);
  assert.match(source, /MECHANICS_DECOMPOSITION_CLOSED_READY_FOR_REPOSITORY_EXTRACTION/);
  assert.match(source, /SHARED_PROGRESSION_DOMAIN_BINDING_SHELL/);
});

test("M3 remains scoped away from standalone Progression Assets and services", () => {
  const changedPackageSources = [
    read(shellPath),
    read(viewPath),
    read(viewModelPath),
    read(path.join(here, "mechanicsProgressionProfileOperations.js")),
  ].join("\n");
  assert.doesNotMatch(changedPackageSources, /create\/progression/);
  assert.doesNotMatch(changedPackageSources, /services-api|engine-middleware|PostGraphile/i);
});
