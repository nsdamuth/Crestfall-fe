export const CHARACTER_APPEARANCE_SECTION_VIEW_CONTRACT_VERSION = "1.1";

export const CHARACTER_APPEARANCE_SECTION_VIEW_CONTRACT = Object.freeze({
  version: CHARACTER_APPEARANCE_SECTION_VIEW_CONTRACT_VERSION,
  feature: "character-appearance-section",
  inputs: [
    "sectionEyebrow",
    "sectionTitle",
    "sectionDescription",
    "skinToneControl",
    "eyeColorControl",
    "hairControl",
    "visualHeritageControl",
    "clothingLabel",
    "selectedClothing",
    "emptyClothingDescription",
    "imagePresetLabel",
    "selectedImagePreset",
    "emptyImagePresetDescription",
    "imagePresetHelpText",
    "noDescriptionLabel",
    "selectedClothingFallbackTitle",
    "selectedImagePresetFallbackTitle",
  ],
  callbacks: [
    "onPickOutfit",
    "onPickWardrobe",
    "onClearDefaultClothing",
    "onPickImagePreset",
    "onClearDefaultImagePreset",
  ],
  applicationOwnedControls: [
    "skinToneControl",
    "eyeColorControl",
    "hairControl",
    "visualHeritageControl",
  ],
});
