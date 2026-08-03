const noop = () => {};

const fixtureItems = [
  {
    id: "fixture-character-1",
    title: "Dalethia",
    subtitle: "A Crestfall character prepared for portrait generation.",
    description: "A Crestfall character prepared for portrait generation.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "/assets/covers/crestfall-painting-cover.png",
  },
  {
    id: "fixture-character-2",
    title: "Charlotte Steele",
    subtitle: "A second reusable character ingredient.",
    description: "A second reusable character ingredient.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "/assets/covers/crestfall-statue-cover.png",
  },
  {
    id: "fixture-character-3",
    title: "Visual Ingredient Without an Image",
    subtitle: "Tests the picker card fallback treatment.",
    description: "Tests the picker card fallback treatment.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "",
  },
];

const baseFixture = {
  ingredientLabel: "Character",
  headerIconName: "users",
  items: fixtureItems,
  selectedItemId: "fixture-character-1",
  loadErrorMessage: "",
  searchPlaceholder: "Search character...",
  emptyMessage: "No character assets found.",
  showUseCustomAction: true,
  showCreatePresetAction: false,
  onClose: noop,
  onChooseIngredient: noop,
  onUseCustom: noop,
  onCreatePreset: noop,
};

export const ingredientPickerCharacterFixture = {
  ...baseFixture,
};

export const ingredientPickerPresetActionsFixture = {
  ...baseFixture,
  ingredientLabel: "Pose",
  headerIconName: "theater",
  items: [
    {
      id: "fixture-pose-1",
      title: "Heroic Three-Quarter Stance",
      subtitle: "Reusable pose guidance for character rendering.",
      description: "Reusable pose guidance for character rendering.",
      type: "POSE",
      contentRating: "SFW",
      imageUrl: "/assets/covers/crestfall-ballerina-cover.png",
    },
  ],
  selectedItemId: "",
  searchPlaceholder: "Search pose...",
  emptyMessage: "No pose assets found.",
  showCreatePresetAction: true,
};

export const ingredientPickerEmptyFixture = {
  ...baseFixture,
  items: [],
  selectedItemId: "",
};

export const ingredientPickerLoadErrorFixture = {
  ...baseFixture,
  items: [],
  selectedItemId: "",
  loadErrorMessage: "Image Studio assets could not be loaded.",
};

export const ingredientPickerNoActionsFixture = {
  ...baseFixture,
  ingredientLabel: "Required Character Source",
  items: fixtureItems.slice(0, 2),
  showUseCustomAction: false,
  showCreatePresetAction: false,
};

export const ingredientPickerLongLabelFixture = {
  ...baseFixture,
  ingredientLabel: "Alternate Wardrobe and Ceremonial Clothing Source",
  headerIconName: "shirt",
  selectedItemId: "",
  showCreatePresetAction: true,
  searchPlaceholder:
    "Search alternate wardrobe and ceremonial clothing source...",
  emptyMessage:
    "No alternate wardrobe and ceremonial clothing source assets found.",
};
