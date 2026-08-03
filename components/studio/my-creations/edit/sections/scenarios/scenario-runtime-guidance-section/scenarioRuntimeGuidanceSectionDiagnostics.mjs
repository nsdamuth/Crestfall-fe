import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../../../..");

function readFeature(fileName) {
  return fs.readFileSync(path.join(here, fileName), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Scenario Runtime Guidance Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/my-creations/edit/sections/scenarios/ScenarioRuntimeGuidanceSection.jsx"
  );

  assert.match(shell, /useScenarioRuntimeGuidanceSectionViewModel/);
  assert.match(shell, /<ScenarioRuntimeGuidanceSectionView \{\.\.\.viewProps\}/);
  assert.doesNotMatch(shell, /form\.data|opening_scene|updateDataField\?\.\(/);
});

test("Scenario Runtime Guidance View is API and persistence free", () => {
  const view = readFeature("ScenarioRuntimeGuidanceSection.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile/);
  assert.doesNotMatch(
    view,
    /opening_scene|opening_messages|private_runtime_guidance|drift_fixes|failure_handling|updateDataField|form\.data/
  );
  assert.match(view, /onOpeningSceneChange\?\.\(value\)/);
  assert.match(view, /onFailureHandlingChange\?\.\(value\)/);
});

test("Scenario Runtime Guidance ViewModel owns storage mapping", () => {
  const viewModel = readFeature(
    "useScenarioRuntimeGuidanceSectionViewModel.js"
  );

  for (const fieldName of [
    "opening_scene",
    "opening_messages",
    "private_runtime_guidance",
    "drift_fixes",
    "failure_handling",
  ]) {
    assert.match(viewModel, new RegExp(fieldName));
    assert.match(
      viewModel,
      new RegExp(`updateDataField\\?\\.\\(\\"${fieldName}\\"`)
    );
  }
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Scenario Runtime Guidance contract and fixtures cover visual states", () => {
  const contract = readFeature("ScenarioRuntimeGuidanceSection.contract.js");
  const fixtures = readFeature("ScenarioRuntimeGuidanceSection.fixtures.js");

  assert.match(
    contract,
    /SCENARIO_RUNTIME_GUIDANCE_SECTION_VIEW_CONTRACT_VERSION/
  );
  assert.match(contract, /ScenarioRuntimeGuidanceSectionViewProps/);
  assert.match(fixtures, /scenarioRuntimeGuidancePopulatedFixture/);
  assert.match(fixtures, /scenarioRuntimeGuidanceEmptyFixture/);
  assert.match(fixtures, /scenarioRuntimeGuidanceLongCopyFixture/);
  assert.match(fixtures, /scenarioRuntimeGuidanceMissingCallbacksFixture/);
});

test("Scenario Runtime Guidance preview is development-only", () => {
  const page = readRepo(
    "app/dev/ui-preview/scenario-runtime-guidance-section/page.jsx"
  );
  const preview = readRepo(
    "app/dev/ui-preview/scenario-runtime-guidance-section/ScenarioRuntimeGuidanceSectionPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /ScenarioRuntimeGuidanceSectionView/);
});

test("Creation Edit retains the public Scenario Runtime Guidance Shell", () => {
  const editShell = readRepo(
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
  );

  assert.match(editShell, /import ScenarioRuntimeGuidanceSection from/);
  assert.match(editShell, /<ScenarioRuntimeGuidanceSection/);
});

test("Scenario Runtime Guidance package includes its documented handoff", () => {
  const readme = readFeature("README.md");

  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /form\.data\.private_runtime_guidance/);
  assert.match(
    readme,
    /\/dev\/ui-preview\/scenario-runtime-guidance-section/
  );
});
