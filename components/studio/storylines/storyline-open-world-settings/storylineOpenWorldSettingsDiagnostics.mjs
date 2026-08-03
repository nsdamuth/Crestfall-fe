import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Storyline Open-World Settings shell stays thin", () => {
  const shell = read(
    "components/studio/storylines/StorylineOpenWorldSettings.jsx"
  );
  assert.match(shell, /useStorylineOpenWorldSettingsViewModel/);
  assert.match(shell, /StorylineOpenWorldSettingsView/);
  assert.doesNotMatch(
    shell,
    /normalizeStorylineData|STORYLINE_TRANSITION_POLICIES|openWorld\s*:/
  );
});

test("ViewModel owns Storyline normalization and immutable openWorld merging", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-open-world-settings/useStorylineOpenWorldSettingsViewModel.js"
  );
  assert.match(viewModel, /normalizeStorylineData/);
  assert.match(viewModel, /STORYLINE_TRANSITION_POLICIES/);
  assert.match(viewModel, /policy !== "COMPLETE_STORYLINE"/);
  assert.match(viewModel, /openWorld:\s*\{/);
  assert.match(viewModel, /\.\.\.openWorld/);
  assert.match(viewModel, /onChange\?\.\(\{/);
  assert.doesNotMatch(viewModel, /<select|<textarea|<Globe2/);
});

test("portable View receives display-ready values and semantic callbacks only", () => {
  const view = read(
    "components/studio/storylines/storyline-open-world-settings/StorylineOpenWorldSettings.view.jsx"
  );
  assert.match(view, /defaultTransitionOptions\.map/);
  assert.match(view, /onChangeDefaultTransition/);
  assert.match(view, /onChangeGuidance/);
  assert.match(view, /onChangePressureCadence/);
  assert.doesNotMatch(
    view,
    /normalizeStorylineData|STORYLINE_TRANSITION_POLICIES|onChange\?\.\(\{/
  );
  assert.doesNotMatch(view, /form|updateDataField|fetch\(/);
});

test("all existing open-world copy and controls remain represented", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-open-world-settings/useStorylineOpenWorldSettingsViewModel.js"
  );
  const view = read(
    "components/studio/storylines/storyline-open-world-settings/StorylineOpenWorldSettings.view.jsx"
  );
  for (const text of [
    "Open-World Interludes",
    "Default Transition",
    "Continuity Always Preserved",
    "Open-World Guidance",
    "Pressure Cadence Guidance",
  ]) {
    assert.match(`${viewModel}\n${view}`, new RegExp(text));
  }
});

test("contract and fixtures cover configured, default, and legacy inputs", () => {
  const contract = read(
    "components/studio/storylines/storyline-open-world-settings/StorylineOpenWorldSettings.contract.js"
  );
  const fixtures = read(
    "components/studio/storylines/storyline-open-world-settings/StorylineOpenWorldSettings.fixtures.js"
  );
  assert.match(contract, /STORYLINE_OPEN_WORLD_SETTINGS_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /StorylineTransitionOption/);
  assert.match(contract, /onChangePressureCadence/);
  assert.match(fixtures, /storylineOpenWorldConfiguredFixture/);
  assert.match(fixtures, /storylineOpenWorldDefaultFixture/);
  assert.match(fixtures, /storylineOpenWorldLegacyFixture/);
  assert.match(fixtures, /open_world/);
});

test("development preview exercises the actual Binding Shell", () => {
  const page = read(
    "app/dev/ui-preview/storyline-open-world-settings/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/storyline-open-world-settings/StorylineOpenWorldSettingsPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StorylineOpenWorldSettings/);
  assert.match(preview, /storylineOpenWorldConfiguredFixture/);
  assert.match(preview, /storylineOpenWorldLegacyFixture/);
  assert.match(preview, /Last normalized payload/);
});

test("Storyline integration, documentation, and diagnostic command remain explicit", () => {
  const fieldsShell = read(
    "components/studio/my-creations/edit/sections/storylines/StorylineFieldsSection.jsx"
  );
  const readme = read(
    "components/studio/storylines/storyline-open-world-settings/README.md"
  );
  const packageJson = read("package.json");
  assert.match(fieldsShell, /StorylineOpenWorldSettings/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /COMPLETE_STORYLINE/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/storyline-open-world-settings/);
  assert.match(packageJson, /diagnostics:loom:storyline-open-world-settings/);
});
