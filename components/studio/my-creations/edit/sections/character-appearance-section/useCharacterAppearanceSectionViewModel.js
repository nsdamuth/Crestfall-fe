import { useEffect, useState } from "react";

import { visualHeritageReferenceOptions } from "@/components/studio/create/character/constants/constants";
import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Character Editor",
  sectionTitle: "Appearance",
  sectionDescription:
    "Edit visual identity fields using the same guided controls from character creation.",
  visualHeritageLabel: "Ethnic Appearance",
  visualHeritageDescription:
    "Choose the real-world visual heritage reference the image generator should use for this character. This is separate from species and skin tone.",
  clothingLabel: "Clothing Style",
  emptyClothingDescription:
    "No default clothing source selected. Choose a single Outfit or a Wardrobe.",
  imagePresetLabel: "Default Image Preset",
  emptyImagePresetDescription:
    "No default image preset selected. Image Studio will use its normal preset behavior.",
  imagePresetHelpText:
    "Used automatically when this character is selected for image generation. Image Studio can still override it per generation.",
  noDescriptionLabel: "No description.",
  selectedClothingFallbackTitle: "Selected Clothing Source",
  selectedImagePresetFallbackTitle: "Selected Image Preset",
});

const PLACEHOLDER_IMAGE_URL = "/images/placeholder-card.jpg";

export function getCreationImageUrl(creation) {
  const data = creation?.data || {};
  const featuredMedia =
    creation?.featuredMedia ||
    creation?.featured_media ||
    data.featuredMedia ||
    data.featured_media ||
    [];

  const firstMedia = Array.isArray(featuredMedia) ? featuredMedia[0] : null;

  return (
    firstMedia?.imageUrl ||
    firstMedia?.url ||
    firstMedia?.displayUrl ||
    creation?.imageUrl ||
    creation?.coverImageUrl ||
    data.imageUrl ||
    data.coverImageUrl ||
    PLACEHOLDER_IMAGE_URL
  );
}

export function normalizeDefaultOutfitSelection(outfit = {}) {
  const outfitId = outfit.id;
  const outfitTitle = outfit.title || "Untitled Outfit";
  const outfitDescription = outfit.description || "";
  const outfitImageUrl = getCreationImageUrl(outfit);
  const outfitContentRating =
    outfit.contentRating || outfit.content_rating || "SFW";

  return {
    clothing_source: {
      mode: "OUTFIT",
      outfit_id: outfitId,
      outfit_title: outfitTitle,
      outfit_description: outfitDescription,
      outfit_image_url: outfitImageUrl,
      outfit_content_rating: outfitContentRating,
      wardrobe_id: null,
      wardrobe_title: "",
      wardrobe_description: "",
      wardrobe_image_url: "",
      wardrobe_content_rating: "",
      resolver: {
        strategy: "DIRECT_OUTFIT",
      },
    },
    default_clothing_mode: "OUTFIT",
    clothing_style: outfitTitle,
    default_outfit_id: outfitId,
    default_outfit_title: outfitTitle,
    default_outfit_description: outfitDescription,
    default_outfit_image_url: outfitImageUrl,
    default_outfit_content_rating: outfitContentRating,
    default_wardrobe_id: null,
    default_wardrobe_title: "",
    default_wardrobe_description: "",
    default_wardrobe_image_url: "",
    default_wardrobe_content_rating: "",
  };
}

export function normalizeDefaultWardrobeSelection(wardrobe = {}) {
  const wardrobeId = wardrobe.id;
  const wardrobeTitle = wardrobe.title || "Untitled Wardrobe";
  const wardrobeDescription = wardrobe.description || "";
  const wardrobeImageUrl = getCreationImageUrl(wardrobe);
  const wardrobeContentRating =
    wardrobe.contentRating || wardrobe.content_rating || "SFW";

  return {
    clothing_source: {
      mode: "WARDROBE",
      outfit_id: null,
      outfit_title: "",
      outfit_description: "",
      outfit_image_url: "",
      outfit_content_rating: "",
      wardrobe_id: wardrobeId,
      wardrobe_title: wardrobeTitle,
      wardrobe_description: wardrobeDescription,
      wardrobe_image_url: wardrobeImageUrl,
      wardrobe_content_rating: wardrobeContentRating,
      resolver: {
        strategy: "WARDROBE_RULES",
        resolve_at: "SCENE_BOUNDARY",
        persist_resolution: true,
      },
    },
    default_clothing_mode: "WARDROBE",
    clothing_style: wardrobeTitle,
    default_wardrobe_id: wardrobeId,
    default_wardrobe_title: wardrobeTitle,
    default_wardrobe_description: wardrobeDescription,
    default_wardrobe_image_url: wardrobeImageUrl,
    default_wardrobe_content_rating: wardrobeContentRating,
    default_outfit_id: null,
    default_outfit_title: "",
    default_outfit_description: "",
    default_outfit_image_url: "",
    default_outfit_content_rating: "",
  };
}

export function normalizeDefaultImagePresetSelection(imagePreset = {}) {
  return {
    default_image_preset_id: imagePreset.id || null,
    default_image_preset_title:
      imagePreset.title || imagePreset?.data?.name || "Untitled Image Preset",
  };
}

export function getClearedDefaultClothingFields() {
  return {
    clothing_source: {
      mode: "NONE",
      outfit_id: null,
      outfit_title: "",
      outfit_description: "",
      outfit_image_url: "",
      outfit_content_rating: "",
      wardrobe_id: null,
      wardrobe_title: "",
      wardrobe_description: "",
      wardrobe_image_url: "",
      wardrobe_content_rating: "",
      resolver: {
        strategy: "NONE",
      },
    },
    default_clothing_mode: "NONE",
    clothing_style: "",
    default_outfit_id: null,
    default_outfit_title: "",
    default_outfit_description: "",
    default_outfit_image_url: "",
    default_outfit_content_rating: "",
    default_wardrobe_id: null,
    default_wardrobe_title: "",
    default_wardrobe_description: "",
    default_wardrobe_image_url: "",
    default_wardrobe_content_rating: "",
  };
}

export function getClearedDefaultImagePresetFields() {
  return {
    default_image_preset_id: null,
    default_image_preset_title: null,
  };
}

export function getSelectedClothingSummary(data = {}) {
  const mode = data.default_clothing_mode || "NONE";

  if (mode === "OUTFIT") {
    return {
      mode,
      hasSelection: true,
      label: "Single Outfit",
      title: data.default_outfit_title || "",
      description: data.default_outfit_description || "",
      imageUrl: data.default_outfit_image_url || PLACEHOLDER_IMAGE_URL,
      id: data.default_outfit_id || "",
      outfitButtonLabel: "Change Outfit",
      wardrobeButtonLabel: "Select Wardrobe",
    };
  }

  if (mode === "WARDROBE") {
    return {
      mode,
      hasSelection: true,
      label: "Wardrobe",
      title: data.default_wardrobe_title || "",
      description: data.default_wardrobe_description || "",
      imageUrl: data.default_wardrobe_image_url || PLACEHOLDER_IMAGE_URL,
      id: data.default_wardrobe_id || "",
      outfitButtonLabel: "Select Outfit",
      wardrobeButtonLabel: "Change Wardrobe",
    };
  }

  return {
    mode: "NONE",
    hasSelection: false,
    label: "",
    title: "",
    description: "",
    imageUrl: PLACEHOLDER_IMAGE_URL,
    id: "",
    outfitButtonLabel: "Select Outfit",
    wardrobeButtonLabel: "Select Wardrobe",
  };
}

export function getSelectedImagePresetSummary(data = {}, imagePresets = []) {
  const selectedId = String(data.default_image_preset_id || "").trim();
  if (!selectedId) {
    return {
      hasSelection: false,
      id: "",
      title: "",
      description: "",
      imageUrl: PLACEHOLDER_IMAGE_URL,
      buttonLabel: "Select Preset",
    };
  }

  const selectedPreset = (Array.isArray(imagePresets) ? imagePresets : []).find(
    (creation) => String(creation?.id || "") === selectedId
  );

  return {
    hasSelection: true,
    id: selectedId,
    title:
      selectedPreset?.title ||
      selectedPreset?.data?.name ||
      data.default_image_preset_title ||
      "Selected Image Preset",
    description:
      selectedPreset?.description ||
      selectedPreset?.data?.description ||
      selectedPreset?.data?.prompt_guidance ||
      "",
    imageUrl: selectedPreset
      ? getCreationImageUrl(selectedPreset)
      : PLACEHOLDER_IMAGE_URL,
    buttonLabel: "Change Preset",
  };
}

export function useCharacterAppearanceSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const [activePicker, setActivePicker] = useState(null);
  const [imagePresets, setImagePresets] = useState([]);
  const appearanceData = form?.data || {};
  const selectedClothing = getSelectedClothingSummary(appearanceData);
  const selectedImagePreset = getSelectedImagePresetSummary(
    appearanceData,
    imagePresets
  );

  useEffect(() => {
    let cancelled = false;

    fetchOwnedCreations(
      { type: "IMAGE_PRESET" },
      "Image presets could not be loaded."
    )
      .then((creations) => {
        if (!cancelled) {
          setImagePresets(Array.isArray(creations) ? creations : []);
        }
      })
      .catch(() => {
        if (!cancelled) setImagePresets([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function applyFields(fields) {
    Object.entries(fields).forEach(([field, value]) => {
      updateDataField?.(field, value);
    });
  }

  function handleApplySelection(selection) {
    applyFields(selection || {});
    setActivePicker(null);
  }

  function handleClearDefaultClothing() {
    applyFields(getClearedDefaultClothingFields());
  }

  function handleClearDefaultImagePreset() {
    applyFields(getClearedDefaultImagePresetFields());
  }

  return {
    ...DEFAULT_COPY,
    appearanceData,
    visualHeritageOptions: visualHeritageReferenceOptions,
    activePicker,
    selectedOutfitId: appearanceData.default_outfit_id || "",
    selectedWardrobeId: appearanceData.default_wardrobe_id || "",
    selectedImagePresetId: appearanceData.default_image_preset_id || "",
    selectedClothing,
    selectedImagePreset,
    placeholderImageUrl: PLACEHOLDER_IMAGE_URL,
    normalizeDefaultOutfitSelection,
    normalizeDefaultWardrobeSelection,
    normalizeDefaultImagePresetSelection,
    onChangeCharacterField: (field, value) =>
      updateDataField?.(field, value),
    onPickOutfit: () => setActivePicker("OUTFIT"),
    onPickWardrobe: () => setActivePicker("WARDROBE"),
    onPickImagePreset: () => setActivePicker("IMAGE_PRESET"),
    onClosePicker: () => setActivePicker(null),
    onApplySelection: handleApplySelection,
    onClearDefaultClothing: handleClearDefaultClothing,
    onClearDefaultImagePreset: handleClearDefaultImagePreset,
  };
}
