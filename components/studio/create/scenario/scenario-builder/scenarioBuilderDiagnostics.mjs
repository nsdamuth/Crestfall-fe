import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Scenario Builder Shell remains a focused LOOM binding", () => {
  const shell = read("components/studio/create/scenario/ScenarioBuilderShell.jsx");
  assert.match(shell, /useScenarioBuilderViewModel/);
  assert.match(shell, /<ScenarioBuilderView/);
  assert.match(shell, /<ScenarioReferencePickerModal/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Scenario Builder View is API, persistence, and application-Shell free", () => {
  const view = read("components/studio/create/scenario/scenario-builder/ScenarioBuilder.view.jsx");
  assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createScenarioDraft|buildScenarioCreationPayload|router\./);
  assert.doesNotMatch(view, /import .*ScenarioReferencePickerModal/);
  assert.match(view, /referenceFields/);
});

test("Scenario Builder ViewModel owns references, registry bindings, payload, save, and navigation", () => {
  const viewModel = read("components/studio/create/scenario/scenario-builder/useScenarioBuilderViewModel.js");
  assert.match(viewModel, /fetchOwnedCreations/);
  assert.match(viewModel, /buildScenarioRegistryBindingState/);
  assert.match(viewModel, /buildScenarioCreationPayload/);
  assert.match(viewModel, /builder: "SCENARIO_BUILDER"/);
  assert.match(viewModel, /createScenarioDraft/);
  assert.match(viewModel, /router\.push/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Scenario client delegates creation through the shared creation client", () => {
  const client = read("lib/client/studio/scenarios/scenarioClient.js");
  assert.match(client, /createCreationDraft/);
  assert.match(client, /Scenario draft could not be saved\./);
  assert.doesNotMatch(client, /\bfetch\s*\(/);
});

test("Scenario Builder contract and fixtures cover key states", () => {
  const contract = read("components/studio/create/scenario/scenario-builder/ScenarioBuilder.contract.js");
  const fixtures = read("components/studio/create/scenario/scenario-builder/ScenarioBuilder.fixtures.js");
  assert.match(contract, /SCENARIO_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /referenceFields/);
  assert.match(fixtures, /scenarioBuilderConfiguredFixture/);
  assert.match(fixtures, /scenarioBuilderEmptyFixture/);
  assert.match(fixtures, /scenarioBuilderReferenceErrorFixture/);
  assert.match(fixtures, /scenarioBuilderSavingFixture/);
  assert.match(fixtures, /scenarioBuilderSavedFixture/);
  assert.match(fixtures, /scenarioBuilderErrorFixture/);
});

test("Scenario Builder preview is development-only", () => {
  const page = read("app/dev/ui-preview/scenario-builder/page.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create Scenario page retains the public ScenarioBuilderShell", () => {
  const page = read("app/studio/create/scenario/page.js");
  assert.match(page, /import ScenarioBuilderShell from "@\/components\/studio\/create\/scenario\/ScenarioBuilderShell"/);
  assert.match(page, /<ScenarioBuilderShell \/>/);
});
