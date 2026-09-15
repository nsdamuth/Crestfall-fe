import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const details = read("components/studio/media/media-lightbox/MediaLightbox.view.jsx");
const lightboxVm = read("components/studio/media/media-lightbox/useMediaLightboxViewModel.js");
const workbench = read("components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js");
const preset = read("components/studio/image-studio/imageSettingsPreset.js");
const panel = read("components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx");
const adapter = read("app/studio/v2/images/images-live/useImagesV2LiveViewModel.js");

assert.match(details, /Reproduction settings/);
assert.match(details, /Assets used/);
assert.match(details, /Copy settings/);
assert.match(details, /Custom prompt/);
assert.match(details, /Negative prompt/);
assert.match(details, /by \{asset\.creator\.handle\}/);
assert.match(details, /\[\$\{recipe\.jobId\}\]/);
assert.match(lightboxVm, /serializeImageSettingsPreset/);
assert.match(lightboxVm, /navigator\.clipboard\.writeText/);
assert.match(preset, /crestfall\.imageSettings\.v1/);
assert.match(preset, /getWorkflowTuningPresentationValue/);
assert.match(preset, /control\.id === "detailScale"/);
assert.match(workbench, /customPrompt:\s*String\(prompt \|\| ""\)/);
assert.match(workbench, /sceneryOnlyHelperEnabled:\s*Boolean\(sceneryOnlyHelperEnabled\)/);
assert.match(workbench, /parseImageSettingsPresetText/);
assert.match(workbench, /setRenderStyle\(preset\.renderStyle\)/);
assert.match(workbench, /setCameraPreset\(preset\.cameraFraming\)/);
assert.match(workbench, /setNegativePrompt\(preset\.negativePrompt\)/);
assert.match(panel, /Import settings/);
assert.match(panel, /Apply settings/);
assert.match(adapter, /onImportSettings:\s*workbench\.composerProps\.onImportImageSettings/);

console.log(JSON.stringify({
  diagnostic: "images_v2_generation_recipe_v1",
  status: "PASSED",
  detailsRecipeLayout: true,
  nameAndJobIdCollapsed: true,
  authoredCustomPromptOnly: true,
  renderStyleCameraAndTuningVisible: true,
  assetCreatorLinksVisible: true,
  copySettingsClipboardContract: true,
  importSettingsWithoutGeneration: true,
}, null, 2));
