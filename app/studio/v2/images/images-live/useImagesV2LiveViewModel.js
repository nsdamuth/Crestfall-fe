"use client";

import { useMemo } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { getImageStudioComposerViewProps } from "@/components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel";
import { useImageStudioWorkbenchViewModel } from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";
import {
  cameraPresetCatalog,
  cameraPresetGroups,
  getCameraPresetDefinition,
  ingredientSlots,
  videoAspectRatioOptions,
  videoDurationOptions,
  videoMotionStyleOptions,
} from "@/components/studio/image-studio/imageStudioData";

function normalizeOptions(options = []) {
  return options.map((option) => ({
    value: String(option?.value || ""),
    label: String(option?.label || option?.value || "Option"),
  }));
}

function getSlot(slotId) {
  return ingredientSlots.find((slot) => slot.id === slotId) || null;
}

function projectSlotStates(composerProps) {
  const selected = composerProps?.selectedIngredients || {};
  const customPrompts = composerProps?.customIngredientPrompts || {};

  return Object.fromEntries(
    ingredientSlots.map((slot) => {
      const value = selected[slot.id] || null;

      return [
        slot.id,
        {
          selection: value
            ? {
                id: String(value.id || ""),
                title: String(value.title || slot.label),
                subtitle: String(value.subtitle || value.type || ""),
                imageSrc: String(value.imageUrl || value.image_url || ""),
              }
            : null,
          isCustomMode: Boolean(value?.custom),
          customText: String(customPrompts[slot.id] || ""),
        },
      ];
    })
  );
}

export function useImagesV2LiveViewModel({ onOpenCameraPresetPicker } = {}) {
  const account = useStudioAccount();
  const workbench = useImageStudioWorkbenchViewModel({ account });
  const composer = getImageStudioComposerViewProps(workbench.composerProps);

  const slots = useMemo(
    () => projectSlotStates(workbench.composerProps),
    [
      workbench.composerProps.selectedIngredients,
      workbench.composerProps.customIngredientPrompts,
    ]
  );

  const imageOptionFields = composer.imageOptionFields
    .filter((field) => field.id !== "camera-preset")
    .map((field) => ({
      id: field.id,
      label: field.label,
      value: field.value,
      options: field.options,
    }));

  const imageOptionById = new Map(
    composer.imageOptionFields.map((field) => [field.id, field])
  );

  const videoOptionFields = [
    {
      id: "video-duration",
      label: "Duration",
      value: String(workbench.composerProps.videoDuration || "4"),
      options: normalizeOptions(videoDurationOptions),
    },
    {
      id: "video-aspect",
      label: "Video Aspect",
      value: String(workbench.composerProps.videoAspectRatio || "PORTRAIT"),
      options: normalizeOptions(videoAspectRatioOptions),
    },
    {
      id: "video-motion",
      label: "Motion Style",
      value: String(workbench.composerProps.videoMotionStyle || "SUBTLE"),
      options: normalizeOptions(videoMotionStyleOptions),
    },
  ];

  function changeVideoOption(fieldId, value) {
    if (fieldId === "video-duration") {
      workbench.composerProps.setVideoDuration?.(value);
    } else if (fieldId === "video-aspect") {
      workbench.composerProps.setVideoAspectRatio?.(value);
    } else if (fieldId === "video-motion") {
      workbench.composerProps.setVideoMotionStyle?.(value);
    }
  }

  function activateSlot(slotId) {
    const slot = getSlot(slotId);
    if (slot) workbench.composerProps.onOpenIngredient?.(slot);
  }

  function saveCustomSlot(slotId) {
    const slot = getSlot(slotId);
    if (slot) workbench.composerProps.onSaveCustomIngredient?.(slot);
  }

  const normalizedCameraPreset = getCameraPresetDefinition(
    workbench.composerProps.cameraPreset
  );
  const cameraPickerGroups = cameraPresetGroups.map((group) => ({
    id: group.id,
    label: group.label,
    options: cameraPresetCatalog
      .filter((preset) => preset.groupId === group.id)
      .map((preset) => ({
        value: preset.value,
        label: preset.label,
        description: preset.description,
        selected: preset.value === normalizedCameraPreset.value,
      })),
  }));
  const autoCameraPreset = cameraPresetCatalog.find(
    (preset) => preset.value === "AUTO"
  );
  const openCameraPresetPicker =
    typeof onOpenCameraPresetPicker === "function"
      ? onOpenCameraPresetPicker
      : null;

  return {
    mediaHistoryProps: workbench.mediaHistoryProps,
    panelProps: {
      mode: composer.mode,
      onChangeMode: composer.onChangeMode,
      slots,
      onSlotActivate: activateSlot,
      onSlotClear: workbench.composerProps.onClearIngredient,
      onCustomChangeText: workbench.composerProps.onUpdateCustomIngredientPrompt,
      onCustomBackToPresets: activateSlot,
      onCustomSavePreset: saveCustomSlot,
      promptValue: composer.promptValue,
      onChangePrompt: composer.onChangePrompt,
      negativePromptValue: composer.negativePromptValue,
      onChangeNegativePrompt: composer.onChangeNegativePrompt,
      optionFields: imageOptionFields,
      onChangeOption: (fieldId, value) =>
        imageOptionById.get(fieldId)?.onChange?.(value),
      advancedTuningProps: composer.advancedTuningProps,
      coinBalanceLabel: composer.coinBalanceLabel,
      coinCostLabel: composer.coinCostLabel,
      showInsufficientCoins: composer.showInsufficientCoins,
      canGenerate: composer.canGenerateImage,
      generationHelpText: composer.generationHelpText,
      generationStatus: workbench.composerProps.generationStatus,
      generationError: workbench.composerProps.generationError,
      cameraPresetLabel: normalizedCameraPreset.label,
      cameraPresetDescription: normalizedCameraPreset.description,
      onOpenCameraPresetPicker: openCameraPresetPicker,
      showSceneryOnlyHelper: workbench.composerProps.showSceneryOnlyHelper,
      sceneryOnlyHelperEnabled: workbench.composerProps.sceneryOnlyHelperEnabled,
      onChangeSceneryOnlyHelper:
        workbench.composerProps.setSceneryOnlyHelperEnabled,
      onGenerate: composer.onGenerateImage,
      videoOptionFields,
      onChangeVideoOption: changeVideoOption,
      videoDirectionValue: composer.promptValue,
      onChangeVideoDirection: composer.onChangePrompt,
    },
    pickerModalProps: workbench.pickerModalProps,
    savePresetModalProps: workbench.savePresetModalProps,
    cameraPickerProps: {
      autoOption: autoCameraPreset
        ? {
            value: autoCameraPreset.value,
            label: autoCameraPreset.label,
            description: autoCameraPreset.description,
            selected: normalizedCameraPreset.value === "AUTO",
          }
        : null,
      groups: cameraPickerGroups,
      onSelect: workbench.composerProps.setCameraPreset,
    },
  };
}
