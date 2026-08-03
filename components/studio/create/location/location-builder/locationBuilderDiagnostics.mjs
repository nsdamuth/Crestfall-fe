import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Location Builder Shell remains a focused LOOM binding", () => {
  const shell = read("components/studio/create/location/LocationBuilderShell.jsx");

  assert.match(shell, /useLocationBuilderViewModel/);
  assert.match(shell, /<LocationBuilderView/);
  assert.match(shell, /sensoryEnvironmentContent/);
  assert.match(shell, /runtimeModulesContent/);
  assert.match(shell, /registryAttachmentsContent/);
  assert.match(shell, /parentPickerContent/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Location Builder View is API, persistence, and application-Shell free", () => {
  const view = read(
    "components/studio/create/location/location-builder/LocationBuilder.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createLocationDraft|buildLocationCreationPayload|router\./
  );
  assert.doesNotMatch(
    view,
    /import .*LocationParentPickerModal|import .*LocationRuntimeModulesSection|import .*LocationRegistryAttachmentsSection|import .*LocationSensoryEnvironmentFields/
  );
  assert.match(view, /sensoryEnvironmentContent/);
  assert.match(view, /runtimeModulesContent/);
  assert.match(view, /registryAttachmentsContent/);
});

test("Location Builder ViewModel owns payload, hierarchy, runtime state, save, and navigation", () => {
  const viewModel = read(
    "components/studio/create/location/location-builder/useLocationBuilderViewModel.js"
  );

  assert.match(viewModel, /buildLocationCreationPayload/);
  assert.match(viewModel, /type: "LOCATION"/);
  assert.match(viewModel, /builder: "LOCATION_BUILDER"/);
  assert.match(viewModel, /parentLocationId/);
  assert.match(viewModel, /engine_module_bindings/);
  assert.match(viewModel, /boundRegistries/);
  assert.match(viewModel, /createLocationDraft/);
  assert.match(viewModel, /router\.push/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Location client delegates creation through the shared creation client", () => {
  const client = read("lib/client/studio/locations/locationClient.js");

  assert.match(client, /createCreationDraft/);
  assert.match(client, /Location draft could not be saved\./);
  assert.doesNotMatch(client, /\bfetch\s*\(/);
});

test("Location Builder contract and fixtures cover primary builder states", () => {
  const contract = read(
    "components/studio/create/location/location-builder/LocationBuilder.contract.js"
  );
  const fixtures = read(
    "components/studio/create/location/location-builder/LocationBuilder.fixtures.js"
  );

  assert.match(contract, /LOCATION_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /sensoryEnvironmentContent/);
  assert.match(contract, /parentPickerContent/);
  assert.match(fixtures, /locationBuilderConfiguredFixture/);
  assert.match(fixtures, /locationBuilderEmptyFixture/);
  assert.match(fixtures, /locationBuilderLocalRuntimeFixture/);
  assert.match(fixtures, /locationBuilderSavingFixture/);
  assert.match(fixtures, /locationBuilderSavedFixture/);
  assert.match(fixtures, /locationBuilderErrorFixture/);
});

test("Location Builder preview is development-only", () => {
  const page = read("app/dev/ui-preview/location-builder/page.jsx");

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create Location page retains the public LocationBuilderShell", () => {
  const page = read("app/studio/create/location/page.js");

  assert.match(
    page,
    /import LocationBuilderShell from "@\/components\/studio\/create\/location\/LocationBuilderShell"/
  );
  assert.match(page, /<LocationBuilderShell \/>/);
});
