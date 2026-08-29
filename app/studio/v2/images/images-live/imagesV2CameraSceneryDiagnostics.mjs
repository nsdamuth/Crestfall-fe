import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT,
  appendPromptFragment,
  isLocationOnlyImageComposition,
} from "../../../../../components/studio/image-studio/image-studio-workbench/locationOnlySceneryPrompt.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("camera catalog expands V2 choices while legacy select compatibility stays bounded", () => {
  const data = read("components/studio/image-studio/imageStudioData.js");

  assert.match(data, /cameraPresetGroups/);
  assert.match(data, /cameraPresetCatalog/);
  assert.match(data, /EXTREME_WIDE_SHOT/);
  assert.match(data, /OVER_THE_SHOULDER_SHOT/);
  assert.match(data, /SHALLOW_DEPTH_OF_FIELD/);
  assert.match(data, /VERTIGO_SHOT/);
  assert.match(data, /cameraPresetLegacyAliases/);
  assert.match(data, /FACE_CLOSEUP: "CLOSE_UP"/);
  assert.match(data, /export const cameraPresetOptions = \[/);
});

test("camera semantics append prompt guidance and preserve backend legacy camera compatibility", () => {
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(workbench, /normalizeCameraPresetValue\(cameraPreset\)/);
  assert.match(workbench, /getCameraPresetPrompt\(normalizedCameraPreset\)/);
  assert.match(workbench, /userPrompt: resolvedUserPrompt/);
  assert.match(workbench, /cameraPreset: getLegacyCameraPresetValue\(normalizedCameraPreset\)/);
  assert.match(workbench, /shotType: normalizedCameraPreset/);
});

test("location-only scenery helper is deterministic and never applies to character compositions", () => {
  assert.equal(isLocationOnlyImageComposition({ location: { id: "loc-1" } }), true);
  assert.equal(
    isLocationOnlyImageComposition({
      location: { id: "loc-1" },
      character: { id: "char-1" },
    }),
    false
  );
  assert.equal(
    isLocationOnlyImageComposition({
      location: { id: "loc-1" },
      playerCharacter: { id: "pc-1" },
    }),
    false
  );
  assert.equal(isLocationOnlyImageComposition({}), false);
  assert.equal(
    appendPromptFragment("A brass workshop, ", "wide_shot"),
    "A brass workshop, wide_shot"
  );
  assert.match(LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT, /no_humans/);
});

test("workbench owns scenery toggle state and injects it only into generation payload construction", () => {
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(workbench, /sceneryOnlyHelperEnabled/);
  assert.match(workbench, /setSceneryOnlyHelperEnabled/);
  assert.match(workbench, /showSceneryOnlyHelper: isLocationOnlyImageComposition\(selectedIngredients\)/);
  assert.match(workbench, /sceneryOnlyHelperEnabled,/);
});

test("V2 adapter exposes camera, scenery, and live generation state without transport ownership", () => {
  const adapter = read("app/studio/v2/images/images-live/useImagesV2LiveViewModel.js");

  assert.match(adapter, /getCameraPresetDefinition/);
  assert.match(adapter, /cameraPresetCatalog/);
  assert.match(adapter, /cameraPresetGroups/);
  assert.match(adapter, /field\.id !== "camera-preset"/);
  assert.match(adapter, /onOpenCameraPresetPicker: openCameraPresetPicker/);
  assert.match(adapter, /generationStatus: workbench\.composerProps\.generationStatus/);
  assert.match(adapter, /generationError: workbench\.composerProps\.generationError/);
  assert.match(adapter, /showSceneryOnlyHelper: workbench\.composerProps\.showSceneryOnlyHelper/);
  assert.match(adapter, /setSceneryOnlyHelperEnabled/);
  assert.doesNotMatch(adapter, /fetch\s*\(/);
  assert.doesNotMatch(adapter, /supabase/i);
  assert.doesNotMatch(adapter, /postgraphile/i);
});

test("V2 Kit creator preserves camera, generation, and scenery bindings through its ViewModel", () => {
  const panelViewModel = read(
    "components/kit/image-creator-panel/useKitImageCreatorPanelViewModel.js"
  );

  assert.match(panelViewModel, /generationStatus: String\(generationStatus \|\| "idle"\)/);
  assert.match(panelViewModel, /generationError: generationError \|\| ""/);
  assert.match(panelViewModel, /cameraPresetLabel: cameraPresetLabel \|\| "Auto \/ No Camera Filter"/);
  assert.match(panelViewModel, /cameraPresetDescription: cameraPresetDescription \|\| ""/);
  assert.ok((panelViewModel.match(/onOpenCameraPresetPicker/g) || []).length >= 2);
  assert.match(panelViewModel, /showSceneryOnlyHelper: Boolean\(showSceneryOnlyHelper\)/);
  assert.match(panelViewModel, /sceneryOnlyHelperEnabled: Boolean\(sceneryOnlyHelperEnabled\)/);
  assert.ok((panelViewModel.match(/onChangeSceneryOnlyHelper/g) || []).length >= 2);
});

test("V2 Kit creator renders the camera launcher in the same compact Options row grammar", () => {
  const panel = read("components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx");
  const contract = read("components/kit/image-creator-panel/KitImageCreatorPanel.contract.js");

  assert.match(panel, /function CameraPresetTrigger/);
  assert.match(panel, /aria-haspopup="dialog"/);
  assert.match(panel, /min-h-\[var\(--control-filter\)\]/);
  assert.match(panel, /Camera \/ Framing/);
  assert.match(panel, /Optimize for scenery-only image/);
  assert.match(panel, /generationStatus === "loading"/);
  assert.match(panel, /Generate another image/);
  assert.match(panel, /role="alert"/);
  assert.match(contract, /KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION = "\d+\.\d+\.\d+"/);
  assert.match(contract, /onOpenCameraPresetPicker/);
  assert.match(contract, /showSceneryOnlyHelper/);
});

test("V2 camera picker uses current Kit modal vocabulary rather than the legacy camera modal", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  const picker = read("app/studio/v2/images/images-live/ImagesV2CameraPresetPicker.jsx");

  assert.match(live, /ImagesV2CameraPresetPicker/);
  assert.match(live, /onOpenCameraPresetPicker: openCameraPresetPicker/);
  assert.match(live, /onClose=\{closeCameraPresetPicker\}/);
  assert.doesNotMatch(live, /CameraPresetPickerModal/);
  assert.match(picker, /KitModalFrame/);
  assert.match(picker, /Search camera presets/);
  assert.match(picker, /Automatic/);
  assert.match(picker, /min-\[760px\]:grid-cols-2/);
  assert.doesNotMatch(picker, /min-h-\[7rem\]/);
  assert.doesNotMatch(picker, /grid-cols-3/);
  assert.match(picker, /No camera presets match this search/);
  assert.doesNotMatch(picker, /ModalShell/);
  assert.doesNotMatch(picker, /fetch\s*\(/);
});
