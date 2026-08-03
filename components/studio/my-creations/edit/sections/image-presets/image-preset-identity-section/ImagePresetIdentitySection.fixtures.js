const baseFixture = {
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Preset Identity",
  sectionDescription:
    "Define what this image preset is, how it should be categorized, and how it may be reused as an Image Studio style ingredient.",
  nameLabel: "Preset Name",
  nameValue: "Painterly Moonlit Fantasy",
  categoryLabel: "Style Family / Category",
  categoryValue: "Painterly Fantasy",
  intendedUseLabel: "Intended Use",
  intendedUseValue: "Character portraits, enchanted locations, and story scenes",
  tagsLabel: "Tags",
  tagsValue: "painterly, fantasy, moonlight, atmospheric",
  creationTypeLabel: "Creation Type",
  creationTypeValue: "IMAGE_PRESET",
  onChangeName: null,
  onChangeCategory: null,
  onChangeIntendedUse: null,
  onChangeTags: null,
};

export const imagePresetIdentitySectionDefaultFixture = {
  ...baseFixture,
};

export const imagePresetIdentitySectionEmptyFixture = {
  ...baseFixture,
  nameValue: "",
  categoryValue: "",
  intendedUseValue: "",
  tagsValue: "",
};

export const imagePresetIdentitySectionTitleFallbackFixture = {
  ...baseFixture,
  nameValue: "Untitled Image Preset Draft",
  categoryValue: "Cinematic Illustration",
  intendedUseValue: "General-purpose visual development",
  tagsValue: "cinematic, illustration, general",
};

export const imagePresetIdentitySectionLegacyStyleFamilyFixture = {
  ...baseFixture,
  nameValue: "Ink-Washed Chronicle",
  categoryValue: "Ink and Wash",
  intendedUseValue: "Historical scenes, journals, and illustrated lore",
  tagsValue: "ink, wash, parchment, historical",
};

export const imagePresetIdentitySectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Image Preset Identity for a Highly Detailed Cross-Genre Visual Style Ingredient",
  sectionDescription:
    "Define a reusable image preset whose identity must remain clear across character portraits, environments, cinematic scenes, catalogue images, concept art, and long-form visual storytelling workflows.",
  nameValue:
    "Luminous Nocturne Storybook Realism with Painterly Atmosphere and Elaborate Surface Detail",
  categoryValue:
    "Cross-Genre Painterly Realism, Cinematic Fantasy, and Illustrated Storybook Art Direction",
  intendedUseValue:
    "Character portraits, sweeping environments, magical interiors, cinematic dialogue scenes, visual-development sheets, and richly detailed narrative illustrations",
  tagsValue:
    "painterly, realistic fantasy, cinematic, storybook, luminous, nocturne, atmospheric, detailed, character portrait, environment",
};

export const imagePresetIdentitySectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Image Studio Ingredient",
  sectionTitle: "Discovery Identity",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  nameLabel: "Display Name",
  categoryLabel: "Style Collection",
  intendedUseLabel: "Recommended Usage",
  tagsLabel: "Discovery Tags",
};

export const imagePresetIdentitySectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeName: null,
  onChangeCategory: null,
  onChangeIntendedUse: null,
  onChangeTags: null,
};
