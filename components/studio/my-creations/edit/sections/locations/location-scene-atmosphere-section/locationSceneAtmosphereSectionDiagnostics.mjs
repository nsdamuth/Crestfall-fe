import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Location Scene Atmosphere Shell stays thin and owns sensory composition", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/LocationSceneAtmosphereSection.jsx"
  );
  assert.match(shell, /useLocationSceneAtmosphereSectionViewModel/);
  assert.match(shell, /LocationSceneAtmosphereSectionView/);
  assert.match(shell, /LocationSensoryEnvironmentFields/);
  assert.match(shell, /sensoryEnvironmentSlot=/);
  assert.doesNotMatch(shell, /SharedFields/);
  assert.doesNotMatch(shell, /form\.data/);
  assert.doesNotMatch(shell, /updateDataField\?\.\(/);
});

test("Location Scene Atmosphere View is portable and semantic", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/LocationSceneAtmosphereSection.view.jsx"
  );
  assert.match(view, /SectionTitle/);
  assert.match(view, /TextField/);
  assert.match(view, /TextAreaField/);
  assert.match(view, /sensoryEnvironmentSlot/);
  assert.match(view, /onChangeMood/);
  assert.match(view, /onChangeSensoryNotes/);
  assert.doesNotMatch(view, /form\b/);
  assert.doesNotMatch(view, /updateDataField/);
  assert.doesNotMatch(view, /LocationSensoryEnvironmentFields/);
  assert.doesNotMatch(view, /sensory_profile/);
});

test("Location Scene Atmosphere ViewModel owns legacy reads and canonical writes", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/useLocationSceneAtmosphereSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeLocationSceneAtmosphereData/);
  assert.match(viewModel, /source\.mood \|\| source\.atmosphere/);
  assert.match(viewModel, /source\.weather \|\| source\.conditions/);
  assert.match(
    viewModel,
    /source\.sensoryProfile \|\| source\.sensory_profile/
  );
  assert.match(viewModel, /updateDataField\?\.\("mood"/);
  assert.match(viewModel, /updateDataField\?\.\("weather"/);
  assert.match(viewModel, /updateDataField\?\.\("sensoryProfile"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Scene Atmosphere contract and fixtures cover canonical and legacy states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/LocationSceneAtmosphereSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/LocationSceneAtmosphereSection.fixtures.js"
  );
  assert.match(
    contract,
    /LOCATION_SCENE_ATMOSPHERE_SECTION_VIEW_CONTRACT_VERSION/
  );
  assert.match(contract, /legacyReadFields/);
  assert.match(contract, /atmosphere/);
  assert.match(contract, /conditions/);
  assert.match(contract, /sensory_profile/);
  assert.match(fixtures, /locationSceneAtmosphereCompleteFixture/);
  assert.match(fixtures, /locationSceneAtmosphereLegacyFixture/);
  assert.match(fixtures, /locationSceneAtmosphereSparseFixture/);
  assert.match(fixtures, /locationSceneAtmosphereEmptyFixture/);
});

test("Location Scene Atmosphere preview is development-only and fixture driven", () => {
  const page = read(
    "app/dev/ui-preview/location-scene-atmosphere-section/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/location-scene-atmosphere-section/LocationSceneAtmosphereSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationSceneAtmosphereSectionView/);
  assert.match(preview, /LocationSensoryEnvironmentFieldsView/);
  assert.match(preview, /Legacy Fallbacks/);
});

test("Creation Edit retains the public Location Scene Atmosphere Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import LocationSceneAtmosphereSection from/);
  assert.match(editShell, /<LocationSceneAtmosphereSection/);
  assert.match(editShell, /updateDataField=\{updateDataField\}/);
});

test("Location Scene Atmosphere package documents composition and diagnostics", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/README.md"
  );
  const packageJson = read("package.json");
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /sensoryEnvironmentSlot/);
  assert.match(readme, /sensory_profile/);
  assert.match(
    readme,
    /\/dev\/ui-preview\/location-scene-atmosphere-section/
  );
  assert.match(
    packageJson,
    /diagnostics:loom:location-scene-atmosphere-section/
  );
});
