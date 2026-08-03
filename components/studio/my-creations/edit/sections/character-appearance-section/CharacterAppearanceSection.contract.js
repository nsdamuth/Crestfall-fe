export const CHARACTER_APPEARANCE_SECTION_VIEW_CONTRACT_VERSION = "1.0";

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
    "noDescriptionLabel",
    "selectedClothingFallbackTitle",
  ],
  callbacks: [
    "onPickOutfit",
    "onPickWardrobe",
    "onClearDefaultClothing",
  ],
  applicationOwnedControls: [
    "skinToneControl",
    "eyeColorControl",
    "hairControl",
    "visualHeritageControl",
  ],
});
