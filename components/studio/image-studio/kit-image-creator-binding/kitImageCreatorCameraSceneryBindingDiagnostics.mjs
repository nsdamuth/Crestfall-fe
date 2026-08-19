import assert from "node:assert/strict";
import fs from "node:fs";

import {
  KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION,
} from "../../../kit/image-creator-panel/KitImageCreatorPanel.contract.js";

import {
  CAMERA_PRESET_OPTIONS,
  CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION,
} from "../camera-presets/CameraPresetPresentation.contract.js";

import {
  LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION,
} from "../location-only-scenery/LocationOnlySceneryPresentation.contract.js";

import {
  KIT_IMAGE_CREATOR_CAMERA_SCENERY_BINDING_CONTRACT_VERSION,
  KIT_IMAGE_CREATOR_CAMERA_SCENERY_CALLBACK_KEYS,
  projectKitImageCreatorCameraSceneryBinding,
} from "./KitImageCreatorCameraSceneryBinding.contract.js";

import {
  kitImageCreatorCameraSceneryCharacterFixture,
  kitImageCreatorCameraSceneryLocationOnlyFixture,
  kitImageCreatorCameraSceneryNoCameraFieldFixture,
  kitImageCreatorCameraSceneryVideoFixture,
} from "./KitImageCreatorCameraSceneryBinding.fixtures.js";

assert.equal(
  KIT_IMAGE_CREATOR_CAMERA_SCENERY_BINDING_CONTRACT_VERSION,
  "kit_image_creator_camera_scenery_binding_v1"
);
assert.equal(CAMERA_PRESET_OPTIONS.length, 29);

const locationOnly =
  projectKitImageCreatorCameraSceneryBinding(
    kitImageCreatorCameraSceneryLocationOnlyFixture
  );

assert.equal(
  locationOnly.bindingContractVersion,
  KIT_IMAGE_CREATOR_CAMERA_SCENERY_BINDING_CONTRACT_VERSION
);
assert.equal(
  locationOnly.kitImageCreatorPanelViewContractVersion,
  KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION
);
assert.equal(
  locationOnly.cameraPresetPresentationContractVersion,
  CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  locationOnly.locationOnlySceneryPresentationContractVersion,
  LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION
);

const cameraField =
  locationOnly.kitImageCreatorPanelProps.optionFields.find(
    (field) => field.id === "camera"
  );

assert.ok(cameraField);
assert.equal(cameraField.label, "Camera / Framing");
assert.equal(cameraField.value, "MEDIUM_WIDE_SHOT");
assert.equal(cameraField.options.length, 29);
assert.equal(cameraField.options[0].value, "AUTO");
assert.equal(
  cameraField.options.at(-1).value,
  "THROUGH_VIEWFINDER"
);
assert.equal(locationOnly.camera.optionCount, 29);
assert.equal(locationOnly.camera.pickerScaleRecommended, true);
assert.equal(locationOnly.camera.currentKitFieldCompatible, true);

assert.equal(locationOnly.sceneryHelperExtension.visible, true);
assert.equal(locationOnly.sceneryHelperExtension.eligible, true);
assert.equal(locationOnly.sceneryHelperExtension.enabled, true);
assert.equal(
  locationOnly.sceneryHelperExtension.title,
  "Optimize for scenery-only image"
);
assert.match(
  locationOnly.sceneryHelperExtension.description,
  /suppresses people/i
);
assert.equal(
  locationOnly.sceneryHelperExtension.currentKitContractSupportsControl,
  false
);
assert.equal(
  locationOnly.sceneryHelperExtension.requiresFeVisualExtension,
  true
);
assert.equal(
  locationOnly.sceneryHelperExtension.recommendedPlacement,
  "IMAGE_OPTIONS_NEAR_PROMPT"
);

const withCharacter =
  projectKitImageCreatorCameraSceneryBinding(
    kitImageCreatorCameraSceneryCharacterFixture
  );
assert.equal(withCharacter.camera.selectedValue, "CLOSE_UP");
assert.equal(withCharacter.sceneryHelperExtension.visible, false);
assert.equal(withCharacter.sceneryHelperExtension.eligible, false);
assert.equal(
  withCharacter.sceneryHelperExtension.requiresFeVisualExtension,
  false
);

const video =
  projectKitImageCreatorCameraSceneryBinding(
    kitImageCreatorCameraSceneryVideoFixture
  );
assert.equal(video.sceneryHelperExtension.eligible, true);
assert.equal(video.sceneryHelperExtension.visible, false);
assert.equal(video.sceneryHelperExtension.mode, "VIDEO");

const noCamera =
  projectKitImageCreatorCameraSceneryBinding(
    kitImageCreatorCameraSceneryNoCameraFieldFixture
  );
const insertedCamera =
  noCamera.kitImageCreatorPanelProps.optionFields.find(
    (field) => field.id === "camera"
  );
assert.ok(insertedCamera);
assert.equal(insertedCamera.value, "VERTIGO_SHOT");
assert.equal(insertedCamera.options.length, 29);
assert.equal(
  noCamera.kitImageCreatorPanelProps.optionFields[1].id,
  "camera"
);

assert.deepEqual(
  KIT_IMAGE_CREATOR_CAMERA_SCENERY_CALLBACK_KEYS,
  [
    "onChangeOption",
    "onChangeSceneryOnlyHelper",
  ]
);

assert.deepEqual(locationOnly.integrationStatus, {
  cameraCanBindWithoutKitContractChange: true,
  sceneryRequiresKitContractExtension: true,
  protectedKitFilesModified: false,
  protectedV2FilesModified: false,
});

assert.deepEqual(locationOnly.architecture, {
  selectedIngredientsOwnedByChassis: true,
  cameraSelectionStateOwnedByChassis: true,
  sceneryToggleStateOwnedByChassis: true,
  generationPayloadOwnedByChassis: true,
  cameraPromptExpansionOwnedByChassis: true,
  sceneryPromptExpansionOwnedByChassis: true,
  imageGenerationSubmitOwnedByChassis: true,
  optionAndHelperVisualCompositionOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL(
    "./KitImageCreatorCameraSceneryBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "cameraPresetPrompts",
  "getCameraPresetPrompt",
  "LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT",
  "appendPromptFragment",
  "buildImageGenerationPayload",
  "submitImageGeneration",
  "useImageStudioWorkbenchViewModel",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "kit_image_creator_camera_scenery_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    KIT_IMAGE_CREATOR_CAMERA_SCENERY_BINDING_CONTRACT_VERSION,
  kitImageCreatorPanelViewContractVersion:
    KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION,
  cameraPresetPresentationContractVersion:
    CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION,
  locationOnlySceneryPresentationContractVersion:
    LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION,
  cameraCatalogCount: CAMERA_PRESET_OPTIONS.length,
  legacyCameraValueUpgradeCovered: true,
  missingCameraFieldInsertionCovered: true,
  locationOnlySceneryVisibilityCovered: true,
  sceneryKitExtensionNeedExplicitlyCarried: true,
  protectedKitContractUnmodified: true,
  protectedKitViewUnmodified: true,
  protectedV2Unmodified: true,
  generationPromptAndSubmitAuthorityExcluded: true,
}, null, 2));
