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

test("Scenario Middleware Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/my-creations/edit/sections/scenarios/ScenarioMiddlewareSection.jsx"
  );

  assert.match(shell, /useScenarioMiddlewareSectionViewModel/);
  assert.match(shell, /<ScenarioMiddlewareSectionView \{\.\.\.viewProps\}/);
  assert.doesNotMatch(shell, /form\.data|middleware_modules|updateDataField\?\.\(/);
});

test("Scenario Middleware View is API and persistence free", () => {
  const view = readFeature("ScenarioMiddlewareSection.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile/);
  assert.doesNotMatch(view, /middleware_modules|updateDataField|form\.data/);
  assert.match(view, /module\.onToggle\?\.\(\)/);
  assert.match(view, /aria-pressed=\{module\.isEnabled\}/);
});

test("Scenario Middleware ViewModel owns defaults and storage mapping", () => {
  const viewModel = readFeature("useScenarioMiddlewareSectionViewModel.js");

  assert.match(viewModel, /form\?\.data\?\.middleware_modules/);
  assert.match(viewModel, /updateDataField\?\.\("middleware_modules"/);
  for (const moduleId of [
    "phase_gates",
    "reward_gates",
    "knowledge_boundaries",
    "hidden_media_unlocks",
    "time_weather",
    "recap_support",
  ]) {
    assert.match(viewModel, new RegExp(`id: "${moduleId}"`));
  }
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Scenario Middleware contract and fixtures cover key visual states", () => {
  const contract = readFeature("ScenarioMiddlewareSection.contract.js");
  const fixtures = readFeature("ScenarioMiddlewareSection.fixtures.js");

  assert.match(contract, /SCENARIO_MIDDLEWARE_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /ScenarioMiddlewareModuleViewModel/);
  assert.match(fixtures, /scenarioMiddlewareDefaultsFixture/);
  assert.match(fixtures, /scenarioMiddlewareAllEnabledFixture/);
  assert.match(fixtures, /scenarioMiddlewareAllDisabledFixture/);
  assert.match(fixtures, /scenarioMiddlewareCustomConfigurationFixture/);
  assert.match(fixtures, /scenarioMiddlewareMissingCallbacksFixture/);
});

test("Scenario Middleware preview is development-only", () => {
  const page = readRepo("app/dev/ui-preview/scenario-middleware-section/page.jsx");
  const preview = readRepo(
    "app/dev/ui-preview/scenario-middleware-section/ScenarioMiddlewareSectionPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /ScenarioMiddlewareSectionView/);
});

test("Creation Edit retains the public Scenario Middleware Shell", () => {
  const editShell = readRepo("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");

  assert.match(editShell, /import ScenarioMiddlewareSection from/);
  assert.match(editShell, /<ScenarioMiddlewareSection/);
});

test("Scenario Middleware package includes its documented handoff", () => {
  const readme = readFeature("README.md");

  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /form\.data\.middleware_modules/);
  assert.match(readme, /\/dev\/ui-preview\/scenario-middleware-section/);
});
