const noop = () => {};

const baseFixture = {
  open: true,
  presetTypeLabel: "Pose",
  introText:
    "Save this custom guidance as a private reusable draft. You can return to it later from My Creations or select it again from the Image Studio picker.",
  helperText:
    "Saving creates a private SFW draft and selects it for the current Image Studio request. Using it once does not create a saved asset.",
  nameValue: "Custom Pose",
  descriptionValue: "A reusable stance for formal character portraits.",
  promptValue:
    "confident three-quarter stance, shoulders relaxed, chin slightly raised",
  tagsValue: "formal, portrait, confident",
  isSaving: false,
  canSave: true,
  saveMessage: "",
  saveMessageTone: "info",
  onChangeName: noop,
  onChangeDescription: noop,
  onChangePrompt: noop,
  onChangeTags: noop,
  onSavePreset: noop,
  onUseOnce: noop,
  onClose: noop,
};

export const saveIngredientPresetReadyFixture = {
  ...baseFixture,
};

export const saveIngredientPresetSavingFixture = {
  ...baseFixture,
  isSaving: true,
};

export const saveIngredientPresetValidationFixture = {
  ...baseFixture,
  nameValue: "",
  promptValue: "",
  canSave: false,
};

export const saveIngredientPresetErrorFixture = {
  ...baseFixture,
  saveMessage: "Preset could not be saved. Please try again.",
  saveMessageTone: "error",
};

export const saveIngredientPresetLocationFixture = {
  ...baseFixture,
  presetTypeLabel: "Location / Scene",
  nameValue: "Custom Rain-Soaked Alley",
  descriptionValue:
    "A dim urban alley scene intended for nocturnal Crestfall encounters.",
  promptValue:
    "rain-slick cobblestones, narrow old-city alley, warm window light, drifting fog, distant neon reflections",
  tagsValue: "night, rain, urban, atmospheric",
};

export const saveIngredientPresetLongContentFixture = {
  ...baseFixture,
  presetTypeLabel:
    "Alternate Ceremonial Wardrobe and Environmental Rendering Preset",
  nameValue:
    "Custom Ceremonial Procession Wardrobe With Layered Metallic Embroidery",
  descriptionValue:
    "A deliberately long fixture description used to confirm that multiline content, dense labels, and unusually descriptive reusable guidance remain readable without changing the application contract.",
  promptValue:
    "full-length ceremonial coat with layered metallic embroidery, structured shoulders, contrasting inner lining, carefully arranged accessories, formal posture, dramatic processional lighting, richly detailed fabric texture",
  tagsValue:
    "ceremonial, formal, embroidered, layered, metallic, procession, dramatic-lighting",
};
