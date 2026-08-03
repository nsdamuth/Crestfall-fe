"use client";

import { useState } from "react";

const PLACEHOLDER_IMAGE_URL = "/images/placeholder-card.jpg";

function getCreationImageUrl(creation) {
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

function normalizeDefaultOutfitSelection(outfit) {
  return {
    default_clothing_mode: "OUTFIT",
    clothing_style: outfit?.title || "Selected Outfit",

    default_outfit_id: outfit?.id,
    default_outfit_title: outfit?.title || "Untitled Outfit",
    default_outfit_description: outfit?.description || "",
    default_outfit_image_url: getCreationImageUrl(outfit),
    default_outfit_content_rating:
      outfit?.contentRating || outfit?.content_rating || "SFW",

    default_wardrobe_id: null,
    default_wardrobe_title: "",
    default_wardrobe_description: "",
    default_wardrobe_image_url: "",
    default_wardrobe_content_rating: "",
  };
}

function normalizeDefaultWardrobeSelection(wardrobe) {
  return {
    default_clothing_mode: "WARDROBE",
    clothing_style: wardrobe?.title || "Selected Wardrobe",

    default_wardrobe_id: wardrobe?.id,
    default_wardrobe_title: wardrobe?.title || "Untitled Wardrobe",
    default_wardrobe_description: wardrobe?.description || "",
    default_wardrobe_image_url: getCreationImageUrl(wardrobe),
    default_wardrobe_content_rating:
      wardrobe?.contentRating || wardrobe?.content_rating || "SFW",

    default_outfit_id: null,
    default_outfit_title: "",
    default_outfit_description: "",
    default_outfit_image_url: "",
    default_outfit_content_rating: "",
  };
}

export function getDefaultClothingInitialFields() {
  return {
    default_clothing_mode: "NONE",

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

function getSelectedClothing(form, mode) {
  if (mode === "OUTFIT") {
    return {
      typeLabel: "Single Outfit",
      title: form?.default_outfit_title || "Selected Clothing Source",
      description: form?.default_outfit_description || "No description.",
      imageUrl: form?.default_outfit_image_url || PLACEHOLDER_IMAGE_URL,
    };
  }

  if (mode === "WARDROBE") {
    return {
      typeLabel: "Wardrobe",
      title: form?.default_wardrobe_title || "Selected Clothing Source",
      description: form?.default_wardrobe_description || "No description.",
      imageUrl: form?.default_wardrobe_image_url || PLACEHOLDER_IMAGE_URL,
    };
  }

  return null;
}

export function useDefaultClothingSelectorViewModel({
  form = {},
  updateField = null,
} = {}) {
  const [activePicker, setActivePicker] = useState(null);

  const mode =
    form?.default_clothing_mode === "OUTFIT" ||
    form?.default_clothing_mode === "WARDROBE"
      ? form.default_clothing_mode
      : "NONE";

  function applySelection(selection) {
    Object.entries(selection || {}).forEach(([field, value]) => {
      updateField?.(field, value);
    });

    setActivePicker(null);
  }

  function clearDefaultClothing() {
    const clearFields = {
      default_clothing_mode: "NONE",
      clothing_style: "",
      ...getDefaultClothingInitialFields(),
    };

    Object.entries(clearFields).forEach(([field, value]) => {
      updateField?.(field, value);
    });
  }

  const pickerProps =
    activePicker === "OUTFIT"
      ? {
          title: "Select Default Outfit",
          modalEyebrow: "Character Clothing",
          modalDescription:
            "Choose one Outfit creation to use as this character's default clothing source.",
          searchPlaceholder: "Search outfits...",
          creationType: "OUTFIT",
          typeLabel: "Outfit",
          selectedCreationId: form?.default_outfit_id || "",
          normalizeSelection: normalizeDefaultOutfitSelection,
          onClose: () => setActivePicker(null),
          onSelect: applySelection,
        }
      : activePicker === "WARDROBE"
        ? {
            title: "Select Default Wardrobe",
            modalEyebrow: "Character Clothing",
            modalDescription:
              "Choose one Wardrobe creation to use as this character's default clothing source.",
            searchPlaceholder: "Search wardrobes...",
            creationType: "WARDROBE",
            typeLabel: "Wardrobe",
            selectedCreationId: form?.default_wardrobe_id || "",
            normalizeSelection: normalizeDefaultWardrobeSelection,
            onClose: () => setActivePicker(null),
            onSelect: applySelection,
          }
        : null;

  return {
    viewProps: {
      selectedClothing: getSelectedClothing(form, mode),
      emptyMessage:
        "No default clothing selected. Choose one Outfit or one Wardrobe.",
      outfitActionLabel:
        mode === "OUTFIT" ? "Change Outfit" : "Select Outfit",
      wardrobeActionLabel:
        mode === "WARDROBE" ? "Change Wardrobe" : "Select Wardrobe",
      onOpenOutfitPicker: () => setActivePicker("OUTFIT"),
      onOpenWardrobePicker: () => setActivePicker("WARDROBE"),
      onClearDefaultClothing: clearDefaultClothing,
    },
    pickerProps,
  };
}
