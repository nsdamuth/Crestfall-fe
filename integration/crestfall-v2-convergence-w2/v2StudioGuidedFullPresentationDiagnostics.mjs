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

test("Guided and Full Studio use dedicated V2-native panels", async () => {
  const shell = await source("app/studio/v2/studio/Studio.jsx");
  const panels = await source("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.match(shell, /StudioGuidedModeView/);
  assert.match(shell, /StudioFullModeView/);
  assert.doesNotMatch(shell, /<CreationStudioView/);
  assert.match(panels, /RecommendedHero/);
  assert.match(panels, /ProgressMeter/);
  assert.match(panels, /FullStudioAssetCard/);
});

test("Guided presentation consumes existing live Creation Studio state", async () => {
  const shell = await source("app/studio/v2/studio/Studio.jsx");
  const panels = await source("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.match(shell, /creationStudioViewModel\.guidedChapters/);
  assert.match(shell, /creationStudioViewModel\.guidedProgress/);
  assert.match(shell, /creationStudioViewModel\.recommendedGuidedStep/);
  assert.match(shell, /creationStudioViewModel\.guidedAssets/);
  assert.match(shell, /creationStudioViewModel\.isLoadingCounts/);
  assert.match(panels, /chapter\.steps/);
  assert.match(panels, /step\.complete/);
  assert.match(panels, /step\.current/);
});

test("Full Studio presentation consumes the existing complete section inventory", async () => {
  const shell = await source("app/studio/v2/studio/Studio.jsx");
  const panels = await source("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.match(shell, /creationStudioViewModel\.fullStudioSections/);
  assert.match(panels, /sections\.map/);
  assert.match(panels, /section\.assets/);
  assert.match(panels, /Open builder →/);
});

test("mode panels stay presentation-only and use supplied navigation seams", async () => {
  const panels = await source("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.doesNotMatch(panels, /fetch\(/);
  assert.doesNotMatch(panels, /supabase/i);
  assert.doesNotMatch(panels, /PostGraphile/i);
  assert.doesNotMatch(panels, /services-api/i);
  assert.match(panels, /LinkComponent/);
  assert.match(panels, /onOpenCharacterCreator/);
});

test("Quick Start remains owned by the existing V2 Studio view", async () => {
  const view = await source("app/studio/v2/studio/studio/Studio.view.jsx");

  assert.match(view, /activeMode === CREATION_STUDIO_MODES\.QUICK/);
  assert.match(view, /<CreateZone doors=\{doors\}/);
  assert.match(view, /<BuildZone onBuildStory=\{onBuildStory\}/);
  assert.match(view, /<PublishZone onOpenVault=\{onOpenVault\}/);
});

test("legacy Creation Studio logic remains intact for non-V2 consumers", async () => {
  const view = await source("components/studio/create/creation-studio/CreationStudio.view.jsx");
  const viewModel = await source("components/studio/create/creation-studio/useCreationStudioViewModel.js");

  assert.match(view, /GuidedBuildView/);
  assert.match(view, /FullStudioView/);
  assert.match(viewModel, /fetchOwnedCreations/);
  assert.match(viewModel, /buildGuidedChapterStates/);
  assert.match(viewModel, /buildFullStudioSections/);
});

test("W3A stays out of Images, Account, services-api, and editor implementation", async () => {
  const ownedFiles = [
    "app/studio/v2/studio/Studio.jsx",
    "app/studio/v2/studio/studio/Studio.contract.js",
    "app/studio/v2/studio/studio/StudioModePanels.view.jsx",
    "app/studio/v2/studio/studio/README.md",
    "integration/crestfall-v2-convergence-w2/v2StudioModeRestorationDiagnostics.mjs",
    "integration/crestfall-v2-convergence-w2/v2StudioGuidedFullPresentationDiagnostics.mjs",
  ].join("\n");

  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/images\//);
  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/account\//);
  assert.doesNotMatch(ownedFiles, /services\/api\//);
  assert.doesNotMatch(ownedFiles, /my-creations\/creation-edit-shell/);
});

for (const { name, run } of tests) {
  await run();
  console.log(`PASS ${name}`);
}

console.log(`V2 Studio Guided/Full presentation diagnostics: ${tests.length}/${tests.length} PASS`);
