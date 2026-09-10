"use client";

import { useEffect, useState } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { getImageStudioComposerViewProps } from "@/components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel";
import {
  getPresetCreationType,
  useImageStudioWorkbenchViewModel,
} from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";
import { getFirstCreationMediaUrl } from "@/lib/shared/creations/creationMedia";
import {
  IMAGE_COUNT_BACKEND_MAX,
  REMIX_MAX_CHARACTERS,
  cameraPresetCatalog,
  cameraPresetGroups,
  getCameraPresetDefinition,
  imageCountOptions,
  ingredientSlots,
  remixCharacterSlots,
  remixIngredientSlots,
  remixLocationSlots,
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

// The composer's five slots plus the Remix slots (session 4) are all
// ordinary ingredient slots in the workbench; the picker and the
// custom modal key on the slot object either way.
const ALL_SLOTS = [...ingredientSlots, ...remixIngredientSlots];

function getSlot(slotId) {
  return ALL_SLOTS.find((slot) => slot.id === slotId) || null;
}

// A once-only custom description is a normal selection on the tile,
// titled Custom (note 4: no inline text mode). Tapping the tile
// reopens the picker, where the Custom card reads selected and
// reopens the modal with this text.
function projectSelection(value, slot, customText) {
  if (!value) return null;
  if (value.custom) {
    return {
      id: String(value.id || `custom-${slot.id}`),
      title: "Custom",
      subtitle: customText,
      imageSrc: "",
    };
  }
  return {
    id: String(value.id || ""),
    title: String(value.title || slot.label),
    subtitle: String(value.subtitle || value.type || ""),
    imageSrc: String(
      getFirstCreationMediaUrl(value.featuredMedia || value.featured_media || [], {
        variant: "thumbnail",
        fallback:
          value.thumbnailUrl ||
          value.thumbnail_url ||
          value.imageUrl ||
          value.image_url ||
          "",
      }) || ""
    ),
  };
}

function projectSlotStates(composerProps) {
  const selected = composerProps?.selectedIngredients || {};
  const customPrompts = composerProps?.customIngredientPrompts || {};

  return Object.fromEntries(
    ingredientSlots.map((slot) => {
      const value = selected[slot.id] || null;
      const customText = String(customPrompts[slot.id] || "");

      return [
        slot.id,
        {
          selection: projectSelection(value, slot, customText),
          isCustomMode: false,
          customText,
        },
      ];
    })
  );
}

// Remix (session 4, notes 5, 5a, 5b; RULED A and A of three at the
// plan gate): its own slots, independent of Generate's, sharing only
// the picker, the custom modal, the count, and the footer. Mention
// handles bind to slot position (@img1 is slot 1 for the life of the
// selection); the location is @location. The limit line is the one
// place the number is written, computed from the constant.
const REMIX_ADD_LIMIT_LABEL = `Up to ${REMIX_MAX_CHARACTERS} characters`;

function getRemixMention(slot) {
  return slot.remixKind === "location" ? "@location" : `@img${slot.remixPosition}`;
}

function projectRemix({ composerProps, remixPrompt, setRemixPrompt, requestedCount }) {
  const selected = composerProps?.selectedIngredients || {};
  const customPrompts = composerProps?.customIngredientPrompts || {};
  const remixCoinCost = Number(composerProps?.remixCoinCost ?? 0) || 0;
  const coinBalance = Number(composerProps?.coinBalance ?? 0) || 0;

  const references = remixCharacterSlots
    .map((slot) => {
      const selection = projectSelection(
        selected[slot.id] || null,
        slot,
        String(customPrompts[slot.id] || "")
      );
      return selection
        ? { slotId: slot.id, position: slot.remixPosition, mention: getRemixMention(slot), selection }
        : null;
    })
    .filter(Boolean);

  const locationSlot = remixLocationSlots[0];
  const location = {
    slotId: locationSlot.id,
    mention: getRemixMention(locationSlot),
    selection: projectSelection(
      selected[locationSlot.id] || null,
      locationSlot,
      String(customPrompts[locationSlot.id] || "")
    ),
  };

  const firstEmptyCharacterSlot =
    remixCharacterSlots.find((slot) => !selected[slot.id]) || null;
  const requestCoinCost = remixCoinCost * requestedCount;
  const hasEnoughCoins = coinBalance >= requestCoinCost;
  const hasPrompt = String(remixPrompt || "").trim().length > 0;

  // Block reasons in Generate's order and voice: coins, then inputs.
  const blockReason = !hasEnoughCoins
    ? `You need at least ${requestCoinCost} coins to remix ${
        requestedCount === 1 ? "an image" : `${requestedCount} images`
      }.`
    : references.length === 0
      ? "Add at least one character before generating."
      : !hasPrompt
        ? "Describe the scene before generating."
        : "";

  return {
    references,
    canAddCharacter: Boolean(firstEmptyCharacterSlot),
    addLimitLabel: REMIX_ADD_LIMIT_LABEL,
    location,
    onAddCharacter: () => {
      if (firstEmptyCharacterSlot) composerProps.onOpenIngredient?.(firstEmptyCharacterSlot);
    },
    onChangeCharacter: (slotId) => {
      const slot = getSlot(slotId);
      if (slot) composerProps.onOpenIngredient?.(slot);
    },
    onRemoveCharacter: (slotId) => composerProps.onClearIngredient?.(slotId),
    onSelectLocation: () => composerProps.onOpenIngredient?.(locationSlot),
    onClearLocation: () => composerProps.onClearIngredient?.(locationSlot.id),
    promptValue: remixPrompt,
    onChangePrompt: setRemixPrompt,
    mentionOptions: [
      ...references.map((reference) => ({
        mention: reference.mention,
        title: reference.selection.title,
        imageSrc: reference.selection.imageSrc || "",
      })),
      ...(location.selection
        ? [
            {
              mention: location.mention,
              title: location.selection.title,
              imageSrc: location.selection.imageSrc || "",
            },
          ]
        : []),
    ],
    generateCostLabel: String(requestCoinCost),
    canGenerate: !blockReason,
    generationHelpText: blockReason,
    // The Chassis generation job holds one character and rejects a
    // second (IMAGE_GENERATION_MULTIPLE_VISUAL_SUBJECTS_NOT_SUPPORTED)
    // and reads no reference list; Remix Generate renders Soon until
    // the job in docs/handoffs/MEDIA-STUDIO-BACKEND.md gap 13 lands.
    // Nothing fakes a result or spends coins.
    available: false,
    onGenerate: null,
  };
}

export function useImagesV2LiveViewModel({
  onOpenCameraPresetPicker,
  stage = "GENERATE",
  onChangeStage = null,
} = {}) {
  const account = useStudioAccount();
  // One image by default (Brian's browser note, 10 Sep 2026): the
  // footer starts at one image's cost, 5 on Generate, 20 on Remix.
  const workbench = useImageStudioWorkbenchViewModel({ account, initialImageCount: "1" });
  const { composerProps } = workbench;
  const { renderStyle, setRenderStyle } = composerProps;
  // The Remix prompt is page state: the rail and the sheet both read
  // this one panelProps, so it survives the width change.
  const [remixPrompt, setRemixPrompt] = useState("");

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
  // same handler the former Output Count select used. This page's list
  // (Brian's browser note, 10 Sep 2026, superseding the 9 Sep plan
  // gate list) starts at 1 image and ends at 128; the shared
  // imageCountOptions the Location and Asset builders read is
  // untouched.
  const countOptions = [
    { value: "1", label: "1 image" },
    ...imageCountOptions.filter((option) => String(option.value) !== "256"),
  ].map((option) => {
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

  const remix = projectRemix({ composerProps, remixPrompt, setRemixPrompt, requestedCount });

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
      remix,
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
