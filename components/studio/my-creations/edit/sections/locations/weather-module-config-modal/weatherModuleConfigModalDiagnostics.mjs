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

test("Weather Module Config Shell stays thin", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/WeatherModuleConfigModal.jsx"
  );
  assert.match(shell, /useWeatherModuleConfigModalViewModel/);
  assert.match(shell, /WeatherModuleConfigModalView/);
  assert.doesNotMatch(shell, /engineModuleInstanceClient/);
  assert.doesNotMatch(shell, /useEffect|useMemo|useState/);
  assert.doesNotMatch(shell, /weatherTypes|instanceData|buildPayload/);
});

test("Weather Module Config View is portable and semantic", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx"
  );
  assert.match(view, /conditionCards/);
  assert.match(view, /onAddRecommendedCondition/);
  assert.match(view, /onSurfaceSensoryNotesChange/);
  assert.match(view, /Save Weather Module/);
  assert.doesNotMatch(view, /engineModuleInstanceClient/);
  assert.doesNotMatch(view, /fetchEngineModuleInstance/);
  assert.doesNotMatch(view, /createEngineModuleInstance/);
  assert.doesNotMatch(view, /updateEngineModuleInstance/);
  assert.doesNotMatch(view, /\bform\b/);
});

test("Weather Module Config ViewModel owns requests and payload normalization", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/weather-module-config-modal/useWeatherModuleConfigModalViewModel.js"
  );
  assert.match(viewModel, /fetchEngineModuleInstance/);
  assert.match(viewModel, /createEngineModuleInstance/);
  assert.match(viewModel, /updateEngineModuleInstance/);
  assert.match(viewModel, /normalizeInstancePayload/);
  assert.match(viewModel, /instance_data/);
  assert.match(viewModel, /data\?\.instanceData/);
  assert.match(viewModel, /core\.inWorldWeather\.v1/);
  assert.match(viewModel, /weather_instance_data\.v0/);
  assert.match(viewModel, /get_weather_context/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Weather Module Config ViewModel preserves condition-library behavior", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/weather-module-config-modal/useWeatherModuleConfigModalViewModel.js"
  );
  assert.match(viewModel, /RECOMMENDED_WEATHER_CONDITIONS/);
  assert.match(viewModel, /addRecommendedCondition/);
  assert.match(viewModel, /addCustomDraftCondition/);
  assert.match(viewModel, /removeCondition/);
  assert.match(viewModel, /allowedWeatherTypeIds/);
  assert.match(viewModel, /blockedWeatherTypeIds/);
  assert.match(viewModel, /weatherWeights/);
  assert.match(viewModel, /parseSensoryNotes/);
  assert.match(viewModel, /surfaceSensoryNotes/);
  assert.match(viewModel, /respectIndoorOutdoorLogic/);
});

test("Weather Module Config contract and fixtures cover lifecycle and blocked conditions", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.fixtures.js"
  );
  assert.match(contract, /WEATHER_MODULE_CONFIG_MODAL_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /applicationOwnedClients/);
  assert.match(contract, /legacyInstanceDataPaths/);
  assert.match(contract, /conditionCallbacks/);
  assert.match(fixtures, /weatherModuleConfigExistingFixture/);
  assert.match(fixtures, /weatherModuleConfigBlockedFixture/);
  assert.match(fixtures, /weatherModuleConfigLoadingFixture/);
  assert.match(fixtures, /blocked: true/);
});

test("Weather Module Config preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/weather-module-config-modal/page.jsx");
  const preview = read(
    "app/dev/ui-preview/weather-module-config-modal/WeatherModuleConfigModalPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /WeatherModuleConfigModalView/);
  assert.match(preview, /Existing Module/);
  assert.match(preview, /Blocked Condition/);
  assert.match(preview, /Loading/);
});

test("Location Runtime Modules retains one Weather modal and package diagnostics", () => {
  const runtimeShell = read(
    "components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection.jsx"
  );
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/weather-module-config-modal/README.md"
  );
  const packageJson = read("package.json");
  assert.equal((runtimeShell.match(/<WeatherModuleConfigModal/g) || []).length, 1);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /LocationRuntimeModulesSection/);
  assert.match(readme, /Mechanics Module field decomposition/);
  assert.match(readme, /\/dev\/ui-preview\/weather-module-config-modal/);
  assert.match(packageJson, /diagnostics:loom:weather-module-config-modal/);
});
