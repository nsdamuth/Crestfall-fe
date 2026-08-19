import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CAMERA_PRESET_GROUPS,
  CAMERA_PRESET_OPTIONS,
  CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION,
  getCameraPresetPresentationOption,
  normalizeCameraPresetPresentationValue,
  projectCameraPresetPickerPresentation,
} from "./CameraPresetPresentation.contract.js";
import {
  cameraPresetDefaultFixture,
  cameraPresetEmptySearchFixture,
  cameraPresetLegacyValueFixture,
  cameraPresetSearchFixture,
  cameraPresetSpecializedFixture,
} from "./CameraPresetPresentation.fixtures.js";

assert.equal(CAMERA_PRESET_OPTIONS.length, 29);
assert.equal(CAMERA_PRESET_GROUPS.length, 7);
assert.equal(CAMERA_PRESET_OPTIONS[0].value, "AUTO");

const defaultProjection = projectCameraPresetPickerPresentation(
  cameraPresetDefaultFixture
);
assert.equal(
  defaultProjection.contractVersion,
  CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION
);
assert.equal(defaultProjection.catalogSize, 29);
assert.equal(defaultProjection.groupCount, 7);
assert.equal(defaultProjection.selectedValue, "MEDIUM_WIDE_SHOT");
assert.equal(defaultProjection.selectedOption.label, "Medium Wide Shot (MWS)");
assert.equal(defaultProjection.picker.items.length, 29);
assert.deepEqual(defaultProjection.picker.selectedIds, [
  "MEDIUM_WIDE_SHOT",
]);

const legacyProjection = projectCameraPresetPickerPresentation(
  cameraPresetLegacyValueFixture
);
assert.equal(legacyProjection.selectedValue, "MEDIUM_WIDE_SHOT");
assert.equal(
  normalizeCameraPresetPresentationValue("FACE_CLOSEUP"),
  "CLOSE_UP"
);
assert.equal(
  normalizeCameraPresetPresentationValue("HEAD_SHOULDERS"),
  "MEDIUM_CLOSE_UP"
);
assert.equal(
  normalizeCameraPresetPresentationValue("FULL_BODY"),
  "WIDE_SHOT"
);
assert.equal(
  normalizeCameraPresetPresentationValue("not-a-real-preset"),
  "AUTO"
);

const searchProjection = projectCameraPresetPickerPresentation(
  cameraPresetSearchFixture
);
assert.equal(searchProjection.groups.length, 3);
const focusGroup = searchProjection.groups.find(
  (group) => group.id === "focus"
);
assert.ok(focusGroup);
assert.equal(focusGroup.options.length, 3);
assert.equal(searchProjection.picker.items.length, 6);
assert.equal(
  searchProjection.picker.items.some(
    (item) => item.id === "DEEP_FOCUS" && item.selected
  ),
  true
);

const specializedProjection = projectCameraPresetPickerPresentation(
  cameraPresetSpecializedFixture
);
assert.equal(specializedProjection.groups.length, 1);
assert.equal(specializedProjection.groups[0].id, "specialized");
assert.equal(specializedProjection.picker.items.length, 1);
assert.equal(specializedProjection.picker.items[0].id, "VERTIGO_SHOT");

const emptyProjection = projectCameraPresetPickerPresentation(
  cameraPresetEmptySearchFixture
);
assert.equal(emptyProjection.groups.length, 0);
assert.equal(emptyProjection.picker.items.length, 0);
assert.equal(
  emptyProjection.picker.emptyMessage,
  "No camera presets match this search."
);

assert.equal(
  getCameraPresetPresentationOption("RACK_FOCUS").groupId,
  "focus"
);

for (const option of CAMERA_PRESET_OPTIONS) {
  assert.equal(Object.hasOwn(option, "prompt"), false);
  assert.equal(Object.hasOwn(option, "legacyCameraPreset"), false);
}

const source = fs.readFileSync(
  new URL("./CameraPresetPresentation.contract.js", import.meta.url),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "getCameraPresetPrompt",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic: "camera_preset_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION,
  catalogSize: CAMERA_PRESET_OPTIONS.length,
  groupCount: CAMERA_PRESET_GROUPS.length,
  legacyAliasNormalizationCovered: true,
  broadSearchProjectionCovered: true,
  pickerScaleConfirmed: CAMERA_PRESET_OPTIONS.length > 12,
  generationPromptExcluded: true,
}, null, 2));
