export const defaultClothingEmptyFixture = {
  selectedClothing: null,
  emptyMessage:
    "No default clothing selected. Choose one Outfit or one Wardrobe.",
  outfitActionLabel: "Select Outfit",
  wardrobeActionLabel: "Select Wardrobe",
};

export const defaultClothingOutfitFixture = {
  selectedClothing: {
    typeLabel: "Single Outfit",
    title: "Ashen Court Formalwear",
    description:
      "A fitted ceremonial coat, embroidered waistcoat, and tailored black trousers.",
    imageUrl: "/images/placeholder-card.jpg",
  },
  emptyMessage: defaultClothingEmptyFixture.emptyMessage,
  outfitActionLabel: "Change Outfit",
  wardrobeActionLabel: "Select Wardrobe",
};

export const defaultClothingWardrobeFixture = {
  selectedClothing: {
    typeLabel: "Wardrobe",
    title: "Diplomat's Seasonal Wardrobe",
    description:
      "A coordinated clothing collection covering formal audiences, travel, and private scenes.",
    imageUrl: "/images/placeholder-card.jpg",
  },
  emptyMessage: defaultClothingEmptyFixture.emptyMessage,
  outfitActionLabel: "Select Outfit",
  wardrobeActionLabel: "Change Wardrobe",
};

export const defaultClothingMissingCopyFixture = {
  selectedClothing: {
    typeLabel: "Single Outfit",
    title: "Selected Clothing Source",
    description: "No description.",
    imageUrl: "/images/placeholder-card.jpg",
  },
  emptyMessage: defaultClothingEmptyFixture.emptyMessage,
  outfitActionLabel: "Change Outfit",
  wardrobeActionLabel: "Select Wardrobe",
};

export const defaultClothingLongContentFixture = {
  selectedClothing: {
    typeLabel: "Wardrobe",
    title:
      "The Complete Ceremonial, Expeditionary, Diplomatic, and Private Wardrobe of the Ninth Astral Court",
    description:
      "A deliberately long description covering layered formal coats, weatherproof expedition pieces, ceremonial accessories, travel footwear, and multiple scene-specific combinations for responsive layout testing.",
    imageUrl: "/images/placeholder-card.jpg",
  },
  emptyMessage: defaultClothingEmptyFixture.emptyMessage,
  outfitActionLabel: "Select Outfit",
  wardrobeActionLabel: "Change Wardrobe",
};

export const defaultClothingMissingCallbacksFixture = {
  ...defaultClothingOutfitFixture,
  onOpenOutfitPicker: null,
  onOpenWardrobePicker: null,
  onClearDefaultClothing: null,
};
