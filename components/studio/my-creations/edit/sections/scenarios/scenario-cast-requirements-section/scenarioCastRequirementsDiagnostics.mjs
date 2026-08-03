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

test("Scenario cast Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/my-creations/edit/sections/scenarios/ScenarioCastRequirementsSection.jsx"
  );

  assert.match(shell, /useScenarioCastRequirementsSectionViewModel/);
  assert.match(shell, /<ScenarioCastRequirementsSectionView \{\.\.\.viewProps\}/);
  assert.match(shell, /<ScenarioReferencePickerModal \{\.\.\.referencePickerProps\}/);
  assert.doesNotMatch(shell, /\bfetch\s*\(/);
});

test("portable Scenario cast View is API and persistence free", () => {
  const view = readFeature("ScenarioCastRequirementsSection.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile/);
  assert.doesNotMatch(
    view,
    /updateDataField|boundRegistries|boundRegistryLinks|required_characters/
  );
  assert.doesNotMatch(view, /ScenarioReferencePickerModal/);
});

test("Scenario cast ViewModel uses the existing creation client", () => {
  const viewModel = readFeature(
    "useScenarioCastRequirementsSectionViewModel.js"
  );

  assert.match(viewModel, /fetchOwnedCreations/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Scenario cast ViewModel preserves reference and registry storage rules", () => {
  const viewModel = readFeature(
    "useScenarioCastRequirementsSectionViewModel.js"
  );

  for (const field of [
    "required_characters",
    "optional_characters",
    "suggested_location",
    "suggested_narrator",
    "suggested_npc_registries",
    "boundRegistries",
    "boundRegistryLinks",
  ]) {
    assert.match(viewModel, new RegExp(field));
  }

  assert.match(viewModel, /item\.type !== "PLAYER_CHARACTER"/);
  assert.match(viewModel, /buildScenarioRegistryBindingState/);
  assert.match(viewModel, /getScenarioRegistrySelection/);
});

test("creation client supports the Scenario-specific load fallback", () => {
  const client = readRepo("lib/client/studio/creations/creationClient.js");

  assert.match(
    client,
    /fetchOwnedCreations\([\s\S]*fallbackMessage = "Creations could not be loaded\."/
  );
});

test("fixtures match the portable field contract", () => {
  const fixtures = readFeature("ScenarioCastRequirementsSection.fixtures.js");

  assert.match(fixtures, /scenarioCastRequirementsDefaultFixture/);
  assert.match(fixtures, /scenarioCastRequirementsEmptyFixture/);
  assert.match(fixtures, /scenarioCastRequirementsErrorFixture/);
  assert.match(fixtures, /selectedItems/);
  assert.match(fixtures, /onOpen/);
  assert.match(fixtures, /onRemove/);
});

test("Scenario cast preview route is development-only", () => {
  const page = readRepo(
    "app/dev/ui-preview/scenario-cast-requirements/page.jsx"
  );
  const preview = readRepo(
    "app/dev/ui-preview/scenario-cast-requirements/ScenarioCastRequirementsPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /ScenarioCastRequirementsSectionView/);
  assert.doesNotMatch(preview, /\bfetch\s*\(|\/api\//);
});
