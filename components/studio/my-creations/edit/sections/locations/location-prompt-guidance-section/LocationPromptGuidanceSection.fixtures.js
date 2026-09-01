const sharedCopy = {
  sectionEyebrow: "Location Editor",
  sectionTitle: "Prompt Guidance",
  sectionDescription:
    "Edit the reusable image-generation guidance this location contributes when selected in Image Studio.",
  promptGuidanceLabel: "Prompt Guidance",
  promptGuidancePlaceholder:
    "Reusable image-generation wording for this location.",
  imagePromptLabel: "Standalone Image Prompt",
  imagePromptPlaceholder:
    "Optional standalone prompt for generating environment, catalogue, or reference images of this location as its own visual asset. Max 2,000 characters.",
  imagePromptMaxLength: 2000,
  negativePromptLabel: "Negative Prompt",
  negativePromptPlaceholder:
    "Optional negatives this location should contribute when selected in image generation. Example: no modern electronics, no empty white room, no outdoor scene. Max 300 characters.",
  negativePromptMaxLength: 300,
  usageNotesLabel: "Usage Notes",
  usageNotesPlaceholder:
    "When should this location be used? What scenes, characters, moods, or image presets does it support?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, poses, outfits, image presets, or story moods.",
  registryNotesLabel: "Future Registry Notes",
  registryNotesPlaceholder:
    "Optional notes for future Location Registry links. This visual asset can describe how a registry location should look.",
};

export const locationPromptGuidanceCompleteFixture = Object.freeze({
  ...sharedCopy,
  promptGuidanceValue:
    "Interior of a warm Aethelgard artificer workshop with brass tools, dark wood counters, arched windows, and controlled magical light.",
  imagePromptValue:
    "Highly detailed fantasy artificer workshop, warm brass lamps, polished dark wood, locked glass cases, arcane tools, rain-muted city windows.",
  negativePromptValue:
    "modern electronics, empty white room, outdoor wilderness, sterile laboratory",
  usageNotesValue:
    "Use for workshop mysteries, appraisals, trade-district scenes, and object-driven investigations.",
  compatibilityNotesValue:
    "Pairs well with artificers, merchants, urban fantasy presets, and close environmental framing.",
  registryNotesValue:
    "Future registry links may include nearby markets, workshop staff, guarded storage, and trade-district routes.",
});

export const locationPromptGuidanceLegacyFixture = Object.freeze({
  ...sharedCopy,
  promptGuidanceValue:
    "Legacy prompt fallback: moonlit archive corridors, black stone, suspended records, and narrow brass lights.",
  imagePromptValue: "",
  negativePromptValue: "",
  usageNotesValue: "",
  compatibilityNotesValue: "",
  registryNotesValue: "",
});

export const locationPromptGuidanceSparseFixture = Object.freeze({
  ...sharedCopy,
  promptGuidanceValue: "Rainy market street beneath layered awnings.",
  imagePromptValue: "",
  negativePromptValue: "neon signs",
  usageNotesValue: "Street-level travel and merchant scenes.",
  compatibilityNotesValue: "",
  registryNotesValue: "",
});

export const locationPromptGuidanceEmptyFixture = Object.freeze({
  ...sharedCopy,
  promptGuidanceValue: "",
  imagePromptValue: "",
  negativePromptValue: "",
  usageNotesValue: "",
  compatibilityNotesValue: "",
  registryNotesValue: "",
});
