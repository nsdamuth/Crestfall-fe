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

test("Location Runtime Modules Shell stays thin and owns application composition", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection.jsx"
  );
  assert.match(shell, /useLocationRuntimeModulesSectionViewModel/);
  assert.match(shell, /LocationRuntimeModulesSectionView/);
  assert.equal((shell.match(/<RuntimeMechanicsModulesSection/g) || []).length, 1);
  assert.equal(
    (shell.match(/<LocationRegistryAttachmentsSection/g) || []).length,
    1
  );
  assert.equal((shell.match(/<WeatherModuleConfigModal/g) || []).length, 1);
  assert.doesNotMatch(shell, /import\s+\{?\s*SectionTitle/);
  assert.doesNotMatch(shell, /engine_module_bindings/);
  assert.doesNotMatch(shell, /calendarProfile/);
});

test("Location Runtime Modules View visibly exposes Weather and stays portable", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view.jsx"
  );
  assert.match(view, /CloudSun/);
  assert.match(view, /weatherTitle/);
  assert.match(view, /weatherModuleTitle/);
  assert.match(view, /weatherStatusLabel/);
  assert.match(view, /onOpenWeatherConfig/);
  assert.match(view, /onToggleWeather/);
  assert.match(view, /Configure Weather/);
  assert.match(view, /runtimeMechanicsSlot/);
  assert.match(view, /registryAttachmentsSlot/);
  assert.match(view, /onToggleTimeCalendar/);
  assert.doesNotMatch(view, /\bform\b/);
  assert.doesNotMatch(view, /updateDataField/);
  assert.doesNotMatch(view, /RuntimeMechanicsModulesSection/);
  assert.doesNotMatch(view, /LocationRegistryAttachmentsSection/);
  assert.doesNotMatch(view, /WeatherModuleConfigModal/);
});

test("Location Runtime Modules ViewModel owns Weather and calendar binding writes", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/useLocationRuntimeModulesSectionViewModel.js"
  );
  assert.match(viewModel, /getTimeCalendarProfile/);
  assert.match(viewModel, /upsertTimeCalendarBinding/);
  assert.match(viewModel, /upsertWeatherBinding/);
  assert.match(viewModel, /hasWeatherBinding/);
  assert.match(viewModel, /weatherEnabled/);
  assert.match(viewModel, /setWeatherModalOpen\(true\)/);
  assert.match(viewModel, /writeWeatherBinding/);
  assert.match(viewModel, /engine_module_bindings/);
  assert.match(viewModel, /calendarProfile/);
  assert.match(viewModel, /calendar_profile/);
  assert.match(viewModel, /calendarAuthorityMode/);
  assert.match(viewModel, /LOCAL_OVERRIDE/);
  assert.match(viewModel, /get_weather_context/);
  assert.match(viewModel, /get_calendar_context/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Runtime Modules contract and fixtures cover Weather and legacy compatibility", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.fixtures.js"
  );
  assert.match(
    contract,
    /LOCATION_RUNTIME_MODULES_SECTION_VIEW_CONTRACT_VERSION/
  );
  assert.match(contract, /weatherState/);
  assert.match(contract, /onOpenWeatherConfig/);
  assert.match(contract, /onToggleWeather/);
  assert.match(contract, /core\.inWorldWeather\.v1/);
  assert.match(contract, /get_weather_context/);
  assert.match(contract, /engine_module_bindings/);
  assert.match(contract, /legacyReadFields/);
  assert.match(contract, /calendar_profile/);
  assert.match(contract, /show_exact_clock_to_composer/);
  assert.match(fixtures, /Aethelgard Prism Climate/);
  assert.match(fixtures, /No weather module attached/);
  assert.match(fixtures, /locationRuntimeModulesBoundFixture/);
  assert.match(fixtures, /locationRuntimeModulesInheritedFixture/);
  assert.match(fixtures, /locationRuntimeModulesDisabledFixture/);
  assert.match(fixtures, /locationRuntimeModulesUnboundFixture/);
});

test("Location Runtime Modules preview is development-only and Weather aware", () => {
  const page = read("app/dev/ui-preview/location-runtime-modules-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/location-runtime-modules-section/LocationRuntimeModulesSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationRuntimeModulesSectionView/);
  assert.match(preview, /Configure Weather requested/);
  assert.match(preview, /onToggleWeather/);
  assert.match(preview, /Local Override/);
  assert.match(preview, /Bound but Disabled/);
  assert.match(preview, /Not Bound/);
});

test("Creation Edit retains one Runtime Shell and one Weather modal", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  const runtimeSection = read(
    "components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection.jsx"
  );
  assert.match(editShell, /import LocationRuntimeModulesSection from/);
  assert.equal((editShell.match(/<LocationRuntimeModulesSection/g) || []).length, 1);
  assert.equal(
    (runtimeSection.match(/<RuntimeMechanicsModulesSection/g) || []).length,
    1
  );
  assert.equal(
    (runtimeSection.match(/<LocationRegistryAttachmentsSection/g) || []).length,
    1
  );
  assert.equal(
    (runtimeSection.match(/<WeatherModuleConfigModal/g) || []).length,
    1
  );
});

test("Location Runtime Modules package documents visible Weather integration", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/README.md"
  );
  const packageJson = read("package.json");
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /visible Weather card/);
  assert.match(readme, /Configure Weather/);
  assert.match(readme, /RuntimeMechanicsModulesSection/);
  assert.match(readme, /LocationRegistryAttachmentsSection/);
  assert.match(readme, /Mechanics Module editing/);
  assert.match(readme, /\/dev\/ui-preview\/location-runtime-modules-section/);
  assert.match(packageJson, /diagnostics:loom:location-runtime-modules-section/);
});
