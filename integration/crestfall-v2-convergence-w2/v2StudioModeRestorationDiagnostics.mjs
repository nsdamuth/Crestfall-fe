import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

const tests = [];
function test(name, run) {
  tests.push({ name, run });
}

test("Studio contract restores Quick Start, Guided Build, and Full Studio", async () => {
  const contract = await source("app/studio/v2/studio/studio/Studio.contract.js");
  const viewModel = await source("app/studio/v2/studio/studio/useStudioViewModel.js");

  assert.match(contract, /STUDIO_VIEW_CONTRACT_VERSION = "2\.2\.0"/);
  assert.match(viewModel, /label: "Quick Start"/);
  assert.match(viewModel, /label: "Guided Build"/);
  assert.match(viewModel, /label: "Full Studio"/);
});

test("canonical V2 Studio renders the restored mode selector", async () => {
  const view = await source("app/studio/v2/studio/studio/Studio.view.jsx");

  assert.match(view, /function StudioModeSelector/);
  assert.match(view, /role="tablist"/);
  assert.match(view, /The ladder · assets → stories → adventures/);
  assert.match(view, /activeMode === CREATION_STUDIO_MODES\.QUICK/);
});

test("Quick Start preserves the newer V2 Create Build Publish composition", async () => {
  const view = await source("app/studio/v2/studio/studio/Studio.view.jsx");

  assert.match(view, /<CreateZone doors=\{doors\}/);
  assert.match(view, /<BuildZone onBuildStory=\{onBuildStory\}/);
  assert.match(view, /<PublishZone onOpenVault=\{onOpenVault\}/);
});

test("Guided Build and Full Studio preserve Creation Studio logic behind V2-native panels", async () => {
  const shell = await source("app/studio/v2/studio/Studio.jsx");
  const panels = await source("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.match(shell, /useCreationStudioViewModel/);
  assert.match(shell, /<StudioGuidedModeView/);
  assert.match(shell, /<StudioFullModeView/);
  assert.match(panels, /recommendedStep/);
  assert.match(panels, /guidedAssets/);
  assert.match(panels, /sections = \[\]/);
});

test("Studio mode preference persists through the shared creation-studio key", async () => {
  const viewModel = await source("app/studio/v2/studio/studio/useStudioViewModel.js");

  assert.match(viewModel, /CREATION_STUDIO_MODE_STORAGE_KEY/);
  assert.match(viewModel, /window\.localStorage\.getItem/);
  assert.match(viewModel, /window\.localStorage\.setItem/);
  assert.match(viewModel, /CREATION_STUDIO_MODES\.QUICK/);
});

test("legacy Creation Studio remains backward compatible", async () => {
  const view = await source("components/studio/create/creation-studio/CreationStudio.view.jsx");

  assert.match(view, /showModeSelector = true/);
  assert.match(view, /showModeSelector \? \(/);
});

test("W2G stays inside Studio presentation and existing creation-studio reuse boundaries", async () => {
  const ownedFiles = [
    "app/studio/v2/studio/Studio.jsx",
    "app/studio/v2/studio/studio/Studio.contract.js",
    "app/studio/v2/studio/studio/Studio.fixtures.js",
    "app/studio/v2/studio/studio/Studio.view.jsx",
    "app/studio/v2/studio/studio/useStudioViewModel.js",
    "app/studio/v2/studio/studio/README.md",
    "components/studio/create/creation-studio/CreationStudio.view.jsx",
    "integration/crestfall-v2-convergence-w2/v2StudioModeRestorationDiagnostics.mjs",
  ].join("\n");

  assert.doesNotMatch(ownedFiles, /services\/api\//);
  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/images\//);
  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/account\//);
});

for (const { name, run } of tests) {
  await run();
  console.log(`PASS ${name}`);
}

console.log(`V2 Studio mode restoration diagnostics: ${tests.length}/${tests.length} PASS`);
