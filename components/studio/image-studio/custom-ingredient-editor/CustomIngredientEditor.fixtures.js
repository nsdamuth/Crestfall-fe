const noop = () => {};

const baseFixture = {
  open: true,
  ingredientLabel: "Pose",
  introText:
    "Write a custom prompt fragment for this ingredient. It can be used once in this request, or saved later as a reusable preset.",
  promptValue:
    "A relaxed three-quarter stance with one shoulder angled toward the camera.",
  promptPlaceholder: "Describe the custom pose guidance...",
  showSavePresetAction: true,
  onChangePrompt: noop,
  onBackToPresets: noop,
  onClear: noop,
  onSavePreset: noop,
};

export const customIngredientEditorPresetFixture = {
  ...baseFixture,
};

export const customIngredientEditorUseOnceFixture = {
  ...baseFixture,
  ingredientLabel: "Character",
  introText:
    "Write a custom prompt fragment for this ingredient. It will be used once in this request.",
  promptValue: "A weary archivist in travel-worn formal clothing.",
  promptPlaceholder: "Describe the custom character guidance...",
  showSavePresetAction: false,
};

export const customIngredientEditorEmptyFixture = {
  ...baseFixture,
  ingredientLabel: "Location",
  promptValue: "",
  promptPlaceholder: "Describe the custom location guidance...",
};

export const customIngredientEditorLongContentFixture = {
  ...baseFixture,
  ingredientLabel: "Alternate Wardrobe and Ceremonial Clothing Source",
  introText:
    "Write a custom prompt fragment for this ingredient. It can be used once in this request, or saved later as a reusable preset. This fixture also checks long labels, wrapping, and a more detailed block of guidance without changing application state.",
  promptValue:
    "Layered ceremonial clothing with embroidered hems, structured shoulders, a fitted waistcoat, weathered travel details, and restrained metallic ornament suitable for a formal arrival scene.",
  promptPlaceholder:
    "Describe the custom alternate wardrobe and ceremonial clothing source guidance...",
};

export const customIngredientEditorClosedFixture = {
  ...baseFixture,
  open: false,
};
