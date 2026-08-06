const sharedFixture = Object.freeze({
  sectionEyebrow: "Character Template Editor",
  creationTypeValue: "CHARACTER_TEMPLATE",
  appliesToValue: "New characters only",
  speciesOptions: [
    { value: "", label: "Not chosen" },
    { value: "HUMAN", label: "Human" },
    { value: "KITSUNE", label: "Kitsune" },
  ],
  genderPresentationOptions: [
    { value: "", label: "Not chosen" },
    { value: "FEMALE", label: "Female" },
    { value: "ANDROGYNOUS", label: "Androgynous" },
  ],
  verbosityOptions: [
    { value: "", label: "Not chosen" },
    { value: "3", label: "3 · Balanced" },
    { value: "5", label: "5 · Highly Verbose" },
  ],
});

export const characterTemplateFieldsTemplateFixture = {
  ...sharedFixture,
  activeSection: "template",
  sectionTitle: "Template Info",
  sectionDescription:
    "Edit the reusable blueprint metadata shown in My Creations and template pickers.",
  templateNameValue: "Arcane Investigator",
  categoryValue: "Mystery",
  shortDescriptionValue:
    "A reusable blueprint for investigators who balance practical evidence with supernatural intuition.",
  shortDescriptionPlaceholder:
    "A short creator-facing summary of what this template helps create.",
  tagsValue: "investigation, arcane, urban fantasy",
};

export const characterTemplateFieldsIdentityFixture = {
  ...sharedFixture,
  activeSection: "identity",
  sectionTitle: "Identity Defaults",
  sectionDescription:
    "Edit optional defaults copied into the Identity step of new character creation.",
  defaultNameValue: "",
  defaultTitleValue: "The Quiet Witness",
  speciesValue: "HUMAN",
  genderPresentationValue: "ANDROGYNOUS",
};

export const characterTemplateFieldsAppearanceFixture = {
  ...sharedFixture,
  activeSection: "appearance",
  sectionTitle: "Appearance Defaults",
  sectionDescription:
    "Edit reusable visual defaults for new character drafts.",
  clothingStyleValue: "Practical city layers with one distinctive occult accessory.",
};

export const characterTemplateFieldsBodyFixture = {
  ...sharedFixture,
  activeSection: "body",
  sectionTitle: "Body Defaults",
  sectionDescription:
    "Edit optional physical silhouette defaults for new character drafts.",
  bodyNotesValue:
    "Balanced adult silhouette, steady posture, and hands marked by careful fieldwork.",
  bodyNotesPlaceholder:
    "Optional physical details that should affect image generation or narration.",
};

export const characterTemplateFieldsBehaviorFixture = {
  ...sharedFixture,
  activeSection: "behavior",
  sectionTitle: "Behavior Defaults",
  sectionDescription:
    "Edit optional defaults for personality, voice, movement, and interests.",
  verbosityValue: "3",
  philosophyValue:
    "Evidence matters, but the absence of evidence may itself be the most important clue.",
  philosophyPlaceholder: "What does this archetype believe about the world?",
};

export const characterTemplateFieldsMissingCallbacksFixture = {
  ...characterTemplateFieldsTemplateFixture,
  onChangeTemplateName: null,
  onChangeCategory: null,
  onChangeShortDescription: null,
  onChangeTags: null,
};
