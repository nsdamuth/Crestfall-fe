import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readPackageJson() {
  return JSON.parse(read("package.json"));
}

const expectedStandaloneScripts = {
  "diagnostics:loom:creation-studio":
    "components/studio/create/creation-studio/creationStudioDiagnostics.mjs",
  "diagnostics:loom:progression-json-editor":
    "components/studio/create/progression/progression-json-editor/progressionJsonEditorDiagnostics.mjs",
  "diagnostics:loom:mechanics-json-editor":
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/mechanicsJsonEditorDiagnostics.mjs",
  "diagnostics:loom:mc7-preset-library-layout":
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/mc7PresetLibraryLayoutDiagnostics.mjs",
  "diagnostics:loom:mc7-builder-live-validation":
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7BuilderLiveValidationDiagnostics.mjs",
  "diagnostics:loom:mc7-command-starter-preset":
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7CommandStarterPresetDiagnostics.mjs",
  "diagnostics:loom:mc7-module-starter-preset":
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7ModuleStarterPresetDiagnostics.mjs",
  "diagnostics:loom:mc7-preset-application":
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7PresetApplicationDiagnostics.mjs",
  "diagnostics:loom:mc7-reference-preset-catalog":
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7ReferencePresetCatalogDiagnostics.mjs",
};

test("Media History Grid diagnostic follows the injected Workbench integration", () => {
  const diagnostic = read(
    "components/studio/image-studio/media-history-grid/mediaHistoryGridDiagnostics.mjs"
  );

  assert.match(diagnostic, /MediaHistoryGridComponent=\\\{MediaHistoryGrid\\\}/);
  assert.match(diagnostic, /mediaHistoryProps:/);
  assert.match(diagnostic, /generatedMedia: mediaItems/);
  assert.match(diagnostic, /onLoadMoreHistory: loadMoreImageGenerationHistory/);
  assert.doesNotMatch(diagnostic, /assert\.match\(workbench, \/generatedMedia=\//);
});

test("clean standalone diagnostics have explicit package scripts", () => {
  const packageJson = readPackageJson();

  for (const [scriptName, diagnosticPath] of Object.entries(
    expectedStandaloneScripts
  )) {
    const command = packageJson.scripts?.[scriptName] || "";
    assert.match(command, new RegExp(diagnosticPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.equal(
      fs.existsSync(path.join(repoRoot, diagnosticPath)),
      true,
      `${diagnosticPath} must exist`
    );
  }
});

test("aggregate diagnostic command remains discoverable", () => {
  const packageJson = readPackageJson();
  const command = packageJson.scripts?.["diagnostics:loom:diagnostic-hardening"] || "";

  assert.match(command, /mediaHistoryGridDiagnostics\.mjs/);
  assert.match(command, /diagnosticHardeningDiagnostics\.mjs/);
  assert.match(command, /creationStudioDiagnostics\.mjs/);
  assert.match(command, /mechanicsJsonEditorDiagnostics\.mjs/);
  assert.match(command, /mc7ReferencePresetCatalogDiagnostics\.mjs/);
});

test("cross-service and installed-dependency exclusions are documented", () => {
  const readme = read("components/studio/diagnostic-hardening/README.md");

  assert.match(readme, /lorePatchDiagnostics\.mjs/);
  assert.match(readme, /services\/api/);
  assert.match(readme, /services\/engine-middleware/);
  assert.match(readme, /Actor Mechanics Profile/);
  assert.match(readme, /Rules Codex/);
  assert.match(readme, /Stats Pools/);
  assert.match(readme, /does not begin Mechanics abstraction/);
});

test("diagnostic hardening contains no production runtime package", () => {
  const files = fs.readdirSync(path.join(repoRoot, "components/studio/diagnostic-hardening"));

  assert.deepEqual(files.sort(), ["README.md", "diagnosticHardeningDiagnostics.mjs"]);
});
