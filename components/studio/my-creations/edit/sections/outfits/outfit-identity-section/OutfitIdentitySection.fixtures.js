const baseFixture = {
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Outfit Identity",
  sectionDescription:
    "Define what this outfit is, how it should be categorized, and where it belongs as a reusable visual asset.",
  nameLabel: "Outfit Name",
  nameValue: "Midnight Court Ensemble",
  categoryLabel: "Outfit Type / Category",
  categoryValue: "Formal Eveningwear",
  intendedUseLabel: "Intended Use",
  intendedUseValue: "Court scenes, galas, and diplomatic ceremonies",
  tagsLabel: "Tags",
  tagsValue: "formal, eveningwear, court, black velvet",
  creationTypeLabel: "Creation Type",
  creationTypeValue: "OUTFIT",
  onChangeName: null,
  onChangeCategory: null,
  onChangeIntendedUse: null,
  onChangeTags: null,
};

export const outfitIdentitySectionDefaultFixture = {
  ...baseFixture,
};

export const outfitIdentitySectionEmptyFixture = {
  ...baseFixture,
  nameValue: "",
  categoryValue: "",
  intendedUseValue: "",
  tagsValue: "",
};

export const outfitIdentitySectionTitleFallbackFixture = {
  ...baseFixture,
  nameValue: "Outfit Draft Title",
  categoryValue: "Travel Clothing",
  intendedUseValue: "Overland journeys and roadside scenes",
  tagsValue: "travel, layered, practical",
};

export const outfitIdentitySectionLegacyCategoryFixture = {
  ...baseFixture,
  nameValue: "Ashen Ranger Kit",
  categoryValue: "Field Gear",
  intendedUseValue: "Wilderness patrols and survival scenes",
  tagsValue: "ranger, field gear, leather, weathered",
};

export const outfitIdentitySectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Outfit Identity for an Elaborate Multi-Layered Ceremonial Wardrobe Asset",
  sectionDescription:
    "Define a reusable outfit whose identity must remain clear across detailed character portraits, cinematic scenes, layered garments, accessories, multiple settings, and long-form visual storytelling workflows.",
  nameValue:
    "The Grand Nocturne Embassy Ensemble with Layered Velvet, Silver Fastenings, and Ceremonial Outerwear",
  categoryValue:
    "Formal Multi-Layered Diplomatic Eveningwear and Ceremonial Court Attire",
  intendedUseValue:
    "Royal receptions, diplomatic negotiations, masked galas, formal portraits, political intrigue scenes, and high-detail fantasy image generation",
  tagsValue:
    "formal, diplomatic, ceremonial, velvet, silver, layered, eveningwear, court, gala, dark fantasy",
};

export const outfitIdentitySectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Wardrobe Asset",
  sectionTitle: "Discovery Identity",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  nameLabel: "Display Name",
  categoryLabel: "Library Category",
  intendedUseLabel: "Recommended Usage",
  tagsLabel: "Discovery Tags",
};

export const outfitIdentitySectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeName: null,
  onChangeCategory: null,
  onChangeIntendedUse: null,
  onChangeTags: null,
};
