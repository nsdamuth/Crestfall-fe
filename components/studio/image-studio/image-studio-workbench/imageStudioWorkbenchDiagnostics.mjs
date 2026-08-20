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

test("Image Studio Workbench shell stays thin and owns app bindings", () => {
  const shell = read("components/studio/image-studio/ImageStudioWorkbench.jsx");

  assert.match(shell, /useStudioAccount/);
  assert.match(shell, /useImageStudioWorkbenchViewModel/);
  assert.match(shell, /ImageStudioWorkbenchView/);
  assert.match(shell, /MediaHistoryGridComponent=\{MediaHistoryGrid\}/);
  assert.match(shell, /ImageStudioComposerComponent=\{ImageStudioComposer\}/);
  assert.match(shell, /IngredientPickerModalComponent=\{IngredientPickerModal\}/);
  assert.match(shell, /SaveIngredientPresetModalComponent=\{SaveIngredientPresetModal\}/);
  assert.doesNotMatch(
    shell,
    /useState|createCreationDraft|useImageGenerationJob|buildImageGenerationPayload/
  );
});

test("ViewModel owns generation, history, ingredient, and Creation clients", () => {
  const viewModel = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(viewModel, /useImageGenerationJob/);
  assert.match(viewModel, /useImageGenerationHistory/);
  assert.match(viewModel, /useImageStudioIngredientOptions/);
  assert.match(viewModel, /createCreationDraft/);
  assert.match(viewModel, /prependPendingGeneration/);
  assert.match(viewModel, /resolvePendingGeneration/);
  assert.match(viewModel, /failPendingGeneration/);
  assert.match(viewModel, /setCoinBalanceFromServer/);
  assert.match(viewModel, /refreshAccount\(\)\.catch/);
  assert.doesNotMatch(viewModel, /<section|<aside|<ImageStudioComposer/);
});

test("generation packet preserves all current fields and compatibility mappings", () => {
  const viewModel = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(viewModel, /mode: "image"/);
  assert.match(viewModel, /operation: "create_image"/);
  assert.match(viewModel, /character: makeOptionalIngredient/);
  assert.match(viewModel, /playerCharacter: makeOptionalIngredient/);
  assert.match(viewModel, /renderingPreset: makeOptionalIngredient/);
  assert.match(viewModel, /promptMode: getPromptMode\(renderStyle\)/);
  assert.match(viewModel, /normalizeCameraPresetValue/);
  assert.match(viewModel, /getCameraPresetPrompt/);
  assert.match(viewModel, /getLegacyCameraPresetValue/);
  assert.match(viewModel, /LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT/);
  assert.match(viewModel, /appendPromptFragment/);
  assert.match(viewModel, /userPrompt: resolvedUserPrompt/);
  assert.match(viewModel, /shotType: normalizedCameraPreset/);
  assert.match(
    viewModel,
    /cameraPreset: getLegacyCameraPresetValue\(normalizedCameraPreset\)/
  );
  assert.match(viewModel, /referenceInputs: \[\]/);
  assert.match(viewModel, /controlInputs: \[\]/);
  assert.match(viewModel, /renderingStyle: getLegacyRenderingStyle\(renderStyle\)/);
  assert.match(viewModel, /aspectRatio: ASPECT_RATIO_BY_COMPOSER_VALUE\[aspectRatio\] \|\| "3:4"/);
  assert.match(viewModel, /quality: "standard"/);
  assert.match(viewModel, /modelProfile: getModelProfile\(renderStyle\)/);
});

test("availability and ingredient orchestration preserve production rules", () => {
  const viewModel = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(viewModel, /IMAGE_GENERATION_COIN_COST = 5/);
  assert.match(viewModel, /coinBalance >= IMAGE_GENERATION_COIN_COST/);
  assert.match(viewModel, /Select a character, clothing source, wardrobe, or location before generating\./);
  assert.match(viewModel, /default clothing when available/);
  assert.match(viewModel, /delete next\.playerCharacter/);
  assert.match(viewModel, /delete next\.character/);
  assert.match(viewModel, /slot\.allowCreatePreset/);
  assert.match(viewModel, /setPickerSlot\(null\)/);
});

test("custom preset payload preserves Creation fields and location compatibility", () => {
  const viewModel = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(viewModel, /visibility: "PRIVATE"/);
  assert.match(viewModel, /content_rating: "SFW"/);
  assert.match(viewModel, /clothing_mode: "NORMAL"/);
  assert.match(viewModel, /engine_module_bindings: \[\]/);
  assert.match(viewModel, /boundRegistries:/);
  assert.match(viewModel, /boundRegistryLinks:/);
  assert.match(viewModel, /preset_family: "CUSTOM"/);
  assert.match(viewModel, /builder: "VISUAL_ASSET_BUILDER"/);
  assert.match(viewModel, /builder_version: "1\.0"/);
  assert.match(viewModel, /created_from_image_studio_custom_preset: true/);
});

test("portable View owns responsive markup and only uses injected child controls", () => {
  const view = read(
    "components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.view.jsx"
  );

  assert.match(view, /MediaHistoryGridComponent/);
  assert.match(view, /ImageStudioComposerComponent/);
  assert.match(view, /IngredientPickerModalComponent/);
  assert.match(view, /SaveIngredientPresetModalComponent/);
  assert.match(view, /xl:grid-cols-\[1fr_420px\]/);
  assert.match(view, /mobileComposerOpen/);
  assert.match(view, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(view, /onQuickGenerate/);
  assert.doesNotMatch(
    view,
    /StudioAccountProvider|createCreationDraft|imageStudioClient|useImageGeneration/
  );
});

test("contract, fixtures, and protected preview cover workbench states", () => {
  const contract = read(
    "components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.contract.js"
  );
  const fixtures = read(
    "components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.fixtures.js"
  );
  const page = read("app/dev/ui-preview/image-studio-workbench/page.jsx");
  const preview = read(
    "app/dev/ui-preview/image-studio-workbench/ImageStudioWorkbenchPreviewClient.jsx"
  );

  assert.match(contract, /IMAGE_STUDIO_WORKBENCH_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /ownsStudioAccountContext: "Binding Shell"/);
  assert.match(contract, /ownsGenerationPayloadComposition: "ViewModel"/);
  assert.match(fixtures, /imageStudioWorkbenchReadyFixture/);
  assert.match(fixtures, /imageStudioWorkbenchNoSourceFixture/);
  assert.match(fixtures, /imageStudioWorkbenchLowCoinsFixture/);
  assert.match(fixtures, /imageStudioWorkbenchGenerationErrorFixture/);
  assert.match(fixtures, /imageStudioWorkbenchPickerFixture/);
  assert.match(fixtures, /imageStudioWorkbenchSavePresetFixture/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /ImageStudioWorkbenchView/);
  assert.match(preview, /PreviewComposer/);
});

test("documentation and package script preserve scope and Mechanics deferral", () => {
  const readme = read(
    "components/studio/image-studio/image-studio-workbench/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /portable Skin/);
  assert.match(readme, /mode: image/);
  assert.match(readme, /created_from_image_studio_custom_preset/);
  assert.match(readme, /does not spend coins/);
  assert.match(readme, /does not abstract\s+the deferred Mechanics Module/);
  assert.match(readme, /\/dev\/ui-preview\/image-studio-workbench/);
  assert.match(packageJson, /diagnostics:loom:image-studio-workbench/);
});
