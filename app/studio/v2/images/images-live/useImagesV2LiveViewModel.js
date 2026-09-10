"use client";

import { useEffect } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { getImageStudioComposerViewProps } from "@/components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel";
import {
  getPresetCreationType,
  useImageStudioWorkbenchViewModel,
} from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";
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

// The asset word every picker and custom asset modal shows as its
// title: the tile titles ruled at browser review round 6, not the
// data labels in imageStudioData.js (Clothing Source, Location /
// Scene, Rendering Preset), which feed payloads and the legacy page.
const SLOT_DISPLAY_LABELS = Object.freeze({
  character: "Character",
  playerCharacter: "Character",
  pose: "Pose",
  outfit: "Outfit",
  location: "Location",
  preset: "Preset",
});

function getSlotDisplayLabel(slot) {
  return SLOT_DISPLAY_LABELS[slot?.id] || slot?.label || "Asset";
}

// Camera groups arrive title-cased from the catalog; the picker shows
// sentence case (Media Studio copy law).
function sentenceCase(label) {
  const text = String(label || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
}

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
      const customText = String(customPrompts[slot.id] || "");

      // A once-only custom description is a normal selection on the
      // tile, titled Custom (note 4: no inline text mode). Tapping the
      // tile reopens the picker, where the Custom card reads selected
      // and reopens the modal with this text.
      return [
        slot.id,
        {
          selection: value?.custom
            ? {
                id: String(value.id || `custom-${slot.id}`),
                title: "Custom",
                subtitle: customText,
                imageSrc: "",
              }
            : value
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
          isCustomMode: false,
          customText,
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
  // Camera framing rides the shared asset picker in its rows layout
  // (session 2 plan gate, option A): every catalog entry is an item,
  // its group is the item's quiet label, and the groups are the one
  // filter dropdown. Selection still reports through setCameraPreset.
  const cameraGroupLabelById = new Map(
    cameraPresetGroups.map((group) => [group.id, sentenceCase(group.label)])
  );
  const cameraPickerItems = cameraPresetCatalog.map((preset) => ({
    id: preset.value,
    title: preset.label,
    description: preset.description,
    subtitle: cameraGroupLabelById.get(preset.groupId) || "Automatic",
    groupId: preset.groupId,
    isSelected: preset.value === normalizedCameraPreset.value,
  }));
  const cameraPickerGroups = cameraPresetGroups.map((group) => ({
    id: group.id,
    label: cameraGroupLabelById.get(group.id) || group.label,
  }));
  const openCameraPresetPicker =
    typeof onOpenCameraPresetPicker === "function"
      ? onOpenCameraPresetPicker
      : null;

  // Custom flow (note 4): the picker's Custom card opens the custom
  // asset modal through the workbench's onStartCustomEntry; the
  // modal's "Use once" applies the text through onUseCustomOnce.
  // Both derive from workbench.pickerModalProps and
  // workbench.savePresetModalProps; only the presentation keys are
  // added here (display label, save availability).
  const pickerSlot = workbench.pickerModalProps?.slot || null;
  const pickerModalProps = workbench.pickerModalProps
    ? {
        ...workbench.pickerModalProps,
        displayLabel: getSlotDisplayLabel(pickerSlot),
        onUseCustom: workbench.composerProps.onStartCustomEntry,
      }
    : null;
  const savePresetSlot = workbench.savePresetModalProps?.slot || null;
  const savePresetModalProps = workbench.savePresetModalProps
    ? {
        ...workbench.savePresetModalProps,
        assetLabel: getSlotDisplayLabel(savePresetSlot),
        saveAvailable: Boolean(getPresetCreationType(savePresetSlot)),
        onUseOnce: workbench.composerProps.onUseCustomOnce,
      }
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
    pickerModalProps,
    savePresetModalProps,
    cameraPickerProps: {
      items: cameraPickerItems,
      groups: cameraPickerGroups,
      onSelect: workbench.composerProps.setCameraPreset,
    },
  };
}
