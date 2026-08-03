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

test("Location Sensory Environment Shell stays thin", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/LocationSensoryEnvironmentFields.jsx"
  );
  assert.match(shell, /useLocationSensoryEnvironmentFieldsViewModel/);
  assert.match(shell, /LocationSensoryEnvironmentFieldsView/);
  assert.doesNotMatch(shell, /useState/);
  assert.doesNotMatch(shell, /environment\./);
  assert.doesNotMatch(shell, /normalizeLocation/);
});

test("Location Sensory Environment View is portable and semantic", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx"
  );
  assert.match(view, /onChangeVisionLightLevel/);
  assert.match(view, /onAddScentNote/);
  assert.match(view, /onRemoveScentTag/);
  assert.doesNotMatch(view, /sensoryProfile/);
  assert.doesNotMatch(view, /onChange\?\.\(\{\s*\.\.\.profile/);
  assert.doesNotMatch(view, /JSON\.parse/);
});

test("Location Sensory Environment ViewModel owns nested profile mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/useLocationSensoryEnvironmentFieldsViewModel.js"
  );
  assert.match(viewModel, /environment\.VISION \|\| environment\.vision/);
  assert.match(viewModel, /environment\.HEARING \|\| environment\.hearing/);
  assert.match(viewModel, /environment\.SCENT \|\| environment\.scent/);
  assert.match(viewModel, /delete nextEnvironment\[sense\.toLowerCase\(\)\]/);
  assert.match(viewModel, /delete nextEnvironment\.scent/);
  assert.match(viewModel, /onChange\?\.\(nextProfile\)/);
});

test("Location Sensory Environment ViewModel preserves scale and tag rules", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/useLocationSensoryEnvironmentFieldsViewModel.js"
  );
  assert.match(viewModel, /LOCATION_SENSORY_SCALE_MIN = 1/);
  assert.match(viewModel, /LOCATION_SENSORY_SCALE_MAX = 10/);
  assert.match(viewModel, /Math\.round\(parsed\)/);
  assert.match(viewModel, /raw\.startsWith\("\["\)/);
  assert.match(viewModel, /JSON\.parse\(raw\)/);
  assert.match(viewModel, /raw\.split\(","\)/);
  assert.match(viewModel, /seen\.has\(identity\)/);
});

test("Location Sensory Environment contract and fixtures are complete", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.fixtures.js"
  );
  assert.match(contract, /locationSensoryEnvironmentFields\.view\.v1/);
  assert.match(contract, /sensoryProfile\.environment\.VISION/);
  assert.match(contract, /environment\.vision/);
  assert.match(fixtures, /locationSensoryEnvironmentCompleteFixture/);
  assert.match(fixtures, /locationSensoryEnvironmentInheritedFixture/);
  assert.match(fixtures, /locationSensoryEnvironmentSparseFixture/);
});

test("Location Sensory Environment preview is development-only", () => {
  const page = read(
    "app/dev/ui-preview/location-sensory-environment-fields/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/location-sensory-environment-fields/LocationSensoryEnvironmentFieldsPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationSensoryEnvironmentFieldsView/);
  assert.match(preview, /Inherited \/ Blank/);
  assert.match(preview, /onAddScentNote/);
});

test("Location Create and Edit retain the public sensory Binding Shell", () => {
  const createShell = read(
    "components/studio/create/location/LocationBuilderShell.jsx"
  );
  const editSection = read(
    "components/studio/my-creations/edit/sections/locations/LocationSceneAtmosphereSection.jsx"
  );
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/README.md"
  );
  const packageJson = read("package.json");
  assert.match(createShell, /import LocationSensoryEnvironmentFields from/);
  assert.match(createShell, /<LocationSensoryEnvironmentFields/);
  assert.match(editSection, /import LocationSensoryEnvironmentFields from/);
  assert.match(editSection, /sensoryProfile=/);
  assert.match(readme, /both Location Create and Location Edit/);
  assert.match(
    packageJson,
    /diagnostics:loom:location-sensory-environment-fields/
  );
});
