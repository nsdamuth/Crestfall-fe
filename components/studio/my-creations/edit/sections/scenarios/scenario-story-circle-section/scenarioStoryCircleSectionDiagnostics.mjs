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

test("Scenario Story Circle Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/my-creations/edit/sections/scenarios/ScenarioStoryCircleSection.jsx"
  );

  assert.match(shell, /useScenarioStoryCircleSectionViewModel/);
  assert.match(shell, /<ScenarioStoryCircleSectionView \{\.\.\.viewProps\}/);
  assert.doesNotMatch(shell, /form\.data|story_circle|updateDataField\?\.\(/);
});

test("Scenario Story Circle View is API and persistence free", () => {
  const view = readFeature("ScenarioStoryCircleSection.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile/);
  assert.doesNotMatch(view, /story_circle|updateDataField|form\.data/);
  assert.match(view, /step\.onChange\?\.\(value\)/);
});

test("Scenario Story Circle ViewModel owns storage mapping and all eight steps", () => {
  const viewModel = readFeature("useScenarioStoryCircleSectionViewModel.js");

  assert.match(viewModel, /form\?\.data\?\.story_circle/);
  assert.match(viewModel, /updateDataField\?\.\("story_circle"/);
  for (const stepId of [
    "you",
    "need",
    "go",
    "search",
    "find",
    "take",
    "return",
    "change",
  ]) {
    assert.match(viewModel, new RegExp(`id: "${stepId}"`));
  }
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Scenario Story Circle contract and fixtures cover key visual states", () => {
  const contract = readFeature("ScenarioStoryCircleSection.contract.js");
  const fixtures = readFeature("ScenarioStoryCircleSection.fixtures.js");

  assert.match(contract, /SCENARIO_STORY_CIRCLE_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /ScenarioStoryCircleStepViewModel/);
  assert.match(fixtures, /scenarioStoryCircleCompleteFixture/);
  assert.match(fixtures, /scenarioStoryCircleEmptyFixture/);
  assert.match(fixtures, /scenarioStoryCirclePartialFixture/);
  assert.match(fixtures, /scenarioStoryCircleLongContentFixture/);
  assert.match(fixtures, /scenarioStoryCircleMissingCallbacksFixture/);
});

test("Scenario Story Circle preview is development-only", () => {
  const page = readRepo(
    "app/dev/ui-preview/scenario-story-circle-section/page.jsx"
  );
  const preview = readRepo(
    "app/dev/ui-preview/scenario-story-circle-section/ScenarioStoryCircleSectionPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /ScenarioStoryCircleSectionView/);
});

test("Creation Edit retains the public Scenario Story Circle Shell", () => {
  const editShell = readRepo("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");

  assert.match(editShell, /import ScenarioStoryCircleSection from/);
  assert.match(editShell, /<ScenarioStoryCircleSection/);
});

test("Scenario Story Circle package includes its documented handoff", () => {
  const readme = readFeature("README.md");

  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /form\.data\.story_circle/);
  assert.match(readme, /\/dev\/ui-preview\/scenario-story-circle-section/);
});
