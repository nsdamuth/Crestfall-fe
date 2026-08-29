const speciesOptions = [
  { value: "HUMAN", label: "Human" },
  { value: "ELF", label: "Elf" },
  { value: "CUSTOM", label: "Custom" },
];

const renderingStyleOptions = [
  { value: "EITHER", label: "Either / Auto" },
  { value: "ANIME", label: "Anime" },
  { value: "REALISTIC", label: "Realistic" },
];


const defaultImagePresetOptions = [
  { value: "AUTO", label: "Auto / No Default Preset" },
  { value: "preset-1", label: "Crestfall Fantasy Portrait" },
  { value: "preset-2", label: "Crestfall Realistic Character" },
];

const genderPresentationOptions = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "CUSTOM", label: "Custom" },
];

const baseFixture = {
  sectionEyebrow: "Creation Editor",
  sectionTitle: "Identity",
  sectionDescription:
    "Edit the character-specific identity fields stored in this creation’s data payload.",
  characterNameLabel: "Character Name",
  characterNameValue: "Kessa Cindervell",
  characterTitleLabel: "Character Title",
  characterTitleValue: "The Brasswhisker",
  speciesLabel: "Species",
  speciesValue: "HUMAN",
  speciesOptions,
  showCustomSpecies: false,
  customSpeciesLabel: "Custom Species",
  customSpeciesValue: "",
  customIdentityMaxLength: 80,
  renderingStyleLabel: "Default Rendering Style",
  renderingStyleValue: "ANIME",
  renderingStyleOptions,
  defaultImagePresetLabel: "Default Image Preset",
  defaultImagePresetValue: "preset-1",
  defaultImagePresetOptions,
  defaultImagePresetHelpText:
    "Used automatically when this character is selected for image generation.",
  ageLabel: "Age",
  ageValue: "26",
  ageMinimum: 18,
  agePlaceholder: "18+",
  ageHelpText:
    "Adult characters only. Used for narration and lore context, not visual aging.",
  genderPresentationLabel: "Gender Presentation",
  genderPresentationValue: "FEMALE",
  genderPresentationOptions,
  showCustomGenderPresentation: false,
  customGenderPresentationLabel: "Custom Gender Presentation",
  customGenderPresentationValue: "",
  colorPaletteValue: "CRESTFALL_DEFAULT",
  roleArchetypeValue: "ARTIFICER",
  creationTypeLabel: "Creation Type",
  creationTypeValue: "CHARACTER",
  onChangeCharacterName: null,
  onChangeCharacterTitle: null,
  onSelectSpecies: null,
  onChangeCustomSpecies: null,
  onSelectRenderingStyle: null,
  onSelectDefaultImagePreset: null,
  onChangeAge: null,
  onCommitAge: null,
  onSelectGenderPresentation: null,
  onChangeCustomGenderPresentation: null,
};

export const characterIdentitySectionDefaultFixture = {
  ...baseFixture,
};

export const characterIdentitySectionCustomIdentityFixture = {
  ...baseFixture,
  characterNameValue: "Aster Vale",
  speciesValue: "CUSTOM",
  showCustomSpecies: true,
  customSpeciesValue: "Prism-Born",
  genderPresentationValue: "CUSTOM",
  showCustomGenderPresentation: true,
  customGenderPresentationValue: "Androgynous",
  renderingStyleValue: "REALISTIC",
};

export const characterIdentitySectionFallbackFixture = {
  ...baseFixture,
  characterNameValue: "Untitled Character",
  characterTitleValue: "",
  speciesValue: "",
  renderingStyleValue: "EITHER",
  defaultImagePresetValue: "AUTO",
  ageValue: "",
  genderPresentationValue: "",
  colorPaletteValue: "CRESTFALL_DEFAULT",
  roleArchetypeValue: "",
  creationTypeValue: "",
};

export const characterIdentitySectionMinimumAgeFixture = {
  ...baseFixture,
  characterNameValue: "Adult Character",
  ageValue: "18",
};

export const characterIdentitySectionLongContentFixture = {
  ...baseFixture,
  characterNameValue:
    "Seraphina Valecourt, Keeper of the Seventh Archive",
  characterTitleValue:
    "Grand Arbiter of the Lantern Courts and Warden of the Northroad Compact",
  sectionDescription:
    "Preview the portable identity layout with long character and title content while keeping every application storage rule outside the View.",
};

export const characterIdentitySectionNoOptionsFixture = {
  ...baseFixture,
  speciesOptions: [],
  renderingStyleOptions: [],
  defaultImagePresetOptions: [],
  genderPresentationOptions: [],
};

export const characterIdentitySectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeCharacterName: null,
  onChangeCharacterTitle: null,
  onSelectSpecies: null,
  onChangeCustomSpecies: null,
  onSelectRenderingStyle: null,
  onSelectDefaultImagePreset: null,
  onChangeAge: null,
  onCommitAge: null,
  onSelectGenderPresentation: null,
  onChangeCustomGenderPresentation: null,
};
