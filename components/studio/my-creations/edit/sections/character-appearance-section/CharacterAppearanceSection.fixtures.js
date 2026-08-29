const baseSelectedClothing = Object.freeze({
  mode: "NONE",
  hasSelection: false,
  label: "",
  title: "",
  description: "",
  imageUrl: "/images/placeholder-card.jpg",
  id: "",
  outfitButtonLabel: "Select Outfit",
  wardrobeButtonLabel: "Select Wardrobe",
});

const baseSelectedImagePreset = Object.freeze({
  hasSelection: true,
  id: "preset-kessa-portrait",
  title: "Crestfall Fantasy Portrait",
  description:
    "A reusable portrait preset with painterly fantasy lighting and character-forward framing.",
  imageUrl: "/images/placeholder-card.jpg",
  buttonLabel: "Change Preset",
});

const baseFixture = Object.freeze({
  sectionEyebrow: "Character Editor",
  sectionTitle: "Appearance",
  sectionDescription:
    "Edit visual identity fields using the same guided controls from character creation.",
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
  selectedClothing: baseSelectedClothing,
  selectedImagePreset: baseSelectedImagePreset,
});

export const characterAppearanceSectionOutfitFixture = {
  ...baseFixture,
  selectedClothing: {
    mode: "OUTFIT",
    hasSelection: true,
    label: "Single Outfit",
    title: "Roadsworn Mountain Armor",
    description:
      "Layered mountain armor designed for long-distance travel, climbing, and cold weather.",
    imageUrl: "/images/placeholder-card.jpg",
    id: "outfit-roadsworn-armor",
    outfitButtonLabel: "Change Outfit",
    wardrobeButtonLabel: "Select Wardrobe",
  },
};

export const characterAppearanceSectionWardrobeFixture = {
  ...baseFixture,
  selectedClothing: {
    mode: "WARDROBE",
    hasSelection: true,
    label: "Wardrobe",
    title: "Kessa's Wardrobe",
    description:
      "A rotating collection of artificer workwear, market attire, and field gear.",
    imageUrl: "/images/placeholder-card.jpg",
    id: "wardrobe-kessa",
    outfitButtonLabel: "Select Outfit",
    wardrobeButtonLabel: "Change Wardrobe",
  },
};

export const characterAppearanceSectionEmptyFixture = {
  ...baseFixture,
  selectedClothing: { ...baseSelectedClothing },
  selectedImagePreset: {
    hasSelection: false,
    id: "",
    title: "",
    description: "",
    imageUrl: "/images/placeholder-card.jpg",
    buttonLabel: "Select Preset",
  },
};

export const characterAppearanceSectionLongContentFixture = {
  ...baseFixture,
  selectedClothing: {
    mode: "OUTFIT",
    hasSelection: true,
    label: "Single Outfit",
    title:
      "The Extremely Long Formal Name of the Ceremonial Armor Worn During Impossible State Functions",
    description:
      "This intentionally long description verifies that the portable appearance section remains readable when a linked clothing creation contains a large amount of descriptive copy, detailed materials, ceremonial context, practical limitations, and other authoring information that should not break the card layout.",
    imageUrl: "/images/placeholder-card.jpg",
    id: "outfit-with-a-very-long-preview-identifier-for-layout-validation",
    outfitButtonLabel: "Change Outfit",
    wardrobeButtonLabel: "Select Wardrobe",
  },
  selectedImagePreset: {
    ...baseSelectedImagePreset,
    title:
      "The Extremely Long Named Character Portrait Preset for Elaborate Multi-Environment Fantasy Presentation",
    description:
      "A deliberately long image-preset description that verifies wrapping, card balance, and the side-by-side Appearance layout without leaking application-owned picker behavior into the portable View.",
  },
};

export const characterAppearanceSectionMissingCallbacksFixture = {
  ...characterAppearanceSectionOutfitFixture,
  onPickOutfit: null,
  onPickWardrobe: null,
  onClearDefaultClothing: null,
  onPickImagePreset: null,
  onClearDefaultImagePreset: null,
};
