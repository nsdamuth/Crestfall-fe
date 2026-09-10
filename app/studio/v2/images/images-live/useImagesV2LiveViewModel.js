"use client";

import { useEffect } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { getImageStudioComposerViewProps } from "@/components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel";
import { useImageStudioWorkbenchViewModel } from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";
import { getFirstCreationMediaUrl } from "@/lib/shared/creations/creationMedia";
import {
  IMAGE_COUNT_BACKEND_MAX,
  cameraPresetCatalog,
  cameraPresetGroups,
  getCameraPresetDefinition,
  imageCountOptions,
  ingredientSlots,
  videoAspectRatioOptions,
  videoDurationOptions,
  videoMotionStyleOptions,
} from "@/components/studio/image-studio/imageStudioData";

// Any action the backend cannot do yet renders disabled with these
// words and never fakes a result (Media Studio brief, 9 Sep 2026;
// gaps listed in docs/handoffs/MEDIA-STUDIO-BACKEND.md).
const NOT_AVAILABLE_LABEL = "Not available yet";

// Output-count rows the backend cannot serve read "Soon", RULED
// 10 Sep 2026 (browser review round 6, screenshot): the short chip
// leaves the count label room, matching the Video toggle's Soon.
const COUNT_SOON_LABEL = "Soon";

// Sentence-case display labels for the inline option dropdowns
// (Brian's note 2). Ids and handlers are unchanged (contract law).
const INLINE_OPTION_LABELS = Object.freeze({
  "wardrobe-theme": "Wardrobe theme",
  "aspect-ratio": "Aspect ratio",
});

// The composer's untouched starting values, mirroring the workbench
// ViewModel's initial state. The panel reads these to decide whether
// a control still sits at its default (dim ink) or the user changed
// it (gold), RULED at browser review round 3 item 2.
const INLINE_OPTION_DEFAULTS = Object.freeze({
  "wardrobe-theme": "AUTO",
  "aspect-ratio": "PORTRAIT_4_5",
});

const DEFAULT_CAMERA_PRESET_VALUE = "AUTO";

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
                imageSrc: String(
                  getFirstCreationMediaUrl(
                    value.featuredMedia || value.featured_media || [],
                    {
                      variant: "thumbnail",
                      fallback:
                        value.thumbnailUrl ||
                        value.thumbnail_url ||
                        value.imageUrl ||
                        value.image_url ||
                        "",
                    }
                  ) || ""
                ),
              }
            : null,
          isCustomMode: Boolean(value?.custom),
          customText: String(customPrompts[slot.id] || ""),
        },
      ];
    })
  );
}

export function useImagesV2LiveViewModel({
  onOpenCameraPresetPicker,
  stage = "GENERATE",
  onChangeStage = null,
} = {}) {
  const account = useStudioAccount();
  const workbench = useImageStudioWorkbenchViewModel({ account });
  const { composerProps } = workbench;
  const { renderStyle, setRenderStyle } = composerProps;

  useEffect(() => {
    if (renderStyle === "auto") {
      setRenderStyle?.("crestfall_fantasy");
    }
  }, [renderStyle, setRenderStyle]);

  const composer = getImageStudioComposerViewProps(composerProps);

  // No manual memo: the React Compiler memoizes this projection itself
  // (its preserve-manual-memoization rule rejected the hand-written one).
  const slots = projectSlotStates(composerProps);

  const imageOptionFields = composer.imageOptionFields
    .filter((field) => Boolean(INLINE_OPTION_LABELS[field.id]))
    .map((field) => ({
      id: field.id,
      label: INLINE_OPTION_LABELS[field.id],
      value: field.value,
      defaultValue: INLINE_OPTION_DEFAULTS[field.id],
      options: field.options,
    }));

  const imageOptionById = new Map(
    composer.imageOptionFields.map((field) => [field.id, field])
  );

  // Output count beside the Generate button. Counts the backend
  // cannot serve render disabled; the selection still reports to the
  // same handler the former Output Count select used.
  const countOptions = imageCountOptions.map((option) => {
    const count = Number.parseInt(option.value, 10) || 0;
    const isDisabled = count > IMAGE_COUNT_BACKEND_MAX;
    return {
      value: String(option.value),
      label: String(option.label),
      ...(isDisabled ? { isDisabled: true, tooltip: COUNT_SOON_LABEL } : {}),
    };
  });
  const countValue = String(composerProps.imageCount || "");
  const requestedCount = Math.max(1, Number.parseInt(countValue, 10) || 1);
  const perImageCoinCost = Number(composerProps.coinCost ?? 0) || 0;
  const generateCostLabel = String(requestedCount * perImageCoinCost);

  const videoModeOption = composer.modeOptions.find((option) => option.id === "VIDEO");
  const videoDisabled = Boolean(videoModeOption?.disabled ?? true);

  const videoOptionFields = [
    {
      id: "video-duration",
      label: "Duration",
      value: String(workbench.composerProps.videoDuration || "4"),
      options: normalizeOptions(videoDurationOptions),
    },
    {
      id: "video-aspect",
      label: "Video aspect",
      value: String(workbench.composerProps.videoAspectRatio || "PORTRAIT"),
      options: normalizeOptions(videoAspectRatioOptions),
    },
    {
      id: "video-motion",
      label: "Motion style",
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
      videoDisabled,
      videoSoonLabel: "Soon",
      stage,
      onChangeStage,
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
      renderStyleRailProps: composer.renderStyleRailProps,
      optionFields: imageOptionFields,
      onChangeOption: (fieldId, value) =>
        imageOptionById.get(fieldId)?.onChange?.(value),
      advancedTuningProps: composer.advancedTuningProps,
      countOptions,
      countValue,
      onChangeCount: (value) => imageOptionById.get("image-count")?.onChange?.(value),
      generateCostLabel,
      canGenerate: composer.canGenerateImage,
      generationHelpText: composer.generationHelpText,
      generationStatus: workbench.composerProps.generationStatus,
      generationError: workbench.composerProps.generationError,
      cameraPresetLabel: normalizedCameraPreset.label,
      cameraPresetDescription: normalizedCameraPreset.description,
      cameraPresetChanged: normalizedCameraPreset.value !== DEFAULT_CAMERA_PRESET_VALUE,
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
