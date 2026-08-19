import {
  KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION,
} from "../../../kit/image-creator-panel/KitImageCreatorPanel.contract.js";

import {
  CAMERA_PRESET_OPTIONS,
  CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION,
  normalizeCameraPresetPresentationValue,
} from "../camera-presets/CameraPresetPresentation.contract.js";

import {
  LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION,
  projectLocationOnlySceneryPresentation,
} from "../location-only-scenery/LocationOnlySceneryPresentation.contract.js";

export const KIT_IMAGE_CREATOR_CAMERA_SCENERY_BINDING_CONTRACT_VERSION =
  "kit_image_creator_camera_scenery_binding_v1";

export const KIT_IMAGE_CREATOR_CAMERA_SCENERY_CALLBACK_KEYS = Object.freeze([
  "onChangeOption",
  "onChangeSceneryOnlyHelper",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isCameraField(field = {}) {
  const source = object(field);
  const id = text(source.id).toLowerCase();
  const label = text(source.label).toLowerCase();

  return (
    [
      "camera",
      "camerapreset",
      "camera-preset",
      "camera-framing",
    ].includes(id) ||
    label === "camera / framing"
  );
}

function buildCameraField({
  currentField = null,
  cameraPresetValue = "AUTO",
} = {}) {
  const source = object(currentField);

  return {
    ...source,
    id: text(source.id) || "camera",
    label: "Camera / Framing",
    value: normalizeCameraPresetPresentationValue(
      cameraPresetValue || source.value
    ),
    options: CAMERA_PRESET_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  };
}

export function projectKitImageCreatorCameraSceneryBinding({
  kitPanelProps = {},
  cameraPresetValue = "AUTO",
  selectedIngredients = {},
  sceneryOnlyHelperEnabled = true,
  callbacks = {},
} = {}) {
  const panel = object(kitPanelProps);
  const callbackSource = object(callbacks);
  const sourceFields = array(panel.optionFields);
  const cameraIndex = sourceFields.findIndex(isCameraField);
  const cameraField = buildCameraField({
    currentField:
      cameraIndex >= 0 ? sourceFields[cameraIndex] : null,
    cameraPresetValue,
  });

  const optionFields =
    cameraIndex >= 0
      ? sourceFields.map((field, index) =>
          index === cameraIndex ? cameraField : field
        )
      : [
          ...sourceFields.slice(0, 1),
          cameraField,
          ...sourceFields.slice(1),
        ];

  const sceneryHelper =
    projectLocationOnlySceneryPresentation({
      mode: panel.mode || "IMAGE",
      selectedIngredients,
      enabled: sceneryOnlyHelperEnabled,
    });

  return {
    bindingContractVersion:
      KIT_IMAGE_CREATOR_CAMERA_SCENERY_BINDING_CONTRACT_VERSION,
    kitImageCreatorPanelViewContractVersion:
      KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION,
    cameraPresetPresentationContractVersion:
      CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION,
    locationOnlySceneryPresentationContractVersion:
      LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION,

    kitImageCreatorPanelProps: {
      ...panel,
      optionFields,
      onChangeOption:
        callbackSource.onChangeOption ||
        panel.onChangeOption ||
        null,
    },

    camera: {
      fieldId: cameraField.id,
      fieldLabel: cameraField.label,
      selectedValue: cameraField.value,
      optionCount: cameraField.options.length,
      options: cameraField.options,
      pickerScaleRecommended:
        cameraField.options.length > 12,
      currentKitFieldCompatible: true,
    },

    sceneryHelperExtension: {
      ...sceneryHelper,
      onChangeEnabled:
        callbackSource.onChangeSceneryOnlyHelper || null,
      currentKitContractSupportsControl: false,
      requiresFeVisualExtension:
        sceneryHelper.visible,
      recommendedPlacement:
        "IMAGE_OPTIONS_NEAR_PROMPT",
    },

    integrationStatus: {
      cameraCanBindWithoutKitContractChange: true,
      sceneryRequiresKitContractExtension: true,
      protectedKitFilesModified: false,
      protectedV2FilesModified: false,
    },

    architecture: {
      selectedIngredientsOwnedByChassis: true,
      cameraSelectionStateOwnedByChassis: true,
      sceneryToggleStateOwnedByChassis: true,
      generationPayloadOwnedByChassis: true,
      cameraPromptExpansionOwnedByChassis: true,
      sceneryPromptExpansionOwnedByChassis: true,
      imageGenerationSubmitOwnedByChassis: true,
      optionAndHelperVisualCompositionOwnedByFe: true,
    },
  };
}
