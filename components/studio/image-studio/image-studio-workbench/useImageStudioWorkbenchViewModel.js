"use client";

import { useState } from "react";
import {
  getCameraPresetPrompt,
  getLegacyCameraPresetValue,
  normalizeCameraPresetValue,
} from "../imageStudioData.js";
import {
  LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT,
  appendPromptFragment,
  isLocationOnlyImageComposition,
} from "./locationOnlySceneryPrompt.js";

import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";
import { useImageGenerationHistory } from "@/components/studio/image-studio/hooks/useImageGenerationHistory";
import { useImageGenerationJob } from "@/components/studio/image-studio/hooks/useImageGenerationJob";
import { useImageStudioIngredientOptions } from "@/components/studio/image-studio/hooks/useImageStudioIngredientOptions";

export const IMAGE_GENERATION_COIN_COST = 5;

export const ASPECT_RATIO_BY_COMPOSER_VALUE = Object.freeze({
  PORTRAIT_4_5: "4:5",
  LANDSCAPE_5_4: "5:4",
  PORTRAIT_9_16: "9:16",
  LANDSCAPE_16_9: "16:9",
  SQUARE_1_1: "1:1",

  // Legacy safety for old local state / old payloads.
  PORTRAIT: "3:4",
  SQUARE: "1:1",
  LANDSCAPE: "16:9",
});

export const LEGACY_RENDERING_STYLE_BY_PROFILE = Object.freeze({
  auto: "auto",
  crestfall_fantasy: "anime",
  crestfall_realistic: "realistic",
  crestfall_anime_anime: "anime",
  crestfall_fantasy_realistic: "realistic",
  crestfall_realistic_fantasy: "realistic",
});

export const REALISTIC_PROFILE_KEYS = new Set([
  "crestfall_realistic",
  "crestfall_fantasy_realistic",
  "crestfall_realistic_fantasy",
]);

export const PRESET_CREATION_TYPE_BY_SLOT_ID = Object.freeze({
  pose: "POSE",
  outfit: "OUTFIT",
  location: "LOCATION",
  preset: "IMAGE_PRESET",
});

export function getLegacyRenderingStyle(renderProfileKey) {
  return LEGACY_RENDERING_STYLE_BY_PROFILE[renderProfileKey] || "auto";
}

export function getPromptMode(renderProfileKey) {
  return REALISTIC_PROFILE_KEYS.has(renderProfileKey) ? "natural" : "tags";
}

export function getModelProfile(renderProfileKey) {
  return REALISTIC_PROFILE_KEYS.has(renderProfileKey)
    ? "realistic_default"
    : "anime_default";
}

export function makeCustomIngredient(slot) {
  return {
    id: `custom-${slot.id}`,
    title: `Custom ${slot.label}`,
    subtitle: "Custom prompt fragment for this request",
    type: slot.label,
    contentRating: "SFW",
    custom: true,
  };
}

export function getSelectedCreationId(item) {
  if (!item || item.custom) return null;

  return item.id || null;
}

export function getCustomIngredientText(customIngredientPrompts, slotId) {
  return typeof customIngredientPrompts[slotId] === "string"
    ? customIngredientPrompts[slotId].trim()
    : "";
}

export function makeAssetOnlyIngredient(item) {
  const assetId = getSelectedCreationId(item);

  if (!assetId) {
    return {
      mode: "none",
    };
  }

  return {
    mode: "asset",
    assetId,
  };
}

export function makeOptionalIngredient({ item, customText }) {
  const assetId = getSelectedCreationId(item);

  if (assetId) {
    return {
      mode: "asset",
      assetId,
    };
  }

  if (item?.custom && customText) {
    return {
      mode: "custom",
      text: customText,
    };
  }

  return {
    mode: "none",
  };
}

export function parsePresetTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getPresetCreationType(slot) {
  return PRESET_CREATION_TYPE_BY_SLOT_ID[slot?.id] || null;
}

export function buildPresetDraftPayload({
  slot,
  name,
  description,
  tags,
  promptValue,
}) {
  const creationType = getPresetCreationType(slot);
  const promptGuidance = String(promptValue || "").trim();
  const title = String(name || "").trim() || `Custom ${slot?.label || "Preset"}`;
  const summary =
    String(description || "").trim() ||
    promptGuidance ||
    `A reusable ${slot?.label || "Image Studio"} preset.`;

  if (!creationType) {
    throw new Error("This custom ingredient cannot be saved as a preset yet.");
  }

  if (!promptGuidance) {
    throw new Error("Add prompt guidance before saving this preset.");
  }

  const outfitDefaults =
    creationType === "OUTFIT"
      ? {
          clothing_mode: "NORMAL",
          normal_clothing_prompt: promptGuidance,
          clothing_sections: {},
          signature_clothing: "",
          image_prompt: "",
          negative_prompt: "",
        }
      : {};

  const locationDefaults =
    creationType === "LOCATION"
      ? {
          parentLocationId: "",
          parentLocationTitle: "",
          parentLocationDescription: "",
          parentLocationImageUrl: "",
          parentLocationScale: "",
          parentLocationSpaceType: "",
          inheritance: {
            inheritsWeather: true,
            inheritsTime: true,
            inheritsKnowledgeRules: true,
            inheritsTravelRules: true,
          },
          engine_module_bindings: [],
          boundRegistries: {
            eventRegistryIds: [],
            questRegistryIds: [],
            npcRegistryIds: [],
            itemRegistryIds: [],
            locationRegistryIds: [],
            factionRegistryIds: [],
            organizationRegistryIds: [],
          },
          boundRegistryLinks: {
            eventRegistries: [],
            questRegistries: [],
            npcRegistries: [],
            itemRegistries: [],
            locationRegistries: [],
            factionRegistries: [],
            organizationRegistries: [],
          },
        }
      : {};

  const imagePresetDefaults =
    creationType === "IMAGE_PRESET"
      ? {
          preset_family: "CUSTOM",
          default_aspect: "",
          image_prompt: promptGuidance,
          negative_prompt: "",
        }
      : {};

  const poseDefaults =
    creationType === "POSE"
      ? {
          energy: "",
          orientation: "",
        }
      : {};

  return {
    type: creationType,
    title,
    description: summary,
    visibility: "PRIVATE",
    content_rating: "SFW",
    data: {
      name: title,
      description: summary,
      prompt: promptGuidance,
      prompt_guidance: promptGuidance,
      tags: parsePresetTags(tags),
      visibility: "PRIVATE",
      content_rating: "SFW",
      rendering_style: "EITHER",
      image_count: "4",
      ...outfitDefaults,
      ...locationDefaults,
      ...imagePresetDefaults,
      ...poseDefaults,
      builder: "VISUAL_ASSET_BUILDER",
      builder_version: "1.0",
      asset_type: creationType,
      ingredient_type: creationType,
      visual_asset: true,
      image_gen_ingredient: true,
      selected_cover: null,
      playable: false,
      chat_enabled: false,
      addable_to_rooms_as_character: false,
      registry_links: [],
      created_from_image_studio_custom_preset: true,
    },
  };
}

export function extractCreatedPreset(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export function makeSavedPresetIngredient({ creation, fallbackPayload }) {
  const id = creation?.id || creation?.rowId || creation?.row_id || null;

  if (!id) {
    throw new Error("Preset was saved, but no creation id was returned.");
  }

  return {
    id,
    title: creation?.title || fallbackPayload.title,
    subtitle: creation?.description || fallbackPayload.description,
    type: creation?.type || fallbackPayload.type,
    contentRating:
      creation?.content_rating || creation?.contentRating || "SFW",
    custom: false,
  };
}

export function getGenerationCoinBalance(generationData) {
  const job = generationData?.job || {};
  const settings = job.settingsSnapshot || job.settings_snapshot || {};
  const coinCharge = settings.coinCharge || settings.coin_charge || {};
  const rawBalance =
    coinCharge.coinBalanceAfter ??
    coinCharge.coin_balance_after ??
    coinCharge.balanceAfter ??
    coinCharge.balance_after;
  const balance = Number.parseInt(rawBalance, 10);

  return Number.isFinite(balance) ? balance : null;
}

export function getImageGenerationAvailability({
  mode,
  coinBalance,
  selectedIngredients,
  customIngredientPrompts,
}) {
  const hasEnoughCoins = coinBalance >= IMAGE_GENERATION_COIN_COST;
  const selectedCharacterId = getSelectedCreationId(selectedIngredients.character);
  const selectedPlayerCharacterId = getSelectedCreationId(
    selectedIngredients.playerCharacter
  );
  const selectedOutfitId = getSelectedCreationId(selectedIngredients.outfit);
  const selectedLocationId = getSelectedCreationId(selectedIngredients.location);

  const selectedCharacterCustomText = getCustomIngredientText(
    customIngredientPrompts,
    "character"
  );
  const selectedPlayerCharacterCustomText = getCustomIngredientText(
    customIngredientPrompts,
    "playerCharacter"
  );
  const selectedOutfitCustomText = getCustomIngredientText(
    customIngredientPrompts,
    "outfit"
  );
  const selectedLocationCustomText = getCustomIngredientText(
    customIngredientPrompts,
    "location"
  );
  const hasCustomCharacterSource = Boolean(
    selectedIngredients.character?.custom && selectedCharacterCustomText
  );
  const hasCustomPlayerCharacterSource = Boolean(
    selectedIngredients.playerCharacter?.custom &&
      selectedPlayerCharacterCustomText
  );
  const hasCustomOutfitSource = Boolean(
    selectedIngredients.outfit?.custom && selectedOutfitCustomText
  );
  const hasCustomLocationSource = Boolean(
    selectedIngredients.location?.custom && selectedLocationCustomText
  );
  const hasClothingSource = Boolean(selectedOutfitId || hasCustomOutfitSource);
  const hasCustomVisualSubject = Boolean(
    hasCustomCharacterSource || hasCustomPlayerCharacterSource
  );
  const hasVisualSubject = Boolean(
    selectedCharacterId || selectedPlayerCharacterId || hasCustomVisualSubject
  );
  const hasRenderableImageSource = Boolean(
    hasVisualSubject ||
      selectedOutfitId ||
      selectedLocationId ||
      hasCustomOutfitSource ||
      hasCustomLocationSource
  );

  const imageGenerationBlockReason = !hasEnoughCoins
    ? `You need at least ${IMAGE_GENERATION_COIN_COST} coins to generate an image.`
    : !hasRenderableImageSource
      ? "Select a character, clothing source, wardrobe, or location before generating."
      : "";

  const imageGenerationHelpText =
    !imageGenerationBlockReason && hasVisualSubject && !hasClothingSource
      ? hasCustomVisualSubject
        ? "The custom Character guidance will be used as the complete SFW visual subject for this request."
        : "No clothing source selected. Crestfall will use the character's default clothing when available, otherwise simple generic SFW clothing."
      : imageGenerationBlockReason;

  return {
    hasEnoughCoins,
    hasVisualSubject,
    hasClothingSource,
    hasRenderableImageSource,
    imageGenerationBlockReason,
    imageGenerationHelpText,
    canGenerateImage: mode === "IMAGE" && !imageGenerationBlockReason,
  };
}

export function buildImageGenerationPayload({
  selectedIngredients,
  customIngredientPrompts,
  prompt,
  negativePrompt,
  renderStyle,
  cameraPreset,
  wardrobeTheme,
  aspectRatio,
  imageCount,
  sceneryOnlyHelperEnabled = true,
}) {
  const useLocationOnlySceneryHelper =
    sceneryOnlyHelperEnabled &&
    isLocationOnlyImageComposition(selectedIngredients);
  const normalizedCameraPreset = normalizeCameraPresetValue(cameraPreset);
  const cameraPromptFragment = getCameraPresetPrompt(normalizedCameraPreset);
  const promptWithSceneryHelper = useLocationOnlySceneryHelper
    ? appendPromptFragment(prompt, LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT)
    : String(prompt || "");
  const resolvedUserPrompt = appendPromptFragment(
    promptWithSceneryHelper,
    cameraPromptFragment
  );

  return {
    mode: "image",
    operation: "create_image",
    ingredients: {
      character: makeOptionalIngredient({
        item: selectedIngredients.character,
        customText: getCustomIngredientText(customIngredientPrompts, "character"),
      }),
      playerCharacter: makeOptionalIngredient({
        item: selectedIngredients.playerCharacter,
        customText: getCustomIngredientText(
          customIngredientPrompts,
          "playerCharacter"
        ),
      }),
      pose: makeOptionalIngredient({
        item: selectedIngredients.pose,
        customText: getCustomIngredientText(customIngredientPrompts, "pose"),
      }),
      outfit: makeOptionalIngredient({
        item: selectedIngredients.outfit,
        customText: getCustomIngredientText(customIngredientPrompts, "outfit"),
      }),
      location: makeOptionalIngredient({
        item: selectedIngredients.location,
        customText: getCustomIngredientText(customIngredientPrompts, "location"),
      }),
      renderingPreset: makeOptionalIngredient({
        item: selectedIngredients.preset,
        customText: getCustomIngredientText(customIngredientPrompts, "preset"),
      }),
    },
    prompt: {
      userPrompt: resolvedUserPrompt,
      negativePrompt,
      promptMode: getPromptMode(renderStyle),
    },
    composition: {
      cameraPreset: getLegacyCameraPresetValue(normalizedCameraPreset),
      shotType: normalizedCameraPreset,
      wardrobeTheme,
      cameraAngle: null,
      subjectPlacement: null,
      sceneEmphasis: null,
    },
    referenceInputs: [],
    controlInputs: [],
    settings: {
      renderingStyle: getLegacyRenderingStyle(renderStyle),
      renderProfileKey: renderStyle,
      aspectRatio: ASPECT_RATIO_BY_COMPOSER_VALUE[aspectRatio] || "3:4",
      outputCount: Number.parseInt(imageCount, 10) || 1,
      quality: "standard",
      seed: null,
    },
    modelProfile: getModelProfile(renderStyle),
  };
}

export function useImageStudioWorkbenchViewModel({ account }) {
  const [mode, setMode] = useState("IMAGE");
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [customIngredientPrompts, setCustomIngredientPrompts] = useState({});
  const [pickerSlot, setPickerSlot] = useState(null);
  const [savePresetSlot, setSavePresetSlot] = useState(null);
  const [mobileComposerOpen, setMobileComposerOpen] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [sceneryOnlyHelperEnabled, setSceneryOnlyHelperEnabled] = useState(true);

  const [renderStyle, setRenderStyle] = useState("auto");
  const [cameraPreset, setCameraPreset] = useState("AUTO");
  const [wardrobeTheme, setWardrobeTheme] = useState("AUTO");
  const [aspectRatio, setAspectRatio] = useState("PORTRAIT_4_5");
  const [imageCount, setImageCount] = useState("1");

  const [videoDuration, setVideoDuration] = useState("4");
  const [videoAspectRatio, setVideoAspectRatio] = useState("PORTRAIT");
  const [videoMotionStyle, setVideoMotionStyle] = useState("SUBTLE");

  const {
    coinBalance,
    accountStatus: coinStatus,
    accountError: coinError,
    refreshAccount,
    setCoinBalanceFromServer,
  } = account;

  const { ingredientOptionsBySlot, ingredientLoadError } =
    useImageStudioIngredientOptions();

  const {
    generationStatus,
    generationError,
    submitImageGenerationJob,
  } = useImageGenerationJob();

  const {
    mediaItems,
    historyStatus,
    historyError,
    hasMoreHistory,
    isLoadingMoreHistory,
    loadMoreImageGenerationHistory,
    prependPendingGeneration,
    resolvePendingGeneration,
    failPendingGeneration,
    applyImageReassignment,
  } = useImageGenerationHistory();

  const {
    hasEnoughCoins,
    imageGenerationHelpText,
    canGenerateImage,
  } = getImageGenerationAvailability({
    mode,
    coinBalance,
    selectedIngredients,
    customIngredientPrompts,
  });

  async function handleGenerateImage() {
    if (!canGenerateImage) return;

    const payload = buildImageGenerationPayload({
      selectedIngredients,
      customIngredientPrompts,
      prompt,
      negativePrompt,
      renderStyle,
      cameraPreset,
      wardrobeTheme,
      aspectRatio,
      imageCount,
      sceneryOnlyHelperEnabled,
    });

    const pendingGroupId = prependPendingGeneration({
      count: payload.settings.outputCount,
      prompt,
    });

    try {
      const generationData = await submitImageGenerationJob(payload);
      const nextCoinBalance = getGenerationCoinBalance(generationData);

      if (!setCoinBalanceFromServer(nextCoinBalance)) {
        refreshAccount().catch(() => {});
      }

      resolvePendingGeneration(pendingGroupId, generationData);
    } catch (error) {
      failPendingGeneration(pendingGroupId, error);
    }
  }

  async function handleQuickGenerate(event) {
    event.stopPropagation();

    await handleGenerateImage();
  }

  function setIngredient(slotId, item) {
    setSelectedIngredients((current) => {
      const next = {
        ...current,
        [slotId]: item,
      };

      if (slotId === "character") {
        delete next.playerCharacter;
      } else if (slotId === "playerCharacter") {
        delete next.character;
      }

      return next;
    });

    if (slotId === "character" || slotId === "playerCharacter") {
      const alternateSlotId =
        slotId === "character" ? "playerCharacter" : "character";

      setCustomIngredientPrompts((current) => {
        if (!Object.prototype.hasOwnProperty.call(current, alternateSlotId)) {
          return current;
        }

        const next = { ...current };
        delete next[alternateSlotId];
        return next;
      });
    }

    setPickerSlot(null);
  }

  function clearIngredient(slotId) {
    setSelectedIngredients((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });

    setCustomIngredientPrompts((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });
  }

  function startCustomIngredient(slot) {
    const customIngredient = makeCustomIngredient(slot);
    const isVisualSubjectSlot =
      slot.id === "character" || slot.id === "playerCharacter";
    const alternateSlotId =
      slot.id === "character" ? "playerCharacter" : "character";

    setSelectedIngredients((current) => {
      const next = {
        ...current,
        [slot.id]: customIngredient,
      };

      if (isVisualSubjectSlot) {
        delete next[alternateSlotId];
      }

      return next;
    });

    setCustomIngredientPrompts((current) => {
      const next = {
        ...current,
        [slot.id]: current[slot.id] || "",
      };

      if (isVisualSubjectSlot) {
        delete next[alternateSlotId];
      }

      return next;
    });

    setPickerSlot(null);
  }

  function startCreatePreset(slot) {
    if (!slot.allowCreatePreset) return;

    startCustomIngredient(slot);
    setSavePresetSlot(slot);
  }

  function updateCustomIngredientPrompt(slotId, value) {
    setCustomIngredientPrompts((current) => ({
      ...current,
      [slotId]: value,
    }));
  }

  function openSavePreset(slot) {
    setSavePresetSlot(slot);
  }

  async function saveCustomPreset({
    slot,
    name,
    description,
    tags,
    promptValue,
  }) {
    const creationPayload = buildPresetDraftPayload({
      slot,
      name,
      description,
      tags,
      promptValue,
    });
    const responsePayload = await createCreationDraft(
      creationPayload,
      `${slot?.label || "Preset"} could not be saved.`
    );
    const creation = extractCreatedPreset(responsePayload);
    const savedIngredient = makeSavedPresetIngredient({
      creation,
      fallbackPayload: creationPayload,
    });

    setSelectedIngredients((current) => ({
      ...current,
      [slot.id]: savedIngredient,
    }));

    setCustomIngredientPrompts((current) => {
      const next = { ...current };
      delete next[slot.id];
      return next;
    });

    return creation;
  }

  return {
    mode,
    mobileComposerOpen,
    canGenerateImage,
    onOpenMobileComposer: () => setMobileComposerOpen(true),
    onCloseMobileComposer: () => setMobileComposerOpen(false),
    onQuickGenerate: handleQuickGenerate,
    mediaHistoryProps: {
      generatedMedia: mediaItems,
      historyStatus,
      historyError,
      hasMoreHistory,
      isLoadingMoreHistory,
      onLoadMoreHistory: loadMoreImageGenerationHistory,
      onCoinBalanceChange: setCoinBalanceFromServer,
    onImageReassigned: applyImageReassignment,
    },
    composerProps: {
      mode,
      setMode,
      selectedIngredients,
      onOpenIngredient: setPickerSlot,
      onClearIngredient: clearIngredient,
      customIngredientPrompts,
      onUpdateCustomIngredientPrompt: updateCustomIngredientPrompt,
      onSaveCustomIngredient: openSavePreset,
      prompt,
      setPrompt,
      showSceneryOnlyHelper: isLocationOnlyImageComposition(selectedIngredients),
      sceneryOnlyHelperEnabled,
      setSceneryOnlyHelperEnabled,
      renderStyle,
      setRenderStyle,
      cameraPreset,
      setCameraPreset,
      wardrobeTheme,
      setWardrobeTheme,
      aspectRatio,
      setAspectRatio,
      imageCount,
      setImageCount,
      negativePrompt,
      setNegativePrompt,
      videoDuration,
      setVideoDuration,
      videoAspectRatio,
      setVideoAspectRatio,
      videoMotionStyle,
      setVideoMotionStyle,
      onGenerateImage: handleGenerateImage,
      canGenerateImage,
      generationStatus,
      generationError,
      generationHelpText: imageGenerationHelpText,
      coinBalance,
      coinCost: IMAGE_GENERATION_COIN_COST,
      coinStatus,
      coinError,
      hasEnoughCoins,
    },
    pickerModalProps: pickerSlot
      ? {
          slot: pickerSlot,
          items: ingredientOptionsBySlot[pickerSlot.id] || [],
          loadError: ingredientLoadError,
          selected: selectedIngredients[pickerSlot.id],
          onSelect: (item) => setIngredient(pickerSlot.id, item),
          onUseCustom: startCustomIngredient,
          onCreatePreset: startCreatePreset,
          onClose: () => setPickerSlot(null),
        }
      : null,
    savePresetModalProps: savePresetSlot
      ? {
          slot: savePresetSlot,
          promptValue: customIngredientPrompts[savePresetSlot.id] || "",
          onPromptChange: (value) =>
            updateCustomIngredientPrompt(savePresetSlot.id, value),
          onSave: (values) =>
            saveCustomPreset({
              slot: savePresetSlot,
              ...values,
            }),
          onClose: () => setSavePresetSlot(null),
        }
      : null,
  };
}
