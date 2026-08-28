import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("V2 Images runtime route binds the live composition instead of fixtures", () => {
  const page = read("app/studio/v2/images/page.jsx");
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.match(page, /ImagesV2Live/);
  assert.doesNotMatch(page, /ImagesV2Mockup/);
  assert.match(live, /KitImageCreatorPanel/);
  assert.match(live, /MediaHistoryGrid/);
  assert.match(live, /KitIngredientPicker/);
  assert.match(live, /KitSaveIngredientPreset/);
});

test("V2 Images adapter reuses application-owned workbench state", () => {
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );

  assert.match(adapter, /useStudioAccount/);
  assert.match(adapter, /useImageStudioWorkbenchViewModel/);
  assert.match(adapter, /getImageStudioComposerViewProps/);
  assert.match(adapter, /mediaHistoryProps: workbench\.mediaHistoryProps/);
  assert.match(adapter, /onGenerate: composer\.onGenerateImage/);
  assert.match(adapter, /advancedTuningProps: composer\.advancedTuningProps/);
  assert.match(adapter, /pickerModalProps: workbench\.pickerModalProps/);
  assert.match(adapter, /savePresetModalProps: workbench\.savePresetModalProps/);
});

test("V2 Images Views do not own transport or database access", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );

  for (const source of [live, adapter]) {
    assert.doesNotMatch(source, /fetch\s*\(/);
    assert.doesNotMatch(source, /crestfallApiRequest/);
    assert.doesNotMatch(source, /postgraphile/i);
    assert.doesNotMatch(source, /supabase/i);
    assert.doesNotMatch(source, /\.from\s*\(/);
  }
});

test("V2 Images retains the wide desktop workspace and mobile creator path", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.match(live, /min-w-0 flex-1/);
  assert.match(live, /w-\[24rem\]/);
  assert.match(live, /min-\[1100px\]:block/);
  assert.match(live, /mobilePrimaryActionLabel="Image Editor"/);
  assert.match(live, /onMobilePrimaryAction/);
  assert.doesNotMatch(live, /fixed bottom-\[calc\(var\(--space-4\)/);
  assert.doesNotMatch(live, /max-w-\[(?:7xl|6xl|5xl|4xl|3xl)\]/);
});

test("V2 Image Creator panel renders the shared bounded workflow tuning projection", () => {
  const panel = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
  );
  const vm = read(
    "components/kit/image-creator-panel/useKitImageCreatorPanelViewModel.js"
  );

  assert.match(panel, /AdvancedTuning/);
  assert.match(panel, /Curated workflow controls/);
  assert.match(panel, /type="range"/);
  assert.match(panel, /Reset defaults/);
  assert.match(vm, /advancedTuningProps/);
});

test("unsupported video generation remains explicitly non-live", () => {
  const panel = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
  );

  assert.match(panel, /Generate video soon/);
});
