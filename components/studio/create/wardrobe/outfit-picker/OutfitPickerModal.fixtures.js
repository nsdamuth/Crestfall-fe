const noop = () => {};

const outfitItems = [
  {
    id: "fixture-outfit-evening",
    title: "Glimmer District Eveningwear",
    subtitle: "Formal · Black velvet, silver embroidery, and tailored layers.",
    typeLabel: "Outfit",
    ratingLabel: "SFW",
    displayImageUrl: "/assets/covers/crestfall-cloak-cover.png",
    imageAltText: "Glimmer District eveningwear fixture cover",
    isSelected: true,
  },
  {
    id: "fixture-outfit-travel",
    title: "Woundside Travel Clothes",
    subtitle: "Travel · Weathered leather, layered linen, and practical boots.",
    typeLabel: "Outfit",
    ratingLabel: "SFW",
    displayImageUrl: "/assets/covers/crestfall-compass-cover.png",
    imageAltText: "Woundside travel clothes fixture cover",
    isSelected: false,
  },
  {
    id: "fixture-outfit-ritual",
    title: "Veil Ritual Attire",
    subtitle: "Ceremonial · Structured robes with luminous threadwork.",
    typeLabel: "Outfit",
    ratingLabel: "SFW",
    displayImageUrl: "/assets/covers/crestfall-scrolls-cover.png",
    imageAltText: "Veil ritual attire fixture cover",
    isSelected: false,
  },
];

const wardrobeItems = [
  {
    id: "fixture-wardrobe-kessa",
    title: "Kessa's Working Wardrobe",
    subtitle: "Workshop, travel, public appearances, and formal obligations.",
    typeLabel: "Wardrobe",
    ratingLabel: "SFW",
    displayImageUrl: "/assets/covers/crestfall-drawings-cover.png",
    imageAltText: "Kessa working wardrobe fixture cover",
    isSelected: true,
  },
  {
    id: "fixture-wardrobe-court",
    title: "Valecourt Seasonal Wardrobe",
    subtitle: "A complete seasonal collection for court and diplomatic use.",
    typeLabel: "Wardrobe",
    ratingLabel: "SFW",
    displayImageUrl: "/assets/covers/crestfall-camellia-cover.png",
    imageAltText: "Valecourt seasonal wardrobe fixture cover",
    isSelected: false,
  },
];

const baseFixture = {
  title: "Select Default Outfit",
  eyebrow: "Character Clothing",
  description:
    "Choose one Outfit creation to use as this character's default clothing source.",
  searchPlaceholder: "Search outfits...",
  searchQuery: "",
  items: outfitItems,
  isLoading: false,
  loadingMessage: "Loading outfits...",
  errorMessage: "",
  emptyMessage: "No outfits found.",
  onSearchQueryChange: noop,
  onClose: noop,
  onChooseItem: noop,
};

export const outfitPickerPopulatedFixture = {
  ...baseFixture,
};

export const outfitPickerWardrobeFixture = {
  ...baseFixture,
  title: "Select Default Wardrobe",
  description:
    "Choose one Wardrobe creation to use as this character's default clothing source.",
  searchPlaceholder: "Search wardrobes...",
  items: wardrobeItems,
  loadingMessage: "Loading wardrobes...",
  emptyMessage: "No wardrobes found.",
};

export const outfitPickerLoadingFixture = {
  ...baseFixture,
  items: [],
  isLoading: true,
};

export const outfitPickerEmptyFixture = {
  ...baseFixture,
  items: [],
};

export const outfitPickerErrorFixture = {
  ...baseFixture,
  items: [],
  errorMessage: "Outfits could not be loaded.",
};

export const outfitPickerSearchEmptyFixture = {
  ...baseFixture,
  searchQuery: "No matching clothing",
  items: [],
};

export const outfitPickerLongContentFixture = {
  ...baseFixture,
  title: "Select the Character's Default Outfit Creation",
  description:
    "This deliberately long fixture verifies that caller-supplied headings and explanatory content remain readable while the portable picker is displayed at narrow and wide responsive sizes.",
  items: [
    {
      id: "fixture-outfit-long",
      title:
        "Elaborate Multi-Layered Ceremonial Ensemble for Diplomatic Receptions and Veil Observances",
      subtitle:
        "Ceremonial · A deliberately verbose styling summary used to stress the card layout without exposing raw creation or wardrobe-entry data to the View.",
      typeLabel: "Outfit",
      ratingLabel: "SFW",
      displayImageUrl: "/assets/covers/crestfall-painting-cover.png",
      imageAltText: "Long-content ceremonial outfit fixture cover",
      isSelected: false,
    },
  ],
};

export const outfitPickerFixtureItems = outfitItems;
